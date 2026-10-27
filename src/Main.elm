module Main exposing (main)

import Browser
import Browser.Events
import Task
import Time
import File.Download as Download
import File exposing (File)
import File.Select as Select
import Random
import Html.Attributes exposing (..)
import Html exposing (..)
import Json.Decode as Decode
import JsonConverter exposing (..)
import Type exposing (..)
import View.Contents
import Domain.Helper exposing (..)
import Domain.AddItem exposing (..)
import Domain.Selector exposing (..)
import Domain.Guide exposing (defaultAppState)
import Init exposing (..)
import Ports exposing
    ( scrollToIndex
    , scrollToTop
    , incomingMsg
    , exportZip
    )


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = \model -> View.Contents.viewLayout model model.present
        }

init : Flags -> ( Model, Cmd Msg )
init flags =
    flags
        |> buildInitialModelFromFlags
        |> withoutCmd

-- init : Flags -> ( Model, Cmd Msg )
-- init flags =
--     let
--         initialSeed =
--             flags.seed
--                 |> List.head
--                 |> Maybe.withDefault 0
--                 |> Random.initialSeed

--         initialModel =
--             case Decode.decodeValue JsonConverter.decodeModel flags.storageData of
--                 Ok model ->
--                     { model | seed = initialSeed }

--                 Err _ ->
--                     flags.storageData
--                         |> restoreFallbackAppState
--                         |> initModelWithAppState initialSeed
--     in
--     ( initialModel, Cmd.none )


-- Model全体のデコード失敗時に、AppState単体での復元を試みる
restoreFallbackAppState : Decode.Value -> AppState
restoreFallbackAppState storageData =
    Decode.decodeValue (Decode.field "present" JsonConverter.decodeAppState) storageData
        |> Result.toMaybe
        |> Maybe.withDefault
            (Decode.decodeValue JsonConverter.decodeAppState storageData
                |> Result.withDefault defaultAppState
            )


-- MARK:UPDATE

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Undo ->
            model
                |> commitTypingSession  -- 入力中のセッションがあれば先に確定
                |> applyUndo
                |> notifyAndSave

        Redo ->
            model |> applyRedo |> notifyAndSave

        ChangeMainView viewMode ->
            ( { model | mainViewMode = viewMode }, Cmd.none )

        CreateShelf ->
            model
                |> createShelf
                |> notifyAndSave

        DeleteShelf shelfId ->
            model
                |> updatePresent (removeShelf shelfId)
                |> ensureSidebarTabOnEmpty
                |> notifyAndSave

        SelectShelf shelfId ->
            model
                |> applyShelfSelection shelfId
                |> (\m -> ( m, Cmd.none ))
        
        CreateBook ->
            model
                |> createBook
                |> notifyAndSave

        DeleteBook bookId ->
            model
                |> updatePresent (removeBookFromState bookId)
                |> notifyAndSave

        SelectBook bookId ->
            model
                |> applyBookSelection bookId
                |> notifyAndSaveWithCmd (scrollToTop ())

        CreatePage page ->
            model
                |> createPage page
                |> notifyAndSave

        CreateNextPage page ->
            model
                |> createNextPage page
                |> notifyAndSave

        DeletePage pageId ->
            model
                |> updatePresent (removeCurrentPage pageId)
                |> notifyAndSave

        SelectPage index ->
            model
                |> commitTypingSession
                |> applyPageSelection index
                |> notifyAndSaveWithCmd (scrollToTop ())

        DuplicatePage targetIndex ->
            model
                |> duplicatePageAt targetIndex
                |> notifyAndSave

        NextPage ->
            if hasNextPage model.present then
                model
                    |> applyPageSelection (model.present.currentPageIndex + 1)
                    |> notifyAndSaveWithCmd pageNavigationCmd

            else
                ( model, Cmd.none )

        PrevPage ->
            if hasPrevPage model.present then
                model
                    |> applyPageSelection (model.present.currentPageIndex - 1)
                    |> notifyAndSaveWithCmd pageNavigationCmd

            else
                ( model, Cmd.none )

        ChangeMode newMode ->
            applyChangeMode newMode model

        ChangeSidebarTab tab ->
            { model | sidebarTab = tab }
                |> notifyAndSave

        EditorInput content ->
            model
                |> registerEditorInput content
                |> notifyAndScheduleDebounce

        UpdateSearchText text ->
            ( { model | searchText = text }, Cmd.none )

        ChangeColorTheme theme ->
            model
                |> applyColorTheme theme
                |> notifyAndSave

        ChangeRenderStyle styleStr ->
            model
                |> applyRenderStyle styleStr
                |> notifyAndSave

        JumpToHeading index anchor ->
            model
                |> applyPageSelection index
                |> setMainViewMode PageView
                |> setMode ViewMode
                |> notifyAndSaveWithCmd (scrollToIndex anchor)

        Reorder target from to ->
            ( applyReorder target from to model, Cmd.none )

        ReorderPages oldIndex newIndex ->
            model
                |> updatePresent (reorderPagesInCurrentBook oldIndex newIndex)
                |> notifyAndSave

        RequestImport target ->
            ( model
            , Select.files 
                [ "application/json", ".json" ] 
                (\first rest -> JsonFilesSelected target (first :: rest))
            )
        
        RequestPageImport ->
            ( model
            , Select.file [ "text/plain", "text/markdown", ".txt", ".md" ] PageFileSelected
            )

        PageContentLoaded fileName content ->
            processPageContent fileName content model

        PageFileSelected file ->
            ( model
            , Task.perform (PageContentLoaded (File.name file)) (File.toString file)
            )

        JsonFilesSelected target files ->
            let
                readCmds =
                    List.map
                        (\file ->
                            Task.perform
                                (JsonFileRead (Just target) (File.name file))
                                (File.toString file)
                        )
                        files
            in
            ( model, Cmd.batch readCmds )

        JsonFileRead maybeTarget fileName content ->
            handleJsonContent maybeTarget fileName content model

        -- ドラッグ＆ドロップ
        FilesDropped files ->
            handleFilesDropped files model

        ExportData ->
            ( model
            , Task.perform ExportDataWithTime (Task.map2 Tuple.pair Time.here Time.now)
            )
        
        ExportDataWithTime ( zone, time ) ->
            let
                fileName =
                    formatBackupFileName zone time

                jsonString =
                    JsonConverter.encodeExportAll model
            in
            ( model, Download.string fileName "application/json" jsonString )

        DismissAlert ->
            ( { model | modalAlert = Nothing }, Cmd.none )

        ExportPage extension ->
            ( model, applyExportPage extension model.present )
        
        ChangeFontSize sizeStr ->
            model
                |> applyFontSize sizeStr
                |> notifyAndSave
        
        OnScroll id vp ->
            if id == "editor-area" then
                ( { model | scrollRatio = vp.viewport.y }, Cmd.none )
            else
                ( calculateScroll id vp model, Cmd.none )

        DragStart target index ->
            ( { model | draggingState = Just { target = target, fromIndex = index, overIndex = index } }
            , Cmd.none
            )

        DragOver index ->
            let
                nextState =
                    model.draggingState
                        |> Maybe.map (\s -> { s | overIndex = index })
            in
            ( { model | draggingState = nextState }, Cmd.none )

        DragEnd ->
            ( { model | draggingState = Nothing }, Cmd.none )

        ExportBookZip bookId->
            ( model, exportBookById bookId model.present )
        
        ExportBookJson book ->
            let
                jsonString =
                    JsonConverter.encodeExportBook book

                fileName =
                    "Pumice-book-" ++ (if String.isEmpty book.title then "export" else book.title) ++ ".json"
            in
            ( model, Download.string fileName "application/json" jsonString )

        ExportShelfZip shelfId ->
            ( model, exportShelfById shelfId model.present.shelves )

        ExportShelfJson shelf ->
            let
                jsonString =
                    JsonConverter.encodeExportShelf shelf

                fileName =
                    "Pumice-category-" ++ (if String.isEmpty shelf.name then "export" else shelf.name) ++ ".json"
            in
            ( model, Download.string fileName "application/json" jsonString )

        ExportAllZip ->
            ( model, exportZip (fullLibraryPayload model.present.shelves) )

        EditBegin target id initialValue ->
            ( { model | editing = Just { target = target, id = id, value = initialValue } }, Cmd.none )

        EditUpdate newValue ->
            ( { model | editing = Maybe.map (\e -> { e | value = newValue }) model.editing }, Cmd.none )

        EditSubmit ->
            case model.editing of
                Just buffer ->
                    model
                        |> applyEdit (normalizeEditBuffer buffer)

                Nothing ->
                    ( model, Cmd.none )
            
        EditCancel ->
            ( { model | editing = Nothing }, Cmd.none )
        
        SetVisibleHeadingLevel level ->
            ( { model | visibleHeadingLevel = level }, Cmd.none )
        
        SetContentWidth newWidth ->
            ( { model | contentWidth = newWidth }, Cmd.none )

        ToggleMenu menuId ->
            let
                next =
                    if model.openMenuId == Just menuId then
                        Nothing
                    else
                        Just menuId
            in
            ( { model | openMenuId = next }, Cmd.none )

        CloseMenu ->
            ( { model | openMenuId = Nothing }, Cmd.none )
        
        ToggleNormalSidebar ->
            model
                |> toggleNormalSidebar
                |> notifyAndSave

        ToggleLeftSidebar ->
            model
                |> toggleLeftSidebar
                |> notifyAndSave

        OpenRightSideWindow ->
            model
                |> setRightSideWindowVisible True
                |> notifyAndSave

        CloseRightSideWindow ->
            model
                |> setRightSideWindowVisible False
                |> notifyAndSave
        
        AddGuideShelf ->
            model
                |> addGuideShelf
                |> notifyAndSave

        SelectMenuItem actionMsg ->
            let
                -- 1. メニューを閉じた状態のモデル
                closedModel =
                    { model | openMenuId = Nothing }

                -- 2. 本来のアクションを実行
                ( newModel, cmd ) =
                    update actionMsg closedModel
            in
            ( newModel, cmd )

        ResetApp ->
            ( model
            , Task.perform ResetAppWithTime (Task.map2 Tuple.pair Time.here Time.now)
            )

        ResetAppWithTime ( zone, time ) ->
            resetWithBackup zone time model
        
        CommitTypingSession counter ->
            model
                |> applySessionCommitIfValid counter
                |> withoutCmd

        NoOp ->
            ( model, Cmd.none )


-- MARK:subscriptions

subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onKeyDown keyDecoder 
        , incomingMsg decodeIncomingMsg
        ]

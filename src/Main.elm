module Main exposing (main)

import Browser
import Browser.Events
import Browser.Dom
import Task
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
    , triggerDownload
    , fileDropped
    , incomingMsg
    , fileContentReceiver
    , exportZip
    , requestFileImport, requestPageImport, pageFileSelected
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
    let
        initialSeed =
            flags.seed
                |> List.head
                |> Maybe.withDefault 0
                |> Random.initialSeed

        initialModel =
            case Decode.decodeValue JsonConverter.decodeModel flags.storageData of
                Ok model ->
                    { model | seed = initialSeed }

                Err _ ->
                    flags.storageData
                        |> restoreFallbackAppState
                        |> initModelWithAppState initialSeed
    in
    ( initialModel, Cmd.none )


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
            model |> applyUndo |> notifyAndSave

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
            ( model |> setMode newMode
            , modeTransitionCmd newMode model.scrollRatio
            )

        ChangeSidebarTab tab ->
            ( { model | sidebarTab = tab }, Cmd.none )

        EditorInput content ->
            model
                |> updatePresent (updateCurrentPageContent content)
                |> notifyAndSave

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
            ( model, requestFileImport (importTargetToString target) )
        
        RequestPageImport ->
            ( model, requestPageImport () )

        PageFileSelected value ->
            processFileDrop value model

        ImportBook newId importedBook ->
            case model.mainViewMode of
                ShelfDetailView _ ->
                    model
                        |> addImportedBook newId importedBook
                        |> notifyAndSave
                _ ->
                    ( model, Cmd.none )

        ImportShelf newId importedShelf ->
            case model.mainViewMode of
                ShelfListView ->
                    model
                        |> addImportedShelf newId importedShelf
                        |> notifyAndSave
                _ ->
                    ( model, Cmd.none )

        ImportData jsonString ->
            model
                |> processImportedString jsonString
                |> Result.map notifyAndSave
                |> Result.withDefault ( model, Cmd.none )

        ExportData ->
            ( model, triggerDownload (JsonConverter.encodeModel model) )
        
        ChangeExportFormat formatStr ->
            ( { model | exportFormat = stringToExportFormat formatStr }, Cmd.none )
        
        ExportPage extension ->
            ( model, applyExportPage extension model.present )
        
        FileDropped value ->
            handleFileDropped value model

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
                jsonString = JsonConverter.encodeExportBook book
            in
            ( model, triggerDownload jsonString )

        ExportShelfZip shelfId ->
            ( model, exportShelfById shelfId model.present.shelves )

        ExportShelfJson shelf ->
            let
                jsonString = JsonConverter.encodeExportShelf shelf
            in
            ( model, triggerDownload jsonString )

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

        ToggleSidebarOverlay ->
            ( { model | isSidebarOverlaid = not model.isSidebarOverlaid }, Cmd.none )
        
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
                |> withoutCmd

        ToggleLeftSidebar ->
            model
                |> toggleLeftSidebar
                |> withoutCmd

        OpenRightSideWindow ->
            ( setRightSideWindowVisible True model, Cmd.none )

        CloseRightSideWindow ->
            ( setRightSideWindowVisible False model, Cmd.none )
        
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
            model |> resetWithBackup

        NoOp ->
            ( model, Cmd.none )


-- MARK:subscriptions

subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onKeyDown keyDecoder 
        , fileDropped FileDropped
        , incomingMsg decodeIncomingMsg
        , fileContentReceiver ImportData
        , pageFileSelected PageFileSelected
        ]

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
import Ports exposing
    ( syncScroll
    , scrollToIndex
    , scrollToTop
    , triggerDownload
    , fileDropped
    , incomingMsg
    , fileContentReceiver
    , exportFile
    , exportZip
    , requestFileImport, requestPageImport, pageFileSelected
    )

-- MAIN

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
        initialModel =
            case Decode.decodeValue JsonConverter.decodeModel flags.storageData of
                Ok model ->
                    -- 既に保存された Model がある場合はそれを使用
                    model

                Err _ ->
                    -- Modelとしてのデコードに失敗した場合は、AppStateのみ復元して初期UIを組み立てる
                    let
                        appState =
                            Decode.decodeValue (Decode.field "present" JsonConverter.decodeAppState) flags.storageData
                                |> Result.toMaybe
                                |> Maybe.withDefault
                                    (Decode.decodeValue JsonConverter.decodeAppState flags.storageData
                                        |> Result.withDefault defaultAppState
                                    )
                    in
                    { past = []
                    , present = appState
                    , future = []
                    , seed = Random.initialSeed 0
                    , mainViewMode = PageView
                    , mode = ViewMode
                    , sidebarTab = TocTab
                    , sidebarMode = NormalSidebar
                    , searchText = ""
                    , editing = Nothing
                    , fontSize = Medium
                    , colorTheme = Light
                    , renderStyle = Standard
                    , scrollRatio = 0
                    , headingPositions = []
                    , draggingState = Nothing
                    , pageCreationBuffer = []
                    , pageCreationTitle = ""
                    , visibleHeadingLevel = H3
                    , contentWidth = Wide
                    , isSidebarOverlaid = False
                    , isRightSideWindowVisible = True
                    , exportFormat = FormatTxt
                    , openMenuId = Nothing
                    }
        
        initialSeed =
            flags.seed
                |> List.head
                |> Maybe.withDefault 0
                |> Random.initialSeed

    in
    ( { initialModel | seed = initialSeed }, Cmd.none )


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
            let
                nextMode =
                    if model.sidebarMode == NormalSidebar then
                        OverlaySidebar

                    else
                        NormalSidebar
            in
            ( { model | sidebarMode = nextMode }, Cmd.none )

        ToggleLeftSidebar ->
            let
                nextMode =
                    if model.sidebarMode == LeftSidebar then
                        OverlaySidebar

                    else
                        LeftSidebar
            in
            ( { model | sidebarMode = nextMode }, Cmd.none )

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

        NoOp ->
            ( model, Cmd.none )


-- MARK: HELPER

-- AppState を更新し、履歴を保存
updatePresent : (AppState -> AppState) -> Model -> Model
updatePresent updater model =
    updateAppState (updater model.present) model


-- 本データを本棚に追加し、履歴を保存
addImportedBook : String -> Book -> Model -> Model
addImportedBook newId importedBook =
    updatePresent (appendBookData { importedBook | id = newId })


-- 本棚データを追加し、履歴を保存
addImportedShelf : String -> Shelf -> Model -> Model
addImportedShelf newId importedShelf =
    updatePresent (appendShelfData { importedShelf | id = newId })


applyImportedModel : Model -> Model -> Model
applyImportedModel prevModel importedModel =
    let
        historyModel =
            pushToHistory prevModel
    in
    { importedModel
        | past = historyModel.past
        , present = importedModel.present
        , future = []
    }


processImportedString : String -> Model -> Result Decode.Error Model
processImportedString jsonString currentModel =
    jsonString
        |> Decode.decodeString JsonConverter.decodeModel
        |> Result.map (applyImportedModel currentModel)


ensureSidebarTabOnEmpty : Model -> Model
ensureSidebarTabOnEmpty model =
    if List.isEmpty model.present.shelves then
        { model | sidebarTab = ShelfListTab }
    else
        model


applyEdit : EditBuffer -> Model -> ( Model, Cmd Msg )
applyEdit buffer model =
    model
        |> updatePresent (updateTitleByBuffer buffer)
        |> clearEditing
        |> notifyAndSave


{-| 編集ターゲット（本棚か本か）に応じて AppState のタイトルを更新する -}
updateTitleByBuffer : EditBuffer -> AppState -> AppState
updateTitleByBuffer buffer state =
    case buffer.target of
        ShelfTitle ->
            updateShelfTitle buffer.id buffer.value state

        BookTitle ->
            updateBookTitle buffer.id buffer.value state

clearEditing : Model -> Model
clearEditing model =
    { model | editing = Nothing }

-- AppState内の指定した本棚のタイトルを更新する
updateShelfTitle : String -> String -> AppState -> AppState
updateShelfTitle shelfId newTitle state =
    let
        updateFn shelf =
            if shelf.id == shelfId then
                { shelf | name = newTitle }
            else
                shelf
    in
    { state | shelves = List.map updateFn state.shelves }

-- AppState内の指定した本のタイトルを更新する
updateBookTitle : String -> String -> AppState -> AppState
updateBookTitle bookId newTitle state =
    let
        -- 各本棚の中の「本リスト」に対して更新をかける
        updateBookInList book =
            if book.id == bookId then
                { book | title = newTitle }
            else
                book

        updateShelf shelf =
            { shelf | books = List.map updateBookInList shelf.books }
    in
    { state | shelves = List.map updateShelf state.shelves }

-- 指定された ID のブックを探してエクスポート用コマンドを発行する
exportBookById : String -> AppState -> Cmd Msg
exportBookById bookId state =
    state.shelves
        |> List.concatMap .books
        |> List.filter (\b -> b.id == bookId)
        |> List.head
        |> Maybe.map (bookZipPayload >> exportZip)
        |> Maybe.withDefault Cmd.none

-- IDから本棚を探し、存在すれば ZIP コマンドを発行する
exportShelfById : String -> List Shelf -> Cmd Msg
exportShelfById shelfId shelves =
    shelves
        |> List.filter (\s -> s.id == shelfId)
        |> List.head
        |> Maybe.map (shelfZipPayload >> exportZip)
        |> Maybe.withDefault Cmd.none

applyExportPage : String -> AppState -> Cmd Msg
applyExportPage extension state =
    case getCurrentPage state of
        Just page ->
            let
                fileName =
                    page.title ++ "." ++ extension
            in
            -- 新しく作成するポートを呼び出す
            exportFile { fileName = fileName, content = page.content }

        Nothing ->
            Cmd.none


-- MARK:スクロール同期
-- スクロール位置から比率を計算
calculateScroll : String -> Browser.Dom.Viewport -> Model -> Model
calculateScroll _ vp model =
    let
        maxScroll =
            vp.scene.height - vp.viewport.height

        newRatio =
            if maxScroll <= 0 then
                0
            else
                vp.viewport.y / maxScroll
    in
    { model | scrollRatio = newRatio }


-- 閲覧画面を指定された比率までスクロールさせるコマンド
syncViewerScroll : Float -> Cmd Msg
syncViewerScroll ratio =
    Browser.Dom.getViewportOf "page-view-area"
        |> Task.andThen
            (\vp ->
                let
                    maxScroll =
                        vp.scene.height - vp.viewport.height
                in
                Browser.Dom.setViewportOf "page-view-area" 0 (ratio * maxScroll)
            )
        |> Task.attempt (\_ -> NoOp)

{-| モード変更に伴う非対称な副作用（スクロール同期とフォーカス）を一元管理するコマンド生成関数 -}
modeTransitionCmd : Mode -> Float -> Cmd Msg
modeTransitionCmd newMode scrollRatio =
    case newMode of
        EditMode ->
            -- 閲覧 → 編集: JSポートへ比率を送り、エディタにフォーカスを当てる
            Cmd.batch
                [ syncScroll { targetId = "editor-area", ratio = scrollRatio }
                , focusEditor
                ]

        ViewMode ->
            -- 編集 → 閲覧: Elmネイティブの Browser.Dom でプレビュー画面のスクロールを復元
            syncViewerScroll scrollRatio

        ReorderMode ->
            Cmd.none


-- MARK:UNDO
applyUndo : Model -> Model
applyUndo model =
    case model.past of
        prev :: rest ->
            { model
                | past = rest
                , present = prev
                , future = model.present :: model.future
            }

        [] ->
            model

applyRedo : Model -> Model
applyRedo model =
    case model.future of
        next :: rest ->
            { model
                | past = List.take 100 (model.present :: model.past)
                , present = next
                , future = rest
            }

        [] ->
            model


-- 指定された本棚を選択し、画面表示を本棚詳細に切り替えます
applyShelfSelection : String -> Model -> Model
applyShelfSelection shelfId model =
    let
        oldPresent =
            model.present
    in
    { model
        | present = { oldPresent | currentShelfId = shelfId }
        , mainViewMode = ShelfDetailView shelfId
        , sidebarTab = BookListTab
    }


{-| 指定された本を選択し、初期状態として1ページ目を表示する設定を行います -}
applyBookSelection : String -> Model -> Model
applyBookSelection bookId model =
    let
        present =
            model.present

        basePresent =
            { present
                | currentBookId = Just bookId
                , currentPageIndex = 0
            }

        newPresent =
            applyPageChange 0 basePresent
    in
    { model
        | present = newPresent
        , mainViewMode = PageView
        , mode = ViewMode
        , sidebarTab = TocTab
        , scrollRatio = 0
    }

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

module Main exposing (main)

import Browser
import Browser.Events
import Browser.Dom
import Task
import Dict exposing (Dict)
import Random
import Uuid.Barebones exposing (uuidStringGenerator)
import Html.Attributes exposing (..)
import Html exposing (..)
import Json.Decode as Decode
import JsonConverter exposing (..)
import Type exposing (..)
import View.Contents
import Domain.Helper exposing (..)
import Domain.AddItem exposing (..)
import Domain.Selector exposing (..)
import Ports exposing
    ( saveToStorage
    , syncScroll
    , scrollToIndex
    , scrollToTop
    , triggerDownload
    , fileDropped
    , incomingMsg
    , requestCreate
    , pageChanged
    , fileContentReceiver
    , exportFile
    , exportZip
    , requestFileImport
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
        -- 1. 完全にデータがない、またはデコード失敗時のデフォルトデータ（AppState）
        defaultAppState =
            { shelves = [ { id = "default-shelf", name = "New Shelf", books = [] } ]
            , currentShelfId = "default-shelf"
            , currentBookId = Nothing
            , currentPageIndex = 0
            , currentHeading = []
            }

        -- 2. デコードの試行
        -- Model 全体としての復元を試みる（履歴や設定も含む）
        -- 失敗した場合は AppState 単体として復元を試みる
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
                    , mainViewMode = ShelfListView
                    , mode = ViewMode
                    , sidebarTab = ShelfListTab
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
                    , exportFormat = FormatTxt
                    , openExportMenuId = Nothing
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
            appendShelfAndSave model

        DeleteShelf shelfId ->
            model.present
                |> removeShelf shelfId
                |> (\state -> updateAppState state model)
                |> ensureSidebarTabOnEmpty
                |> notifyAndSave

        SelectShelf shelfId ->
            model
                |> applyShelfSelection shelfId
                |> (\m -> ( m, Cmd.none ))
        
        CreateBook ->
            let
                ( newId, nextSeed ) =
                    Random.step uuidStringGenerator model.seed

                newModel =
                    { model | seed = nextSeed }
            in
            appendBookAndSave newId newModel

        DeleteBook bookId ->
            model.present
                |> removeBookFromState bookId
                |> (\state -> updateAppState state model)
                |> notifyAndSave

        SelectBook bookId ->
            model
                |> applyBookSelection bookId
                |> notifyAndSaveWithCmd (scrollToTop ())

        CreatePage page ->
            createPage page model
                |> notifyAndSave

        CreateNextPage page ->
            let
                newModel =
                    createPage page model

                newPresent =
                    newModel.present
            in
            { newModel
                | present =
                    { newPresent | currentPageIndex = page }
                , mode = EditMode
            }
                |> notifyAndSave

        -- RequestCreatePageFromClipboard ->
        --     -- JS側で処理が走るため、Elm側では何もしない
        --     ( model, Cmd.none )

        DeletePage pageId ->
            model.present
                |> removeCurrentPage pageId
                |> (\state -> updateAppState state model)
                |> notifyAndSave

        SelectPage index ->
            model
                |> applyPageSelection index
                |> (\m -> { m | scrollRatio = 0 })
                |> notifyAndSaveWithCmd (scrollToTop ())

        NextPage ->
            model
                |> applyNextPage
                |> (\( m, cmd ) -> ( m, cmd ))

        PrevPage ->
            model
                |> applyPrevPage
                |> (\( m, cmd ) -> ( m, cmd ))

        ChangeMode newMode ->
            let
                ( nextModel, nextCmd ) =
                    model |> applyModeChange newMode

                syncCmd =
                    case newMode of
                        EditMode ->
                            syncScroll { targetId = "editor-area", ratio = nextModel.scrollRatio }
                        ViewMode ->
                            Browser.Dom.getViewportOf "page-view-area"
                                |> Task.andThen
                                    (\vp ->
                                        let
                                            maxScroll =
                                                vp.scene.height - vp.viewport.height
                                        in
                                        Browser.Dom.setViewportOf "page-view-area" 0 (nextModel.scrollRatio * maxScroll)
                                    )
                                |> Task.attempt (\_ -> NoOp)
                        _ ->
                            Cmd.none
            in
            ( nextModel
            , Cmd.batch
                [ nextCmd
                , syncCmd
                , if newMode == EditMode then
                    focusEditor
                  else
                    Cmd.none
                ]
            )

        ChangeSidebarTab tab ->
            ( { model | sidebarTab = tab }, Cmd.none )

        UpdateShelfName shelfId newName ->
            model
                |> renameShelfInState shelfId newName
                |> (\m -> ( m, Cmd.none ))

        UpdateContent content ->
            let
                ( newModel, cmd ) =
                    model.present
                        |> updateCurrentPageContent content
                        |> (\state -> updateAppState state model)
                        |> notifyAndSave
            in
            ( newModel, Cmd.batch [ cmd ] )

        UpdateSearchText text ->
            ( { model | searchText = text }, Cmd.none
            --, delaySearch 500 -- 500ms待ってから何かを実行するCmd（必要なら）
            )

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
                |> (\m -> { m | mainViewMode = PageView, mode = ViewMode })
                |> notifyAndSaveWithCmd 
                    (Cmd.batch [ scrollToIndex anchor ])
                    --(Cmd.batch [ scrollToTop (), scrollToIndex anchor ])

        Reorder target from to ->
            ( applyReorder target from to model, Cmd.none )

        ReorderPages oldIndex newIndex ->
            model.present
                |> reorderPagesInCurrentBook oldIndex newIndex
                |> (\state -> updateAppState state model)
                |> notifyAndSave

        -- RequestImport ->
        --     ( model, requestFileImport () )
        
        RequestImport target ->
            ( model, requestFileImport (importTargetToString target) )

        ImportBook newId importedBook ->
            case model.mainViewMode of
                ShelfDetailView _ ->
                    -- 本棚詳細画面（本の一覧）の時のみ受け入れる
                    let
                        newBook = { importedBook | id = newId }
                        ( newModel, saveCmd ) =
                            model.present
                                |> appendBookData newBook
                                |> (\state -> updateAppState state model)
                                |> notifyAndSave
                    in
                    ( newModel, saveCmd )

                _ ->
                    -- それ以外の画面では無視
                    ( model, Cmd.none )

        ImportShelf newId importedShelf ->
            case model.mainViewMode of
                ShelfListView ->
                    -- 本棚一覧画面の時のみ受け入れる
                    let
                        newShelf = { importedShelf | id = newId }
                        ( newModel, saveCmd ) =
                            model.present
                                |> appendShelfData newShelf
                                |> (\state -> updateAppState state model)
                                |> notifyAndSave
                    in
                    ( newModel, saveCmd )

                _ ->
                    -- それ以外の画面では無視
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
            -- ページの書き出し処理をヘルパーへ委譲
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
                    let
                        -- 空白を除去して判定
                        trimmedValue =
                            String.trim buffer.value

                        -- 本のタイトルの場合は空チェックを行う
                        finalValue =
                            if buffer.target == BookTitle && String.isEmpty trimmedValue then
                                "無題の本"
                            else if buffer.target == ShelfTitle && String.isEmpty trimmedValue then
                                "無題の本棚"
                            else
                                buffer.value

                        -- 値を差し替えたバッファで更新処理を実行
                        updatedBuffer =
                            { buffer | value = finalValue }
                    in
                    applyEdit updatedBuffer model
                    
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
        
        ToggleExportMenu menuId ->
            let
                nextId =
                    if model.openExportMenuId == Just menuId then
                        Nothing
                    else
                        Just menuId
            in
            ( { model | openExportMenuId = nextId }, Cmd.none )

        CloseExportMenu ->
            ( { model | openExportMenuId = Nothing }, Cmd.none )
        
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

        -- ToggleOverlaySidebar ->
        --     let
        --         nextMode =
        --             if model.sidebarMode == OverlaySidebar then
        --                 HiddenSidebar

        --             else
        --                 OverlaySidebar
        --     in
        --     ( { model | sidebarMode = nextMode }, Cmd.none )

        NoOp ->
            ( model, Cmd.none )


-- MARK: HELPER

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


pushToHistory : Model -> Model
pushToHistory model =
    updateAppState model.present model


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
    let
        -- 1. ターゲットに応じて AppState を書き換える
        updatedState =
            case buffer.target of
                ShelfTitle ->
                    updateShelfTitle buffer.id buffer.value model.present

                BookTitle ->
                    updateBookTitle buffer.id buffer.value model.present

        -- 2. 状態を確定させて保存（共通フロー）
        ( finalModel, saveCmd ) =
            updatedState
                |> (\state -> updateAppState state model)
                |> (\m -> { m | editing = Nothing }) -- 編集モードを終了
                |> notifyAndSave
    in
    ( finalModel, saveCmd )

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


-- MARK:ページ切り替え
applyPrevPage : Model -> ( Model, Cmd Msg )
applyPrevPage model =
    let
        present = model.present
    in
    if present.currentPageIndex > 0 then
        let
            prevIndex =
                present.currentPageIndex - 1
        in
        model
            |> applyPageSelection prevIndex
            |> notifyAndSaveWithCmd (scrollToTop ())

    else
        ( model, Cmd.none )


-- 次のページが存在するかを確認し、存在する場合はページ選択処理を実行
applyNextPage : Model -> ( Model, Cmd Msg )
applyNextPage model =
    let
        present = model.present
    in
    case getCurrentBook present of
        Just book ->
            if present.currentPageIndex < List.length book.pages - 1 then
                -- 内部でSelectPageのロジックを再利用
                let
                    nextIndex =
                        present.currentPageIndex + 1
                in
                model
                    |> applyPageSelection nextIndex
                    |> notifyAndSaveWithCmd (scrollToTop ())
            else
                ( model, Cmd.none )

        Nothing ->
            ( model, Cmd.none )


-- 指定されたインデックスのページを表示するようにモデルを更新します
applyPageSelection : Int -> Model -> Model
applyPageSelection index model =
    let
        newPresent = applyPageChange index model.present
    in
    { model | present = newPresent, scrollRatio = 0 }







-- 本棚の名前を更新します
renameShelfInState : String -> String -> Model -> Model
renameShelfInState shelfId newName model =
    let
        oldPresent = model.present
        newShelves =
            List.map
                (\shelf ->
                    if shelf.id == shelfId then
                        { shelf | name = newName }
                    else
                        shelf
                )
                oldPresent.shelves

        newPresent = { oldPresent | shelves = newShelves }
    in
    { model | present = newPresent }


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


{-| モード変更と、それに伴うスクロール位置の同期コマンドを生成します -}

applyModeChange : Mode -> Model -> ( Model, Cmd Msg )
applyModeChange newMode model =
    let
        newModel = { model | mode = newMode }
        syncCmd =
            case newMode of
                EditMode ->
                    syncScroll { targetId = "editor-area", ratio = model.scrollRatio }
                ViewMode ->
                    syncScroll { targetId = "page-view-area", ratio = model.scrollRatio }
                ReorderMode ->
                    Cmd.none
    in
    ( newModel, syncCmd )


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
        ]




















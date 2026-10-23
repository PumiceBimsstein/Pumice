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

        ImportBook newId importedBook ->
            model
                |> addImportedBook newId importedBook
                |> notifyAndSave

        ImportShelf newId importedShelf ->
            model
                |> addImportedShelf newId importedShelf
                |> notifyAndSave

        ImportData jsonString ->
            model
                |> processImportedString jsonString
                |> Result.map notifyAndSave
                |> Result.withDefault ( model, Cmd.none )

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


        ChangeExportFormat formatStr ->
            ( { model | exportFormat = stringToExportFormat formatStr }, Cmd.none )
        
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
            ( model
            , Task.perform ResetAppWithTime (Task.map2 Tuple.pair Time.here Time.now)
            )

        ResetAppWithTime ( zone, time ) ->
            resetWithBackup zone time model

        NoOp ->
            ( model, Cmd.none )


-- ドロップされたファイル群の拡張子と、現在の画面モードを照合して振り分ける
handleFilesDropped : List File -> Model -> ( Model, Cmd Msg )
handleFilesDropped files model =
    case files of
        [] ->
            ( model, Cmd.none )

        file :: rest ->
            let
                fileName =
                    File.name file

                ext =
                    fileName
                        |> String.split "."
                        |> List.reverse
                        |> List.head
                        |> Maybe.withDefault ""
                        |> String.toLower
            in
            if ext == "txt" || ext == "md" then
                -- テキスト / Markdown の場合：PageView 以外は弾く
                case model.mainViewMode of
                    PageView ->
                        ( model
                        , Task.perform (PageContentLoaded fileName) (File.toString file)
                        )

                    ShelfListView ->
                        ( { model | modalAlert = Just ("「" ++ fileName ++ "」はテキストファイルです。\n本を開いたページ画面でのみドロップできます。") }
                        , Cmd.none
                        )

                    ShelfDetailView _ ->
                        ( { model | modalAlert = Just ("「" ++ fileName ++ "」はテキストファイルです。\n本を開いたページ画面でのみドロップできます。") }
                        , Cmd.none
                        )

            else if ext == "json" then
                -- JSON の場合：現在の画面に応じて期待するターゲットを指定して読み込む
                case model.mainViewMode of
                    ShelfListView ->
                        -- 本棚一覧なら ShelfImport（本棚または全体バックアップ）を期待
                        ( model
                        , Task.perform (JsonFileRead (Just ShelfImport) fileName) (File.toString file)
                        )

                    ShelfDetailView _ ->
                        -- 本一覧なら BookImport（本データ）を期待
                        ( model
                        , Task.perform (JsonFileRead (Just BookImport) fileName) (File.toString file)
                        )

                    PageView ->
                        -- ページ画面への JSON ドロップは弾く
                        ( { model | modalAlert = Just ("「" ++ fileName ++ "」は JSON データです。\n本棚一覧（Category）または本一覧（Books）画面でドロップしてください。") }
                        , Cmd.none
                        )

            else
                -- 未対応の拡張子（画像やPDFなど）を弾く
                ( { model | modalAlert = Just ("「" ++ fileName ++ "」は対応していないファイル形式です。\n（.txt, .md, .json に対応しています）") }
                , Cmd.none
                )


-- JSONの内容を解析して適切なインポート処理を実行するヘルパー関数
-- JSON の中身（Book / Shelf / All）と画面側の期待（ImportTarget）を照合して弾く
handleJsonContent : Maybe ImportTarget -> String -> String -> Model -> ( Model, Cmd Msg )
handleJsonContent maybeTarget fileName content model =
    case Decode.decodeString JsonConverter.decodeImportPayload content of
        Ok parsed ->
            case ( maybeTarget, parsed ) of
                -- 1. 本棚一覧画面（ShelfImport）: 本棚データのみ許可、全体バックアップや本データは弾く
                ( Just ShelfImport, JsonConverter.ParsedShelf shelf ) ->
                    let ( newId, m1 ) = stepUuid model in
                    m1 |> addImportedShelf newId shelf |> notifyAndSave

                ( Just ShelfImport, JsonConverter.ParsedAll _ ) ->
                    ( { model | modalAlert = Just ("「" ++ fileName ++ "」は全体バックアップデータです。\n本棚データ（Category）のインポート場所からは読み込めません。\nサイドバーの「File ▾」メニューからインポートしてください。") }
                    , Cmd.none
                    )

                ( Just ShelfImport, JsonConverter.ParsedBook _ ) ->
                    ( { model | modalAlert = Just ("「" ++ fileName ++ "」は本データです。\n本棚を開いた画面（Books）で読み込んでください。") }
                    , Cmd.none
                    )

                -- 2. 本一覧画面（BookImport）: 本データのみ許可
                ( Just BookImport, JsonConverter.ParsedBook book ) ->
                    let ( newId, m1 ) = stepUuid model in
                    m1 |> addImportedBook newId book |> notifyAndSave

                ( Just BookImport, JsonConverter.ParsedShelf _ ) ->
                    ( { model | modalAlert = Just ("「" ++ fileName ++ "」は本棚データです。\n本棚一覧（Category）画面で読み込んでください。") }
                    , Cmd.none
                    )

                ( Just BookImport, JsonConverter.ParsedAll _ ) ->
                    ( { model | modalAlert = Just ("「" ++ fileName ++ "」は全体バックアップデータです。\n本一覧画面からは読み込めません。\nサイドバーの「File ▾」メニューからインポートしてください。") }
                    , Cmd.none
                    )

                -- 3. 全体バックアップ（AllImport）: 全体バックアップのみ許可
                ( Just AllImport, JsonConverter.ParsedAll importedModel ) ->
                    applyImportedModel model importedModel |> notifyAndSave

                ( Just AllImport, JsonConverter.ParsedBook _ ) ->
                    ( { model | modalAlert = Just ("「" ++ fileName ++ "」は本データです。\n全体バックアップの場所からは読み込めません。") }
                    , Cmd.none
                    )

                ( Just AllImport, JsonConverter.ParsedShelf _ ) ->
                    ( { model | modalAlert = Just ("「" ++ fileName ++ "」は本棚データです。\n全体バックアップの場所からは読み込めません。") }
                    , Cmd.none
                    )

                -- その他（ターゲット未指定の場合）
                ( Nothing, _ ) ->
                    ( { model | modalAlert = Just ("「" ++ fileName ++ "」は直接ドロップできません。\n対応するメニューや画面からインポートしてください。") }
                    , Cmd.none
                    )

        Err _ ->
            -- 旧形式の全体バックアップ（生のModel JSON）も、AllImport 以外では弾く
            case Decode.decodeString JsonConverter.decodeAnyAllBackup content of
                Ok importedModel ->
                    case maybeTarget of
                        Just AllImport ->
                            applyImportedModel model importedModel |> notifyAndSave

                        Just ShelfImport ->
                            ( { model | modalAlert = Just ("「" ++ fileName ++ "」は全体バックアップデータです。\n本棚データ（Category）のインポート場所からは読み込めません。\nサイドバーの「File ▾」メニューからインポートしてください。") }
                            , Cmd.none
                            )

                        Just BookImport ->
                            ( { model | modalAlert = Just ("「" ++ fileName ++ "」は全体バックアップデータです。\n本一覧画面からは読み込めません。\nサイドバーの「File ▾」メニューからインポートしてください。") }
                            , Cmd.none
                            )

                        Nothing ->
                            ( { model | modalAlert = Just ("「" ++ fileName ++ "」は全体バックアップデータです。\nサイドバーの「File ▾」メニューからインポートしてください。") }
                            , Cmd.none
                            )

                Err _ ->
                    ( { model | modalAlert = Just ("「" ++ fileName ++ "」は正しくないJSONファイル、または形式が不正です。") }
                    , Cmd.none
                    )

-- importTargetName : ImportTarget -> String
-- importTargetName target =
--     case target of
--         ShelfImport -> "本棚データ"
--         BookImport  -> "本データ"
--         AllImport   -> "全体バックアップデータ"

-- parsedTypeName : ParsedImport -> String
-- parsedTypeName parsed =
--     case parsed of
--         ParsedBook _  -> "本のデータ"
--         ParsedShelf _ -> "本棚のデータ"
--         ParsedAll _   -> "全体バックアップデータ"

-- mismatchMessage : String -> ImportTarget -> ParsedImport -> String
-- mismatchMessage fileName target parsed =
--     let
--         expected = importTargetName target
--         actual = parsedTypeName parsed
--     in
--     "「" ++ fileName ++ "は" ++ actual ++ "です。この場所からは読み込めません。"


-- MARK:subscriptions

subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onKeyDown keyDecoder 
        , incomingMsg decodeIncomingMsg
        ]

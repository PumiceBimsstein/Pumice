module Domain.AddItem exposing (..)

import Type exposing (..)
import Domain.Helper exposing (..)
import Domain.Guide exposing (guideShelf, guideBook, guidePage1, guidePage2, guidePage3)
import Random
import Uuid.Barebones exposing (uuidStringGenerator)
import File exposing (File)
import Task
import Json.Decode as Decode
import JsonConverter exposing (..)

-- ModelのSeedを進めて新しいUUIDを1つ取り出す
stepUuid : Model -> ( String, Model )
stepUuid model =
    let
        ( uuid, nextSeed ) =
            Random.step uuidStringGenerator model.seed
    in
    ( uuid, { model | seed = nextSeed } )


-- 新規本棚びブックを積んで AppState に追加
initShelfWithBook : String -> String -> AppState -> AppState
initShelfWithBook shelfId bookId state =
    let
        newBook =
            { id = bookId, title = "New Book", pages = [] }

        newShelf =
            { id = shelfId, name = "New Shelf", books = [ newBook ] }
    in
    { state
        | shelves = state.shelves ++ [ newShelf ]
        , currentShelfId = shelfId
        , currentBookId = Just bookId
        , currentPageIndex = 0
    }


-- 指定したブックを選択状態にする
selectBookInState : String -> AppState -> AppState
selectBookInState bookId state =
    { state
        | currentBookId = Just bookId
        , currentPageIndex = 0
    }


--MARK:ファイルインポート

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


-- ファイル名と内容から新しいページを挿入
processPageContent : String -> String -> Model -> ( Model, Cmd Msg )
processPageContent fileName fullContent model =
    let
        insertIndex =
            getCurrentBook model.present
                |> Maybe.map (.pages >> List.length)
                |> Maybe.withDefault 0

        newModel =
            { model
                | pageCreationBuffer = [ fullContent ]
                , pageCreationTitle = fileName
            }
                |> pushToHistory
                |> buildPage insertIndex
                |> applyPageSelection insertIndex
    in
    notifyAndSave newModel


--MARK:Shelf追加
createShelf : Model -> Model
createShelf model =
    let
        ( shelfId, m1 ) =
            stepUuid (pushToHistory model)

        ( bookId, m2 ) =
            stepUuid m1

        newPresent =
            initShelfWithBook shelfId bookId m2.present
    in
    { m2 | present = newPresent }
        |> buildPage 0


createBook : Model -> Model
createBook model =
    let
        ( bookId, m1 ) =
            stepUuid (pushToHistory model)

        newPresent =
            m1.present
                |> addBookToCurrentShelf bookId
                |> selectBookInState bookId
    in
    { m1 | present = newPresent }
        |> setMode EditMode
        |> buildPage 0

--MARK:GuideをShelfとして追加

addGuideShelf : Model -> Model
addGuideShelf model =
    let
        historyModel =
            pushToHistory model

        -- ID の新規発行
        ( newShelfId, m1 ) = stepUuid historyModel
        ( newBookId, m2 ) = stepUuid m1
        ( p1Id, m3 ) = stepUuid m2
        ( p2Id, m4 ) = stepUuid m3
        ( p3Id, m5 ) = stepUuid m4

        newPages =
            [ { guidePage1 | id = p1Id }
            , { guidePage2 | id = p2Id }
            , { guidePage3 | id = p3Id }
            ]

        newBook =
            { guideBook | id = newBookId, pages = newPages }

        newShelf =
            { guideShelf | id = newShelfId, books = [ newBook ] }

        oldPresent =
            m5.present

        newPresent =
            { oldPresent
                | shelves = oldPresent.shelves ++ [ newShelf ]
                , currentShelfId = newShelfId
                , currentBookId = Just newBookId
                , currentPageIndex = 0
            }
    in
    { m5
        | present = newPresent
        , mainViewMode = PageView
        , mode = ViewMode
        , sidebarTab = TocTab
    }


--MARK:ページ追加
createPage : Int -> Model -> Model
createPage insertIndex model =
    model
        |> pushToHistory
        |> buildPage insertIndex

createNextPage : Int -> Model -> Model
createNextPage pageIndex model =
    model
        |> pushToHistory
        |> buildPage pageIndex
        |> applyPageSelection pageIndex
        |> setMode EditMode

selectCreatedPage : Int -> Model -> Model
selectCreatedPage index model =
    let
        present = model.present
    in
    { model | present = { present | currentPageIndex = index } }


buildPage : Int -> Model -> Model
buildPage insertIndex model =
    let
        ( newId, nextSeed ) =
            Random.step uuidStringGenerator model.seed

        content =
            List.head model.pageCreationBuffer
                |> Maybe.withDefault ""

        stepped =
            { model
                | seed = nextSeed
                , pageCreationBuffer = List.drop 1 model.pageCreationBuffer
            }
    in
    { stepped
        | present = addPageToCurrentBook newId insertIndex content stepped.present
    }


duplicatePageAt : Int -> Model -> Model
duplicatePageAt targetIndex model =
    let
        maybeTargetPage =
            getCurrentBook model.present
                |> Maybe.andThen (\book -> List.drop targetIndex book.pages |> List.head)
    in
    case maybeTargetPage of
        Just page ->
            let
                insertIndex =
                    targetIndex + 1
            in
            { model | pageCreationBuffer = [ page.content ] }
                |> pushToHistory
                |> buildPage insertIndex
                |> applyPageSelection insertIndex

        Nothing ->
            model


addPageToCurrentBook : String -> Int -> String -> AppState -> AppState
addPageToCurrentBook newId insertIndex content state =
    let
        contents =
            if content == "" then
                "# NewPage\n\n"
            else
                content

        insertPage pages =
            let
                index =
                    clamp 0 (List.length pages) insertIndex

                -- 本文の1行目が「# 」で始まればそれをタイトルにし、なければページ番号にする
                -- 空の本文は元の content で判定するため、ページ番号になる
                targetPage =
                    { id = newId, title = extractTitleFromContent index content, content = contents }
            in
            List.take index pages
                ++ (targetPage :: List.drop index pages)

        updateBooks books =
            List.map
                (\book ->
                    if Just book.id == state.currentBookId then
                        { book | pages = insertPage book.pages }
                    else
                        book
                )
                books

        updateShelves shelves =
            List.map
                (\shelf ->
                    if shelf.id == state.currentShelfId then
                        { shelf | books = updateBooks shelf.books }
                    else
                        shelf
                )
                shelves
    in
    { state | shelves = updateShelves state.shelves }


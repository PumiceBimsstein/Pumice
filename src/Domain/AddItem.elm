module Domain.AddItem exposing (..)

import Type exposing (..)
import Json.Decode as Decode
import Domain.Helper exposing (..)
import Domain.Guide exposing (guideShelf, guideBook, guidePage1, guidePage2, guidePage3)
import Random
import Uuid.Barebones exposing (uuidStringGenerator)


-- ModelのSeedを進めて新しいUUIDを1つ取り出す
stepUuid : Model -> ( String, Model )
stepUuid model =
    let
        ( uuid, nextSeed ) =
            Random.step uuidStringGenerator model.seed
    in
    ( uuid, { model | seed = nextSeed } )


{-| 新規本棚と初期ブックを AppState に追加する純粋関数 -}
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


{-| 指定したブックを選択状態（先頭ページ）にする純粋関数 -}
selectBookInState : String -> AppState -> AppState
selectBookInState bookId state =
    { state
        | currentBookId = Just bookId
        , currentPageIndex = 0
    }


--MARK:ファイルインポート
importTargetToString : ImportTarget -> String
importTargetToString target =
    case target of
        ShelfImport ->
            "shelf"

        BookImport ->
            "book"

        AllImport ->
            "all"


-- .txt/.mdがドロップされたときにページを追加するかどうかの条件分岐
handleFileDropped : Decode.Value -> Model -> ( Model, Cmd Msg )
handleFileDropped value model =
    if model.mode == EditMode && isEditorArea value then
        ( pushToHistory model, Cmd.none )

    else
        processFileDrop value model


-- ドロップされた場所の id が "editor-area" かどうかを判定するヘルパー
isEditorArea : Decode.Value -> Bool
isEditorArea value =
    let
        idDecoder =
            Decode.oneOf
                [ -- 通常のブラウザイベントの場合: event.target.id
                  Decode.at [ "target", "id" ] Decode.string

                -- JS/Port側で独自のオブジェクトとして送っている場合のフォールバック
                , Decode.field "targetId" Decode.string
                , Decode.field "id" Decode.string
                ]
    in
    Decode.decodeValue idDecoder value == Ok "editor-area"


-- .txt/.mdが読み込まれたかドロップされたとき
processFileDrop : Decode.Value -> Model -> ( Model, Cmd Msg )
processFileDrop value model =
    case decodeDropPayload value of
        Ok ( fileName, fullContent ) ->
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

        Err _ ->
            ( model, Cmd.none )


-- JavaScriptからの[ファイル名, 内容]をデコードする
decodeDropPayload : Decode.Value -> Result Decode.Error ( String, String )
decodeDropPayload value =
    let
        decoder =
            Decode.map2 Tuple.pair
                (Decode.index 0 Decode.string)
                (Decode.index 1 Decode.string)
    in
    Decode.decodeValue decoder value





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



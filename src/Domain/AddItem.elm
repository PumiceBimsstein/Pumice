module Domain.AddItem exposing (..)

import Type exposing (..)
import Json.Decode as Decode
import Domain.Helper exposing (..)
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


-- handleFileDrop : String -> List String -> AppState -> AppState
-- handleFileDrop fileName contentList present =
--     case present.currentBookId of
--         Just bookId ->
--             let
--                 updater =
--                     \book ->
--                         let
--                             -- 各コンテンツ片に ID (空文字) とタイトルを付与して Page 型のリストにする
--                             newPages =
--                                 contentList
--                                     |> List.map (\c -> { id = "", title = fileName, content = c })

--                             -- 既存の全ページの後に新しいページ群を結合
--                             before =
--                                 book.pages

--                             after =
--                                 []
--                         in
--                         { book | pages = before ++ newPages ++ after }

--                 -- 挿入前の全ページ数を取得
--                 currentTotalPages =
--                     getCurrentBook present
--                         |> Maybe.map (\b -> List.length b.pages)
--                         |> Maybe.withDefault 0
--             in
--             { present
--                 | shelves = updateBookInShelves bookId updater present.shelves
--                 -- 追加された最初のページへ移動
--                 , currentPageIndex = currentTotalPages
--             }

--         Nothing ->
--             present

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


-- .txt/.mdが読み込まれたかドロップされたとき、
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


-- processFileDrop : Decode.Value -> Model -> ( Model, Cmd Msg )
-- processFileDrop value model =
--     case decodeDropPayload value of
--         Ok ( fileName, fullContent ) ->
--             let
--                 insertIndex =
--                     getCurrentBook model.present
--                         |> Maybe.map (.pages >> List.length)
--                         |> Maybe.withDefault 0

--                 updateModel =
--                     { model
--                         | pageCreationBuffer = [ fullContent ]
--                         , pageCreationTitle = fileName
--                     }

--                 nextIndex =
--                     model.present.currentPageIndex + 1

--                 newModel =
--                     applyPageSelection nextIndex updateModel
--             in
--             ( newModel, nextMsg (CreatePage insertIndex) )

--         Err _ ->
--             ( model, Cmd.none )


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


-- AppStateにインポートした本棚を追加する
appendShelfData : Shelf -> AppState -> AppState
appendShelfData newShelf state =
    { state
        | shelves = state.shelves ++ [ newShelf ]
        , currentShelfId = newShelf.id
        , currentBookId = Nothing
        , currentPageIndex = 0
    }

-- AppStateにインポートした本を追加する
appendBookData : Book -> AppState -> AppState
appendBookData newBook state =
    let
        updateShelves =
            List.map
                (\shelf ->
                    if shelf.id == state.currentShelfId then
                        { shelf | books = shelf.books ++ [ newBook ] }
                    else
                        shelf
                )
                state.shelves
    in
    { state
        | shelves = updateShelves
        , currentBookId = Just newBook.id
        , currentPageIndex = 0
    }


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


-- appendShelfAndSave : Model -> ( Model, Cmd Msg )
-- appendShelfAndSave model =
--     model
--         |> recordHistory
--         |> registerShelf
--         |> buildPage 0
--         |> notifyAndSave


-- registerShelf : Model -> Model
-- registerShelf model =
--     let
--         ( shelfId, seed1 ) =
--             Random.step uuidStringGenerator model.seed

--         ( bookId, seed2 ) =
--             Random.step uuidStringGenerator seed1

--         -- updateAppStateを呼ばないように修正したappendShelfの処理をここに直接、または純粋なデータ更新として記述
--         present =
--             model.present

--         newShelf =
--             { id = shelfId, name = "New Shelf", books = [] }

--         newPresent =
--             { present | shelves = present.shelves ++ [ newShelf ] }

--         newModel =
--             { model | present = newPresent, seed = seed2 }

--         finalPresent =
--             newModel.present
--                 |> (\state -> { state | currentShelfId = shelfId })
--                 |> addBookToCurrentShelf bookId
--                 |> (\state -> { state | currentBookId = Just bookId })
--     in
--     { newModel | present = finalPresent }


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

-- 本を追加して選択状態にし、ページ作成リクエストのコマンドを生成する

-- appendBookAndSave : String -> Model -> ( Model, Cmd Msg )
-- appendBookAndSave newId model =
--     model
--         |> recordHistory
--         |> (\m -> { m | present = appendBook newId m.present, mode = EditMode })
--         |> buildPage 0
--         |> notifyAndSave


--MARK:ページ追加
createPage : Int -> Model -> Model
createPage insertIndex model =
    model
        |> pushToHistory
        |> buildPage insertIndex

-- createPage : Int -> Model -> Model
-- createPage insertIndex model =
--     model
--         |> recordHistory
--         |> buildPage insertIndex

createNextPage : Int -> Model -> Model
createNextPage pageIndex model =
    model
        |> pushToHistory
        |> buildPage pageIndex
        --|> selectCreatedPage pageIndex
        |> applyPageSelection pageIndex
        |> setMode EditMode

selectCreatedPage : Int -> Model -> Model
selectCreatedPage index model =
    let
        present = model.present
    in
    { model | present = { present | currentPageIndex = index } }


-- recordHistory : Model -> Model
-- recordHistory model =
--     { model
--         | past = List.take 100 (model.present :: model.past)
--         , future = []
--     }

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


addPageToCurrentBook : String -> Int -> String -> AppState -> AppState
addPageToCurrentBook newId insertIndex content state =
    let
        contents =
            if content == "" then
                "# NewPage"
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
                ++ [ targetPage ]
                ++ List.drop index pages

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



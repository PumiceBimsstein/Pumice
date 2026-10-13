module Domain.AddItem exposing (..)

import Type exposing (..)
--import Browser.Dom
--import Task
--import Html.Attributes exposing (..)
--import Html.Events exposing (on, preventDefaultOn)
--import Html exposing (Attribute)
import Json.Decode as Decode
--import JsonConverter exposing (decodeBook, decodeShelf)
import Domain.Helper exposing (..)
import Random
import Uuid.Barebones exposing (uuidStringGenerator)

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


handleFileDrop : String -> List String -> AppState -> AppState
handleFileDrop fileName contentList present =
    case present.currentBookId of
        Just bookId ->
            let
                updater =
                    \book ->
                        let
                            -- 各コンテンツ片に ID (空文字) とタイトルを付与して Page 型のリストにする
                            newPages =
                                contentList
                                    |> List.map (\c -> { id = "", title = fileName, content = c })

                            -- 既存の全ページの後に新しいページ群を結合
                            before =
                                book.pages

                            after =
                                []
                        in
                        { book | pages = before ++ newPages ++ after }

                -- 挿入前の全ページ数を取得
                currentTotalPages =
                    getCurrentBook present
                        |> Maybe.map (\b -> List.length b.pages)
                        |> Maybe.withDefault 0
            in
            { present
                | shelves = updateBookInShelves bookId updater present.shelves
                -- 追加された最初のページへ移動
                , currentPageIndex = currentTotalPages
            }

        Nothing ->
            present


handleFileDropped : Decode.Value -> Model -> ( Model, Cmd Msg )
handleFileDropped value model =
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
            in
            ( newModel, nextMsg (CreatePage insertIndex) )

        Err _ ->
            ( model, Cmd.none )

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

appendShelfAndSave : Model -> ( Model, Cmd Msg )
appendShelfAndSave model =
    model
        |> recordHistory
        |> registerShelf
        |> buildPage 0
        |> notifyAndSave


registerShelf : Model -> Model
registerShelf model =
    let
        ( shelfId, seed1 ) =
            Random.step uuidStringGenerator model.seed

        ( bookId, seed2 ) =
            Random.step uuidStringGenerator seed1

        -- updateAppStateを呼ばないように修正したappendShelfの処理をここに直接、または純粋なデータ更新として記述
        present =
            model.present

        newShelf =
            { id = shelfId, name = "New Shelf", books = [] }

        newPresent =
            { present | shelves = present.shelves ++ [ newShelf ] }

        newModel =
            { model | present = newPresent, seed = seed2 }

        finalPresent =
            newModel.present
                |> (\state -> { state | currentShelfId = shelfId })
                |> addBookToCurrentShelf bookId
                |> (\state -> { state | currentBookId = Just bookId })
    in
    { newModel | present = finalPresent }


-- 本を追加して選択状態にし、ページ作成リクエストのコマンドを生成する

appendBookAndSave : String -> Model -> ( Model, Cmd Msg )
appendBookAndSave newId model =
    model
        |> recordHistory
        |> (\m -> { m | present = appendBook newId m.present, mode = EditMode })
        |> buildPage 0
        |> notifyAndSave


--MARK:ページ追加

createPage : Int -> Model -> Model
createPage insertIndex model =
    model
        |> recordHistory
        |> buildPage insertIndex
        --|> notifyAndSave

recordHistory : Model -> Model
recordHistory model =
    { model
        | past = List.take 100 (model.present :: model.past)
        , future = []
    }

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

-- 現在のページの次に追加
-- addPageNextToCurrent : String -> AppState -> AppState
-- addPageNextToCurrent newId state =
--     insertPageAt (state.currentPageIndex + 1) newId state


insertPageAt : Int -> String -> AppState -> AppState
insertPageAt targetIdx newId state =
    let
        newPage = { id = newId, title = "Untitled Page", content = "# New Page" }

        updateBooks books =
            List.map 
                (\b -> 
                    if Just b.id == state.currentBookId then 
                        { b | pages = 
                                List.take targetIdx b.pages ++ (newPage :: List.drop targetIdx b.pages)
                        } 
                    else b
                ) 
                books

        newShelves =
            List.map 
                (\s -> if s.id == state.currentShelfId then { s | books = updateBooks s.books } else s) 
                state.shelves
    in
    { state | shelves = newShelves, currentPageIndex = targetIdx }


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



module Domain.Helper exposing (..)

import Type exposing (..)
import Browser.Dom
import Task
import Time
import File.Download as Download
import Html.Attributes exposing (..)
import Html.Events exposing (on, preventDefaultOn)
import Html exposing (Attribute)
import Json.Decode as Decode
import JsonConverter
    --exposing (decodeBook, decodeShelf)
import Ports exposing (syncScroll, saveToStorage, scrollToTop, exportZip)

-- MARK: 基本的な処理

-- Cmd なしの (Model, Cmd Msg) を生成
withoutCmd : Model -> ( Model, Cmd Msg )
withoutCmd model =
    ( model, Cmd.none )

setMode : Mode -> Model -> Model
setMode newMode model =
    { model | mode = newMode }


pushToHistory : Model -> Model
pushToHistory model =
    updateAppState model.present model

-- 全ての本棚から特定のIDを持つ本を探索
findBookById : String -> List Shelf -> Maybe Book
findBookById targetId shelves =
    shelves
        |> List.concatMap .books
        |> List.filter (\b -> b.id == targetId)
        |> List.head

-- 現在選択されている本棚を取得
getCurrentShelf : AppState -> Maybe Shelf
getCurrentShelf state =
    state.shelves
        |> List.filter (\shelf -> shelf.id == state.currentShelfId)
        |> List.head

-- 現在選択されている本を取得
getCurrentBook : AppState -> Maybe Book
getCurrentBook state =
    state.currentBookId
        |> Maybe.andThen (\id -> findBookById id state.shelves)

-- 現在表示されているページを取得
getCurrentPage : AppState -> Maybe Page
getCurrentPage state =
    getCurrentBook state
        |> Maybe.andThen
            (\book ->
                book.pages
                    |> List.drop state.currentPageIndex
                    |> List.head
            )

-- 本棚を選択
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


--MARK:モード変更

-- VIEWモードに変える
setMainViewMode : MainViewMode -> Model -> Model
setMainViewMode viewMode model =
    { model | mainViewMode = viewMode }


{-| 通常サイドバーの表示・非表示を切り替える -}
toggleNormalSidebar : Model -> Model
toggleNormalSidebar model =
    let
        nextMode =
            if model.sidebarMode == NormalSidebar then
                OverlaySidebar

            else
                NormalSidebar
    in
    model
        |> updateSidebarMode nextMode


{-| 左サイドバーの表示・非表示を切り替える -}
toggleLeftSidebar : Model -> Model
toggleLeftSidebar model =
    let
        nextMode =
            if model.sidebarMode == LeftSidebar then
                OverlaySidebar

            else
                LeftSidebar
    in
    model
        |> updateSidebarMode nextMode


{-| サイドバーモードを更新し、NormalSidebar 以外になった直後は必ずコントロールウィンドウを表示する -}
updateSidebarMode : SidebarMode -> Model -> Model
updateSidebarMode nextMode model =
    let
        nextWindowVisible =
            if nextMode /= NormalSidebar then
                True

            else
                model.isRightSideWindowVisible
    in
    { model
        | sidebarMode = nextMode
        , isRightSideWindowVisible = nextWindowVisible
    }

ensureSidebarTabOnEmpty : Model -> Model
ensureSidebarTabOnEmpty model =
    if List.isEmpty model.present.shelves then
        { model | sidebarTab = ShelfListTab }
    else
        model

--MARK:ページ変更

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


-- 次のページが存在するか判定
hasNextPage : AppState -> Bool
hasNextPage state =
    case getCurrentBook state of
        Just book ->
            state.currentPageIndex < List.length book.pages - 1

        Nothing ->
            False


-- 前のページが存在するか判定
hasPrevPage : AppState -> Bool
hasPrevPage state =
    state.currentPageIndex > 0


-- ページ送り時に実行するスクロールコマンド群
pageNavigationCmd : Cmd Msg
pageNavigationCmd =
    Cmd.batch
        [ scrollToTop ()
        , Ports.scrollToTocHeading ()
        ]


-- ミニコントローラーの表示
setRightSideWindowVisible : Bool -> Model -> Model
setRightSideWindowVisible isVisible model =
    { model | isRightSideWindowVisible = isVisible }





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


-- MARK:検索
-- 検索ワードが含まれているかを判定
isHit : String -> String -> Bool
isHit searchText target =
    if String.isEmpty searchText then
        False
    else
        String.contains (String.toLower searchText) (String.toLower target)


-- 本の中にヒットするページがあるか
hasHitInBook : String -> Book -> Bool
hasHitInBook searchText book =
    List.any (\page -> isHit searchText page.content) book.pages


-- 本棚の中にヒットする本があるか
hasHitInShelf : String -> Shelf -> Bool
hasHitInShelf searchText shelf =
    List.any (\book -> hasHitInBook searchText book) shelf.books


-- 特定のIDを持つブックを探し、指定された更新関数（updater）を適用します
updateBookInShelves : String -> (Book -> Book) -> List Shelf -> List Shelf
updateBookInShelves bookId updater shelves =
    List.map
        (\shelf ->
            { shelf
                | books =
                    List.map
                        (\book ->
                            if book.id == bookId then
                                updater book

                            else
                                book
                        )
                        shelf.books
            }
        )
        shelves


extractHeadings : Int -> String -> List Heading
extractHeadings pageIdx content =
    let
        -- 行ごとに分割し、コードブロックの外側にある見出し行のみを取り出す
        parseLines lines inCodeBlock acc =
            case lines of
                [] ->
                    List.reverse acc

                line :: rest ->
                    let
                        trimmed =
                            String.trim line
                    in
                    if String.startsWith "```" trimmed then
                        parseLines rest (not inCodeBlock) acc

                    else if inCodeBlock then
                        parseLines rest True acc

                    else
                        let
                            maybeHeading =
                                if String.startsWith "### " line then
                                    Just { level = 3, text = String.trim (String.dropLeft 4 line), pageIndex = pageIdx, order = 0 }

                                else if String.startsWith "## " line then
                                    Just { level = 2, text = String.trim (String.dropLeft 3 line), pageIndex = pageIdx, order = 0 }

                                else if String.startsWith "# " line then
                                    Just { level = 1, text = String.trim (String.dropLeft 2 line), pageIndex = pageIdx, order = 0 }

                                else
                                    Nothing
                        in
                        case maybeHeading of
                            Just h ->
                                parseLines rest False (h :: acc)

                            Nothing ->
                                parseLines rest False acc

        raw =
            parseLines (String.lines content) False []
                |> List.indexedMap (\i h -> { h | order = i })
    in
    if List.isEmpty raw then
        [ { level = 1
          , text = "Page " ++ String.fromInt (pageIdx + 1)
          , pageIndex = pageIdx
          , order = 0
          }
        ]

    else
        raw






{-| 編集バッファの空白を除去し、空の場合はデフォルト名を補正する末端関数 -}
normalizeEditBuffer : EditBuffer -> EditBuffer
normalizeEditBuffer buffer =
    let
        trimmed =
            String.trim buffer.value

        finalValue =
            if String.isEmpty trimmed then
                case buffer.target of
                    BookTitle ->
                        "無題の本"

                    ShelfTitle ->
                        "無題の本棚"

            else
                trimmed
    in
    { buffer | value = finalValue }


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

--MARK:scrollDecoder
scrollDecoder : Decode.Decoder Browser.Dom.Viewport
scrollDecoder =
    Decode.at [ "target" ] <|
        Decode.map4
            (\y height sceneHeight sceneWidth ->
                { scene = { width = sceneWidth, height = sceneHeight }
                , viewport = { x = 0, y = y, width = 0, height = height }
                }
            )
            (Decode.field "scrollTop" Decode.float)
            (Decode.field "clientHeight" Decode.float)
            (Decode.field "scrollHeight" Decode.float)
            (Decode.field "scrollWidth" Decode.float)


takeWhile : (Char -> Bool) -> String -> String
takeWhile predicate str =
    str
        |> String.toList
        |> takeWhileList predicate
        |> String.fromList


dropWhile : (Char -> Bool) -> String -> String
dropWhile predicate str =
    str
        |> String.toList
        |> dropWhileList predicate
        |> String.fromList


takeWhileList : (a -> Bool) -> List a -> List a
takeWhileList predicate list =
    case list of
        [] ->
            []

        x :: xs ->
            if predicate x then
                x :: takeWhileList predicate xs

            else
                []


dropWhileList : (a -> Bool) -> List a -> List a
dropWhileList predicate list =
    case list of
        [] ->
            []

        x :: xs ->
            if predicate x then
                dropWhileList predicate xs

            else
                list


-- MARK:マウス操作
onDragStart : Msg -> Attribute Msg
onDragStart msg =
    Html.Events.on "dragstart" (Decode.succeed msg)

onDragOver : Msg -> Attribute Msg
onDragOver msg =
    preventDefaultOn "dragover" (Decode.succeed ( msg, True ))

onDrop : Msg -> Attribute Msg
onDrop msg =
    preventDefaultOn "drop" (Decode.succeed ( msg, True ))

onDragEnd : Msg -> Attribute Msg
onDragEnd msg =
    Html.Events.on "dragend" (Decode.succeed msg)

reorderList : Int -> Int -> List a -> List a
reorderList fromIndex toIndex list =
    let
        element =
            list
                |> List.drop fromIndex
                |> List.head
    in
    case element of
        Just item ->
            let
                remaining =
                    List.take fromIndex list ++ List.drop (fromIndex + 1) list
            in
            List.take toIndex remaining ++ (item :: List.drop toIndex remaining)

        Nothing ->
            list

calcProgress : Int -> Int -> Float
calcProgress current total =
    if total > 1 then
        (toFloat current / toFloat (total - 1)) * 100
    else
        0


stripEmphasis : String -> String
stripEmphasis input =
    input
        |> String.replace "**" ""


-- MARK:目次一覧
-- viewHeadingList関連関数

toHeadingData : List Heading -> HeadingData
toHeadingData headings =
    { headings = headings
    , allHeadingTexts = List.map .text headings
    }


filterHeadingsData : HeadingLevel -> HeadingData -> HeadingData
filterHeadingsData level data =
    { data | headings = List.filter (\h -> h.level <= headingLevelToInt level) data.headings }


headingLevelToInt : HeadingLevel -> Int
headingLevelToInt level =
    case level of
        H1 -> 1
        H2 -> 2
        H3 -> 3


checkSectionHit : String -> String -> String -> List String -> Bool
checkSectionHit searchText headingText content _ =
    if String.isEmpty searchText then
        False

    else if isHit searchText headingText then
        True

    else
        let
            sectionText =
                extractSectionContent headingText (String.lines content)
        in
        isHit searchText sectionText


-- 該当する見出し行を見つけ、次の見出し行（#）が現れるまでの本文行だけを抽出する
extractSectionContent : String -> List String -> String
extractSectionContent targetHeading lines =
    let
        -- 行が指定の見出し（例: "### 見出し名"）と合致するか
        isTargetHeading line =
            let
                trimmed = String.trim line
            in
            trimmed == "# " ++ targetHeading
                || trimmed == "## " ++ targetHeading
                || trimmed == "### " ++ targetHeading

        -- 行がいずれかの見出し行（# で始まる行）かどうか
        isAnyHeading line =
            let
                trimmed = String.trim line
            in
            String.startsWith "# " trimmed
                || String.startsWith "## " trimmed
                || String.startsWith "### " trimmed

        -- 状態を持って行をパースする補助関数
        -- searching: 目的の見出しを探している最中かどうか
        collect linesAcc searching =
            case linesAcc of
                [] ->
                    []

                line :: rest ->
                    if searching then
                        if isTargetHeading line then
                            collect rest False

                        else
                            collect rest True

                    else
                        -- 目的の見出しを発見した後の処理
                        if isAnyHeading line then
                            -- 次の見出しが現れたら抽出終了
                            []

                        else
                            line :: collect rest False
    in
    String.join "\n" (collect lines True)


isSectionContentHit : String -> String -> String -> List String -> Bool
isSectionContentHit searchText headingText content allHeadingTexts =
    case List.drop 1 (String.split headingText content) of
        nextPart :: _ ->
            List.foldl extractFirstPart nextPart allHeadingTexts
                |> isHit searchText

        [] ->
            False


extractFirstPart : String -> String -> String
extractFirstPart headingText acc =
    List.head (String.split headingText acc)
        |> Maybe.withDefault acc


isCurrentHeading : Heading -> Int -> List String -> Bool
isCurrentHeading h currentPageIndex currentHeading =
    (h.pageIndex == currentPageIndex)
        && List.member (stripEmphasis h.text) (List.map stripEmphasis currentHeading)


getSiblingExportFormat : ExportFormat -> ( ExportFormat, ExportFormat )
getSiblingExportFormat format =
    case format of
        FormatTxt ->
            ( FormatMd, FormatMd )

        FormatMd ->
            ( FormatTxt, FormatTxt )


-- ブックを ZIP ペイロードに変換する
bookZipPayload : Book -> ZipPayload
bookZipPayload book =
    { zipName = book.title
    , entries = bookToAllEntries "" book
    }


-- 特定の本棚を ZIP ペイロードに変換する
shelfZipPayload : Shelf -> ZipPayload
shelfZipPayload shelf =
    { zipName = shelf.name
    , entries = toZipEntries [ shelf ]
    }

-- ZIPエクスポート用のペイロードを作成する
fullLibraryPayload : List Shelf -> ZipPayload
fullLibraryPayload shelves =
    { zipName = "Full_Library_Backup"
    , entries = toZipEntries shelves
    }

-- 本棚のリストを ZIP 用のエントリーリストに変換する
toZipEntries : List Shelf -> List ZipEntry
toZipEntries shelves =
    shelves
        |> List.concatMap (\shelf ->
            let
                pathPrefix = sanitizePath shelf.name
            in
            List.concatMap (bookToAllEntries pathPrefix) shelf.books
        )

-- AppStateの更新（データの追加と選択）
-- appendBook : String -> AppState -> AppState
-- appendBook newId state =
--     state
--         |> addBookToCurrentShelf newId
--         |> (\s -> { s | currentBookId = Just newId })

-- 次のメッセージを発行するコマンド
-- nextMsg : msg -> Cmd msg
-- nextMsg msg =
--     Task.perform identity (Task.succeed msg)

-- ファイル名として安全な文字列に変換する
sanitizePath : String -> String
sanitizePath name =
    let
        forbidden =
            ['/', '\\', ':', '*', '?', '"', '<', '>', '|']
    in
    String.map (\c -> if List.member c forbidden then '-' else c) name

-- パスを安全に結合する（先頭に / を入れない）
combinePath : String -> String -> String
combinePath parent child =
    if String.isEmpty parent then
        child
    else
        parent ++ "/" ++ child


-- ページ単体をファイルエントリーに変換
pageToFileEntry : String -> String -> Int -> Page -> ZipEntry
pageToFileEntry extension folderPath index page =
    let
        -- 提示されたロジックでタイトルを動的に決定
        extractedTitle =
            extractTitleFromContent index page.content

        prefix =
            String.fromInt (index + 1) |> String.padLeft 2 '0'

        -- 「01_タイトル.md」のような形式
        fileName =
            (prefix ++ "_" ++ extractedTitle) 
                |> sanitizePath
                |> (\name -> name ++ "." ++ extension)
    in
    { path = combinePath folderPath fileName
    , content = page.content
    }


bookToAllEntries : String -> Book -> List ZipEntry
bookToAllEntries parentPath book =
    let
        -- 本のタイトルをフォルダ名にする（サニタイズ済み）
        bookFolder = 
            combinePath parentPath (sanitizePath book.title)
        
        -- text_files と markdown_files フォルダのパス
        txtPath = combinePath bookFolder "text_files"
        mdPath = combinePath bookFolder "markdown_files"
        
        -- pageToFileEntry は前述の通り index と 拡張子を受け取るものを使用
        txtEntries = 
            List.indexedMap (pageToFileEntry "txt" txtPath) book.pages
            
        mdEntries = 
            List.indexedMap (pageToFileEntry "md" mdPath) book.pages
    in
    txtEntries ++ mdEntries



-- 指定されたインデックスのページを表示するようにモデルを更新します
applyPageSelection : Int -> Model -> Model
applyPageSelection index model =
    let
        newPresent = applyPageChange index model.present
    in
    { model | present = newPresent, scrollRatio = 0 }


applyPageChange : Int -> AppState -> AppState
applyPageChange index present =
    let
        cleared = { present | currentHeading = [] }
        maybeBook = getCurrentBook cleared

        pageContent =
            case maybeBook of
                Just book ->
                    book.pages
                        |> List.drop index
                        |> List.head
                        |> Maybe.map .content
                        |> Maybe.withDefault ""

                Nothing ->
                    ""

        newHeadings =
            extractHeadings index pageContent
    in
    { present
        | currentPageIndex = index
        , currentHeading = List.map .text newHeadings
    }

-- focusInput : String -> Cmd Msg
-- focusInput id =
--     Task.attempt (\_ -> NoOp) (Browser.Dom.focus id)

focusEditor : Cmd Msg
focusEditor =
    Task.attempt (\_ -> NoOp) (Browser.Dom.focus "editor-area")


-- MARK:並べ替え
applyReorder : DragTarget -> Int -> Int -> Model -> Model
applyReorder target from to model =
    let
        oldState = model.present
        newState =
            case target of
                DragShelf ->
                    reorderShelves from to oldState

                DragBook ->
                    reorderBooksInShelf from to oldState

                DragPage ->
                    reorderPagesInBook from to oldState
    in
    { model | present = newState, draggingState = Nothing }

-- 本棚リスト並べ替え
reorderShelves : Int -> Int -> AppState -> AppState
reorderShelves from to state =
    { state | shelves = reorderList from to state.shelves }

reorderBooksInShelf : Int -> Int -> AppState -> AppState
reorderBooksInShelf from to state =
    state
        |> updateCurrentShelf (\shelf -> { shelf | books = reorderList from to shelf.books })


-- 現在選択されている本の中のページを並べ替えます
reorderPagesInBook : Int -> Int -> AppState -> AppState
reorderPagesInBook from to state =
    case state.currentBookId of
        Just bookId ->
            -- updateBookInShelves を使用して、対象の本の pages フィールドに reorderList を適用
            { state
                | shelves =
                    updateBookInShelves bookId 
                        (\book -> { book | pages = reorderList from to book.pages }) -- [修正箇所] 関数合成的にページを並べ替え
                        state.shelves
            }
        Nothing -> state


-- AppState内の現在選択されている本棚を更新する汎用関数
updateCurrentShelf : (Shelf -> Shelf) -> AppState -> AppState
updateCurrentShelf transform state =
    let
        newShelves =
            state.shelves
                |> List.map
                    (\shelf ->
                        if shelf.id == state.currentShelfId then
                            transform shelf
                        else
                            shelf
                    )
    in
    { state | shelves = newShelves }

-- 上記の関数を使用して本を追加する処理を再定義
-- 現在選択されている本棚に、指定されたIDを持つ新しい本を追加します
addBookToCurrentShelf : String -> AppState -> AppState
addBookToCurrentShelf newId state =
    let
        -- 新しい本のデータを作成
        newBook =
            { id = newId
            , title = "New Book"
            , pages = []
            }
    in
    state
        |> updateCurrentShelf (\shelf -> { shelf | books = shelf.books ++ [ newBook ] })


-- MARK:ページ削除
removeCurrentPage : String -> AppState -> AppState
removeCurrentPage pageId state =
    case getCurrentBook state of
        Just book ->
            let
                -- IDが一致しないものだけ残す（削除）
                newPages =
                    List.filter (\p -> p.id /= pageId) book.pages

                newShelves =
                    updateBookInShelves book.id (\b -> { b | pages = newPages }) state.shelves

                -- 現在のインデックスが新しいリストの範囲外にならないよう調整
                newPageIndex =
                    if List.isEmpty newPages then
                        0
                    else
                        Basics.min state.currentPageIndex (List.length newPages - 1)
            in
            { state | shelves = newShelves, currentPageIndex = newPageIndex }

        Nothing ->
            state


-- ページ順序の入れ替えロジック
reorderPagesInCurrentBook : Int -> Int -> AppState -> AppState
reorderPagesInCurrentBook oldIdx newIdx state =
    case getCurrentBook state of
        Just book ->
            let
                newPages =
                    reorderList oldIdx newIdx book.pages

                newShelves =
                    updateBookInShelves book.id (\b -> { b | pages = newPages }) state.shelves
            in
            { state | shelves = newShelves, currentPageIndex = newIdx }

        Nothing ->
            state


-- 本文の1行目からタイトルを抽出し、それと元の本文を返します
-- 本文は一切削らず、コピーするだけの仕様にします
extractTitleFromContent : Int -> String -> String
extractTitleFromContent index content =
    let
        firstLine =
            content 
                |> String.lines 
                |> List.head 
                |> Maybe.withDefault ""
    in
    if String.startsWith "# " firstLine then
        -- 「# 」以降の文字列をタイトルとして採用
        String.dropLeft 2 firstLine |> String.trim
    else
        -- 見出しがない場合はデフォルトのページ番号
        "Page " ++ String.fromInt (index + 1)


-- 現在のページの本文とタイトルを同時に更新します
updateCurrentPageContent : String -> AppState -> AppState
updateCurrentPageContent newContent state =
    case getCurrentBook state of
        Just book ->
            let
                -- 新しいタイトルを抽出（インデックスは表示用に+1されたものではなく0ベースを渡す）
                newTitle =
                    extractTitleFromContent state.currentPageIndex newContent

                updatePage pIdx page =
                    if pIdx == state.currentPageIndex then
                        -- 本文(content)だけでなくタイトル(title)も更新
                        { page | content = newContent, title = newTitle }
                    else
                        page

                newPages =
                    List.indexedMap updatePage book.pages

                newShelves =
                    updateBookInShelves book.id (\b -> { b | pages = newPages }) state.shelves
            in
            { state | shelves = newShelves }

        Nothing ->
            state


-- 本棚の削除とIDの調整
removeShelf : String -> AppState -> AppState
removeShelf shelfId state =
    let
        newShelves =
            List.filter (\s -> s.id /= shelfId) state.shelves

        -- 削除した本棚を選択中だった場合、先頭の本棚に切り替える
        nextShelfId =
            if state.currentShelfId == shelfId then
                newShelves
                    |> List.head
                    |> Maybe.map .id
                    |> Maybe.withDefault ""
            else
                state.currentShelfId
    in
    { state | shelves = newShelves, currentShelfId = nextShelfId }

-- AppStateレベルでのブック削除
removeBookFromState : String -> AppState -> AppState
removeBookFromState bookId state =
    let
        newShelves =
            deleteBookFromShelves bookId state.shelves

        -- 削除したブックが現在選択中だった場合、選択を解除する
        newCurrentBookId =
            if state.currentBookId == Just bookId then
                Nothing
            else
                state.currentBookId
    in
    { state | shelves = newShelves, currentBookId = newCurrentBookId }


-- すべての本棚の中から、特定のIDを持つブックを探して削除します
deleteBookFromShelves : String -> List Shelf -> List Shelf
deleteBookFromShelves bookId shelves =
    List.map
        (\shelf ->
            { shelf | books = List.filter (\b -> b.id /= bookId) shelf.books }
        )
        shelves




-- MARK:ファイルエクスポート

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
                mimeType =
                    if extension == "md" then
                        "text/markdown"
                    else
                        "text/plain"
            in
            Download.string fileName mimeType page.content

        Nothing ->
            Cmd.none

-- バックアップ用のファイル名生成
formatBackupFileName : Time.Zone -> Time.Posix -> String
formatBackupFileName zone time =
    let
        year =
            String.fromInt (Time.toYear zone time)

        month =
            String.fromInt (monthToInt (Time.toMonth zone time))
                |> String.padLeft 2 '0'

        day =
            String.fromInt (Time.toDay zone time)
                |> String.padLeft 2 '0'

        hours =
            String.fromInt (Time.toHour zone time)
                |> String.padLeft 2 '0'

        minutes =
            String.fromInt (Time.toMinute zone time)
                |> String.padLeft 2 '0'

        seconds =
            String.fromInt (Time.toSecond zone time)
                |> String.padLeft 2 '0'
    in
    "Pumice-backup_" ++ year ++ month ++ day ++ "-" ++ hours ++ "-" ++ minutes ++ "-" ++ seconds ++ ".json"


monthToInt : Time.Month -> Int
monthToInt month =
    case month of
        Time.Jan -> 1
        Time.Feb -> 2
        Time.Mar -> 3
        Time.Apr -> 4
        Time.May -> 5
        Time.Jun -> 6
        Time.Jul -> 7
        Time.Aug -> 8
        Time.Sep -> 9
        Time.Oct -> 10
        Time.Nov -> 11
        Time.Dec -> 12

-- MARK:ファイルインポート

processImportedString : String -> Model -> Result Decode.Error Model
processImportedString jsonString currentModel =
    jsonString
        |> Decode.decodeString JsonConverter.decodeModel
        |> Result.map (applyImportedModel currentModel)


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


-- MARK:タイトル編集
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


-- MARK:ホイールの回転を判定
wheelDecoder : Msg -> Msg -> Decode.Decoder Msg
wheelDecoder upMsg downMsg =
    Decode.field "deltaY" Decode.float
        |> Decode.map (\delta ->
            if delta < 0 then
                upMsg   -- 上回転（前へ）
            else
                downMsg -- 下回転（次へ）
        )


onEnter : Msg -> Attribute Msg
onEnter msg =
    on "keydown"
        (Decode.field "key" Decode.string
            |> Decode.andThen
                (\key ->
                    if key == "Enter" then
                        Decode.succeed msg
                    else
                        Decode.fail "Not enter"
                )
        )

-- MARK:キーボードショートカット用デコーダー
keyDecoder : Decode.Decoder Msg
keyDecoder =
    Decode.map2
        (\key ctrl ->
            case ( key, ctrl ) of
                ( "z", True )       -> Undo
                ( "y", True )       -> Redo
                ( "ArrowRight", _ ) -> NextPage
                ( "ArrowLeft", _ )  -> PrevPage
                _ -> NoOp
        )
        (Decode.field "key" Decode.string)
        (Decode.field "ctrlKey" Decode.bool)


decodeIncomingMsg : Decode.Value -> Msg
decodeIncomingMsg value =
    let
        tagDecoder = Decode.field "tag" Decode.string
    in
    case Decode.decodeValue tagDecoder value of
        Ok "ReorderPages" ->
            let
                reorderDecoder =
                    Decode.map2 ReorderPages
                        (Decode.field "from" Decode.int)
                        (Decode.field "to" Decode.int)
            in
            case Decode.decodeValue reorderDecoder value of
                Ok msg -> msg
                Err _ -> NoOp
        Ok "EDITOR_CHANGED" ->
            case Decode.decodeValue (Decode.field "payload" Decode.string) value of
                Ok content -> EditorInput content
                Err _ -> NoOp
        Ok "SCROLL_CHANGED" ->
            case Decode.decodeValue (Decode.field "payload" Decode.float) value of
                Ok _ -> NoOp
                Err _ -> NoOp
        -- Ok "ImportBook" ->
        --     case ( Decode.decodeValue (Decode.field "id" Decode.string) value
        --         , Decode.decodeValue (Decode.field "payload" decodeBook) value ) of
        --         ( Ok id, Ok book ) -> ImportBook id book
        --         _ -> NoOp
        -- Ok "ImportShelf" ->
        --     case ( Decode.decodeValue (Decode.field "id" Decode.string) value
        --         , Decode.decodeValue (Decode.field "payload" decodeShelf) value ) of
        --         ( Ok id, Ok shelf ) -> ImportShelf id shelf
        --         _ -> NoOp
        _ ->
            NoOp



-- MARK:履歴保存
notifyAndSave : Model -> ( Model, Cmd Msg )
notifyAndSave newModel =
    ( newModel, saveToStorage (JsonConverter.encodeModel newModel) )

-- 保存処理と共に追加のコマンドを実行する
notifyAndSaveWithCmd : Cmd Msg -> Model -> ( Model, Cmd Msg )
notifyAndSaveWithCmd additionalCmd newModel =
    ( newModel
    , Cmd.batch
        [ saveToStorage (JsonConverter.encodeModel newModel)
        , additionalCmd
        ]
    )

-- UNDOのための現状保存
updateAppState : AppState -> Model -> Model
updateAppState newPresent model =
    { model
        | past = List.take 100 (model.present :: model.past)
        , present = newPresent
        , future = []
    }

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

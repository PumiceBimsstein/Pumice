module JsonConverter 
    exposing
        ( encodeModel, decodeModel, encodeAppState, decodeAppState
        , encodeExportBook, encodeExportShelf, encodeExportAll
        , decodeBook, decodeShelf
        , stringToExportFormat
        )

import Json.Decode as Decode
import Json.Encode as Encode
import Random
import Type exposing (..)

-- MARK:エンコーダー

-- ローカルストレージ保存用
encodeModel : Model -> String
encodeModel model =
    encodeModelValue model
        |> Encode.encode 0

encodeModelValue : Model -> Encode.Value
encodeModelValue model =
    Encode.object
        [ ( "present", encodeAppState model.present )
        , ( "fontSize", encodeFontSize model.fontSize )
        , ( "colorTheme", encodeColorTheme model.colorTheme )
        , ( "renderStyle", encodeRenderStyle model.renderStyle )
        , ( "visibleHeadingLevel", encodeHeadingLevel model.visibleHeadingLevel )
        , ( "contentWidth", encodeContentWidth model.contentWidth )
        , ( "exportFormat", encodeExportFormat model.exportFormat )
        ]

-- 全体バックアップ用エクスポート
encodeExportAll : Model -> String
encodeExportAll model =
    Encode.object
        [ ( "type", Encode.string "all" )
        , ( "payload", encodeModelValue model )
        ]
        |> Encode.encode 0

-- encodeModel : Model -> String
-- encodeModel model =
--     Encode.object
--         [ ( "present", encodeAppState model.present )
--         , ( "fontSize", encodeFontSize model.fontSize )
--         , ( "colorTheme", encodeColorTheme model.colorTheme )
--         , ( "renderStyle", encodeRenderStyle model.renderStyle )
--         , ( "visibleHeadingLevel", encodeHeadingLevel model.visibleHeadingLevel )
--         , ( "contentWidth", encodeContentWidth model.contentWidth )
--         , ( "exportFormat", encodeExportFormat model.exportFormat )
--         ]
--         |> Encode.encode 0


-- AppStateのエンコーダーを新構造に合わせて定義します
encodeAppState : AppState -> Encode.Value
encodeAppState state =
    Encode.object
        [ ( "shelves", Encode.list encodeShelf state.shelves )
        , ( "currentShelfId", Encode.string state.currentShelfId )
        , ( "currentBookId", encodeMaybe Encode.string state.currentBookId )
        , ( "currentPageIndex", Encode.int state.currentPageIndex )
        , ( "currentHeading", Encode.list Encode.string state.currentHeading )
        ]

-- 本棚（Shelf）のエンコーダー
encodeShelf : Shelf -> Encode.Value
encodeShelf shelf =
    Encode.object
        [ ( "id", Encode.string shelf.id )
        , ( "name", Encode.string shelf.name )
        , ( "books", Encode.list encodeBook shelf.books )
        ]


encodeBook : Book -> Encode.Value
encodeBook book =
    Encode.object
        [ ( "id", Encode.string book.id )
        , ( "title", Encode.string book.title )
        , ( "pages", Encode.list encodePage book.pages )
        ]


encodePage : Page -> Encode.Value
encodePage page =
    Encode.object
        [ ( "id", Encode.string page.id )
        , ( "title", Encode.string page.title )
        , ( "content", Encode.string page.content )
        ]


-- MARK:デコーダー

-- andMapの定義
andMap : Decode.Decoder a -> Decode.Decoder (a -> b) -> Decode.Decoder b
andMap =
    Decode.map2 (|>)


-- Model全体のデコーダー
decodeModel : Decode.Decoder Model
decodeModel =
    Decode.succeed Model
        |> andMap (Decode.succeed []) -- past: 保存せず空リストで初期化
        |> andMap (Decode.field "present" decodeAppState) -- present: 保存データから復元
        |> andMap (Decode.succeed []) -- future: 保存せず空リストで初期化
        |> andMap (Decode.succeed (Random.initialSeed 0))
        |> andMap (Decode.succeed PageView) -- mainViewMode: 初期画面を指定
        |> andMap (Decode.succeed ViewMode) -- mode: 初期モードを指定
        |> andMap (Decode.succeed TocTab) -- sidebarTab: 初期タブを指定
        |> andMap (Decode.succeed NormalSidebar)
        |> andMap (Decode.succeed "") -- searchText: 空文字で初期化
        |> andMap (Decode.succeed Nothing) -- editing
        |> andMap (Decode.field "fontSize" decodeFontSize)
        |> andMap (Decode.field "colorTheme" decodeColorTheme)
        |> andMap (Decode.field "renderStyle" decodeRenderStyle)
        |> andMap (Decode.succeed 0)
        |> andMap (Decode.succeed [])
        |> andMap (Decode.succeed Nothing)
        |> andMap (Decode.succeed [])
        |> andMap (Decode.succeed "")
        |> andMap (Decode.oneOf [ Decode.field "visibleHeadingLevel" decodeHeadingLevel, Decode.succeed H3 ])
        |> andMap (Decode.oneOf [ Decode.field "contentWidth" decodeContentWidth, Decode.succeed Normal ])
        |> andMap (Decode.succeed False)
        |> andMap (Decode.succeed False)
        |> andMap (Decode.oneOf [ Decode.field "exportFormat" decodeExportFormat, Decode.succeed FormatTxt ])
        |> andMap (Decode.succeed Nothing)

decodeAppState : Decode.Decoder AppState
decodeAppState =
    Decode.oneOf
        [ 
        -- 古い形式（List Book）からのマイグレーション
          Decode.map (\books -> 
            { shelves = [ { id = "default-shelf", name = "Default Shelf", books = books } ]
            , currentShelfId = "default-shelf"
            , currentBookId = Nothing
            , currentPageIndex = 0
            , currentHeading = []
            }
          ) (Decode.list decodeBook)
        , -- 新しい3階層構造のデコード
          Decode.map5
            (\shelves shelfId bookId pageIdx maybeHeadings ->
                { shelves = shelves
                , currentShelfId = shelfId
                , currentBookId = bookId
                , currentPageIndex = pageIdx
                , currentHeading =
                    Maybe.withDefault [] maybeHeadings
                }
            )
            (Decode.field "shelves" (Decode.list decodeShelf))
            (Decode.field "currentShelfId" Decode.string)
            (Decode.field "currentBookId" (Decode.maybe Decode.string))
            (Decode.field "currentPageIndex" Decode.int)
            -- 型が合わなかったり、フィールドが存在しない場合はmaybeを先頭につけてデコード
            (Decode.maybe (Decode.field "currentHeading" (Decode.list Decode.string)))
        ]


-- 本棚（Shelf）のデコーダー
decodeShelf : Decode.Decoder Shelf
decodeShelf =
    Decode.map3 Shelf
        (Decode.field "id" Decode.string)
        (Decode.field "name" Decode.string)
        (Decode.field "books" (Decode.list decodeBook))


decodeBook : Decode.Decoder Book
decodeBook =
    Decode.map3 Book
        (Decode.field "id" Decode.string)
        (Decode.field "title" Decode.string)
        (Decode.field "pages" (Decode.list decodePage))


decodePage : Decode.Decoder Page
decodePage =
    Decode.map3 Page
        (Decode.field "id" Decode.string)
        (Decode.field "title" Decode.string)
        (Decode.field "content" Decode.string)


-- MARK:補助用エンコーダー・デコーダー
encodeFontSize : FontSize -> Encode.Value
encodeFontSize size =
    case size of
        Small -> Encode.string "Small"
        Medium -> Encode.string "Medium"
        Large -> Encode.string "Large"


decodeFontSize : Decode.Decoder FontSize
decodeFontSize =
    Decode.string
        |> Decode.andThen (\str ->
            case str of
                "Small" -> Decode.succeed Small
                "Large" -> Decode.succeed Large
                _ -> Decode.succeed Medium
           )


encodeColorTheme : ColorTheme -> Encode.Value
encodeColorTheme theme =
    case theme of
        Light -> Encode.string "Light"
        Dark -> Encode.string "Dark"
        Magical -> Encode.string "Magical"

-- Themeは保存していないので必ず「_」が選ばれる。
-- 実質的に起動時のThemeをここで決めている。
decodeColorTheme : Decode.Decoder ColorTheme
decodeColorTheme =
    Decode.string
        |> Decode.andThen (\str ->
            case str of
                "Dark"  -> Decode.succeed Dark
                "Light" -> Decode.succeed Light
                _ -> Decode.succeed Magical
           )


encodeRenderStyle : RenderStyle -> Encode.Value
encodeRenderStyle style =
    case style of
        Standard -> Encode.string "Standard"
        Minimal -> Encode.string "Minimal"
        Academic -> Encode.string "Academic"
        Mystical -> Encode.string "Mystical"


encodeHeadingLevel : HeadingLevel -> Encode.Value
encodeHeadingLevel level =
    case level of
        H1 ->
            Encode.string "H1"

        H2 ->
            Encode.string "H2"

        H3 ->
            Encode.string "H3"


encodeContentWidth : ContentWidth -> Encode.Value
encodeContentWidth width =
    case width of
        Narrow ->
            Encode.string "Narrow"

        Normal ->
            Encode.string "Normal"

        Wide ->
            Encode.string "Wide"

encodeExportFormat : ExportFormat -> Encode.Value
encodeExportFormat format =
    case format of
        FormatTxt ->
            Encode.string "txt"

        FormatMd ->
            Encode.string "md"

decodeRenderStyle : Decode.Decoder RenderStyle
decodeRenderStyle =
    Decode.string
        |> Decode.andThen (\str ->
            case str of
                "Minimal" -> Decode.succeed Minimal
                "Academic" -> Decode.succeed Academic
                "Mystical" -> Decode.succeed Mystical
                _ -> Decode.succeed Standard
           )


decodeHeadingLevel : Decode.Decoder HeadingLevel
decodeHeadingLevel =
    Decode.string
        |> Decode.andThen
            (\str ->
                case str of
                    "H1" ->
                        Decode.succeed H1

                    "H2" ->
                        Decode.succeed H2

                    "H3" ->
                        Decode.succeed H3

                    _ ->
                        Decode.succeed H1
            )


decodeContentWidth : Decode.Decoder ContentWidth
decodeContentWidth =
    Decode.string
        |> Decode.andThen
            (\str ->
                case str of
                    "Narrow" ->
                        Decode.succeed Narrow

                    "Wide" ->
                        Decode.succeed Wide

                    _ ->
                        Decode.succeed Normal
            )

decodeExportFormat : Decode.Decoder ExportFormat
decodeExportFormat =
    Decode.string
        |> Decode.map stringToExportFormat

encodeMaybe : (a -> Encode.Value) -> Maybe a -> Encode.Value
encodeMaybe encoder maybe =
    case maybe of
        Just value -> encoder value
        Nothing -> Encode.null



-- 本のエクスポート用
encodeExportBook : Book -> String
encodeExportBook book =
    Encode.object
        [ ( "type", Encode.string "book" )
        , ( "payload", encodeBook book )
        ]
        |> Encode.encode 0

-- 本棚のエクスポート用
encodeExportShelf : Shelf -> String
encodeExportShelf shelf =
    Encode.object
        [ ( "type", Encode.string "shelf" )
        , ( "payload", encodeShelf shelf )
        ]
        |> Encode.encode 0


stringToExportFormat : String -> ExportFormat
stringToExportFormat str =
    case str of
        "md" ->
            FormatMd

        _ ->
            FormatTxt
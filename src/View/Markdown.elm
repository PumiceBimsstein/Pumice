module View.Markdown exposing (render)

import Html exposing (Html, div, text, pre, node, h1, h2, h3)
import Html.Attributes exposing (class, id, attribute, style)
import Markdown.Block
import Markdown.Parser
import Markdown.Renderer
import Regex
import Type exposing (ColorTheme, FontSize, RenderStyle)
import View.MarkdownStyles as Styles
import Domain.Selector exposing (colorThemeToString)

-- レンダラーの設定
customRenderer : ColorTheme -> RenderStyle-> String -> Markdown.Renderer.Renderer (Html msg)
customRenderer theme renderStyle searchText=
    let
        default =
            Markdown.Renderer.defaultHtmlRenderer

        headingRenderer { level, rawText, children } =
            let
                slug =
                    rawText
                        |> String.toLower
                        |> String.replace " " "-"
                        |> String.replace "#" ""
                        |> String.replace "/" "-"
                        |> String.replace "\\" "-"
            in
            case level of
                Markdown.Block.H1 -> h1 [ id slug ] children
                Markdown.Block.H2 -> h2 [ id slug ] children
                Markdown.Block.H3 -> h3 [ id slug ] children
                _ ->
                    default.heading { level = level, rawText = rawText, children = children }
    in
    { default
        | heading = headingRenderer
        , text = \str -> Html.span [] (Styles.highlightText searchText str)
        , table = \children -> 
            Html.table 
                [ class "not-prose border-collapse w-full my-4" 
                -- 子要素の境界線スタイルをここで一括指定する（!importantなし）
                , class "[&_th]:border [&_td]:border [&_th]:p-2 [&_td]:p-2"
                ] 
                children
        , codeBlock =
            \block ->
                let
                    -- 言語指定の揺れを吸収（空白除去と小文字化）
                    lang =
                        block.language
                            |> Maybe.map (String.trim >> String.toLower)
                in
                case lang of
                    Just "math" ->
                        node "katex-display"
                            [ attribute "formula" block.body
                            , attribute "display-mode" "true"
                            , Styles.mathBlockStyle theme
                            ]
                            []

                    _ ->
                        let
                            combinedKey =
                                (Maybe.withDefault "none" block.language) ++ "_" ++ block.body
                        in
                        node "highlight-code"
                            [ attribute "code" block.body
                            , attribute "lang" (Maybe.withDefault "" block.language)
                            , attribute "theme" (colorThemeToString theme)
                            , attribute "update-key" combinedKey
                            , attribute "search-text" searchText
                            , class "not-prose"
                            , Styles.codeBlockStyle theme
                            , Html.Attributes.class  (" [&::-webkit-scrollbar]:w-2" )
                            , Html.Attributes.style "scrollbar-width" "thin"
                            ]
                            []

        , codeSpan =
            \content ->
                if String.startsWith "math " content then
                    let
                        formula =
                            String.dropLeft 5 content
                    in
                    node "katex-inline" [ attribute "formula" formula ] []
                else
                    node "highlight-code-span"
                        [ attribute "content" content
                        , attribute "search-text" searchText
                        , Styles.codeSpanStyle theme renderStyle
                        , class "not-prose"
                        ]
                        []
    }


preprocessMathForParser : String -> String
preprocessMathForParser input =
    -- 1. ``` で分割し、コードブロックの内外を分離する
    input
        |> String.split "```"
        |> List.indexedMap
            (\index part ->
                if modBy 2 index == 1 then
                    -- 奇数番目 = コードブロックの中身！一切手を加えず完全に保護
                    part

                else
                    -- 偶数番目 = 通常の文章領域！ここで数式を変換する
                    part
                        -- (A) ChatGPT / Gemini のブロック数式
                        -- バックスラッシュ2つ (\\[ ... \\]) と 1つ (\[ ... \]) の両方を置換
                        |> String.replace "\\\\[" "\n```math\n"
                        |> String.replace "\\\\]" "\n```\n"
                        |> String.replace "\\[" "\n```math\n"
                        |> String.replace "\\]" "\n```\n"
                        -- (B) ChatGPT / Gemini のインライン数式
                        -- \\( ... \\) および \( ... \) を置換
                        |> String.replace "\\\\(" "`math "
                        |> String.replace "\\\\)" "`"
                        |> String.replace "\\(" "`math "
                        |> String.replace "\\)" "`"
                        -- (C) Claude / Vibe / Gemini のブロック数式 $$ ... $$
                        |> replaceRegex "\\$\\$([\\s\\S]+?)\\$\\$"
                            (\m ->
                                case m.submatches of
                                    (Just formula) :: _ ->
                                        "\n```math\n" ++ String.trim formula ++ "\n```\n"

                                    _ ->
                                        m.match
                            )
                        -- (D) Claude / Vibe のインライン数式 $ ... $ (通貨記号を除外)
                        |> replaceRegex "(^|[^\\\\])\\$(?!\\s)(?!\\d+(?:\\.\\d+)?(?:\\s|〜|~|-|to))([^\\$\\n]+?)(?<!\\s)\\$(?!\\d)"
                            (\m ->
                                case m.submatches of
                                    (Just prefix) :: (Just formula) :: _ ->
                                        prefix ++ "`math " ++ formula ++ "`"

                                    _ ->
                                        m.match
                            )
            )
        -- 2. 再び ``` で結合して元の構造に戻す
        |> String.join "```"

-- 正規表現ヘルパー
replaceRegex : String -> (Regex.Match -> String) -> String -> String
replaceRegex pattern replacer target =
    case Regex.fromString pattern of
        Just regex ->
            Regex.replace regex replacer target

        Nothing ->
            target

render : ColorTheme -> RenderStyle -> FontSize -> String -> String -> Html msg
render theme style size searchText markdownRaw =
    if String.isEmpty (String.trim markdownRaw) then
        div [] []

    else
        let
            processedMarkdown =
                preprocessMathForParser markdownRaw

            parsed =
                Markdown.Parser.parse processedMarkdown

            topSpacer =
                div [ class "h-16 w-full" ] []

            bottomSpacer =
                div [ class "h-32 w-full" ] []
        in
        case parsed of
            Ok blocks ->
                case Markdown.Renderer.render (customRenderer theme style searchText) blocks of
                    Ok renderedHtmls ->
                        div (Styles.markdownContainer theme style size)
                            (topSpacer :: renderedHtmls ++ [ bottomSpacer ])

                    Err _ ->
                        viewPlainContent theme style size markdownRaw

            Err _ ->
                viewPlainContent theme style size markdownRaw


-- Markdownとして解析できない場合にそのままテキストを表示する補助関数
viewPlainContent : ColorTheme -> RenderStyle -> FontSize -> String -> Html msg
viewPlainContent theme style size raw =
    div (Styles.markdownContainer theme style size)
        [ div
            [ class "text-sm text-amber-700" ]
            [ text "Markdownの解析に失敗しました。データが正しくない可能性があります。" ]
        , pre [] [ text raw ]
        ]

-- 文字数制限専用の表示
-- viewLimitMessage : ColorTheme -> RenderStyle -> FontSize -> String -> Html msg
-- viewLimitMessage theme style size raw =
--     div (Styles.markdownContainer theme style size)
--         [ div
--             [ class "p-4 border border-amber-200 bg-amber-50 rounded mb-4" ]
--             [ div
--                 [ class "font-bold text-amber-800" ]
--                 [ text "プレビュー制限" ]
--             , div
--                 [ class "text-sm text-amber-700" ]
--                 [ text "このページは文字数（20,000字以上）が多いため、プレビューを制限しています。" ]
--             ]
--         , pre [] [ text raw ]
--         ]

{-
---
## メモ：Markdown解析失敗に関する対応

### 現象

* 短い文書でもMarkdownのレンダリングがスキップされる不具合が発生。
* JavaScript側ではデータ型は `string` と判定されている。

### 推測される原因

1. **不可視の制御文字**: 外部アプリからの貼り付け時に、`String.trim` では除去できない特殊な文字（ゼロ幅スペースやヌル文字等）が混入し、パーサーが構文エラーを起こしている。
2. **データの不純物**: JSオブジェクト（`Array` や `Object`）などが文字列として強引に流し込まれ、Markdownとして不正な形式になっている可能性。

### 現在の対策

* **表示の分離**: 「文字数超過（20,000字〜）」と「解析失敗（データ異常）」の判定を分離。
---
-}
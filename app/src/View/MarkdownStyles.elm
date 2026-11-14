module View.MarkdownStyles exposing
    ( codeBlockStyle
    , codeSpanStyle
    , markdownContainer
    , highlightText
    , mathBlockStyle
    )

import Html exposing (Attribute, Html)
import Html.Attributes exposing (attribute, class)
import Type exposing (ColorTheme(..), FontSize(..), RenderStyle(..))
import View.Style exposing (basecolors)



-- ============================================================
-- MARK: 公開関数
-- ============================================================


markdownContainer : ColorTheme -> RenderStyle -> FontSize -> List (Attribute msg)
markdownContainer theme style size =
    [ class "prose max-w-none"
    , class (themeMarkerClass theme)
    , class (styleMarkerClass style)
    , class (themeClasses theme style)
    , class (renderStyleClasses theme style size)
    , class (fontSizeClass size)
    , class (applyAccessibilityWeight style size)
    , class "animate-[fadeIn_0.1s_ease-out]"
    , paletteVariables (palette theme)
    ]


themeMarkerClass : ColorTheme -> String
themeMarkerClass theme =
    case theme of
        Magical ->
            "theme-magical"

        _ ->
            ""


styleMarkerClass : RenderStyle -> String
styleMarkerClass style =
    case style of
        Mystical ->
            "style-mystical"

        _ ->
            ""



-- ============================================================
-- MARK: パレット(色データのみ)
-- ============================================================


type alias Palette =
    { heading : String
    , strong : String
    , link : String -- リンク色。引用の左線にも使う
    , quoteText : String
    , hr : String
    , thText : String
    , thBg : String
    , thBorder : String
    , tdBorder : String
    }


palette : ColorTheme -> Palette
palette theme =
    case theme of
        Light ->
            { heading = "#c86d51"
            , strong = "#38332c"
            , link = "#b85d41"
            , quoteText = "#7a7267"
            , hr = "rgba(74,69,62,0.12)"
            , thText = "#38332c"
            , thBg = "#f3efe6"
            , thBorder = "rgba(74,69,62,0.12)"
            , tdBorder = "rgba(74,69,62,0.12)"
            }

        Dark ->
            { heading = "#C9A84C"
            , strong = "#ffffff"
            , link = "#C9A84C"
            , quoteText = "#6B6960"
            , hr = "#2A2A27"
            , thText = "#C9A84C"
            , thBg = "#171716"
            , thBorder = "#444444"
            , tdBorder = "#2A2A27"
            }

        Magical ->
            { heading = "#d9a74a"
            , strong = "#FFF2D6"
            , link = "#d9a74a"
            , quoteText = "#8b7355"
            , hr = "rgba(139,115,85,0.3)"
            , thText = "#d9a74a"
            , thBg = "transparent"
            , thBorder = "rgba(139,115,85,0.4)"
            , tdBorder = "rgba(139,115,85,0.2)"
            }


{-| パレットをCSS変数としてコンテナに付与する。
    Html.Attributes.style はカスタムプロパティ(--xxx)を設定できないため、
    style 属性の文字列として渡す。
-}
paletteVariables : Palette -> Attribute msg
paletteVariables p =
    attribute "style" <|
        String.join "; "
            [ "--md-heading:" ++ p.heading
            , "--md-strong:" ++ p.strong
            , "--md-link:" ++ p.link
            , "--md-quote-text:" ++ p.quoteText
            , "--md-hr:" ++ p.hr
            , "--md-th-text:" ++ p.thText
            , "--md-th-bg:" ++ p.thBg
            , "--md-th-border:" ++ p.thBorder
            , "--md-td-border:" ++ p.tdBorder
            ]



-- ============================================================
-- MARK: テーマ別クラス
-- ============================================================


themeClasses : ColorTheme -> RenderStyle -> String
themeClasses theme style =
    tw (baseClasses theme :: elementClasses ++ blockquoteClasses theme ++ themeExtras theme style)


{-| 背景・文字色・枠線色(テーマごとに固定)
-}
baseClasses : ColorTheme -> String
baseClasses theme =
    case theme of
        Light ->
            "bg-[#fbf8f5] text-[#4a453e] border-[rgba(74,69,62,0.12)]"

        Dark ->
            let
                c =
                    basecolors theme
            in
            tw [ c.bg, c.text, "border-[#2A2A27]" ]

        Magical ->
            "bg-[#0f0f1a] text-[#e0d5c0]/90 border-[#8b7355]/30"


{-| 要素ごとのクラス(全テーマ共通)。色は CSS 変数から受け取る。
    Tailwind は静的スキャンなので、クラス名は必ずリテラルで書く。
-}
elementClasses : List String
elementClasses =
    [ "[&_h1]:text-[color:var(--md-heading)]"
    , "[&_h2]:text-[color:var(--md-heading)]"
    , "[&_h3]:text-[color:var(--md-heading)]"
    , "[&_h4]:text-[color:var(--md-heading)]"
    , "[&_h5]:text-[color:var(--md-heading)]"
    , "[&_h6]:text-[color:var(--md-heading)]"
    , "[&_strong]:text-[color:var(--md-strong)]"
    , "[&_strong]:font-bold"
    , "[&_a]:text-[color:var(--md-link)]"
    , "[&_hr]:border-[color:var(--md-hr)]"
    , "[&_th]:text-[color:var(--md-th-text)]"
    , "[&_th]:bg-[color:var(--md-th-bg)]"
    , "[&_th]:border-[color:var(--md-th-border)]"
    , "[&_td]:border-[color:var(--md-td-border)]"
    ]


{-| Magical テーマは羊皮紙デザイン（css/magical.css）を使うため左線等を付与しない
-}
blockquoteClasses : ColorTheme -> List String
blockquoteClasses theme =
    case theme of
        Magical ->
            []

        _ ->
            [ "[&_blockquote]:border-l-[color:var(--md-link)]"
            , "[&_blockquote]:text-[color:var(--md-quote-text)]"
            , "[&_blockquote]:italic"
            ]


{-| テーマ固有の差分
-}
themeExtras : ColorTheme -> RenderStyle -> List String
themeExtras theme style =
    case theme of
        Light ->
            [ "[&_h1]:border-b-0"
            , "[&_h2]:border-b-0"
            , "[&_a]:underline-offset-4"
            , "[&_a]:decoration-[#b85d41]/30"
            , "hover:[&_a]:decoration-[#b85d41]"
            ]

        Dark ->
            [ "[&_h1]:border-b-0"
            , "[&_h2]:border-b-0"
            , "[&_a]:no-underline"
            , "hover:[&_a]:text-[#E8E6E0]"
            ]

        Magical ->
            [ "[&_h2]:border-b-[#d9a74a]/25"
            , "[&_a]:no-underline"
            , "hover:[&_a]:underline"
            ]
                ++ magicalH1Decoration style


magicalH1Decoration : RenderStyle -> List String
magicalH1Decoration style =
    case style of
        Academic ->
            [ "[&_h1]:border-b-[#d9a74a]/30"
            , "[&_h1]:bg-gradient-to-r"
            , "[&_h1]:from-transparent"
            , "[&_h1]:via-[#d9a74a]/80"
            , "[&_h1]:to-transparent"
            , "[&_h1]:bg-[length:100%_1px]"
            , "[&_h1]:bg-bottom"
            , "[&_h1]:bg-no-repeat"
            ]

        Mystical ->
            -- 中央70%のフェード線は css/magical.css (.style-mystical h1::after) で描画
            [ "[&_h1]:border-b-0" ]

        _ ->
            [ "[&_h1]:border-b-0" ]



-- ============================================================
-- MARK: レンダリングスタイル・フォントサイズ
-- ============================================================


renderStyleClasses : ColorTheme -> RenderStyle -> FontSize -> String
renderStyleClasses theme style fontSize =
    let
        headSizeClass =
            headingSizeClass fontSize
    in
    case style of
        Standard ->
            tw
                [ "font-sans leading-relaxed"
                , "prose-h1:pb-2 prose-h1:border-b-0"
                , headSizeClass
                , "prose-ul:list-disc prose-ol:list-decimal"
                ]

        Minimal ->
            tw
                [ "font-sans font-light tracking-tight"
                , "prose-p:leading-snug prose-p:mb-3"
                , "prose-h1:font-normal prose-h1:mb-4 prose-h1:border-b-0"
                , "prose-h2:font-normal"
                , "prose-h3:font-normal"
                , headSizeClass
                , "prose-ul:list-none prose-ul:pl-0"
                ]

        Academic ->
            tw
                [ "font-serif leading-normal"
                , "prose-h1:text-center prose-h1:not-italic prose-h1:mb-8 prose-h1:border-b-0 prose-h1:pb-3"
                , headSizeClass
                , "prose-p:text-justify prose-p:indent-4"
                , "prose-ul:list-square"
                ]

        Mystical ->
            let
                mysticalBlockquote =
                    case theme of
                        Magical ->
                            ""

                        _ ->
                            "prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:not-italic"
            in
            tw
                [ "prose-h1:not-italic prose-h1:font-bold prose-h1:text-center prose-h1:border-b-0 prose-h1:mb-10"
                , "prose-h2:not-italic prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2"
                , "prose-h3:not-italic prose-h3:font-bold"
                , headSizeClass
                , "prose-p:leading-[1.85] prose-p:mb-6"
                , "prose-strong:not-italic prose-strong:font-bold"
                , "prose-ul:list-none prose-ul:pl-0"
                , "prose-ol:list-decimal prose-ol:pl-6"
                , mysticalBlockquote
                ]


headingSizeClass : FontSize -> String
headingSizeClass fontSize =
    case fontSize of
        Small ->
            "prose-h1:text-2xl prose-h2:text-lg prose-h3:text-base prose-h4:text-base prose-h5:text-base prose-h6:text-base"

        Medium ->
            "prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-base prose-h6:text-base"

        Large ->
            "prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-lg prose-h5:text-base prose-h6:text-base"


fontSizeClass : FontSize -> String
fontSizeClass size =
    case size of
        Small ->
            "text-sm prose-sm"

        Medium ->
            "text-lg prose-lg"

        Large ->
            "text-2xl prose-2xl"


{-| 特定のレンダリングスタイルにおいて、
小さいフォントサイズでも視認性を確保するための補助関数
-}
applyAccessibilityWeight : RenderStyle -> FontSize -> String
applyAccessibilityWeight style size =
    case ( style, size ) of
        ( Academic, Small ) ->
            "font-bold antialiased tracking-wide"

        ( Minimal, Small ) ->
            "font-bold antialiased tracking-tight"

        ( Mystical, Small ) ->
            "antialiased tracking-wider"

        _ ->
            ""



-- ============================================================
-- MARK: コードスパン / コードブロック / 数式
-- ============================================================


codeSpanStyle : ColorTheme -> RenderStyle -> Attribute msg
codeSpanStyle theme _ =
    let
        common =
            "px-1.5 py-0.5 mx-0.5 border font-mono"
    in
    case theme of
        Light ->
            class (tw [ common, "bg-[#f4efe6] text-[#24292e] border-gray-300 rounded" ])

        Dark ->
            class (tw [ common, (basecolors theme).surface, "text-[#d2691e] border-[#3A3A36] [&_code]:text-[#54cfe8] rounded" ])

        Magical ->
            -- css/magical.css の .theme-magical highlight-code-span でスタイル適用
            class ""


codeBlockStyle : ColorTheme -> Attribute msg
codeBlockStyle theme =
    let
        common =
            "my-4 overflow-x-auto border block font-mono min-h-[3rem]"
    in
    case theme of
        Light ->
            class
                (tw
                    [ common
                    , "bg-[#f4efe6]"
                    , "text-[#3c4043]"
                    , "rounded-lg"
                    , "border-[#dadce0]"
                    , "[&_code]:text-[#3c4043]"
                    ]
                )

        Dark ->
            class
                (tw
                    [ common
                    , (basecolors theme).surface
                    , "text-[#E8E6E0]"
                    , "bg-[#171716]"
                    , "rounded-lg"
                    , "border-[#3A3A36]"
                    , "[&_code]:text-[#E8E6E0]"
                    ]
                )

        Magical ->
            -- css/magical.css の .theme-magical highlight-code で羊皮紙スタイルを適用
            class "block overflow-x-auto min-h-[3rem]"


mathBlockStyle : ColorTheme -> Attribute msg
mathBlockStyle theme =
    let
        colors =
            case theme of
                Light ->
                    "text-gray-900"

                Dark ->
                    "text-gray-100"

                Magical ->
                    "text-[#d9a74a]"
    in
    class (tw [ "not-prose", "my-6", "block", "overflow-x-auto", colors ])



-- ============================================================
-- MARK: 検索結果ハイライト
-- ============================================================


highlightText : String -> String -> List (Html msg)
highlightText query txt =
    if String.isEmpty query then
        [ Html.text txt ]

    else
        case String.indices (String.toLower query) (String.toLower txt) |> List.head of
            Nothing ->
                [ Html.text txt ]

            Just idx ->
                let
                    end =
                        idx + String.length query
                in
                Html.text (String.left idx txt)
                    :: Html.span
                        [ class "bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white" ]
                        [ Html.text (String.slice idx end txt) ]
                    :: highlightText query (String.dropLeft end txt)



-- ============================================================
-- MARK: ユーティリティ
-- ============================================================


tw : List String -> String
tw classes =
    String.join " " classes

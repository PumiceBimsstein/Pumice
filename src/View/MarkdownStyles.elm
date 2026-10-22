module View.MarkdownStyles exposing
    ( codeBlockStyle
    , codeSpanStyle
    , markdownContainer
    , highlightText
    , mathBlockStyle
    )

import Html exposing (Attribute, Html)
import Html.Attributes exposing (class)
import Type exposing (ColorTheme(..), FontSize(..), RenderStyle(..))
import View.Style as Style exposing (..)


markdownContainer : ColorTheme -> RenderStyle -> FontSize -> List (Attribute msg)
markdownContainer theme style size =
    [ class "prose max-w-none"
    , class (themeColors theme style)
    , class (renderStyleClasses style size)
    , class (fontSizeClass size)
    -- 特定のスタイルとサイズの組み合わせに対する補正
    , class (applyAccessibilityWeight style size)
    , class "animate-[fadeIn_0.1s_ease-out]"
    ]


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
            "font-bold antialiased not-italic tracking-wider"

        _ ->
            ""



themeColors : ColorTheme -> RenderStyle -> String
themeColors theme style =
    case theme of
        Light ->
            let
                base = basecolors theme
                common = "bg-[#fbf8f5] text-[#4a453e] border-[rgba(74,69,62,0.12)]"
                elements =
                    [ "[&_h1]:text-[#c86d51] [&_h1]:border-b-0"
                    , "[&_h2]:text-[#c86d51] [&_h2]:border-b-0"
                    , "[&_h3]:text-[#c86d51]"
                    , "[&_h4]:text-[#c86d51]"
                    , "[&_h5]:text-[#c86d51]"
                    , "[&_h6]:text-[#c86d51]"
                    , "[&_strong]:text-[#38332c]"
                    , "[&_strong]:font-bold"
                    , "[&_a]:text-[#b85d41]"
                    , "[&_a]:underline-offset-4"
                    , "[&_a]:decoration-[#b85d41]/30"
                    , "hover:[&_a]:decoration-[#b85d41]"
                    , "[&_blockquote]:border-l-[#b85d41]"
                    , "[&_blockquote]:text-[#7a7267]"
                    , "[&_blockquote]:italic"
                    , "[&_hr]:border-[rgba(74,69,62,0.12)]"
                    , "[&_th]:text-[#38332c]"
                    , "[&_th]:bg-[#f3efe6]"
                    , "[&_th]:border-[rgba(74,69,62,0.12)]"
                    , "[&_td]:border-[rgba(74,69,62,0.12)]"
                    ]
            in
            --String.join " " (common :: elements)
            tw (common :: elements)

        Dark ->
            let
                c = basecolors theme
                --common = "bg-[#0F0F0E] text-[#D3D3D3] border-[#2A2A27]"
                common = tw [c.bg, c.text, "border-[#2A2A27]"]
                elements =
                    tw [ "[&_h1]:text-[#C9A84C] [&_h1]:border-b-0"
                    , "[&_h2]:text-[#C9A84C] [&_h2]:border-b-0"
                    , "[&_h3]:text-[#C9A84C]"
                    , "[&_h4]:text-[#C9A84C]"
                    , "[&_h5]:text-[#C9A84C]"
                    , "[&_h6]:text-[#C9A84C]"
                    , "[&_strong]:text-white"
                    , "[&_strong]:font-bold"
                    , "[&_a]:text-[#C9A84C]"
                    , "[&_a]:no-underline"
                    , "hover:[&_a]:text-[#E8E6E0]" --transition-colors"
                    , "[&_blockquote]:border-l-[#C9A84C]"
                    , "[&_blockquote]:text-[#6B6960]"
                    , "[&_blockquote]:italic"
                    , "[&_hr]:border-[#2A2A27]"
                    , "[&_th]:text-[#C9A84C]"
                    , "[&_th]:bg-[#171716]"
                    , "[&_th]:border-[#444]"
                    , "[&_td]:border-[#2A2A27]"
                    ]
            in
            tw [common, elements]

        Magical ->
            let
                common = "bg-[#0f0f1a] text-[#e0d5c0]/90 border-[#8b7355]/30"

                h1Decoration =
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
                            [ "[&_h1]:border-b-[#d9a74a]/30"
                            , "[&_h1]:bg-gradient-to-r"
                            , "[&_h1]:from-transparent"
                            , "[&_h1]:via-[#d9a74a]/80"
                            , "[&_h1]:to-transparent"
                            , "[&_h1]:bg-[length:100%_1px]"
                            , "[&_h1]:bg-bottom"
                            , "[&_h1]:bg-no-repeat"
                            ]

                        _ ->
                            [ "[&_h1]:border-b-0" ]
                
                elements =
                    h1Decoration ++
                    [ "[&_h1]:text-[#d9a74a]"
                    , "[&_h1]:opacity-80"
                    , "[&_h2]:text-[#d9a74a] [&_h2]:border-b-[#d9a74a]/20 [&_h2]:opacity-80"
                    , "[&_h3]:text-[#d9a74a] [&_h3]:opacity-80"
                    , "[&_h4]:text-[#d9a74a] [&_h4]:opacity-80"
                    , "[&_h5]:text-[#d9a74a] [&_h5]:opacity-80"
                    , "[&_h6]:text-[#d9a74a] [&_h6]:opacity-80"
                    , "[&_strong]:text-[#e0d5c0]"
                    , "[&_strong]:font-bold"
                    , "[&_a]:text-[#d9a74a]"
                    , "[&_a]:no-underline"
                    , "hover:[&_a]:underline"
                    , "[&_blockquote]:border-l-[#d9a74a]"
                    , "[&_blockquote]:text-[#8b7355]"
                    , "[&_blockquote]:italic"
                    , "[&_hr]:border-[#8b7355]/30"
                    , "[&_th]:text-[#d9a74a]"
                    , "[&_th]:border-[#8b7355]/40"
                    , "[&_td]:border-[#8b7355]/20"
                    ]
            in
            tw (common :: elements)


-- MARK:検索結果ハイライト
highlightText : String -> String -> List (Html msg)
highlightText query txt =
    if String.isEmpty query then
        [ Html.text txt ]

    else
        let
            lowerQuery = String.toLower query
            lowerTxt = String.toLower txt
        in
        case String.indices lowerQuery lowerTxt |> List.head of
            Nothing ->
                [ Html.text txt ]

            Just idx ->
                let
                    before = String.left idx txt
                    matched = String.slice idx (idx + String.length query) txt
                    after = String.dropLeft (idx + String.length query) txt
                in
                Html.text before
                    :: Html.span
                        [ class "bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white" ]
                        [ Html.text matched ]
                    :: highlightText query after

renderStyleClasses : RenderStyle -> FontSize -> String
renderStyleClasses style fontSize =
    let
        headSizeClass =
            case fontSize of
                Small  -> "prose-h1:text-2xl prose-h2:text-lg prose-h3:text-base prose-h4:text-base prose-h5:text-base prose-h6:text-base"
                Medium -> "prose-h1:text-3xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-base prose-h6:text-base"
                Large  -> "prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-lg prose-h5:text-base prose-h6:text-base"
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
                , "prose-p:leading-snug prose-p:mb-3" -- 行間を狭く
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
            tw
                [ "font-serif italic leading-loose tracking-wide"
                , "prose-h1:not-italic prose-h1:font-bold prose-h1:tracking-widest prose-h1:text-center prose-h1:border-b prose-h1:pb-3 prose-h1:mb-8"
                , "prose-h2:not-italic prose-h2:font-semibold prose-h2:tracking-wider"
                , "prose-h3:not-italic prose-h3:font-medium"
                , headSizeClass
                , "prose-p:leading-loose prose-p:mb-6"
                , "prose-strong:not-italic prose-strong:font-bold"
                , "prose-ul:list-none prose-ul:pl-0"
                , "prose-ol:list-decimal prose-ol:pl-6"
                , "prose-blockquote:border-l-2 prose-blockquote:pl-6 prose-blockquote:not-italic"
                ]


fontSizeClass : FontSize -> String
fontSizeClass size =
    case size of
        Small -> "text-sm prose-sm"
        Medium -> "text-lg prose-lg"
        Large -> "text-2xl prose-2xl"


-- MARK:コードスパン
codeSpanStyle : ColorTheme -> RenderStyle -> Attribute msg
codeSpanStyle theme _ =
    let
        common = "px-1.5 py-0.5 mx-0.5 border font-mono"-- font-bold
        colors =
            case theme of
                Light   -> "bg-[#f4efe6] text-[#24292e] border-gray-300 rounded"
                Dark    -> tw [(basecolors theme).surface, "text-[#d2691e] border-[#3A3A36] [&_code]:text-[#54cfe8] rounded"]
                Magical -> "bg-[#1a1a2e] text-[#a07d42] border-[#8b7355]/40 [&_code]:text-[#a07d42]"
    in
    class (common ++ " " ++ colors)

-- MARK:コードブロック
codeBlockStyle : ColorTheme -> Attribute msg
codeBlockStyle theme =
    let
        c = basecolors theme
        common = "my-4 overflow-x-auto border block font-mono min-h-[3rem]"
        colors =    -- highlight.jsが効かなかった場合はここの設定が反映される
            case theme of
                Light -> 
                    tw  ["bg-[#f4efe6]", "text-[#3c4043]", "rounded-lg"--edeef1--f4efe6
                        , "border-[#dadce0]", "[&_code]:text-[#3c4043]"]
                Dark -> 
                    tw  [ c.surface, "text-[#E8E6E0]", "bg-[#171716]"
                        , "rounded-lg"
                        , "border-[#3A3A36]", "[&_code]:text-[#E8E6E0]"]
                Magical -> 
                    tw  ["bg-[#1a1a2e]", "text-[#a07d42]"
                        , "border-[#8b7355]/40", "[&_code]:text-[#a07d42]"]
    in
    class (common ++ " " ++ colors)


tw : List String -> String
tw classes =
    String.join " " classes


mathBlockStyle : ColorTheme -> Attribute msg
mathBlockStyle theme =
    let
        colors =
            case theme of
                Light ->
                    tw [ "text-gray-900" ]

                Dark ->
                    tw [ "text-gray-100" ]

                Magical ->
                    tw [ "text-[#d9a74a]" ]
    in
    class (tw [ "not-prose", "my-6", "block", "overflow-x-auto", colors ])
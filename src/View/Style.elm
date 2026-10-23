module View.Style exposing (..)

import Type exposing (..)
import Domain.Helper exposing (..)
import Html.Attributes exposing (..)
import Html exposing (Attribute, Html)
import Svg exposing (svg, path)
import Svg.Attributes exposing (viewBox, fill, stroke, strokeWidth, strokeLinecap, strokeLinejoin, d)


type alias ThemeColors =
    { text : String
    , deco : String
    , accent : String
    , textMuted : String
    , bg : String
    , surface : String
    , brightAccent : String
    , primary : String
    , searchbg : String
    , border : String
    , borderBtn : String
    , borderUnder : String
    , borderStrong : String
    , rounded : String
    , scrollThumb : String
    , scrollTrack : String
    , fontDeco : String
    , fontMono : String
    }


-- themeごとの基本色
basecolors : ColorTheme -> ThemeColors
basecolors theme =
    case theme of
        Light ->
            { text         = "text-[#2D2A26]"
            , deco         = "text-white"
            , accent       = "text-[#C86D51]"
            , textMuted    = "text-[#7A7870]"
            , bg           = "bg-[#FBF8F5]"
            , surface      = "bg-[#E9E3DB]"
            , brightAccent = "bg-[#DCD4C9]"
            , primary      = "bg-[#C86D51]"
            , searchbg     = "bg-[#C86D51]"
            , border       = "border-[#F5F4F0]"
            , borderBtn    = "border-[#c6c3be]"
            , borderUnder  = "border-[#C86D51]"
            , borderStrong = "border-[#C86D51]"
            , rounded      = "rounded-lg"
            , scrollThumb  = "#C86D51"
            , scrollTrack  = "#FAFAF8"
            , fontDeco     = "'DM Sans', sans-serif"
            , fontMono     = "'DM Mono', monospace"
            }

        Dark ->
            { text         = "text-zinc-300"        -- 本文
            , deco         = "text-[#333]"          -- ボタン
            , accent       = "text-[#BBB9B0]"       -- アクセント
            , textMuted    = "text-[#8B8980]"       -- ラベル
            , bg           = "bg-zinc-900"          -- ページ背景
            , surface      = "bg-[#151515]"         -- パネル・サイドバー背景
            , brightAccent = "bg-[#303030]"         -- サイドバーボタン
            , primary      = "bg-[#C8A74B]"         -- ボタンアクセント
            , searchbg     = "bg-yellow-200"        -- 検索ボックス背景
            , border       = "border-[#171716]"
            , borderBtn    = "border-[#505050]"
            , borderUnder  = "border-[#333]"
            , borderStrong = "border-[#C9A84C]"
            , rounded      = "rounded"
            , scrollThumb  = "#969696"
            , scrollTrack  = "#0F0F0E"
            , fontDeco     = "'DM Sans', sans-serif"
            , fontMono     = "'DM Mono', monospace"
            }

        Magical ->
            { text         = "text-[#E0D5C0]"
            , deco         = "text-amber-100"
            , accent       = "text-[#D9A74A]"
            , textMuted    = "text-[#A07D42]"
            , bg           = "bg-[#0F0F1A]"
            , surface      = "bg-[#1A1A2E]"
            , brightAccent = "bg-[#1A1A2E]"
            , primary      = "bg-[#8B7355]"
            , searchbg     = "bg-[#c8a74b]/70"
            , border       = "border-[#8B7355]"
            , borderBtn    = "border-[#8B7355]"
            , borderUnder  = "border-[#8B7355]"
            , borderStrong = "border-[#D9A74A]"
            , rounded      = ""
            , scrollThumb  = "#A07D42"
            , scrollTrack  = "#0F0F1A"
            , fontDeco     = "'Cormorant Garamond', serif"
            , fontMono     = "'JetBrains Mono', monospace"
            }


-- Tailwindのクラスリストを結合する
tw : List String -> String
tw classes =
    String.join " " classes




scrollbarStyle : ColorTheme -> List (Attribute msg)
scrollbarStyle theme =
-- スクロールバーのスタイルはWebkit系とFirefox系の二種類必要
    let
        thumb = (basecolors theme).scrollThumb
        track = (basecolors theme).scrollTrack
    in
    [ -- Webkit系: Tailwindの任意値（Arbitrary Values）を使用
      Html.Attributes.class 
        (" [&::-webkit-scrollbar]:w-2"
            ++ " [&::-webkit-scrollbar-thumb]:bg-[" ++ thumb ++ "]"
            ++ " [&::-webkit-scrollbar-track]:bg-[" ++ track ++ "]"
        )
    -- Firefox系: インラインスタイル
    , style "scrollbar-width" "thin"
    , style "scrollbar-color" (thumb ++ " " ++ track)
    ]


buttonBaseStyle : ColorTheme -> ButtonKind -> String
buttonBaseStyle theme kind =
    let
        base =
            [ "transition-all"
            , "duration-200"
            , "active:scale-95"
            , "flex"
            , "items-center"
            , "justify-center"
            ]
        kindStyles =
            case kind of
                Delete ->
                    [ "text-red-500", "p-1"
                    ]
                Create ->
                    [ (basecolors theme).bg, (basecolors theme).text
                    , (basecolors theme).border
                    , "hover:bg-white/25"
                    , "border-2", "rounded-lg"
                    , "p-4", "px-4", "py-2", "w-full", "aspect-[3/4]"
                    ]
                CreateCard ->
                    [ "mt-8"
                    , "w-1/3"
                    , "p-4"
                    , "border-2", "border-solid"
                    , "text-sm"
                    , "font-bold"
                    , "hover:opacity-80"
                    , "shadow-sm"
                    , (basecolors theme).border
                    , (basecolors theme).rounded
                    , (basecolors theme).text
                    ]
                DeleteButton ( top, right ) ->
                    [ "absolute"
                    , "top-" ++ String.fromInt top
                    , "right-" ++ String.fromInt right
                    , (basecolors theme).text
                    , "p-2"
                    , "hover:text-red-500"
                    ]
                ExportMini ->
                    [ "px-1"
                    , "text-[12px]"
                    , "font-bold"
                    , "uppercase"
                    , "hover:bg-white/10"
                    , "transition-colors"
                    , (basecolors theme).textMuted
                    , "border", "rounded-sm", (basecolors theme).border
                    ]
    in
    tw (base ++ kindStyles)


icon : List String -> String -> Html msg
icon pathList classStr =
    svg
        [ viewBox "0 0 512 512"
        , fill "currentColor"
        , stroke "currentColor"
        , strokeWidth "20"
        , strokeLinecap "round"
        , strokeLinejoin "round"
        , Svg.Attributes.class (classStr ++ " block shrink-0")
        ]
        (List.map (\pathData -> path [ d pathData ] []) pathList)

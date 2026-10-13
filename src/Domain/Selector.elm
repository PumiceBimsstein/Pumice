module Domain.Selector exposing (..)

import Type exposing (..)
import Browser.Dom
import Task
import Html.Attributes exposing (..)
import Html.Events exposing (on, preventDefaultOn)
import Html exposing (Attribute)
import Json.Decode as Decode
import JsonConverter exposing (decodeBook, decodeShelf)


-- スタイルの切り替えに関連する関数群
colorThemeToString : ColorTheme -> String
colorThemeToString theme =
    case theme of
        Light   -> "Light"
        Dark    -> "Dark"
        Magical -> "Magical"

renderStyleToString : RenderStyle -> String
renderStyleToString style =
    case style of
        Minimal  -> "Minimal"
        Academic -> "Academic"
        Standard -> "Standard"
        Mystical -> "Mystical"

fontSizeToString : FontSize -> String
fontSizeToString size =
    case size of
        Small  -> "Small"
        Medium -> "Medium"
        Large  -> "Large"

applyColorTheme : String -> Model -> Model
applyColorTheme themeStr model =
    let
        newTheme =
            case themeStr of
                "Light"   -> Light
                "Dark"    -> Dark
                "Magical" -> Magical
                _ -> model.colorTheme
    in
    { model | colorTheme = newTheme }

applyRenderStyle : String -> Model -> Model
applyRenderStyle styleStr model =
    let
        newStyle =
            case styleStr of
                "Minimal"  -> Minimal
                "Academic" -> Academic
                "Mystical" -> Mystical
                _          -> Standard
    in
    { model | renderStyle = newStyle }

applyFontSize : String -> Model -> Model
applyFontSize sizeStr model =
    let
        newSize =
            case sizeStr of
                "Small" -> Small
                "Large" -> Large
                _       -> Medium
    in
    { model | fontSize = newSize }


fontSizeToNumber : FontSize -> Int
fontSizeToNumber size =
    case size of
        Small -> 14
        Medium -> 18
        Large -> 24


getSiblingTheme : ColorTheme -> ( ColorTheme, ColorTheme )
getSiblingTheme current =
    case current of
        Light   -> ( Magical, Dark )
        Dark    -> ( Light, Magical )
        Magical -> ( Dark, Light )


getSiblingRenderStyle : RenderStyle -> ( RenderStyle, RenderStyle )
getSiblingRenderStyle current =
    case current of
        Standard -> ( Mystical, Minimal )
        Minimal  -> ( Standard, Academic )
        Academic -> ( Minimal, Mystical )
        Mystical -> ( Academic, Standard )


getSiblingFontSize : FontSize -> ( FontSize, FontSize )
getSiblingFontSize current =
    case current of
        Small  -> ( Large, Medium )
        Medium -> ( Small, Large )
        Large  -> ( Medium, Small )


-- MARK:見出しセレクター
headingLevelToString : HeadingLevel -> String
headingLevelToString level =
    case level of
        H1 -> "H1"
        H2 -> "H2"
        H3 -> "H3"

stringToHeadingLevel : String -> HeadingLevel
stringToHeadingLevel str =
    case str of
        "H1" -> H1
        "H2" -> H2
        _ -> H3

getSiblingHeadingLevel : HeadingLevel -> ( HeadingLevel, HeadingLevel )
getSiblingHeadingLevel level =
    case level of
        H1 -> ( H3, H2 )
        H2 -> ( H1, H3 )
        H3 -> ( H2, H1 )

-- MARK:エクスポートセレクター
exportFormatToString : ExportFormat -> String
exportFormatToString format =
    case format of
        FormatTxt ->
            "txt"

        FormatMd ->
            "md"
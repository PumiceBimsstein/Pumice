module View.SideBarContents exposing (sidebarContent)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Style as Style exposing (..)
import Domain.Helper exposing (..)
import Domain.Selector exposing (..)
import Icon exposing (..)
import View.ViewHelper exposing (viewBaseSelector)
import View.SideBookList exposing (viewBookList)
import View.SideShelfList exposing (viewSidebarShelfList)
import View.SideTocList exposing (viewToc)


-- MARK:コンテンツ一覧

sidebarContent : Model -> AppState -> Html Msg
sidebarContent model present =
    nav
        ((class (sidebarContentStyle model.colorTheme))
            :: scrollbarStyle model.colorTheme
        )
        [ case model.sidebarTab of
            ShelfListTab ->
                tabShelfList model present

            BookListTab ->
                tabBookList model present

            TocTab ->
                tabTocList model present
        ]

sidebarContentStyle : ColorTheme -> String
sidebarContentStyle theme =
        tw ["block flex-1 overflow-y-auto", (basecolors theme).surface]

tabShelfList : Model -> AppState -> Html Msg
tabShelfList model present =
    div []
        [ div
            [ class "flex justify-center mt-2"
            ]
            [ viewSidebarActionButton model True ]
        , viewSidebarShelfList model present
        ]


-- 各種アイテム作成ボタン
viewSidebarActionButton : Model -> Bool -> Html Msg
viewSidebarActionButton model isFullSize =
    let
        page =
            getCurrentBook model.present
                |> Maybe.map (.pages >> List.length)
                |> Maybe.withDefault 0

        ( label, msg ) =
            case model.sidebarTab of
                ShelfListTab -> ( "+ New Shelf", CreateShelf )
                BookListTab  -> ( "+ Book", CreateBook )
                TocTab       -> ( "+ Page", CreatePage page )
        sizeClass =
            if isFullSize then
                "w-1/2 py-0.5 px-2 text-xs"
            else
                "w-auto py-0.5 px-2 text-xs"
    in
    button
        [ class (addBtnStyle model.colorTheme)
        , class sizeClass
        , onClick msg
        ]
        [ text label ]


addBtnStyle : ColorTheme -> String
addBtnStyle theme =
    tw  [ "uppercase", "border"
        , "items-center", "justify-center"
        , "w-1/2", "mx-auto"
        , "py-1", "px-4", "text-xs"
        , (basecolors theme).primary
        , (basecolors theme).deco
        , (basecolors theme).border
        , (basecolors theme).rounded
        ]


-- MARK:BookList
tabBookList : Model -> AppState -> Html Msg
tabBookList model present =
    div []
        [ div
            [ class "flex items-center justify-between p-1 py-3" ]
            [ span
                [ class (shelfBookName model.colorTheme)
                , style "font-family" (basecolors model.colorTheme).fontDeco
                ]
                [ text 
                    (getCurrentShelf present 
                        |> Maybe.map .name 
                        |> Maybe.withDefault "本棚未選択")
                ]
            , viewSidebarActionButton model False
            ]
        , viewBookList model present
        ]


shelfBookName : ColorTheme -> String
shelfBookName theme =
    tw  [ "truncate text-sm font-bold"
        , "flex-1", "text-center", "border-b", "mx-1"
        , "opacity-80"
        , (basecolors theme).borderStrong
        , (basecolors theme).accent
        ]


-- MARK:TocList
tabTocList : Model -> AppState -> Html Msg
tabTocList model present =
    div [ class (tw [ "flex", "flex-col", "h-full", "pt-2" ]) ]
        [ div
            (class (tw [ "flex-1", "overflow-y-auto" ]) :: Style.scrollbarStyle model.colorTheme)
            [ viewToc model present ]
        , viewSidebarActionButton model False
        , headingLevelSelector model
        ]


-- MARK: 見出しセレクター
headingLevelSelector : Model -> Html Msg
headingLevelSelector model =
    div
        [ class selectorwrapper
        , title "Heading Level Select"
        ]
        [ p [ class (selectorLabel model.colorTheme) ] [ text "HEADING LEVEL" ]
        , viewBaseSelector
            setHeadingLevel
            headingLevelToString
            getSiblingHeadingLevel
            [ class (headingSelectorStyle model.colorTheme)
            , style "font-family" (basecolors model.colorTheme).fontDeco
            ]
            model.visibleHeadingLevel
            [ H1, H2, H3 ]           
        ]

selectorwrapper : String
selectorwrapper =
        tw  [ "w-full", "h-8", "shrink-0", "flex"
            , "items-center", "gap-2", "px-3", "py-2" ]

selectorLabel : ColorTheme -> String
selectorLabel theme =
    let
        c = basecolors theme
    in
    tw
        [ "text-xs", "flex-1"
        , "font-semibold"
        , "uppercase"
        , "tracking-wide"
        , "text-right"
        , "h-8"
        , "flex"
        , "items-center"
        , "justify-end"
        , c.textMuted
        ]

setHeadingLevel : String -> Msg
setHeadingLevel str =
    SetVisibleHeadingLevel (stringToHeadingLevel str)

headingSelectorStyle : ColorTheme -> String
headingSelectorStyle theme =
        tw  [ "border", "px-3", "py-1", "mb-1"
            , "text-sm", "outline-none", "h-8", "w-18"
            , (basecolors theme).brightAccent
            , (basecolors theme).borderBtn
            , (basecolors theme).rounded
            , (basecolors theme).textMuted
            ]
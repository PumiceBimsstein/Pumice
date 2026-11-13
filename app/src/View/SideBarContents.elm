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

sidebarContent : Model -> Html Msg
sidebarContent model =
    nav
        ((class (sidebarContentStyle model.colorTheme))
            :: scrollbarStyle model.colorTheme
        )
        [ case model.sidebarTab of
            ShelfListTab ->
                tabShelfList model

            BookListTab ->
                tabBookList model

            TocTab ->
                tabTocList model
        ]

sidebarContentStyle : ColorTheme -> String
sidebarContentStyle theme =
        tw ["block flex-1 overflow-y-auto", (basecolors theme).surface]

tabShelfList : Model -> Html Msg
tabShelfList model =
    div [class "pt-2"]
        [ viewSidebarShelfList model
        ]


-- MARK:BookList
tabBookList : Model -> Html Msg
tabBookList model =
    div [ class "pt-2" ]
        [ viewBookList model
        ]


-- MARK:TocList
tabTocList : Model -> Html Msg
tabTocList model =
    div [ class (tw [ "flex", "flex-col", "h-full" ]) ]
        [ headingLevelSelector model
        , div
            (id "toc-area" :: class (tw [ "flex-1", "overflow-y-auto", "pt-1" ]) :: Style.scrollbarStyle model.colorTheme)
            [ viewToc model ]
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
            , "border-b", "border-black/5", "dark:border-white/5"
            , "items-center", "gap-2"
            , "px-3", "py-2", "mt-4", "mb-2"
            ]

selectorLabel : ColorTheme -> String
selectorLabel theme =
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
        , (basecolors theme).textMuted
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
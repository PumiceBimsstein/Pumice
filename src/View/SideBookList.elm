module View.SideBookList exposing (viewBookList)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Style exposing (..)
import Domain.Helper exposing (..)
import Icon exposing (..)


viewBookList : Model -> AppState -> Html Msg
viewBookList model present =
    let
        visibleBooks =
            getCurrentShelf present
                |> Maybe.map .books
                |> Maybe.withDefault []
    in
    div [ class "space-y-1" ]
        (List.map (viewBookItem model present) visibleBooks)

viewBookItem : Model -> AppState -> Book -> Html Msg
viewBookItem model present book =
    let
        isSelected = Just book.id == present.currentBookId
        themeClasses = viewBookItemTheme model.colorTheme isSelected isSearchHit
        
        -- 検索ヒット判定
        isSearchHit = hasHitInBook model.searchText book
    in
    div [ class "group relative" ]
        [ div
            [ class themeClasses
            , onClick (SelectBook book.id)
            ]
            [ div [ class "font-bold text-sm" ] [ text book.title ] ]
        ]


viewBookItemTheme : ColorTheme -> Bool -> Bool -> String
viewBookItemTheme theme isSelected isSearchHit =
    let
        common =
            [ "py-1", "px-2", "mx-2", "cursor-pointer", "text-xs", "flex", "items-center" ]
        themeStyles =
            if isSearchHit then
                if isSelected then
                    case theme of
                        Light ->
                            [ "border-l-2"
                            , (basecolors theme).borderStrong
                            , (basecolors theme).deco
                            , (basecolors theme).searchbg
                            ]
                        Dark ->
                            [ "border-l-2"
                            , "text-slate-800"
                            , (basecolors theme).borderStrong
                            , (basecolors theme).rounded
                            , (basecolors theme).searchbg
                            ]
                        Magical ->
                            [ "border-l-2"
                            , "bg-[#8B7355]"
                            , (basecolors theme).borderStrong
                            , (basecolors theme).accent
                            , (basecolors theme).rounded
                            ]
                else
                    case theme of
                        Light ->
                            [ "text-[#2D2A26]/70"
                            , "bg-[#C86D51]/20"
                            , "hover:opacity-60"
                            ]
                        Dark ->
                            [ "bg-yellow-200/60"
                            , "text-slate-900"
                            , (basecolors theme).rounded
                            , "hover:opacity-60"
                            ]
                        Magical ->
                            [ (basecolors theme).text
                            , "bg-[#8B7355]/80"
                            , "hover:opacity-60"
                            ]
            else
                if isSelected then
                    case theme of
                        Light ->
                            [ "border-l-2"
                            , (basecolors theme).borderStrong
                            , (basecolors theme).accent
                            , (basecolors theme).brightAccent
                            ]
                        Dark ->
                            [ "border-l-2", "bg-white/10"
                            , (basecolors theme).borderStrong
                            , (basecolors theme).accent
                            ]
                        Magical ->
                            [ "border-l-2", "bg-white/10"
                            , (basecolors theme).borderStrong
                            , (basecolors theme).accent
                            ]
                else
                    [ (basecolors theme).text
                    , "opacity-80"
                    , "hover:opacity-60"
                    ]
    in
    tw (common ++ themeStyles)
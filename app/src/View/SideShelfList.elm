module View.SideShelfList exposing (viewSidebarShelfList)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Style exposing (..)
import Domain.Helper exposing (..)


viewSidebarShelfList : Model -> Html Msg
viewSidebarShelfList model =
    let
        present = model.present
    in
    div [ class "space-y-1" ]
        (List.map (viewSidebarShelfItem model) present.shelves)


-- 本棚アイテム
viewSidebarShelfItem : Model -> Shelf -> Html Msg
viewSidebarShelfItem model shelf =
    let
        present = model.present
        isSelected =
            shelf.id == present.currentShelfId
        theme = model.colorTheme

        isSearchHit = hasHitInShelf model.searchText shelf
    in
    div
        [ class "group relative" ]
        [ div
            [ class (shelfItemBodyStyle theme isSelected isSearchHit)
            , onClick (SelectShelf shelf.id)
            ]
            [ text shelf.name ]
        ]


shelfItemBodyStyle : ColorTheme -> Bool -> Bool -> String
shelfItemBodyStyle theme isSelected isSearchHit =
    let
        common =
            [ "flex", "items-center", "px-3", "py-2", "cursor-pointer"
            , "mx-2", "my-0.5", "text-sm", "group"
            , "font-bold"
            , (basecolors theme).rounded
            ]
        themeStyles =
            if isSearchHit then
                if isSelected then
                    case theme of
                        Light ->
                            [ "border"
                            , (basecolors theme).borderStrong
                            , (basecolors theme).deco
                            , (basecolors theme).searchbg
                            ]
                        Dark ->
                            [ "border", "border-2"
                            , (basecolors theme).border
                            , "text-slate-900"
                            , (basecolors theme).primary
                            ]
                        Magical ->
                            [ "border", "border-2"
                            , (basecolors theme).borderStrong
                            , (basecolors theme).accent
                            , "bg-[#8B7355]/80"
                            ]
                else
                    case theme of
                        Light ->
                            [ "hover:opacity-100"
                            , "text-[#2D2A26]/70"
                            , "bg-[#C86D51]/20"
                            ]
                        Dark ->
                            [ "hover:opacity-80"
                            , "text-slate-800"
                            , "bg-yellow-200/60"
                            ]
                        Magical ->
                            [ "hover:opacity-100"
                            , (basecolors theme).text
                            , "bg-[#8B7355]/80"
                            ]
            else
                if isSelected then
                    [ "border", "bg-white/10", "border-0"
                    , (basecolors theme).accent
                    ]
                else
                    [ "opacity-70"
                    , "hover:opacity-100"
                    , (basecolors theme).text
                    ]
    in
    tw (common ++ themeStyles)
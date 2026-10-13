module View.SideTocList exposing (viewToc)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Style exposing (..)
import Domain.Helper exposing (..)
--import Icon exposing (..)


viewToc : Model -> AppState -> Html Msg
viewToc model present =
    case (getCurrentBook present) of
        Just book ->
            div [ class "space-y-1" ] 
                (List.indexedMap
                    (viewTocSection model) book.pages)
        Nothing ->
            div
                [ class "p-4 text-center text-xs text-gray-400" ]
                [ text "Select a book" ]


viewTocSection : Model -> Int -> Page -> Html Msg
viewTocSection model pageIdx page =
    viewHeadingList
        model.colorTheme
        model.present.currentPageIndex
        pageIdx
        page.content
        model.present.currentHeading
        model.searchText
        model.visibleHeadingLevel


-- MARK: TocList - Headings

-- 目次一覧
viewHeadingList : ColorTheme -> Int -> Int -> String -> List String -> String -> HeadingLevel -> Html Msg
viewHeadingList theme currentPageIndex pageIdx content currentHeading searchText visibleLevel =
    extractHeadings pageIdx content
        |> toHeadingData
        |> filterHeadingsData visibleLevel
        |> renderHeadingList theme currentPageIndex currentHeading content searchText


renderHeadingList : ColorTheme -> Int -> List String -> String -> String -> HeadingData -> Html Msg
renderHeadingList theme currentPageIndex currentHeading content searchText data =
    if List.isEmpty data.headings then
        text ""

    else
        div [ class "flex flex-col" ]
            (List.map
                (renderHeadingItem theme currentPageIndex currentHeading content searchText data.allHeadingTexts)
                data.headings
            )


renderHeadingItem : ColorTheme -> Int -> List String -> String -> String -> List String -> Heading -> Html Msg
renderHeadingItem theme currentPageIndex currentHeading content searchText allHeadingTexts h =
    checkSectionHit searchText h.text content allHeadingTexts
        |> viewHeadingItem theme currentPageIndex currentHeading h


-- 目次アイテム
viewHeadingItem : ColorTheme -> Int -> List String -> Heading -> Bool -> Html Msg
viewHeadingItem theme currentPageIndex currentHeading h isSectionHit =
    div
        [ class (tw (buildHeadingItemClass theme h currentPageIndex currentHeading isSectionHit))
        , style "font-family" (basecolors theme).fontMono
        , onClick (JumpToHeading h.pageIndex h.text)
        ]
        [ text (stripEmphasis h.text) ]


buildHeadingItemClass : ColorTheme -> Heading -> Int -> List String -> Bool -> List String
buildHeadingItemClass theme h currentPageIndex currentHeading isSectionHit =
    headingItemStyle theme h.level
        ++ headingHighlightStyle theme (isCurrentHeading h currentPageIndex currentHeading) isSectionHit
        -- ++ searchHighlightClass theme isSectionHit


headingItemStyle : ColorTheme -> Int -> List String
headingItemStyle theme level =
    let
        base = [ "cursor-pointer", "py-1", "px-2", "mr-3", "text-sm"]
        levelClass =
            if level == 1 then
                [ "font-bold", "border-b"
                , (basecolors theme).borderStrong
                , "ml-1", "mb-1", "pl-1" ]
            else if level == 2 then
                [ "pl-2", "ml-1" ]
            else
                [ "pl-3", "ml-1", "text-xs" ]
    in
    base ++ levelClass


headingHighlightStyle : ColorTheme -> Bool -> Bool -> List String
headingHighlightStyle theme isActive isSectionHit =
    if isActive then
        if isSectionHit then
            case theme of
                Light ->
                    [ "font-bold", "border-l-4", "hover:opacity-70"
                    , (basecolors theme).deco
                    , (basecolors theme).primary
                    , (basecolors theme).searchbg
                    ]
                Dark ->
                    [ "font-bold", "border-l-4", "hover:opacity-70"
                    , "text-slate-900"
                    , (basecolors theme).primary
                    , (basecolors theme).borderStrong
                    ]
                Magical ->
                    [ "font-bold", "border-l-4", "hover:opacity-70"
                    , (basecolors theme).deco
                    , (basecolors theme).borderStrong
                    , "bg-[#8B7355]/80"
                    ]
        else
            [ "font-bold", "border-l-4", "hover:opacity-70"
            , (basecolors theme).accent
            , (basecolors theme).borderStrong
            ]
    else 
        if isSectionHit then
            case theme of
                Light ->
                    [ "font-bold"
                    , "bg-[#C86D51]/30"
                    , "text-slate-700"
                    , "hover:bg-[#C86D51]"
                    , "hover:text-white"
                    ]
                Dark ->
                    [ "font-bold"
                    , "text-slate-900"
                    , (basecolors theme).primary
                    , "opacity-60"
                    , "hover:opacity-100"
                    ]
                Magical ->
                    [ "font-bold"
                    , (basecolors theme).deco
                    , "bg-[#8B7355]/80"
                    , "hover:opacity-80"
                    ]
        else
            case theme of
                Light ->
                    [ "font-bold"
                    , "hover:text-slate-700"
                    , (basecolors theme).textMuted
                    , (basecolors theme).borderStrong
                    ]
                Dark ->
                    [ "font-bold"
                    , "hover:text-slate-100"
                    , (basecolors theme).textMuted
                    , (basecolors theme).borderStrong
                    ]
                Magical ->
                    [ "font-bold"
                    , "hover:text-[#E0D5C0]"
                    , "text-[#E0D5C0]/70"
                    , (basecolors theme).borderStrong
                    ]

module View.MainFooter exposing (viewFooter)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Style exposing (..)
import Domain.Helper exposing (..)

-- MARK:フッター
viewFooter : Model -> Book -> ColorTheme -> Html Msg
viewFooter model book theme =
    let
        total = List.length book.pages
        currentPageId =
            getCurrentPage model.present
                |> Maybe.map .id
                |> Maybe.withDefault ""
    in
    div
        [ class (mainFooter.footerContainer theme) ]
        [ div
            [ class "flex-none min-w-0 shrink-0" ]
            [ viewFooterNavButtons model theme ]
        , div
            [ class "flex-1 min-w-0 flex justify-center px-2" ]
            [ viewSeekBar model total ]
        , div
            [ class "flex-none shrink-0 flex items-center justify-end" ]
            [ viewFooterRightControls model currentPageId theme ]
        ]


{-| フッター左側の常時階層移動ボタン群 -}
viewFooterNavButtons : Model -> ColorTheme -> Html Msg
viewFooterNavButtons model theme =
    let
        maybeShelf =
            getCurrentShelf model.present

        booksMsg =
            case maybeShelf of
                Just shelf ->
                    ChangeMainView (ShelfDetailView shelf.id)

                Nothing ->
                    ChangeMainView ShelfListView
    in
    div
        [ class "flex items-center gap-1.5 font-mono text-xs" ]
        [ button
            [ class (footerNavBtnStyle theme)
            , onClick (ChangeMainView ShelfListView)
            , title "本棚一覧（Library）へ"
            ]
            [ text "Library" ]
        , span
            [ class (tw [ "opacity-80 select-none", (basecolors theme).text ]) ]
            [ text "/" ]
        , button
            [ class (footerNavBtnStyle theme)
            , onClick booksMsg
            , title "本一覧（Books）へ"
            ]
            [ text "Books" ]
        ]


footerNavBtnStyle : ColorTheme -> String
footerNavBtnStyle theme =
    tw
        [ "px-1.5 py-0.5"
        , "rounded"
        , "opacity-75 hover:opacity-100"
        , "hover:underline"
        , "transition-opacity cursor-pointer"
        , "truncate text-[14px] font-bold"
        , (basecolors theme).accent
        ]


{-| 右側コントロールの出し分け -}
viewFooterRightControls : Model -> String -> ColorTheme -> Html Msg
viewFooterRightControls model currentPageId theme =
    if isMiniWindowCollapsed model then
        viewCollapsedControls model theme

    else if model.mode == EditMode then
        deletePageButton currentPageId

    else
        viewWidthSlider theme model.contentWidth

isMiniWindowCollapsed : Model -> Bool
isMiniWindowCollapsed model =
    let
        usesMiniWindow =
            model.sidebarMode == OverlaySidebar || model.sidebarMode == LeftSidebar
    in
    usesMiniWindow && not model.isRightSideWindowVisible


{-| ミニウィンドウ非表示時の代替ボタン群 -}
viewCollapsedControls : Model -> ColorTheme -> Html Msg
viewCollapsedControls model theme =
    let
        nextMode =
            if model.mode == ViewMode then
                EditMode

            else
                ViewMode

        modeLabel =
            if model.mode == ViewMode then
                "EDIT"

            else
                "VIEW"
    in
    div [ class "flex items-center gap-2" ]
        [ button
            [ class (footerMiniBtnStyle theme)
            , style "font-family" (basecolors theme).fontDeco
            , onClick (CreateNextPage (model.present.currentPageIndex + 1))
            ]
            [ text "+Page" ]
        , button
            [ class (footerMiniBtnStyle theme)
            , style "font-family" (basecolors theme).fontDeco
            , onClick (ChangeMode nextMode)
            ]
            [ text modeLabel ]
        , button
            [ class (footerMiniBtnStyle theme)
            , style "font-family" (basecolors theme).fontDeco
            , onClick OpenRightSideWindow
            , title "Open side menu"
            ]
            [ text "MENU ▴" ]
        ]


footerMiniBtnStyle : ColorTheme -> String
footerMiniBtnStyle theme =
    tw
        [ "px-2.5"
        , "py-1"
        , "text-xs", "opacity-70"
        , "font-semibold", "whitespace-nowrap"
        , "shrink-0"
        , "border"
        , (basecolors theme).rounded
        , (basecolors theme).borderBtn
        , (basecolors theme).text
        , "hover:opacity-90"
        , "cursor-pointer"
        ]


viewSeekBar : Model -> Int -> Html Msg
viewSeekBar model total =
    let
        present = model.present
        currentVal = present.currentPageIndex
        progress = calcProgress currentVal total
    in
    div
        [ class mainFooter.seekBarContainer
        , Html.Events.on "wheel" (wheelDecoder PrevPage NextPage)
        ]
        [ div
            [ class mainFooter.seekBarTrack ]
            [ div (mainFooter.seekBarProgressAttr model.colorTheme progress) []
            ]
        , input
            (mainFooter.seekBarInputBaseAttrs total
                ++ [ value (String.fromInt currentVal)
                   , onInput (String.toInt >> Maybe.withDefault 0 >> SelectPage)
                   , class "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   ]
            )
            []
        ]


deletePageButton : String -> Html Msg
deletePageButton pageId =
    button
        [ class (mainFooter.deletebutton)
        , onClick (DeletePage pageId)]
        [ text "Delete This Page" ]


viewWidthSlider : ColorTheme -> ContentWidth -> Html Msg
viewWidthSlider theme currentWidth =
    let
        toValue width =
            case width of
                Narrow -> "0"
                Normal -> "1"
                Wide -> "2"
        fromValue val =
            case val of
                "0" -> SetContentWidth Narrow
                "2" -> SetContentWidth Wide
                _ -> SetContentWidth Normal
        progress =
            case currentWidth of
                Narrow -> 0
                Normal -> 50
                Wide -> 100
    in
    div
        [ class (tw [ "flex", "items-center", "gap-2" ]) ]
        [ span
            [ class (tw [ "text-[11px]", "opacity-70", (basecolors theme).text ]) ]
            [ text "Width" ]
        , div
            [ class (tw [ "relative", "w-24", "h-5", "flex", "items-center", "cursor-pointer" ]) ]
            [ div
                [ class (tw [ "absolute", "w-full", "h-0.5", "overflow-hidden", (basecolors theme).primary ]) ]
                []
            , div
                [ style "left" ("calc(" ++ String.fromInt progress ++ "% - 1px)")
                , class (tw [ "absolute", "w-1.5", "h-3", (basecolors theme).primary ])
                ]
                []
            , input
                [ type_ "range"
                , Html.Attributes.min "0"
                , Html.Attributes.max "2"
                , Html.Attributes.step "1"
                , Html.Attributes.value (toValue currentWidth)
                , Html.Events.onInput fromValue
                , class (tw [ "absolute", "inset-0", "w-full", "h-full", "opacity-0", "cursor-pointer" ])]
                []
            ]
        ]


-- MARK:スタイル定義
mainFooter :
    { footerContainer : ColorTheme -> String
    , seekBarContainer : String
    , seekBarTrack : String
    , seekBarInputBaseAttrs : Int -> List (Attribute msg)
    , seekBarProgressAttr : ColorTheme -> Float -> List (Html.Attribute msg)
    , deletebutton : String  
    }
mainFooter =
    { footerContainer = \theme ->
        tw  [ "flex", "border-t", "px-4 md:px-6", "py-1"
            , "items-center", "gap-3 sm:gap-6 md:gap-10"
            , (basecolors theme).surface
            , (basecolors theme).border ]
            
    , seekBarContainer =
        tw  [ "relative", "w-full", "max-w-4xl", "h-5", "flex"
            , "items-center", "cursor-pointer" ]
    , seekBarTrack =
        tw  [ "absolute", "w-full", "h-1"
            , "bg-gray-500/20"
            , "overflow-hidden" ]
    , seekBarInputBaseAttrs = \total ->
        [ type_ "range"
        , Html.Attributes.min "0"
        , Html.Attributes.max (String.fromInt (Basics.max 0 (total - 1)))
        , step "1"
        ]
    , seekBarProgressAttr = \theme percent ->
        [ style "width" (String.fromFloat percent ++ "%")
        , style "background-color" (basecolors theme).scrollThumb
        , Html.Attributes.class "h-full"
        ]
    , deletebutton =
        tw  [ "border", "rounded", "whitespace-nowrap"
            , "px-3", "py-1", "text-xs"
            , "hover:bg-red-500/10", "hover:border-red-400/50"
            , "border-red-400/30"
            , "text-red-400"
            , "cursor-pointer"
            , "transition-colors"
            ]
    }

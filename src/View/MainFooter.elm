module View.MainFooter exposing (viewFooter)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Style exposing (..)
import Domain.Helper exposing (..)

-- MARK:フッター
viewFooter : Model -> AppState -> Book -> ColorTheme -> Html Msg
viewFooter model state book theme =
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
            [ class "flex-none w-[20%] min-w-0" ]
            [ viewBookTitle model book ]
        , div
            [ class "flex-1 flex justify-center" ]
            [ viewSeekBar model state total ]
        , div
            [ class "flex-none w-[20%] flex justify-end" ]
            [ viewFooterRightControls model currentPageId theme ]
        -- , div
        --     [ class "flex-none w-[20%]" ]
        --     [ if model.mode == EditMode then
        --         deletePageButton currentPageId
        --       else
        --         viewWidthSlider theme model.contentWidth
        --     ]
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
            , onClick (ChangeMode nextMode)
            ]
            [ text modeLabel ]
        , button
            [ class (footerMiniBtnStyle theme)
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
        , "text-xs"
        , "font-semibold"
        , "border"
        , (basecolors theme).rounded
        , (basecolors theme).borderBtn
        , (basecolors theme).text
        , "hover:opacity-70"
        ]

viewBookTitle : Model -> Book -> Html Msg
viewBookTitle model book =
    h1
        [ class (mainFooter.bookTitleStyle model.colorTheme)
        , style "font-family" (basecolors model.colorTheme).fontDeco
        , onDoubleClick (EditBegin BookTitle book.id book.title)
        , title book.title -- 省略された時に全文が見えるように
        ]
        [ text (book.title) ]


viewSeekBar : Model -> AppState -> Int -> Html Msg
viewSeekBar model present total =
    let
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
        [ class (mainFooter.deletebutton "text-red-400")
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
            -- クリック範囲を確保するコンテナ（h-5）
            [ class (tw [ "relative", "w-24", "h-5", "flex", "items-center", "cursor-pointer" ]) ]
            [ -- スライダーのトラック（背景の細い線）
              div
                [ class (tw [ "absolute", "w-full", "h-0.5", "overflow-hidden", (basecolors theme).primary ]) ]
                []
            , -- 現在位置を示すインジケーター（細い縦棒）
              div
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
    , bookTitleStyle : ColorTheme -> String
    , seekBarContainer : String
    , seekBarTrack : String
    , seekBarInputBaseAttrs : Int -> List (Attribute msg)
    , seekBarProgressAttr : ColorTheme -> Float -> List (Html.Attribute msg)
    , deletebutton : String -> String  
    }
mainFooter =
    { footerContainer = \theme ->
        tw  [ "flex", "border-t", "px-6", "py-1"
            , "items-center", "gap-10"
            , (basecolors theme).surface
            , (basecolors theme).border ]
            
    , bookTitleStyle = \theme ->    -- truncate を追加して、長すぎる場合に ... にする
        tw  [ "tracking-tight", "min-w-0"
            , "cursor-pointer", "hover:opacity-70", "truncate"
            , (basecolors theme).text
            ]
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
        , Html.Attributes.class "h-full" -- duration-200
        ]
    , deletebutton = \colorClass ->
        tw  [ "border", "rounded", "truncate"
            , "flex-1", "px-2", "py-1", "text-xs", colorClass
            , "hover:bg-white/5", "border-gray-500/20"
            , "text-red-400"
            ]
    }
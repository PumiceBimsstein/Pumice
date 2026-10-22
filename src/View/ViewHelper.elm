module View.ViewHelper exposing
    ( viewBaseSelector
    , viewSortableItem
    , viewButton
    , stopClickPropagation
    , viewEmptyState
    , openDropdown
    )

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Style as Style exposing (..)
import Json.Decode as Decode
import Domain.Helper exposing (..)


-- ================================================================
-- 汎用セレクター
-- ================================================================

viewBaseSelector :
    (String -> msg)
    -> (a -> String)
    -> (a -> ( a, a ))
    -> List (Html.Attribute msg)
    -> a
    -> List a
    -> Html msg
viewBaseSelector toMsg toString getSiblings attributes current options =
    let
        ( prev, next ) =
            getSiblings current

        inlineWheelDecoder =
            Decode.field "deltaY" Decode.float
                |> Decode.map
                    (\delta ->
                        if delta < 0 then
                            toMsg (toString prev)
                        else
                            toMsg (toString next)
                    )
    in
    select
        (attributes
            ++ [ onInput toMsg
               , value (toString current)
               , Html.Events.on "wheel" inlineWheelDecoder
               ]
        )
        (List.map
            (\opt ->
                option
                    [ value (toString opt)
                    , selected (toString opt == toString current)
                    ]
                    [ text (toString opt) ]
            )
            options
        )


-- 共通の並べ替えラッパー
viewSortableItem : ColorTheme -> Maybe DraggingState -> DragTarget -> Int -> Bool -> Html Msg -> Html Msg
viewSortableItem _ maybeDrag target index isEditing itemHtml =
    let
        isOver =
            case maybeDrag of
                Just d -> d.target == target && d.overIndex == index
                Nothing -> False

        -- 編集中はドラッグ属性とイベントを空にする
        dragAttributes =
            if isEditing then
                [ draggable "false" ]
            else
                [ draggable "true"
                , onDragStart (DragStart target index)
                , onDragOver (DragOver index)
                , onDrop (case maybeDrag of
                            Just d -> Reorder d.target d.fromIndex index
                            Nothing -> DragEnd)
                , onDragEnd DragEnd
                ]
    in
    div
        (( class "flex items-center" ) :: dragAttributes)
        [ if isOver then
            div [ class "w-1 h-full mx-1 bg-blue-500 rounded-full transition-all" ][]
          else
            text ""
        , itemHtml
        ]


-- 汎用ボタン
viewButton : ColorTheme -> ButtonKind -> Msg -> Html Msg -> Html Msg
viewButton theme kind msg content =
    button
        [ class (Style.buttonBaseStyle theme kind)
        , stopClickPropagation msg
        ]
        [ content ]


stopClickPropagation : msg -> Attribute msg
stopClickPropagation msg =
    stopPropagationOn "click" (Decode.succeed ( msg, True ))


-- Bookを選択していない場合の表示
viewEmptyState : Model -> Html Msg
viewEmptyState model =
    main_
        [ class (emptyStateStyle model.colorTheme) ]
        [ div
            [ class "text-center italic text-lg" ]
            [ text "Select or create a book" ]
        ]

emptyStateStyle : ColorTheme -> String
emptyStateStyle theme =
        let
            base =
                [ "flex-1", "flex", "flex-col", "h-full", "items-center", "justify-center" ]

            themeBg =
                case theme of
                    Light  -> "bg-gray-50 text-gray-400"
                    Dark   -> "bg-slate-900 text-slate-500"
                    Magical-> "bg-slate-900 text-slate-500"
        in
        tw (base ++ [ themeBg ])


-- MARK:ドロップダウンメニュー

openDropdown : Bool -> MenuDirection -> ColorTheme -> List ( String, Msg ) -> Html Msg
openDropdown isOpen direction theme items =
    if isOpen then
        renderDropdownMenu direction theme items

    else
        text ""


renderDropdownMenu : MenuDirection -> ColorTheme -> List ( String, Msg ) -> Html Msg
renderDropdownMenu direction theme items =
    div []
        [ renderMenuOverlay
        , renderMenuList direction theme items
        ]


renderMenuOverlay : Html Msg
renderMenuOverlay =
    div
        [ class "fixed inset-0 z-40 cursor-default bg-transparent"
                --"fixed inset-0 z-20 cursor-default"
        , stopClickPropagation CloseMenu
        ]
        []


renderMenuList : MenuDirection -> ColorTheme -> List ( String, Msg ) -> Html Msg
renderMenuList direction theme items =
    div
        [ class (dropdownMenuStyle direction theme) ]
        (List.map (renderMenuItem theme) items)


renderMenuItem : ColorTheme -> ( String, Msg ) -> Html Msg
renderMenuItem theme ( label, msg ) =
    button
        [ class (dropdownItemStyle theme)
        , style "font-family" (basecolors theme).fontDeco
        , stopClickPropagation (SelectMenuItem msg)
        ]
        [ text label ]


-- dropdownMenuStyle : MenuDirection -> ColorTheme -> String
-- dropdownMenuStyle direction theme =
--     let
--         bgcolor =
--             case theme of
--                 Light   -> tw [(basecolors theme).bg, (basecolors theme).borderStrong]
--                 Dark    -> tw [(basecolors theme).primary, "border-black"]
--                 Magical -> tw [(basecolors theme).primary, (basecolors theme).borderBtn]
--     in
--     tw
--         [ dropdownPositionStyle direction
--         , "z-20", "flex", "flex-col"--, "gap-1", "py-1"
--         , "border", "shadow-lg"
--         , "min-w-max"
--         , (basecolors theme).brightAccent
--         --, (basecolors theme).borderBtn
--         --, (basecolors theme).rounded
--         , bgcolor
--         ]


{-| メニュー全体の浮遊パネルスタイル -}
dropdownMenuStyle : MenuDirection -> ColorTheme -> String
dropdownMenuStyle direction theme =
    let
        base =
            [ dropdownPositionStyle direction
            , "z-50"
            , "flex flex-col"
            , "p-1.5"                  -- 内側に適度な余白を取る
            , "min-w-[150px]"          -- 安定した横幅
            , "border shadow-xl"       -- 浮かび上がる陰影
            , "backdrop-blur-sm"       -- すりガラス風の上品な質感
            , "animate-[fadeIn_0.1s_ease-out]" -- ふわっと表示
            , (basecolors theme).rounded
            ]

        themeCard =
            case theme of
                Light ->
                    [ "bg-[#FBF8F5]/95"
                    , "border-[#DCD4C9]"
                    , "shadow-black/10"
                    ]

                Dark ->
                    [ "bg-[#1E1E1D]/95"
                    , "border-[#3A3A36]"
                    , "shadow-black/50"
                    ]

                Magical ->
                    [ "bg-[#161626]/95"
                    , "border-[#8B7355]/40"
                    , "shadow-black/60"
                    ]
    in
    tw (base ++ themeCard)

dropdownPositionStyle : MenuDirection -> String
dropdownPositionStyle direction =
    case direction of
        Above ->
            "absolute left-0 bottom-full mb-2"

        Below ->
            "absolute right-0 top-full mt-2"


-- dropdownItemStyle : ColorTheme -> String
-- dropdownItemStyle theme =
--     let
--         bgcolor =
--             case theme of
--                 Light -> tw [(basecolors theme).bg, (basecolors theme).text, (basecolors theme).borderStrong]
--                 Dark -> tw [(basecolors theme).primary, "text-black", "border-black"]
--                 Magical -> tw [(basecolors theme).bg, (basecolors theme).text, (basecolors theme).borderBtn]
--     in
--     tw
--         [ "w-full", "px-3", "py-1", "text-left", "border"
--         , "text-[12px]", "uppercase"--, "font-bold"
--         , "whitespace-nowrap"
--         , "hover:bg-white/10", "transition-colors"
--         --, (basecolors theme).textMuted
--         , bgcolor
--         ]

{-| メニュー項目（枠線をなくし、ホバーで優しくハイライト） -}
dropdownItemStyle : ColorTheme -> String
dropdownItemStyle theme =
    let
        base =
            [ "w-full"
            , "px-3"
            , "py-1.5"
            , "text-left"
            , "text-xs"
            , "font-medium"
            , "tracking-wide"
            , "rounded-md"             -- 項目自体もほんのり角丸
            , "whitespace-nowrap"
            , "cursor-pointer"
            , "transition-colors duration-150"
            ]

        themeItem =
            case theme of
                Light ->
                    [ "text-[#4A453E]"
                    , "hover:bg-black/5"
                    , "hover:text-[#C86D51]"
                    ]

                Dark ->
                    [ "text-[#CCCCCC]"
                    , "hover:bg-white/10"
                    , "hover:text-[#C9A84C]"
                    ]

                Magical ->
                    [ "text-[#E0D5C0]"
                    , "hover:bg-[#8B7355]/30"
                    , "hover:text-[#D9A74A]"
                    ]
    in
    tw (base ++ themeItem)
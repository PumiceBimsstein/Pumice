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

-- dropIndicator : ColorTheme -> String
-- dropIndicator _ =
--     tw  [ "w-1 h-full mx-1 bg-blue-500 rounded-full transition-all"]

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
-- おそらくこの画面は表示される機会がない
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
        [ class "fixed inset-0 z-20 cursor-default"
        , stopClickPropagation CloseExportMenu
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
        , stopClickPropagation msg
        ]
        [ text label ]


dropdownMenuStyle : MenuDirection -> ColorTheme -> String
dropdownMenuStyle direction theme =
    tw
        [ dropdownPositionStyle direction
        , "z-20", "flex", "flex-col", "gap-1", "p-1"
        , "border", "shadow-lg"
        , (basecolors theme).brightAccent
        , (basecolors theme).borderBtn
        , (basecolors theme).rounded
        ]


dropdownPositionStyle : MenuDirection -> String
dropdownPositionStyle direction =
    case direction of
        Above ->
            "absolute right-0 bottom-full mb-1"

        Below ->
            "absolute right-0 top-full mt-1"


dropdownItemStyle : ColorTheme -> String
dropdownItemStyle theme =
    tw
        [ "w-full", "px-3", "py-1", "text-left"
        , "text-[12px]", "font-bold", "uppercase"
        , "hover:bg-white/10", "transition-colors"
        , (basecolors theme).textMuted
        ]

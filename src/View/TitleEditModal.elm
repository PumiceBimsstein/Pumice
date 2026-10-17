module View.TitleEditModal exposing (viewTitleEditModal)

import Type exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html exposing (..)
import Json.Decode as Decode
import View.Style exposing (..)


-- MARK: タイトル編集モーダル

viewTitleEditModal : Model -> Html Msg
viewTitleEditModal model =
    case model.editing of
        Just buffer ->
            div
                [ class "fixed inset-0 z-50 flex items-center justify-center"
                -- ダブルクリックの突き抜けを防止
                , stopPropagationOn "dblclick" (Decode.succeed ( NoOp, True ))
                ]
                [ -- ① 背景レイヤー（クリックで閉じたい場合は安全のため EditCancel にする）
                  div
                    [ class "absolute inset-0 bg-black/50"
                    , onClick EditCancel -- ★ EditSubmit ではなく EditCancel に変更
                    ]
                    []

                -- ② モーダルコンテンツ本体
                , div
                    [ class (tw [ modalContentStyle model.colorTheme, "relative z-10" ])
                    -- 内部のクリック・ポインタ操作が背景に漏れるのを完全に防ぐ
                    , stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
                    , stopPropagationOn "pointerdown" (Decode.succeed ( NoOp, True ))
                    ]
                    [ renderModalHeader
                    , renderModalInput model.colorTheme buffer
                    , renderModalFooter model.colorTheme
                    ]
                ]
            -- div
            --     [ class "fixed inset-0 z-50 flex items-center justify-center" ]
            --     [ -- ① 背景クリック専用の要素（内側のイベントとは一切干渉しない）
            --       div
            --         [ class "absolute inset-0 bg-black/50"
            --         , onClick EditSubmit
            --         ]
            --         []

            --     -- ② モーダル本体（stopPropagationOn は不要になる）
            --     , div
            --         [ class (tw [ modalContentStyle model.colorTheme, "relative z-10" ]) ]
            --         [ renderModalHeader
            --         , renderModalInput model.colorTheme buffer
            --         , renderModalFooter model.colorTheme
            --         ]
            --     ]
            -- div
            --     [ class "fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            --     , onClick EditSubmit
            --     ]
            --     [ div
            --         [ class (modalContentStyle model.colorTheme)
            --         , stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
            --         ]
            --         [ renderModalHeader
            --         , renderModalInput model.colorTheme buffer
            --         , renderModalFooter model.colorTheme
            --         ]
            --     ]

        Nothing ->
            text ""


renderModalHeader : Html Msg
renderModalHeader =
    h3 [ class "text-base font-bold mb-3 opacity-90" ]
        [ text ("Title Edit") ]


renderModalInput : ColorTheme -> EditBuffer -> Html Msg
renderModalInput theme buffer =
    input
        [ value buffer.value
        , onInput EditUpdate
        , onEnter EditSubmit
        , class (modalInputStyle theme)
        , autofocus True
        ]
        []


renderModalFooter : ColorTheme -> Html Msg
renderModalFooter theme =
    div [ class "flex justify-end gap-2 mt-4" ]
        [ button
            [ class (modalBtnCancelStyle theme)
            , onClick EditCancel
            ]
            [ text "Cancel" ]
        , button
            [ class (modalBtnSaveStyle theme)
            , onClick EditSubmit
            ]
            [ text "Save" ]
        ]


modalContentStyle : ColorTheme -> String
modalContentStyle theme =
    tw
        [ "w-80", "p-5", "rounded-xl", "shadow-2xl"
        , "border"
        , (basecolors theme).surface
        , (basecolors theme).text
        , (basecolors theme).border
        ]


modalInputStyle : ColorTheme -> String
modalInputStyle theme =
    tw
        [ "w-full", "px-3", "py-2", "text-sm", "rounded-md"
        , "border", "outline-none"
        , (basecolors theme).bg
        , (basecolors theme).text
        , (basecolors theme).border
        ]


modalBtnCancelStyle : ColorTheme -> String
modalBtnCancelStyle theme =
    tw
        [ "px-3", "py-1.5", "text-xs", "font-semibold", "rounded-md"
        , "opacity-70", "hover:opacity-100", "transition-opacity"
        , (basecolors theme).text
        ]


modalBtnSaveStyle : ColorTheme -> String
modalBtnSaveStyle theme =
    tw
        [ "px-3", "py-1.5", "text-xs", "font-semibold", "rounded-md"
        , "transition-colors"
        , (basecolors theme).primary
        , (basecolors theme).deco
        ]

onEnter : msg -> Attribute msg
onEnter msg =
    on "keydown"
        (Decode.field "key" Decode.string
            |> Decode.andThen
                (\key ->
                    if key == "Enter" then
                        Decode.succeed msg
                    else
                        Decode.fail "not enter"
                )
        )
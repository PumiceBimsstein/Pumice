module View.AlertModal exposing (viewAlertModal)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, stopPropagationOn)
import Json.Decode as Decode
import Type exposing (..)
import View.Style exposing (..)


viewAlertModal : Model -> Html Msg
viewAlertModal model =
    case model.modalAlert of
        Just message ->
            div
                [ class "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
                , onClick DismissAlert
                ]
                [ div
                    [ class (modalBoxStyle model.colorTheme)
                    , stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
                    ]
                    [ h4
                        [ class "text-xs font-bold opacity-60 mb-2 font-mono uppercase tracking-wider"
                        ]
                        [ text "Notice" ]
                    , p
                        [ class "text-sm whitespace-pre-wrap leading-relaxed opacity-90 my-3"
                        ]
                        [ text message ]
                    , div
                        [ class "flex justify-end mt-4" ]
                        [ button
                            [ class (modalOkBtnStyle model.colorTheme)
                            , onClick DismissAlert
                            ]
                            [ text "OK" ]
                        ]
                    ]
                ]

        Nothing ->
            text ""


modalBoxStyle : ColorTheme -> String
modalBoxStyle theme =
    tw
        [ "w-full max-w-sm p-5 rounded-xl shadow-2xl border"
        , "animate-[fadeIn_0.1s_ease-out]"
        , (basecolors theme).surface
        , (basecolors theme).text
        , (basecolors theme).border
        ]


modalOkBtnStyle : ColorTheme -> String
modalOkBtnStyle theme =
    tw
        [ "px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer"
        , "active:scale-95"
        , (basecolors theme).primary
        , (basecolors theme).deco
        ]

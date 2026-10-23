module View.Contents exposing (viewLayout)

import Html exposing (..)
import Html.Attributes exposing (..)
-- import Html.Events exposing (..)
import File
import Html.Events exposing (preventDefaultOn)
import Type exposing (..)
import View.Style exposing (..)
import Domain.Helper exposing (..)
import Json.Decode as Decode
import Icon exposing (..)
import View.SideBar exposing (sidebarArea)
import View.MainArea exposing (mainContentArea)
import View.RightSideBar exposing (rightSidebarArea, rightSideWindow)


-- 全体レイアウト

viewLayout : Model -> AppState -> Html Msg
viewLayout model present =
    div [ class (layoutContainer model.colorTheme)
        , style "font-family" (basecolors model.colorTheme).fontMono
        , preventDefaultOn "dragover" (Decode.succeed ( NoOp, True ))
        , preventDefaultOn "drop" dropDecoder
        ]
        [ case model.sidebarMode of
            NormalSidebar ->
                div [ class sidebarWrapper ] [ sidebarArea model present ]

            OverlaySidebar ->
                text ""
            
            LeftSidebar ->
                div [ class sidebarWrapper ] [ sidebarArea model present ]

        , mainContentArea model present
        , case model.sidebarMode of
            NormalSidebar ->
                div [ class rightsidebarWrapper ] [ rightSidebarArea model present ]

            OverlaySidebar ->
                text ""
            
            LeftSidebar ->
                text ""
        , if isMiniWindowMode model.sidebarMode then
            overlaySidebarArea model present
          else
            text ""
        ]


dropDecoder : Decode.Decoder ( Msg, Bool )
dropDecoder =
    Decode.at [ "dataTransfer", "files" ] (Decode.list File.decoder)
        |> Decode.map (\files -> ( FilesDropped files, True ))


layoutContainer : ColorTheme -> String
layoutContainer theme =
    tw [ "flex", "w-screen", "h-screen", "overflow-hidden", (basecolors theme).bg ]


sidebarWrapper : String
sidebarWrapper =
    tw [ "w-[20%]", "min-w-[250px]", "flex-shrink-0", "h-full" ]


rightsidebarWrapper : String
rightsidebarWrapper =
    tw [ "flex-shrink-0", "h-full" ]

isMiniWindowMode : SidebarMode -> Bool
isMiniWindowMode sidebarMode =
    sidebarMode == OverlaySidebar || sidebarMode == LeftSidebar

overlaySidebarArea : Model -> AppState -> Html Msg
overlaySidebarArea model present =
    div
        (overlaySidebarAttrs model.isRightSideWindowVisible)
        [ rightSideWindow model present ]


{-| インラインスタイルを用いて、Tailwindのビルド環境に依存せず確実にアニメーションさせる属性リスト -}
overlaySidebarAttrs : Bool -> List (Html.Attribute Msg)
overlaySidebarAttrs isVisible =
    let
        baseAttrs =
            [ class (tw [ "fixed", "bottom-12", "right-4", "z-40", "shadow-xl" ])
            , preventDefaultOn "wheel" (Decode.succeed ( NoOp, True ))
            , style "transform-origin" "bottom right"
            , style "transition" "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease-out"
            ]

        visibilityAttrs =
            if isVisible then
                [ style "opacity" "1"
                , style "transform" "scale(0.85) translateY(0)"
                , style "pointer-events" "auto"
                ]

            else
                [ style "opacity" "0"
                , style "transform" "scale(0) translateY(12px)"
                , style "pointer-events" "none"
                ]
    in
    baseAttrs ++ visibilityAttrs
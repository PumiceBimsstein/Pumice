module View.Contents exposing (viewLayout)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
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
        ]
        [ case model.sidebarMode of
            NormalSidebar ->
                div [ class sidebarWrapper ] [ sidebarArea model present ]

            HiddenSidebar ->
                text ""

            OverlaySidebar ->
                text ""
        , mainContentArea model present
        , case model.sidebarMode of
            NormalSidebar ->
                div [ class rightsidebarWrapper ] [ rightSidebarArea model present ]

            HiddenSidebar ->
                text ""

            OverlaySidebar ->
                text ""
        , if model.sidebarMode == OverlaySidebar then
            overlaySidebarArea model present
          else
            text ""
        ]


layoutContainer : ColorTheme -> String
layoutContainer theme =
    tw [ "flex", "w-screen", "h-screen", "overflow-hidden", (basecolors theme).bg ]


sidebarWrapper : String
sidebarWrapper =
    tw [ "w-[20%]", "min-w-[250px]", "flex-shrink-0", "h-full" ]


rightsidebarWrapper : String
rightsidebarWrapper =
    tw [ "flex-shrink-0", "h-full" ]


overlaySidebarArea : Model -> AppState -> Html Msg
overlaySidebarArea model present =
    div
        [ class (tw [ "fixed", "bottom-12", "right-4", "z-40", "scale-75", "origin-bottom-right", "shadow-xl" ]) 
        , preventDefaultOn "wheel" (Decode.succeed ( NoOp, True ))
        ]
        [ rightSideWindow model present ]
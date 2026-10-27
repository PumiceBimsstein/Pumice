module View.Contents exposing (viewLayout)

import Html exposing (..)
import Html.Attributes exposing (..)
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
    let
        -- 左サイドバーが表示されるモード
        isLeftVisible =
            model.sidebarMode == NormalSidebar || model.sidebarMode == LeftSidebar

        -- 右サイドバーが表示されるモード（NormalSidebar のみ）
        isRightVisible =
            model.sidebarMode == NormalSidebar
    in
    div
        [ class (layoutContainer model.colorTheme)
        , style "font-family" (basecolors model.colorTheme).fontMono
        , preventDefaultOn "dragover" (Decode.succeed ( NoOp, True ))
        , preventDefaultOn "drop" dropDecoder
        ]
        [ -- 1. 左サイドバー（左方向へのスライドアニメーション）
          div [ class (leftSidebarWrapperClass isLeftVisible) ]
            [ div [ class (leftSidebarInnerClass isLeftVisible) ]
                [ sidebarArea model present ]
            ]

        -- 2. メインコンテンツ領域（左右の伸縮に合わせて追従）
        , mainContentArea model present

        -- 3. 右サイドバー（右方向へのスライドアニメーション）
        , div [ class (rightSidebarWrapperClass isRightVisible) ]
            [ div [ class (rightSidebarInnerClass isRightVisible) ]
                [ rightSidebarArea model present ]
            ]

        -- 4. 右下ミニコントロールウィンドウ
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


-- MARK: 左サイドバーのアニメーションスタイル

{-| 外枠ラッパー: 幅と透明度を伸縮させ、スクロールバーや中身のはみ出しをクリップする -}
leftSidebarWrapperClass : Bool -> String
leftSidebarWrapperClass isVisible =
    tw
        [ "h-full flex-shrink-0 overflow-hidden"
        , "transition-all duration-300 ease-in-out"
        , if isVisible then
            "w-[20%] min-w-[250px] opacity-100"

          else
            "w-0 min-w-0 opacity-0 pointer-events-none"
        ]


{-| 内側コンテナ: 縮小中に文字が折り返して崩れるのを防ぎつつ、左外へスライドさせる -}
leftSidebarInnerClass : Bool -> String
leftSidebarInnerClass isVisible =
    tw
        [ "w-[250px] lg:w-[20vw] h-full"
        , "transition-transform duration-300 ease-in-out"
        , if isVisible then
            "translate-x-0"

          else
            "-translate-x-full"
        ]


-- MARK: 右サイドバーのアニメーションスタイル

{-| 外枠ラッパー: 幅を 48 (12rem) から 0 へアニメーション -}
rightSidebarWrapperClass : Bool -> String
rightSidebarWrapperClass isVisible =
    tw
        [ "h-full flex-shrink-0 overflow-hidden"
        , "transition-all duration-300 ease-in-out"
        , if isVisible then
            "w-48 opacity-100"

          else
            "w-0 opacity-0 pointer-events-none"
        ]


{-| 内側コンテナ: 右画面外へスライドアウト -}
rightSidebarInnerClass : Bool -> String
rightSidebarInnerClass isVisible =
    tw
        [ "w-48 h-full"
        , "transition-transform duration-300 ease-in-out"
        , if isVisible then
            "translate-x-0"

          else
            "translate-x-full"
        ]


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

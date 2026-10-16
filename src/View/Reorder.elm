module View.Reorder exposing (viewReorder)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Markdown
import View.Style as Style exposing (..)
import Domain.Helper exposing (..)
import View.ViewHelper exposing ( viewSortableItem, viewButton )

-- MARK:PAGEモード
viewReorder : Model -> AppState -> Book -> Html Msg
viewReorder model present book =
    div
        [ class reorderStyle.reorderGrid ]
        (List.indexedMap
            (\index page ->
                viewSortableItem 
                    model.colorTheme 
                    model.draggingState 
                    DragPage
                    index 
                    False
                    (viewPageCard model present index page page.id)
            )
            book.pages ++ [ viewAddPageCard model ]
        )


viewPageCard : Model -> AppState -> Int -> Page -> String -> Html Msg
viewPageCard model present index page pageId =
    let
        isSelected =
            present.currentPageIndex == index
    in
    button
        [ class (reorderStyle.pageCard model.colorTheme isSelected)
        , onClick (SelectPage index)
        , onDoubleClick (ChangeMode EditMode)
        ]
        [ viewPageCardHeader model index pageId
        , viewPageCardPreview model page.title
        ]


viewPageCardHeader : Model -> Int -> String -> Html Msg
viewPageCardHeader model index pageId =
    div [ class (reorderStyle.pageCardHeader model.colorTheme) ]
        [ span
            [ class (reorderStyle.pageCardNumber model.colorTheme) ]
            [ text ("Page. " ++ String.fromInt (index + 1)) ]
        , viewButton model.colorTheme Delete (DeletePage pageId) (text "×")
        ]


viewPageCardPreview : Model -> String -> Html Msg
viewPageCardPreview model title =
    div [ class "flex-1 p-2 overflow-hidden relative" ]
        [ div
            [ class (reorderStyle.pageCardPreviewContent model.colorTheme)]
            [ text title ]
        ]


viewAddPageCard : Model -> Html Msg
viewAddPageCard model =
    let
        page =
            getCurrentBook model.present
                |> Maybe.map (.pages >> List.length)
                |> Maybe.withDefault 0
    in
    viewButton model.colorTheme Create (CreatePage page) (text "+ PAGE")


-- MARK:reorderStyle
reorderStyle :
    { reorderGrid : String
    , pageCard : ColorTheme -> Bool -> String
    , pageCardHeader : ColorTheme -> String
    , pageCardNumber : ColorTheme -> String
    , pageCardPreviewContent : ColorTheme -> String
    , pageCardGradient : String
    }
reorderStyle =
    { reorderGrid =
        tw  [ "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5"
            , "gap-8", "py-24", "px-8"
            ]
    , pageCard = \theme isSelected ->
        let
            borderClass =
                case theme of
                    Light   -> ""
                    Dark    -> ""
                    Magical -> ""
            
            base =
                [ "aspect-[3/4]", "flex", "flex-col"
                , "border-2"
                , "transition-all", "cursor-pointer", "overflow-hidden"
                , "w-full", "text-left", "items-stretch"
                , (basecolors theme).borderBtn
                , (basecolors theme).rounded
                ]

            activeBorder =
                if isSelected then
                    [ "ring-2"
                    , "ring-blue-200"
                    , (basecolors theme).borderStrong
                    ]
                else
                    [ (basecolors theme).border ]
        in
        tw (base ++ activeBorder)
    , pageCardHeader = \theme ->
        tw  [ "px-2", "border-b"
            , (basecolors theme).surface
            , (basecolors theme).border
            , "flex", "justify-between", "items-center" ]
    , pageCardNumber = \theme ->
        tw  [ "text-[12px]", "font-black"
            , (basecolors theme).text
            ]
    , pageCardPreviewContent = \theme ->
        tw  [ "absolute", "inset-0", "origin-top-left"--, "scale-[0.9]"
            --, "w-[250%]", "h-[250%]"
            , "font-bold", "text-sm"
            , "p-2", "pointer-events-none"--, "opacity-80"
            , "whitespace-normal", "break-words"
            , (basecolors theme).accent
            , (basecolors theme).brightAccent
            ]
    , pageCardGradient =
        tw  [ "absolute", "inset-x-0", "bottom-0", "h-8"
            , "bg-gradient-to-t", "from-white", "to-transparent" ]
    }


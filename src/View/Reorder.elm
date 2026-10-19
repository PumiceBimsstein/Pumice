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
        , viewPageCardPreview model index page.content
        ]


viewPageCardHeader : Model -> Int -> String -> Html Msg
viewPageCardHeader model index pageId =
    div [ class (reorderStyle.pageCardHeader model.colorTheme) ]
        [ span
            [ class (reorderStyle.pageCardNumber model.colorTheme) ]
            [ text ("Page. " ++ String.fromInt (index + 1)) ]
        , copyButton model index
        , viewButton model.colorTheme Delete (DeletePage pageId) (text "×")
        ]

copyButton : Model -> Int -> Html Msg
copyButton model index =
    button
        [ class (reorderStyle.copyButtonStyle model.colorTheme)
        , onClick (DuplicatePage index)
        ]
        [ text "copy" ]


viewPageCardPreview : Model -> Int -> String -> Html Msg
viewPageCardPreview model index content =
    let
        allHeadings = extractHeadings index content

        -- ※ extractHeadings は見出しが一切ない場合にダミーの「Page X (level 1)」を返すため、
        --    本文に見出しが存在しないケースを判定して除外
        actualHeadings =
            case allHeadings of
                [ h ] ->
                    if h.text == ("Page " ++ String.fromInt (index + 1)) && not (String.contains "#" content) then
                        []

                    else
                        allHeadings

                _ ->
                    allHeadings

        h1List = List.filter (\h -> h.level == 1) actualHeadings
        h2List = List.filter (\h -> h.level == 2) actualHeadings
        h3List = List.filter (\h -> h.level == 3) actualHeadings

        -- 見出し1〜3が全てない場合の先頭200文字
        previewText =
            let
                trimmed =
                    String.trim content
            in
            if String.isEmpty trimmed then
                "Page " ++ String.fromInt (index + 1)

            else
                String.left 200 trimmed

        items =
            if not (List.isEmpty h1List) then
                List.map (\h -> div [ class "truncate" ] [ text ("# " ++ h.text) ]) h1List

            else if not (List.isEmpty h2List) then
                List.map (\h -> div [ class "truncate opacity-90" ] [ text ("## " ++ h.text) ]) h2List

            else if not (List.isEmpty h3List) then
                List.map (\h -> div [ class "truncate opacity-80" ] [ text ("### " ++ h.text) ]) h3List

            else
                [ div [ class "text-xs break-words whitespace-pre-wrap opacity-70" ] [ text previewText ] ]
    in
    div [ class "flex-1 p-2 overflow-hidden relative" ]
        [ div
            [ class (reorderStyle.pageCardPreviewContent model.colorTheme) ]
            items
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
    , copyButtonStyle : ColorTheme -> String
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
            , "font-bold", "text-xs"
            , "p-2", "pointer-events-none"--, "opacity-80"
            , "whitespace-normal", "break-words"
            , (basecolors theme).accent
            , (basecolors theme).brightAccent
            ]
    , pageCardGradient =
        tw  [ "absolute", "inset-x-0", "bottom-0", "h-8"
            , "bg-gradient-to-t", "from-white", "to-transparent" ]
    , copyButtonStyle = \theme ->
        tw  [ "border", "text-xs", "px-1", "pb-1"
            , (basecolors theme).accent
            , (basecolors theme).borderBtn
            ]
    }


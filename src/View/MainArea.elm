module View.MainArea exposing (mainContentArea)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Markdown
import View.Style as Style exposing (..)
import Json.Decode as Decode
import Json.Encode as E
import Domain.Helper exposing (..)
import Domain.Selector exposing (..)
import Icon exposing (..)
import View.MainFooter exposing (viewFooter)
import View.Cards exposing (shelfGrid, viewShelfBookGrid)
import View.Reorder exposing (viewReorder)
import View.TitleEditModal exposing (viewTitleEditModal)
import View.AlertModal exposing (viewAlertModal)
import View.ViewHelper exposing (viewEmptyState)

mainContentArea : Model -> Html Msg
mainContentArea model =
    div
        [ id "main-content-area"
        , class mainAreaWrapper
        ]
        [ case model.mainViewMode of
            ShelfListView ->
                shelfListView model

            ShelfDetailView shelfId ->
                shelfDetailView model shelfId

            PageView ->
                pageContentView model
        , viewTitleEditModal model
        , viewAlertModal model
        ]

mainAreaWrapper : String
mainAreaWrapper =
    tw [ "flex-1", "min-w-0", "h-full", "relative" ]


-- MARK:本棚一覧ビュー
shelfListView : Model -> Html Msg
shelfListView model =
    div
        (class (shelfListContainerStyle model)
            :: Style.scrollbarStyle model.colorTheme
        )
        [ shelfListTitle model
        , shelfGrid model model.present.shelves
        , shelfListMenu model
        ]


shelfListTitle : Model -> Html Msg
shelfListTitle model =
    div [ class "w-full h-20" ]
        [ h2
            [ class (shelfListTitleStyle model.colorTheme)
            , style "font-family" (basecolors model.colorTheme).fontDeco
            ]
            [ text "Library" ]
        ]


shelfListMenu : Model -> Html Msg
shelfListMenu model =
    if model.mainViewMode == ShelfListView then
        let
            isGuiding =
                List.length model.present.shelves <= 2
        in
        div [ class shelfListMenuStyle ]
            [ shelfFileImport model.colorTheme
            , p [class (menuButtonStyle model.colorTheme)][text "/"]
            , makeNewShelf model.colorTheme isGuiding
            ]
    else
        text ""


shelfFileImport : ColorTheme -> Html Msg
shelfFileImport theme =
    button
        [ class (menuButtonStyle theme)
        , onClick (RequestImport ShelfImport)
        , title "Import Shelf Only"
        ]
        [ text "Import" ]


-- 2つ以下のときに animate-pulse（点滅）を付与
makeNewShelf : ColorTheme -> Bool -> Html Msg
makeNewShelf theme isGuiding =
    let
        pulseClass =
            if isGuiding then
                tw
                    [ "animate-pulse"
                    , "[animation-duration:2.5s]"
                    , "ring-2 ring-amber-400 ring-offset-1 ring-offset-transparent"
                    ]

            else
                ""
    in
    button
        [ class (tw [ menuButtonStyle theme, pulseClass ])
        , onClick CreateShelf
        ]
        [ text "+ Shelf" ]

shelfListMenuStyle : String
shelfListMenuStyle =
    tw  [ "absolute", "top-6", "right-8", "z-10", "flex"
        , "items-center", "gap-3", "font-mono"
        ]


menuButtonStyle : ColorTheme -> String
menuButtonStyle theme =
    tw  [ "text-sm", "cursor-pointer", "bg-transparent"
        , "border-0", "p-0", "opacity-70"
        , "hover:opacity-100", "hover:underline", "transition-opacity"
        , (basecolors theme).accent
        ]


shelfListContainerStyle : Model -> String
shelfListContainerStyle model =
    tw  [ shelfViewPadding model.sidebarMode
        , "py-8", "px-16"
        , "h-full"
        , "overflow-y-auto"
        , (basecolors model.colorTheme).bg
        ]


shelfViewPadding : SidebarMode -> String
shelfViewPadding sidebarMode =
    case sidebarMode of
        NormalSidebar ->
            "px-8"

        _ ->
            "px-32"


shelfListTitleStyle : ColorTheme -> String
shelfListTitleStyle theme =
    tw  [ "text-2xl", "font-bold"
        , "ml-4", "mb-1", "py-1", "w-xs"
        , "opacity-70"
        , (basecolors theme).text
        ]


-- MARK:Bookの一覧
shelfDetailView : Model -> String -> Html Msg
shelfDetailView model shelfId =
    let
        maybeShelf =
            model.present.shelves
                |> List.filter (\s -> s.id == shelfId)
                |> List.head
    in
    case maybeShelf of
        Just shelf ->
            div
                (class (shelfDetailViewStyle model)
                    :: Style.scrollbarStyle model.colorTheme
                )
                [ shelfDetailTitle model shelf.name
                , viewShelfBookGrid model shelf.books
                , bookListMenu model shelfId
                ]

        Nothing ->
            viewEmptyState model


shelfDetailViewStyle : Model -> String
shelfDetailViewStyle model =
    tw  [ shelfViewPadding model.sidebarMode
        , "py-8", "px-16"
        , "overflow-y-auto"
        , "h-full"
        , (basecolors model.colorTheme).text
        , (basecolors model.colorTheme).bg
        ]


shelfDetailTitle : Model -> String -> Html Msg
shelfDetailTitle model name =
    div
        [ class "relative flex justify-center items-center opacity-70" ]
        [ h2
            [ class "text-3xl my-4 mx-4"
            , style "font-family" (basecolors model.colorTheme).fontDeco
            ]
            [ text name ]
        ]


bookListMenu : Model -> String -> Html Msg
bookListMenu model shelfId =
    if model.mainViewMode == (ShelfDetailView shelfId) then
        div [ class shelfListMenuStyle ]
            [ bookFileImport model.colorTheme
            , p [class (menuButtonStyle model.colorTheme)][text "/"]
            , makeNewBook model.colorTheme
            ]
    else
        text ""


bookFileImport : ColorTheme -> Html Msg
bookFileImport theme =
    button
        [ class (menuButtonStyle theme)
        , onClick (RequestImport BookImport)
        , title "Import Book Only"
        ]
        [ text "Import" ]


makeNewBook : ColorTheme -> Html Msg
makeNewBook theme =
    button
        [ class (menuButtonStyle theme)
        , onClick CreateBook
        ]
        [ text "+ Book" ]


-- MARK:ページ閲覧
pageContentView : Model -> Html Msg
pageContentView model =
    case getCurrentBook model.present of
        Nothing ->
            viewEmptyState model

        Just book ->
            main_
                [ class (mainWrapperStyle model.colorTheme)
                ]
                [ div
                    [ class "flex-1 overflow-y-auto" ]
                    [ centralArea model book ]
                , viewFooter model book model.colorTheme
                ]


mainWrapperStyle : ColorTheme -> String
mainWrapperStyle theme =
    tw  [ "relative", "flex", "flex-col"
        , "min-h-screen", "w-full", "h-full"
        , "overflow-hidden"
        , (basecolors theme).bg 
        ]


-- MARK:文書エリア
centralArea : Model -> Book -> Html Msg
centralArea model book =
    div
        ([ id "page-view-area"
         , class "flex-1 flex h-full relative overflow-y-auto justify-center"
         , Html.Events.on "scroll" (Decode.map (OnScroll "page-view-area") scrollDecoder)
         ]
            ++ Style.scrollbarStyle model.colorTheme
        )
        [ viewContentBody model book ]

viewContentBody : Model -> Book -> Html Msg
viewContentBody model book =
    let
        present = model.present
        currentPage =
            getCurrentPage present
    in
    div
        [ class "w-full h-full" ]
        [ case model.mode of
            ViewMode ->
                currentPage
                    |> Maybe.map (viewMarkdownView model)
                    |> Maybe.withDefault (text "")

            EditMode ->
                viewEditor model currentPage

            ReorderMode ->
                viewReorder model book
        ]


-- MARK:閲覧モード

viewMarkdownView : Model -> Page -> Html Msg
viewMarkdownView model page =
    let
        paddingClass =
            case model.sidebarMode of
                NormalSidebar ->
                    case model.contentWidth of
                        Narrow -> "px-32"
                        Normal -> "px-16"
                        Wide   -> "px-4"
                OverlaySidebar ->
                    case model.contentWidth of
                        Narrow -> "px-64"
                        Normal -> "px-32"
                        Wide   -> "px-8"
                LeftSidebar ->
                    case model.contentWidth of
                        Narrow -> "px-64"
                        Normal -> "px-32"
                        Wide   -> "px-8"
    in
    div
        [ id "markdown-container"
        , class (tw [ "h-full", "w-full", paddingClass ])
        ]
        [ View.Markdown.render
            model.colorTheme
            model.renderStyle
            model.fontSize
            model.searchText
            page.content
        ]

-- MARK:編集モード

viewEditor : Model -> Maybe Page -> Html Msg
viewEditor model currentPage =
    let
        content =
            currentPage
                |> Maybe.map .content
                |> Maybe.withDefault ""
        scrollDecoder =
            Decode.map (\ratio ->
                OnScroll "editor-area"
                    { scene = { width = 0, height = 1 }
                    , viewport = { x = 0, y = ratio, width = 0, height = 1 }
                    }
            )
            (Decode.field "detail" (Decode.field "ratio" Decode.float))
    in
    node "codemirror-editor"
        [ id "editor-area"
        , property "content" (E.string content)
        , property "theme" (E.string (colorThemeToString model.colorTheme))
        , property "fontSize" (E.int (fontSizeToNumber model.fontSize))
        , on "editor-scroll" scrollDecoder
        , on "editor-change" (Decode.map EditorInput (Decode.at [ "detail" ] Decode.string))
        , stopPropagationOn "keydown" (Decode.succeed ( NoOp, True ))
        ]
        []

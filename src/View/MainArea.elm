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
import View.Reorder exposing (viewReorder)
import View.TitleEditModal exposing (viewTitleEditModal)
import View.ViewHelper exposing
    ( viewSortableItem
    , viewButton
    , viewEmptyState
    , stopClickPropagation
    , openDropdown
    )

mainContentArea : Model -> AppState -> Html Msg
mainContentArea model present =
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
                pageContentView model present
        , viewTitleEditModal model
        ]

mainAreaWrapper : String
mainAreaWrapper =
    tw [ "flex-1", "min-w-0", "h-full", "relative" ]


viewSortableShelfCard : Model -> Int -> Shelf -> Html Msg
viewSortableShelfCard model index shelf =
    let
        isEditingThisShelf =
            case model.editing of
                Just buffer ->
                    buffer.target == ShelfTitle && buffer.id == shelf.id

                Nothing ->
                    False
    in
    viewSortableItem 
        model.colorTheme 
        model.draggingState 
        DragShelf 
        index 
        isEditingThisShelf 
        (viewShelfCard model shelf)


-- MARK:本棚一覧ビュー
shelfListView : Model -> Html Msg
shelfListView model =
    div
        (class (shelfListContainerStyle model.colorTheme)
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


-- 2つ以下のときに animate-pulse（ゆっくり点滅）を付与
makeNewShelf : ColorTheme -> Bool -> Html Msg
makeNewShelf theme isGuiding =
    let
        pulseClass =
            if isGuiding then
                tw
                    [ "animate-pulse"
                    -- 速さ：秒数で自由に変更可能（例: 3s は標準よりさらにゆったり）
                    , "[animation-duration:2.5s]"
                    -- 色：amber（黄色/オレンジ系）や emerald（緑系）、sky（青系）などに変更可能
                    , "ring-2 ring-amber-400 ring-offset-1 ring-offset-transparent"
                    ]

            else
                ""
    in
    button
        [ class (tw [ menuButtonStyle theme, pulseClass ])
        , onClick CreateShelf
        ]
        [ text "New Shelf" ]

shelfListMenuStyle : String
shelfListMenuStyle =
    tw  [ "absolute"
        , "top-4"
        , "right-4"
        , "z-10"
        , "flex"
        , "flex-col"
        , "gap-1.5"
        , "p-1.5"
        ]


menuButtonStyle : ColorTheme -> String
menuButtonStyle theme =
    tw  [ "px-2.5"
        , "py-1"
        , "text-xs"
        , "font-medium", "shadow-sm"
        , "border"
        , "transition-all duration-100"
        , "hover:scale-105 hover:brightness-110 hover:shadow-md"
        , (basecolors theme).borderBtn
        , (basecolors theme).text
        , (basecolors theme).rounded
        , (basecolors theme).bg
        ]


shelfGrid : Model -> List Shelf -> Html Msg
shelfGrid model shelves =
    div [ class shelfGridStyle ]
        (List.indexedMap (viewSortableShelfCard model) shelves)


shelfListContainerStyle : ColorTheme -> String
shelfListContainerStyle theme =
    tw  [ "px-8", "py-8", "h-full", "overflow-y-auto"
        , (basecolors theme).bg
        ]


shelfListTitleStyle : ColorTheme -> String
shelfListTitleStyle theme =
    tw  [ "text-2xl", "font-bold"
        , "ml-4", "mb-1", "py-1", "w-xs"
        , "opacity-70"
        , (basecolors theme).text
        ]


shelfGridStyle : String
shelfGridStyle =
    tw  [ "grid", "grid-cols-1", "gap-8", "auto-rows-[250px]"
        , "sm:grid-cols-2", "lg:grid-cols-2", "xl:grid-cols-3"
        ]

-- MARK:ShelfCard
viewShelfCard : Model -> Shelf -> Html Msg
viewShelfCard model shelf =
    let
        theme = model.colorTheme
        isActive =
            model.present.currentShelfId == shelf.id
        menuId = ShelfExportMenu shelf.id
        isOpen =
            model.openMenuId == Just menuId
    in
    div
        [ class (shelfCardStyle theme isActive isOpen)
        , onClick (SelectShelf shelf.id)
        ]
        [ viewButton theme (DeleteButton (1, 1)) (DeleteShelf shelf.id) (Style.icon Icon.cansel "w-2 h-2")
        , viewShelfCardTitleRow model shelf 
        , viewShelfCardPreview shelf
        , shelfCardfooter model theme shelf
        ]


shelfCardStyle : ColorTheme -> Bool -> Bool -> String
shelfCardStyle theme isActive isOpen =
    let
        activeBorder =
            if isActive then
                tw  [(basecolors theme).borderStrong
                    , "border-2"
                    ]
            else
                (basecolors theme).borderBtn
        stackOrder =
            if isOpen then
                "z-30"
            else
                "z-0"
    in
        tw  [ "pt-6", "px-6", "w-full", "h-full", "relative", "transition-all duration-200"
            , "flex", "flex-col", "border"
            , stackOrder
            , "cursor-pointer"
            , "hover:shadow-xl"    --  hover:-translate-y-1 hover:brightness-105
            , (basecolors theme).text
            , (basecolors theme).surface
            , (basecolors theme).rounded
            , activeBorder
            ]


viewShelfCardTitleRow : Model -> Shelf -> Html Msg
viewShelfCardTitleRow model shelf =
    let
        theme = model.colorTheme
    in
    div [ class (titleRowStyle theme) ]
        [ viewShelfTitle model shelf ]


titleRowStyle : ColorTheme -> String
titleRowStyle theme =
    tw  [ "flex", "items-center", "gap-2", "mb-2" , "border-b-1"
        , (basecolors theme).accent
        , (basecolors theme).borderUnder
        ]


viewShelfCardPreview : Shelf -> Html Msg
viewShelfCardPreview shelf =
    shelf.books
        |> List.map .title
        |> List.take 7
        |> List.map renderPreviewTitle
        |> div [ class "flex-1 flex-col gap-1 overflow-hidden" ]


renderPreviewTitle : String -> Html Msg
renderPreviewTitle title =
    div [ class "flex text-sm truncate opacity-80 gap-2" ]
        [ text ("・" ++ title) ]


shelfCardfooter : Model -> ColorTheme -> Shelf -> Html Msg
shelfCardfooter model theme shelf =
    div [ class (footerRowStyle theme) ]
        [ renderShelfCountLabel theme shelf
        , renderShelfExportControls model theme shelf
        ]


renderShelfExportControls : Model -> ColorTheme -> Shelf -> Html Msg
renderShelfExportControls model theme shelf =
    let
        menuId =
            ShelfExportMenu shelf.id

        isOpen =
            model.openMenuId == Just menuId
    in
    div [ class (exportContainerStyle isOpen) ]
        [ renderShelfTriggerButton theme menuId
        , openDropdown isOpen Below theme (shelfExportMenuItems shelf)
        ]


renderShelfTriggerButton : ColorTheme -> MenuId -> Html Msg
renderShelfTriggerButton theme menuId =
    button
        [ class (miniButtonStyle theme)
        , stopClickPropagation (ToggleMenu menuId)
        ]
        [ text "Export ▾" ]


shelfExportMenuItems : Shelf -> List ( String, Msg )
shelfExportMenuItems shelf =
    [ ( "JSON", ExportShelfJson shelf )
    , ( "ZIP", ExportShelfZip shelf.id )
    ]


renderShelfCountLabel : ColorTheme -> Shelf -> Html Msg
renderShelfCountLabel theme shelf =
    span
        [ class (countLabelStyle theme) ]
        [ text (formatShelfCountText shelf) ]


formatShelfCountText : Shelf -> String
formatShelfCountText shelf =
    String.fromInt (List.length shelf.books) ++ " Books"


footerRowStyle : ColorTheme -> String
footerRowStyle = \theme ->
    tw  [ "flex", "items-center", "justify-between"
        , "w-full", "py-2", "mt-auto", "border-t"
        , (basecolors theme).borderUnder
        ]


countLabelStyle : ColorTheme -> String
countLabelStyle theme =
    tw
        [ "text-xs", "font-medium"
        , (basecolors theme).text
        , "mb-1", "opacity-70", "whitespace-nowrap" ]

-- 本棚カードのタイトル

viewShelfTitle : Model -> Shelf -> Html Msg
viewShelfTitle model shelf =
    h3
        [ class "text-lg font-bold truncate cursor-pointer"
        , style "font-family" (basecolors model.colorTheme).fontDeco
        , onDoubleClick (EditBegin ShelfTitle shelf.id shelf.name)
        , stopClickPropagation NoOp
        , title "Double click to edit"
        ]
        [ text shelf.name ]


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
                (class (shelfDetailViewStyle model.colorTheme)
                    :: Style.scrollbarStyle model.colorTheme
                )
                [ shelfDetailTitle model shelf.name
                , viewShelfBookGrid model shelf.books
                , bookListMenu model shelfId
                ]

        Nothing ->
            viewEmptyState model


shelfDetailViewStyle : ColorTheme -> String
shelfDetailViewStyle theme =
    tw  [ "p-8"
        , "overflow-y-auto"
        , "h-full"
        , (basecolors theme).text
        , (basecolors theme).bg
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
        [ text "New Book" ]


-- 本一覧グリッド
viewShelfBookGrid : Model -> List Book -> Html Msg
viewShelfBookGrid model books =
    div [ class shelfBookGridStyle ]
        (List.indexedMap 
            (\i b -> 
                let
                    isEditingThisBook =
                        case model.editing of
                            Just buffer -> buffer.target == BookTitle && buffer.id == b.id
                            Nothing -> False
                in
                viewSortableItem 
                    model.colorTheme 
                    model.draggingState 
                    DragBook 
                    i 
                    isEditingThisBook
                    (viewBookCard model b isEditingThisBook)
            )
            books
        )

shelfBookGridStyle : String
shelfBookGridStyle =
    tw  [ "grid", "grid-cols-1"
        , "sm:grid-cols-2", "lg:grid-cols-2", "xl:grid-cols-3"
        , "gap-8", "auto-rows-[250px]" ]


-- MARK:BookCard

viewBookCard : Model -> Book -> Bool -> Html Msg
viewBookCard model book isEditing =
    let
        theme =
            model.colorTheme

        isActive =
            model.present.currentBookId == Just book.id

        isOpen =
            model.openMenuId == Just (BookExportMenu book.id)

        cardEventHandlers =
            if isEditing then
                [ stopPropagationOn "pointerdown" (Decode.succeed ( EditSubmit, True ))
                , stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
                ]

            else
                [ onClick (SelectBook book.id) ]
    in
    div
        ( class (bookCardStyle theme isActive isOpen) :: cardEventHandlers )
        [ viewButton theme (DeleteButton (1, 1)) (DeleteBook book.id) (Style.icon Icon.cansel "w-2 h-2")
        , bookTitleRow model book
        , bookHeadingList theme book
        , bookCardFooter model theme book
        ]


bookCardStyle : ColorTheme -> Bool -> Bool -> String
bookCardStyle theme isActive isOpen=
    let
        activeBorder =
            if isActive then
                tw  [(basecolors theme).borderStrong
                    , "border-2"
                    ]
            else
                (basecolors theme).borderBtn
        corners =
            if theme == Magical then
                (basecolors theme).rounded
            else
                "rounded-2xl"
        
        stackOrder =
            if isOpen then
                "z-30"

            else
                "z-0"
    in
    tw  [ "flex", "flex-col", "relative"
        , "w-full", "h-full", "pt-5", "px-5", "shadow-lg"
        , "hover:shadow-xl", "border"
        , "cursor-pointer"
        , stackOrder
        , corners
        , (basecolors theme).surface
        , activeBorder
        ]


bookCardFooter : Model -> ColorTheme -> Book -> Html Msg
bookCardFooter model theme book =
    div [ class (cardFooterStyle theme) ]
        [ renderBookCountLabel theme book
        , renderExportControls model theme book
        ]


renderExportControls : Model -> ColorTheme -> Book -> Html Msg
renderExportControls model theme book =
    let
        menuId =
            BookExportMenu book.id

        isOpen =
            model.openMenuId == Just menuId
    in
    div [ class (exportContainerStyle isOpen) ]
        [ renderTriggerButton theme menuId
        , openDropdown isOpen Below theme (exportMenuItems book)
        ]


exportContainerStyle : Bool -> String
exportContainerStyle isOpen =
    tw
        [ "relative", "mt-auto", "flex", "justify-end"
        , if isOpen then
            "z-30"

          else
            "z-0"
        ]


renderTriggerButton : ColorTheme -> MenuId -> Html Msg
renderTriggerButton theme menuId =
    button
        [ class (miniButtonStyle theme)
        , stopClickPropagation (ToggleMenu menuId)
        ]
        [ text "Export ▾" ]


exportMenuItems : Book -> List ( String, Msg )
exportMenuItems book =
    [ ( "JSON", ExportBookJson book )
    , ( "ZIP", ExportBookZip book.id )
    ]


miniButtonStyle : ColorTheme -> String
miniButtonStyle theme =
    tw  [ "px-1"
        , "text-[12px]", "font-bold", "uppercase"
        , "hover:bg-white/10"
        , (basecolors theme).textMuted
        , "border", "rounded-sm", (basecolors theme).borderBtn
        ]


renderBookCountLabel : ColorTheme -> Book -> Html Msg
renderBookCountLabel theme book =
    span
        [ class (countLabelStyle theme) ]
        [ text (formatBookCountText book) ]


formatBookCountText : Book -> String
formatBookCountText book =
    String.fromInt (List.length book.pages)
        ++ " Pages "


cardFooterStyle : ColorTheme -> String
cardFooterStyle theme =
    tw  [ "flex", "items-center", "justify-between"
        , "w-full"
        , "py-2", "mt-auto"
        , "border-t"
        , (basecolors theme).borderUnder
        ]


bookTitleRow : Model -> Book -> Html Msg
bookTitleRow model book =
    div [ class "flex items-center gap-2 mb-2"
        , title "Edit Title" ]
        [ bookTitleText model book ]


bookTitleText : Model -> Book -> Html Msg
bookTitleText model book =
    h3
        [ class (bookTitleTextStyle model.colorTheme)
        , onDoubleClick (EditBegin BookTitle book.id book.title)
        , stopClickPropagation NoOp
        ]
        [ text book.title ]


bookTitleTextStyle : ColorTheme -> String
bookTitleTextStyle = \theme ->
        tw  [ "text-lg"
            , "font-bold"
            , "ml-2", "mb-1"
            , (basecolors theme).text
            , (basecolors theme).surface
            , "truncate"
            ]

bookHeadingList : ColorTheme -> Book -> Html Msg
bookHeadingList theme book =
    let
        headings =
            getBookHeadingsForCard book
                |> List.indexedMap Tuple.pair
    in
    div []
        (List.map (\(i, h) -> bookHeadingItem theme i h.text) headings)

bookHeadingItem : ColorTheme -> Int -> String -> Html Msg
bookHeadingItem theme index textContent =
    div
        [ class (headingItemStyle theme index) ]
        [ text textContent ]


headingItemStyle : ColorTheme -> Int -> String
headingItemStyle = \theme _ ->
    tw  [ "text-sm", "truncate", "mb-1", "mx-3", (basecolors theme).text ++ " opacity-80" ]



getBookHeadingsForCard : Book -> List Heading
getBookHeadingsForCard book =
    book.pages
        |> List.indexedMap (\i p -> extractHeadings i p.content)
        |> List.concat
        |> List.filter (\h -> h.level == 1)
        |> List.take 6


-- MARK:ページ閲覧
pageContentView : Model -> AppState -> Html Msg
pageContentView model present =
    case getCurrentBook present of
        Nothing ->
            viewEmptyState model

        Just book ->
            main_
                [ class (mainWrapperStyle model.colorTheme)
                , preventDefaultOn "dragover" (Decode.succeed ( NoOp, True ))
                , preventDefaultOn "drop" (Decode.succeed ( NoOp, True ))
                ]
                [ div
                    [ class "flex-1 overflow-y-auto" ]
                    [ centralArea model present book ]
                , viewFooter model present book model.colorTheme
                ]


mainWrapperStyle : ColorTheme -> String
mainWrapperStyle theme =
    tw  [ "relative", "flex", "flex-col"
        , "min-h-screen", "w-full", "h-full"
        , "overflow-hidden"
        , (basecolors theme).bg 
        ]


-- MARK:文書エリア
centralArea : Model -> AppState -> Book -> Html Msg
centralArea model present book =
    div
        ([ id "page-view-area"
         , class "flex-1 flex h-full relative overflow-y-auto justify-center"
         , Html.Events.on "scroll" (Decode.map (OnScroll "page-view-area") scrollDecoder)
         ]
            ++ Style.scrollbarStyle model.colorTheme
        )
        [ viewContentBody model present book ]

viewContentBody : Model -> AppState -> Book -> Html Msg
viewContentBody model present book =
    let
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
                viewReorder model present book
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


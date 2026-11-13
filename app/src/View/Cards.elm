module View.Cards exposing (shelfGrid, viewShelfBookGrid, viewShelfGrid)

import Domain.Helper exposing (extractHeadings, stripEmphasis)
import Html exposing (Attribute, Html, button, div, h3, span, text)
import Html.Attributes exposing (class, style, title)
import Html.Events exposing (onClick, onDoubleClick, stopPropagationOn)
import Icon exposing (cansel)
import Json.Decode as Decode
import Type
    exposing
        ( Book
        , ButtonKind(..)
        , ColorTheme
        , DragTarget(..)
        , EditBuffer
        , EditTarget(..)
        , Heading
        , MenuId(..)
        , Model
        , Msg(..)
        , Shelf
        )
import View.Style as Style exposing (basecolors, tw)
import View.ViewHelper exposing (stopClickPropagation, viewButton, viewSortableItem)


-- ===================================================
-- MARK: 定数定義（規約8：マジック文字列の排除）
-- ===================================================

commonGridClass : String
commonGridClass =
    tw
        [ "grid"
        , "grid-cols-1"
        , "md:grid-cols-2"
        , "2xl:grid-cols-3"
        , "gap-x-10"
        , "gap-y-10"
        , "[&>div]:w-full"
        ]


previewContainerClass : String
previewContainerClass =
    tw
        [ "flex"
        , "flex-col"
        , "justify-start"
        , "h-[88px]"
        , "space-y-1.5"
        , "overflow-hidden"
        , "min-w-0"
        , "my-2"
        ]


tooltipWidthClass : String
tooltipWidthClass =
    "w-72"



-- ===================================================
-- MARK: 公開一覧ビュー（規約4：viewで始める）
-- ===================================================

{-| 既存呼び出しとの互換エイリアス
-}
shelfGrid : Model -> List Shelf -> Html Msg
shelfGrid =
    viewShelfGrid


viewShelfGrid : Model -> List Shelf -> Html Msg
viewShelfGrid model shelves =
    div
        [ class commonGridClass ]
        (List.indexedMap (viewSortableShelfTile model) shelves)


viewShelfBookGrid : Model -> List Book -> Html Msg
viewShelfBookGrid model books =
    div
        [ class commonGridClass ]
        (List.indexedMap (viewSortableBookTile model) books)



-- ===================================================
-- MARK: 本棚・本の個別タイル生成
-- ===================================================

viewSortableShelfTile : Model -> Int -> Shelf -> Html Msg
viewSortableShelfTile model index shelf =
    let
        isEditing =
            isShelfEditing model.editing shelf.id
    in
    viewSortableItem
        model.colorTheme
        model.draggingState
        DragShelf
        index
        isEditing
        (viewShelfTile model index shelf isEditing)


viewShelfTile : Model -> Int -> Shelf -> Bool -> Html Msg
viewShelfTile model index shelf isEditing =
    let
        theme =
            model.colorTheme

        isActive =
            model.present.currentShelfId == shelf.id

        isMenuOpen =
            model.openMenuId == Just (ShelfExportMenu shelf.id)
    in
    viewArchiveTile
        { theme = theme
        , index = index
        , isActive = isActive
        , isMenuOpen = isMenuOpen
        , isEditing = isEditing
        , typeLabel = "SHELF"
        , title = shelf.name
        , onSelect = SelectShelf shelf.id
        , onEdit = EditBegin ShelfTitle shelf.id shelf.name
        , onDelete = DeleteShelf shelf.id
        , previewItems = extractBookTitles shelf.books
        , emptyPlaceholder = "（本がありません）"
        , totalCount = List.length shelf.books
        , countLabel = "Books"
        , exportMenuId = ShelfExportMenu shelf.id
        , exportItems =
            [ ( "JSON", ExportShelfJson shelf )
            , ( "ZIP", ExportShelfZip shelf.id )
            ]
        , tooltip = viewShelfTooltip theme index shelf
        }


viewSortableBookTile : Model -> Int -> Book -> Html Msg
viewSortableBookTile model index book =
    let
        isEditing =
            isBookEditing model.editing book.id
    in
    viewSortableItem
        model.colorTheme
        model.draggingState
        DragBook
        index
        isEditing
        (viewBookTile model index book isEditing)


viewBookTile : Model -> Int -> Book -> Bool -> Html Msg
viewBookTile model index book isEditing =
    let
        theme =
            model.colorTheme

        isActive =
            model.present.currentBookId == Just book.id

        isMenuOpen =
            model.openMenuId == Just (BookExportMenu book.id)

        allHeadings =
            getAllH1Headings book
    in
    viewArchiveTile
        { theme = theme
        , index = index
        , isActive = isActive
        , isMenuOpen = isMenuOpen
        , isEditing = isEditing
        , typeLabel = "BOOK"
        , title = book.title
        , onSelect = SelectBook book.id
        , onEdit = EditBegin BookTitle book.id book.title
        , onDelete = DeleteBook book.id
        , previewItems = extractHeadingPreviews allHeadings
        , emptyPlaceholder = "（見出しがありません）"
        , totalCount = List.length book.pages
        , countLabel = "Pages"
        , exportMenuId = BookExportMenu book.id
        , exportItems =
            [ ( "JSON", ExportBookJson book )
            , ( "ZIP", ExportBookZip book.id )
            ]
        , tooltip = viewBookTooltip theme index book.id allHeadings
        }



-- ===================================================
-- MARK: 共通アーカイブタイル（規約1, 3：宣言的かつ小さく保つ）
-- ===================================================

{-| Model全体を保持せず、必要な値のみを受け取る設定レコード（規約6）
-}
type alias ArchiveTileConfig =
    { theme : ColorTheme
    , index : Int
    , isActive : Bool
    , isMenuOpen : Bool
    , isEditing : Bool
    , typeLabel : String
    , title : String
    , onSelect : Msg
    , onEdit : Msg
    , onDelete : Msg
    , previewItems : List String
    , emptyPlaceholder : String
    , totalCount : Int
    , countLabel : String
    , exportMenuId : MenuId
    , exportItems : List ( String, Msg )
    , tooltip : Html Msg
    }


viewArchiveTile : ArchiveTileConfig -> Html Msg
viewArchiveTile cfg =
    div
        (class (ruledItemWrapperStyle cfg.theme cfg.isActive cfg.isMenuOpen)
            :: viewTileInteractiveAttributes cfg.isEditing cfg.onSelect
        )
        [ viewTileHeader cfg.theme cfg.typeLabel cfg.onDelete
        , viewTileTitle cfg.theme cfg.title cfg.onEdit
        , viewPreviewSection cfg.theme cfg.previewItems cfg.emptyPlaceholder
        , viewTileFooter cfg
        , cfg.tooltip
        ]


viewTileHeader : ColorTheme -> String -> Msg -> Html Msg
viewTileHeader theme typeLabel onDelete =
    div
        [ class "flex items-center justify-between min-w-0 pt-1" ]
        [ span
            [ class (tw [ "text-[10px] font-mono font-bold tracking-widest uppercase opacity-85", (basecolors theme).accent ]) ]
            [ text typeLabel ]
        , viewCardDeleteButton theme onDelete
        ]


viewTileTitle : ColorTheme -> String -> Msg -> Html Msg
viewTileTitle theme titleText onEdit =
    h3
        [ class (tw [ "text-lg font-bold truncate leading-snug cursor-pointer my-1.5 opacity-90", (basecolors theme).text ])
        , style "font-family" (basecolors theme).fontDeco
        , onDoubleClick onEdit
        , stopClickPropagation NoOp
        , title "ダブルクリックで名前変更"
        ]
        [ text titleText ]


viewPreviewSection : ColorTheme -> List String -> String -> Html Msg
viewPreviewSection theme items emptyText =
    div
        [ class previewContainerClass ]
        (if List.isEmpty items then
            [ viewEmptyPreview theme emptyText ]

         else
            List.indexedMap (viewPreviewRowItem theme) items
        )


viewEmptyPreview : ColorTheme -> String -> Html Msg
viewEmptyPreview theme emptyText =
    div
        [ class (tw [ "h-full flex items-center text-xs italic opacity-35 pl-5", (basecolors theme).text ]) ]
        [ text emptyText ]


viewPreviewRowItem : ColorTheme -> Int -> String -> Html Msg
viewPreviewRowItem theme index itemTitle =
    div
        [ class "flex items-center text-xs h-5 min-w-0" ]
        [ span
            [ class (tw [ "font-mono font-medium text-[11px] opacity-60 mr-2.5 shrink-0 select-none", (basecolors theme).text ]) ]
            [ text (formatIndexNumber index) ]
        , span
            [ class (tw [ "truncate flex-1 font-medium opacity-85 hover:opacity-100 transition-opacity", (basecolors theme).text ]) ]
            [ text itemTitle ]
        ]


viewTileFooter : ArchiveTileConfig -> Html Msg
viewTileFooter cfg =
    div
        [ class "flex items-center justify-between text-xs pt-2 mt-auto border-t border-black/5 dark:border-white/5 shrink-0 min-w-0" ]
        [ div
            [ class "flex items-center gap-2 font-mono text-[11px] truncate min-w-0" ]
            [ span
                [ class (tw [ "font-medium opacity-80 shrink-0", (basecolors cfg.theme).text ]) ]
                [ text (formatCountText cfg.totalCount cfg.countLabel) ]
            , viewMoreCount cfg.theme cfg.totalCount
            ]
        , viewCompactExportMenu cfg.theme cfg.isMenuOpen cfg.exportMenuId cfg.exportItems
        ]


viewMoreCount : ColorTheme -> Int -> Html Msg
viewMoreCount theme totalCount =
    if totalCount > 4 then
        span
            [ class (tw [ "font-bold opacity-95 shrink-0", (basecolors theme).accent ]) ]
            [ text (formatMoreText totalCount) ]

    else
        text ""



-- ===================================================
-- MARK: エクスポートメニュー（規約12：操作UIの独立化）
-- ===================================================

viewCompactExportMenu : ColorTheme -> Bool -> MenuId -> List ( String, Msg ) -> Html Msg
viewCompactExportMenu theme isMenuOpen menuId items =
    div
        [ class "relative flex justify-end shrink-0" ]
        [ viewExportMenuTrigger theme menuId
        , if isMenuOpen then
            viewExportDropdown theme items

          else
            text ""
        ]


viewExportMenuTrigger : ColorTheme -> MenuId -> Html Msg
viewExportMenuTrigger theme menuId =
    button
        [ class (tw [ "px-1.5 py-0.5 text-[11px] font-mono font-bold uppercase rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors", (basecolors theme).accent ])
        , stopClickPropagation (ToggleMenu menuId)
        ]
        [ text "Export ▾" ]


viewExportDropdown : ColorTheme -> List ( String, Msg ) -> Html Msg
viewExportDropdown theme items =
    div
        []
        [ viewExportMenuBackdrop
        , div
            [ class (tw [ "absolute right-0 top-full mt-1.5 z-50 flex flex-col p-1 w-24 border shadow-xl rounded-lg backdrop-blur-md animate-[fadeIn_0.1s_ease-out]", (basecolors theme).surface, (basecolors theme).borderBtn ]) ]
            (List.map (viewExportMenuItem theme) items)
        ]


viewExportMenuBackdrop : Html Msg
viewExportMenuBackdrop =
    div
        [ class "fixed inset-0 z-40 bg-transparent cursor-default"
        , stopClickPropagation CloseMenu
        ]
        []


viewExportMenuItem : ColorTheme -> ( String, Msg ) -> Html Msg
viewExportMenuItem theme ( label, actionMsg ) =
    button
        [ class (tw [ "w-full px-2 py-1 text-center text-xs font-mono font-semibold rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors", (basecolors theme).text ])
        , stopClickPropagation (SelectMenuItem actionMsg)
        ]
        [ text label ]


viewCardDeleteButton : ColorTheme -> Msg -> Html Msg
viewCardDeleteButton theme deleteMsg =
    viewButton
        theme
        (DeleteButton ( 0, 0 ))
        deleteMsg
        (Style.icon cansel "w-2.5 h-2.5")



-- ===================================================
-- MARK: ツールチップ表示（規約3, 9：専用リスト描画関数）
-- ===================================================

viewShelfTooltip : ColorTheme -> Int -> Shelf -> Html Msg
viewShelfTooltip theme index shelf =
    if List.isEmpty shelf.books then
        text ""

    else
        viewTooltipContainer
            index
            tooltipWidthClass
            [ div
                [ class (tooltipBoxStyle theme) ]
                [ viewTooltipHeader theme "All Books in Shelf"
                , div
                    (class "max-h-52 overflow-y-auto space-y-1 pr-1" :: Style.scrollbarStyle theme)
                    (List.indexedMap (viewShelfTooltipItem theme) shelf.books)
                , viewTooltipArrow theme index
                ]
            ]


viewShelfTooltipItem : ColorTheme -> Int -> Book -> Html Msg
viewShelfTooltipItem theme index book =
    div
        [ class (tw [ "flex items-center gap-2 text-xs py-1.5 px-2 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors", (basecolors theme).text ])
        , stopClickPropagation (SelectBook book.id)
        , title "直接この本を開く"
        ]
        [ span
            [ class (tw [ "font-mono text-xs opacity-50 shrink-0", (basecolors theme).accent ]) ]
            [ text (formatIndexNumber index) ]
        , span
            [ class "font-medium truncate flex-1" ]
            [ text book.title ]
        ]


viewBookTooltip : ColorTheme -> Int -> String -> List Heading -> Html Msg
viewBookTooltip theme index bookId allHeadings =
    if List.isEmpty allHeadings then
        text ""

    else
        viewTooltipContainer
            index
            tooltipWidthClass
            [ div
                [ class (tooltipBoxStyle theme) ]
                [ viewTooltipHeader theme "Table of Contents"
                , div
                    (class "max-h-52 overflow-y-auto space-y-1.5 pr-1" :: Style.scrollbarStyle theme)
                    (List.map (viewBookTooltipItem theme bookId) allHeadings)
                , viewTooltipArrow theme index
                ]
            ]


viewBookTooltipItem : ColorTheme -> String -> Heading -> Html Msg
viewBookTooltipItem theme bookId heading =
    div
        [ class (tw [ "text-xs py-1 px-1.5 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 truncate transition-colors flex items-center gap-2", (basecolors theme).text ])
        , stopClickPropagation (JumpToBookHeading bookId heading.pageIndex (String.fromInt heading.order))
        , title (formatPageJumpTitle heading.pageIndex)
        ]
        [ span
            [ class (tw [ "text-xs font-mono opacity-60 shrink-0", (basecolors theme).accent ]) ]
            [ text (formatPageBadgeText heading.pageIndex) ]
        , span
            [ class "truncate flex-1 font-medium" ]
            [ text (stripEmphasis heading.text) ]
        ]


viewTooltipContainer : Int -> String -> List (Html Msg) -> Html Msg
viewTooltipContainer index widthClass children =
    div
        [ class (tw [ "absolute z-50", widthClass, resolveTooltipSideClass index, "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 ease-out" ]) ]
        children


viewTooltipArrow : ColorTheme -> Int -> Html Msg
viewTooltipArrow theme index =
    div
        [ class (tw [ "absolute w-3 h-3 rotate-45", resolveTooltipArrowClass index, (basecolors theme).bg, (basecolors theme).borderBtn ]) ]
        []


viewTooltipHeader : ColorTheme -> String -> Html Msg
viewTooltipHeader theme titleText =
    div
        [ class (tw [ "flex items-center justify-between pb-2 mb-2 border-b", (basecolors theme).borderUnder ]) ]
        [ span
            [ class (tw [ "text-xs font-bold font-mono uppercase tracking-wider", (basecolors theme).text ]) ]
            [ text titleText ]
        ]



-- ===================================================
-- MARK: ヘルパー＆スタイル（表示専用ロジック・規約7）
-- ===================================================

viewTileInteractiveAttributes : Bool -> Msg -> List (Attribute Msg)
viewTileInteractiveAttributes isEditing onSelect =
    if isEditing then
        [ stopPropagationOn "pointerdown" (Decode.succeed ( EditSubmit, True ))
        , stopClickPropagation NoOp
        ]

    else
        [ onClick onSelect ]


isShelfEditing : Maybe EditBuffer -> String -> Bool
isShelfEditing maybeEditing shelfId =
    case maybeEditing of
        Just buffer ->
            buffer.target == ShelfTitle && buffer.id == shelfId

        Nothing ->
            False


isBookEditing : Maybe EditBuffer -> String -> Bool
isBookEditing maybeEditing bookId =
    case maybeEditing of
        Just buffer ->
            buffer.target == BookTitle && buffer.id == bookId

        Nothing ->
            False


extractBookTitles : List Book -> List String
extractBookTitles books =
    books
        |> List.take 4
        |> List.map .title


extractHeadingPreviews : List Heading -> List String
extractHeadingPreviews headings =
    headings
        |> List.take 4
        |> List.map (.text >> stripEmphasis)


getAllH1Headings : Book -> List Heading
getAllH1Headings book =
    book.pages
        |> List.indexedMap (\i p -> extractHeadings i p.content)
        |> List.concat
        |> List.filter (\h -> h.level == 1)


formatIndexNumber : Int -> String
formatIndexNumber index =
    String.padLeft 2 '0' (String.fromInt (index + 1))


formatCountText : Int -> String -> String
formatCountText count label =
    String.fromInt count ++ " " ++ label


formatMoreText : Int -> String
formatMoreText totalCount =
    "+" ++ String.fromInt (totalCount - 4) ++ " more"


formatPageJumpTitle : Int -> String
formatPageJumpTitle pageIndex =
    "P." ++ String.fromInt (pageIndex + 1) ++ " へジャンプ"


formatPageBadgeText : Int -> String
formatPageBadgeText pageIndex =
    "P." ++ String.fromInt (pageIndex + 1)


ruledItemWrapperStyle : ColorTheme -> Bool -> Bool -> String
ruledItemWrapperStyle theme isActive isOpen =
    let
        borderActive =
            if isActive then
                tw [ (basecolors theme).borderStrong, "border-t-2" ]

            else
                "border-t border-black/15 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30"

        stackOrder =
            if isOpen then
                "z-30"

            else
                "z-0 hover:z-20"
    in
    tw
        [ "group relative w-full h-[220px] pt-3 pb-2 px-1"
        , "transition-colors duration-150 cursor-pointer flex flex-col justify-between"
        , "bg-transparent hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
        , borderActive
        , stackOrder
        ]


tooltipBoxStyle : ColorTheme -> String
tooltipBoxStyle theme =
    tw
        [ "p-3.5 rounded-xl border shadow-2xl backdrop-blur-md"
        , (basecolors theme).bg
        , (basecolors theme).borderBtn
        ]


resolveTooltipSideClass : Int -> String
resolveTooltipSideClass index =
    let
        m6 =
            modBy 6 index
    in
    if m6 == 0 || m6 == 4 then
        tw
            [ "left-[calc(100%+12px)] top-1/2"
            , "before:absolute before:-left-3 before:-top-2 before:bottom-0 before:w-3 before:content-['']"
            ]

    else if m6 == 5 then
        tw
            [ "right-[calc(100%+12px)] top-1/2"
            , "before:absolute before:-right-3 before:-top-2 before:bottom-0 before:w-3 before:content-['']"
            ]

    else if m6 == 1 || m6 == 3 then
        tw
            [ "top-1/2"
            , "left-[calc(100%+12px)] right-auto before:absolute before:-left-3 before:right-auto before:-top-2 before:bottom-0 before:w-3 before:content-['']"
            , "md:left-auto md:right-[calc(100%+12px)] md:before:-right-3 md:before:left-auto"
            , "2xl:left-[calc(100%+12px)] 2xl:right-auto 2xl:before:-left-3 2xl:before:right-auto"
            ]

    else
        tw
            [ "top-1/2"
            , "left-[calc(100%+12px)] right-auto before:absolute before:-left-3 before:right-auto before:-top-2 before:bottom-0 before:w-3 before:content-['']"
            , "2xl:left-auto 2xl:right-[calc(100%+12px)] 2xl:before:-right-3 2xl:before:left-auto"
            ]


resolveTooltipArrowClass : Int -> String
resolveTooltipArrowClass index =
    let
        m6 =
            modBy 6 index
    in
    if m6 == 0 || m6 == 4 then
        "-left-1.5 top-4 border-l border-b"

    else if m6 == 5 then
        "-right-1.5 top-4 border-r border-t"

    else if m6 == 1 || m6 == 3 then
        tw
            [ "top-4"
            , "-left-1.5 right-auto border-l border-b border-r-0 border-t-0"
            , "md:left-auto md:-right-1.5 md:border-r md:border-t md:border-l-0 md:border-b-0"
            , "2xl:-left-1.5 2xl:right-auto 2xl:border-l 2xl:border-b 2xl:border-r-0 2xl:border-t-0"
            ]

    else
        tw
            [ "top-4"
            , "-left-1.5 right-auto border-l border-b border-r-0 border-t-0"
            , "2xl:left-auto 2xl:-right-1.5 2xl:border-r 2xl:border-t 2xl:border-l-0 2xl:border-b-0"
            ]
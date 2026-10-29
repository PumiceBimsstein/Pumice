module View.Cards exposing (shelfGrid, viewShelfBookGrid)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode
import Type exposing (..)
import View.Style as Style exposing (basecolors, tw)
import Domain.Helper exposing (extractHeadings, stripEmphasis)
import Icon exposing (cansel)
import View.ViewHelper exposing (viewSortableItem, viewButton, stopClickPropagation)


-- MARK: ツールチップ出現位置の型定義
type TooltipSide
    = TooltipRight
    | TooltipLeft



-- MARK: 本棚一覧（Shelf）

{-| 本棚一覧グリッド（超広幅画面 2xl: 1536px 以上でのみ3列、通常はゆったり2列） -}
shelfGrid : Model -> List Shelf -> Html Msg
shelfGrid model shelves =
    div [ class "grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8" ]
        (List.indexedMap (viewSortableShelfCard model) shelves)


viewSortableShelfCard : Model -> Int -> Shelf -> Html Msg
viewSortableShelfCard model index shelf =
    let
        isEditing =
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
        isEditing
        (viewShelfCard model index shelf)


viewShelfCard : Model -> Int -> Shelf -> Html Msg
viewShelfCard model index shelf =
    let
        theme =
            model.colorTheme

        isActive =
            model.present.currentShelfId == shelf.id

        isOpen =
            model.openMenuId == Just (ShelfExportMenu shelf.id)
    in
    div
        [ class (shelfCardWrapperStyle theme isActive isOpen)
        , onClick (SelectShelf shelf.id)
        ]
        [ viewCardDeleteButton theme (DeleteShelf shelf.id)
        , viewShelfCardHeader theme shelf
        , viewShelfCardSlots theme shelf.books
        , viewShelfCardFooter model theme shelf
        , viewShelfTooltip theme index shelf
        ]


-- 本棚カードのヘッダー
viewShelfCardHeader : ColorTheme -> Shelf -> Html Msg
viewShelfCardHeader theme shelf =
    let
        bookCount =
            List.length shelf.books
    in
    div [ class "flex flex-col gap-1 min-w-0 pr-6 shrink-0" ]
        [ div [ class "flex items-center justify-between" ]
            [ div [ class "flex items-center gap-1.5" ]
                [ span [ class (tw [ "w-2 h-2 rounded-full shrink-0", (basecolors theme).primary ]) ] []
                , span [ class (tw [ "text-[11px] font-mono font-bold tracking-wider uppercase", (basecolors theme).accent ]) ] [ text "SHELF" ]
                ]
            , span [ class (tw [ "text-xs font-mono px-2 py-0.5 rounded-full font-medium opacity-80", (basecolors theme).brightAccent, (basecolors theme).text ]) ]
                [ text (String.fromInt bookCount ++ " Books") ]
            ]
        , h3
            [ class (tw [ "text-lg font-bold leading-tight cursor-pointer truncate mt-0.5", (basecolors theme).text ])
            , style "font-family" (basecolors theme).fontDeco
            , onDoubleClick (EditBegin ShelfTitle shelf.id shelf.name)
            , stopClickPropagation NoOp
            , title "ダブルクリックで名前変更"
            ]
            [ text shelf.name ]
        ]


{-| 本棚カードの中央スロット（枠線・区切り線を廃止し、明るい背景色のみ。冊数に関わらず範囲を固定） -}
viewShelfCardSlots : ColorTheme -> List Book -> Html Msg
viewShelfCardSlots theme books =
    let
        total =
            List.length books

        previewBooks =
            List.take 4 books
    in
    div [ class "flex flex-col justify-center my-2 min-w-0" ]
        [ div
            [ class (tw [ "h-[124px] rounded-lg p-1.5 flex flex-col justify-start overflow-hidden"
                        , (basecolors theme).brightAccent
                        ])
            ]
            [ if List.isEmpty books then
                div [ class (tw [ "h-full flex items-center justify-center text-xs italic opacity-40", (basecolors theme).text ]) ]
                    [ text "（本がありません）" ]

              else
                div [ class "flex flex-col min-w-0" ]
                    (List.indexedMap (viewShelfSlotItem theme) previewBooks)
            ]
        , div [ class "h-4 mt-1 flex items-center justify-end" ]
            [ if total > 4 then
                span
                    [ class (tw [ "text-xs font-mono font-semibold opacity-85 block", (basecolors theme).accent ]) ]
                    [ text ("+" ++ String.fromInt (total - 4) ++ " more books →") ]

              else
                text ""
            ]
        ]


{-| 1つのスロットアイテム部品（枠線・区切りなし、固定高さで整列） -}
viewShelfSlotItem : ColorTheme -> Int -> Book -> Html Msg
viewShelfSlotItem theme index book =
    div
        [ class "flex items-center px-2.5 h-7 min-w-0" ]
        [ span 
            [ class (tw [ "text-xs font-mono opacity-50 mr-2.5 shrink-0", (basecolors theme).text ]) ]
            [ text (String.padLeft 2 '0' (String.fromInt (index + 1))) ]
        , span
            [ class (tw [ "text-xs font-medium truncate flex-1", (basecolors theme).text ]) ]
            [ text book.title ]
        ]


{-| 本棚カードのフッター行 -}
viewShelfCardFooter : Model -> ColorTheme -> Shelf -> Html Msg
viewShelfCardFooter model theme shelf =
    let
        menuId =
            ShelfExportMenu shelf.id
    in
    div [ class (shelfFooterRowStyle theme) ]
        [ span
            [ class (tw [ "text-xs opacity-60 font-mono", (basecolors theme).text ]) ]
            [ text "クリックで本棚を開く" ]
        , viewCompactExportMenu model theme menuId
            [ ( "JSON", ExportShelfJson shelf )
            , ( "ZIP", ExportShelfZip shelf.id )
            ]
        ]


-- ===================================================
-- MARK: 本棚用ツールチップ
-- ===================================================

{-| 本棚カードの全本一覧ツールチップ（基本は右側、右サイドバーにかかる右端列のみ左側に出現） -}
viewShelfTooltip : ColorTheme -> Int -> Shelf -> Html Msg
viewShelfTooltip theme index shelf =
    if List.isEmpty shelf.books then
        text ""

    else
        viewShelfTooltipContainer index "w-[88%]"
            [ div [ class (tooltipBoxStyle theme) ]
                [ viewTooltipHeader theme "All Books in Shelf"
                , div (class "max-h-52 overflow-y-auto space-y-1 pr-1" :: Style.scrollbarStyle theme)
                    (List.indexedMap (viewShelfTooltipItem theme) shelf.books)
                , viewShelfTooltipArrow theme index
                ]
            ]


viewShelfTooltipItem : ColorTheme -> Int -> Book -> Html Msg
viewShelfTooltipItem theme index book =
    div
        [ class (tw [ "flex items-center gap-2 text-xs py-1.5 px-2 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    , (basecolors theme).text
                    ])
        , stopClickPropagation (SelectBook book.id)
        , title "直接この本を開く"
        ]
        [ span [ class (tw [ "font-mono text-xs opacity-50 shrink-0", (basecolors theme).accent ]) ]
            [ text (String.padLeft 2 '0' (String.fromInt (index + 1))) ]
        , span [ class "font-medium truncate flex-1" ]
            [ text book.title ]
        ]


{-| 本棚カード専用ツールチップコンテナ（基本は右側、右サイドバーにかかる右端列のみ左側に出現） -}
viewShelfTooltipContainer : Int -> String -> List (Html Msg) -> Html Msg
viewShelfTooltipContainer index widthClass children =
    let
        m6 =
            modBy 6 index

        sideClasses =
            if m6 == 0 || m6 == 4 then
                -- 常に右側（2列時も3列時も右端にならない位置）
                tw
                    [ "left-[calc(100%+12px)] top-1/2"
                    , "before:absolute before:-left-3 before:-top-2 before:bottom-0 before:w-3 before:content-['']"
                    ]

            else if m6 == 5 then
                -- 常に左側（2列時も3列時も右端列）
                tw
                    [ "right-[calc(100%+12px)] top-1/2"
                    , "before:absolute before:-right-3 before:-top-2 before:bottom-0 before:w-3 before:content-['']"
                    ]

            else if m6 == 1 || m6 == 3 then
                -- 2列（md〜2xl未満）のとき右端で左側、3列（2xl以上）では右側に戻る
                tw
                    [ "top-1/2"
                    , "left-[calc(100%+12px)] right-auto before:absolute before:-left-3 before:right-auto before:-top-2 before:bottom-0 before:w-3 before:content-['']"
                    , "md:left-auto md:right-[calc(100%+12px)] md:before:-right-3 md:before:left-auto"
                    , "2xl:left-[calc(100%+12px)] 2xl:right-auto 2xl:before:-left-3 2xl:before:right-auto"
                    ]

            else
                -- m6 == 2: 2列（md）では1列目で右側、3列（2xl以上）のとき3列目で左側
                tw
                    [ "top-1/2"
                    , "left-[calc(100%+12px)] right-auto before:absolute before:-left-3 before:right-auto before:-top-2 before:bottom-0 before:w-3 before:content-['']"
                    , "2xl:left-auto 2xl:right-[calc(100%+12px)] 2xl:before:-right-3 2xl:before:left-auto"
                    ]
    in
    div
        [ class (tw [ "absolute z-50"
                    , widthClass
                    , sideClasses
                    , "opacity-0 pointer-events-none"
                    , "group-hover:opacity-100 group-hover:pointer-events-auto"
                    , "transition-all duration-150 ease-out"
                    ])
        ]
        children


viewShelfTooltipArrow : ColorTheme -> Int -> Html Msg
viewShelfTooltipArrow theme index =
    let
        m6 =
            modBy 6 index

        arrowPosition =
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
                -- m6 == 2
                tw
                    [ "top-4"
                    , "-left-1.5 right-auto border-l border-b border-r-0 border-t-0"
                    , "2xl:left-auto 2xl:-right-1.5 2xl:border-r 2xl:border-t 2xl:border-l-0 2xl:border-b-0"
                    ]
    in
    div
        [ class (tw [ "absolute w-3 h-3 rotate-45"
                    , arrowPosition
                    , (basecolors theme).bg
                    , (basecolors theme).borderBtn
                    ])
        ]
        []


-- MARK: 本一覧（Book）

-- 本一覧グリッド
viewShelfBookGrid : Model -> List Book -> Html Msg
viewShelfBookGrid model books =
    div [ class (tw
            [ "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-6 justify-items-center"
            , "[&>div]:w-full [&>div]:flex [&>div]:justify-center"  -- ← ドラッグ枠を100%幅＆中央揃えにする
            ])
        ]
        (List.indexedMap
            (\i b ->
                let
                    isEditing =
                        case model.editing of
                            Just buffer ->
                                buffer.target == BookTitle && buffer.id == b.id

                            Nothing ->
                                False
                in
                viewSortableItem
                    model.colorTheme
                    model.draggingState
                    DragBook
                    i
                    isEditing
                    (viewBookCard model i b isEditing)
            )
            books
        )


viewBookCard : Model -> Int -> Book -> Bool -> Html Msg
viewBookCard model index book isEditing =
    let
        theme =
            model.colorTheme

        isActive =
            model.present.currentBookId == Just book.id

        isOpen =
            model.openMenuId == Just (BookExportMenu book.id)

        allHeadings =
            getAllH1Headings book

        -- 右側の2列（3列目・4列目: modBy 4 index >= 2）は左側に出現
        side =
            if modBy 4 index >= 2 then
                TooltipLeft

            else
                TooltipRight

        cardEvents =
            if isEditing then
                [ stopPropagationOn "pointerdown" (Decode.succeed ( EditSubmit, True ))
                , stopPropagationOn "click" (Decode.succeed ( NoOp, True ))
                ]

            else
                [ onClick (SelectBook book.id) ]
    in
    div [ class (bookOuterWrapperStyle isOpen) ]
        [ viewBookEdgeShadow theme
        , div (class (bookCardBodyStyle theme isActive) :: cardEvents)
            [ viewBookSpineShadow
            , viewCardDeleteButton theme (DeleteBook book.id)
            , viewBookCoverContent theme book allHeadings
            , viewBookCardFooter model theme book
            ]
        , viewBookTooltip theme book.id side allHeadings
        ]


{-| 本の表紙コンテンツ（カードが大きくなる画面幅に合わせて表示件数を自動で4〜7件に拡張） -}
viewBookCoverContent : ColorTheme -> Book -> List Heading -> Html Msg
viewBookCoverContent theme book allHeadings =
    let
        total =
            List.length allHeadings

        -- 最大7件まで取得し、CSSで画面幅・カード高に合わせて動的に表示
        previewHeadings =
            List.take 7 allHeadings
    in
    div [ class "pl-3 flex-1 flex flex-col min-w-0 overflow-hidden" ]
        [ span [ class (tw [ "text-xs font-mono tracking-widest uppercase font-bold block mb-1 shrink-0", (basecolors theme).accent ]) ]
            [ text "BOOK" ]
        , h3
            [ class (tw [ "text-lg font-bold leading-snug line-clamp-2 cursor-pointer shrink-0 opacity-85", (basecolors theme).text ])
            , style "font-family" (basecolors theme).fontDeco
            , onDoubleClick (EditBegin BookTitle book.id book.title)
            , stopClickPropagation NoOp
            , title "ダブルクリックで名前変更"
            ]
            [ text book.title ]
        , div [ class (tw [ "w-8 h-[2px] my-3 shrink-0", (basecolors theme).primary ]) ] []
        , if List.isEmpty allHeadings then
            div [ class (tw [ "text-xs italic opacity-40 py-2", (basecolors theme).text ]) ]
                [ text "（見出しがありません）" ]

          else
            div [ class "space-y-1.5 flex-1 min-w-0 overflow-hidden" ]
                (List.indexedMap (viewBookChapterItem theme) previewHeadings)
        , if total > 4 then
            span [ class (tw [ "text-xs font-mono font-semibold block mt-1.5 opacity-85 shrink-0", (basecolors theme).accent ]) ]
                [ text "+ more chapters →" ]

          else
            text ""
        ]


-- H1見出しプレビュー
viewBookChapterItem : ColorTheme -> Int -> Heading -> Html Msg
viewBookChapterItem theme index heading =
    let
        -- 0〜3件目: 常に表示（スマホ〜全画面）
        -- 4〜5件目: xl (1280px以上、カードが縦長に拡大時) で表示
        -- 6件目: 2xl (1536px以上、カード最大時) で表示
        visibilityClass =
            if index < 4 then
                "flex"

            else if index < 6 then
                "hidden xl:flex"

            else
                "hidden 2xl:flex"
    in
    div [ class (tw [ "text-xs font-medium truncate items-center gap-2 opacity-90 min-w-0", visibilityClass, (basecolors theme).text ]) ]
        [ span [ class (tw [ "w-1.5 h-1.5 rounded-full shrink-0", (basecolors theme).primary ]) ] []
        , span [ class "truncate flex-1" ] [ text (stripEmphasis heading.text) ]
        ]


{-| 本カードのフッター行 -}
viewBookCardFooter : Model -> ColorTheme -> Book -> Html Msg
viewBookCardFooter model theme book =
    let
        menuId =
            BookExportMenu book.id
    in
    div [ class (tw [ "pl-3 pt-2 mt-auto border-t flex items-center justify-between text-xs shrink-0 relative", (basecolors theme).borderUnder ]) ]
        [ span
            [ class (tw [ "text-xs font-mono opacity-65", (basecolors theme).text ]) ]
            [ text (String.fromInt (List.length book.pages) ++ " Pages") ]
        , viewCompactExportMenu model theme menuId
            [ ( "JSON", ExportBookJson book )
            , ( "ZIP", ExportBookZip book.id )
            ]
        ]


-- ===================================================
-- MARK: 本用ツールチップ
-- ===================================================

{-| 本カードの全章一覧ツールチップ（幅 w-72: 288px） -}
viewBookTooltip : ColorTheme -> String -> TooltipSide -> List Heading -> Html Msg
viewBookTooltip theme bookId side allHeadings =
    if List.isEmpty allHeadings then
        text ""

    else
        viewTooltipContainer side "w-72"
            [ div 
                [ class (tooltipBoxStyle theme) ]
                [ viewTooltipHeader theme "Table of Contents"
                , div
                    (class "max-h-52 overflow-y-auto space-y-1.5 pr-1" :: Style.scrollbarStyle theme)
                    (List.map (viewBookTooltipItem theme bookId) allHeadings)
                , viewTooltipArrow theme side
                ]
            ]


viewBookTooltipItem : ColorTheme -> String -> Heading -> Html Msg
viewBookTooltipItem theme bookId heading =
    div
        [ class (bookTooltipStyle.item theme)
        -- 本IDを指定して見出しジャンプを発行
        , stopClickPropagation (JumpToBookHeading bookId heading.pageIndex (String.fromInt heading.order))
        , title ("P." ++ String.fromInt (heading.pageIndex + 1) ++ " へジャンプ")
        ]
        [ span
            [ class (bookTooltipStyle.pageIndex theme) ]
            [ text ("P." ++ String.fromInt (heading.pageIndex + 1)) ]
        , span
            [ class "truncate flex-1 font-medium" ]
            [ text (stripEmphasis heading.text) ]
        ]


bookTooltipStyle :
    { item : ColorTheme -> String
    , pageIndex : ColorTheme -> String
    }
bookTooltipStyle =
    { item = \theme -> 
        tw  [ "text-xs py-1 px-1.5 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
            , "truncate transition-colors flex items-center gap-2"
            , (basecolors theme).text
            ]
    , pageIndex = \theme -> tw [ "text-xs font-mono opacity-60 shrink-0", (basecolors theme).accent ]
    }

-- ===================================================
-- MARK: コンパクトExportドロップダウン
-- ===================================================

viewCompactExportMenu : Model -> ColorTheme -> MenuId -> List ( String, Msg ) -> Html Msg
viewCompactExportMenu model theme menuId items =
    let
        isOpen =
            model.openMenuId == Just menuId
    in
    div [ class "relative flex justify-end" ]
        [ button
            [ class (miniExportBtnStyle theme)
            , stopClickPropagation (ToggleMenu menuId)
            ]
            [ text "Export ▾" ]
        , if isOpen then
            div []
                [ div
                    [ class "fixed inset-0 z-40 bg-transparent cursor-default"
                    , stopClickPropagation CloseMenu
                    ]
                    []
                , div
                    [ class (tw [ "absolute right-0 top-full mt-1.5 z-50 flex flex-col p-1 w-24 border shadow-xl rounded-lg"
                                , (basecolors theme).surface
                                , (basecolors theme).borderBtn
                                ])
                    , class "backdrop-blur-md animate-[fadeIn_0.1s_ease-out]"
                    ]
                    (List.map
                        (\( label, msg ) ->
                            button
                                [ class (tw [ "w-full px-2 py-1 text-center text-xs font-mono font-semibold rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                                            , (basecolors theme).text
                                            ])
                                , stopClickPropagation (SelectMenuItem msg)
                                ]
                                [ text label ]
                        )
                        items
                    )
                ]

          else
            text ""
        ]


-- ===================================================
-- MARK: 共通補助部品
-- ===================================================

viewCardDeleteButton : ColorTheme -> Msg -> Html Msg
viewCardDeleteButton theme deleteMsg =
    viewButton theme (DeleteButton ( 1, 1 )) deleteMsg (Style.icon cansel "w-2 h-2")


viewBookSpineShadow : Html Msg
viewBookSpineShadow =
    div []
        [ div [ class "absolute left-0 top-0 bottom-0 w-3.5 rounded-l-xs bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-10" ] []
        , div [ class "absolute left-3.5 top-0 bottom-0 w-[1px] bg-black/10 pointer-events-none z-10" ] []
        ]


viewBookEdgeShadow : ColorTheme -> Html Msg
viewBookEdgeShadow theme =
    div
        [ class (tw [ "absolute right-[-4px] top-1.5 bottom-1.5 w-2 rounded-r-xs border-r shadow-xs pointer-events-none"
                    , (basecolors theme).brightAccent
                    , (basecolors theme).borderBtn
                    ])
        ]
        []


viewTooltipContainer : TooltipSide -> String -> List (Html Msg) -> Html Msg
viewTooltipContainer side widthClass children =
    let
        sideClasses =
            case side of
                TooltipRight ->
                    tw
                        [ "left-[calc(100%+12px)] top-1/2"
                        , "before:absolute before:-left-3 before:-top-2 before:bottom-0 before:w-3 before:content-['']"
                        ]

                TooltipLeft ->
                    tw
                        [ "right-[calc(100%+12px)] top-1/2"
                        , "before:absolute before:-right-3 before:-top-2 before:bottom-0 before:w-3 before:content-['']"
                        ]
    in
    div
        [ class (tw [ "absolute z-50"
                    , widthClass
                    , sideClasses
                    , "opacity-0 pointer-events-none"
                    , "group-hover:opacity-100 group-hover:pointer-events-auto"
                    , "transition-all duration-150 ease-out"
                    ])
        ]
        children


viewTooltipHeader : ColorTheme -> String -> Html Msg
viewTooltipHeader theme titleText =
    div [ class (tw [ "flex items-center justify-between pb-2 mb-2 border-b", (basecolors theme).borderUnder ]) ]
        [ span
            [ class (tw [ "text-xs font-bold font-mono uppercase tracking-wider", (basecolors theme).text ]) ]
            [ text titleText ]
        ]


viewTooltipArrow : ColorTheme -> TooltipSide -> Html Msg
viewTooltipArrow theme side =
    let
        arrowPosition =
            case side of
                TooltipRight ->
                    "-left-1.5 top-4 border-l border-b"

                TooltipLeft ->
                    "-right-1.5 top-4 border-r border-t"
    in
    div
        [ class (tw [ "absolute w-3 h-3 rotate-45"
                    , arrowPosition
                    , (basecolors theme).bg
                    , (basecolors theme).borderBtn
                    ])
        ]
        []


getAllH1Headings : Book -> List Heading
getAllH1Headings book =
    book.pages
        |> List.indexedMap (\i p -> extractHeadings i p.content)
        |> List.concat
        |> List.filter (\h -> h.level == 1)


-- MARK: スタイル定義

shelfCardWrapperStyle : ColorTheme -> Bool -> Bool -> String
shelfCardWrapperStyle theme isActive isOpen =
    let
        borderActive =
            if isActive then
                tw [ (basecolors theme).borderStrong, "border-2" ]

            else
                (basecolors theme).borderBtn

        stackOrder =
            if isOpen then
                "z-30"

            else
                "z-0 hover:z-50"
    in
    tw
        [ "group relative w-full h-72 px-5 pt-5 pb-4 rounded-xl border shadow-sm"
        , "hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
        , (basecolors theme).surface
        , borderActive
        , stackOrder
        ]


shelfFooterRowStyle : ColorTheme -> String
shelfFooterRowStyle theme =
    tw
        [ "flex items-center justify-between pt-2 border-t text-xs shrink-0"
        , (basecolors theme).borderUnder
        ]


bookOuterWrapperStyle : Bool -> String
bookOuterWrapperStyle isOpen =
    let
        stackOrder =
            if isOpen then
                "z-30"

            else
                "z-0 hover:z-50"
    in
    tw
        [ "group relative cursor-pointer w-full max-w-[250px] min-w-0"
        , stackOrder
        ]


bookCardBodyStyle : ColorTheme -> Bool -> String
bookCardBodyStyle theme isActive =
    let
        borderActive =
            if isActive then
                tw [ (basecolors theme).borderStrong, "border-2" ]

            else
                (basecolors theme).borderBtn
    in
    tw
        [ "relative w-full min-w-0 aspect-[3/4] p-4 rounded-r-lg rounded-l-xs border shadow-sm"
        , "hover:shadow-xl transition-all duration-200 group-hover:-translate-y-1 flex flex-col justify-between"
        , (basecolors theme).surface
        , borderActive
        ]


tooltipBoxStyle : ColorTheme -> String
tooltipBoxStyle theme =
    tw
        [ "p-3.5 rounded-xl border shadow-2xl backdrop-blur-md"
        , (basecolors theme).bg
        , (basecolors theme).borderBtn
        ]


miniExportBtnStyle : ColorTheme -> String
miniExportBtnStyle theme =
    tw
        [ "px-1.5 py-0.5 text-xs font-mono font-bold uppercase rounded"
        , "hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        , (basecolors theme).accent
        ]
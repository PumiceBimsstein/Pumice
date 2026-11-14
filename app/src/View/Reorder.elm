module View.Reorder exposing (viewReorder)

import Domain.Helper exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Style exposing (..)
import View.ViewHelper exposing (viewButton, viewSortableItem)


-- ============================================================
-- MARK: PAGEモード 一覧ビュー
-- ============================================================

viewReorder : Model -> Book -> Html Msg
viewReorder model book =
    div [ class reorderStyle.reorderGrid ]
        (List.indexedMap
            (\index page ->
                viewSortableItem
                    model.colorTheme
                    model.draggingState
                    DragPage
                    index
                    False
                    (viewPageCard model index page page.id)
            )
            book.pages
            ++ [ viewAddPageCard model ]
        )


-- ============================================================
-- MARK: ページカード
-- ============================================================

viewPageCard : Model -> Int -> Page -> String -> Html Msg
viewPageCard model index page pageId =
    let
        present =
            model.present

        isSelected =
            present.currentPageIndex == index

        meta =
            extractPageMeta index page.content
    in
    button
        [ class (reorderStyle.pageCard model.colorTheme isSelected)
        , onClick (SelectPage index)
        , onDoubleClick (ChangeMode EditMode)
        ]
        [ viewPageCardHeader model index pageId
        , viewPageCardBody model meta
        ]


viewPageCardHeader : Model -> Int -> String -> Html Msg
viewPageCardHeader model index pageId =
    div [ class (reorderStyle.pageCardHeader model.colorTheme) ]
        [ span
            [ class (reorderStyle.pageCardNumber model.colorTheme) ]
            [ text ("P." ++ String.fromInt (index + 1)) ]
        , div [ class "flex items-center gap-1.5" ]
            [ copyButton model index
            , viewButton model.colorTheme Delete (DeletePage pageId) (text "×")
            ]
        ]


copyButton : Model -> Int -> Html Msg
copyButton model index =
    button
        [ class (reorderStyle.copyButtonStyle model.colorTheme)
        , onClick (DuplicatePage index)
        , title "ページを複製"
        ]
        [ text "copy" ]


-- ============================================================
-- MARK: カード本文（見出し＋リード文＋統計バッジ）
-- ============================================================

viewPageCardBody : Model -> PageMeta -> Html Msg
viewPageCardBody model meta =
    let
        theme =
            model.colorTheme
    in
    div [ class "flex-1 flex flex-col justify-between p-2.5 min-h-0 text-left overflow-hidden" ]
        [ -- 上部：見出し ＋ リード文
          div [ class "flex flex-col gap-1 min-h-0 overflow-hidden" ]
            [ h4
                [ class (tw [ "font-bold text-xs leading-snug line-clamp-2 break-words opacity-90", (basecolors theme).text ])
                , style "font-family" (basecolors theme).fontDeco
                ]
                [ text meta.title ]
            , if String.isEmpty meta.leadText then
                text ""

              else
                p
                    [ class (tw [ "text-[12px] leading-relaxed line-clamp-3 break-words opacity-65", (basecolors theme).text ]) ]
                    [ text meta.leadText ]
            ]

        -- 下部：文字数 ＋ 要素バッジ
        , div
            [ class "pt-1.5 mt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between shrink-0" ]
            [ span
                [ class (tw [ "text-[10px] font-mono opacity-70", (basecolors theme).textMuted ]) ]
                [ text (formatCharCount meta.charCount) ]
            , viewFeatureBadges theme meta
            ]
        ]


viewFeatureBadges : ColorTheme -> PageMeta -> Html Msg
viewFeatureBadges theme meta =
    div [ class "flex items-center gap-1 font-mono text-[9px]" ]
        [ if meta.hasCode then
            span
                [ class (badgeStyle theme)
                , title "コードブロックを含むページ"
                ]
                [ text "</>" ]

          else
            text ""
        , if meta.hasMath then
            span
                [ class (badgeStyle theme)
                , title "数式を含むページ"
                ]
                [ text "fx" ]

          else
            text ""
        ]


badgeStyle : ColorTheme -> String
badgeStyle theme =
    tw
        [ "px-1 py-0.2 rounded font-bold"
        , "bg-black/5 dark:bg-white/10"
        , (basecolors theme).accent
        ]


formatCharCount : Int -> String
formatCharCount count =
    String.fromInt count ++ " 文字"


-- ============================================================
-- MARK: ページ作成カード
-- ============================================================

viewAddPageCard : Model -> Html Msg
viewAddPageCard model =
    let
        page =
            getCurrentBook model.present
                |> Maybe.map (.pages >> List.length)
                |> Maybe.withDefault 0
    in
    viewButton model.colorTheme Create (CreatePage page) (text "+ PAGE")


-- ============================================================
-- MARK: 軽量メタデータ抽出
-- ============================================================

type alias PageMeta =
    { title : String
    , leadText : String
    , charCount : Int
    , hasCode : Bool
    , hasMath : Bool
    }


type BlockState
    = Outside
    | InsideMath
    | InsideCode


extractPageMeta : Int -> String -> PageMeta
extractPageMeta index content =
    let
        defaultTitle =
            "Page " ++ String.fromInt (index + 1)

        -- 1行ずつ状態を追跡しながら走査（4要素タプルの制限を避けるためレコードを返す）
        parse lines state maybeTitle leadAcc hasCodeAcc hasMathAcc =
            case lines of
                [] ->
                    { title = maybeTitle |> Maybe.withDefault defaultTitle
                    , leadText = leadAcc |> List.reverse |> String.join " " |> String.left 140
                    , hasCode = hasCodeAcc
                    , hasMath = hasMathAcc
                    }

                line :: rest ->
                    let
                        trimmed =
                            String.trim line
                    in
                    case state of
                        InsideMath ->
                            if String.startsWith "```" trimmed || trimmed == "$$" then
                                parse rest Outside maybeTitle leadAcc hasCodeAcc hasMathAcc

                            else
                                parse rest InsideMath maybeTitle leadAcc hasCodeAcc hasMathAcc

                        InsideCode ->
                            if String.startsWith "```" trimmed then
                                parse rest Outside maybeTitle leadAcc hasCodeAcc hasMathAcc

                            else
                                parse rest InsideCode maybeTitle leadAcc hasCodeAcc hasMathAcc

                        Outside ->
                            if String.startsWith "```math" trimmed then
                                parse rest InsideMath maybeTitle leadAcc hasCodeAcc True

                            else if String.startsWith "```" trimmed then
                                parse rest InsideCode maybeTitle leadAcc True hasMathAcc

                            else if trimmed == "$$" then
                                parse rest InsideMath maybeTitle leadAcc hasCodeAcc True

                            else if isHeadingLine trimmed then
                                let
                                    nextTitle =
                                        case maybeTitle of
                                            Just _ ->
                                                maybeTitle

                                            Nothing ->
                                                Just (cleanHeading trimmed)

                                    lineHasMath =
                                        hasInlineMath trimmed
                                in
                                parse rest Outside nextTitle leadAcc hasCodeAcc (hasMathAcc || lineHasMath)

                            else if String.isEmpty trimmed then
                                parse rest Outside maybeTitle leadAcc hasCodeAcc hasMathAcc

                            else
                                let
                                    cleaned =
                                        cleanMarkdownDecorations trimmed

                                    lineHasMath =
                                        hasInlineMath trimmed

                                    nextLeadAcc =
                                        if String.isEmpty cleaned then
                                            leadAcc

                                        else
                                            cleaned :: leadAcc
                                in
                                parse rest Outside maybeTitle nextLeadAcc hasCodeAcc (hasMathAcc || lineHasMath)

        parsed =
            parse (String.lines content) Outside Nothing [] False False

        charCount =
            content
                |> String.filter (\c -> c /= ' ' && c /= '\n' && c /= '\r' && c /= '\t')
                |> String.length
    in
    { title = parsed.title
    , leadText = parsed.leadText
    , charCount = charCount
    , hasCode = parsed.hasCode
    , hasMath = parsed.hasMath
    }


hasInlineMath : String -> Bool
hasInlineMath str =
    String.contains "$$" str
        || String.contains "\\[" str
        || String.contains "\\(" str
        || String.contains "`math " str


isHeadingLine : String -> Bool
isHeadingLine str =
    String.startsWith "# " str
        || String.startsWith "## " str
        || String.startsWith "### " str
        || String.startsWith "#### " str


cleanHeading : String -> String
cleanHeading str =
    str
        |> String.dropLeft (countHeadingPrefix str)
        |> String.trim


countHeadingPrefix : String -> Int
countHeadingPrefix str =
    if String.startsWith "#### " str then
        5

    else if String.startsWith "### " str then
        4

    else if String.startsWith "## " str then
        3

    else if String.startsWith "# " str then
        2

    else
        0


cleanMarkdownDecorations : String -> String
cleanMarkdownDecorations str =
    let
        trimmed =
            String.trim str

        stripped =
            if String.startsWith "> " trimmed then
                String.dropLeft 2 trimmed

            else if String.startsWith "- " trimmed || String.startsWith "* " trimmed then
                String.dropLeft 2 trimmed

            else
                trimmed
    in
    stripped
        |> String.replace "**" ""
        |> String.replace "*" ""
        |> String.replace "~~" ""
        |> String.replace "`" ""
        |> String.trim


-- ============================================================
-- MARK: スタイル定義
-- ============================================================

reorderStyle :
    { reorderGrid : String
    , pageCard : ColorTheme -> Bool -> String
    , pageCardHeader : ColorTheme -> String
    , pageCardNumber : ColorTheme -> String
    , copyButtonStyle : ColorTheme -> String
    }
reorderStyle =
    { reorderGrid =
        tw
            [ "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5"
            , "gap-6", "py-12", "px-8"
            ]
    , pageCard = \theme isSelected ->
        let
            base =
                [ "aspect-[3/4]", "flex", "flex-col"
                , "border"
                , "transition-all", "cursor-pointer", "overflow-hidden"
                , "w-full", "text-left", "items-stretch"
                , "hover:shadow-md"
                , (basecolors theme).bg
                , (basecolors theme).borderBtn
                , (basecolors theme).rounded
                ]

            activeBorder =
                if isSelected then
                    [ "ring-2"
                    , "ring-amber-400/80"
                    , (basecolors theme).borderStrong
                    ]

                else
                    [ (basecolors theme).border ]
        in
        tw (base ++ activeBorder)
    , pageCardHeader = \theme ->
        tw
            [ "px-2.5", "py-1", "border-b"
            , (basecolors theme).surface
            , (basecolors theme).border
            , "flex", "justify-between", "items-center", "shrink-0"
            ]
    , pageCardNumber = \theme ->
        tw
            [ "text-[13px]", "font-mono", "font-bold"
            , (basecolors theme).text
            ]
    , copyButtonStyle = \theme ->
        tw
            [ "border", "text-[10px]", "font-mono", "px-1.5", "py-0.5", "rounded"
            , "hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            , (basecolors theme).accent
            , (basecolors theme).borderBtn
            ]
    }
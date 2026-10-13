module View.RightSideBar exposing (rightSidebarArea, rightSideWindow)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import Icon exposing (..)
import View.Style as Style exposing (..)
import Domain.Helper exposing (..)
import Domain.Selector exposing (..)
import View.ViewHelper exposing (viewBaseSelector)


rightSidebarArea : Model -> AppState -> Html Msg
rightSidebarArea model present =
    aside
        [ class (rightSideStyle model.colorTheme) ]
        [ viewModeButtonGroup model.colorTheme model.mode
        , controlSection model
        , scrollableArea
        , bottomStatusArea model present
        ]


rightSideWindow : Model -> AppState -> Html Msg
rightSideWindow model present =
    div
        [ class (rightSideWindowStyle model.colorTheme) ]
        [ viewModeButtonGroup model.colorTheme model.mode
        , controlSectionMini model
        , bottomStatusArea model present
        ]

rightSideWindowStyle : ColorTheme -> String
rightSideWindowStyle theme =
    tw  [ "flex", "flex-col", "w-32", "flex-shrink-0"
        , "border", "h-auto"
        , (basecolors theme).surface
        , (basecolors theme).borderBtn
        , (basecolors theme).rounded
        , (basecolors theme).textMuted
        ]

controlSectionMini : Model -> Html Msg
controlSectionMini model =
    div [ class "p-3 border-b text-xs border-gray-500/10" ]
        [ viewFontSizeSelector model
        , viewAddPageButton model
        ]


rightSideStyle : ColorTheme -> String
rightSideStyle theme =
    tw  [ "flex", "flex-col", "w-48", "flex-shrink-0", "border-l", "h-full"
        , (basecolors theme).surface
        , (basecolors theme).border
        , (basecolors theme).textMuted
        ]

viewModeButtonGroup : ColorTheme -> Mode -> Html Msg
viewModeButtonGroup theme currentMode =
    div [ class "p-3 space-y-1" ]
        [ viewModeButton theme ViewMode "VIEW" (currentMode == ViewMode)
        , viewModeButton theme EditMode "EDIT" (currentMode == EditMode)
        , viewModeButton theme ReorderMode "PAGES" (currentMode == ReorderMode)
        ]

controlSection : Model -> Html Msg
controlSection model =
    let
        theme = model.colorTheme
    in
    div [ class "p-3 border-b text-xs border-gray-500/10" ]
        [ viewThemeSelector theme
        , viewRenderStyleSelector theme model.renderStyle
        , viewFontSizeSelector model
        , viewAddPageButton model
        , viewExportControl theme model.exportFormat
        , sidebarToggle model
        ]


sidebarToggle : Model -> Html Msg
sidebarToggle model =
    button
        [ class (tw ["mt-3", (categoryBtn model.colorTheme)])
        , onClick ToggleNormalSidebar
        ]
        [ text "Hide Sidebar" ]

scrollableArea : Html Msg
scrollableArea =
    div [ class "flex-1 overflow-y-auto px-3 py-2"
        , Html.Events.on "wheel" (wheelDecoder PrevPage NextPage)
        , title "Scroll to change page"][]


bottomStatusArea : Model -> AppState -> Html Msg
bottomStatusArea model present =
    div
        [ class "flex flex-col gap-2 mt-auto" ]
        [ viewShelfBookIcon model
        , bookPageCounter model.colorTheme present
        ]


-- ページカウンターの条件分岐ラッパー
bookPageCounter : ColorTheme -> AppState -> Html Msg
bookPageCounter theme present =
    case getCurrentBook present of
        Nothing ->
            div [] []

        Just book ->
            pageCount theme present book


viewModeButton : ColorTheme -> Mode -> String -> Bool -> Html Msg
viewModeButton theme mode label isActive =
    button 
        [ class (modeButtonStyle theme isActive)
        , style "font-family" (basecolors theme).fontDeco
        , onClick (ChangeMode mode) 
        ] 
        [ text label ]


modeButtonStyle : ColorTheme -> Bool -> String
modeButtonStyle theme isActive =
    let
        base =
            [ "w-full", "py-2.5", "text-sm", "font-semibold", "border", "opacity-90"
            , (basecolors theme).rounded
            ]
        state =
            if isActive then
                [ "border-transparent"
                , (basecolors theme).primary
                , (basecolors theme).deco
                ]
            else
                [ (basecolors theme).borderBtn
                , (basecolors theme).text
                , "hover:opacity-70"
                , "bg-transparent"
                ]
    in
    tw (base ++ state)

-- MARK:セレクター
viewThemeSelector : ColorTheme -> Html Msg
viewThemeSelector theme =
    div []
        [ p [ class "font-mono mb-1" ] [ text "THEME" ]
        , viewBaseSelector
            ChangeColorTheme
            colorThemeToString
            getSiblingTheme
            [ class (selectorStyle theme)
            , style "font-family" (basecolors theme).fontDeco
            ]
            theme
            [ Light, Dark, Magical ]
        ]

viewRenderStyleSelector : ColorTheme -> RenderStyle -> Html Msg
viewRenderStyleSelector theme current =
    div []
        [ p [ class "font-mono mb-1" ] [ text "STYLE" ]
        , viewBaseSelector
            ChangeRenderStyle
            renderStyleToString
            getSiblingRenderStyle
            [ class (selectorStyle theme)
            , style "font-family" (basecolors theme).fontDeco
            ]
            current
            [ Standard, Minimal, Academic, Mystical ]
        ]

viewFontSizeSelector : Model -> Html Msg
viewFontSizeSelector model =
    let
        theme = model.colorTheme
    in
    div []
        [ p [ class "font-mono mb-1" ]
            [ text (sizeSelectorText model) ]
        , viewBaseSelector
            ChangeFontSize
            fontSizeToString
            getSiblingFontSize
            [ class (selectorStyle theme)
            , style "font-family" (basecolors theme).fontDeco
            ]
            model.fontSize
            [ Small, Medium, Large ]
        ]

sizeSelectorText : Model -> String
sizeSelectorText model =
    if model.sidebarMode == NormalSidebar then
        "FONT SIZE"
    else
        ""


selectorStyle : ColorTheme -> String
selectorStyle theme =
    tw  [ "w-full", "border", "px-3", "py-1", "mb-3"
        , "text-sm", "outline-none", "h-10"
        , (basecolors theme).brightAccent
        , (basecolors theme).borderBtn
        , (basecolors theme).rounded
        , (basecolors theme).text
        ]

-- MARK:ページ追加
viewAddPageButton : Model -> Html Msg
viewAddPageButton model =
    button
        [ class (addPageBtnStyle model.colorTheme)
        , onClick (CreateNextPage (model.present.currentPageIndex + 1))
        ]
        [ text "+ Next Page" ]


addPageBtnStyle : ColorTheme -> String
addPageBtnStyle theme =
    tw  [ "w-full", "py-2.5", "text-sm"
        , "pr-2", "mt-6", "mb-3", "border"--, "transition-colors"
        , (basecolors theme).borderStrong
        , (basecolors theme).rounded
        , (basecolors theme).bg
        , (basecolors theme).text
        , "hover:bg-white/5" ]


-- MARK:エクスポート
viewExportControl : ColorTheme -> ExportFormat -> Html Msg
viewExportControl theme exportFormat =
    div [ class "flex gap-2 pt-1 items-center" ]
        [ viewExportFormatSelector theme exportFormat
        , viewExportButton theme exportFormat ]


viewExportFormatSelector : ColorTheme -> ExportFormat -> Html Msg
viewExportFormatSelector theme currentFormat =
    viewBaseSelector
        ChangeExportFormat
        exportFormatToString
        getSiblingExportFormat
        [ class (exportSelectorStyle theme)
        , style "font-family" (basecolors theme).fontDeco
        ]
        currentFormat
        [ FormatTxt, FormatMd ]

exportSelectorStyle : ColorTheme -> String
exportSelectorStyle theme =
    tw
        [ "flex-1"
        , "border"
        , "px-3"
        , "py-1"
        , "text-sm"
        , "uppercase"
        , "outline-none"
        , "h-10"
        , (basecolors theme).brightAccent
        , (basecolors theme).borderBtn
        , (basecolors theme).rounded
        , (basecolors theme).text
        ]

viewExportButton : ColorTheme -> ExportFormat -> Html Msg
viewExportButton theme format =
    button
        [ class (exportBtnStyle theme)
        , onClick (ExportPage (exportFormatToString format))
        ]
        [ text "EXPORT" ]

exportBtnStyle : ColorTheme -> String
exportBtnStyle theme =
    tw
        [ "flex-1"
        , "border"
        , "px-3"
        , "py-1"
        , "my-2"
        , "text-sm"
        , "font-mono"
        , "outline-none"
        , "h-10"
        , "flex"
        , "items-center"
        , "justify-center"
        --, "transition-colors"
        , "hover:bg-white/5"
        , (basecolors theme).borderBtn
        , (basecolors theme).rounded
        , (basecolors theme).brightAccent
        ]

-- MARK: Shelf/Book
viewShelfBookIcon : Model -> Html Msg
viewShelfBookIcon model =
    div [ class "flex flex-col gap-2 justify-center py-2 px-3" ]
        [ viewCategoryButton model
        , viewBooksButton model
        ]


viewCategoryButton : Model -> Html Msg
viewCategoryButton model =
    button
        [ class (categoryBtn model.colorTheme)
        , onClick (getCategoryButtonMsg model.mainViewMode)
        , title "本棚一覧"
        ]
        [ text "Category" ]


viewBooksButton : Model -> Html Msg
viewBooksButton model =
    button
        [ class (categoryBtn model.colorTheme)
        , onClick (getBooksButtonMsg model)
        , title "本一覧"
        ]
        [ text "Books" ]


categoryBtn : ColorTheme -> String
categoryBtn theme =
    tw  [ "w-full", "h-8", "border", "px-2.5", "text-sm", "font-mono"
        , "items-center", "justify-center"
        , (basecolors theme).borderBtn
        , (basecolors theme).rounded
        , (basecolors theme).textMuted
        ]


getCategoryButtonMsg : MainViewMode -> Msg
getCategoryButtonMsg mainViewMode =
    if mainViewMode == ShelfListView then
        ChangeMainView PageView
    else
        ChangeMainView ShelfListView


getBooksButtonMsg : Model -> Msg
getBooksButtonMsg model =
    if isDetailView model.mainViewMode then
        ChangeMainView PageView
    else
        case getCurrentShelf model.present of
            Just shelf ->
                ChangeMainView (ShelfDetailView shelf.id)
            Nothing ->
                ChangeMainView ShelfListView


isDetailView : MainViewMode -> Bool
isDetailView mainViewMode =
    case mainViewMode of
        ShelfDetailView _ ->
            True
        _ ->
            False

-- MARK:ページ移動関連
pageCount : ColorTheme -> AppState -> Book -> Html Msg
pageCount theme state book =
    div
        [ class (pageCounterStyle theme)
        , Html.Events.on "wheel" (wheelDecoder PrevPage NextPage)
        ]
        [ viewPageChangeButtons
        , viewPageLabel
        , viewPageCounterValue state book
        ]


pageCounterStyle : ColorTheme -> String
pageCounterStyle theme =
    tw  [ "flex", "flex-col", "items-center", "gap-1"
        , (basecolors theme).textMuted
        ]


viewPageChangeButtons : Html Msg
viewPageChangeButtons =
    div [ class "w-full flex pt-2 gap-6 mb-2 justify-center" ]
        [ viewPrevPageButton
        , viewNextPageButton
        ]


viewPrevPageButton : Html Msg
viewPrevPageButton =
    button [onClick PrevPage, title "Previous Page"][Style.icon Icon.leftpage "w-5 h-5"]


viewNextPageButton : Html Msg
viewNextPageButton =
    button [onClick NextPage, title "Next Page"][Style.icon Icon.rightpage "w-5 h-5"]


viewPageLabel : Html Msg
viewPageLabel =
    p [ class "font-mono text-xs" ][ text "PAGE" ]


viewPageCounterValue : AppState -> Book -> Html Msg
viewPageCounterValue state book =
    p   [ class "font-mono text-lg font-medium" ]
        [ text (formatPageCounter state book) ]


formatPageCounter : AppState -> Book -> String
formatPageCounter state book =
    let
        current = state.currentPageIndex + 1
        total = List.length book.pages
    in
    String.fromInt current ++ " / " ++ String.fromInt total

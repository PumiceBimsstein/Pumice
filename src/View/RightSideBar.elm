module View.RightSideBar exposing (rightSidebarArea, rightSideWindow)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import Icon exposing (..)
import View.Style as Style exposing (..)
import Domain.Helper exposing (..)
import Domain.Selector exposing (..)
import View.ViewHelper exposing (openDropdown, stopClickPropagation, viewBaseSelector)


rightSidebarArea : Model -> AppState -> Html Msg
rightSidebarArea model present =
    aside
        [ class (rightSideStyle model.colorTheme) ]
        [ --viewModeButtonGroup model model.mode
          topHeader model
        , viewModeSegment model
        , controlSection model
        , scrollableArea
        , bottomStatusArea model present
        ]


rightSideStyle : ColorTheme -> String
rightSideStyle theme =
    tw  [ "flex", "flex-col", "w-48", "flex-shrink-0", "border-l", "h-full"
        , (basecolors theme).surface
        , (basecolors theme).border
        , (basecolors theme).textMuted
        ]

topHeader : Model -> Html Msg
topHeader model =
    div [ class "flex justify-end px-3 pt-2 pb-1" ]
        [ button
            [ class "text-[11px] font-mono opacity-80 hover:opacity-100 transition-opacity cursor-pointer flex items-center gap-1"
            , onClick ToggleNormalSidebar
            , title "Hide Sidebar"
            ]
            [ text "Hide Sidebar"
            --, span [ class "text-[9px]" ] [ text "✕" ]
            ]
        ]

viewModeSegment : Model -> Html Msg
viewModeSegment model =
    div
        [ class "flex p-0.5 mx-3 my-6 border bg-black/5 dark:bg-white/5"
        , class (basecolors model.colorTheme).borderBtn
        , class (basecolors model.colorTheme).rounded
        ]
        [ modeItem model ViewMode "VIEW"
        , modeItem model EditMode "EDIT"
        , modeItem model ReorderMode "PAGES"
        ]


modeItem : Model -> Mode -> String -> Html Msg
modeItem model mode label =
    let
        theme = model.colorTheme

        isActive =
            model.mode == mode

        activeClass =
            if isActive then
                tw
                    [ (basecolors theme).primary
                    , (basecolors theme).deco
                    , "shadow-xs font-bold"
                    ]

            else
                "opacity-50 hover:opacity-100 bg-transparent"
    in
    button
        [ class (modeItemStyle theme activeClass)
        , style "font-family" (basecolors theme).fontDeco
        , onClick (ChangeMode mode)
        ]
        [ text label ]

modeItemStyle : ColorTheme -> String -> String
modeItemStyle theme activeClass =
    tw  [ "flex-1 h-8 py-1 text-xs transition-all text-center leading-none"
        , activeClass
        , (basecolors theme).rounded
        ]
-- viewModeButtonGroup : Model -> Mode -> Html Msg
-- viewModeButtonGroup model currentMode =
--     div [ class "p-3 space-y-1" ]
--         [ viewModeButton model ViewMode "VIEW" (currentMode == ViewMode)
--         , viewModeButton model EditMode "EDIT" (currentMode == EditMode)
--         , viewModeButton model ReorderMode "PAGES" (currentMode == ReorderMode)
--         ]

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
        --, importPageButton model
        --, viewExportControl theme model.exportFormat
        , viewFileMenu model
        --, sidebarToggle model
        ]


-- MARK: Import / Export ドロップダウンメニュー
viewFileMenu : Model -> Html Msg
viewFileMenu model =
    let
        pageId =
            getCurrentPage model.present
                |> Maybe.map .id
                |> Maybe.withDefault "current-page"

        menuId =
            PageExportMenu pageId

        isOpen =
            model.openMenuId == Just menuId
    in
    div [ class "relative mt-2" ]
        [ button
            [ class (fileMenuButtonStyle model.colorTheme)
            , stopClickPropagation (ToggleMenu menuId)
            ]
            [ text "File / Export ▾" ]
        , openDropdown
            isOpen
            Below
            model.colorTheme
            [ ( "Export as TXT", ExportPage "txt" )
            , ( "Export as MD", ExportPage "md" )
            , ( "Import (txt/md)", RequestPageImport )
            ]
        ]

fileMenuButtonStyle : ColorTheme -> String
fileMenuButtonStyle theme =
    tw
        [ "w-full py-1.5 px-3 text-xs border flex items-center justify-center font-mono"
        , (basecolors theme).rounded
        , (basecolors theme).borderBtn
        , (basecolors theme).brightAccent
        , "hover:bg-white/10 transition-colors"
        ]


-- sidebarToggle : Model -> Html Msg
-- sidebarToggle model =
--     button
--         [ class (tw ["mt-3", (categoryBtn model.colorTheme)])
--         , onClick ToggleNormalSidebar
--         ]
--         [ text "Hide Sidebar" ]

scrollableArea : Html Msg
scrollableArea =
    div [ class "flex-1 overflow-y-auto px-3 py-2"
        , Html.Events.on "wheel" (wheelDecoder PrevPage NextPage)
        , title "Scroll to change page"][]


-- bottomStatusArea : Model -> AppState -> Html Msg
-- bottomStatusArea model present =
--     div
--         [ class "flex flex-col gap-2 mt-auto" ]
--         [ viewShelfBookIcon model
--         , bookPageCounter model.colorTheme present
--         ]

bottomStatusArea : Model -> AppState -> Html Msg
bottomStatusArea model present =
    div
        [ class "flex flex-col gap-2 mt-auto pb-3" ]
        [ viewBreadcrumbNav model
        , bookPageCounter model.colorTheme present
        ]


viewBreadcrumbNav : Model -> Html Msg
viewBreadcrumbNav model =
    div [ class "flex items-center justify-center gap-2 py-1 px-3 text-sm font-mono opacity-100" ]
        [ button
            [ class "hover:opacity-100 hover:underline cursor-pointer"
            , onClick (getCategoryButtonMsg model.mainViewMode)
            , title "本棚一覧へ"
            ]
            [ text "Category" ]
        , span [ class "opacity-100 select-none" ] [ text "›" ]
        , button
            [ class "hover:opacity-100 hover:underline cursor-pointer"
            , onClick (getBooksButtonMsg model)
            , title "本一覧へ"
            ]
            [ text "Books" ]
        ]


-- ページカウンターの条件分岐ラッパー
bookPageCounter : ColorTheme -> AppState -> Html Msg
bookPageCounter theme present =
    case getCurrentBook present of
        Nothing ->
            div [] []

        Just book ->
            pageCount theme present book


viewModeButton : Model -> Mode -> String -> Bool -> Html Msg
viewModeButton model mode label isActive =
    button 
        [ class (modeButtonStyle model isActive)
        , style "font-family" (basecolors model.colorTheme).fontDeco
        , onClick (ChangeMode mode) 
        ] 
        [ text label ]


modeButtonStyle : Model -> Bool -> String
modeButtonStyle model isActive =
    let
        theme = model.colorTheme
        base =
            if model.sidebarMode == OverlaySidebar || model.sidebarMode == LeftSidebar then
                ["w-full", "py-1.5", "text-sm", "font-semibold", "border", "opacity-90"
                , (basecolors theme).rounded]
            else
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


--MARK:ミニサイドバー
rightSideWindow : Model -> AppState -> Html Msg
rightSideWindow model present =
    div
        [ class (rightSideWindowStyle model.colorTheme) ]
        [ windowCloseHeader model.colorTheme
        , modeSelectSegment model
        --, viewModeButtonGroup model model.mode
        , sidebarModeSection model
        , controlSectionMini model
        , bottomStatusArea model present
        ]

modeSelectSegment : Model -> Html Msg
modeSelectSegment model =
    div
        [ class "p-1.5 mx-2 my-3 border-t border-b" --border
        , class (basecolors model.colorTheme).borderBtn
        --, class (basecolors model.colorTheme).rounded
        ]
        [ modeText model ViewMode "VIEW"
        , modeText model EditMode "EDIT"
        , modeText model ReorderMode "PAGES"
        ]


modeText : Model -> Mode -> String -> Html Msg
modeText model mode label =
    let
        theme = model.colorTheme

        isActive =
            model.mode == mode

        activeClass =
            if isActive then
                tw
                    [ --(basecolors theme).primary
                     (basecolors theme).accent
                    , "font-bold"
                    ]

            else
                "opacity-100 hover:opacity-70 bg-transparent"
    in
    p
        [ class (modeTextStyle theme activeClass)
        , style "font-family" (basecolors theme).fontDeco
        , onClick (ChangeMode mode)
        ]
        [ text label ]

modeTextStyle : ColorTheme -> String -> String
modeTextStyle theme activeClass =
    tw  [ "flex-col py-2 text-sm transition-all text-center leading-none cursor-pointer"
        , activeClass
        --, (basecolors theme).rounded
        ]

windowCloseHeader : ColorTheme -> Html Msg
windowCloseHeader theme =
    div [ class "flex justify-end px-2 py-1.5" ]
        [ button
            [ class (tw [ "w-full", "flex", "items-center", "justify-center", "text-xs", "opacity-60", "hover:opacity-100", (basecolors theme).text ])
            , onClick CloseRightSideWindow
            , title "Close window"
            ]
            [ text "Close" ]
        ]

sidebarModeSection : Model -> Html Msg
sidebarModeSection model =
    div [ class "flex flex-col gap-2 mx-3 font-bold border-b pt-1 pb-4"
        , class (basecolors model.colorTheme).borderBtn
        ]
        [ leftSidebarToggle model.colorTheme model.sidebarMode
        , sidebarToggleBtn model.colorTheme
        ]


leftSidebarToggle : ColorTheme -> SidebarMode -> Html Msg
leftSidebarToggle theme currentMode =
    button
        [ class (tw [ sidebarBtnStyle theme (currentMode == LeftSidebar), "border-l-8" ])
        , style "font-family" (basecolors theme).fontDeco
        , onClick ToggleLeftSidebar
        ]
        [ text "Left Menu" ]


sidebarToggleBtn : ColorTheme -> Html Msg
sidebarToggleBtn theme =
    button
        [ class (tw [ sidebarBtnStyle theme False, "border-x-8" ])
        , style "font-family" (basecolors theme).fontDeco
        , onClick ToggleNormalSidebar
        , title "Show Sidebar"
        ]
        [ text "Normal" ]


sidebarBtnStyle : ColorTheme -> Bool -> String
sidebarBtnStyle theme isActive =
    let
        base =
            [ "w-full", "py-1", "text-sm", "font-semibold"--, "border", "opacity-90"
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
                , "hover:bg-white/25"
                , "bg-transparent"
                ]
    in
    tw (base ++ state)

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


-- MARK:セレクター
viewThemeSelector : ColorTheme -> Html Msg
viewThemeSelector theme =
    div []
        [ --p [ class "font-mono mb-1" ] [ text "THEME" ]
          p [ class "font-mono mb-1 text-[11px] opacity-70" ] [ text "THEME" ]
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
        , style "font-family" (basecolors model.colorTheme).fontDeco
        , onClick (CreateNextPage (model.present.currentPageIndex + 1))
        ]
        [ text "+ Next Page" ]


importPageButton : Model -> Html Msg
importPageButton model =
    button
        [ class (importPageStyle model.colorTheme)
        , style "font-family" (basecolors model.colorTheme).fontDeco
        , onClick RequestPageImport
        ]
        [ text "+ Import txt/md" ]


addPageBtnStyle : ColorTheme -> String
addPageBtnStyle theme =
    tw  [ "w-full", "py-2.5", "text-sm"
        , "pr-2", "mt-6", "mb-3", "border"
        , (basecolors theme).borderStrong
        , (basecolors theme).rounded
        , (basecolors theme).bg
        , (basecolors theme).text
        , "hover:bg-white/5" ]

importPageStyle : ColorTheme -> String
importPageStyle theme =
    tw  [ "w-full", "py-1.5", "text-sm"
        , "pr-2", "mt-1", "mb-6", "border"
        --, (basecolors theme).borderBtn
        , (basecolors theme).borderStrong
        , (basecolors theme).rounded
        --, (basecolors theme).bg
        , (basecolors theme).text
        -- , "hover:brightness-115"
        , "hover:bg-white/20"
        ]

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
-- viewShelfBookIcon : Model -> Html Msg
-- viewShelfBookIcon model =
--     div [ class "flex flex-col gap-2 justify-center py-2 px-3" ]
--         [ viewCategoryButton model
--         , viewBooksButton model
--         ]


-- viewCategoryButton : Model -> Html Msg
-- viewCategoryButton model =
--     button
--         [ class (categoryBtn model.colorTheme)
--         , onClick (getCategoryButtonMsg model.mainViewMode)
--         , title "本棚一覧"
--         ]
--         [ text "Category" ]


-- viewBooksButton : Model -> Html Msg
-- viewBooksButton model =
--     button
--         [ class (categoryBtn model.colorTheme)
--         , onClick (getBooksButtonMsg model)
--         , title "本一覧"
--         ]
--         [ text "Books" ]


categoryBtn : ColorTheme -> String
categoryBtn theme =
    tw  [ "w-full", "h-8", "border", "px-2.5", "text-sm", "font-mono"
        , "items-center", "justify-center", "hover:bg-white/25"
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

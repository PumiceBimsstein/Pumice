module View.SideBar exposing (sidebarArea)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Type exposing (..)
import View.Style as Style exposing (..)
import Domain.Helper exposing (..)
import Icon exposing (..)
import View.SideBarContents exposing (sidebarContent)
import View.ViewHelper exposing (openDropdown, stopClickPropagation)

sidebarArea : Model -> AppState -> Html Msg
sidebarArea model present =
    aside
        [ class (asideStyle model.colorTheme) ]
        [ sidebarHeader model
        , sidebarContent model present
        , sidebarFooter model
        ]

asideStyle : ColorTheme -> String
asideStyle theme =
    tw  [ "w-full h-full border-r flex flex-col", (basecolors theme).border ]


-- MARK:ヘッダー
sidebarHeader : Model -> Html Msg
sidebarHeader model =
    header
        [ class (sideHeaderStyle model.colorTheme) ]
        [ sidebarTitleRow model
        , viewSearchInput model.colorTheme model.searchText
        , viewSidebarTabs model
        ]

sideHeaderStyle : ColorTheme -> String
sideHeaderStyle theme =
    tw  [ "flex", "flex-col"
        , (basecolors theme).surface
        , (basecolors theme).textMuted
        ]

sidebarTitleRow : Model -> Html Msg
sidebarTitleRow model =
    div
        [ class "flex items-center gap-2 px-3 py-2.5" ]
        [ sidebarTitle model
        , undoRedoGroup model.colorTheme
        ]

sidebarTitle : Model -> Html Msg
sidebarTitle model =
    h1
        [ class "flex-1 cursor-pointer select-none"
        , onClick (ChangeMainView ShelfListView)
        ]
        [ span
            [ class "font-medium tracking-widest w-full flex justify-center"
            , style "font-family" (basecolors model.colorTheme).fontDeco
            ]
            [ text "Pumice" ]
        ]

undoRedoGroup : ColorTheme -> Html Msg
undoRedoGroup theme =
    div
        [ class "flex items-center gap-2" ]
        [ viewUndoButton theme
        , viewRedoButton theme
        ]

viewUndoButton : ColorTheme -> Html Msg
viewUndoButton theme =
    button
        [ class (undoButtonStyle theme)
        , onClick Undo
        , title "元に戻す"
        ]
        [ Style.icon Icon.left "w-5 h-5" ]

viewRedoButton : ColorTheme -> Html Msg
viewRedoButton theme =
    button
        [ class (undoButtonStyle theme)
        , onClick Redo
        , title "Redo"
        ]
        [ Style.icon Icon.right "w-5 h-5" ]


undoButtonStyle : ColorTheme -> String
undoButtonStyle theme =
    tw  [ "w-8", "h-8", "flex", "border"
        , "items-center", "justify-center"--, "transition-colors"
        , (basecolors theme).borderBtn
        , (basecolors theme).rounded
        , "hover:bg-white/25"
        ]


viewSearchInput : ColorTheme -> String -> Html Msg
viewSearchInput theme searchText =
    div [ class (searchBoxStyle theme) ]
        [ input
            [ type_ "text"
            , placeholder "Search content..."
            , class ( searchInputStyle theme )
            , onInput UpdateSearchText
            , value searchText
            ]
            []
        , if not (String.isEmpty searchText) then
            button
                [ class (searchClearbuttonStyle theme)
                , onClick (UpdateSearchText "")
                , title "Clear search"
                ]
                [ text "×" ]
          else
            text ""
        ]


searchBoxStyle : ColorTheme -> String
searchBoxStyle theme =
    tw  [ "relative", "px-3", "py-2", (basecolors theme).rounded ]


searchClearbuttonStyle : ColorTheme -> String
searchClearbuttonStyle theme =
    tw  [ "absolute", "flex", "-translate-y-1/2"
        , "right-5", "top-1/2", "w-5", "h-5"
        , "items-center", "justify-center"
        , "text-xs", "rounded"
        --, "transition-colors"
        , (basecolors theme).textMuted
        , "hover:bg-white/25"
        ]


searchInputStyle : ColorTheme -> String
searchInputStyle theme =
    tw  [ "w-full", "pl-6", "pr-3", "py-1.5"
        , "mono", "text-xs", "border"
        , "outline-none", "placeholder:opacity-50"--, "transition-colors"
        , (basecolors theme).bg
        , (basecolors theme).border
        , (basecolors theme).text
        , (basecolors theme).rounded
        ]


-- タブ切替ボタン
viewSidebarTabs : Model -> Html Msg
viewSidebarTabs model =
    div [ class "flex mt-3"
        , style "font-family" (basecolors model.colorTheme).fontDeco
        ]
        [ viewTabButton model ShelfListTab "Category"
        , viewTabButton model BookListTab "Books"
        , viewTabButton model TocTab "Contents"
        ]

viewTabButton : Model -> SidebarTab -> String -> Html Msg
viewTabButton model tab label =
    let
        isActive = model.sidebarTab == tab
        searchText = model.searchText
        -- 他の場所にヒットがあるかどうかの判定
        hasExternalHit =
            if String.isEmpty searchText then
                False

            else
                case tab of
                    ShelfListTab ->
                        -- 「現在の本棚以外」にヒットがあるか
                        model.present.shelves
                            |> List.filter (\s -> s.id /= model.present.currentShelfId)
                            |> List.any (hasHitInShelf searchText)

                    BookListTab ->
                        -- 「現在の本以外」かつ「現在の本棚の中」にヒットがあるか
                        model.present.shelves
                            |> List.filter (\s -> s.id == model.present.currentShelfId)
                            |> List.concatMap .books
                            |> List.filter (\b -> Just b.id /= model.present.currentBookId)
                            |> List.any (hasHitInBook searchText)

                    TocTab ->
                        -- 基本は不要だが、もし「現在のページ以外」にヒットがあるか出すならここ
                        False

        indicator =
            if hasExternalHit then
                span
                    [ class "absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full shadow-sm" ]
                    --indicator = "absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full shadow-sm"
                    []
            else
                text ""
    in
    button
        [ class (tabStyle model.colorTheme isActive)
        , onClick (ChangeSidebarTab tab)
        ]
        [ text label
        , indicator
        ]


tabStyle : ColorTheme -> Bool -> String
tabStyle theme isActive =
    tw  [ "flex-1", "py-2", "mono", "text-sm", "relative", "font-bold"
        , if isActive then
            tw  [ (basecolors theme).deco
                , (basecolors theme).primary
                ]
          else
            tw  [ "hover:bg-white/10" ]
        ]

-- MARK:フッター
sidebarFooter : Model -> Html Msg
sidebarFooter model =
    div
        [ class (sideFooter model.colorTheme) ]
        [ fileFunctionTrigger model
        , exportButton model.colorTheme
        , functionButton model
        ]


fileFunctionTrigger : Model -> Html Msg
fileFunctionTrigger model =
    let
        menuId = FileMenu
        isOpen = model.openMenuId == Just menuId
    in
    div
        [ class "relative flex flex-1 h-full" ]
        [ button
            [ class (footerButton model.colorTheme)
            , stopClickPropagation (ToggleMenu menuId)
            ]
            [ text "File ▾" ]
        , openDropdown
            isOpen
            Above
            model.colorTheme
            [ ( "Import BackUp Data", RequestImport AllImport )
            , ( "Download Zip", ExportAllZip )
            ]
        ]


functionButton : Model -> Html Msg
functionButton model =
    let
        menuId = AppMenu
        isOpen = model.openMenuId == Just menuId
    in
    div
        [ class "relative flex flex-1 h-full" ]
        [ button
            [ class (footerButton model.colorTheme)
            , stopClickPropagation (ToggleMenu menuId)
            ]
            [ text "etc ▾" ]
        , openDropdown
            isOpen
            Above
            model.colorTheme
            [ ( "Reset", ExportData )
            , ( "Guide Pages", AddGuideShelf )
            ]
        ]


exportButton : ColorTheme -> Html Msg
exportButton theme =
    button
        [ class (footerButton theme)
        , onClick ExportData
        , title "QUICK BACK UP"
        ]
        [ Style.icon Icon.disk "w-5 h-5" ]


sideFooter : ColorTheme -> String
sideFooter theme =
    tw  [ "px-3", "py-1.5", "h-10", "border-t", "flex"
        , "items-center", "w-full", "gap-2"
        , (basecolors theme).surface
        , (basecolors theme).border
        ]


footerButton : ColorTheme -> String
footerButton theme =
    tw  [ "flex", "flex-1", "h-full"
        , "text-[12px]", "font-bold"
        , "tracking-widest"
        , "uppercase"
        , "border"
        , (basecolors theme).rounded
        , (basecolors theme).textMuted
        , (basecolors theme).borderBtn
        , (basecolors theme).brightAccent
        , "hover:bg-white/5"
        , "active:scale-95"
        , "items-center", "justify-center"
        ]

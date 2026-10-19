module Type exposing (..)

import Json.Decode as Decode
import Random
import Browser.Dom

type alias Flags =
    { storageData : Decode.Value
    , seed : List Int
    }

type alias Page =
    { id : String
    , title : String
    , content : String
    }

type alias Book =
    { id : String
    , title : String
    , pages : List Page
    }

type alias Shelf =
    { id : String
    , name : String
    , books : List Book
    }

type alias AppState =
    { shelves : List Shelf
    , currentShelfId : String
    , currentBookId : Maybe String
    , currentPageIndex : Int
    , currentHeading : List String
    }

type alias Heading =
    { level : Int
    , text : String
    , pageIndex : Int
    , order : Int
    }

type alias HeadingData =
    { headings : List Heading
    , allHeadingTexts : List String
    }

type Mode
    = ViewMode
    | EditMode
    | ReorderMode

type SidebarMode
    = NormalSidebar
    | OverlaySidebar
    | LeftSidebar

type MenuDirection
    = Above
    | Below

-- 表示するドロップダウンメニューの型
type MenuId
    = ShelfExportMenu String   -- 本棚のIDを持つ
    | BookExportMenu String    -- 本のIDを持つ
    | FileMenu
    | AppMenu

type MainViewMode
    = PageView
    | ShelfListView
    | ShelfDetailView String

type FontSize
    = Small
    | Medium
    | Large

type SidebarTab
    = ShelfListTab
    | BookListTab
    | TocTab

type ColorTheme
    = Light
    | Dark
    | Magical

type RenderStyle
    = Standard
    | Minimal
    | Academic
    | Mystical

type ButtonKind
    = Delete
    | Create
    | CreateCard
    | DeleteButton ( Int, Int )
    | ExportMini

-- 並べ替えに使用する型
type DragTarget
    = DragShelf
    | DragBook
    | DragPage

type HeadingLevel
    = H1
    | H2
    | H3

type ContentWidth
    = Narrow
    | Normal
    | Wide

type ImportTarget
    = ShelfImport
    | BookImport
    | AllImport

type alias DraggingState =
    { target : DragTarget
    , fromIndex : Int
    , overIndex : Int
    }

-- zip出力のためのデータ構造
type alias ZipEntry =
    { path : String
    , content : String
    }

type alias ZipPayload =
    { zipName : String
    , entries : List ZipEntry
    }

type EditTarget
    = ShelfTitle
    | BookTitle

-- 現在の編集セッションの状態
type alias EditBuffer =
    { target : EditTarget
    , id : String
    , value : String
    }

-- インポート時の判別用デコーダー
type ImportData
    = ImportedBook Book
    | ImportedShelf Shelf


type ExportFormat
    = FormatTxt
    | FormatMd

-- アプリケーション全体のモデル

type alias Model =
    { past : List AppState
    , present : AppState
    , future : List AppState
    , seed : Random.Seed
    , mainViewMode : MainViewMode
    , mode : Mode
    , sidebarTab : SidebarTab
    , sidebarMode : SidebarMode
    , searchText : String
    , editing : Maybe EditBuffer
    , fontSize : FontSize
    , colorTheme : ColorTheme
    , renderStyle : RenderStyle
    , scrollRatio : Float
    , headingPositions : List (String, Float)
    , draggingState : Maybe DraggingState
    , pageCreationBuffer : List String
    , pageCreationTitle : String
    , visibleHeadingLevel : HeadingLevel
    , contentWidth : ContentWidth
    , isSidebarOverlaid : Bool
    , isRightSideWindowVisible : Bool -- 追加
    , exportFormat : ExportFormat
    , openMenuId : Maybe MenuId
    --, openExportMenuId : Maybe String
    }

-- メッセージ定義

type Msg
    = Undo
    | Redo
      -- 本棚・メインビュー操作
    | ChangeMainView MainViewMode
    | CreateShelf
    | DeleteShelf String
    | SelectShelf String
      -- ブック操作
    | CreateBook
    | DeleteBook String
    | SelectBook String
      -- ページ操作
    | CreatePage Int
    | CreateNextPage Int
    | DeletePage String
    | SelectPage Int
    | DuplicatePage Int
    | NextPage
    | PrevPage
      -- 表示設定・その他
    | ChangeMode Mode
    | ChangeSidebarTab SidebarTab
    -- | UpdateShelfName String String
    | EditorInput String
    | UpdateSearchText String
    | ChangeColorTheme String
    | ChangeRenderStyle String
    | JumpToHeading Int String
    | Reorder DragTarget Int Int
    | ReorderPages Int Int
    | RequestImport ImportTarget
    | RequestPageImport
    | PageFileSelected Decode.Value
    | ImportBook String Book
    | ImportShelf String Shelf
    | ImportData String
    | ExportData
    | ChangeExportFormat String
    | ExportPage String
    | FileDropped Decode.Value
    | ChangeFontSize String
    | OnScroll String Browser.Dom.Viewport
    | DragStart DragTarget Int
    | DragOver Int
    | DragEnd
    | ExportBookZip String
    | ExportBookJson Book
    | ExportShelfZip String
    | ExportShelfJson Shelf
    | ExportAllZip
    | EditBegin EditTarget String String
    | EditUpdate String
    | EditSubmit
    | EditCancel
    | SetVisibleHeadingLevel HeadingLevel
    | SetContentWidth ContentWidth
    | ToggleSidebarOverlay
    --| ToggleExportMenu String
    --| ToggleAppMenu String
    | ToggleMenu MenuId
    --| CloseExportMenu
    | CloseMenu
    | ToggleNormalSidebar
    | ToggleLeftSidebar
    | OpenRightSideWindow   -- 追加
    | CloseRightSideWindow  -- 追加
    | NoOp
module Type exposing (..)

import Json.Decode as Decode
import Random
import Browser.Dom
import Time
import File exposing (File)

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

-- MARK:AppState
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

-- MARK:ドロップダウンメニューの型
type MenuId
    = ShelfExportMenu String
    | BookExportMenu String
    | PageExportMenu String
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
-- type ImportData
--     = ImportedBook Book
--     | ImportedShelf Shelf


type ExportFormat
    = FormatTxt
    | FormatMd

-- MARK:Model
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
    , isRightSideWindowVisible : Bool
    , openMenuId : Maybe MenuId
    , modalAlert : Maybe String
    , typingSessionBaseline : Maybe AppState   -- 入力開始直前の状態スナップショット
    , editorDebounceCounter : Int             -- 入力タイマー判定用のカウンタ
    
    }

-- MARK:Msg

type Msg
    = Undo
    | Redo
    | ChangeMainView MainViewMode
    | CreateShelf
    | DeleteShelf String
    | SelectShelf String
    | CreateBook
    | DeleteBook String
    | SelectBook String
    | CreatePage Int
    | CreateNextPage Int
    | DeletePage String
    | SelectPage Int
    | DuplicatePage Int
    | NextPage
    | PrevPage
    | ChangeMode Mode
    | ChangeSidebarTab SidebarTab
    | EditorInput String
    | UpdateSearchText String
    | ChangeColorTheme String
    | ChangeRenderStyle String
    | JumpToHeading Int String
    | JumpToBookHeading String Int String
    | Reorder DragTarget Int Int
    | ReorderPages Int Int
    | RequestImport ImportTarget
    | RequestPageImport
    | ExportData
    | ExportDataWithTime ( Time.Zone, Time.Posix )
    | ExportPage String
    | DismissAlert
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
    | JsonFilesSelected ImportTarget (List File)
    | JsonFileRead (Maybe ImportTarget) String String
    | PageFileSelected File
    | PageContentLoaded String String
    | FilesDropped (List File)
    | SetVisibleHeadingLevel HeadingLevel
    | SetContentWidth ContentWidth
    | ToggleMenu MenuId
    | CloseMenu
    | ToggleNormalSidebar
    | ToggleLeftSidebar
    | OpenRightSideWindow
    | CloseRightSideWindow
    | AddGuideShelf
    | SelectMenuItem Msg
    | ResetApp
    | ResetAppWithTime ( Time.Zone, Time.Posix )
    | CommitTypingSession Int
    | NoOp



    

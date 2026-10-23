module Init exposing (initDefaultModel, initModelWithAppState, resetWithBackup)


import Random
import Json.Decode as Decode
import JsonConverter exposing (..)
import Type exposing (..)
import Time
import File.Download as Download
import Domain.Helper exposing (..)
import Domain.AddItem exposing (..)
import Domain.Guide exposing (defaultAppState)
import Ports exposing (saveToStorage, scrollToTop)

-- 初期状態のデフォルトModelを生成
initDefaultModel : Random.Seed -> Model
initDefaultModel seed =
    initModelWithAppState seed defaultAppState


initModelWithAppState : Random.Seed -> AppState -> Model
initModelWithAppState seed appState =
    { past = []
    , present = appState
    , future = []
    , seed = seed
    , mainViewMode = PageView
    , mode = ViewMode
    , sidebarTab = TocTab
    , sidebarMode = NormalSidebar
    , searchText = ""
    , editing = Nothing
    , fontSize = Medium
    , colorTheme = Light
    , renderStyle = Standard
    , scrollRatio = 0
    , headingPositions = []
    , draggingState = Nothing
    , pageCreationBuffer = []
    , pageCreationTitle = ""
    , visibleHeadingLevel = H3
    , contentWidth = Wide
    , isSidebarOverlaid = False
    , isRightSideWindowVisible = True
    , exportFormat = FormatTxt
    , openMenuId = Nothing
    , modalAlert = Nothing
    }


-- MARK:リセット

-- バックアップを出力し、UNDO履歴を残した上で初期状態に戻す
resetWithBackup : Time.Zone -> Time.Posix -> Model -> ( Model, Cmd Msg )
resetWithBackup zone time model =
    let
        fileName =
            formatBackupFileName zone time

        backupJson =
            JsonConverter.encodeExportAll model

        newModel =
            model
                |> applyResetWithHistory
    in
    ( newModel
    , Cmd.batch
        [ Download.string fileName "application/json" backupJson -- 直接ダウンロード
        , saveToStorage (JsonConverter.encodeModel newModel)
        , scrollToTop ()
        ]
    )


{-| 現在の AppState を UNDO 履歴（past）に積んだ上で、初期モデルを生成する -}
applyResetWithHistory : Model -> Model
applyResetWithHistory model =
    let
        defaultModel =
            initDefaultModel model.seed

        -- リセット直前の状態（model.present）を履歴の先頭に積み、最大100件まで保持
        updatedPast =
            List.take 100 (model.present :: model.past)
    in
    { defaultModel
        | past = updatedPast
    }
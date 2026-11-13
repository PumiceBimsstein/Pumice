module Init exposing (initDefaultModel, initModelWithAppState, resetWithBackup, buildInitialModelFromFlags)

import Random
import JsonConverter exposing (..)
import Type exposing (..)
import Time
import File.Download as Download
import Json.Decode as Decode
import Domain.Helper exposing (..)
import Domain.AddItem exposing (..)
import Domain.Guide exposing (defaultAppState)
import Ports exposing (saveToStorage, scrollToTop)

-- フラグから初期Seedを生成する
extractSeed : Flags -> Random.Seed
extractSeed flags =
    flags.seed
        |> List.head
        |> Maybe.withDefault 0
        |> Random.initialSeed

-- ストレージデータのデコードを試み、失敗時はセーフモード警告を発行して既存データを保護する
buildInitialModelFromFlags : Flags -> Model
buildInitialModelFromFlags flags =
    let
        seed =
            extractSeed flags

        -- [修正] isNotNullValue 関数で判定
        isDataPresent =
            isNotNullValue flags.storageData
    in
    case Decode.decodeValue JsonConverter.decodeModel flags.storageData of
        Ok model ->
            { model | seed = seed }

        Err _ ->
            case Decode.decodeValue (Decode.field "present" JsonConverter.decodeAppState) flags.storageData of
                Ok appState ->
                    initModelWithAppState seed appState

                Err _ ->
                    case Decode.decodeValue JsonConverter.decodeAppState flags.storageData of
                        Ok fallbackAppState ->
                            initModelWithAppState seed fallbackAppState

                        Err _ ->
                            if isDataPresent then
                                -- データが存在するのに全デコードが失敗した場合：保護セーフモード
                                let
                                    base =
                                        initDefaultModel seed
                                in
                                { base
                                    | modalAlert =
                                        Just "【警告】保存データの読み込みに失敗しました。\n既存データの破損・上書きを防ぐため、新規保存を一時停止しています。\n画面をリロードするか、バックアップファイルから再読み込みしてください。"
                                }

                            else
                                -- 完全な初回起動（flags.storageData が null の場合）
                                initDefaultModel seed

isNotNullValue : Decode.Value -> Bool
isNotNullValue value =
    case Decode.decodeValue (Decode.null ()) value of
        Ok _ ->
            -- null の場合はデータなし
            False

        Err _ ->
            -- null 以外（オブジェクトや文字列などのデータが存在する）
            True


-- 初期状態のデフォルトModel
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
    , isRightSideWindowVisible = True
    , openMenuId = Nothing
    , modalAlert = Nothing
    , typingSessionBaseline = Nothing
    , editorDebounceCounter = 0
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
        [ Download.string fileName "application/json" backupJson
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
port module Ports exposing
    ( saveToStorage
    , syncScroll
    , scrollToIndex
    , scrollToTop
    , scrollToTocHeading
    , triggerDownload
    , fileDropped
    , incomingMsg
    , requestCreate
    , pageChanged
    , fileContentReceiver
    , exportFile
    , exportZip
    , requestFileImport, requestPageImport, pageFileSelected
    )

import Type exposing (..)
import Json.Decode as Decode

port saveToStorage : String -> Cmd msg
port syncScroll : { targetId : String, ratio : Float } -> Cmd msg
port scrollToIndex : String -> Cmd msg
port scrollToTop : () -> Cmd msg
port triggerDownload : String -> Cmd msg
port fileDropped : (Decode.Value -> msg) -> Sub msg
port incomingMsg : (Decode.Value -> msg) -> Sub msg
port requestCreate : String -> Cmd msg
port pageChanged : () -> Cmd msg
port fileContentReceiver : (String -> msg) -> Sub msg
port exportFile : { fileName : String, content : String } -> Cmd msg
port exportZip : ZipPayload -> Cmd msg
port requestFileImport : String -> Cmd msg
port requestPageImport : () -> Cmd msg
port pageFileSelected : (Decode.Value -> msg) -> Sub msg
port scrollToTocHeading : () -> Cmd msg

port module Ports exposing
    ( saveToStorage
    , syncScroll
    , scrollToIndex
    , scrollToTop
    , scrollToTocHeading
    , incomingMsg
    , requestCreate
    , pageChanged
    , exportZip
    )

import Type exposing (..)
import Json.Decode as Decode

port saveToStorage : String -> Cmd msg
port syncScroll : { targetId : String, ratio : Float } -> Cmd msg
port scrollToIndex : String -> Cmd msg
port scrollToTop : () -> Cmd msg
port incomingMsg : (Decode.Value -> msg) -> Sub msg
port requestCreate : String -> Cmd msg
port pageChanged : () -> Cmd msg
port exportZip : ZipPayload -> Cmd msg
port requestFileImport : String -> Cmd msg
port requestPageImport : () -> Cmd msg
port scrollToTocHeading : () -> Cmd msg

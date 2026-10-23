port module Ports exposing
    ( saveToStorage
    , syncScroll
    , scrollToIndex
    , scrollToTop
    , scrollToTocHeading
    , incomingMsg
    , exportZip
    )

import Type exposing (..)
import Json.Decode as Decode

port saveToStorage : String -> Cmd msg
port syncScroll : { targetId : String, ratio : Float } -> Cmd msg
port scrollToIndex : String -> Cmd msg
port scrollToTop : () -> Cmd msg
port incomingMsg : (Decode.Value -> msg) -> Sub msg
port exportZip : ZipPayload -> Cmd msg
port scrollToTocHeading : () -> Cmd msg

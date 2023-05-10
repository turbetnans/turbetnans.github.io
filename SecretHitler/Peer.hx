extern class Peer {
    @:overload(function(?id:String,?options:PeerOptions):Void {})
    @:overload(function(?id:String,?options:{debug:Int}):Void {})
    function new():Void;

    var id:String;
    var options:PeerOptions;

    var disconnected:Bool;
    var destroyed:Bool;

    @:overload(function(id:String,?options:PeerConnectOption):DataConnection {})
    function connect(id:String,?options:{label:String,metadata:Any,serialization:String,reliable:Bool}):DataConnection;
    function on(event:String,callback:(Any)->Void):Void;
    function disconnect():Void;
    function resconnect():Void;
    function destroy():Void;
}

extern class PeerOptions {
	var key:String;
	var host:String;
	var port:Int;
	var pingInterval:Int;
	var path:String;
	var secure:Bool;
	var debug:Int;
	var config:Any;
}

extern interface PeerConnectOption {
	var label:String;
	var metadata:Any;
	var serialization:String;
	var reliable:Bool;
}

extern class DataConnection {
    function new(peerId:String,provider:Peer,options:Any);

    var dataChannel:RTCDataChannel;
    var label:String;
    var metadata:Any;
    var open:Bool;
    var peerConnection:Any;
    var peer:String;
    var reliable:Bool;
    var serialization:String;
    var type:String;
    var bufferSize:Int;

    function send(data:Any):Void;
    function close():Void;
    function on(event:String,callback:(Any)->Void):Void;
    function destroy():Void;
}

extern class RTCDataChannel {}

extern class Error {
    var type:String;
}
/*
"browser-incompatible","disconnected","invalid-id","invalid-key",
"network","peer-unavailable","ssl-unavailable","server-error",
"socket-error","socket-closed","unavailable-id","webrtc",
*/

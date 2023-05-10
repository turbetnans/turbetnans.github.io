(function ($hx_exports, $global) { "use strict";
$hx_exports["sh"] = $hx_exports["sh"] || {};
$hx_exports["sh"]["client"] = $hx_exports["sh"]["client"] || {};
$hx_exports["sh"]["client"]["components"] = $hx_exports["sh"]["client"]["components"] || {};
;$hx_exports["sh"]["core"] = $hx_exports["sh"]["core"] || {};
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.now = function() {
	return Date.now();
};
var JsxStaticInit_$_$ = function() { };
JsxStaticInit_$_$.__name__ = true;
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var _ = $getIterator(it);
		while(_.hasNext()) {
			var _1 = _.next();
			++n;
		}
	} else {
		var x = $getIterator(it);
		while(x.hasNext()) {
			var x1 = x.next();
			if(pred(x1)) {
				++n;
			}
		}
	}
	return n;
};
var Main = $hx_exports["Main"] = function() { };
Main.__name__ = true;
Main.main = function() {
	ReactDOM.render(React.createElement(react_ReactType.fromComp(sh_client_Client),{ }),window.document.getElementById("root"));
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.random = function(x) {
	if(x <= 0) {
		return 0;
	} else {
		return Math.floor(Math.random() * x);
	}
};
var fsm__$FSM_Transition = function(from,to,event) {
	this.isInternal = false;
	this.event = null;
	this.to = fsm__$FSM_Transition.NULL_ID;
	this.from = fsm__$FSM_Transition.NULL_ID;
	this.id = fsm__$FSM_Transition.NULL_ID;
	this.fsm = null;
	this.from = from;
	this.to = to;
	this.event = event;
};
fsm__$FSM_Transition.__name__ = true;
fsm__$FSM_Transition.prototype = {
	guard: function() {
		var $l=arguments.length;
		var Any1 = new Array($l>0?$l-0:0);
		for(var $i=0;$i<$l;++$i){Any1[$i-0]=arguments[$i];}
		return true;
	}
	,action: function() {
		var $l=arguments.length;
		var Any1 = new Array($l>0?$l-0:0);
		for(var $i=0;$i<$l;++$i){Any1[$i-0]=arguments[$i];}
	}
	,toString: function() {
		return (this.isInternal ? "Internal-TR-" : "TR-") + this.id + "|" + this.event + ":" + this.from + "->" + this.to;
	}
};
var fsm__$FSM_State = function(name,fsm) {
	this.isFinal = false;
	this.transitions = [];
	this.name = "state";
	this.id = fsm__$FSM_State.NULL_ID;
	this.fsm = null;
	this.name = name;
	this.fsm = fsm;
};
fsm__$FSM_State.__name__ = true;
fsm__$FSM_State.prototype = {
	onEntry: function() {
	}
	,onExit: function() {
	}
	,toString: function() {
		return (this.isFinal ? "Final-ST-" : "ST-") + this.id + "|" + this.name;
	}
};
var fsm_FSM = function() {
	this.initial = fsm__$FSM_State.NULL_ID;
	this.currentState = fsm__$FSM_State.NULL_ID;
	this.transitions = [];
	this.states = [];
	this.states = [];
	this.transitions = [];
};
fsm_FSM.__name__ = true;
fsm_FSM.prototype = {
	initialAction: function() {
	}
	,get_isRunning: function() {
		return this.currentState != fsm__$FSM_State.NULL_ID;
	}
	,get_isFinished: function() {
		if(this.currentState != fsm__$FSM_State.NULL_ID) {
			return this.states[this.currentState].isFinal;
		} else {
			return false;
		}
	}
	,setInitial: function(initialState,action) {
		if(this.currentState != fsm__$FSM_State.NULL_ID) {
			console.log("fsm/FSM.hx:27:","[ERR]\t" + "setInitial\t" + "can't modify while running.");
			return fsm__$FSM_State.NULL_ID;
		}
		if(this.states[initialState] == null) {
			console.log("fsm/FSM.hx:32:","[ERR]\t" + "setInitial\t" + "invalid state." + "\n\t" + initialState);
			return fsm__$FSM_State.NULL_ID;
		}
		this.initialAction = action != null ? action : function() {
		};
		return this.initial = initialState;
	}
	,addState: function(name,onEntry,onExit) {
		if(this.currentState != fsm__$FSM_State.NULL_ID) {
			console.log("fsm/FSM.hx:41:","[ERR]\t" + "addstate\t" + "can't modify while running.");
			return fsm__$FSM_State.NULL_ID;
		}
		if(name == null || name == "") {
			console.log("fsm/FSM.hx:46:","[ERR]\t" + "addstate\t" + "empty name." + "\n\t" + name);
			return fsm__$FSM_State.NULL_ID;
		}
		var s = new fsm__$FSM_State(name,this);
		s.onEntry = onEntry != null ? onEntry : function() {
		};
		s.onExit = onExit != null ? onExit : function() {
		};
		s.id = this.states.push(s) - 1;
		return s.id;
	}
	,addTransition: function(from,to,event,isInternal,guard,action) {
		if(isInternal == null) {
			isInternal = false;
		}
		if(this.currentState != fsm__$FSM_State.NULL_ID) {
			console.log("fsm/FSM.hx:60:","[ERR]\t" + "addTransition\t" + "can't modify while running.");
			return fsm__$FSM_Transition.NULL_ID;
		}
		if(event == null) {
			console.log("fsm/FSM.hx:65:","[ERR]\t" + "addTransition\t" + "empty event." + "\n\t" + event);
			return fsm__$FSM_Transition.NULL_ID;
		}
		if(this.states[from] == null || this.states[to] == null) {
			console.log("fsm/FSM.hx:70:","[ERR]\t" + "addTransition\t" + "invalid state." + "\n\t" + from + " " + to);
			return fsm__$FSM_Transition.NULL_ID;
		}
		if(this.states[from].isFinal) {
			console.log("fsm/FSM.hx:75:","[ERR]\t" + "addTransition\t" + "transition from a final state." + "\n\t" + from);
			return fsm__$FSM_Transition.NULL_ID;
		}
		if(isInternal && from != to) {
			console.log("fsm/FSM.hx:80:","[ERR]\t" + "addTransition\t" + "invalid internal transition." + "\n\t" + from + " " + to);
			return fsm__$FSM_Transition.NULL_ID;
		}
		var t = new fsm__$FSM_Transition(from,to,event);
		t.guard = guard != null ? guard : function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return true;
		};
		t.action = action != null ? action : function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
		};
		t.isInternal = isInternal;
		t.id = this.transitions.push(t) - 1;
		this.states[from].transitions.push(t.id);
		return t.id;
	}
	,setFinal: function(state) {
		if(this.currentState != fsm__$FSM_State.NULL_ID) {
			console.log("fsm/FSM.hx:96:","[ERR]\t" + "setFinal\t" + "can't modify while running.");
			return fsm__$FSM_State.NULL_ID;
		}
		if(this.states[state] == null) {
			console.log("fsm/FSM.hx:101:","[ERR]\t" + "setFinal\t" + "invalid state." + "\n\t" + state);
			return fsm__$FSM_State.NULL_ID;
		}
		var _g = 0;
		var _g1 = this.transitions;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.from == state) {
				console.log("fsm/FSM.hx:107:","[ERR]\t" + "addTransition\t" + "transition is leaving the state." + "\n\t" + Std.string(t) + " " + state);
				return fsm__$FSM_State.NULL_ID;
			}
		}
		this.states[state].isFinal = true;
		return state;
	}
	,start: function() {
		if(this.initial == fsm__$FSM_State.NULL_ID || this.states.length == 0 || this.transitions.length == 0) {
			console.log("fsm/FSM.hx:118:","[ERR]\t" + "start\t" + "not fully initialized." + "\n\t" + this.initial + " " + this.states.length + " " + this.transitions.length);
			return false;
		}
		if(this.currentState != fsm__$FSM_State.NULL_ID) {
			if(!this.stop()) {
				return false;
			}
		}
		this.currentState = this.initial;
		this.initialAction();
		this.states[this.currentState].onEntry();
		return true;
	}
	,stop: function(forceStop) {
		if(forceStop == null) {
			forceStop = false;
		}
		if(this.currentState == fsm__$FSM_State.NULL_ID) {
			console.log("fsm/FSM.hx:132:","[ERR]\t" + "stop\t" + "not started.");
			return false;
		}
		if(!(this.currentState != fsm__$FSM_State.NULL_ID && this.states[this.currentState].isFinal) && !forceStop) {
			console.log("fsm/FSM.hx:136:","[ERR]\t" + "stop\t" + "not finished, use stop(true) to force stopping.");
			return false;
		}
		this.currentState = fsm__$FSM_State.NULL_ID;
		return true;
	}
	,update: function(event) {
		var $l=arguments.length;
		var args = new Array($l>1?$l-1:0);
		for(var $i=1;$i<$l;++$i){args[$i-1]=arguments[$i];}
		if(this.currentState == fsm__$FSM_State.NULL_ID) {
			console.log("fsm/FSM.hx:146:","[ERR]\t" + "update\t" + "not started.");
			return false;
		}
		if(this.states[this.currentState] == null) {
			console.log("fsm/FSM.hx:151:","[ERR]\t" + "update\t" + "invalid current state." + "\n\t" + this.currentState + " " + Std.string(this.states[this.currentState]));
			return false;
		}
		var _g = 0;
		var _g1 = this.states[this.currentState].transitions;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			var transition = this.transitions[t];
			if(transition != null && transition.event == event) {
				if(($_=transition,$_.guard.apply($_,args))) {
					if(!transition.isInternal) {
						this.states[this.currentState].onExit();
					}
					($_=transition,$_.action.apply($_,args));
					this.currentState = transition.to;
					if(!transition.isInternal) {
						this.states[this.currentState].onEntry();
					}
					return true;
				}
			}
		}
		return false;
	}
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.prototype = {
	keys: function() {
		var a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) a.push(+key);
		return new haxe_iterators_ArrayIterator(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
};
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
var react_Partial = function() { };
react_Partial.__name__ = true;
var react_ReactComponent = function() { };
react_ReactComponent.__name__ = true;
var react_ReactContext = {};
react_ReactContext.toReactType = function(this1) {
	return this1;
};
var react_ReactRef = {};
react_ReactRef.get_current = function(this1) {
	return this1.current;
};
var react_ReactType = {};
react_ReactType.fromString = function(s) {
	if(s == null) {
		return react_ReactType.isNull();
	}
	return s;
};
react_ReactType.fromFunction = function(f) {
	if(f == null) {
		return react_ReactType.isNull();
	}
	return f;
};
react_ReactType.fromFunctionWithProps = function(f) {
	if(f == null) {
		return react_ReactType.isNull();
	}
	return f;
};
react_ReactType.fromComp = function(cls) {
	if(cls == null) {
		return react_ReactType.isNull();
	}
	if(cls.__jsxStatic != null) {
		return cls.__jsxStatic;
	}
	return cls;
};
react_ReactType.isNull = function() {
	$global.console.error("Runtime value for ReactType is null." + " Something may be wrong with your externs.");
	return "div";
};
var react_ReactTypeOf = {};
react_ReactTypeOf._new = function(node) {
	var this1 = node;
	return this1;
};
react_ReactTypeOf.fromFunctionWithProps = function(f) {
	var this1 = react_ReactType.fromFunctionWithProps(f);
	return this1;
};
react_ReactTypeOf.fromComp = function(cls) {
	var this1 = react_ReactType.fromComp(cls);
	return this1;
};
react_ReactTypeOf.fromFunctionWithoutProps = function(f) {
	var this1 = react_ReactType.fromFunction(f);
	return this1;
};
react_ReactTypeOf.fromCompWithoutProps = function(cls) {
	var this1 = react_ReactType.fromComp(cls);
	return this1;
};
var sh_client_Client = $hx_exports["sh"]["client"]["Client"] = function(props) {
	React.Component.call(this,props);
	this.state = { state : "MENU", peer : "", name : "", playerId : null, role : "NONE", guests : [], host : null, history : []};
};
sh_client_Client.__name__ = true;
sh_client_Client.__super__ = React.Component;
sh_client_Client.prototype = $extend(React.Component.prototype,{
	componentDidMount: function() {
		var _gthis = this;
		this.peer = new Peer(null,{ debug : 2});
		this.peer.on("open",function(peerId) {
			_gthis.setState({ state : "MENU", peer : peerId});
		});
		this.peer.on("connection",function(c) {
			var co = c;
			if(_gthis.state.role != "HOST") {
				co.send(sh_client_HostMessage.REJECT(sh_client_Reason.NOT_HOSTING));
				co.on("open",function(_) {
					co.close();
				});
			} else {
				var _g = [];
				var _g1 = 0;
				var _g2 = _gthis.state.guests;
				while(_g1 < _g2.length) {
					var v = _g2[_g1];
					++_g1;
					if(v.co != null && v.co.peer == co.peer) {
						_g.push(v);
					}
				}
				if(_g.length > 0) {
					co.send(sh_client_HostMessage.REJECT(sh_client_Reason.ALREADY_CONNECTED));
					co.on("open",function(_) {
						co.close();
					});
				} else if(_gthis.state.guests.length >= 10) {
					co.send(sh_client_HostMessage.REJECT(sh_client_Reason.ROOM_FULL));
					co.on("open",function(_) {
						co.close();
					});
				} else if(_gthis.state.state == "GAME") {
					co.send(sh_client_HostMessage.REJECT(sh_client_Reason.GAME_LAUNCHED));
					co.on("open",function(_) {
						co.close();
					});
				} else {
					co.on("open",function(_) {
						co.send(sh_client_HostMessage.ACCEPT);
						_gthis.setState({ guests : _gthis.state.guests.concat([new sh_client_Guest(co.label,co,_gthis.state.guests.length)])},function() {
							var _gthis1 = _gthis;
							var _g = [];
							var _g1 = 0;
							var _g2 = _gthis.state.guests;
							while(_g1 < _g2.length) {
								var guest = _g2[_g1];
								++_g1;
								_g.push(guest.name);
							}
							_gthis1.sendToAllGuests(sh_client_HostMessage.LIST(_g));
						});
					});
					co.on("data",function(data) {
						_gthis.processGuestMessage(data,co.peer);
					});
					co.on("close",function(_) {
						console.log("sh/client/Client.hx:71:","co close");
						var _g = 0;
						var _g1 = _gthis.state.guests;
						while(_g < _g1.length) {
							var guest = _g1[_g];
							++_g;
							if(guest.co != null && guest.co.peer == co.peer) {
								HxOverrides.remove(_gthis.state.guests,guest);
								_gthis.setState({ guests : _gthis.state.guests},function() {
									var _gthis1 = _gthis;
									var _g = [];
									var _g1 = 0;
									var _g2 = _gthis.state.guests;
									while(_g1 < _g2.length) {
										var guest = _g2[_g1];
										++_g1;
										_g.push(guest.name);
									}
									_gthis1.sendToAllGuests(sh_client_HostMessage.LIST(_g));
								});
								break;
							}
						}
					});
					co.on("error",function(err) {
						console.log("sh/client/Client.hx:82:","co error " + Std.string(err));
					});
				}
			}
		});
		this.peer.on("disconnected",function(_) {
			console.log("sh/client/Client.hx:85:","peer disconnected");
		});
		this.peer.on("close",function(_) {
			console.log("sh/client/Client.hx:86:","peer close");
		});
		this.peer.on("error",function(err) {
			console.log("sh/client/Client.hx:87:","peer error " + Std.string(err));
		});
	}
	,componentDidUpdate: function(prevProps,prevState) {
	}
	,componentWillUnmount: function() {
	}
	,create: function() {
		if(this.state.name == "") {
			return;
		}
		this.setState({ state : "ROOM", role : "HOST", guests : this.state.guests.concat([new sh_client_Guest(this.state.name,null,0)])});
	}
	,join: function() {
		var _gthis = this;
		var hostId = window.document.getElementById("hostId").value;
		if(hostId == "" || hostId == this.state.peer || this.state.name == "") {
			return;
		}
		this.state.host = this.peer.connect(hostId,{ label : this.state.name, metadata : null, serialization : "json", reliable : true});
		this.state.host.on("open",function(_) {
			console.log("sh/client/Client.hx:108:","host co open");
		});
		this.state.host.on("data",function(data) {
			_gthis.processHostMessage(data);
		});
		this.state.host.on("close",function(_) {
			console.log("sh/client/Client.hx:110:","host co close");
		});
		this.state.host.on("error",function(err) {
			console.log("sh/client/Client.hx:111:","host co error " + Std.string(err));
		});
		this.setState({ state : "LOADING", role : "GUEST"});
	}
	,generateRandomName: function() {
		this.setState({ name : sh_core_Player.NAMES[Std.random(sh_core_Player.NAMES.length)]});
	}
	,start: function(nbPlayers,role) {
		if(nbPlayers < 5 || nbPlayers > 10) {
			return;
		}
		var _g = [];
		var _g1 = 0;
		var _g2 = this.state.guests;
		while(_g1 < _g2.length) {
			var g = _g2[_g1];
			++_g1;
			_g.push(g.name);
		}
		this.game = sh_core_Game.create(nbPlayers,_g);
		this.game.fsm.start();
		if(this.state.role == "HOST") {
			var _g = 0;
			var _g1 = this.state.guests;
			while(_g < _g1.length) {
				var guest = _g1[_g];
				++_g;
				if(guest.co != null) {
					guest.co.send(sh_client_HostMessage.LAUNCH(guest.id));
				}
			}
			var message = null;
			while(true) {
				message = this.game.messages.shift();
				if(!(message != null)) {
					break;
				}
				this.state.history.push(message);
				this.sendToAllGuests(sh_client_HostMessage.UPDATE(message));
			}
			this.setState({ state : "GAME", role : role, playerId : 0});
		} else {
			this.setState({ state : "GAME", role : role});
		}
		this.update();
	}
	,back: function() {
		switch(this.state.role) {
		case "GUEST":
			this.state.host.send(sh_client_GuestMessage.QUIT);
			break;
		case "HOST":
			this.sendToAllGuests(sh_client_HostMessage.CLOSE);
			this.state.guests = [];
			break;
		default:
		}
		this.setState({ state : "MENU"});
	}
	,update: function(event,source,target) {
		var message = null;
		var error = null;
		switch(this.state.role) {
		case "GUEST":
			this.state.host.send(sh_client_GuestMessage.PLAY(event,source,target));
			break;
		case "HOST":
			this.game.update(event,source,target);
			while(true) {
				message = this.game.messages.shift();
				if(!(message != null)) {
					break;
				}
				this.state.history.push(message);
				this.sendToAllGuests(sh_client_HostMessage.UPDATE(message));
			}
			while(true) {
				error = this.game.errors.shift();
				if(!(error != null)) {
					break;
				}
				console.log("sh/client/Client.hx:167:",error);
			}
			break;
		case "LOCAL":
			this.game.update(event,source,target);
			while(true) {
				message = this.game.messages.shift();
				if(!(message != null)) {
					break;
				}
				this.state.history.push(message);
			}
			while(true) {
				error = this.game.errors.shift();
				if(!(error != null)) {
					break;
				}
				console.log("sh/client/Client.hx:175:",error);
			}
			break;
		case "NONE":
			break;
		}
		this.setState({ });
	}
	,processGuestMessage: function(guestMessage,sender) {
		var _gthis = this;
		if(this.state.role != "HOST") {
			return;
		}
		switch(guestMessage._hx_index) {
		case 0:
			var _g = 0;
			var _g1 = this.state.guests;
			while(_g < _g1.length) {
				var guest = _g1[_g];
				++_g;
				if(guest.co != null && guest.co.peer == sender) {
					HxOverrides.remove(this.state.guests,guest);
					this.setState({ guests : this.state.guests},function() {
						var _gthis1 = _gthis;
						var _g = [];
						var _g1 = 0;
						var _g2 = _gthis.state.guests;
						while(_g1 < _g2.length) {
							var guest = _g2[_g1];
							++_g1;
							_g.push(guest.name);
						}
						_gthis1.sendToAllGuests(sh_client_HostMessage.LIST(_g));
					});
					break;
				}
			}
			break;
		case 1:
			var event = guestMessage.event;
			var source = guestMessage.source;
			var target = guestMessage.target;
			this.update(event,source,target);
			break;
		}
	}
	,processHostMessage: function(hostMessage) {
		if(this.state.role != "GUEST") {
			return;
		}
		switch(hostMessage._hx_index) {
		case 0:
			this.setState({ state : "ROOM"});
			break;
		case 1:
			this.setState({ state : "MENU", role : "NONE"});
			break;
		case 2:
			var id = hostMessage.id;
			this.setState({ playerId : id});
			this.start(this.state.guests.length,"GUEST");
			break;
		case 3:
			var names = hostMessage.names;
			var i = 0;
			var _g = [];
			var _g1 = 0;
			while(_g1 < names.length) {
				var name = names[_g1];
				++_g1;
				_g.push(new sh_client_Guest(name,null,i++));
			}
			this.setState({ guests : _g});
			break;
		case 4:
			var gameMessage = hostMessage.message;
			switch(gameMessage._hx_index) {
			case 0:
				var state = gameMessage.state;
				break;
			case 1:
				var event = gameMessage.event;
				var source = gameMessage.source;
				var target = gameMessage.target;
				this.game.update(event,source,target);
				break;
			case 2:
				var cards = gameMessage.cards;
				var firstPresident = gameMessage.firstPresident;
				var roles = gameMessage.roles;
				this.game.drawPile = cards;
				this.game.president = firstPresident;
				this.game.roles = roles;
				var _g = 0;
				var _g1 = this.game.roles.length;
				while(_g < _g1) {
					var i = _g++;
					this.game.players[i].role = this.game.roles[i];
				}
				break;
			case 3:
				var cards = gameMessage.cards;
				this.game.drawPile = cards;
				break;
			}
			var message = null;
			while(true) {
				message = this.game.messages.shift();
				if(!(message != null)) {
					break;
				}
				this.state.history.push(message);
			}
			break;
		case 5:
			var reason = hostMessage.reason;
			console.log("sh/client/Client.hx:207:",reason);
			this.setState({ state : "MENU", role : "NONE"});
			break;
		}
		this.setState({ });
	}
	,sendToAllGuests: function(message) {
		var _g = 0;
		var _g1 = this.state.guests;
		while(_g < _g1.length) {
			var guest = _g1[_g];
			++_g;
			if(guest.co != null) {
				guest.co.send(message);
			}
		}
	}
	,changeName: function(event) {
		this.setState({ name : event.target.value});
	}
	,renderTitle: function() {
		return React.createElement(react_ReactType.fromString("span"),{ },"Can you find and stop the... SECRET HITLER");
	}
	,renderCredits: function() {
		return React.createElement(react_ReactType.fromString("span"),{ },"https://www.secrethitler.com/ | https://turbetnans.github.io/");
	}
	,renderMenu: function() {
		var _gthis = this;
		var tmp = react_ReactType.fromString("div");
		var tmp1 = React.createElement(react_ReactType.fromString("div"),{ id : "background"});
		var tmp2 = react_ReactType.fromString("div");
		var tmp3 = this.renderTitle();
		var tmp4 = react_ReactType.fromString("div");
		var tmp5 = React.createElement(tmp2,{ className : "header"},tmp3,React.createElement(tmp4,{ id : "top"},React.createElement(react_ReactType.fromString("span"),{ },"Menu Principal")));
		var tmp2 = react_ReactType.fromString("div");
		var tmp3 = React.createElement(react_ReactType.fromString("span"),{ id : "id"},this.state.peer);
		var tmp4 = React.createElement(react_ReactType.fromString("br"),{ });
		var tmp6 = React.createElement(react_ReactType.fromString("input"),{ id : "name", type : "text", placeholder : "Entrez votre nom", onChange : $bind(this,this.changeName), value : this.state.name});
		var tmp7 = React.createElement(react_ReactType.fromString("i"),{ className : "bi bi-dice-6-fill", onClick : function(_) {
			_gthis.generateRandomName();
		}});
		var tmp8 = React.createElement(react_ReactType.fromString("br"),{ });
		var tmp9 = React.createElement(react_ReactType.fromString("button"),{ onClick : function(_) {
			_gthis.start(5,"LOCAL");
		}},"Créer partie locale");
		var tmp10 = React.createElement(react_ReactType.fromString("br"),{ });
		var tmp11 = React.createElement(react_ReactType.fromString("button"),{ onClick : function(_) {
			_gthis.create();
		}},"Créer partie en ligne");
		var tmp12 = React.createElement(react_ReactType.fromString("br"),{ });
		var tmp13 = React.createElement(react_ReactType.fromString("button"),{ onClick : function(_) {
			_gthis.join();
		}},"Rejoindre partie en ligne");
		var tmp14 = React.createElement(react_ReactType.fromString("br"),{ });
		var tmp15 = React.createElement(react_ReactType.fromString("input"),{ id : "hostId", type : "text", placeholder : "Entrez l'ID de l'hote"});
		var tmp16 = React.createElement(tmp2,{ id : "menu"},tmp3,tmp4,tmp6,tmp7,tmp8,tmp9,tmp10,tmp11,tmp12,tmp13,tmp14,tmp15,React.createElement(react_ReactType.fromString("br"),{ }));
		var tmp2 = react_ReactType.fromString("div");
		var tmp3 = React.createElement(react_ReactType.fromString("div"),{ id : "bottom"},React.createElement(react_ReactType.fromString("span"),{ },"Menu Principal"));
		return React.createElement(tmp,{ id : "client"},tmp1,tmp5,tmp16,React.createElement(tmp2,{ className : "footer"},tmp3,this.renderCredits()));
	}
	,renderRoom: function() {
		var _gthis = this;
		var players = [];
		var _g = 0;
		var _g1 = this.state.guests.length;
		while(_g < _g1) {
			var i = _g++;
			players.push(React.createElement(react_ReactType.fromString("input"),{ key : "g" + i, type : "text", disabled : true, value : this.state.guests[i].name}));
		}
		var tmp = react_ReactType.fromString("div");
		var tmp1 = React.createElement(react_ReactType.fromString("div"),{ id : "background"});
		var tmp2 = react_ReactType.fromString("div");
		var tmp3 = this.renderTitle();
		var tmp4 = react_ReactType.fromString("div");
		var tmp5 = React.createElement(tmp2,{ className : "header"},tmp3,React.createElement(tmp4,{ id : "top"},React.createElement(react_ReactType.fromString("span"),{ },"Salon")));
		var tmp2 = react_ReactType.fromString("div");
		var tmp3 = React.createElement(react_ReactType.fromString("span"),{ id : "id"},this.state.peer);
		var tmp4 = React.createElement(react_ReactType.fromString("br"),{ });
		var tmp6 = React.createElement(react_ReactType.fromString("br"),{ });
		var tmp7 = this.state.role != "HOST";
		var tmp8 = React.createElement(react_ReactType.fromString("button"),{ onClick : function(_) {
			_gthis.start(_gthis.state.guests.length,"HOST");
		}, hidden : tmp7},"Lancer partie en ligne");
		var tmp7 = React.createElement(react_ReactType.fromString("br"),{ });
		var tmp9 = React.createElement(react_ReactType.fromString("button"),{ onClick : function(_) {
			_gthis.back();
		}},"Retour");
		var tmp10 = React.createElement(tmp2,{ id : "room"},tmp3,tmp4,players,tmp6,tmp8,tmp7,tmp9,React.createElement(react_ReactType.fromString("br"),{ }));
		var tmp2 = react_ReactType.fromString("div");
		var tmp3 = React.createElement(react_ReactType.fromString("div"),{ id : "bottom"},React.createElement(react_ReactType.fromString("span"),{ },"Salon"));
		return React.createElement(tmp,{ id : "client"},tmp1,tmp5,tmp10,React.createElement(tmp2,{ className : "footer"},tmp3,this.renderCredits()));
	}
	,renderGame: function() {
		var tmp = react_ReactType.fromString("div");
		var tmp1 = React.createElement(react_ReactType.fromString("div"),{ id : "background"});
		var tmp2 = react_ReactType.fromString("div");
		var tmp3 = this.renderTitle();
		var tmp4 = React.createElement(react_ReactType.fromComp(sh_client_components_TopBoard),{ game : this.game});
		var tmp5 = React.createElement(react_ReactType.fromComp(sh_client_components_LiberalBoard),{ game : this.game});
		var tmp6 = React.createElement(react_ReactType.fromComp(sh_client_components_FascistBoard),{ game : this.game});
		var tmp7 = this.game;
		var tmp8 = this.state.role == "LOCAL";
		var tmp9 = React.createElement(react_ReactType.fromComp(sh_client_components_PlayerList),{ game : tmp7, clickHandeler : $bind(this,this.update), local : tmp8, id : this.state.playerId});
		var tmp7 = this.game;
		var tmp8 = this.state.role == "LOCAL";
		var tmp10 = React.createElement(tmp2,{ className : "header"},tmp3,tmp4,tmp5,tmp6,tmp9,React.createElement(react_ReactType.fromComp(sh_client_components_Buttons),{ game : tmp7, clickHandeler : $bind(this,this.update), local : tmp8, id : this.state.playerId}));
		var tmp2 = React.createElement(react_ReactType.fromComp(sh_client_components_Log),{ game : this.game, history : this.state.history});
		var tmp3 = react_ReactType.fromString("div");
		var tmp4 = React.createElement(react_ReactType.fromComp(sh_client_components_BottomBoard),{ game : this.game});
		return React.createElement(tmp,{ id : "client"},tmp1,tmp10,tmp2,React.createElement(tmp3,{ className : "footer"},tmp4,this.renderCredits()));
	}
	,render: function() {
		switch(this.state.state) {
		case "GAME":
			return this.renderGame();
		case "LOADING":
			return React.createElement(react_ReactType.fromString("div"),{ id : "client"},"chargement");
		case "MENU":
			return this.renderMenu();
		case "ROOM":
			return this.renderRoom();
		default:
			return React.createElement(react_ReactType.fromString("span"),{ },"ERROR");
		}
	}
});
var sh_client_GuestMessage = $hxEnums["sh.client.GuestMessage"] = { __ename__:true,__constructs__:null
	,QUIT: {_hx_name:"QUIT",_hx_index:0,__enum__:"sh.client.GuestMessage",toString:$estr}
	,PLAY: ($_=function(event,source,target) { return {_hx_index:1,event:event,source:source,target:target,__enum__:"sh.client.GuestMessage",toString:$estr}; },$_._hx_name="PLAY",$_.__params__ = ["event","source","target"],$_)
};
sh_client_GuestMessage.__constructs__ = [sh_client_GuestMessage.QUIT,sh_client_GuestMessage.PLAY];
var sh_client_HostMessage = $hxEnums["sh.client.HostMessage"] = { __ename__:true,__constructs__:null
	,ACCEPT: {_hx_name:"ACCEPT",_hx_index:0,__enum__:"sh.client.HostMessage",toString:$estr}
	,CLOSE: {_hx_name:"CLOSE",_hx_index:1,__enum__:"sh.client.HostMessage",toString:$estr}
	,LAUNCH: ($_=function(id) { return {_hx_index:2,id:id,__enum__:"sh.client.HostMessage",toString:$estr}; },$_._hx_name="LAUNCH",$_.__params__ = ["id"],$_)
	,LIST: ($_=function(names) { return {_hx_index:3,names:names,__enum__:"sh.client.HostMessage",toString:$estr}; },$_._hx_name="LIST",$_.__params__ = ["names"],$_)
	,UPDATE: ($_=function(message) { return {_hx_index:4,message:message,__enum__:"sh.client.HostMessage",toString:$estr}; },$_._hx_name="UPDATE",$_.__params__ = ["message"],$_)
	,REJECT: ($_=function(reason) { return {_hx_index:5,reason:reason,__enum__:"sh.client.HostMessage",toString:$estr}; },$_._hx_name="REJECT",$_.__params__ = ["reason"],$_)
};
sh_client_HostMessage.__constructs__ = [sh_client_HostMessage.ACCEPT,sh_client_HostMessage.CLOSE,sh_client_HostMessage.LAUNCH,sh_client_HostMessage.LIST,sh_client_HostMessage.UPDATE,sh_client_HostMessage.REJECT];
var sh_client_Reason = $hxEnums["sh.client.Reason"] = { __ename__:true,__constructs__:null
	,NOT_HOSTING: {_hx_name:"NOT_HOSTING",_hx_index:0,__enum__:"sh.client.Reason",toString:$estr}
	,SELF_CONNECT: {_hx_name:"SELF_CONNECT",_hx_index:1,__enum__:"sh.client.Reason",toString:$estr}
	,ALREADY_CONNECTED: {_hx_name:"ALREADY_CONNECTED",_hx_index:2,__enum__:"sh.client.Reason",toString:$estr}
	,ROOM_FULL: {_hx_name:"ROOM_FULL",_hx_index:3,__enum__:"sh.client.Reason",toString:$estr}
	,GAME_LAUNCHED: {_hx_name:"GAME_LAUNCHED",_hx_index:4,__enum__:"sh.client.Reason",toString:$estr}
};
sh_client_Reason.__constructs__ = [sh_client_Reason.NOT_HOSTING,sh_client_Reason.SELF_CONNECT,sh_client_Reason.ALREADY_CONNECTED,sh_client_Reason.ROOM_FULL,sh_client_Reason.GAME_LAUNCHED];
var sh_client_Guest = function(name,co,id) {
	this.co = co;
	this.name = name != null ? name : "MissingNo.";
	this.id = id;
};
sh_client_Guest.__name__ = true;
var sh_client_components_BottomBoard = $hx_exports["sh"]["client"]["components"]["BottomBoard"] = function(props) {
	React.Component.call(this,props);
};
sh_client_components_BottomBoard.__name__ = true;
sh_client_components_BottomBoard.__super__ = React.Component;
sh_client_components_BottomBoard.prototype = $extend(React.Component.prototype,{
	render: function() {
		var game = this.props.game;
		var content;
		switch(game.getState()) {
		case "CHANCELOR_NOMINATION":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le président va nommer son chancelier.");
			break;
		case "CHANCELOR_SESSION":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le chancelier choisi le décret à adpter.");
			break;
		case "EXECUTION":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le président va choisir le joueur a éxécuter.");
			break;
		case "EXECUTION_RESULT":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le président a choisi le joueur a éxécuter.");
			break;
		case "FASCISTS_REVEAL":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Les fascistes se découvrent.");
			break;
		case "FASCIST_VICTORY":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Victoire des fascistes !");
			break;
		case "GAME_START":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"La partie commence !");
			break;
		case "GOVERNMENT_VOTE":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Les joueurs votent pour le gouvernement proposé.");
			break;
		case "LIBERAL_VICTORY":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Victoire des libéraux !");
			break;
		case "LOYALTY_INVESTIGATION":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le président va enquêter sur un joueur.");
			break;
		case "LOYALTY_INVESTIGATION_RESULT":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le président reçoit le résultat de l'enquête.");
			break;
		case "POLICY_PEEK":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le présdent va espionner les trois prochains décrets.");
			break;
		case "POLICY_PEEK_RESULT":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le présdent a espionné les trois prochains décrets.");
			break;
		case "POLICY_REVEAL":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le décret choisi est révélé.");
			break;
		case "PRESIDENT_SESSION":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le président choisi un décret à défausser.");
			break;
		case "SPECIAL_ELECTION":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le président va choisir son successeur.");
			break;
		case "SPECIAL_ELECTION_RESULT":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Le président a choisi son successeur.");
			break;
		case "VETO_PROPOSITION":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Lechancelier demande le véto.");
			break;
		case "VOTE_COUNTING":
			content = React.createElement(react_ReactType.fromString("span"),{ key : "state", className : "state"},"Les votes sont comptés.");
			break;
		}
		return React.createElement(react_ReactType.fromString("div"),{ id : "bottom"},React.createElement(react_ReactType.fromString("span"),{ },content));
	}
});
var sh_client_components_Buttons = $hx_exports["sh"]["client"]["components"]["Buttons"] = function(props) {
	React.Component.call(this,props);
};
sh_client_components_Buttons.__name__ = true;
sh_client_components_Buttons.__super__ = React.Component;
sh_client_components_Buttons.prototype = $extend(React.Component.prototype,{
	formatPolicy: function(policy) {
		switch(policy) {
		case "FASCIST_POLICY":
			return "Décret fasciste";
		case "LIBERAL_POLICY":
			return "Décret liberal";
		}
	}
	,render: function() {
		var _gthis = this;
		var game = this.props.game;
		var showStartButton = game.isInState("GAME_START") && (this.props.id == game.president || this.props.local);
		var showNextButton = (this.props.id == game.president || this.props.local) && (game.isInState("FASCISTS_REVEAL") || game.isInState("VOTE_COUNTING") && (game.voteResult == "JA" || game.electionTracker < 2) || game.isInState("POLICY_REVEAL") || game.isInState("POLICY_PEEK_RESULT") || game.isInState("LOYALTY_INVESTIGATION_RESULT") || game.isInState("SPECIAL_ELECTION_RESULT") || game.isInState("POLICY_PEEK_RESULT") || game.isInState("EXECUTION_RESULT"));
		var showRevealButton;
		if(game.isInState("GOVERNMENT_VOTE")) {
			var showRevealButton1 = Lambda.count(game.votes);
			var _g = [];
			var _g1 = 0;
			var _g2 = game.players;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(v.status == "ALIVE") {
					_g.push(v);
				}
			}
			showRevealButton = showRevealButton1 == _g.length;
		} else {
			showRevealButton = false;
		}
		var showRevealButton1 = showRevealButton && (this.props.id == game.president || this.props.local);
		var showChaosButton = (game.isInState("VOTE_COUNTING") && game.voteResult == "NEIN" && game.electionTracker == 2 || game.isInState("VETO_PROPOSITION") && game.electionTracker == 2) && (this.props.id == game.president || this.props.local);
		var showVoteButtons = game.isInState("GOVERNMENT_VOTE") && !game.votes.h.hasOwnProperty(this.props.id) && !this.props.local;
		var showDiscardButton = game.isInState("PRESIDENT_SESSION") && (this.props.id == game.president || this.props.local);
		var showSelectButton = game.isInState("CHANCELOR_SESSION") && (this.props.id == game.chancelor || this.props.local);
		var showVetoButton = game.isInState("CHANCELOR_SESSION") && (this.props.id == game.chancelor || this.props.local) && game.fascistPoliciesPassed == 5 && !game.vetoUsed;
		var showAcceptButton = game.isInState("VETO_PROPOSITION") && game.electionTracker < 2 && (this.props.id == game.president || this.props.local);
		var showDeclineButton = game.isInState("VETO_PROPOSITION") && (this.props.id == game.president || this.props.local);
		var showPeekButton = game.isInState("POLICY_PEEK") && (this.props.id == game.president || this.props.local);
		var showPeekResult = game.isInState("POLICY_PEEK_RESULT") && (this.props.id == game.president || this.props.local);
		if(!showDiscardButton && !showSelectButton && !showSelectButton && !showPeekResult && !showStartButton && !showRevealButton1 && !showChaosButton && !showNextButton && !showVoteButtons && !showVetoButton && !showAcceptButton && !showDeclineButton && !showPeekButton) {
			return null;
		}
		var tmp = react_ReactType.fromString("div");
		var tmp1 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showDiscardButton, onClick : function() {
			return _gthis.props.clickHandeler("DISCARD",game.president,0);
		}},this.formatPolicy(game.proposedPolicies[0]));
		var tmp2 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showDiscardButton, onClick : function() {
			return _gthis.props.clickHandeler("DISCARD",game.president,1);
		}},this.formatPolicy(game.proposedPolicies[1]));
		var tmp3 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showDiscardButton, onClick : function() {
			return _gthis.props.clickHandeler("DISCARD",game.president,2);
		}},this.formatPolicy(game.proposedPolicies[2]));
		var tmp4 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showSelectButton, onClick : function() {
			return _gthis.props.clickHandeler("SELECT",game.chancelor,0);
		}},this.formatPolicy(game.proposedPolicies[0]));
		var tmp5 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showSelectButton, onClick : function() {
			return _gthis.props.clickHandeler("SELECT",game.chancelor,1);
		}},this.formatPolicy(game.proposedPolicies[1]));
		var tmp6 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showPeekResult, disabled : true},this.formatPolicy(game.drawPile[0]));
		var tmp7 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showPeekResult, disabled : true},this.formatPolicy(game.drawPile[1]));
		var tmp8 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showPeekResult, disabled : true},this.formatPolicy(game.drawPile[2]));
		var tmp9 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showStartButton, onClick : function() {
			return _gthis.props.clickHandeler("START",0);
		}},"Commencer");
		var tmp10 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showRevealButton1, onClick : function() {
			return _gthis.props.clickHandeler("REVEAL",0);
		}},"Révéler");
		var tmp11 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showChaosButton, onClick : function() {
			return _gthis.props.clickHandeler("CHAOS",0);
		}},"CHAOS");
		var tmp12 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showNextButton, onClick : function() {
			return _gthis.props.clickHandeler("NEXT",0);
		}},"Suivant");
		var tmp13 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showVoteButtons, onClick : function() {
			return _gthis.props.clickHandeler("JA",_gthis.props.id);
		}},"JA !");
		var tmp14 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showVoteButtons, onClick : function() {
			return _gthis.props.clickHandeler("NEIN",_gthis.props.id);
		}},"NEIN !");
		var tmp15 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showVetoButton, onClick : function() {
			return _gthis.props.clickHandeler("VETO",game.chancelor);
		}},"Véto");
		var tmp16 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showAcceptButton, onClick : function() {
			return _gthis.props.clickHandeler("ACCEPT",game.president);
		}},"Accepter");
		var tmp17 = React.createElement(react_ReactType.fromString("button"),{ hidden : !showDeclineButton, onClick : function() {
			return _gthis.props.clickHandeler("DECLINE",game.president);
		}},"Refuser");
		var tmp18 = react_ReactType.fromString("button");
		var tmp19 = React.createElement(react_ReactType.fromString("i"),{ className : "bi bi-binoculars-fill"});
		return React.createElement(tmp,{ id : "buttons"},tmp1,tmp2,tmp3,tmp4,tmp5,tmp6,tmp7,tmp8,tmp9,tmp10,tmp11,tmp12,tmp13,tmp14,tmp15,tmp16,tmp17,React.createElement(tmp18,{ hidden : !showPeekButton, onClick : function() {
			return _gthis.props.clickHandeler("PEEK",game.president);
		}},tmp19,"Espionner",React.createElement(react_ReactType.fromString("i"),{ className : "bi bi-binoculars-fill"})));
	}
});
var sh_client_components_FascistBoard = $hx_exports["sh"]["client"]["components"]["FascistBoard"] = function(props) {
	React.Component.call(this,props);
};
sh_client_components_FascistBoard.__name__ = true;
sh_client_components_FascistBoard.__super__ = React.Component;
sh_client_components_FascistBoard.prototype = $extend(React.Component.prototype,{
	format: function(power) {
		switch(power) {
		case "EXECUTION":
			return "Exécution";
		case "FASCIST_VICTORY":
			return "Victoire fasciste";
		case "LIBERAL_VICTORY":
			return "Victoire libérale";
		case "LOYALTY_INVESTIGATION":
			return "Enquête";
		case "NO_POWER":
			return "Aucun pouvoir";
		case "POLICY_PEEK":
			return "Espionnage";
		case "SPECIAL_ELECTION":
			return "Élection spéciale";
		}
	}
	,render: function() {
		var game = this.props.game;
		var policies = [];
		if(game == null || game.fsm.currentState == fsm__$FSM_State.NULL_ID) {
			return React.createElement(react_ReactType.fromString("div"),{ id : "fascist-board"},React.createElement(react_ReactType.fromString("br"),{ }));
		}
		var _g = 1;
		var _g1 = sh_core_Game.FASCIST_BOARDS[game.fascistBoard].length;
		while(_g < _g1) {
			var i = _g++;
			var tmp = react_ReactType.fromString("span");
			var tmp1 = i <= game.fascistPoliciesPassed ? "passed" : "";
			var tmp2 = this.format(sh_core_Game.FASCIST_BOARDS[game.fascistBoard][i]);
			policies.push(React.createElement(tmp,{ key : "fascistpolicy" + i, className : tmp1},"" + tmp2));
		}
		return React.createElement(react_ReactType.fromString("div"),{ id : "fascist-board", className : "board"},policies);
	}
});
var sh_client_components_LiberalBoard = $hx_exports["sh"]["client"]["components"]["LiberalBoard"] = function(props) {
	React.Component.call(this,props);
};
sh_client_components_LiberalBoard.__name__ = true;
sh_client_components_LiberalBoard.__super__ = React.Component;
sh_client_components_LiberalBoard.prototype = $extend(React.Component.prototype,{
	formatPower: function(power) {
		switch(power) {
		case "EXECUTION":
			return "Exécution";
		case "FASCIST_VICTORY":
			return "Victoire fasciste";
		case "LIBERAL_VICTORY":
			return "Victoire libérale";
		case "LOYALTY_INVESTIGATION":
			return "Enquête";
		case "NO_POWER":
			return "Aucun pouvoir";
		case "POLICY_PEEK":
			return "Espionnage";
		case "SPECIAL_ELECTION":
			return "Élection spéciale";
		}
	}
	,render: function() {
		var game = this.props.game;
		var policies = [];
		if(game == null || game.fsm.currentState == fsm__$FSM_State.NULL_ID) {
			return React.createElement(react_ReactType.fromString("div"),{ id : "liberal-board"},React.createElement(react_ReactType.fromString("br"),{ }));
		}
		var _g = 1;
		var _g1 = sh_core_Game.LIBERAL_BOARDS[game.liberalBoard].length;
		while(_g < _g1) {
			var i = _g++;
			var tmp = react_ReactType.fromString("span");
			var tmp1 = i <= game.liberalPoliciesPassed ? "passed" : "";
			var tmp2 = this.formatPower(sh_core_Game.LIBERAL_BOARDS[game.liberalBoard][i]);
			policies.push(React.createElement(tmp,{ key : "liberalpolicy" + i, className : tmp1},"" + tmp2));
		}
		return React.createElement(react_ReactType.fromString("div"),{ id : "liberal-board", className : "board"},policies);
	}
});
var sh_client_components_Log = $hx_exports["sh"]["client"]["components"]["Log"] = function(props) {
	this.size = 0;
	React.Component.call(this,props);
};
sh_client_components_Log.__name__ = true;
sh_client_components_Log.__super__ = React.Component;
sh_client_components_Log.prototype = $extend(React.Component.prototype,{
	formatPolicy: function(policy) {
		switch(policy) {
		case "FASCIST_POLICY":
			return "Fasciste";
		case "LIBERAL_POLICY":
			return "Liberal";
		}
	}
	,componentDidUpdate: function(prevProps,prevState) {
		window.document.getElementById("log").scrollTop = window.document.getElementById("log").scrollHeight;
	}
	,render: function() {
		var game = this.props.game;
		var logs = [];
		var history = this.props.history;
		var _g = 0;
		var _g1 = history.length;
		while(_g < _g1) {
			var i = _g++;
			var _g2 = history[i];
			var className;
			if(_g2._hx_index == 0) {
				var _g3 = _g2.state;
				className = true;
			} else {
				className = false;
			}
			var className1 = (className ? "state" : "event") + " " + (i > this.size ? "new" : "");
			var _g4 = history[i];
			switch(_g4._hx_index) {
			case 0:
				var _g5 = _g4.state;
				switch(_g5) {
				case "CHANCELOR_NOMINATION":
					logs.push(React.createElement(react_ReactType.fromString("hr"),{ key : "l" + i}));
					break;
				case "POLICY_REVEAL":
					var tmp = react_ReactType.fromString("p");
					var tmp1 = "Le décret adopté est : " + this.formatPolicy(util_ArrayExt.last(game.playedPolicies));
					logs.push(React.createElement(tmp,{ key : "l" + i, className : className1},tmp1 + "."));
					break;
				default:
					var state = _g5;
				}
				break;
			case 1:
				var _g6 = _g4.source;
				var _g7 = _g4.target;
				switch(_g4.event) {
				case "ACCEPT":
					var president = _g6;
					var tmp2 = "Le président " + game.players[president].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp2 + " a accepté le véto."));
					break;
				case "CHAOS":
					var tmp3 = react_ReactType.fromString("p");
					var tmp4 = "Le pays sombre dans le chaos et adopte le décret : " + this.formatPolicy(util_ArrayExt.last(game.playedPolicies));
					logs.push(React.createElement(tmp3,{ key : "l" + i, className : className1},tmp4 + "."));
					break;
				case "CHOOSE":
					var president1 = _g6;
					var target = _g7;
					var tmp5 = "Le président " + game.players[president1].name + " a choisi " + game.players[target].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp5 + " comme successeur."));
					break;
				case "DECLINE":
					var president2 = _g6;
					var tmp6 = "Le président " + game.players[president2].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp6 + " a refusé le véto."));
					break;
				case "DISCARD":
					var president3 = _g6;
					var policy = _g7;
					var tmp7 = "Le president " + game.players[president3].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp7 + " a défaussé un décret."));
					break;
				case "EXECUTE":
					var president4 = _g6;
					var target1 = _g7;
					var tmp8 = "Le président " + game.players[president4].name + " a exécuté " + game.players[target1].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp8 + "."));
					break;
				case "INVESTIGATE":
					var president5 = _g6;
					var target2 = _g7;
					var tmp9 = "Le président " + game.players[president5].name + " a enquété " + game.players[target2].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp9 + "."));
					break;
				case "JA":case "NEIN":
					var player = _g6;
					var tmp10 = "" + game.players[player].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp10 + " a voté."));
					break;
				case "NEXT":
					break;
				case "NOMINATE":
					var president6 = _g6;
					var chancelor = _g7;
					var tmp11 = "Le president " + game.players[president6].name + " a nommé " + game.players[chancelor].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp11 + " comme chancelier."));
					break;
				case "PEEK":
					var president7 = _g6;
					var tmp12 = "Le président " + game.players[president7].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp12 + " a espionné les trois prochains décrets."));
					break;
				case "REVEAL":
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},"Les votes sont révélés."));
					break;
				case "SELECT":
					var chancelor1 = _g6;
					var policy1 = _g7;
					var tmp13 = "Le chancelier " + game.players[chancelor1].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp13 + " a choissi un décret."));
					break;
				case "START":
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},"La partie commence !"));
					break;
				case "VETO":
					var chancelor2 = _g6;
					var tmp14 = "Le chancelier " + game.players[chancelor2].name;
					logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},tmp14 + " a proposé un véto."));
					break;
				}
				break;
			case 2:
				var _g8 = _g4.cards;
				var _g9 = _g4.firstPresident;
				var _g10 = _g4.roles;
				logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},"La partie est initialisée."));
				break;
			case 3:
				var _g11 = _g4.cards;
				logs.push(React.createElement(react_ReactType.fromString("p"),{ key : "l" + i, className : className1},"La pioche est re-mélangée."));
				break;
			}
		}
		this.size = history.length - 1;
		return React.createElement(react_ReactType.fromString("div"),{ id : "log"},logs);
	}
});
var sh_client_components_Player = $hx_exports["sh"]["client"]["components"]["Player"] = function(props) {
	React.Component.call(this,props);
};
sh_client_components_Player.__name__ = true;
sh_client_components_Player.__super__ = React.Component;
sh_client_components_Player.prototype = $extend(React.Component.prototype,{
	formatRole: function(role) {
		switch(role) {
		case "FASCIST":
			return "Fasciste";
		case "HITLER":
			return "Hitler";
		case "LIBERAL":
			return "Liberal";
		case "NONE":
			return "";
		}
	}
	,render: function() {
		var _gthis = this;
		var id = this.props.id;
		var game = this.props.game;
		var className = "";
		if(game.players[id].status == "DEAD") {
			className = "dead";
		} else if(game.votes.h[id] == "JA" && game.isInState("VOTE_COUNTING")) {
			className = "ja";
		} else if(game.votes.h[id] == "NEIN" && game.isInState("VOTE_COUNTING")) {
			className = "nein";
		} else if(game.isInState("FASCISTS_REVEAL") && this.props.local) {
			if(game.players[id].role == "HITLER") {
				className = "hitler";
			} else if(game.players[id].role == "FASCIST") {
				className = "fascist";
			}
		} else if(game.isInState("FASCISTS_REVEAL") && game.players[this.props.localId].role == "FASCIST") {
			if(game.players[id].role == "HITLER") {
				className = "hitler";
			} else if(game.players[id].role == "FASCIST") {
				className = "fascist";
			}
		} else if(game.isInState("FASCISTS_REVEAL") && game.players[this.props.localId].role == "HITLER" && game.players.length < 7) {
			if(game.players[id].role == "HITLER") {
				className = "hitler";
			} else if(game.players[id].role == "FASCIST") {
				className = "fascist";
			}
		} else if(game.isInState("LOYALTY_INVESTIGATION_RESULT") && this.props.localId == game.president && id == game.investigatedPlayer) {
			if(game.players[id].role == "HITLER" || game.players[id].role == "FASCIST") {
				className = "fascist";
			} else {
				className = "liberal";
			}
		} else if(game.isInState("LOYALTY_INVESTIGATION_RESULT") && this.props.local && id == game.investigatedPlayer) {
			if(game.players[id].role == "HITLER" || game.players[id].role == "FASCIST") {
				className = "fascist";
			} else {
				className = "liberal";
			}
		} else if(id == game.president) {
			className = "president";
		} else if(id == game.chancelor) {
			className = "chancelor";
		}
		var content = null;
		if(game.fsm.currentState == fsm__$FSM_State.NULL_ID) {
			content = null;
		} else if(game.players[id].status == "DEAD") {
			content = React.createElement(react_ReactType.fromString("div"),{ },"Mort");
		} else if(game.isInState("CHANCELOR_NOMINATION") && id != game.president && game.checkEligibility(id) && (this.props.localId == game.president || this.props.local)) {
			content = React.createElement(react_ReactType.fromString("div"),{ },React.createElement(react_ReactType.fromString("button"),{ onClick : function() {
				return _gthis.props.clickHandeler("NOMINATE",game.president,id);
			}},"Nommer"));
		} else if(game.isInState("GOVERNMENT_VOTE") && !game.votes.h.hasOwnProperty(id) && this.props.local) {
			var content1 = react_ReactType.fromString("div");
			var content2 = React.createElement(react_ReactType.fromString("button"),{ className : "half", onClick : function() {
				return _gthis.props.clickHandeler("JA",id);
			}},"Ja !");
			content = React.createElement(content1,{ },content2,React.createElement(react_ReactType.fromString("button"),{ className : "half", onClick : function() {
				return _gthis.props.clickHandeler("NEIN",id);
			}},"Nein !"));
		} else if(game.isInState("GOVERNMENT_VOTE") && game.votes.h.hasOwnProperty(id)) {
			content = React.createElement(react_ReactType.fromString("div"),{ },React.createElement(react_ReactType.fromString("span"),{ },"voted"));
		} else if(game.isInState("VOTE_COUNTING")) {
			var content1 = game.votes.h[id];
			content = React.createElement(react_ReactType.fromString("div"),{ },content1);
		} else if(game.isInState("LOYALTY_INVESTIGATION") && id != game.president && (this.props.localId == game.president || this.props.local)) {
			content = React.createElement(react_ReactType.fromString("div"),{ },React.createElement(react_ReactType.fromString("button"),{ onClick : function() {
				return _gthis.props.clickHandeler("INVESTIGATE",game.president,id);
			}},"Enquêter"));
		} else if(game.isInState("SPECIAL_ELECTION") && id != game.president && (this.props.localId == game.president || this.props.local)) {
			content = React.createElement(react_ReactType.fromString("div"),{ },React.createElement(react_ReactType.fromString("button"),{ onClick : function() {
				return _gthis.props.clickHandeler("CHOOSE",game.president,id);
			}},"Choisir"));
		} else if(game.isInState("EXECUTION") && id != game.president && (this.props.localId == game.president || this.props.local)) {
			content = React.createElement(react_ReactType.fromString("div"),{ },React.createElement(react_ReactType.fromString("button"),{ onClick : function() {
				return _gthis.props.clickHandeler("EXECUTE",game.president,id);
			}},"Exécuter"));
		}
		var role = null;
		if(this.props.local || id == this.props.localId) {
			var role1 = react_ReactType.fromString("div");
			var role2 = this.formatRole(game.players[id].role);
			role = React.createElement(role1,{ },"" + role2);
		}
		var tmp = react_ReactType.fromString("div");
		var tmp1 = { key : "player" + id, className : "player " + className};
		var tmp2 = react_ReactType.fromString("div");
		var tmp3 = !this.props.local && id == this.props.localId;
		var tmp4 = React.createElement(react_ReactType.fromString("input"),{ type : "checkbox", hidden : tmp3});
		var tmp3 = React.createElement(react_ReactType.fromString("span"),{ },"" + game.players[id].name);
		var tmp5 = !this.props.local && id == this.props.localId;
		var tmp6 = React.createElement(tmp2,{ className : "title"},tmp4,tmp3,React.createElement(react_ReactType.fromString("input"),{ type : "checkbox", hidden : tmp5}));
		var tmp2 = React.createElement(react_ReactType.fromString("div"),{ },role);
		var tmp3 = React.createElement(react_ReactType.fromString("div"),{ },content);
		var tmp4 = id == game.president ? "President" : id == game.chancelor ? "Chancelier" : "";
		return React.createElement(tmp,tmp1,tmp6,tmp2,tmp3,React.createElement(react_ReactType.fromString("div"),{ },tmp4));
	}
});
var sh_client_components_PlayerList = $hx_exports["sh"]["client"]["components"]["PlayerList"] = function(props) {
	React.Component.call(this,props);
};
sh_client_components_PlayerList.__name__ = true;
sh_client_components_PlayerList.__super__ = React.Component;
sh_client_components_PlayerList.prototype = $extend(React.Component.prototype,{
	render: function() {
		var game = this.props.game;
		var players = [];
		var _g = 0;
		var _g1 = game.players.length;
		while(_g < _g1) {
			var id = _g++;
			if(id == Math.round(game.players.length / 2) && game.players.length > 5) {
				players.push(React.createElement(react_ReactType.fromString("br"),{ key : id}));
			}
			players.push(React.createElement(react_ReactType.fromComp(sh_client_components_Player),{ key : "player" + id, game : game, id : id, clickHandeler : this.props.clickHandeler, local : this.props.local, localId : this.props.id}));
		}
		return React.createElement(react_ReactType.fromString("div"),{ className : "playerList"},players);
	}
});
var sh_client_components_TopBoard = $hx_exports["sh"]["client"]["components"]["TopBoard"] = function(props) {
	React.Component.call(this,props);
};
sh_client_components_TopBoard.__name__ = true;
sh_client_components_TopBoard.__super__ = React.Component;
sh_client_components_TopBoard.prototype = $extend(React.Component.prototype,{
	render: function() {
		var game = this.props.game;
		if(game == null) {
			return React.createElement(react_ReactType.fromString("div"),{ id : "top"},React.createElement(react_ReactType.fromString("br"),{ }));
		} else {
			var tmp = react_ReactType.fromString("div");
			var tmp1 = "Chaos : " + game.electionTracker;
			var tmp2 = React.createElement(react_ReactType.fromString("span"),{ },tmp1 + "/3");
			var tmp1 = React.createElement(react_ReactType.fromString("span"),{ }," | ");
			var tmp3 = "Pioche : " + game.drawPile.length;
			var tmp4 = React.createElement(react_ReactType.fromString("span"),{ },tmp3 + "/17");
			var tmp3 = React.createElement(react_ReactType.fromString("span"),{ }," | ");
			var tmp5 = "Défausse : " + game.discardPile.length;
			return React.createElement(tmp,{ id : "top"},tmp2,tmp1,tmp4,tmp3,React.createElement(react_ReactType.fromString("span"),{ },tmp5 + "/17"));
		}
	}
});
var sh_core_Game = $hx_exports["sh"]["core"]["Game"] = function() {
	this.fsm = null;
	this.errors = [];
	this.messages = [];
	this.investigatedPlayer = sh_core_PlayerId.NONE;
	this.nextPower = null;
	this.vetoUsed = false;
	this.liberalPoliciesPassed = 0;
	this.fascistPoliciesPassed = 0;
	this.proposedPolicies = [];
	this.playedPolicies = [];
	this.discardPile = [];
	this.drawPile = [];
	this.nbLiberals = 0;
	this.nbFascists = 0;
	this.roles = [];
	this.previousPresident = sh_core_PlayerId.NONE;
	this.presidentForced = false;
	this.lastChancelor = sh_core_PlayerId.NONE;
	this.lastPresident = sh_core_PlayerId.NONE;
	this.chancelor = sh_core_PlayerId.NONE;
	this.president = sh_core_PlayerId.NONE;
	this.players = [];
	this.voteResult = null;
	this.votes = new haxe_ds_IntMap();
	this.electionTracker = 0;
	this.liberalBoard = 0;
	this.fascistBoard = 0;
	this.fsm = new fsm_FSM();
};
sh_core_Game.__name__ = true;
sh_core_Game.create = function(nbPlayers,names) {
	if(nbPlayers < 5 || nbPlayers > 10) {
		return null;
	}
	var game = new sh_core_Game();
	game.init(nbPlayers,names);
	return game;
};
sh_core_Game.prototype = {
	init: function(nbPlayers,names) {
		var _gthis = this;
		var _g = 0;
		var _g1 = nbPlayers;
		while(_g < _g1) {
			var i = _g++;
			this.players.push(new sh_core_Player(i,names[i]));
		}
		var gameStart = this.fsm.addState("GAME_START",function() {
			_gthis.onGameStart();
		});
		var fascistsReveal = this.fsm.addState("FASCISTS_REVEAL");
		var chancelorNomination = this.fsm.addState("CHANCELOR_NOMINATION",function() {
			_gthis.chancelor = null;
		});
		var governmentVote = this.fsm.addState("GOVERNMENT_VOTE",function() {
			_gthis.votes.h = { };
		});
		var voteCounting = this.fsm.addState("VOTE_COUNTING",function() {
			_gthis.onVoteCounting();
		});
		var presidentSession = this.fsm.addState("PRESIDENT_SESSION",function() {
			_gthis.onPresidentSession();
		});
		var chancelorSession = this.fsm.addState("CHANCELOR_SESSION");
		var vetoProposition = this.fsm.addState("VETO_PROPOSITION");
		var policyReveal = this.fsm.addState("POLICY_REVEAL",function() {
			_gthis.onPolicyReveal();
		});
		var loyaltyInvestigation = this.fsm.addState("LOYALTY_INVESTIGATION");
		var loyaltyInvestigationResult = this.fsm.addState("LOYALTY_INVESTIGATION_RESULT");
		var specialElection = this.fsm.addState("SPECIAL_ELECTION");
		var specialElectionResult = this.fsm.addState("SPECIAL_ELECTION_RESULT");
		var policyPeek = this.fsm.addState("POLICY_PEEK");
		var policyPeekResult = this.fsm.addState("POLICY_PEEK_RESULT");
		var execution = this.fsm.addState("EXECUTION");
		var executionResult = this.fsm.addState("EXECUTION_RESULT");
		var fascistVictory = this.fsm.addState("FASCIST_VICTORY");
		var liberalVictory = this.fsm.addState("LIBERAL_VICTORY");
		this.fsm.setInitial(gameStart);
		this.fsm.setFinal(fascistVictory);
		this.fsm.setFinal(liberalVictory);
		this.fsm.addTransition(gameStart,fascistsReveal,"START");
		this.fsm.addTransition(fascistsReveal,chancelorNomination,"NEXT");
		this.fsm.addTransition(chancelorNomination,governmentVote,"NOMINATE",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.president && _gthis.checkEligibility(args[1])) {
				return _gthis.players[args[1]].status == "ALIVE";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.onNominate(args[1]);
		});
		this.fsm.addTransition(chancelorNomination,chancelorNomination,"NOMINATE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return !_gthis.checkEligibility(args[1]);
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_ELIGIBLE);
		});
		this.fsm.addTransition(chancelorNomination,chancelorNomination,"NOMINATE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] == _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_PRESIDENT);
		});
		this.fsm.addTransition(chancelorNomination,chancelorNomination,"NOMINATE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return _gthis.players[args[1]].status == "DEAD";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_DEAD);
		});
		this.fsm.addTransition(governmentVote,governmentVote,"JA",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(!_gthis.votes.h.hasOwnProperty(args[0])) {
				return _gthis.players[args[0]].status == "ALIVE";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.onVote(args[0],"JA");
		});
		this.fsm.addTransition(governmentVote,governmentVote,"JA",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return _gthis.votes.h.hasOwnProperty(args[0]);
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.HAS_VOTED);
		});
		this.fsm.addTransition(governmentVote,governmentVote,"JA",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return _gthis.players[args[0]].status == "DEAD";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_DEAD);
		});
		this.fsm.addTransition(governmentVote,governmentVote,"NEIN",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(!_gthis.votes.h.hasOwnProperty(args[0])) {
				return _gthis.players[args[0]].status == "ALIVE";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.onVote(args[0],"NEIN");
		});
		this.fsm.addTransition(governmentVote,governmentVote,"NEIN",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return _gthis.votes.h.hasOwnProperty(args[0]);
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.HAS_VOTED);
		});
		this.fsm.addTransition(governmentVote,governmentVote,"NEIN",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return _gthis.players[args[0]].status == "DEAD";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_DEAD);
		});
		this.fsm.addTransition(governmentVote,voteCounting,"REVEAL",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			var tmp = Lambda.count(_gthis.votes);
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.players;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(v.status == "ALIVE") {
					_g.push(v);
				}
			}
			return tmp == _g.length;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onVoteEnded();
		});
		this.fsm.addTransition(governmentVote,governmentVote,"REVEAL",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			var tmp = Lambda.count(_gthis.votes);
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.players;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(v.status == "ALIVE") {
					_g.push(v);
				}
			}
			return tmp < _g.length;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.HAS_NOT_VOTED);
		});
		this.fsm.addTransition(voteCounting,fascistVictory,"CHAOS",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			if(_gthis.voteResult == "NEIN" && _gthis.electionTracker == 2 && _gthis.fascistPoliciesPassed == 5) {
				return util_ArrayExt.last(_gthis.drawPile) == "FASCIST_POLICY";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onChaos();
		});
		this.fsm.addTransition(voteCounting,liberalVictory,"CHAOS",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			if(_gthis.voteResult == "NEIN" && _gthis.electionTracker == 2 && _gthis.liberalPoliciesPassed == 4) {
				return util_ArrayExt.last(_gthis.drawPile) == "LIBERAL_POLICY";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onChaos();
		});
		this.fsm.addTransition(voteCounting,chancelorNomination,"CHAOS",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			if(_gthis.voteResult == "NEIN") {
				return _gthis.electionTracker == 2;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onChaos();
		});
		this.fsm.addTransition(voteCounting,voteCounting,"CHAOS",true,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			if(_gthis.voteResult != "JA") {
				return _gthis.electionTracker < 2;
			} else {
				return true;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_CHAOS);
		});
		this.fsm.addTransition(voteCounting,chancelorNomination,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			if(_gthis.voteResult == "NEIN") {
				return _gthis.electionTracker < 2;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onFailedVote();
		});
		this.fsm.addTransition(voteCounting,fascistVictory,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			if(_gthis.voteResult == "JA" && _gthis.players[_gthis.chancelor].role == "HITLER") {
				return _gthis.fascistPoliciesPassed >= 3;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onHitlerElected();
		});
		this.fsm.addTransition(voteCounting,presidentSession,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			if(_gthis.voteResult == "JA") {
				if(_gthis.players[_gthis.chancelor].role == "HITLER") {
					return _gthis.fascistPoliciesPassed < 3;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onSuccessfulVote();
		});
		this.fsm.addTransition(voteCounting,voteCounting,"NEXT",true,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			if(_gthis.voteResult == "NEIN") {
				return _gthis.electionTracker == 2;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_CHAOS);
		});
		this.fsm.addTransition(presidentSession,chancelorSession,"DISCARD",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.president && args[1] >= 0) {
				return args[1] < 3;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.onPolicyDiscarded(args[1]);
		});
		this.fsm.addTransition(presidentSession,presidentSession,"NEXT",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_PRESIDENT);
		});
		this.fsm.addTransition(chancelorSession,policyReveal,"SELECT",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.chancelor && args[1] >= 0) {
				return args[1] < 2;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.onPolicySelected(args[1]);
		});
		this.fsm.addTransition(chancelorSession,chancelorSession,"NEXT",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_CHANCELOR);
		});
		this.fsm.addTransition(chancelorSession,vetoProposition,"VETO",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.chancelor && _gthis.fascistPoliciesPassed == 5) {
				return !_gthis.vetoUsed;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onVetoProposed();
		});
		this.fsm.addTransition(chancelorSession,chancelorSession,"VETO",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_CHANCELOR);
		});
		this.fsm.addTransition(vetoProposition,fascistVictory,"CHAOS",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.president && _gthis.electionTracker == 2 && _gthis.fascistPoliciesPassed == 5) {
				return util_ArrayExt.last(_gthis.drawPile) == "FASCIST_POLICY";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onChaos();
		});
		this.fsm.addTransition(vetoProposition,liberalVictory,"CHAOS",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.president && _gthis.electionTracker == 2 && _gthis.liberalPoliciesPassed == 4) {
				return util_ArrayExt.last(_gthis.drawPile) == "LIBERAL_POLICY";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onChaos();
		});
		this.fsm.addTransition(vetoProposition,chancelorNomination,"CHAOS",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.president) {
				return _gthis.electionTracker == 2;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onChaos();
		});
		this.fsm.addTransition(vetoProposition,chancelorNomination,"ACCEPT",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.president) {
				return _gthis.electionTracker < 2;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onVetoAccepted();
		});
		this.fsm.addTransition(vetoProposition,chancelorSession,"DECLINE",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] == _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onVetoRejected();
		});
		this.fsm.addTransition(policyReveal,chancelorNomination,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.nextPower == "NO_POWER";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.nextPresident();
		});
		this.fsm.addTransition(policyReveal,loyaltyInvestigation,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.nextPower == "LOYALTY_INVESTIGATION";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onPolicyRevealed();
		});
		this.fsm.addTransition(loyaltyInvestigation,loyaltyInvestigationResult,"INVESTIGATE",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.president && args[1] != _gthis.president) {
				return _gthis.players[args[1]].status == "ALIVE";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.onInvestigate(args[1]);
		});
		this.fsm.addTransition(loyaltyInvestigation,loyaltyInvestigation,"INVESTIGATE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_PRESIDENT);
		});
		this.fsm.addTransition(loyaltyInvestigation,loyaltyInvestigation,"INVESTIGATE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[1] == _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_SELF);
		});
		this.fsm.addTransition(loyaltyInvestigation,loyaltyInvestigation,"INVESTIGATE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return _gthis.players[args[1]].status == "DEAD";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_DEAD);
		});
		this.fsm.addTransition(loyaltyInvestigationResult,chancelorNomination,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return true;
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.nextPresident();
		});
		this.fsm.addTransition(policyReveal,specialElection,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.nextPower == "SPECIAL_ELECTION";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onPolicyRevealed();
		});
		this.fsm.addTransition(specialElection,specialElectionResult,"CHOOSE",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.president && args[1] != _gthis.president) {
				return _gthis.players[args[1]].status == "ALIVE";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.onChoose(args[1]);
		});
		this.fsm.addTransition(specialElection,specialElection,"CHOOSE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_PRESIDENT);
		});
		this.fsm.addTransition(specialElection,specialElection,"CHOOSE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[1] == _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_SELF);
		});
		this.fsm.addTransition(specialElection,specialElection,"CHOOSE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return _gthis.players[args[1]].status == "DEAD";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_DEAD);
		});
		this.fsm.addTransition(specialElectionResult,chancelorNomination,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return true;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
		});
		this.fsm.addTransition(policyReveal,policyPeek,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.nextPower == "POLICY_PEEK";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onPolicyRevealed();
		});
		this.fsm.addTransition(policyPeek,policyPeekResult,"PEEK",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] == _gthis.president;
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.onPeek();
		});
		this.fsm.addTransition(policyPeek,policyPeek,"PEEK",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_PRESIDENT);
		});
		this.fsm.addTransition(policyPeekResult,chancelorNomination,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return true;
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.nextPresident();
		});
		this.fsm.addTransition(policyReveal,execution,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.nextPower == "EXECUTION";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onPolicyRevealed();
		});
		this.fsm.addTransition(execution,executionResult,"EXECUTE",false,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.president && args[1] != _gthis.president) {
				return _gthis.players[args[1]].status == "ALIVE";
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.onExecute(args[1]);
		});
		this.fsm.addTransition(execution,execution,"EXECUTE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_NOT_PRESIDENT);
		});
		this.fsm.addTransition(execution,execution,"EXECUTE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[1] == _gthis.president;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_SELF);
		});
		this.fsm.addTransition(execution,execution,"EXECUTE",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return _gthis.players[args[1]].status == "DEAD";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.errors.push(sh_core_Error.IS_DEAD);
		});
		this.fsm.addTransition(executionResult,chancelorNomination,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.players;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(v.role == "HITLER" && v.status == "DEAD") {
					_g.push(v);
				}
			}
			return _g.length == 0;
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.nextPresident();
		});
		this.fsm.addTransition(executionResult,liberalVictory,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.players;
			while(_g1 < _g2.length) {
				var v = _g2[_g1];
				++_g1;
				if(v.role == "HITLER" && v.status == "DEAD") {
					_g.push(v);
				}
			}
			return _g.length > 0;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onHitlerKilled();
		});
		this.fsm.addTransition(policyReveal,fascistVictory,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.nextPower == "FASCIST_VICTORY";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onAllFascistPoliciesPassed();
		});
		this.fsm.addTransition(policyReveal,liberalVictory,"NEXT",false,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.nextPower == "LIBERAL_VICTORY";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.onAllLiberalPoliciesPassed();
		});
	}
	,update: function(event) {
		var $l=arguments.length;
		var args = new Array($l>1?$l-1:0);
		for(var $i=1;$i<$l;++$i){args[$i-1]=arguments[$i];}
		this.messages = [];
		this.errors = [];
		if(($_=this.fsm,$_.update.apply($_,[event].concat(args))) && this.errors.length == 0) {
			this.messages.push(sh_core_Message.EVENT(event,args[0],args[1]));
			this.messages.push(sh_core_Message.STATE(this.fsm.states[this.fsm.currentState].name));
		}
	}
	,onGameStart: function() {
		this.nbFascists = sh_core_Game.NB_LIBERALS[this.players.length];
		this.nbLiberals = sh_core_Game.NB_FASCISTS[this.players.length];
		this.fascistPoliciesPassed = 0;
		this.liberalPoliciesPassed = 0;
		this.electionTracker = 0;
		this.fascistBoard = sh_core_Game.FASCIST_BOARD[this.players.length];
		this.liberalBoard = sh_core_Game.LIBERAL_BOARD[this.players.length];
		this.drawPile = [];
		var _g = 0;
		var _g1 = sh_core_Game.NB_FASCIST_POLICIES;
		while(_g < _g1) {
			var i = _g++;
			this.drawPile.push("FASCIST_POLICY");
		}
		var _g = 0;
		var _g1 = sh_core_Game.NB_LIBERAL_POLICIES;
		while(_g < _g1) {
			var i = _g++;
			this.drawPile.push("LIBERAL_POLICY");
		}
		util_ArrayExt.shuffle(this.drawPile);
		this.roles = [];
		var _g = 0;
		var _g1 = this.nbFascists;
		while(_g < _g1) {
			var i = _g++;
			this.roles.push("FASCIST");
		}
		var _g = 0;
		var _g1 = this.nbLiberals;
		while(_g < _g1) {
			var i = _g++;
			this.roles.push("LIBERAL");
		}
		this.roles.push("HITLER");
		util_ArrayExt.shuffle(this.roles);
		var _g = 0;
		var _g1 = this.roles.length;
		while(_g < _g1) {
			var i = _g++;
			this.players[i].role = this.roles[i];
		}
		this.president = Std.random(this.players.length);
		this.messages.push(sh_core_Message.INIT(this.drawPile,this.president,this.roles));
	}
	,onVoteCounting: function() {
		var jaVotes = 0;
		var vote = this.votes.iterator();
		while(vote.hasNext()) {
			var vote1 = vote.next();
			if(vote1 == "JA") {
				++jaVotes;
			}
		}
		var _g = [];
		var _g1 = 0;
		var _g2 = this.players;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(v.status == "ALIVE") {
				_g.push(v);
			}
		}
		if(jaVotes > _g.length / 2) {
			this.voteResult = "JA";
		} else {
			this.voteResult = "NEIN";
		}
	}
	,onPresidentSession: function() {
		this.proposedPolicies.push(this.drawPile.pop());
		this.proposedPolicies.push(this.drawPile.pop());
		this.proposedPolicies.push(this.drawPile.pop());
		this.vetoUsed = false;
	}
	,onPolicyReveal: function() {
		if(this.proposedPolicies[0] == "FASCIST_POLICY") {
			this.fascistPoliciesPassed++;
			this.nextPower = sh_core_Game.FASCIST_BOARDS[this.fascistBoard][this.fascistPoliciesPassed];
		} else if(this.proposedPolicies[0] == "LIBERAL_POLICY") {
			this.liberalPoliciesPassed++;
			this.nextPower = sh_core_Game.LIBERAL_BOARDS[this.liberalBoard][this.liberalPoliciesPassed];
		}
		this.playedPolicies.push(this.proposedPolicies.pop());
		this.electionTracker = 0;
	}
	,onNominate: function(target) {
		this.chancelor = target;
	}
	,onVote: function(player,vote) {
		this.votes.h[player] = vote;
	}
	,onVoteEnded: function() {
	}
	,onChaos: function() {
		this.electionTracker = 3;
		if(util_ArrayExt.last(this.drawPile) == "FASCIST_POLICY") {
			this.fascistPoliciesPassed++;
		} else if(util_ArrayExt.last(this.drawPile) == "LIBERAL_POLICY") {
			this.liberalPoliciesPassed++;
		}
		this.playedPolicies.push(this.drawPile.pop());
		if(this.liberalPoliciesPassed != 5) {
			if(this.fascistPoliciesPassed != 6) {
				if(this.drawPile.length < 3) {
					this.shufflePolicies();
				}
				this.electionTracker = 0;
				this.lastChancelor = sh_core_PlayerId.NONE;
				this.lastPresident = sh_core_PlayerId.NONE;
				this.nextPresident();
			}
		}
	}
	,onFailedVote: function() {
		this.electionTracker++;
		this.nextPresident();
	}
	,onHitlerElected: function() {
	}
	,onSuccessfulVote: function() {
		this.lastChancelor = this.chancelor;
		this.lastPresident = this.president;
	}
	,onPolicyDiscarded: function(policy) {
		var discardedPolicy = this.proposedPolicies[policy];
		this.discardPile.push(discardedPolicy);
		HxOverrides.remove(this.proposedPolicies,discardedPolicy);
	}
	,onPolicySelected: function(policy) {
		var discardedPolicy = this.proposedPolicies[(policy + 1) % 2];
		this.discardPile.push(discardedPolicy);
		HxOverrides.remove(this.proposedPolicies,discardedPolicy);
		if(this.drawPile.length < 3) {
			this.shufflePolicies();
		}
	}
	,onVetoProposed: function() {
		this.vetoUsed = true;
	}
	,onVetoRejected: function() {
	}
	,onVetoAccepted: function() {
		this.electionTracker++;
		this.nextPresident();
	}
	,onPolicyRevealed: function() {
	}
	,onInvestigate: function(target) {
		this.investigatedPlayer = target;
	}
	,onChoose: function(target) {
		this.previousPresident = this.president;
		this.president = target;
		this.presidentForced = true;
	}
	,onPeek: function() {
	}
	,onExecute: function(target) {
		this.players[target].status = "DEAD";
	}
	,onHitlerKilled: function() {
	}
	,onAllFascistPoliciesPassed: function() {
	}
	,onAllLiberalPoliciesPassed: function() {
	}
	,shufflePolicies: function() {
		this.drawPile = this.drawPile.concat(this.discardPile);
		util_ArrayExt.shuffle(this.drawPile);
		this.discardPile = [];
		this.messages.push(sh_core_Message.DECK(this.drawPile));
	}
	,checkEligibility: function(id) {
		var _g = [];
		var _g1 = 0;
		var _g2 = this.players;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(v.status == "ALIVE") {
				_g.push(v);
			}
		}
		if(_g.length > 5) {
			if(id != this.lastChancelor && id != this.lastPresident && id != this.president && id != null && id >= 0 && id < this.players.length) {
				return this.players[id].status == "ALIVE";
			} else {
				return false;
			}
		}
		if(id != this.lastChancelor && id != this.president && id != null && id >= 0 && id < this.players.length) {
			return this.players[id].status == "ALIVE";
		} else {
			return false;
		}
	}
	,nextPresident: function() {
		if(this.presidentForced) {
			this.presidentForced = false;
			this.president = this.previousPresident;
		}
		while(true) {
			this.president = (this.president + 1) % this.players.length;
			if(!(this.players[this.president].status == "DEAD")) {
				break;
			}
		}
	}
	,getState: function() {
		return this.fsm.states[this.fsm.currentState].name;
	}
	,isInState: function(state) {
		return this.fsm.states[this.fsm.currentState].name == state;
	}
};
var sh_core_Message = $hxEnums["sh.core.Message"] = { __ename__:true,__constructs__:null
	,STATE: ($_=function(state) { return {_hx_index:0,state:state,__enum__:"sh.core.Message",toString:$estr}; },$_._hx_name="STATE",$_.__params__ = ["state"],$_)
	,EVENT: ($_=function(event,source,target) { return {_hx_index:1,event:event,source:source,target:target,__enum__:"sh.core.Message",toString:$estr}; },$_._hx_name="EVENT",$_.__params__ = ["event","source","target"],$_)
	,INIT: ($_=function(cards,firstPresident,roles) { return {_hx_index:2,cards:cards,firstPresident:firstPresident,roles:roles,__enum__:"sh.core.Message",toString:$estr}; },$_._hx_name="INIT",$_.__params__ = ["cards","firstPresident","roles"],$_)
	,DECK: ($_=function(cards) { return {_hx_index:3,cards:cards,__enum__:"sh.core.Message",toString:$estr}; },$_._hx_name="DECK",$_.__params__ = ["cards"],$_)
};
sh_core_Message.__constructs__ = [sh_core_Message.STATE,sh_core_Message.EVENT,sh_core_Message.INIT,sh_core_Message.DECK];
var sh_core_Error = $hxEnums["sh.core.Error"] = { __ename__:true,__constructs__:null
	,IS_NOT_ELIGIBLE: {_hx_name:"IS_NOT_ELIGIBLE",_hx_index:0,__enum__:"sh.core.Error",toString:$estr}
	,IS_NOT_PRESIDENT: {_hx_name:"IS_NOT_PRESIDENT",_hx_index:1,__enum__:"sh.core.Error",toString:$estr}
	,IS_NOT_CHANCELOR: {_hx_name:"IS_NOT_CHANCELOR",_hx_index:2,__enum__:"sh.core.Error",toString:$estr}
	,IS_DEAD: {_hx_name:"IS_DEAD",_hx_index:3,__enum__:"sh.core.Error",toString:$estr}
	,HAS_VOTED: {_hx_name:"HAS_VOTED",_hx_index:4,__enum__:"sh.core.Error",toString:$estr}
	,HAS_NOT_VOTED: {_hx_name:"HAS_NOT_VOTED",_hx_index:5,__enum__:"sh.core.Error",toString:$estr}
	,IS_CHAOS: {_hx_name:"IS_CHAOS",_hx_index:6,__enum__:"sh.core.Error",toString:$estr}
	,IS_NOT_CHAOS: {_hx_name:"IS_NOT_CHAOS",_hx_index:7,__enum__:"sh.core.Error",toString:$estr}
	,IS_SELF: {_hx_name:"IS_SELF",_hx_index:8,__enum__:"sh.core.Error",toString:$estr}
	,CAN_NOT_VETO: {_hx_name:"CAN_NOT_VETO",_hx_index:9,__enum__:"sh.core.Error",toString:$estr}
	,IS_VICTORIOUS: {_hx_name:"IS_VICTORIOUS",_hx_index:10,__enum__:"sh.core.Error",toString:$estr}
	,IS_NOT_VICTORIOUS: {_hx_name:"IS_NOT_VICTORIOUS",_hx_index:11,__enum__:"sh.core.Error",toString:$estr}
};
sh_core_Error.__constructs__ = [sh_core_Error.IS_NOT_ELIGIBLE,sh_core_Error.IS_NOT_PRESIDENT,sh_core_Error.IS_NOT_CHANCELOR,sh_core_Error.IS_DEAD,sh_core_Error.HAS_VOTED,sh_core_Error.HAS_NOT_VOTED,sh_core_Error.IS_CHAOS,sh_core_Error.IS_NOT_CHAOS,sh_core_Error.IS_SELF,sh_core_Error.CAN_NOT_VETO,sh_core_Error.IS_VICTORIOUS,sh_core_Error.IS_NOT_VICTORIOUS];
var sh_core_Player = function(id,name) {
	this.id = id;
	this.name = name != null ? name : sh_core_Player.NAMES[Std.random(sh_core_Player.NAMES.length)];
	this.role = "NONE";
	this.status = "ALIVE";
};
sh_core_Player.__name__ = true;
var sh_core_PlayerId = {};
var util_ArrayExt = function() { };
util_ArrayExt.__name__ = true;
util_ArrayExt.last = function(a) {
	return a[a.length - 1];
};
util_ArrayExt.shuffle = function(a) {
	var index = a.length;
	while(index != 0) {
		var rand = Std.random(index--);
		var temp = a[index];
		a[index] = a[rand];
		a[rand] = temp;
	}
};
util_ArrayExt.random = function(a) {
	return a[Std.random(a.length)];
};
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
fsm__$FSM_Transition.NULL_ID = -1;
fsm__$FSM_State.NULL_ID = -1;
fsm_FSM.NULL_STATE_ID = fsm__$FSM_State.NULL_ID;
fsm_FSM.NULLTRANSITION_ID = fsm__$FSM_Transition.NULL_ID;
sh_client_Client.displayName = "Client";
sh_client_components_BottomBoard.displayName = "BottomBoard";
sh_client_components_Buttons.displayName = "Buttons";
sh_client_components_FascistBoard.displayName = "FascistBoard";
sh_client_components_LiberalBoard.displayName = "LiberalBoard";
sh_client_components_Log.displayName = "Log";
sh_client_components_Player.displayName = "Player";
sh_client_components_PlayerList.displayName = "PlayerList";
sh_client_components_TopBoard.displayName = "TopBoard";
sh_core_Game.NB_FASCIST_POLICIES = 11;
sh_core_Game.NB_LIBERAL_POLICIES = 6;
sh_core_Game.NB_LIBERALS = [null,null,null,null,null,1,1,2,2,3,3];
sh_core_Game.NB_FASCISTS = [null,null,null,null,null,3,4,4,5,5,6];
sh_core_Game.FASCIST_BOARD = [null,null,null,null,null,1,1,2,2,3,3];
sh_core_Game.LIBERAL_BOARD = [null,null,null,null,null,1,1,1,1,1,1];
sh_core_Game.FASCIST_BOARDS = [null,[null,"NO_POWER","NO_POWER","POLICY_PEEK","EXECUTION","EXECUTION","FASCIST_VICTORY"],[null,"NO_POWER","LOYALTY_INVESTIGATION","SPECIAL_ELECTION","EXECUTION","EXECUTION","FASCIST_VICTORY"],[null,"LOYALTY_INVESTIGATION","LOYALTY_INVESTIGATION","SPECIAL_ELECTION","EXECUTION","EXECUTION","FASCIST_VICTORY"]];
sh_core_Game.LIBERAL_BOARDS = [null,[null,"NO_POWER","NO_POWER","NO_POWER","NO_POWER","LIBERAL_VICTORY"]];
sh_core_Player.NAMES = ["Red","Leaf","Luth","Célesta","Brice","Flora","Louka","Aurore","Ludwig","Ludvina","Mélis","Echo","Kalem","Serena","Elio","Selene","Victor","Gloria","Aurel","Lucia","Florian","Juliana","Nathan","Sandrine","Lunick","Solana","Primo","Clara","Sully","Ethelle","Jamie","River","Marc","Mint","Lucas","Anna","Scottie","Bettie"];
sh_core_PlayerId.NONE = -1;
Main.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

//# sourceMappingURL=main.js.map
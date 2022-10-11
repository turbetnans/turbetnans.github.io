(function ($hx_exports, $global) { "use strict";
$hx_exports["nainJaune"] = $hx_exports["nainJaune"] || {};
$hx_exports["nainJaune"]["client"] = $hx_exports["nainJaune"]["client"] || {};
;$hx_exports["nainJaune"]["core"] = $hx_exports["nainJaune"]["core"] || {};
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
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
var Main = $hx_exports["Main"] = function() { };
Main.__name__ = true;
Main.create = function(players,money) {
	if(money == null) {
		money = 120;
	}
	Main.c.createGame(players,money);
};
Main.start = function() {
	Main.c.startGame();
};
Main.stop = function() {
	Main.c.stopGame();
};
Main.createLocal = function() {
	Main.c.update("CreateLocal");
};
Main.createRoom = function() {
	Main.c.update("CreateRoom");
};
Main.joinRoom = function(id) {
	Main.c.update("JoinRoom",id);
};
Main.returnMenu = function() {
	Main.c.update("Return");
};
Main.go = function() {
	Main.c.updateGame("Go");
};
Main.jouer = function(card) {
	Main.c.updateGame("Jouer",null,card);
};
Main.passer = function() {
	Main.c.updateGame("Passer");
};
Main.prendre = function(card) {
	Main.c.updateGame("Prendre",null,card);
};
Main.fin = function() {
	Main.c.updateGame("Fin");
};
Main.cheat = function() {
	while(Main.c.g.players[Main.c.g.currentPlayer].cards.length > 0) Main.c.g.cardsPlayed.push(Main.c.g.players[Main.c.g.currentPlayer].cards.shift());
	Main.c.update("Update");
};
Main.main = function() {
	Main.c = nainJaune_client_Client.create();
	if(Main.c == null) {
		console.log("Main.hx:43:","Err client creation");
	}
	Main.c.start();
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
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
		var _g = 0;
		var _g1 = this.states;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			if(name == s.name) {
				console.log("fsm/FSM.hx:52:","[ERR]\t" + "addstate\t" + "name already exists." + "\n\t" + name);
				return fsm__$FSM_State.NULL_ID;
			}
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
			console.log("fsm/FSM.hx:66:","[ERR]\t" + "addTransition\t" + "can't modify while running.");
			return fsm__$FSM_Transition.NULL_ID;
		}
		if(event == null) {
			console.log("fsm/FSM.hx:71:","[ERR]\t" + "addTransition\t" + "empty event." + "\n\t" + event);
			return fsm__$FSM_Transition.NULL_ID;
		}
		if(this.states[from] == null || this.states[to] == null) {
			console.log("fsm/FSM.hx:76:","[ERR]\t" + "addTransition\t" + "invalid state." + "\n\t" + from + " " + to);
			return fsm__$FSM_Transition.NULL_ID;
		}
		if(this.states[from].isFinal) {
			console.log("fsm/FSM.hx:81:","[ERR]\t" + "addTransition\t" + "transition from a final state." + "\n\t" + from);
			return fsm__$FSM_Transition.NULL_ID;
		}
		if(isInternal && from != to) {
			console.log("fsm/FSM.hx:86:","[ERR]\t" + "addTransition\t" + "invalid internal transition." + "\n\t" + from + " " + to);
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
			console.log("fsm/FSM.hx:102:","[ERR]\t" + "setFinal\t" + "can't modify while running.");
			return fsm__$FSM_State.NULL_ID;
		}
		if(this.states[state] == null) {
			console.log("fsm/FSM.hx:107:","[ERR]\t" + "setFinal\t" + "invalid state." + "\n\t" + state);
			return fsm__$FSM_State.NULL_ID;
		}
		var _g = 0;
		var _g1 = this.transitions;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.from == state) {
				console.log("fsm/FSM.hx:113:","[ERR]\t" + "addTransition\t" + "transition is leaving the state." + "\n\t" + Std.string(t) + " " + state);
				return fsm__$FSM_State.NULL_ID;
			}
		}
		this.states[state].isFinal = true;
		return state;
	}
	,start: function() {
		if(this.initial == fsm__$FSM_State.NULL_ID || this.states.length == 0 || this.transitions.length == 0) {
			console.log("fsm/FSM.hx:124:","[ERR]\t" + "start\t" + "not fully initialized." + "\n\t" + this.initial + " " + this.states.length + " " + this.transitions.length);
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
			console.log("fsm/FSM.hx:138:","[ERR]\t" + "stop\t" + "not started.");
			return false;
		}
		if(!(this.currentState != fsm__$FSM_State.NULL_ID && this.states[this.currentState].isFinal) && !forceStop) {
			console.log("fsm/FSM.hx:142:","[ERR]\t" + "stop\t" + "not finished, use stop(true) to force stopping.");
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
			console.log("fsm/FSM.hx:152:","[ERR]\t" + "update\t" + "not started.");
			return false;
		}
		if(this.states[this.currentState] == null) {
			console.log("fsm/FSM.hx:157:","[ERR]\t" + "update\t" + "invalid current state." + "\n\t" + this.currentState + " " + Std.string(this.states[this.currentState]));
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
		return true;
	}
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
};
haxe_Exception.__name__ = true;
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	get_native: function() {
		return this.__nativeException;
	}
});
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
});
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
var nainJaune_client_Client = $hx_exports["nainJaune"]["client"]["Client"] = function() {
	this.gameState = "";
	this.playerId = nainJaune_core_Player.NULL_ID;
	this.guests = null;
	this.hostCo = null;
	this.peer = null;
	this.name = nainJaune_client_Client.someNames[Math.random() * nainJaune_client_Client.someNames.length | 0];
	this.role = nainJaune_client_Role.None;
	this.r = null;
	this.g = null;
	fsm_FSM.call(this);
};
nainJaune_client_Client.__name__ = true;
nainJaune_client_Client.create = function() {
	var client = new nainJaune_client_Client();
	if(client.init()) {
		return client;
	}
	return null;
};
nainJaune_client_Client.__super__ = fsm_FSM;
nainJaune_client_Client.prototype = $extend(fsm_FSM.prototype,{
	init: function() {
		var _gthis = this;
		this.r = new nainJaune_client_WebRenderer(this);
		this.initPeer();
		var mainMenu = this.addState("Menu principal",function() {
			_gthis.entryMainMenu();
		});
		var localGame = this.addState("Partie locale",function() {
			_gthis.entryLocalGame();
		});
		var roomHost = this.addState("Hote du salon",function() {
			_gthis.entryRoomHost();
		});
		var roomWait = this.addState("Attente du salon",function() {
			_gthis.entryRoomWait();
		});
		var roomGuest = this.addState("Invite du salon",function() {
			_gthis.entryRoomGuest();
		});
		var gameRunning = this.addState("Partie en cours",function() {
			_gthis.entryGameRunning();
		});
		this.setInitial(mainMenu);
		this.addTransition(mainMenu,localGame,"CreateLocal",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:74:","TR: salon local créé");
		});
		this.addTransition(mainMenu,roomHost,"CreateRoom",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:78:","TR: salon créé");
			_gthis.guests = [new nainJaune_client_Guest(null,_gthis.peer.id,_gthis.name)];
		});
		this.addTransition(mainMenu,roomWait,"JoinRoom",null,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] != "" && args[0] != _gthis.peer.id) {
				return _gthis.hostCo == null;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.connectToHost(args[0]);
			console.log("nainJaune/client/Client.hx:86:","TR: demande envoyée");
		});
		this.addTransition(mainMenu,mainMenu,"JoinRoom",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] == "";
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:91:","no targetedHost");
		});
		this.addTransition(mainMenu,mainMenu,"JoinRoom",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] == _gthis.peer.id;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:95:","targetedHost = selfId");
		});
		this.addTransition(mainMenu,mainMenu,"JoinRoom",true,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.hostCo != null;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:99:","hostCo not null");
		});
		this.addTransition(roomWait,roomGuest,"JoinRoom",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:102:","TR: salon rejoint");
		});
		this.addTransition(localGame,mainMenu,"Return",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:107:","TR: salon local fermé");
		});
		this.addTransition(roomHost,mainMenu,"Return",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.closeRoom();
			console.log("nainJaune/client/Client.hx:112:","TR: salon fermé");
		});
		this.addTransition(roomWait,mainMenu,"Return",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:116:","TR: demande refusée");
		});
		this.addTransition(roomGuest,mainMenu,"Return",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.quitRoom();
			console.log("nainJaune/client/Client.hx:121:","TR: salon quitté");
		});
		this.addTransition(gameRunning,mainMenu,"Return",null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			if(_gthis.g.currentState != fsm__$FSM_State.NULL_ID) {
				if(_gthis.role._hx_index == 3) {
					return true;
				} else {
					return false;
				}
			} else {
				return true;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.r.clearOutput();
			console.log("nainJaune/client/Client.hx:128:","TR: retour au menu");
		});
		this.addTransition(localGame,gameRunning,"Launch",null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.g != null;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.r.clearOutput();
			console.log("nainJaune/client/Client.hx:137:","TR: partie locale lancée");
		});
		this.addTransition(roomHost,gameRunning,"Launch",null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			return _gthis.g != null;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.r.clearOutput();
			console.log("nainJaune/client/Client.hx:144:","TR: partie lancée");
		});
		this.addTransition(roomGuest,gameRunning,"Launch",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.r.clearOutput();
			console.log("nainJaune/client/Client.hx:150:","TR: partie lancée par l'hôte");
		});
		this.addTransition(roomHost,roomHost,"Update",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			var _gthis1 = _gthis;
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.guests;
			while(_g1 < _g2.length) {
				var guest = _g2[_g1];
				++_g1;
				_g.push(guest.name);
			}
			var tmp = _g;
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.guests;
			while(_g1 < _g2.length) {
				var guest = _g2[_g1];
				++_g1;
				_g.push(guest.id);
			}
			_gthis1.sendToAll(nainJaune_client_Message.GuestList(tmp,_g));
			console.log("nainJaune/client/Client.hx:158:","TR: salon mis à jour");
		});
		this.addTransition(roomGuest,roomGuest,"Update",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:162:","TR: salon mis à jour");
		});
		this.addTransition(gameRunning,gameRunning,"Update",null,null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			console.log("nainJaune/client/Client.hx:165:","TR: partie mise à jour");
		});
		return true;
	}
	,entryMainMenu: function() {
		this.role = nainJaune_client_Role.None;
		this.r.clearElements();
		this.r.printState();
		this.r.printMenu();
	}
	,entryLocalGame: function() {
		this.role = nainJaune_client_Role.Local;
		this.r.clearElements();
		this.r.printState();
		this.r.printCreateLocal();
		this.r.printReturn();
	}
	,entryRoomHost: function() {
		this.role = nainJaune_client_Role.Host;
		this.r.clearElements();
		this.r.printState();
		this.r.printHostId();
		this.r.printConnectedPlayers(true);
		this.r.printReturn();
	}
	,entryRoomWait: function() {
		this.role = nainJaune_client_Role.Guest;
		this.guests = [];
		this.r.clearElements();
		this.r.printState();
	}
	,entryRoomGuest: function() {
		this.role = nainJaune_client_Role.Guest;
		this.r.clearElements();
		this.r.printState();
		this.r.printConnectedPlayers();
		this.r.printReturn();
	}
	,entryGameRunning: function() {
		if(this.g == null) {
			console.log("nainJaune/client/Client.hx:211:","err wtf no game");
			return;
		}
		this.gameState = this.g.states[this.g.currentState].name;
		var message = null;
		if(this.role._hx_index == 3) {
			while(true) {
				message = this.g.messages.shift();
				if(!(message != null)) {
					break;
				}
				this.processGameMessage(message);
			}
		} else {
			while(true) {
				message = this.g.messages.shift();
				if(!(message != null)) {
					break;
				}
				this.processGameMessage(message);
				if(this.role._hx_index == 2) {
					this.sendToAll(nainJaune_client_Message.GameUpdate(message));
				}
			}
		}
		this.r.clearElements();
		this.r.printState(true);
		switch(this.gameState) {
		case "Debut de manche":
			this.r.printBoard(this.g.board,this.g.nextSweep,true);
			this.r.printPlayers(this.g.players,this.g.currentPlayer);
			if(this.role._hx_index == 1 || this.role._hx_index == 2) {
				this.r.printStartRound();
			}
			break;
		case "Debut de partie":
			this.r.printBoard(this.g.board,this.g.nextSweep,true);
			this.r.printPlayers(this.g.players,this.g.currentPlayer);
			if(this.role._hx_index == 1 || this.role._hx_index == 2) {
				this.r.printStartGame();
			}
			break;
		case "Debut de tour":
			if(this.role._hx_index == 1) {
				this.r.printBoard(this.g.board,this.g.nextSweep);
				this.r.printPlayers(this.g.players,this.g.currentPlayer);
				this.r.printLastCard(util_ArrayExt.last(this.g.cardsPlayed),this.g.players[this.g.lastPlayer]);
				this.r.printNextCard(this.g.nextCard);
				this.r.printPlayerHand(this.g.currentPlayer,this.g.nextCard,this.g.firstTurn);
			} else {
				this.r.printBoard(this.g.board,this.g.nextSweep);
				this.r.printPlayers(this.g.players,this.g.currentPlayer);
				this.r.printLastCard(util_ArrayExt.last(this.g.cardsPlayed),this.g.players[this.g.lastPlayer]);
				this.r.printNextCard(this.g.nextCard);
				if(this.playerId == this.g.currentPlayer) {
					this.r.printPlayerHand(this.g.currentPlayer,this.g.nextCard,this.g.firstTurn);
				}
			}
			break;
		case "Fin de manche":
			this.r.printBoard(this.g.board,this.g.nextSweep,true);
			this.r.printPlayers(this.g.players,this.g.currentPlayer);
			if(this.role._hx_index == 1 || this.role._hx_index == 2) {
				this.r.printStopRound();
			}
			break;
		case "Fin de partie":
			this.r.printBoard(this.g.board,this.g.nextSweep,true);
			this.r.printPlayers(this.g.players,this.g.currentPlayer);
			if(this.role._hx_index == 1 || this.role._hx_index == 2) {
				this.r.printStopGame();
			}
			break;
		}
	}
	,createGame: function(players,initialMoney) {
		if(this.role._hx_index == 1) {
			this.g = nainJaune_core_Game.create(players,initialMoney);
		} else if(this.role._hx_index == 2) {
			var _g = [];
			var _g1 = 0;
			var _g2 = this.guests;
			while(_g1 < _g2.length) {
				var guest = _g2[_g1];
				++_g1;
				_g.push(guest.name);
			}
			this.g = nainJaune_core_Game.create(_g,initialMoney);
		} else if(this.role._hx_index == 3) {
			var _g = [];
			var _g1 = 0;
			var _g2 = this.guests;
			while(_g1 < _g2.length) {
				var guest = _g2[_g1];
				++_g1;
				_g.push(guest.name);
			}
			this.g = nainJaune_core_Game.create(_g,initialMoney);
		} else {
			this.r.printOutput("Votre rôle ne permet pas de créer une partie.");
		}
		if(this.g == null) {
			this.r.printOutput("Erreur lors de la création de la partie.");
			return;
		}
		if(this.role._hx_index == 2 || this.role._hx_index == 3) {
			var _g = 0;
			var _g1 = this.guests.length;
			while(_g < _g1) {
				var i = _g++;
				if(this.guests[i].id == this.peer.id) {
					this.playerId = i;
					return;
				}
			}
		}
	}
	,startGame: function() {
		if(this.g == null) {
			return;
		}
		this.g.start();
		if(this.role._hx_index == 2) {
			this.sendToAll(nainJaune_client_Message.RoomLaunch(this.g.initialMoney));
		}
		this.update("Launch");
	}
	,stopGame: function() {
		if(this.g == null) {
			return;
		}
		this.g.stop();
		this.update("Return");
	}
	,updateGame: function(event,player,card) {
		if(this.role._hx_index == 3) {
			this.hostCo.send(nainJaune_client_Message.GuestAction(event,card));
		} else if(this.role._hx_index == 2) {
			if(event == "Go") {
				this.g.update(event);
			} else if(event == "Jouer" || event == "Prendre") {
				this.g.update(event,this.playerId,card);
			} else if(event == "Passer" || event == "Fin") {
				this.g.update(event,this.playerId);
			}
			this.update("Update");
		} else {
			if(event == "Go") {
				this.g.update(event);
			} else if(event == "Jouer" || event == "Prendre") {
				this.g.update(event,this.g.currentPlayer,card);
			} else if(event == "Passer" || event == "Fin") {
				this.g.update(event,this.g.currentPlayer);
			}
			this.update("Update");
		}
	}
	,getCards: function(player) {
		return this.g.players[player].cards;
	}
	,initPeer: function() {
		var _gthis = this;
		this.peer = new Peer(null,{ debug : 2});
		this.peer.on("open",function(id) {
			console.log("nainJaune/client/Client.hx:345:","PEER OPEN " + (id == null ? "null" : Std.string(id)));
		});
		this.peer.on("connection",function(c) {
			var co = c;
			console.log("nainJaune/client/Client.hx:350:","PEER CONNECTION " + co.peer);
			if(_gthis.role != nainJaune_client_Role.Host) {
				_gthis.r.printOutput("Connection from guest " + co.peer + " refused because not hosting");
				co.on("open",function(_) {
					co.send(nainJaune_client_Message.CannotJoin("NoHost"));
					haxe_Timer.delay(function() {
						if(co != null) {
							co.close();
						}
					},500);
				});
			} else {
				var _g = [];
				var _g1 = 0;
				var _g2 = _gthis.guests;
				while(_g1 < _g2.length) {
					var guest = _g2[_g1];
					++_g1;
					if(guest.id == co.peer) {
						_g.push(true);
					}
				}
				if(_g.length != 0) {
					_gthis.r.printOutput("Connection from guest " + co.peer + " refused because guest already here");
					co.on("open",function(_) {
						co.send(nainJaune_client_Message.CannotJoin("AlreadyJoined"));
						haxe_Timer.delay(function() {
							if(co != null) {
								co.close();
							}
						},500);
					});
				} else if(_gthis.guests.length >= 8) {
					_gthis.r.printOutput("Connection from guest " + co.peer + " refused because room full");
					co.on("open",function(_) {
						co.send(nainJaune_client_Message.CannotJoin("Full"));
						haxe_Timer.delay(function() {
							if(co != null) {
								co.close();
							}
						},500);
					});
				} else if(_gthis.states[_gthis.currentState].name == "Partie en cours") {
					_gthis.r.printOutput("Connection from guest " + co.peer + " refused because already playing");
					co.on("open",function(_) {
						co.send(nainJaune_client_Message.CannotJoin("AlreadyPlaying"));
						haxe_Timer.delay(function() {
							if(co != null) {
								co.close();
							}
						},500);
					});
				} else {
					_gthis.r.printOutput("Connection from guest " + co.peer + " accepted");
					_gthis.guests.push(new nainJaune_client_Guest(co,co.peer,co.label));
					co.on("open",function(_) {
						co.send(nainJaune_client_Message.RoomJoin);
						_gthis.update("Update");
					});
					co.on("data",function(data) {
						_gthis.processMessageHost(data,co.peer);
					});
					co.on("close",function(_) {
						_gthis.r.printOutput("Connection closed with guest " + co.peer);
						var _g = 0;
						var _g1 = _gthis.guests;
						while(_g < _g1.length) {
							var guest = _g1[_g];
							++_g;
							if(guest.id == co.peer) {
								HxOverrides.remove(_gthis.guests,guest);
								_gthis.update("Update");
								break;
							}
						}
					});
					co.on("error",function(err) {
						console.log("nainJaune/client/Client.hx:399:","HOST CONNECTION ERROR " + (err == null ? "null" : Std.string(err)));
						var _g = err.type;
						_gthis.r.printOutput("error with guest " + (err == null ? "null" : Std.string(err)));
					});
				}
			}
		});
		this.peer.on("disconnected",function(_) {
			console.log("nainJaune/client/Client.hx:408:","PEER DISCONNECTED");
		});
		this.peer.on("close",function(_) {
			console.log("nainJaune/client/Client.hx:410:","PEER CLOSE");
		});
		this.peer.on("error",function(err) {
			console.log("nainJaune/client/Client.hx:413:","PEER ERROR " + (err == null ? "null" : Std.string(err)));
			if(err.type == "peer-unavailable") {
				_gthis.hostCo = null;
				_gthis.update("Return");
			} else {
				_gthis.r.printOutput("error with peer " + (err == null ? "null" : Std.string(err)));
			}
		});
	}
	,connectToHost: function(id) {
		var _gthis = this;
		console.log("nainJaune/client/Client.hx:424:","ID: " + id + " " + this.peer.id);
		this.hostCo = this.peer.connect(id,{ label : this.name, metadata : null, serialization : "json", reliable : true});
		this.hostCo.on("open",function(_) {
			_gthis.r.printOutput("Connection to host " + _gthis.hostCo.peer + " established");
		});
		this.hostCo.on("data",function(data) {
			_gthis.processMessageGuest(data);
		});
		this.hostCo.on("close",function(_) {
			_gthis.r.printOutput("Connection closed with host " + _gthis.hostCo.peer);
			_gthis.hostCo = null;
			_gthis.update("Return");
		});
		this.hostCo.on("error",function(err) {
			console.log("nainJaune/client/Client.hx:443:","GUEST CONNECTION ERROR " + (err == null ? "null" : Std.string(err)));
			var _g = err.type;
			_gthis.r.printOutput("error with host " + (err == null ? "null" : Std.string(err)));
		});
	}
	,closeRoom: function() {
		this.r.printOutput("Room closed");
		var _g = 0;
		var _g1 = this.guests;
		while(_g < _g1.length) {
			var guest = [_g1[_g]];
			++_g;
			if(guest[0].id != this.peer.id) {
				guest[0].co.send(nainJaune_client_Message.RoomClose("Closed"));
				haxe_Timer.delay((function(guest) {
					return function() {
						if(guest[0].co != null) {
							guest[0].co.close();
						}
					};
				})(guest),500);
				this.r.printOutput("Disconnect " + guest[0].id);
			}
		}
	}
	,quitRoom: function() {
		var _gthis = this;
		if(this.hostCo == null) {
			return;
		}
		this.hostCo.send(nainJaune_client_Message.GuestQuit);
		haxe_Timer.delay(function() {
			if(_gthis.hostCo != null) {
				_gthis.hostCo.close();
			}
		},500);
		this.hostCo = null;
	}
	,sendToAll: function(message) {
		var _g = 0;
		var _g1 = this.guests;
		while(_g < _g1.length) {
			var guest = _g1[_g];
			++_g;
			if(guest.co != null) {
				guest.co.send(message);
			}
		}
	}
	,processGameMessage: function(message) {
		var elem = "";
		switch(message._hx_index) {
		case 0:
			elem += "[Tr] [Init] La partie est créée !";
			break;
		case 1:
			elem += "</p><hr><p>";
			elem += "[St] La partie est prête à commencer !";
			break;
		case 2:
			var dealer = message.dealer;
			elem += "[Tr] La partie commence ! ";
			elem += this.r.formatPlayerName(this.g.players[dealer].name);
			elem += " sera le premier donneur.";
			break;
		case 3:
			var losers = message.losers;
			elem += "[Tr] La partie se termine, certains joueurs ne peuvent pas payer : ";
			var _g = 0;
			var _g1 = losers.length;
			while(_g < _g1) {
				var i = _g++;
				elem += (i != 0 ? "<span class='spacer medium'></span>" : "") + this.r.formatPlayerName(this.g.players[losers[i]].name);
			}
			break;
		case 4:
			var winners = message.winners;
			elem += "</p><hr><p>";
			elem += "[St] [Fin] La partie est terminée ! Les gagnants sont ";
			var _g = 0;
			var _g1 = winners.length;
			while(_g < _g1) {
				var i = _g++;
				elem += (i != 0 ? "<span class='spacer medium'></span>" : "") + this.r.formatPlayerName(this.g.players[i].name);
			}
			break;
		case 5:
			var round = message.round;
			var dealer = message.dealer;
			elem += "</p><hr><p>";
			elem += "[St] La manche ";
			elem += this.r.formatValue(round);
			elem += " est prête à commencer, ";
			elem += this.r.formatPlayerName(this.g.players[dealer].name);
			elem += " est le donneur !";
			break;
		case 6:
			var round = message.round;
			var dealer = message.dealer;
			var hands = message.hands;
			var stock = message.stock;
			elem += "[Tr] La manche ";
			elem += this.r.formatValue(round);
			elem += " commence, ";
			elem += this.r.formatPlayerName(this.g.players[dealer].name);
			elem += " a distribué les cartes !";
			break;
		case 7:
			var round = message.round;
			elem += "[Tr] Passage à la manche suivante !";
			break;
		case 8:
			var round = message.round;
			var player = message.player;
			var type = message.type;
			if(type == "Opera") {
				elem += "</p><hr><p>";
				elem += "[St] ";
				elem += this.r.formatPlayerName(this.g.players[player].name);
				elem += " réalise un Grand Opéra et remporte la manche ";
				elem += this.r.formatValue(round);
				elem += " !";
			} else if(type == null) {
				elem += "</p><hr><p>";
				elem += "[St] La manche ";
				elem += this.r.formatValue(round);
				elem += " a été remportée par ";
				elem += this.r.formatPlayerName(this.g.players[player].name);
				elem += " !";
			} else {
				elem += "Message RoundOver -> " + Std.string(message);
			}
			break;
		case 9:
			var player = message.player;
			var cards = message.cards;
			elem += "</p><hr><p>";
			elem += "[St] C'est à ";
			elem += this.r.formatPlayerName(this.g.players[player].name);
			elem += " de jouer, il lui reste ";
			elem += this.r.formatValue(cards.length);
			elem += " cartes en main.";
			break;
		case 10:
			var player = message.player;
			var sweep = message.sweep;
			var value = message.value;
			var type = message.type;
			if(type == "Bet") {
				elem += this.r.formatPlayerName(this.g.players[player].name);
				elem += " a misé.";
			} else if(type == "Repay") {
				elem += this.r.formatPlayerName(this.g.players[player].name);
				elem += " double la mise de ";
				elem += this.r.formatCard(nainJaune_core_Game.sweeps[sweep]);
				elem += " pour ";
				elem += this.r.formatMoney(value);
				elem += ".";
			} else {
				elem += "Message PlayeBet -> " + Std.string(message);
			}
			break;
		case 11:
			var from = message.fromPlayer;
			var to = message.toPlayer;
			var value = message.value;
			elem += this.r.formatPlayerName(this.g.players[from].name);
			elem += " paye ";
			elem += this.r.formatMoney(value);
			elem += " à ";
			elem += this.r.formatPlayerName(this.g.players[to].name);
			elem += ".";
			break;
		case 12:
			var player = message.player;
			elem += this.r.formatPlayerName(this.g.players[player].name);
			elem += " est ruiné.";
			break;
		case 13:
			var player = message.player;
			var rank = message.rank;
			elem += "[Tr] ";
			elem += this.r.formatPlayerName(this.g.players[player].name);
			elem += " : Sans ";
			elem += this.r.formatCardRank(nainJaune_core_Card.RANKS[rank]);
			elem += ".";
			break;
		case 14:
			var player = message.player;
			var round = message.round;
			elem += "[Tr] ";
			elem += this.r.formatPlayerName(this.g.players[player].name);
			elem += " termine la manche ";
			elem += this.r.formatValue(round);
			elem += ".";
			break;
		case 15:
			var stock = message.stock;
			var type = message.type;
			if(type == "Start") {
				elem += "Il y a ";
				elem += this.r.formatValue(stock.length);
				elem += " cartes dans le talon.";
			} else if(type == "End") {
				elem += "Le talon était ";
				var _g = 0;
				var _g1 = stock.length;
				while(_g < _g1) {
					var i = _g++;
					elem += (i != 0 ? "<span class='spacer medium'></span>" : "") + this.r.formatCard(stock[i]);
				}
				elem += ".";
			} else {
				elem += "Message CardStock -> " + Std.string(message);
			}
			break;
		case 16:
			var card = message.card;
			var player = message.player;
			elem += "[Tr] ";
			elem += this.r.formatPlayerName(this.g.players[player].name);
			elem += " vient de jouer ";
			elem += this.r.formatCard(card);
			elem += ".";
			break;
		case 17:
			var sweep = message.sweep;
			var player = message.player;
			var value = message.value;
			var type = message.type;
			if(type == "Opera") {
				elem += this.r.formatPlayerName(this.g.players[player].name);
				elem += " remporte la mise de ";
				elem += this.r.formatCard(nainJaune_core_Game.sweeps[sweep]);
				elem += " pour ";
				elem += this.r.formatMoney(value);
				elem += " gràce au Grand Opera.";
			} else if(type == null || type == "") {
				elem += this.r.formatPlayerName(this.g.players[player].name);
				elem += " remporte la mise de ";
				elem += this.r.formatCard(nainJaune_core_Game.sweeps[sweep]);
				elem += " pour ";
				elem += this.r.formatMoney(value);
				elem += ".";
			} else {
				elem += "Message SweepWin -> " + Std.string(message);
			}
			break;
		case 18:
			var sweep = message.sweep;
			var player = message.player;
			elem += this.r.formatPlayerName(this.g.players[player].name);
			elem += " a oublié de récupérer ";
			elem += this.r.formatCard(nainJaune_core_Game.sweeps[sweep]);
			elem += ".";
			break;
		case 19:
			var player = message.player;
			var card = message.card;
			var type = message.type;
			elem += "Impossible de joueur la carte ! (" + type + ")";
			break;
		case 20:
			var player = message.player;
			var card = message.card;
			var type = message.type;
			elem += "Impossible de prendre la mise ! (" + type + ")";
			break;
		case 21:
			var player = message.player;
			var type = message.type;
			elem += "Impossible de passer son tour ! (" + type + ")";
			break;
		case 22:
			var player = message.player;
			var round = message.round;
			var type = message.type;
			elem += "Impossible de terminer la manche ! (" + type + ")";
			break;
		}
		this.r.printOutput(elem);
	}
	,processGameMessageGuest: function(message) {
		switch(message._hx_index) {
		case 2:
			var dealer = message.dealer;
			this.g.update("Go",dealer);
			break;
		case 3:
			var _g = message.losers;
			this.g.update("Go");
			break;
		case 6:
			var _g = message.round;
			var _g = message.dealer;
			var hands = message.hands;
			var stock = message.stock;
			this.g.update("Go",hands,stock);
			break;
		case 7:
			var _g = message.round;
			this.g.update("Go");
			break;
		case 13:
			var _g = message.rank;
			var player = message.player;
			this.g.update("Passer",player);
			break;
		case 14:
			var _g = message.round;
			var player = message.player;
			this.g.update("Fin",player);
			break;
		case 16:
			var card = message.card;
			var player = message.player;
			this.g.update("Jouer",player,card);
			break;
		case 17:
			var _g = message.value;
			var sweep = message.sweep;
			var player = message.player;
			var type = message.type;
			if(type == null || type == "") {
				this.g.update("Prendre",player,nainJaune_core_Game.sweeps[sweep]);
			}
			break;
		case 19:
			var _g = message.type;
			var player = message.player;
			var card = message.card;
			this.g.update("Jouer",player,card);
			break;
		case 20:
			var _g = message.type;
			var player = message.player;
			var card = message.card;
			this.g.update("Prendre",player,card);
			break;
		case 21:
			var _g = message.type;
			var player = message.player;
			this.g.update("Passer",player);
			break;
		case 22:
			var _g = message.round;
			var _g = message.type;
			var player = message.player;
			this.g.update("Fin",player);
			break;
		default:
		}
	}
	,processMessageHost: function(message,sender) {
		if(this.role._hx_index != 2) {
			return;
		}
		var elem = "";
		switch(message._hx_index) {
		case 0:
			this.r.printOutput("Départ du joueur : " + sender);
			var _g = 0;
			var _g1 = this.guests;
			while(_g < _g1.length) {
				var guest = _g1[_g];
				++_g;
				if(guest.id == sender) {
					HxOverrides.remove(this.guests,guest);
					this.update("Update");
					break;
				}
			}
			break;
		case 1:
			var event = message.event;
			var card = message.card;
			var player = -1;
			var _g = 0;
			var _g1 = this.guests.length;
			while(_g < _g1) {
				var i = _g++;
				if(this.guests[i].id == sender) {
					player = i;
					break;
				}
			}
			this.g.update(event,player,nainJaune_core_Card.clone(card));
			this.update("Update");
			break;
		default:
			elem += "Message Host -> " + Std.string(message);
		}
		this.r.printOutput(elem);
	}
	,processMessageGuest: function(message) {
		if(this.role._hx_index != 3) {
			return;
		}
		var elem = "";
		switch(message._hx_index) {
		case 2:
			this.r.printOutput("Salon rejoint !");
			this.update("JoinRoom");
			break;
		case 3:
			var reason = message.reason;
			this.r.printOutput("Salon fermé ! " + reason);
			this.update("Return");
			break;
		case 4:
			var money = message.money;
			this.r.printOutput("L'hôte commence la partie !");
			this.createGame(null,money);
			this.startGame();
			this.update("Launch");
			break;
		case 5:
			var names = message.names;
			var ids = message.ids;
			var _g = [];
			var _g1 = 0;
			var _g2 = names.length;
			while(_g1 < _g2) {
				var i = _g1++;
				_g.push(new nainJaune_client_Guest(null,ids[i],names[i]));
			}
			this.guests = _g;
			this.update("Update");
			break;
		case 6:
			var message1 = message.message;
			this.processGameMessageGuest(this.fixGameMessage(message1));
			this.update("Update");
			break;
		case 7:
			var reason = message.reason;
			this.r.printOutput("Impossible de rejoindre le salon : " + reason);
			this.update("Return");
			break;
		case 8:
			var reason = message.reason;
			this.r.printOutput("Action impossible : " + reason);
			this.update("Update");
			break;
		default:
			elem += "Message Guest -> " + Std.string(message);
		}
		this.r.printOutput(elem);
	}
	,fixGameMessage: function(message) {
		switch(message._hx_index) {
		case 6:
			var round = message.round;
			var dealer = message.dealer;
			var hands = message.hands;
			var stock = message.stock;
			var _g = [];
			var _g1 = 0;
			while(_g1 < hands.length) {
				var h = hands[_g1];
				++_g1;
				var result = new Array(h.length);
				var _g2 = 0;
				var _g3 = h.length;
				while(_g2 < _g3) {
					var i = _g2++;
					result[i] = nainJaune_core_Card.clone(h[i]);
				}
				_g.push(result);
			}
			var tmp = _g;
			var result = new Array(stock.length);
			var _g = 0;
			var _g1 = stock.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = nainJaune_core_Card.clone(stock[i]);
			}
			return nainJaune_core_Message.RoundStart(round,dealer,tmp,result);
		case 9:
			var player = message.player;
			var cards = message.cards;
			var result = new Array(cards.length);
			var _g = 0;
			var _g1 = cards.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = nainJaune_core_Card.clone(cards[i]);
			}
			return nainJaune_core_Message.TurnStart(player,result);
		case 15:
			var stock = message.stock;
			var type = message.type;
			var result = new Array(stock.length);
			var _g = 0;
			var _g1 = stock.length;
			while(_g < _g1) {
				var i = _g++;
				result[i] = nainJaune_core_Card.clone(stock[i]);
			}
			return nainJaune_core_Message.CardStock(result,type);
		case 16:
			var card = message.card;
			var player = message.player;
			return nainJaune_core_Message.CardPlay(nainJaune_core_Card.clone(card),player);
		case 19:
			var player = message.player;
			var card = message.card;
			var type = message.type;
			return nainJaune_core_Message.CannotPlay(player,nainJaune_core_Card.clone(card),type);
		case 20:
			var player = message.player;
			var card = message.card;
			var type = message.type;
			return nainJaune_core_Message.CannotWin(player,nainJaune_core_Card.clone(card),type);
		default:
			return message;
		}
	}
});
var nainJaune_client_Message = $hxEnums["nainJaune.client.Message"] = { __ename__:true,__constructs__:null
	,GuestQuit: {_hx_name:"GuestQuit",_hx_index:0,__enum__:"nainJaune.client.Message",toString:$estr}
	,GuestAction: ($_=function(event,card) { return {_hx_index:1,event:event,card:card,__enum__:"nainJaune.client.Message",toString:$estr}; },$_._hx_name="GuestAction",$_.__params__ = ["event","card"],$_)
	,RoomJoin: {_hx_name:"RoomJoin",_hx_index:2,__enum__:"nainJaune.client.Message",toString:$estr}
	,RoomClose: ($_=function(reason) { return {_hx_index:3,reason:reason,__enum__:"nainJaune.client.Message",toString:$estr}; },$_._hx_name="RoomClose",$_.__params__ = ["reason"],$_)
	,RoomLaunch: ($_=function(money) { return {_hx_index:4,money:money,__enum__:"nainJaune.client.Message",toString:$estr}; },$_._hx_name="RoomLaunch",$_.__params__ = ["money"],$_)
	,GuestList: ($_=function(names,ids) { return {_hx_index:5,names:names,ids:ids,__enum__:"nainJaune.client.Message",toString:$estr}; },$_._hx_name="GuestList",$_.__params__ = ["names","ids"],$_)
	,GameUpdate: ($_=function(message) { return {_hx_index:6,message:message,__enum__:"nainJaune.client.Message",toString:$estr}; },$_._hx_name="GameUpdate",$_.__params__ = ["message"],$_)
	,CannotJoin: ($_=function(reason) { return {_hx_index:7,reason:reason,__enum__:"nainJaune.client.Message",toString:$estr}; },$_._hx_name="CannotJoin",$_.__params__ = ["reason"],$_)
	,CannotAct: ($_=function(reason) { return {_hx_index:8,reason:reason,__enum__:"nainJaune.client.Message",toString:$estr}; },$_._hx_name="CannotAct",$_.__params__ = ["reason"],$_)
};
nainJaune_client_Message.__constructs__ = [nainJaune_client_Message.GuestQuit,nainJaune_client_Message.GuestAction,nainJaune_client_Message.RoomJoin,nainJaune_client_Message.RoomClose,nainJaune_client_Message.RoomLaunch,nainJaune_client_Message.GuestList,nainJaune_client_Message.GameUpdate,nainJaune_client_Message.CannotJoin,nainJaune_client_Message.CannotAct];
var nainJaune_client_Role = $hxEnums["nainJaune.client.Role"] = { __ename__:true,__constructs__:null
	,None: {_hx_name:"None",_hx_index:0,__enum__:"nainJaune.client.Role",toString:$estr}
	,Local: {_hx_name:"Local",_hx_index:1,__enum__:"nainJaune.client.Role",toString:$estr}
	,Host: {_hx_name:"Host",_hx_index:2,__enum__:"nainJaune.client.Role",toString:$estr}
	,Guest: {_hx_name:"Guest",_hx_index:3,__enum__:"nainJaune.client.Role",toString:$estr}
};
nainJaune_client_Role.__constructs__ = [nainJaune_client_Role.None,nainJaune_client_Role.Local,nainJaune_client_Role.Host,nainJaune_client_Role.Guest];
var nainJaune_client_Guest = function(co,id,name) {
	this.co = co;
	this.id = co != null ? co.peer : id;
	this.name = name != null ? name : "MissingNo.";
};
nainJaune_client_Guest.__name__ = true;
var nainJaune_client_WebRenderer = $hx_exports["nainJaune"]["client"]["WebRenderer"] = function(c) {
	this.c = c;
};
nainJaune_client_WebRenderer.__name__ = true;
nainJaune_client_WebRenderer.prototype = {
	printElements: function(str,allign) {
		if(allign == null) {
			allign = "left";
		}
		if(allign != "right" && allign != "center" && allign != "left") {
			allign = "left";
		}
		if(str != "") {
			window.document.getElementById("display").innerHTML += "<p style='text-align: " + allign + ";'>" + str + "</p>";
		}
	}
	,clearElements: function() {
		window.document.getElementById("display").innerHTML = "";
	}
	,printOutput: function(str) {
		if(str == "") {
			return;
		}
		window.document.getElementById("log").innerHTML += "<p>" + str + "</p>";
		window.document.getElementById("log").scrollTop = window.document.getElementById("log").scrollHeight;
	}
	,clearOutput: function() {
		window.document.getElementById("log").innerHTML = "";
	}
	,printState: function(inGame) {
		if(inGame == null) {
			inGame = false;
		}
		if(inGame) {
			var tmp = Std.string(this.c.states[this.c.currentState]) + "<br>" + this.c.gameState + " | " + this.c.g.round + "<br>" + this.c.name + " | ";
			var tmp1 = Std.string(this.c.role);
			window.document.getElementById("state").innerHTML = tmp + tmp1;
		} else {
			var tmp = Std.string(this.c.states[this.c.currentState]) + "<br>" + this.c.name + " | ";
			var tmp1 = Std.string(this.c.role);
			window.document.getElementById("state").innerHTML = tmp + tmp1;
		}
	}
	,formatPlayerName: function(name) {
		return "<button class='player simple' disabled>" + name + "</button>";
	}
	,formatPlayer: function(player,isCurrent) {
		if(isCurrent == null) {
			isCurrent = false;
		}
		return "<button class='player " + (isCurrent ? " highlight' " : "' ") + "disabled>" + Std.string(player) + "</button>";
	}
	,formatCardRank: function(rank) {
		return "<button class='card' disabled >" + rank + "</button>";
	}
	,formatPlayableCard: function(player,card,i) {
		return "<button " + "class='card" + (card.suit < 2 ? " red" : " black") + "' " + "onclick='Main.jouer(Main.c.getCards(" + player + ")[" + i + "])'" + ">" + Std.string(card) + "</button>";
	}
	,formatCard: function(card) {
		if(card != null) {
			return "<button class='card" + (card.suit < 2 ? " red" : " black") + "' disabled>" + Std.string(card) + "</button>";
		} else {
			return "<button class='card' disabled >???</button>";
		}
	}
	,formatSweep: function(i,value,disable) {
		if(i >= 0 && i < 5) {
			var card = nainJaune_core_Game.sweeps[i];
			return "<button " + "class='card sweep" + (card.suit < 2 ? " red" : " black") + "' " + (disable ? "disabled " : "") + "onclick='Main.prendre(nainJaune.core.Game.sweeps[" + i + "])'" + ">" + Std.string(card) + " (" + value + ")" + "</button>";
		}
		return "<button class='card sweep' disabled >???</button>";
	}
	,formatValue: function(value) {
		return "<button class='value' disabled>" + value + "</button>";
	}
	,formatMoney: function(value) {
		return "<button class='value money' disabled>" + value + "</button>";
	}
	,printMenu: function() {
		this.printNameSelection();
		this.printElements("<button class='go' onclick='Main.createLocal()'>Local</button>","center");
		this.printElements("<button class='go' onclick='Main.createRoom()'>Créer</button>","center");
		this.printElements("<button class='go' onclick='Main.joinRoom(this.nextSibling.nextSibling.value);'>Rejoindre</button>" + "<br><input type='text' size='32' placeholder='enter host id'/>","center");
	}
	,printReturn: function() {
		this.printElements("<button class='go' onclick='Main.returnMenu()'>Retour au menu</button>","center");
	}
	,printNameSelection: function() {
		var elem = "Entrez votre nom : ";
		elem += "<input type='text' maxlength='10' size='12' placeholder='Entrez un nom...' value='" + this.c.name + "'";
		elem += "onchange='Main.c.name=this.value;'/>";
		this.printElements(elem,"center");
	}
	,printCreateLocal: function() {
		this.printElements("Entrez les noms d'au moins 3 joueurs :");
		var elem = "";
		var _g = 0;
		while(_g < 8) {
			var i = _g++;
			elem += (i != 0 ? "<span class='spacer small'></span>" : "") + "<input type='text' maxlength='10' size='12' placeholder='Entrez un nom...' value='" + (i == 0 && this.c.name.length > 0 ? this.c.name : nainJaune_client_Client.someNames[Math.random() * nainJaune_client_Client.someNames.length | 0]) + "'/>";
		}
		this.printElements(elem,"center");
		this.printElements("<button class='go' onclick='" + "Main.create([...document.getElementsByTagName(\"input\")].filter(elem=>elem.value!=\"\").map(elem=>elem.value));" + "Main.start();'>Créer la partie</button>","center");
	}
	,printConnectedPlayers: function(host) {
		if(host == null) {
			host = false;
		}
		this.printElements("Joueurs connectés :");
		var elem = "";
		elem += "<input type='text' disabled size='12' placeholder='personne' value='" + (0 < this.c.guests.length ? this.c.guests[0].name : "nope") + "'/>";
		elem += "<span class='spacer small'></span>" + "<input type='text' disabled size='12' placeholder='personne' value='" + (1 < this.c.guests.length ? this.c.guests[1].name : "nope") + "'/>";
		elem += "<span class='spacer small'></span>" + "<input type='text' disabled size='12' placeholder='personne' value='" + (2 < this.c.guests.length ? this.c.guests[2].name : "nope") + "'/>";
		elem += "<span class='spacer small'></span>" + "<input type='text' disabled size='12' placeholder='personne' value='" + (3 < this.c.guests.length ? this.c.guests[3].name : "nope") + "'/>";
		elem += "<span class='spacer small'></span>" + "<input type='text' disabled size='12' placeholder='personne' value='" + (4 < this.c.guests.length ? this.c.guests[4].name : "nope") + "'/>";
		elem += "<span class='spacer small'></span>" + "<input type='text' disabled size='12' placeholder='personne' value='" + (5 < this.c.guests.length ? this.c.guests[5].name : "nope") + "'/>";
		elem += "<span class='spacer small'></span>" + "<input type='text' disabled size='12' placeholder='personne' value='" + (6 < this.c.guests.length ? this.c.guests[6].name : "nope") + "'/>";
		elem += "<span class='spacer small'></span>" + "<input type='text' disabled size='12' placeholder='personne' value='" + (7 < this.c.guests.length ? this.c.guests[7].name : "nope") + "'/>";
		this.printElements(elem,"center");
		if(host) {
			this.printElements("<button class='go' onclick='Main.create();Main.start();'>Créer la partie</button>","center");
		}
	}
	,printHostId: function(host) {
		if(host == null) {
			host = false;
		}
		var elem = "<span id='peerId'>" + this.c.peer.id + "</span>";
		elem += "<button class=\"go\" onclick=\"";
		elem += "var r=document.createRange();";
		elem += "r.selectNode(document.getElementById('peerId'));";
		elem += "window.getSelection().removeAllRanges();";
		elem += "window.getSelection().addRange(r);";
		elem += "document.execCommand('copy');";
		elem += "window.getSelection().removeAllRanges();";
		elem += "this.innerHTML='Copié !';";
		elem += "setTimeout(()=>{this.innerHTML='Copier vote ID.';},1000);";
		elem += "\">Copier vote ID.</button>";
		this.printElements(elem,"center");
	}
	,printStartGame: function() {
		this.printElements("<button class='go' onclick='Main.go()'>Lancer la partie</button>","center");
	}
	,printStartRound: function() {
		this.printElements("<button class='go' onclick='Main.go()'>Démarer la manche</button>","center");
	}
	,printStopRound: function() {
		this.printElements("<button class='go' onclick='Main.go()'>Terminer la manche</button>","center");
	}
	,printStopGame: function() {
		this.printElements("<button class='go' onclick='Main.start()'>Relancer une partie</button>" + "<span class='spacer'></span>" + "<button class='go' onclick='Main.stop()'>Terminer la partie</button>","center");
	}
	,printBoard: function(values,next,disableAll) {
		if(disableAll == null) {
			disableAll = false;
		}
		var elem = "";
		var _g = 0;
		var _g1 = nainJaune_core_Game.sweeps.length;
		while(_g < _g1) {
			var i = _g++;
			elem += "<span class='spacer medium'></span>" + "<span class='back " + (!disableAll && next == i ? "highlight" : "") + "'>" + this.formatSweep(i,values[i],values[i] == 0 || disableAll) + "</span>";
		}
		this.printElements("Board:" + elem);
	}
	,printPlayers: function(players,currentPlayer) {
		var elem = "";
		var _g = 0;
		var _g1 = players.length;
		while(_g < _g1) {
			var i = _g++;
			if(i != 0) {
				elem += "<br>";
			}
			elem += "<span class='spacer'></span>" + this.formatPlayer(players[i],currentPlayer == i);
		}
		window.document.getElementById("players").innerHTML = elem;
	}
	,printNextCard: function(rank) {
		var elem = "<span class='spacer'></span>" + this.formatCardRank(rank == nainJaune_core_Card.ANY ? "Ø" : nainJaune_core_Card.RANKS[rank]);
		this.printElements("Next card:" + elem);
	}
	,printLastCard: function(card,player) {
		var elem = "<span class='spacer'></span>";
		if(card == null) {
			elem += this.formatCardRank("Ø");
		} else {
			elem += this.formatCard(card) + " by " + this.formatPlayerName(player.name);
		}
		this.printElements("Last card played:" + elem);
	}
	,printPlayerHand: function(player,nextRank,firstTurn) {
		var elem = "";
		var cards = this.c.getCards(player);
		if(cards.length > 0) {
			var canPlay;
			if(nextRank != nainJaune_core_Card.ANY) {
				var _g = [];
				var _g1 = 0;
				var _g2 = cards;
				while(_g1 < _g2.length) {
					var v = _g2[_g1];
					++_g1;
					if(v.rank == nextRank) {
						_g.push(v);
					}
				}
				canPlay = _g.length > 0;
			} else {
				canPlay = true;
			}
			elem += "<span class='spacer medium'></span>" + "<span class='back " + (!canPlay ? "highlight" : "") + "'>" + "<button class='skip' " + (nextRank == nainJaune_core_Card.ANY ? "disabled " : "") + "onclick='Main.passer()'>Passer</button>" + "</span>";
			var _g = 0;
			var _g1 = cards.length;
			while(_g < _g1) {
				var i = _g++;
				elem += "<span class='spacer small'></span>" + "<span class='back " + (nextRank == nainJaune_core_Card.ANY || cards[i].rank == nextRank ? "highlight" : "") + "'>" + this.formatPlayableCard(player,cards[i],i) + "</span>";
			}
		} else if(firstTurn) {
			elem = "<span class='spacer'></span>" + "<span class='back highlight'>" + "<button class='skip' onclick='Main.fin()'>Opéra</button>" + "</span>";
		} else {
			elem = "<span class='spacer'></span>" + "<span class='back highlight'>" + "<button class='skip' onclick='Main.fin()'>Fin</button>" + "</span>";
		}
		this.printElements("Cards:" + elem);
	}
	,printCheats: function() {
		this.printElements("<button class='skip' onclick='Main.jouer(null)'>J Null</button>" + "<span class='spacer medium'></span>" + "<button class='skip' onclick='Main.jouer(Main.c.g.deck.cards[0])'>J Wrong</button>" + "<span class='spacer medium'></span>" + "<button class='skip' onclick='Main.prendre(null)'>P Null</button>" + "<span class='spacer medium'></span>" + "<button class='skip' onclick='Main.prendre(Main.c.g.deck.cards[0])'>P Wrong</button>" + "<span class='spacer medium'></span>" + "<button class='skip' onclick='Main.passer()'>Passer</button>" + "<span class='spacer medium'></span>" + "<button class='skip' onclick='Main.fin()'>Fin</button>","right");
	}
};
var nainJaune_core_Card = function(rank,suit) {
	this.suit = nainJaune_core_Card.SUITS.indexOf(suit);
	this.rank = nainJaune_core_Card.RANKS.indexOf(rank);
	if(this.rank == -1 || this.suit == -1) {
		console.log("nainJaune/core/Card.hx:19:","carte invalide " + rank + " de " + suit + " (" + this.suit + " " + this.rank + ")");
	}
};
nainJaune_core_Card.__name__ = true;
nainJaune_core_Card.clone = function(card) {
	if(card == null) {
		return null;
	} else {
		return new nainJaune_core_Card(nainJaune_core_Card.RANKS[card.rank],nainJaune_core_Card.SUITS[card.suit]);
	}
};
nainJaune_core_Card.prototype = {
	toString: function() {
		return HxOverrides.substr(nainJaune_core_Card.RANKS[this.rank],0,this.rank < 10 ? 2 : 1) + " " + nainJaune_core_Card.SYMBOLS[this.suit];
	}
};
var nainJaune_core_Deck = function() {
	this.cards = nainJaune_core_Deck.DECK.slice();
};
nainJaune_core_Deck.__name__ = true;
nainJaune_core_Deck.prototype = {
	shuffle: function() {
		var index = this.cards.length;
		while(index != 0) {
			var rand = Math.random() * index-- | 0;
			var temp = this.cards[index];
			this.cards[index] = this.cards[rand];
			this.cards[rand] = temp;
		}
	}
};
var nainJaune_core_Game = $hx_exports["nainJaune"]["core"]["Game"] = function() {
	this.messages = [];
	this.cardsPlayed = [];
	this.nextSweep = -1;
	this.nextCard = nainJaune_core_Card.ANY;
	this.deck = null;
	this.board = [];
	this.lastPlayer = nainJaune_core_Player.NULL_ID;
	this.currentPlayer = nainJaune_core_Player.NULL_ID;
	this.dealer = nainJaune_core_Player.NULL_ID;
	this.players = [];
	this.firstTurn = false;
	this.round = -1;
	this.initialMoney = 0;
	fsm_FSM.call(this);
};
nainJaune_core_Game.__name__ = true;
nainJaune_core_Game.create = function(playerList,initialMoney) {
	var game = new nainJaune_core_Game();
	if(game.init(playerList,initialMoney)) {
		return game;
	}
	return null;
};
nainJaune_core_Game.cardOwned = function(card,player) {
	if(card.rank != nainJaune_core_Card.ANY) {
		var _g = [];
		var _g1 = 0;
		var _g2 = player.cards;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(nainJaune_core_Game.cardMatches(v,card)) {
				_g.push(v);
			}
		}
		return _g.length == 1;
	} else {
		return false;
	}
};
nainJaune_core_Game.rankMatches = function(card,rank) {
	if(rank != nainJaune_core_Card.ANY) {
		return card.rank == rank;
	} else {
		return true;
	}
};
nainJaune_core_Game.cardMatches = function(card,model) {
	if(model.rank == nainJaune_core_Card.ANY || card.rank == model.rank) {
		return card.suit == model.suit;
	} else {
		return false;
	}
};
nainJaune_core_Game.__super__ = fsm_FSM;
nainJaune_core_Game.prototype = $extend(fsm_FSM.prototype,{
	init: function(playerList,initialMoney) {
		var _gthis = this;
		if(playerList.length < 3 || playerList.length > 8) {
			return false;
		}
		var id = 0;
		var _g = [];
		var _g1 = 0;
		while(_g1 < playerList.length) {
			var name = playerList[_g1];
			++_g1;
			_g.push(new nainJaune_core_Player(id++,name));
		}
		this.players = _g;
		this.initialMoney = initialMoney;
		var gameStart = this.addState("Debut de partie",function() {
			_gthis.entryGameStart();
		});
		var roundStart = this.addState("Debut de manche",function() {
			_gthis.entryRoundStart();
		});
		var turn = this.addState("Debut de tour",function() {
			_gthis.entryTurn();
		});
		var roundEnd = this.addState("Fin de manche",function() {
			_gthis.entryRoundEnd();
		});
		var gameEnd = this.addState("Fin de partie",function() {
			_gthis.entryGameEnd();
		});
		this.setInitial(gameStart,function() {
			_gthis.messages.push(nainJaune_core_Message.GameInit);
		});
		this.setFinal(gameEnd);
		this.addTransition(gameStart,roundStart,"Go",null,null,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.startGame(args[0]);
		});
		this.addTransition(roundStart,turn,"Go",null,null,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.startRound(args[0],args[1]);
		});
		this.addTransition(roundEnd,roundStart,"Go",null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.players;
			while(_g1 < _g2.length) {
				var p = _g2[_g1];
				++_g1;
				if(p.money < 15) {
					_g.push(p);
				}
			}
			return _g.length == 0;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.nextRound();
		});
		this.addTransition(roundEnd,gameEnd,"Go",null,function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.players;
			while(_g1 < _g2.length) {
				var p = _g2[_g1];
				++_g1;
				if(p.money < 15) {
					_g.push(p);
				}
			}
			return _g.length != 0;
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.endGame();
		});
		this.addTransition(turn,turn,"Jouer",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer && args[1] != null && nainJaune_core_Game.cardOwned(args[1],_gthis.players[_gthis.currentPlayer])) {
				return nainJaune_core_Game.rankMatches(args[1],_gthis.nextCard);
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.playCard(args[1]);
		});
		this.addTransition(turn,turn,"Jouer",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer && args[1] != null && nainJaune_core_Game.cardOwned(args[1],_gthis.players[_gthis.currentPlayer])) {
				return !nainJaune_core_Game.rankMatches(args[1],_gthis.nextCard);
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotPlay(args[0],args[1],"Wrong"));
		});
		this.addTransition(turn,turn,"Jouer",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer && args[1] != null) {
				return !nainJaune_core_Game.cardOwned(args[1],_gthis.players[_gthis.currentPlayer]);
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotPlay(args[0],args[1],"NotOwned"));
		});
		this.addTransition(turn,turn,"Jouer",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer) {
				return args[1] == null;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotPlay(args[0],null,"NoTarget"));
		});
		this.addTransition(turn,turn,"Jouer",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.currentPlayer;
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotPlay(args[0],null,"NotTurn"));
		});
		this.addTransition(turn,turn,"Prendre",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer && args[1] != null && _gthis.nextSweep != -1) {
				return nainJaune_core_Game.cardMatches(args[1],nainJaune_core_Game.sweeps[_gthis.nextSweep]);
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.winSweep(_gthis.nextSweep);
		});
		this.addTransition(turn,turn,"Prendre",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer && args[1] != null && _gthis.nextSweep != -1) {
				return !nainJaune_core_Game.cardMatches(args[1],nainJaune_core_Game.sweeps[_gthis.nextSweep]);
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotWin(args[0],args[1],"Wrong"));
		});
		this.addTransition(turn,turn,"Prendre",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer && args[1] != null) {
				return _gthis.nextSweep == -1;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotWin(args[0],args[1],"NoSweep"));
		});
		this.addTransition(turn,turn,"Prendre",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer) {
				return args[1] == null;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotWin(args[0],null,"NoTarget"));
		});
		this.addTransition(turn,turn,"Prendre",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.currentPlayer;
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotWin(args[0],null,"NotTurn"));
		});
		this.addTransition(turn,turn,"Passer",null,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer && _gthis.nextCard != nainJaune_core_Card.ANY) {
				return _gthis.players[_gthis.currentPlayer].cards.length > 0;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.pass();
		});
		this.addTransition(turn,turn,"Passer",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer) {
				return _gthis.players[_gthis.currentPlayer].cards.length == 0;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotPass(args[0],"MustEnd"));
		});
		this.addTransition(turn,turn,"Passer",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer) {
				return _gthis.nextCard == nainJaune_core_Card.ANY;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotPass(args[0],"MustPlay"));
		});
		this.addTransition(turn,turn,"Passer",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.currentPlayer;
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotPass(args[0],"NotTurn"));
		});
		this.addTransition(turn,roundEnd,"Fin",null,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer) {
				return _gthis.players[_gthis.currentPlayer].cards.length == 0;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var _ = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){_[$i-0]=arguments[$i];}
			_gthis.endRound();
		});
		this.addTransition(turn,turn,"Fin",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			if(args[0] == _gthis.currentPlayer) {
				return _gthis.players[_gthis.currentPlayer].cards.length != 0;
			} else {
				return false;
			}
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotEnd(args[0],_gthis.round,"CardsLeft"));
		});
		this.addTransition(turn,turn,"Fin",true,function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			return args[0] != _gthis.currentPlayer;
		},function() {
			var $l=arguments.length;
			var args = new Array($l>0?$l-0:0);
			for(var $i=0;$i<$l;++$i){args[$i-0]=arguments[$i];}
			_gthis.messages.push(nainJaune_core_Message.CannotEnd(args[0],_gthis.round,"NotTurn"));
		});
		return true;
	}
	,entryGameStart: function() {
		this.deck = new nainJaune_core_Deck();
		this.cardsPlayed = [];
		var _g = [];
		var _g1 = 0;
		var _g2 = nainJaune_core_Game.sweeps.length;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(0);
		}
		this.board = _g;
		this.round = 0;
		this.firstTurn = false;
		this.nextCard = nainJaune_core_Card.ANY;
		this.nextSweep = -1;
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.money = this.initialMoney;
			p.cards = [];
		}
		this.dealer = this.currentPlayer = this.lastPlayer = nainJaune_core_Player.NULL_ID;
		this.messages.push(nainJaune_core_Message.GameReady);
	}
	,entryRoundStart: function() {
		this.firstTurn = false;
		this.nextCard = nainJaune_core_Card.ANY;
		this.nextSweep = -1;
		this.messages.push(nainJaune_core_Message.RoundReady(this.round,this.dealer));
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.money > 0) {
				this.board[0] += nainJaune_core_Game.sweepValues[0];
				p.money -= nainJaune_core_Game.sweepValues[0];
			} else {
				throw haxe_Exception.thrown("wtf");
			}
			if(p.money > 1) {
				this.board[1] += nainJaune_core_Game.sweepValues[1];
				p.money -= nainJaune_core_Game.sweepValues[1];
			} else {
				throw haxe_Exception.thrown("wtf");
			}
			if(p.money > 2) {
				this.board[2] += nainJaune_core_Game.sweepValues[2];
				p.money -= nainJaune_core_Game.sweepValues[2];
			} else {
				throw haxe_Exception.thrown("wtf");
			}
			if(p.money > 3) {
				this.board[3] += nainJaune_core_Game.sweepValues[3];
				p.money -= nainJaune_core_Game.sweepValues[3];
			} else {
				throw haxe_Exception.thrown("wtf");
			}
			if(p.money > 4) {
				this.board[4] += nainJaune_core_Game.sweepValues[4];
				p.money -= nainJaune_core_Game.sweepValues[4];
			} else {
				throw haxe_Exception.thrown("wtf");
			}
			this.messages.push(nainJaune_core_Message.PlayerBet(p.id,null,null,"Bet"));
		}
	}
	,entryTurn: function() {
		this.messages.push(nainJaune_core_Message.TurnStart(this.currentPlayer,this.players[this.currentPlayer].cards));
	}
	,entryRoundEnd: function() {
		if(this.firstTurn) {
			this.messages.push(nainJaune_core_Message.RoundOver(this.currentPlayer,this.round,"Opera"));
		} else {
			this.messages.push(nainJaune_core_Message.RoundOver(this.currentPlayer,this.round));
		}
		if(this.firstTurn) {
			var _g = 0;
			var _g1 = nainJaune_core_Game.sweeps.length;
			while(_g < _g1) {
				var sweepId = _g++;
				if(this.board[sweepId] != 0) {
					this.winSweep(sweepId,"Opera");
				}
			}
		}
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.id != this.currentPlayer) {
				var sum = 0;
				var _g2 = 0;
				var _g3 = p.cards;
				while(_g2 < _g3.length) {
					var c = _g3[_g2];
					++_g2;
					sum += c.rank < 10 ? c.rank + 1 : 10;
				}
				p.money -= sum;
				this.players[this.currentPlayer].money += sum;
				this.messages.push(nainJaune_core_Message.PlayerPay(p.id,this.currentPlayer,sum));
				if(p.money <= 0) {
					this.messages.push(nainJaune_core_Message.PlayerBankruptcy(p.id));
				}
				if(!this.firstTurn) {
					var _g4 = 0;
					var _g5 = nainJaune_core_Game.sweeps.length;
					while(_g4 < _g5) {
						var i = _g4++;
						var _g6 = 0;
						var _g7 = p.cards;
						while(_g6 < _g7.length) {
							var c1 = _g7[_g6];
							++_g6;
							if(nainJaune_core_Game.cardMatches(c1,nainJaune_core_Game.sweeps[i])) {
								var sum1 = this.board[i];
								p.money -= sum1;
								this.board[i] += sum1;
								this.messages.push(nainJaune_core_Message.PlayerBet(p.id,i,sum1,"Repay"));
								if(p.money <= 0) {
									this.messages.push(nainJaune_core_Message.PlayerBankruptcy(p.id));
								}
								break;
							}
						}
					}
				}
			}
		}
		this.messages.push(nainJaune_core_Message.CardStock(this.deck.cards,"End"));
	}
	,entryGameEnd: function() {
		var maxMoney = 0;
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(p.money > maxMoney) {
				maxMoney = p.money;
			}
		}
		var tmp = this.messages;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.players;
		while(_g1 < _g2.length) {
			var p = _g2[_g1];
			++_g1;
			if(p.money == maxMoney) {
				_g.push(p.id);
			}
		}
		tmp.push(nainJaune_core_Message.GameOver(_g));
	}
	,startGame: function(forcedDealer) {
		this.lastPlayer = this.currentPlayer = this.dealer = forcedDealer == null ? Math.random() * this.players.length | 0 : forcedDealer;
		this.round = 1;
		this.messages.push(nainJaune_core_Message.GameStart(this.dealer));
	}
	,startRound: function(forcedHands,forcedStock) {
		if(forcedHands == null && forcedStock == null) {
			this.deck.shuffle();
			var next = this.dealer;
			var _g = 0;
			var _g1 = nainJaune_core_Game.cardPerPlayer[this.players.length];
			while(_g < _g1) {
				var i = _g++;
				var _g2 = 0;
				var _g3 = this.players.length;
				while(_g2 < _g3) {
					var p = _g2++;
					++next;
					next %= this.players.length;
					this.players[next].cards.push(this.deck.cards.pop());
				}
			}
		} else {
			var _g = 0;
			var _g1 = forcedHands.length;
			while(_g < _g1) {
				var i = _g++;
				this.players[i].cards = forcedHands[i];
			}
			this.deck.cards = forcedStock;
		}
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			p.cards.sort(function(c1,c2) {
				if(c1.rank == c2.rank) {
					return c1.suit - c2.suit;
				} else {
					return c1.rank - c2.rank;
				}
			});
		}
		this.deck.cards.sort(function(c1,c2) {
			if(c1.rank == c2.rank) {
				return c1.suit - c2.suit;
			} else {
				return c1.rank - c2.rank;
			}
		});
		this.messages.push(nainJaune_core_Message.CardStock(this.deck.cards,"Start"));
		this.firstTurn = true;
		this.currentPlayer = ++this.currentPlayer == this.players.length ? 0 : this.currentPlayer;
		var tmp = this.messages;
		var tmp1 = this.round;
		var tmp2 = this.dealer;
		var _g = [];
		var _g1 = 0;
		var _g2 = this.players;
		while(_g1 < _g2.length) {
			var p = _g2[_g1];
			++_g1;
			_g.push(p.cards);
		}
		tmp.push(nainJaune_core_Message.RoundStart(tmp1,tmp2,_g,this.deck.cards));
	}
	,playCard: function(card) {
		if(this.nextSweep != -1) {
			this.messages.push(nainJaune_core_Message.SweepMiss(this.nextSweep,this.currentPlayer));
			this.nextSweep = -1;
		}
		var _g = [];
		var _g1 = 0;
		var _g2 = this.players[this.currentPlayer].cards;
		while(_g1 < _g2.length) {
			var c = _g2[_g1];
			++_g1;
			if(!nainJaune_core_Game.cardMatches(c,card)) {
				_g.push(c);
			}
		}
		this.players[this.currentPlayer].cards = _g;
		this.cardsPlayed.push(card);
		this.nextCard = card.rank == 12 ? nainJaune_core_Card.ANY : card.rank + 1;
		this.lastPlayer = this.currentPlayer;
		if(card.rank == nainJaune_core_Game.sweeps[0].rank && card.suit == nainJaune_core_Game.sweeps[0].suit) {
			this.nextSweep = 0;
		}
		if(card.rank == nainJaune_core_Game.sweeps[1].rank && card.suit == nainJaune_core_Game.sweeps[1].suit) {
			this.nextSweep = 1;
		}
		if(card.rank == nainJaune_core_Game.sweeps[2].rank && card.suit == nainJaune_core_Game.sweeps[2].suit) {
			this.nextSweep = 2;
		}
		if(card.rank == nainJaune_core_Game.sweeps[3].rank && card.suit == nainJaune_core_Game.sweeps[3].suit) {
			this.nextSweep = 3;
		}
		if(card.rank == nainJaune_core_Game.sweeps[4].rank && card.suit == nainJaune_core_Game.sweeps[4].suit) {
			this.nextSweep = 4;
		}
		this.messages.push(nainJaune_core_Message.CardPlay(util_ArrayExt.last(this.cardsPlayed),this.currentPlayer));
	}
	,winSweep: function(sweepId,type) {
		this.messages.push(nainJaune_core_Message.SweepWin(sweepId,this.currentPlayer,this.board[sweepId],type));
		this.players[this.currentPlayer].money += this.board[sweepId];
		this.board[sweepId] = 0;
		this.nextSweep = -1;
	}
	,pass: function() {
		if(this.nextSweep != -1) {
			this.messages.push(nainJaune_core_Message.SweepMiss(this.nextSweep,this.currentPlayer));
			this.nextSweep = -1;
		}
		this.messages.push(nainJaune_core_Message.PlayerPass(this.currentPlayer,this.nextCard));
		this.firstTurn = this.currentPlayer == this.dealer ? false : this.firstTurn;
		this.currentPlayer = ++this.currentPlayer == this.players.length ? 0 : this.currentPlayer;
		if(this.currentPlayer == this.lastPlayer) {
			this.nextCard = this.nextCard == 12 ? nainJaune_core_Card.ANY : this.nextCard + 1;
		}
	}
	,endRound: function() {
		if(!this.firstTurn && this.nextSweep != -1) {
			this.messages.push(nainJaune_core_Message.SweepMiss(this.nextSweep,this.currentPlayer));
		}
		this.messages.push(nainJaune_core_Message.PlayerEnd(this.currentPlayer,this.round));
	}
	,nextRound: function() {
		var _g = 0;
		var _g1 = this.players;
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			while(p.cards.length > 0) this.deck.cards.push(p.cards.pop());
		}
		while(this.cardsPlayed.length > 0) this.deck.cards.push(this.cardsPlayed.pop());
		this.round++;
		this.lastPlayer = this.currentPlayer = this.dealer = (this.dealer + 1) % this.players.length;
		this.messages.push(nainJaune_core_Message.RoundEnd(this.round));
	}
	,endGame: function() {
		var _g = [];
		var _g1 = 0;
		var _g2 = this.players;
		while(_g1 < _g2.length) {
			var p = _g2[_g1];
			++_g1;
			if(p.money < 15) {
				_g.push(p.id);
			}
		}
		var losers = _g;
		this.messages.push(nainJaune_core_Message.GameEnd(losers));
	}
});
var nainJaune_core_Message = $hxEnums["nainJaune.core.Message"] = { __ename__:true,__constructs__:null
	,GameInit: {_hx_name:"GameInit",_hx_index:0,__enum__:"nainJaune.core.Message",toString:$estr}
	,GameReady: {_hx_name:"GameReady",_hx_index:1,__enum__:"nainJaune.core.Message",toString:$estr}
	,GameStart: ($_=function(dealer) { return {_hx_index:2,dealer:dealer,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="GameStart",$_.__params__ = ["dealer"],$_)
	,GameEnd: ($_=function(losers) { return {_hx_index:3,losers:losers,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="GameEnd",$_.__params__ = ["losers"],$_)
	,GameOver: ($_=function(winners) { return {_hx_index:4,winners:winners,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="GameOver",$_.__params__ = ["winners"],$_)
	,RoundReady: ($_=function(round,dealer) { return {_hx_index:5,round:round,dealer:dealer,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="RoundReady",$_.__params__ = ["round","dealer"],$_)
	,RoundStart: ($_=function(round,dealer,hands,stock) { return {_hx_index:6,round:round,dealer:dealer,hands:hands,stock:stock,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="RoundStart",$_.__params__ = ["round","dealer","hands","stock"],$_)
	,RoundEnd: ($_=function(round) { return {_hx_index:7,round:round,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="RoundEnd",$_.__params__ = ["round"],$_)
	,RoundOver: ($_=function(round,player,type) { return {_hx_index:8,round:round,player:player,type:type,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="RoundOver",$_.__params__ = ["round","player","type"],$_)
	,TurnStart: ($_=function(player,cards) { return {_hx_index:9,player:player,cards:cards,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="TurnStart",$_.__params__ = ["player","cards"],$_)
	,PlayerBet: ($_=function(player,sweep,value,type) { return {_hx_index:10,player:player,sweep:sweep,value:value,type:type,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="PlayerBet",$_.__params__ = ["player","sweep","value","type"],$_)
	,PlayerPay: ($_=function(fromPlayer,toPlayer,value) { return {_hx_index:11,fromPlayer:fromPlayer,toPlayer:toPlayer,value:value,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="PlayerPay",$_.__params__ = ["fromPlayer","toPlayer","value"],$_)
	,PlayerBankruptcy: ($_=function(player) { return {_hx_index:12,player:player,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="PlayerBankruptcy",$_.__params__ = ["player"],$_)
	,PlayerPass: ($_=function(player,rank) { return {_hx_index:13,player:player,rank:rank,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="PlayerPass",$_.__params__ = ["player","rank"],$_)
	,PlayerEnd: ($_=function(player,round) { return {_hx_index:14,player:player,round:round,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="PlayerEnd",$_.__params__ = ["player","round"],$_)
	,CardStock: ($_=function(stock,type) { return {_hx_index:15,stock:stock,type:type,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="CardStock",$_.__params__ = ["stock","type"],$_)
	,CardPlay: ($_=function(card,player) { return {_hx_index:16,card:card,player:player,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="CardPlay",$_.__params__ = ["card","player"],$_)
	,SweepWin: ($_=function(sweep,player,value,type) { return {_hx_index:17,sweep:sweep,player:player,value:value,type:type,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="SweepWin",$_.__params__ = ["sweep","player","value","type"],$_)
	,SweepMiss: ($_=function(sweep,player) { return {_hx_index:18,sweep:sweep,player:player,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="SweepMiss",$_.__params__ = ["sweep","player"],$_)
	,CannotPlay: ($_=function(player,card,type) { return {_hx_index:19,player:player,card:card,type:type,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="CannotPlay",$_.__params__ = ["player","card","type"],$_)
	,CannotWin: ($_=function(player,card,type) { return {_hx_index:20,player:player,card:card,type:type,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="CannotWin",$_.__params__ = ["player","card","type"],$_)
	,CannotPass: ($_=function(player,type) { return {_hx_index:21,player:player,type:type,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="CannotPass",$_.__params__ = ["player","type"],$_)
	,CannotEnd: ($_=function(player,round,type) { return {_hx_index:22,player:player,round:round,type:type,__enum__:"nainJaune.core.Message",toString:$estr}; },$_._hx_name="CannotEnd",$_.__params__ = ["player","round","type"],$_)
};
nainJaune_core_Message.__constructs__ = [nainJaune_core_Message.GameInit,nainJaune_core_Message.GameReady,nainJaune_core_Message.GameStart,nainJaune_core_Message.GameEnd,nainJaune_core_Message.GameOver,nainJaune_core_Message.RoundReady,nainJaune_core_Message.RoundStart,nainJaune_core_Message.RoundEnd,nainJaune_core_Message.RoundOver,nainJaune_core_Message.TurnStart,nainJaune_core_Message.PlayerBet,nainJaune_core_Message.PlayerPay,nainJaune_core_Message.PlayerBankruptcy,nainJaune_core_Message.PlayerPass,nainJaune_core_Message.PlayerEnd,nainJaune_core_Message.CardStock,nainJaune_core_Message.CardPlay,nainJaune_core_Message.SweepWin,nainJaune_core_Message.SweepMiss,nainJaune_core_Message.CannotPlay,nainJaune_core_Message.CannotWin,nainJaune_core_Message.CannotPass,nainJaune_core_Message.CannotEnd];
var nainJaune_core_Player = function(id,name) {
	this.id = id;
	this.name = name;
	this.money = 0;
	this.cards = [];
};
nainJaune_core_Player.__name__ = true;
nainJaune_core_Player.prototype = {
	toString: function() {
		return this.id + ":" + this.name + "(" + this.money + ")";
	}
};
var util_ArrayExt = function() { };
util_ArrayExt.__name__ = true;
util_ArrayExt.last = function(a) {
	return a[a.length - 1];
};
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
nainJaune_client_Client.someNames = ["Red","Leaf","Luth","Célesta","Brice","Flora","Louka","Aurore","Ludwig","Ludvina","Mélis","Echo","Kalem","Serena","Elio","Selene","Victor","Gloria","Aurel","Lucia"];
nainJaune_core_Card.ANY = -1;
nainJaune_core_Card.SUITS = ["Coeur","Carreau","Trefle","Pique"];
nainJaune_core_Card.SYMBOLS = ["♥","♦","♣","♠","A"];
nainJaune_core_Card.RANKS = (function($this) {
	var $r;
	var _g = [];
	{
		_g.push("" + 1);
		_g.push("" + 2);
		_g.push("" + 3);
		_g.push("" + 4);
		_g.push("" + 5);
		_g.push("" + 6);
		_g.push("" + 7);
		_g.push("" + 8);
		_g.push("" + 9);
		_g.push("" + 10);
	}
	$r = _g.concat(["Valet","Dame","Roi"]);
	return $r;
}(this));
nainJaune_core_Deck.DECK = (function($this) {
	var $r;
	var _g = [];
	{
		var _g1 = 0;
		var _g2 = nainJaune_core_Card.SUITS;
		while(_g1 < _g2.length) {
			var s = _g2[_g1];
			++_g1;
			var _g3 = 0;
			var _g4 = nainJaune_core_Card.RANKS;
			while(_g3 < _g4.length) {
				var r = _g4[_g3];
				++_g3;
				_g.push(new nainJaune_core_Card(r,s));
			}
		}
	}
	$r = _g;
	return $r;
}(this));
nainJaune_core_Game.sweeps = [new nainJaune_core_Card("10","Carreau"),new nainJaune_core_Card("Valet","Trefle"),new nainJaune_core_Card("Dame","Pique"),new nainJaune_core_Card("Roi","Coeur"),new nainJaune_core_Card("7","Carreau")];
nainJaune_core_Game.sweepValues = (function($this) {
	var $r;
	var _g = [];
	{
		var _g1 = 0;
		var _g2 = nainJaune_core_Game.sweeps.length;
		while(_g1 < _g2) {
			var i = _g1++;
			_g.push(i + 1);
		}
	}
	$r = _g;
	return $r;
}(this));
nainJaune_core_Game.cardPerPlayer = [0,0,0,15,12,9,8,7,6];
nainJaune_core_Player.NULL_ID = -1;
Main.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, {});

//# sourceMappingURL=main.js.map
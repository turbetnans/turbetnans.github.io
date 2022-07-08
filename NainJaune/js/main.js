(function ($hx_exports, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var FSM = function() {
	this.initial = _$FSM_State.NULL_ID;
	this.currentState = _$FSM_State.NULL_ID;
	this.transitions = [];
	this.states = [];
	this.states = [];
	this.transitions = [];
};
FSM.__name__ = true;
FSM.prototype = {
	initialAction: function() {
	}
	,get_isRunning: function() {
		return this.currentState != _$FSM_State.NULL_ID;
	}
	,get_isFinished: function() {
		return this.states[this.currentState].isFinal;
	}
	,setInitial: function(initialState,action) {
		if(this.currentState != _$FSM_State.NULL_ID) {
			var msg = "[ERR]\t" + "setInitial\t" + "can't modify while running.";
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_State.NULL_ID;
		}
		if(this.states[initialState] == null) {
			var msg = "[ERR]\t" + "setInitial\t" + "invalid state." + "\n\t" + initialState;
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_State.NULL_ID;
		}
		this.initialAction = action != null ? action : function() {
		};
		return this.initial = initialState;
	}
	,addState: function(name,onEntry,onExit) {
		if(this.currentState != _$FSM_State.NULL_ID) {
			var msg = "[ERR]\t" + "addstate\t" + "can't modify while running.";
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_State.NULL_ID;
		}
		if(name == null || name == "") {
			var msg = "[ERR]\t" + "addstate\t" + "empty name." + "\n\t" + name;
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_State.NULL_ID;
		}
		var _g = 0;
		var _g1 = this.states;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			if(name == s.name) {
				var msg = "[ERR]\t" + "addstate\t" + "name already exists." + "\n\t" + name;
				haxe_Log.trace(msg == null ? "" : msg,null);
				return _$FSM_State.NULL_ID;
			}
		}
		var s = new _$FSM_State(name,this);
		s.onEntry = onEntry != null ? onEntry : function() {
		};
		s.onExit = onExit != null ? onExit : function() {
		};
		s.id = this.states.push(s) - 1;
		return s.id;
	}
	,addTransition: function(from,to,eventType,guard,action) {
		if(this.currentState != _$FSM_State.NULL_ID) {
			var msg = "[ERR]\t" + "addTransition\t" + "can't modify while running.";
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_Transition.NULL_ID;
		}
		if(eventType == null || eventType == "") {
			var msg = "[ERR]\t" + "addTransition\t" + "empty event." + "\n\t" + eventType;
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_Transition.NULL_ID;
		}
		if(this.states[from] == null || this.states[to] == null) {
			var msg = "[ERR]\t" + "addTransition\t" + "invalid state." + "\n\t" + from + " " + to;
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_Transition.NULL_ID;
		}
		if(this.states[from].isFinal) {
			var msg = "[ERR]\t" + "addTransition\t" + "transition from a final state." + "\n\t" + from;
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_Transition.NULL_ID;
		}
		var t = new _$FSM_Transition(from,to,eventType);
		t.guard = guard != null ? guard : function(_) {
			return true;
		};
		t.action = action != null ? action : function(_) {
		};
		t.id = this.transitions.push(t) - 1;
		this.states[from].transitions.push(t.id);
		return t.id;
	}
	,setFinal: function(state) {
		if(this.currentState != _$FSM_State.NULL_ID) {
			var msg = "[ERR]\t" + "setFinal\t" + "can't modify while running.";
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_State.NULL_ID;
		}
		if(this.states[state] == null) {
			var msg = "[ERR]\t" + "setFinal\t" + "invalid state." + "\n\t" + state;
			haxe_Log.trace(msg == null ? "" : msg,null);
			return _$FSM_State.NULL_ID;
		}
		var _g = 0;
		var _g1 = this.transitions;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.from == state) {
				var msg = "[ERR]\t" + "addTransition\t" + "transition is leaving the state." + "\n\t" + Std.string(t) + " " + state;
				haxe_Log.trace(msg == null ? "" : msg,null);
				return _$FSM_State.NULL_ID;
			}
		}
		this.states[state].isFinal = true;
		return state;
	}
	,getState: function(name) {
		var _g = 0;
		var _g1 = this.states;
		while(_g < _g1.length) {
			var s = _g1[_g];
			++_g;
			if(s != null && s.name == name) {
				return s.id;
			}
		}
		return _$FSM_State.NULL_ID;
	}
	,start: function() {
		if(this.initial == _$FSM_State.NULL_ID || this.states.length == 0 || this.transitions.length == 0) {
			var msg = "[ERR]\t" + "start\t" + "not fully initialized." + "\n\t" + this.initial + " " + this.states.length + " " + this.transitions.length;
			haxe_Log.trace(msg == null ? "" : msg,null);
			return false;
		}
		if(this.currentState != _$FSM_State.NULL_ID) {
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
		if(this.currentState == _$FSM_State.NULL_ID) {
			var msg = "[ERR]\t" + "stop\t" + "not started.";
			haxe_Log.trace(msg == null ? "" : msg,null);
			return false;
		}
		if(!this.states[this.currentState].isFinal && !forceStop) {
			var msg = "[ERR]\t" + "stop\t" + "not finished, use stop(true) to force stopping.";
			haxe_Log.trace(msg == null ? "" : msg,null);
			return false;
		}
		this.currentState = _$FSM_State.NULL_ID;
		return true;
	}
	,update: function(event) {
		if(this.currentState == _$FSM_State.NULL_ID) {
			var msg = "[ERR]\t" + "update\t" + "not started.";
			haxe_Log.trace(msg == null ? "" : msg,null);
			return false;
		}
		if(this.states[this.currentState] == null) {
			var msg = "[ERR]\t" + "update\t" + "invalid current state." + "\n\t" + this.currentState + " " + Std.string(this.states[this.currentState]);
			haxe_Log.trace(msg == null ? "" : msg,null);
			return false;
		}
		var _g = 0;
		var _g1 = this.states[this.currentState].transitions;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			var transition = this.transitions[t];
			if(transition != null && transition.eventType == event.type) {
				if(transition.guard(event)) {
					this.states[this.currentState].onExit();
					transition.action(event);
					this.currentState = transition.to;
					this.states[this.currentState].onEntry();
					return true;
				}
			}
		}
		return true;
	}
};
var _$FSM_State = function(name,fsm) {
	this.isFinal = false;
	this.transitions = [];
	this.name = "state";
	this.id = _$FSM_State.NULL_ID;
	this.fsm = null;
	this.name = name;
	this.fsm = fsm;
};
_$FSM_State.__name__ = true;
_$FSM_State.prototype = {
	onEntry: function() {
	}
	,onExit: function() {
	}
	,toString: function() {
		return (this.isFinal ? "Final-" : "") + "ST-" + this.id + "|" + this.name;
	}
};
var _$FSM_Transition = function(from,to,eventType) {
	this.eventType = null;
	this.to = _$FSM_Transition.NULL_ID;
	this.from = _$FSM_Transition.NULL_ID;
	this.id = _$FSM_Transition.NULL_ID;
	this.fsm = null;
	this.from = from;
	this.to = to;
	this.eventType = eventType;
};
_$FSM_Transition.__name__ = true;
_$FSM_Transition.prototype = {
	guard: function(e) {
		return true;
	}
	,action: function(e) {
	}
	,toString: function() {
		return "TR-" + this.id + "|" + this.eventType + ":" + this.from + "->" + this.to;
	}
};
var Event = function(type) {
	this.type = type;
};
Event.__name__ = true;
Event.prototype = {
	toString: function() {
		return "Event|" + this.type;
	}
};
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.formatOutput = function(v,infos) {
	var str = Std.string(v);
	if(infos == null) {
		return str;
	}
	var pstr = infos.fileName + ":" + infos.lineNumber;
	if(infos.customParams != null) {
		var _g = 0;
		var _g1 = infos.customParams;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			str += ", " + Std.string(v);
		}
	}
	return pstr + ": " + str;
};
haxe_Log.trace = function(v,infos) {
	var str = haxe_Log.formatOutput(v,infos);
	if(typeof(console) != "undefined" && console.log != null) {
		console.log(str);
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
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
			haxe_NativeStackTrace.lastError = _g;
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
var Card = function(rank,suit) {
	this.rank = Card.RANKS.indexOf(rank);
	this.suit = Card.SUITS.indexOf(suit);
	if(this.rank == -1 || this.suit == -1) {
		var msg = "carte invalide " + rank + " de " + suit + ".";
		haxe_Log.trace(msg == null ? "" : msg,null);
	}
};
Card.__name__ = true;
Card.prototype = {
	toString: function() {
		return HxOverrides.substr(Card.RANKS[this.rank],0,this.rank < 10 ? 2 : 1) + ["♥","♦","♣","♠"][this.suit];
	}
};
var Game = function() {
	this.cardsPlayed = [];
	this.nextSweep = -1;
	this.nextCard = Card.ANY;
	this.deck = null;
	this.board = [0,0,0,0,0];
	this.lastPlayer = -1;
	this.currentPlayer = -1;
	this.dealer = -1;
	this.players = [];
	this.firstTurn = false;
	this.round = -1;
	FSM.call(this);
};
Game.__name__ = true;
Game.cardOwned = function(card,player) {
	return player.cards.indexOf(card) != -1;
};
Game.rankMatches = function(card,rank) {
	if(rank != Card.ANY) {
		return card.rank == rank;
	} else {
		return true;
	}
};
Game.cardMatches = function(card,model) {
	if(model.rank == Card.ANY || card.rank == model.rank) {
		return card.suit == model.suit;
	} else {
		return false;
	}
};
Game.create = function(playerList) {
	var game = new Game();
	if(game.init(playerList)) {
		return game;
	}
	return null;
};
Game.__super__ = FSM;
Game.prototype = $extend(FSM.prototype,{
	update: function(e) {
		try {
			return FSM.prototype.update.call(this,e);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			var msg = "Err: " + Std.string(e);
			haxe_Log.trace(msg == null ? "" : msg,null);
			var msg = "Err: " + Std.string(haxe_CallStack.exceptionStack());
			haxe_Log.trace(msg == null ? "" : msg,null);
			return false;
		}
	}
	,init: function(playerList) {
		var _gthis = this;
		if(playerList.length < 3 || playerList.length > 8) {
			return false;
		}
		var _g = [];
		var _g1 = 0;
		while(_g1 < playerList.length) {
			var name = playerList[_g1];
			++_g1;
			_g.push(new _$Game_Player(name));
		}
		this.players = _g;
		var gameStart = this.addState("Debut de partie",function() {
			haxe_Log.trace("La partie commence !",null);
		});
		var roundStart = this.addState("Debut de manche",function() {
			var msg = "Le round n°" + _gthis.round + " commence !";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		var turn = this.addState("Debut de tour",function() {
			var msg = "A " + _gthis.players[_gthis.currentPlayer].name + " de jouer !";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		var roundEnd = this.addState("Fin de manche",function() {
			var msg = "Le round n°" + _gthis.round + " est terminé !";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		var gameEnd = this.addState("Fin de partie",function() {
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.players.length;
			while(_g1 < _g2) {
				var i = _g1++;
				if(_gthis.players[i].money < 15) {
					_g.push(i);
				}
			}
			var losers = _g;
			var maxMoney = 0;
			var _g = 0;
			var _g1 = _gthis.players;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(p.money > maxMoney) {
					maxMoney = p.money;
				}
			}
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.players.length;
			while(_g1 < _g2) {
				var i = _g1++;
				if(_gthis.players[i].money == maxMoney) {
					_g.push(i);
				}
			}
			var winners = _g;
			if(losers.length == 1) {
				var msg = "[GAME]\t" + "le perdant est n°" + losers[0] + " " + _gthis.players[losers[0]].name + " (" + _gthis.players[losers[0]].money + ")" + ".";
				haxe_Log.trace(msg == null ? "" : msg,null);
			} else {
				var msg = "[GAME]\t" + "les perdants sont ";
				var _g = [];
				var _g1 = 0;
				var _g2 = losers.length;
				while(_g1 < _g2) {
					var i = _g1++;
					_g.push("n°" + losers[i] + " " + _gthis.players[losers[i]].name + " (" + _gthis.players[losers[i]].money + ")");
				}
				var msg1 = msg + _g.join(", ") + ".";
				haxe_Log.trace(msg1 == null ? "" : msg1,null);
			}
			if(winners.length == 1) {
				var msg = "[GAME]\t" + "le gagnant est n°" + winners[0] + " " + _gthis.players[winners[0]].name + " (" + _gthis.players[winners[0]].money + ")" + ".";
				haxe_Log.trace(msg == null ? "" : msg,null);
			} else {
				var msg = "[GAME]\t" + "les gagnants sont ";
				var _g = [];
				var _g1 = 0;
				var _g2 = winners.length;
				while(_g1 < _g2) {
					var i = _g1++;
					_g.push("n°" + winners[i] + " " + _gthis.players[winners[i]].name + " (" + _gthis.players[winners[i]].money + ")");
				}
				var msg1 = msg + _g.join(", ") + ".";
				haxe_Log.trace(msg1 == null ? "" : msg1,null);
			}
			var msg = "[GAME]\t" + "la partie a duré " + (_gthis.round + 1) + " manches.";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.setInitial(gameStart,function() {
			var msg = "[GAME]\t" + "partie créée";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.setFinal(gameEnd);
		this.addTransition(gameStart,roundStart,"Go",null,function(_) {
			_gthis.deck = new Deck();
			var _g = 0;
			var _g1 = _gthis.players;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				p.money = Game.initialMoney;
				p.cards = [];
			}
			var tmp = Math.random() * _gthis.players.length | 0;
			_gthis.dealer = tmp;
			_gthis.currentPlayer = (_gthis.dealer + 1) % _gthis.players.length;
			_gthis.lastPlayer = _gthis.currentPlayer;
			var _g = [];
			_g.push(0);
			_g.push(0);
			_g.push(0);
			_g.push(0);
			_g.push(0);
			_gthis.board = _g;
			_gthis.round = 0;
			var msg = "[GAME]\t" + "round: " + _gthis.round + " |\t" + "joueurs: ";
			var _g = [];
			var _g1 = 0;
			var _g2 = _gthis.players;
			while(_g1 < _g2.length) {
				var p = _g2[_g1];
				++_g1;
				_g.push(p.name + "(" + p.money + ")");
			}
			var msg1 = msg + Std.string(_g) + ".";
			haxe_Log.trace(msg1 == null ? "" : msg1,null);
			var msg = "[GAME]\t" + "dealer: n°" + _gthis.dealer + " " + _gthis.players[_gthis.dealer].name + " |\t" + "actuel: " + (_gthis.currentPlayer == -1 ? "null" : "n°" + _gthis.currentPlayer + " " + _gthis.players[_gthis.currentPlayer].name) + ".";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.addTransition(roundStart,turn,"Go",null,function(_) {
			var _g = 0;
			var _g1 = _gthis.players;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(p.money > 0) {
					_gthis.board[0] += 1;
					p.money -= 1;
				} else {
					var msg = "[ERR]\t" + "game should be finished";
					haxe_Log.trace(msg == null ? "" : msg,null);
					throw haxe_Exception.thrown("wtf");
				}
				if(p.money > 1) {
					_gthis.board[1] += 2;
					p.money -= 2;
				} else {
					var msg1 = "[ERR]\t" + "game should be finished";
					haxe_Log.trace(msg1 == null ? "" : msg1,null);
					throw haxe_Exception.thrown("wtf");
				}
				if(p.money > 2) {
					_gthis.board[2] += 3;
					p.money -= 3;
				} else {
					var msg2 = "[ERR]\t" + "game should be finished";
					haxe_Log.trace(msg2 == null ? "" : msg2,null);
					throw haxe_Exception.thrown("wtf");
				}
				if(p.money > 3) {
					_gthis.board[3] += 4;
					p.money -= 4;
				} else {
					var msg3 = "[ERR]\t" + "game should be finished";
					haxe_Log.trace(msg3 == null ? "" : msg3,null);
					throw haxe_Exception.thrown("wtf");
				}
				if(p.money > 4) {
					_gthis.board[4] += 5;
					p.money -= 5;
				} else {
					var msg4 = "[ERR]\t" + "game should be finished";
					haxe_Log.trace(msg4 == null ? "" : msg4,null);
					throw haxe_Exception.thrown("wtf");
				}
			}
			_gthis.firstTurn = true;
			_gthis.deck.shuffle();
			var next = _gthis.currentPlayer;
			var _g = 0;
			var _g1 = Game.cartesParJoueur[_gthis.players.length];
			while(_g < _g1) {
				var i = _g++;
				var _g2 = 0;
				var _g3 = _gthis.players.length;
				while(_g2 < _g3) {
					var p = _g2++;
					_gthis.players[next].cards.push(_gthis.deck.cards.pop());
					++next;
					next %= _gthis.players.length;
				}
			}
			var _g = 0;
			var _g1 = _gthis.players;
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
			_gthis.deck.cards.sort(function(c1,c2) {
				if(c1.rank == c2.rank) {
					return c1.suit - c2.suit;
				} else {
					return c1.rank - c2.rank;
				}
			});
			_gthis.nextCard = Card.ANY;
			_gthis.nextSweep = -1;
		});
		this.addTransition(roundEnd,roundStart,"Go",function(_) {
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
		},function(_) {
			var msg = "[GAME]\t" + "tous les joueurs peuvent payer, passage à la prochaine manche.";
			haxe_Log.trace(msg == null ? "" : msg,null);
			var _g = 0;
			var _g1 = _gthis.players;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				_gthis.deck.cards = _gthis.deck.cards.concat(p.cards);
				p.cards = [];
			}
			_gthis.deck.cards = _gthis.deck.cards.concat(_gthis.cardsPlayed);
			_gthis.cardsPlayed = [];
			_gthis.dealer = (_gthis.dealer + 1) % _gthis.players.length;
			_gthis.currentPlayer = (_gthis.dealer + 1) % _gthis.players.length;
			_gthis.lastPlayer = _gthis.currentPlayer;
			_gthis.round++;
		});
		this.addTransition(roundEnd,gameEnd,"Go",function(_) {
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
		},function(_) {
			var msg = "[GAME]\t" + "au moins un joueur ne peut plus payer, fin de la partie.";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.addTransition(turn,turn,"Jouer",function(e) {
			if(Game.cardOwned(e.card,_gthis.players[_gthis.currentPlayer])) {
				return Game.rankMatches(e.card,_gthis.nextCard);
			} else {
				return false;
			}
		},function(e) {
			var card = e.card;
			var cards = _gthis.players[_gthis.currentPlayer].cards;
			if(_gthis.nextSweep != -1) {
				var msg = "Oubli de " + Std.string(Game.sweeps[_gthis.nextSweep]);
				haxe_Log.trace(msg == null ? "" : msg,null);
			}
			if(_gthis.nextSweep != -1) {
				_gthis.nextSweep = -1;
			}
			HxOverrides.remove(cards,card);
			_gthis.cardsPlayed.push(card);
			_gthis.nextCard = card.rank == 12 ? Card.ANY : card.rank + 1;
			_gthis.lastPlayer = _gthis.currentPlayer;
			if(card.rank == Game.sweeps[0].rank && card.suit == Game.sweeps[0].suit) {
				_gthis.nextSweep = 0;
			}
			if(card.rank == Game.sweeps[1].rank && card.suit == Game.sweeps[1].suit) {
				_gthis.nextSweep = 1;
			}
			if(card.rank == Game.sweeps[2].rank && card.suit == Game.sweeps[2].suit) {
				_gthis.nextSweep = 2;
			}
			if(card.rank == Game.sweeps[3].rank && card.suit == Game.sweeps[3].suit) {
				_gthis.nextSweep = 3;
			}
			if(card.rank == Game.sweeps[4].rank && card.suit == Game.sweeps[4].suit) {
				_gthis.nextSweep = 4;
			}
			var msg = "[GAME]\t" + "carte jouée par n°" + _gthis.lastPlayer + " " + _gthis.players[_gthis.lastPlayer].name + ": " + Std.string(_gthis.cardsPlayed[_gthis.cardsPlayed.length - 1]) + (_gthis.nextSweep != -1 ? " (prise)." : ".");
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.addTransition(turn,turn,"Jouer",function(e) {
			if(Game.cardOwned(e.card,_gthis.players[_gthis.currentPlayer])) {
				return !Game.rankMatches(e.card,_gthis.nextCard);
			} else {
				return true;
			}
		},function(e) {
			if(!Game.cardOwned(e.card,_gthis.players[_gthis.currentPlayer])) {
				var msg = "[GAME]\t" + "pas dans la main.";
				haxe_Log.trace(msg == null ? "" : msg,null);
			} else if(!Game.rankMatches(e.card,_gthis.nextCard)) {
				var msg = "[GAME]\t" + "pas la bonne valeur.";
				haxe_Log.trace(msg == null ? "" : msg,null);
			} else {
				var msg = "[GAME]\t" + "err carte.";
				haxe_Log.trace(msg == null ? "" : msg,null);
			}
		});
		this.addTransition(turn,turn,"Jouer",null,function(_) {
			haxe_Log.trace("wtf",null);
		});
		this.addTransition(turn,turn,"Prendre",function(e) {
			if(_gthis.nextSweep != -1) {
				return Game.cardMatches(e.card,Game.sweeps[_gthis.nextSweep]);
			} else {
				return false;
			}
		},function(_) {
			var msg = "[GAME]\t" + "prise de \"" + Std.string(Game.sweeps[_gthis.nextSweep]) + "\"" + " par n°" + _gthis.currentPlayer + " " + _gthis.players[_gthis.currentPlayer].name + " pour " + _gthis.board[_gthis.nextSweep] + " (" + _gthis.players[_gthis.currentPlayer].money + "->" + (_gthis.players[_gthis.currentPlayer].money + _gthis.board[_gthis.nextSweep]) + ").";
			haxe_Log.trace(msg == null ? "" : msg,null);
			_gthis.players[_gthis.currentPlayer].money += _gthis.board[_gthis.nextSweep];
			_gthis.board[_gthis.nextSweep] = 0;
			_gthis.nextSweep = -1;
		});
		this.addTransition(turn,turn,"Prendre",function(e) {
			if(_gthis.nextSweep != -1) {
				return !Game.cardMatches(e.card,Game.sweeps[_gthis.nextSweep]);
			} else {
				return false;
			}
		},function(e) {
			var msg = "[GAME]\t" + "pas la bonne carte.";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.addTransition(turn,turn,"Prendre",function(_) {
			return _gthis.nextSweep == -1;
		},function(_) {
			var msg = "[GAME]\t" + "pas de prise.";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.addTransition(turn,turn,"Prendre",null,function(_) {
			haxe_Log.trace("wtf",null);
		});
		this.addTransition(turn,turn,"Passer",function(_) {
			if(_gthis.nextCard == Card.ANY) {
				return _gthis.players[_gthis.currentPlayer].cards.length > 0;
			} else {
				return false;
			}
		},function(_) {
			var msg = "[GAME]\t" + "le joueur actuel doit jouer une carte.";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.addTransition(turn,turn,"Passer",function(_) {
			if(_gthis.nextCard != Card.ANY) {
				return _gthis.players[_gthis.currentPlayer].cards.length > 0;
			} else {
				return false;
			}
		},function(_) {
			var msg = "[GAME]\t" + "sans " + Card.RANKS[_gthis.nextCard] + ".";
			haxe_Log.trace(msg == null ? "" : msg,null);
			if(_gthis.nextSweep != -1) {
				var msg = "[GAME]\t" + "oubli de \"" + Std.string(Game.sweeps[_gthis.nextSweep]) + "\"";
				haxe_Log.trace(msg == null ? "" : msg,null);
				_gthis.nextSweep = -1;
			}
			_gthis.firstTurn = _gthis.currentPlayer == _gthis.dealer ? false : _gthis.firstTurn;
			_gthis.currentPlayer = ++_gthis.currentPlayer == _gthis.players.length ? 0 : _gthis.currentPlayer;
			if(_gthis.currentPlayer == _gthis.lastPlayer) {
				_gthis.nextCard = _gthis.nextCard == 12 ? Card.ANY : _gthis.nextCard + 1;
			}
		});
		this.addTransition(turn,turn,"Passer",function(_) {
			return _gthis.players[_gthis.currentPlayer].cards.length == 0;
		},function(_) {
			var msg = "[GAME]\t" + "la partie doit se finir.";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.addTransition(turn,turn,"Passer",null,function(_) {
			haxe_Log.trace("wtf",null);
		});
		this.addTransition(turn,turn,"Fin",function(_) {
			return _gthis.players[_gthis.currentPlayer].cards.length != 0;
		},function(_) {
			var msg = "[GAME]\t" + "le joueur actuel a encore des cartes en main.";
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.addTransition(turn,roundEnd,"Fin",function(_) {
			return _gthis.players[_gthis.currentPlayer].cards.length == 0;
		},function(_) {
			if(_gthis.firstTurn) {
				var msg = "[GAME]\t" + "Grand Opéra par n°" + _gthis.currentPlayer + " " + _gthis.players[_gthis.currentPlayer].name + ".";
				haxe_Log.trace(msg == null ? "" : msg,null);
				var _g = 0;
				var _g1 = _gthis.players.length;
				while(_g < _g1) {
					var i = _g++;
					if(i != _gthis.currentPlayer) {
						var sum = 0;
						var _g2 = 0;
						var _g3 = _gthis.players[i].cards;
						while(_g2 < _g3.length) {
							var c = _g3[_g2];
							++_g2;
							sum += c.rank < 10 ? c.rank + 1 : 10;
						}
						var msg = "[GAME]\t" + _gthis.players[i].name + " paye " + sum + " (" + _gthis.players[i].money + "->" + (sum < _gthis.players[i].money ? "" + (_gthis.players[i].money - sum) : "ruine") + ")" + " à " + _gthis.players[_gthis.currentPlayer].name + ".";
						haxe_Log.trace(msg == null ? "" : msg,null);
						sum = Math.min(_gthis.players[i].money,sum) | 0;
						_gthis.players[i].money -= sum;
						_gthis.players[_gthis.currentPlayer].money += sum;
					}
				}
				var _g = 0;
				var _g1 = Game.sweeps.length;
				while(_g < _g1) {
					var i = _g++;
					var msg = "[GAME]\t" + "prise de \"" + Std.string(Game.sweeps[i]) + "\"" + " par " + _gthis.players[_gthis.currentPlayer].name + " pour " + _gthis.board[i] + " (" + _gthis.players[_gthis.currentPlayer].money + "->" + (_gthis.players[_gthis.currentPlayer].money + _gthis.board[i]) + ").";
					haxe_Log.trace(msg == null ? "" : msg,null);
					_gthis.players[_gthis.currentPlayer].money += _gthis.board[i];
					_gthis.board[i] = 0;
				}
			} else {
				var msg = "[GAME]\t" + "manche remportée par n°" + _gthis.currentPlayer + " " + _gthis.players[_gthis.currentPlayer].name + ".";
				haxe_Log.trace(msg == null ? "" : msg,null);
				if(_gthis.nextSweep != -1) {
					var msg = "[GAME]\t" + "oubli de \"" + Std.string(Game.sweeps[_gthis.nextSweep]) + "\"";
					haxe_Log.trace(msg == null ? "" : msg,null);
				}
				var _g = 0;
				var _g1 = _gthis.players.length;
				while(_g < _g1) {
					var i = _g++;
					if(i != _gthis.currentPlayer) {
						var sum = 0;
						var _g2 = 0;
						var _g3 = _gthis.players[i].cards;
						while(_g2 < _g3.length) {
							var c = _g3[_g2];
							++_g2;
							sum += c.rank < 10 ? c.rank + 1 : 10;
						}
						var msg = "[GAME]\t" + _gthis.players[i].name + " paye " + sum + " (" + _gthis.players[i].money + "->" + (sum < _gthis.players[i].money ? "" + (_gthis.players[i].money - sum) : "ruine") + ")" + " à " + _gthis.players[_gthis.currentPlayer].name + ".";
						haxe_Log.trace(msg == null ? "" : msg,null);
						sum = Math.min(_gthis.players[i].money,sum) | 0;
						_gthis.players[i].money -= sum;
						_gthis.players[_gthis.currentPlayer].money += sum;
						var _g4 = 0;
						var _g5 = Game.sweeps.length;
						while(_g4 < _g5) {
							var j = _g4++;
							var _g6 = 0;
							var _g7 = _gthis.players[i].cards;
							while(_g6 < _g7.length) {
								var c1 = _g7[_g6];
								++_g6;
								if(Game.cardMatches(c1,Game.sweeps[j])) {
									var sum1 = _gthis.board[j];
									var msg1 = "[GAME]\t" + _gthis.players[i].name + " double la mise de " + Std.string(Game.sweeps[j]) + " pour " + sum1 + " (" + _gthis.players[i].money + "->" + (sum1 < _gthis.players[i].money ? "" + (_gthis.players[i].money - sum1) : "ruine") + ").";
									haxe_Log.trace(msg1 == null ? "" : msg1,null);
									sum1 = Math.min(_gthis.players[i].money,sum1) | 0;
									_gthis.players[i].money -= sum1;
									_gthis.board[j] += sum1;
									break;
								}
							}
						}
					}
				}
			}
			var msg = "[GAME]\t" + "talon: " + Std.string(_gthis.deck.cards);
			haxe_Log.trace(msg == null ? "" : msg,null);
		});
		this.addTransition(turn,turn,"Fin",null,function(_) {
			haxe_Log.trace("wtf",null);
		});
		return true;
	}
});
var _$Game_Player = function(name) {
	this.name = name;
	this.money = 0;
	this.cards = [];
};
_$Game_Player.__name__ = true;
_$Game_Player.prototype = {
	toString: function() {
		return this.name + "(" + this.money + ")";
	}
};
var MyEvent = function(t,c) {
	Event.call(this,t);
	this.card = c;
};
MyEvent.__name__ = true;
MyEvent.__super__ = Event;
MyEvent.prototype = $extend(Event.prototype,{
});
var Deck = function(is32) {
	if(is32 == null) {
		is32 = false;
	}
	if(is32) {
		this.cards = Card.ALL32.slice();
	} else {
		this.cards = Card.ALL56.slice();
	}
};
Deck.__name__ = true;
Deck.prototype = {
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
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
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
var Log = function() { };
Log.__name__ = true;
Log.log = function(msg) {
	haxe_Log.trace(msg == null ? "" : msg,null);
};
var Main = $hx_exports["Main"] = function() { };
Main.__name__ = true;
Main.start = function() {
	Main.g.start();
};
Main.stop = function() {
	Main.g.stop(true);
};
Main.getState = function() {
	return Main.g.states[Main.g.currentState];
};
Main.getCards = function() {
	return Main.g.players[Main.g.currentPlayer].cards;
};
Main.getBoard = function() {
	return Main.g.board;
};
Main.getSweeps = function() {
	return Game.sweeps;
};
Main.getPlayers = function() {
	return Main.g.players;
};
Main.getCurrentPlayer = function() {
	return Main.g.players[Main.g.currentPlayer];
};
Main.getNextCard = function() {
	if(Main.g.nextCard == Card.ANY) {
		return null;
	} else {
		return Card.RANKS[Main.g.nextCard];
	}
};
Main.getLastCard = function() {
	if(Main.g.cardsPlayed.length != 0) {
		return Main.g.cardsPlayed[Main.g.cardsPlayed.length - 1];
	} else {
		return null;
	}
};
Main.getLastPlayer = function() {
	return Main.g.players[Main.g.lastPlayer];
};
Main.getNextSweep = function() {
	if(Main.g.nextSweep != -1) {
		return Game.sweeps[Main.g.nextSweep];
	} else {
		return null;
	}
};
Main.getRank = function(card) {
	return Card.RANKS[card.rank];
};
Main.getSuit = function(card) {
	return Card.SUITS[card.suit];
};
Main.go = function() {
	Main.g.update(new MyEvent("Go"));
};
Main.jouer = function(card) {
	Main.g.update(new MyEvent("Jouer",card));
};
Main.passer = function() {
	Main.g.update(new MyEvent("Passer"));
};
Main.prendre = function(card) {
	Main.g.update(new MyEvent("Prendre",card));
};
Main.fin = function() {
	Main.g.update(new MyEvent("Fin"));
};
Main.cheat = function() {
	var card = Main.g.players[Main.g.currentPlayer].cards.pop();
	while(Main.g.players[Main.g.currentPlayer].cards.length != 0) Main.g.cardsPlayed.push(Main.g.players[Main.g.currentPlayer].cards.pop());
	Main.g.players[Main.g.currentPlayer].cards = [card];
};
Main.main = function() {
	if((Main.g = Game.create(["Léa","Marion","Vince","Michel","Sam"])) == null) {
		haxe_Log.trace("err",null);
		return;
	}
	haxe_Log.trace = function(v,infos) {
		JsOutput.print(v);
	};
};
Math.__name__ = true;
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
var haxe_StackItem = $hxEnums["haxe.StackItem"] = { __ename__:true,__constructs__:null
	,CFunction: {_hx_name:"CFunction",_hx_index:0,__enum__:"haxe.StackItem",toString:$estr}
	,Module: ($_=function(m) { return {_hx_index:1,m:m,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="Module",$_.__params__ = ["m"],$_)
	,FilePos: ($_=function(s,file,line,column) { return {_hx_index:2,s:s,file:file,line:line,column:column,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="FilePos",$_.__params__ = ["s","file","line","column"],$_)
	,Method: ($_=function(classname,method) { return {_hx_index:3,classname:classname,method:method,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="Method",$_.__params__ = ["classname","method"],$_)
	,LocalFunction: ($_=function(v) { return {_hx_index:4,v:v,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="LocalFunction",$_.__params__ = ["v"],$_)
};
haxe_StackItem.__constructs__ = [haxe_StackItem.CFunction,haxe_StackItem.Module,haxe_StackItem.FilePos,haxe_StackItem.Method,haxe_StackItem.LocalFunction];
var haxe_CallStack = {};
haxe_CallStack.callStack = function() {
	return haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.callStack());
};
haxe_CallStack.exceptionStack = function(fullStack) {
	if(fullStack == null) {
		fullStack = false;
	}
	var eStack = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.exceptionStack());
	return fullStack ? eStack : haxe_CallStack.subtract(eStack,haxe_CallStack.callStack());
};
haxe_CallStack.subtract = function(this1,stack) {
	var startIndex = -1;
	var i = -1;
	while(++i < this1.length) {
		var _g = 0;
		var _g1 = stack.length;
		while(_g < _g1) {
			var j = _g++;
			if(haxe_CallStack.equalItems(this1[i],stack[j])) {
				if(startIndex < 0) {
					startIndex = i;
				}
				++i;
				if(i >= this1.length) {
					break;
				}
			} else {
				startIndex = -1;
			}
		}
		if(startIndex >= 0) {
			break;
		}
	}
	if(startIndex >= 0) {
		return this1.slice(0,startIndex);
	} else {
		return this1;
	}
};
haxe_CallStack.equalItems = function(item1,item2) {
	if(item1 == null) {
		if(item2 == null) {
			return true;
		} else {
			return false;
		}
	} else {
		switch(item1._hx_index) {
		case 0:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 0) {
				return true;
			} else {
				return false;
			}
			break;
		case 1:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 1) {
				var m2 = item2.m;
				var m1 = item1.m;
				return m1 == m2;
			} else {
				return false;
			}
			break;
		case 2:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 2) {
				var item21 = item2.s;
				var file2 = item2.file;
				var line2 = item2.line;
				var col2 = item2.column;
				var col1 = item1.column;
				var line1 = item1.line;
				var file1 = item1.file;
				var item11 = item1.s;
				if(file1 == file2 && line1 == line2 && col1 == col2) {
					return haxe_CallStack.equalItems(item11,item21);
				} else {
					return false;
				}
			} else {
				return false;
			}
			break;
		case 3:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 3) {
				var class2 = item2.classname;
				var method2 = item2.method;
				var method1 = item1.method;
				var class1 = item1.classname;
				if(class1 == class2) {
					return method1 == method2;
				} else {
					return false;
				}
			} else {
				return false;
			}
			break;
		case 4:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 4) {
				var v2 = item2.v;
				var v1 = item1.v;
				return v1 == v2;
			} else {
				return false;
			}
			break;
		}
	}
};
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
	this.__skipStack = 0;
	var old = Error.prepareStackTrace;
	Error.prepareStackTrace = function(e) { return e.stack; }
	if(((native) instanceof Error)) {
		this.stack = native.stack;
	} else {
		var e = null;
		if(Error.captureStackTrace) {
			Error.captureStackTrace(this,haxe_Exception);
			e = this;
		} else {
			e = new Error();
			if(typeof(e.stack) == "undefined") {
				try { throw e; } catch(_) {}
				this.__skipStack++;
			}
		}
		this.stack = e.stack;
	}
	Error.prepareStackTrace = old;
};
haxe_Exception.__name__ = true;
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		e.__skipStack++;
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	unwrap: function() {
		return this.__nativeException;
	}
	,__shiftStack: function() {
		this.__skipStack++;
	}
	,get_native: function() {
		return this.__nativeException;
	}
	,get_stack: function() {
		var _g = this.__exceptionStack;
		if(_g == null) {
			var value = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.normalize(this.stack),this.__skipStack);
			this.setProperty("__exceptionStack",value);
			return value;
		} else {
			var s = _g;
			return s;
		}
	}
	,setProperty: function(name,value) {
		try {
			Object.defineProperty(this,name,{ value : value});
		} catch( _g ) {
			this[name] = value;
		}
	}
});
var haxe_NativeStackTrace = function() { };
haxe_NativeStackTrace.__name__ = true;
haxe_NativeStackTrace.saveStack = function(e) {
	haxe_NativeStackTrace.lastError = e;
};
haxe_NativeStackTrace.callStack = function() {
	var e = new Error("");
	var stack = haxe_NativeStackTrace.tryHaxeStack(e);
	if(typeof(stack) == "undefined") {
		try {
			throw e;
		} catch( _g ) {
		}
		stack = e.stack;
	}
	return haxe_NativeStackTrace.normalize(stack,2);
};
haxe_NativeStackTrace.exceptionStack = function() {
	return haxe_NativeStackTrace.normalize(haxe_NativeStackTrace.tryHaxeStack(haxe_NativeStackTrace.lastError));
};
haxe_NativeStackTrace.toHaxe = function(s,skip) {
	if(skip == null) {
		skip = 0;
	}
	if(s == null) {
		return [];
	} else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") {
			stack.shift();
		}
		var m = [];
		var _g = 0;
		var _g1 = stack.length;
		while(_g < _g1) {
			var i = _g++;
			if(skip > i) {
				continue;
			}
			var line = stack[i];
			var matched = line.match(/^    at ([A-Za-z0-9_. ]+) \(([^)]+):([0-9]+):([0-9]+)\)$/);
			if(matched != null) {
				var path = matched[1].split(".");
				if(path[0] == "$hxClasses") {
					path.shift();
				}
				var meth = path.pop();
				var file = matched[2];
				var line1 = Std.parseInt(matched[3]);
				var column = Std.parseInt(matched[4]);
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function" ? haxe_StackItem.LocalFunction() : meth == "Global code" ? null : haxe_StackItem.Method(path.join("."),meth),file,line1,column));
			} else {
				m.push(haxe_StackItem.Module(StringTools.trim(line)));
			}
		}
		return m;
	} else if(skip > 0 && Array.isArray(s)) {
		return s.slice(skip);
	} else {
		return s;
	}
};
haxe_NativeStackTrace.tryHaxeStack = function(e) {
	if(e == null) {
		return [];
	}
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = haxe_NativeStackTrace.prepareHxStackTrace;
	var stack = e.stack;
	Error.prepareStackTrace = oldValue;
	return stack;
};
haxe_NativeStackTrace.prepareHxStackTrace = function(e,callsites) {
	var stack = [];
	var _g = 0;
	while(_g < callsites.length) {
		var site = callsites[_g];
		++_g;
		if(haxe_NativeStackTrace.wrapCallSite != null) {
			site = haxe_NativeStackTrace.wrapCallSite(site);
		}
		var method = null;
		var fullName = site.getFunctionName();
		if(fullName != null) {
			var idx = fullName.lastIndexOf(".");
			if(idx >= 0) {
				var className = fullName.substring(0,idx);
				var methodName = fullName.substring(idx + 1);
				method = haxe_StackItem.Method(className,methodName);
			} else {
				method = haxe_StackItem.Method(null,fullName);
			}
		}
		var fileName = site.getFileName();
		var fileAddr = fileName == null ? -1 : fileName.indexOf("file:");
		if(haxe_NativeStackTrace.wrapCallSite != null && fileAddr > 0) {
			fileName = fileName.substring(fileAddr + 6);
		}
		stack.push(haxe_StackItem.FilePos(method,fileName,site.getLineNumber(),site.getColumnNumber()));
	}
	return stack;
};
haxe_NativeStackTrace.normalize = function(stack,skipItems) {
	if(skipItems == null) {
		skipItems = 0;
	}
	if(Array.isArray(stack) && skipItems > 0) {
		return stack.slice(skipItems);
	} else if(typeof(stack) == "string") {
		switch(stack.substring(0,6)) {
		case "Error\n":case "Error:":
			++skipItems;
			break;
		default:
		}
		return haxe_NativeStackTrace.skipLines(stack,skipItems);
	} else {
		return stack;
	}
};
haxe_NativeStackTrace.skipLines = function(stack,skip,pos) {
	if(pos == null) {
		pos = 0;
	}
	if(skip > 0) {
		pos = stack.indexOf("\n",pos);
		if(pos < 0) {
			return "";
		} else {
			return haxe_NativeStackTrace.skipLines(stack,--skip,pos + 1);
		}
	} else {
		return stack.substring(pos);
	}
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
	this.__skipStack++;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	unwrap: function() {
		return this.value;
	}
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
String.__name__ = true;
Array.__name__ = true;
js_Boot.__toStr = ({ }).toString;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
_$FSM_State.NULL_ID = -1;
_$FSM_Transition.NULL_ID = -1;
Card.ANY = -1;
Card.SUITS = ["Coeur","Carreau","Trefle","Pique"];
Card.RANKS = (function($this) {
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
Card.ALL56 = (function($this) {
	var $r;
	var _g = [];
	{
		var _g1 = 0;
		var _g2 = Card.SUITS;
		while(_g1 < _g2.length) {
			var s = _g2[_g1];
			++_g1;
			var _g3 = 0;
			var _g4 = Card.RANKS;
			while(_g3 < _g4.length) {
				var r = _g4[_g3];
				++_g3;
				_g.push(new Card(r,s));
			}
		}
	}
	$r = _g;
	return $r;
}(this));
Card.ALL32 = (function($this) {
	var $r;
	var _g = [];
	{
		var _g1 = 0;
		var _g2 = Card.SUITS;
		while(_g1 < _g2.length) {
			var s = _g2[_g1];
			++_g1;
			var _g3 = 0;
			var _g4 = Card.RANKS[0];
			var _g5 = Card.RANKS.slice(Card.RANKS.indexOf("Sept")).concat([_g4]);
			while(_g3 < _g5.length) {
				var r = _g5[_g3];
				++_g3;
				_g.push(new Card(r,s));
			}
		}
	}
	$r = _g;
	return $r;
}(this));
Game.sweeps = [new Card("10","Carreau"),new Card("Valet","Trefle"),new Card("Dame","Pique"),new Card("Roi","Coeur"),new Card("7","Carreau")];
Game.sweepsValue = [1,2,3,4,5];
Game.cartesParJoueur = [0,0,0,15,12,9,8,7,6];
Game.initialMoney = 120;
Main.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, {});

//# sourceMappingURL=main.js.map
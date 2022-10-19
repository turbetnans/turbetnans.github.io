(function ($hx_exports, $global) { "use strict";
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Main = $hx_exports["Main"] = function() { };
Main.main = function() {
	ReactDOM.render(React.createElement(Game,{ }),window.document.getElementById("root"));
};
var Square = function(props,context) {
	React.Component.call(this,props,context);
};
Square.__super__ = React.Component;
Square.prototype = $extend(React.Component.prototype,{
	render: function() {
		return React.createElement("button",{ style : this.props.value == "X" ? { color : "blue"} : { color : "red"}, onClick : this.props.onClick, className : this.props.win ? "square win" : "square"},this.props.value);
	}
});
var Board = function(props,context) {
	React.Component.call(this,props,context);
};
Board.__super__ = React.Component;
Board.prototype = $extend(React.Component.prototype,{
	renderSquare: function(i,win) {
		var _gthis = this;
		return React.createElement(Square,{ win : win, value : this.props.squares[i], onClick : function() {
			return _gthis.props.onClick(i);
		}});
	}
	,render: function() {
		var board = [];
		var row = [];
		var win = this.props.win != null && (this.props.win[0] == 0 || this.props.win[1] == 0 || this.props.win[2] == 0);
		var square = this.renderSquare(0,win);
		row[0] = React.createElement("span",{ key : 0},square);
		var win = this.props.win != null && (this.props.win[0] == 1 || this.props.win[1] == 1 || this.props.win[2] == 1);
		var square = this.renderSquare(1,win);
		row[1] = React.createElement("span",{ key : 1},square);
		var win = this.props.win != null && (this.props.win[0] == 2 || this.props.win[1] == 2 || this.props.win[2] == 2);
		var square = this.renderSquare(2,win);
		row[2] = React.createElement("span",{ key : 2},square);
		board[0] = React.createElement("div",{ key : 0, className : "board-row"}," ",row," ");
		var row = [];
		var win = this.props.win != null && (this.props.win[0] == 3 || this.props.win[1] == 3 || this.props.win[2] == 3);
		var square = this.renderSquare(3,win);
		row[0] = React.createElement("span",{ key : 0},square);
		var win = this.props.win != null && (this.props.win[0] == 4 || this.props.win[1] == 4 || this.props.win[2] == 4);
		var square = this.renderSquare(4,win);
		row[1] = React.createElement("span",{ key : 1},square);
		var win = this.props.win != null && (this.props.win[0] == 5 || this.props.win[1] == 5 || this.props.win[2] == 5);
		var square = this.renderSquare(5,win);
		row[2] = React.createElement("span",{ key : 2},square);
		board[1] = React.createElement("div",{ key : 1, className : "board-row"}," ",row," ");
		var row = [];
		var win = this.props.win != null && (this.props.win[0] == 6 || this.props.win[1] == 6 || this.props.win[2] == 6);
		var square = this.renderSquare(6,win);
		row[0] = React.createElement("span",{ key : 0},square);
		var win = this.props.win != null && (this.props.win[0] == 7 || this.props.win[1] == 7 || this.props.win[2] == 7);
		var square = this.renderSquare(7,win);
		row[1] = React.createElement("span",{ key : 1},square);
		var win = this.props.win != null && (this.props.win[0] == 8 || this.props.win[1] == 8 || this.props.win[2] == 8);
		var square = this.renderSquare(8,win);
		row[2] = React.createElement("span",{ key : 2},square);
		board[2] = React.createElement("div",{ key : 2, className : "board-row"}," ",row," ");
		return React.createElement("div",{ },board);
	}
});
var Game = function() {
	React.Component.call(this,this.props);
	var _g = [];
	_g.push("");
	_g.push("");
	_g.push("");
	_g.push("");
	_g.push("");
	_g.push("");
	_g.push("");
	_g.push("");
	_g.push("");
	this.state = { history : [{ squares : _g}], stepNumber : 0, xIsNext : true, order : true};
};
Game.__super__ = React.Component;
Game.prototype = $extend(React.Component.prototype,{
	toggleOrder: function() {
		var order = this.state.order;
		if(order == true) {
			order = false;
		} else {
			order = true;
		}
		this.setState({ order : order});
	}
	,handleSquareClick: function(i) {
		var history = this.state.history.slice(0,this.state.stepNumber + 1);
		var current = history[history.length - 1];
		var squares = current.squares.slice();
		if(this.calculateWinner(squares) != null || squares[i] != "") {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({ history : history.concat([{ squares : squares, col : i % 3, row : Math.floor(i / 3)}]), stepNumber : history.length, xIsNext : !this.state.xIsNext});
	}
	,jumpTo: function(step) {
		this.setState({ stepNumber : step, xIsNext : step % 2 == 0});
	}
	,calculateWinner: function(squares) {
		var lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
		var _g = 0;
		var _g1 = lines.length;
		while(_g < _g1) {
			var i = _g++;
			var a = lines[i][0];
			var b = lines[i][1];
			var c = lines[i][2];
			if(squares[a] != "" && squares[a] == squares[b] && squares[a] == squares[c]) {
				return lines[i];
			}
		}
		return null;
	}
	,render: function() {
		var _gthis = this;
		var history = this.state.history;
		var current = history[this.state.stepNumber];
		var order = this.state.order;
		var moves = [];
		var _g = 0;
		var _g1 = history.length;
		while(_g < _g1) {
			var i = [_g++];
			moves[order ? i[0] : history.length - i[0] - 1] = React.createElement("li",{ key : i[0]},React.createElement("button",{ style : i[0] == this.state.stepNumber ? { fontWeight : "bold"} : { }, onClick : (function(i) {
				return function() {
					_gthis.jumpTo(i[0]);
				};
			})(i)},i[0] > 0 ? "Go to move #" + i[0] + " (" + history[i[0]].col + "," + history[i[0]].row + ")" : "Go to game start"));
		}
		var button = React.createElement("button",{ onClick : function() {
			_gthis.toggleOrder();
		}},order ? "Chronological oder" : "Reverse order");
		var status;
		if(this.calculateWinner(current.squares) != null) {
			status = "Winner: " + (!this.state.xIsNext ? "X" : "O");
		} else if(this.state.stepNumber == 9) {
			status = "Tie";
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}
		var tmp = React.createElement(Board,{ win : this.calculateWinner(current.squares), squares : current.squares, onClick : function(i) {
			_gthis.handleSquareClick(i);
		}});
		var tmp1 = React.createElement("div",{ className : "game-board"},tmp);
		var tmp = React.createElement("div",{ },button);
		var tmp2 = React.createElement("div",{ },status);
		var tmp3 = React.createElement("ol",{ },moves);
		var tmp4 = React.createElement("div",{ className : "game-info"},tmp,tmp2,tmp3);
		return React.createElement("div",{ className : "game"},tmp1,tmp4);
	}
});
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
};
var react_ReactMacro = function() { };
Square.displayName = "Square";
Board.displayName = "Board";
Game.displayName = "Game";
Main.main();
})(typeof exports != "undefined" ? exports : typeof window != "undefined" ? window : typeof self != "undefined" ? self : this, {});

//# sourceMappingURL=main.js.map
// TicTacToe
// Haxe version of the React.js Tutorial

import js.Browser;
import react.ReactComponent;
import react.ReactMacro.jsx;
import react.ReactDOM;

// Main class : renders the root
@:expose
class Main {
    static public function main() {
        ReactDOM.render(jsx(<Game/>), Browser.document.getElementById("root"));
    }
}

// Square class : displays a single cell and its content
class Square extends ReactComponent {
    override function render(): ReactElement {
        return jsx(
            <button className={props.win? "square win": "square"} onClick={props.onClick} style={props.value=="X"? {color:'blue'}: {color:'red'}}>
                {props.value}
            </button>
        );
    }
}

// Board class : displays the 9 cells
class Board extends ReactComponent {
    public function renderSquare(i:Int, win:Bool): ReactElement {
        return jsx(
            <Square value={props.squares[i]} win={win} onClick={()->props.onClick(i)}/>
        );
    }

    override function render(): ReactElement {
        var board = [];
        for(i in 0...3) {
            var row = [];
            for(j in 0...3) {
                var win = props.win!=null && (props.win[0]==3*i+j||props.win[1]==3*i+j||props.win[2]==3*i+j);
                var square = renderSquare(j+3*i, win);
                row[j] = jsx(<span key={j}>{square}</span>);
            }
            board[i] = jsx(
                <div className="board-row" key={i}> {row} </div>
            );
        }
        return jsx(
          <div>{board}</div>
        );
    }
}

// Game class : displays the Board, next player and history ; define behaviours
class Game extends ReactComponent{
    public function new() {
        super(props);
        this.state = ({
            history: [{ squares: [for(i in 0...9) ''] }],
            stepNumber: 0,
            xIsNext: true,
            order: true
        });
    }

    function toggleOrder() {
        var order = this.state.order;
        if(order==true)
            order=false;
        else
            order=true;
        setState({order: order});
    }
    function handleSquareClick(i:Int): Void {
        var history = this.state.history.slice(0, this.state.stepNumber + 1);
        var current = history[history.length - 1];
        var squares = current.squares.slice();
        if(calculateWinner(squares)!=null || squares[i]!="") {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        setState({
            history: history.concat([{ squares: squares, col: (i%3), row: Math.floor(i/3) }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }
    function jumpTo(step:Int): Void {
        setState({ stepNumber: step, xIsNext: (step%2)==0 });
    }
    function calculateWinner(squares): Array<Int> {
        var lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for(i in 0...lines.length) {
            var a=lines[i][0];
            var b=lines[i][1];
            var c=lines[i][2];
            if (squares[a]!="" && squares[a]==squares[b] && squares[a]==squares[c])
                return lines[i];
        }
        return null;
    }

    override function render(): ReactElement {
        var history = this.state.history;
        var current = history[this.state.stepNumber];
        var order = this.state.order;

        var moves = [];
        for(i in 0...history.length) {
            moves[order? i: history.length-i-1] = jsx(
                <li key={i}>
                    <button onClick={()->this.jumpTo(i)} style={i==this.state.stepNumber? {fontWeight:'bold'}: {}}>
                        {i>0 ? 'Go to move #'+i+' ('+history[i].col+','+history[i].row+')': 'Go to game start'}
                    </button>
                </li>
            );
        }

        var button = jsx(
            <button onClick={()->this.toggleOrder()}>
                {order? 'Chronological oder': 'Reverse order'}
            </button>
        );

        var status;
        if(calculateWinner(current.squares)!=null)
            status = "Winner: " + ((!this.state.xIsNext)? "X" : "O");
        else if(this.state.stepNumber==9) 
            status = "Tie";
        else
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");

        return jsx(
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} win={calculateWinner(current.squares)} onClick={i -> this.handleSquareClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{button}</div>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

import Game;
import FSM;
import Log.log;

extern class JsOutput {
    static public function print(str:String):Void;
    static public function clear():Void;
}

@:expose
class Main {
    static public var g:Game;

    // FSM control
    static public function start() {
        g.start();
    }
    static public function stop() {
        g.stop(true);
    }

    // Getters
    static public function getState() {
        return g.states[g.currentState];
    }
    static public function getCards() {
        return g.players[g.currentPlayer].cards;
    }
    static public function getBoard() {
        return g.board;
    }
    static public function getSweeps() {
        return Game.sweeps;
    }
    static public function getPlayers() {
        return g.players;
    }
    static public function getCurrentPlayer() {
        return g.players[g.currentPlayer];
    }
    static public function getNextCard() {
        return g.nextCard==Card.ANY? null: Card.RANKS[g.nextCard];
    }
    static public function getLastCard() {
        return g.cardsPlayed.length!=0? g.cardsPlayed[g.cardsPlayed.length-1]: null;
    }
    static public function getLastPlayer() {
        return g.players[g.lastPlayer];
    }
    static public function getNextSweep() {
        return g.nextSweep!=-1? Game.sweeps[g.nextSweep]: null;
    }
    static public function getRank(card:Card):String {
        return Card.RANKS[card.rank];
    }
    static public function getSuit(card:Card):String {
        return Card.SUITS[card.suit];
    }

    // Events
    static public function go() {
        g.update(new MyEvent("Go"));
    }
    static public function jouer(card:Card) {
        g.update(new MyEvent("Jouer",card));
    }
    static public function passer() {
        g.update(new MyEvent("Passer"));
    }
    static public function prendre(card:Card) {
        g.update(new MyEvent("Prendre",card));
    }
    static public function fin() {
        g.update(new MyEvent("Fin"));
    }

    static public function cheat() {
        var card:Card = g.players[g.currentPlayer].cards.pop();
        while(g.players[g.currentPlayer].cards.length!=0)
            g.cardsPlayed.push(g.players[g.currentPlayer].cards.pop());
        g.players[g.currentPlayer].cards = [card];
    }

    static public function main() {
        // fsm_test();
        if( (g=Game.create(["Léa","Marion","Vince","Michel", "Sam"]))==null ){
            log("err");
            return;
        }
        #if js
        haxe.Log.trace = function(v:Dynamic, ?infos:haxe.PosInfos) { JsOutput.print(v); }
        #end
        #if sys
        g.start();
        g.update(new MyEvent("Go"));
        g.update(new MyEvent("Go"));

        var result:Bool=true;
        do {
            log("Choisir action: ");
            var line:String = Sys.stdin().readLine();
            switch(line){
                case "Stop"|"S"|"s": g.stop();
                case "Exit"|"E"|"e": break;
            	case "Go"|"G"|"g":
                    result = g.update(new MyEvent("Go"));
                    
        		case "Jouer"|"J"|"j":
                    // jouables: [for(c in g.players[g.currentPlayer].cards) if(g.nextCard==Card.ANY || g.nextCard==c.rank) c]
                    var cards:Array<Card> = g.players[g.currentPlayer].cards;
                    log("Choisir carte à jouer: "+cards);
                    var card:Int = 0;
                    while(true) {
                        line = Sys.stdin().readLine();
                        if(line=="") break;
                        card = Std.parseInt(line);
                        if( card>=0 && card<=cards.length ) break;
                        log("numéro de carte invalide: "+card);
                    }
                    card--;
                    if(card!=-1)
                        result = g.update(new MyEvent("Jouer",cards[card]));
                    
        		case "Prendre"|"P"|"p":
                    // restantes : [for(i in 0...5) if(g.board[i]!=0) Game.sweeps[i]]
                    var cards:Array<Card> = Game.sweeps;
                    log("Choisir carte à prendre: "+[for(i in 0...5) cards[i]+"("+g.board[i]+")"]);
                    var card:Int = 0;
                    while(true) {
                        line = Sys.stdin().readLine();
                        if(line=="") break;
                        card = Std.parseInt(line);
                        if( card>=0 && card<=cards.length ) break;
                        log("numéro de carte invalide: "+card);
                    }
                    card--;
                    if(card!=-1)
                        result = g.update(new MyEvent("Prendre",cards[card]));

                case "Passer"|"":
                    result = g.update(new MyEvent("Passer"));

                case "Fin"|"F"|"f":
                    result = g.update(new MyEvent("Fin"));
                    
            	default:
            		log("Action invalide. Actions possibles: Jouer(carte), Prendre(prise), Passer, Fin.");
            }
        }while(result);
        #end
    }
}

/*
public var isEmpty:Bool = false;
static function fsm_test() {
    var fsm:Main = new Main();

    var o:StateId = fsm.addState("Opened",function(){log("\t"+"ST: is opened");});
    var c:StateId = fsm.addState("Closed",function(){log("\t"+"ST: is closed & unlocked");});
    fsm.addState("Locked",function(){log("\t"+"ST: is closed & locked");});

    fsm.addTransition(o,c,"Close",(_)->fsm.isEmpty,(_)->log("\t"+"TR: closing"));
    fsm.addTransition(c,o,"Open",null,function(_){log("\t"+"TR: opening");});
    fsm.addTransition(c,fsm.getState("Locked"),"Lock",null,function(_){log("\t"+"TR: locking");});
    fsm.addTransition(fsm.getState("Locked"),c,"Unlock",null,function(_){log("\t"+"TR: unlocking");});

    fsm.setInitial(fsm.getState("Opened"),()->log("start"));

    var close:Event = new Event("Close");
    var open:Event = new Event("Open");
    var lock:Event = new Event("Lock");
    var unlock:Event = new Event("Unlock");

    log("TEST START");
    if(fsm.start()) {
        fsm.update(close);
        fsm.isEmpty = true;
        fsm.update(close);
        fsm.update(open);
        fsm.update(lock);
        fsm.update(close);
        fsm.update(lock);
        fsm.update(open);
        fsm.update(unlock);
        fsm.update(open);
    }
    log("TEST END");
}
*/
import nainJaune.client.Client;
import nainJaune.core.Card;

/*
https://en.wikipedia.org/wiki/UML_state_machine#Entry_and_exit_actions
https://en.wikipedia.org/wiki/Nain_Jaune
https://www.uml-diagrams.org/state-machine-diagrams.html
*/

@:expose
class Main {
    static public var c:Client;

    // Main control
    static public function create(players:Array<String>,money:Int=120) { c.createGame(players,money); }
    static public function start() { c.startGame(); }
    static public function stop() { c.stopGame(); }

    // Client events control
    static public function createLocal() { c.update(CreateLocal); }
    static public function createRoom() { c.update(CreateRoom); }
    static public function joinRoom(id:String) { c.update(JoinRoom,id); }
    static public function returnMenu() { c.update(Return); }

    // Game events control
    static public function go() { c.updateGame(Go); }
    static public function jouer(card:Card) { c.updateGame(Jouer,card); }
    static public function passer() { c.updateGame(Passer); }
    static public function prendre(card:Card) { c.updateGame(Prendre,card); }
    static public function fin() { c.updateGame(Fin); }

    // Cheat
    static public function cheat() {
        while(c.g.players[c.g.currentPlayer].cards.length>0)
            c.g.cardsPlayed.push(c.g.players[c.g.currentPlayer].cards.shift());
        c.update(Update);
    }

    #if js
    static public function main() {
        c=Client.create();
        if(c==null) {
            trace("Err client creation");
        }
        c.start();
    }
    #end

    #if sys
    static public function mainS() {
        g.start();
        updateGame("Go");
        updateGame("Go");

        var result:Bool=true;
        do {
            trace("Choisir action: ");
            var line:String = Sys.stdin().readLine();
            switch(line){
                case "Stop"|"S"|"s": g.stop();
                case "Exit"|"E"|"e": break;
            	case "Go"|"G"|"g":
                    result = updateGame("Go");
                    
        		case "Jouer"|"J"|"j":
                    // jouables: [for(c in g.players[g.currentPlayer].cards) if(g.nextCard==Card.ANY || g.nextCard==c.rank) c]
                    var cards:Array<Card> = g.players[g.currentPlayer].cards;
                    trace("Choisir carte à jouer: "+cards);
                    var card:Int = 0;
                    while(true) {
                        line = Sys.stdin().readLine();
                        if(line=="") break;
                        card = Std.parseInt(line);
                        if( card>=0 && card<=cards.length ) break;
                        trace("numéro de carte invalide: "+card);
                    }
                    card--;
                    if(card!=-1) {
                        g.targetedCard = cards[card];
                        result = updateGame("Jouer");
                    }
        		case "Prendre"|"P"|"p":
                    // restantes : [for(i in 0...5) if(g.board[i]!=0) Game.sweeps[i]]
                    var cards:Array<Card> = Game.sweeps;
                    trace("Choisir carte à prendre: "+[for(i in 0...5) cards[i]+"("+g.board[i]+")"]);
                    var card:Int = 0;
                    while(true) {
                        line = Sys.stdin().readLine();
                        if(line=="") break;
                        card = Std.parseInt(line);
                        if( card>=0 && card<=cards.length ) break;
                        trace("numéro de carte invalide: "+card);
                    }
                    card--;
                    if(card!=-1){
                        g.targetedCard = cards[card];
                        result = updateGame("Prendre");
                    }

                case "Passer"|"":
                    result = updateGame("Passer");

                case "Fin"|"F"|"f":
                    result = updateGame("Fin");
                    
            	default:
            		trace("Action invalide. Actions possibles: Jouer(carte), Prendre(prise), Passer, Fin.");
            }
        }while(result);
    }
    #end
}

package nainJaune.client;

import js.html.InputElement;
import haxe.Log;
import js.Browser;
import nainJaune.core.Game;
import nainJaune.core.Card;

using util.ArrayExt;

#if js
@:expose
class WebRenderer{
    public function new(c:Client) {
        this.c = c;
    }

    var c:Client;

    // Base functions
    public function printOutput(str:String) {
        if(str=="<br>"||str=="<hr>")
            Browser.document.getElementById("log").innerHTML += str;
        else if(str!="")
            Browser.document.getElementById("log").innerHTML += "<span>"+str+"</span>";
        else return;
        Browser.document.getElementById("log").scrollTop = Browser.document.getElementById("log").scrollHeight;
    }
    public function clearOutput() {
        Browser.document.getElementById("log").innerHTML = "";
    }
    public function printState(inGame:Bool=false) {
        // display state
        if(inGame) {
            Browser.document.getElementById("state").innerHTML = c.states[c.currentState]+"<br>"+c.g.states[c.g.currentState].name+" | "+c.g.round+"<br>"+c.name+" | "+c.role;
        } else {
            Browser.document.getElementById("state").innerHTML = c.states[c.currentState]+"<br>"+c.name+" | "+c.role;
        }

        // display main area
        switch(c.states[c.currentState].name) {
            case "Menu principal":
                Browser.document.getElementById("menuMain").style.display = "";
                (cast Browser.document.getElementById("name"):InputElement).value = c.name;

            case "Partie locale":
                Browser.document.getElementById("menuRoom").style.display = "";
                Browser.document.getElementById("buttonCreate").style.display = "";
                for(i in 0...8) {
                    (cast Browser.document.getElementById("p"+i):InputElement).value =
                        (i==0&&c.name.length>0? c.name: Client.names[Std.int(Math.random()*Client.names.length)]);
                    (cast Browser.document.getElementById("p"+i):InputElement).disabled = false;
                }

            case "Hote du salon":
                Browser.document.getElementById("menuRoom").style.display = "";
                Browser.document.getElementById("idHost").style.display = "";
                Browser.document.getElementById("buttonCreate").style.display = "";
                for(i in 0...8) {
                    (cast Browser.document.getElementById("p"+i):InputElement).value =
                        (i<c.guests.length? c.guests[i].name: "nope");
                    (cast Browser.document.getElementById("p"+i):InputElement).disabled = true;
                }

            case "Attente du salon":
                // ToDo

            case "Invite du salon":
                Browser.document.getElementById("menuRoom").style.display = "";
                for(i in 0...8) {
                    (cast Browser.document.getElementById("p"+i):InputElement).value =
                        (i<c.guests.length? c.guests[i].name: "nope");
                    (cast Browser.document.getElementById("p"+i):InputElement).disabled = true;
                }
                
            case "Partie en cours":
                switch(c.g.states[c.g.currentState].name) {
                    case "Debut de partie":
                        printBoard(c.g.board,c.g.nextSweep,true);
                        printPlayers(c.g.players,c.g.currentPlayer);
                        if( c.role.match(Local) || c.role.match(Host) )
                            printStartGame();
                    case "Debut de manche":
                        printBoard(c.g.board,c.g.nextSweep,true);
                        printPlayers(c.g.players,c.g.currentPlayer);
                        if( c.role.match(Local) || c.role.match(Host) )
                            printStartRound();
                    case "Debut de tour":
                        if(c.role.match(Local)) {
                            printBoard(c.g.board,c.g.nextSweep);
                            printPlayers(c.g.players,c.g.currentPlayer);
                            printLastCard(c.g.cardsPlayed.last(),c.g.players[c.g.lastPlayer]);
                            printNextCard(c.g.nextCard);
                            printPlayerHand(c.g.currentPlayer,c.g.nextCard,c.g.firstTurn);
                        } else {
                            printBoard(c.g.board,c.g.nextSweep);
                            printPlayers(c.g.players,c.g.currentPlayer);
                            printLastCard(c.g.cardsPlayed.last(),c.g.players[c.g.lastPlayer]);
                            printNextCard(c.g.nextCard);
                            if(c.playerId==c.g.currentPlayer)
                                printPlayerHand(c.g.currentPlayer,c.g.nextCard,c.g.firstTurn);
                        }
                    case "Fin de manche":
                        printBoard(c.g.board,c.g.nextSweep,true);
                        printPlayers(c.g.players,c.g.currentPlayer);
                        if( c.role.match(Local) || c.role.match(Host) )
                            printStopRound();
                    case "Fin de partie":
                        printBoard(c.g.board,c.g.nextSweep,true);
                        printPlayers(c.g.players,c.g.currentPlayer);
                        if( c.role.match(Local) || c.role.match(Host) )
                            printStopGame();
                }
        }
    }
    public function clear() {
        Browser.document.getElementById("menuMain").style.display = "none";

        Browser.document.getElementById("menuRoom").style.display = "none";
        Browser.document.getElementById("idHost").style.display = "none";
        Browser.document.getElementById("buttonCreate").style.display = "none";
        
        Browser.document.getElementById("board").style.display = "none";
        Browser.document.getElementById("next").style.display = "none";
        Browser.document.getElementById("last").style.display = "none";
        Browser.document.getElementById("all").style.display = "none";
        Browser.document.getElementById("hand").style.display = "none";
        Browser.document.getElementById("buttonLaunch").style.display = "none";
        Browser.document.getElementById("buttonStart").style.display = "none";
        Browser.document.getElementById("buttonStop").style.display = "none";
        Browser.document.getElementById("buttonEnd").style.display = "none";
    }

    // Element formating
    public function formatPlayerName(player:Player):String {
        return "<button class='player simple"+(player.id==c.playerId? " you":"")+"' disabled>"+player.name+"</button>";
    }
    public function formatPlayer(player:Player, ?isCurrent:Bool=false):String {
        return "<button class='player "+(player.id==c.playerId? "you ":" ")+(isCurrent? "highlight' ":"' ")+
                "disabled>"+(player.id==c.playerId? "<b>"+player+"</b>": player.toString())+"</button>";
    }
    public function formatCardRank(rank:String):String {
        return "<button class='card' disabled >"+rank+"</button>";
    }
    public function formatPlayableCard(player:Int, card:Card, i:Int):String {
        return "<button "+
                "class='card"+(card.suit<2? " red": " black")+"' "+
                "onclick='Main.jouer(Main.c.getCards("+player+")["+i+"])'"+
                ">"+card+"</button>";
    }
    public function formatCard(card:Card):String {
        if(card!=null) {
            return "<button class='card"+(card.suit<2? " red": " black")+"' disabled>"+card+"</button>";
        } else {
            return "<button class='card' disabled >???</button>";
        }
    }
    public function formatSweep(i:Int, value:Int, disable:Bool):String {
        if( i>=0 && i<5 ) {
            var card:Card = Game.sweeps[i];
            return "<button "+
                "class='card sweep"+(card.suit<2? " red": " black")+"' "+
                (disable? "disabled ": "")+
                "onclick='Main.prendre(nainJaune.core.Game.sweeps["+i+"])'"+
                ">"+card+" ("+value+")"+"</button>";
        }
        return "<button class='card sweep' disabled >???</button>";
    }
    public function formatValue(value:Int):String {
        return "<button class='value' disabled>"+value+"</button>";
    }
    public function formatMoney(value:Int):String {
        return "<button class='value money' disabled>"+value+"</button>";
    }
    
    // Ingame elements
    public function printStartGame() {
        Browser.document.getElementById("buttonLaunch").style.display = "";
    }
    public function printStartRound() {
        Browser.document.getElementById("buttonStart").style.display = "";
    }
    public function printStopRound() {
        Browser.document.getElementById("buttonStop").style.display = "";
    }
    public function printStopGame() {
        Browser.document.getElementById("buttonEnd").style.display = "";
    }
    public function printBoard(values:Array<Int>, next:Int, ?disableAll:Bool=false) {
        var elem:String = "";
        for(i in 0...Game.sweeps.length) {
            elem += "<span class='spacer medium'></span>"+
                "<span class='back "+(!disableAll&&next==i? "highlight": "")+"'>"+
                formatSweep(i,values[i],values[i]==0||disableAll)+
                "</span>";
        }
        Browser.document.getElementById("board").style.display = "";
        Browser.document.getElementById("board").innerHTML = "<p style='text-align: left;'>"+"Board:"+elem+"</p>";
    }
    public function printPlayers(players:Array<Player>, currentPlayer:Int) {
        var elem:String = "";
        for(i in 0...players.length) {
            if(i!=0)
                elem += "<br>";
            elem += "<span class='spacer'></span>"+formatPlayer(players[i],currentPlayer==i);
        }
        Browser.document.getElementById("players").innerHTML = elem;
    }
    public function printNextCard(rank:Int) {
        var elem:String = "<span class='spacer'></span>"+formatCardRank(rank==Card.ANY? "Ø": Card.RANKS[rank]);
        Browser.document.getElementById("next").style.display = "";
        Browser.document.getElementById("next").innerHTML = "<p style='text-align: left;'>"+"Next card:"+elem+"</p>";
    }
    public function printLastCard(card:Card, ?player:Player) {
        var elem:String = "<span class='spacer'></span>";
        if(card==null) {
            elem += formatCardRank("Ø");
        } else {
            elem += formatCard(card)+" by "+formatPlayerName(player);
        }
        Browser.document.getElementById("last").style.display = "";
        Browser.document.getElementById("last").innerHTML = "<p style='text-align: left;'>"+"Last card:"+elem+"</p>";
    }
    public function printPlayerHand(player:Int, nextRank:Int, firstTurn:Bool) {
        var elem:String = "";
        var cards:Array<Card> = c.getCards(player);
        if(cards.length>0) {
            var canPlay:Bool = nextRank==Card.ANY || cards.filter((c:Card)->c.rank==nextRank).length>0;
            elem += "<span class='spacer medium'></span>"+
                "<span class='back "+(!canPlay? "highlight": "")+"'>"+
                "<button class='skip' "+(nextRank==Card.ANY? "disabled ": "")+"onclick='Main.passer()'>Passer</button>"+
                "</span>";
            for(i in 0...cards.length) {
                elem += "<span class='spacer small'></span>"+
                    "<span class='back "+(nextRank==Card.ANY||cards[i].rank==nextRank? "highlight": "")+"'>"+
                    formatPlayableCard(player,cards[i],i)+
                    "</span>";

            }
        } else if(firstTurn) {
            elem = "<span class='spacer'></span>"+
                "<span class='back highlight'>"+
                "<button class='skip' onclick='Main.fin()'>Opéra</button>"+
                "</span>";
        } else {
            elem = "<span class='spacer'></span>"+
                "<span class='back highlight'>"+
                "<button class='skip' onclick='Main.fin()'>Fin</button>"+
                "</span>";
        }
        Browser.document.getElementById("hand").style.display = "";
        Browser.document.getElementById("hand").innerHTML = "<p style='text-align: left;'>"+"Hand:"+elem+"</p>";
    }

}
#else
class WebRenderer{
    public function new() { trace("Not supported for non js targets."); }
}
#end

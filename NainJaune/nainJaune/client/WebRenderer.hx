package nainJaune.client;

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
    public function printElements(str:String, ?allign:String="left") {
        if(allign!="right" && allign!="center" && allign!="left")
            allign="left";
        if(str!="") Browser.document.getElementById("display").innerHTML += "<p style='text-align: "+allign+";'>"+str+"</p>";
    }
    public function clearElements() {
        Browser.document.getElementById("display").innerHTML = "";
    }
    public function printOutput(str:String) {
        if(str=="")
            return;
        Browser.document.getElementById("log").innerHTML += "<p>"+str+"</p>";
        Browser.document.getElementById("log").scrollTop = Browser.document.getElementById("log").scrollHeight;
    }
    public function clearOutput() {
        Browser.document.getElementById("log").innerHTML = "";
    }
    public function printState(inGame:Bool=false) {
        if(inGame) {
            Browser.document.getElementById("state").innerHTML = c.states[c.currentState]+"<br>"+c.gameState+" | "+c.g.round+"<br>"+c.name+" | "+c.role;
        } else {
            Browser.document.getElementById("state").innerHTML = c.states[c.currentState]+"<br>"+c.name+" | "+c.role;
        }
    }

    // Element formating
    public function formatPlayerName(?name:String):String {
        return "<button class='player simple' disabled>"+name+"</button>";
    }
    public function formatPlayer(player:Player, ?isCurrent:Bool=false):String {
        return "<button class='player "+(isCurrent? " highlight' ":"' ")+
                "disabled>"+ player+"</button>";
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

    // Menus
    public function printMenu() {
        printNameSelection();
        printElements("<button class='go' onclick='Main.createLocal()'>Local</button>","center");
        printElements("<button class='go' onclick='Main.createRoom()'>Créer</button>","center");
        printElements("<button class='go' onclick='Main.joinRoom(this.nextSibling.nextSibling.value);'>Rejoindre</button>"+
            "<br><input type='text' size='32' placeholder='enter host id'/>",
            "center");
    }
    public function printReturn() {
        printElements("<button class='go' onclick='Main.returnMenu()'>Retour au menu</button>","center");
    }
    
    // Name
    public function printNameSelection() {
        var elem:String = "Entrez votre nom : ";
        elem += "<input type='text' maxlength='10' size='12' placeholder='Entrez un nom...' value='"+c.name+"'";
        elem += "onchange='Main.c.name=this.value;'/>";
        printElements(elem,"center");
    }

    // Local room
    public function printCreateLocal() {
        printElements("Entrez les noms d'au moins 3 joueurs :");
        var elem:String = "";
        for(i in 0...8)
            elem += (i!=0? "<span class='spacer small'></span>": "")+
                "<input type='text' maxlength='10' size='12' placeholder='Entrez un nom...' value='"+
                (i==0&&c.name.length>0? c.name: Client.someNames[Std.int(Math.random()*Client.someNames.length)])+
                "'/>";
        printElements(elem,"center");
        printElements("<button class='go' onclick='"+
            "Main.create([...document.getElementsByTagName(\"input\")].filter(elem=>elem.value!=\"\").map(elem=>elem.value));"+
            "Main.start();'>Créer la partie</button>",
            "center");
    }

    // Online room
    public function printConnectedPlayers(?host:Bool=false) {
        printElements("Joueurs connectés :");
        var elem:String = "";
        for(i in 0...8) {
            elem += (i!=0? "<span class='spacer small'></span>": "")+
                "<input type='text' disabled size='12' placeholder='personne' value='"+
                (i<c.guests.length? c.guests[i].name: "nope")+
                "'/>";
        }
        printElements(elem,"center");
        // if(host) printElements("<input type='number' min=15 value=200 onchange='if(this.value<15) this.value=15;'","center");
        if(host) printElements("<button class='go' onclick='Main.create();Main.start();'>Créer la partie</button>","center");
    }
    public function printHostId(?host:Bool=false) {
        var elem:String = "<span id='peerId'>"+c.peer.id+"</span>";
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
        printElements(elem,"center");
    }
    
    // Ingame elements
    public function printStartGame() {
        printElements("<button class='go' onclick='Main.go()'>Lancer la partie</button>","center");
    }
    public function printStartRound() {
        printElements("<button class='go' onclick='Main.go()'>Démarer la manche</button>","center");
    }
    public function printStopRound() {
        printElements("<button class='go' onclick='Main.go()'>Terminer la manche</button>","center");
    }
    public function printStopGame() {
        printElements("<button class='go' onclick='Main.start()'>Relancer une partie</button>"+
            "<span class='spacer'></span>"+
            "<button class='go' onclick='Main.stop()'>Terminer la partie</button>","center");
    }
    public function printBoard(values:Array<Int>, next:Int, ?disableAll:Bool=false) {
        var elem:String = "";
        for(i in 0...Game.sweeps.length) {
            elem += "<span class='spacer medium'></span>"+
                "<span class='back "+(!disableAll&&next==i? "highlight": "")+"'>"+
                formatSweep(i,values[i],values[i]==0||disableAll)+
                "</span>";
        }
        printElements("Board:"+elem);
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
        printElements("Next card:"+elem);
    }
    public function printLastCard(card:Card, ?player:Player) {
        var elem:String = "<span class='spacer'></span>";
        if(card==null) {
            elem += formatCardRank("Ø");
        } else {
            elem += formatCard(card)+" by "+formatPlayerName(player.name);
        }

        printElements("Last card played:"+elem);
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
        printElements("Cards:"+elem);
    }
    
    // Cheats
    public function printCheats() {
        printElements("<button class='skip' onclick='Main.jouer(null)'>J Null</button>"+
            "<span class='spacer medium'></span>"+
            "<button class='skip' onclick='Main.jouer(Main.c.g.deck.cards[0])'>J Wrong</button>"+
            "<span class='spacer medium'></span>"+
            "<button class='skip' onclick='Main.prendre(null)'>P Null</button>"+
            "<span class='spacer medium'></span>"+
            "<button class='skip' onclick='Main.prendre(Main.c.g.deck.cards[0])'>P Wrong</button>"+
            "<span class='spacer medium'></span>"+
            "<button class='skip' onclick='Main.passer()'>Passer</button>"+
            "<span class='spacer medium'></span>"+
            "<button class='skip' onclick='Main.fin()'>Fin</button>",
        "right");
    }
}
#else
class WebRenderer{
    public function new() { trace("Not supported for non js targets."); }
}
#end

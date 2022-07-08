import haxe.display.JsonModuleTypes.JsonType;
import haxe.ds.ReadOnlyArray;
import FSM;
import Log.log;

/*
https://en.wikipedia.org/wiki/UML_state_machine#Entry_and_exit_actions
https://en.wikipedia.org/wiki/Nain_Jaune
https://www.uml-diagrams.org/state-machine-diagrams.html
*/

class Game extends FSM {
    function new() { super(); }

    public static var sweeps:Array<Card> = [
        new Card("10","Carreau"),
        new Card("Valet","Trefle"),
        new Card("Dame","Pique"),
        new Card("Roi","Coeur"),
        new Card("7","Carreau")
    ];
    public static var sweepsValue:Array<Int> = [1,2,3,4,5];
    static public var cartesParJoueur:Array<Int> = [0,0,0,15,12,9,8,7,6]; // [0,0,0,7, 4, 7,4,3,4]
    public static var initialMoney:Int = 120;

    public var round:Int=-1;
    public var firstTurn:Bool=false;
    public var players:Array<Player>=[];
    public var dealer:Int=-1;
    public var currentPlayer:Int=-1;
    public var lastPlayer:Int=-1;
    public var board:Array<Int>=[0,0,0,0,0];
    public var deck:Deck=null;
    public var nextCard:Int=Card.ANY;
    public var nextSweep:Int=-1;
    public var cardsPlayed:Array<Card>=[];

    override public function update(e:Event):Bool {
        try {
            return super.update(e);
        } catch(e:Dynamic) {
            // look for invalid MyEvent casts
            log("Err: "+e);
            log("Err: "+haxe.CallStack.exceptionStack());
            return false;
        }
    }

    function init(playerList:Array<String>):Bool {        
        if( playerList.length<3 || playerList.length>8 )
            return false;
        players = [for(name in playerList) new Player(name)];

        // STATES
		var gameStart:StateId = addState("Debut de partie",()->log("La partie commence !"));
		var roundStart:StateId = addState("Debut de manche",()->log("Le round n°"+round+" commence !"));
        var turn:StateId = addState("Debut de tour",()->log("A "+players[currentPlayer].name+" de jouer !"));
            // // print debug info
            // var p: Player = players[currentPlayer];
            // log("[DEBUG]\t"+"tour de n°"+currentPlayer+" "+p.name);
            // log("\t"+"plateau: "+board);
            // log("\t"+"joueurs: "+[for(p in players) p.name+"("+p.money+")"]);
            // log("\t"+"prise en attente: "+( nextSweep==-1? "aucune": ("n°"+nextSweep+" "+sweeps[nextSweep]+" ("+board[nextSweep]+")") ));
            // log("\t"+"attendue: "+(nextCard==Card.ANY? "n'importe": Card.RANKS[nextCard])+
            //     "\t"+"précédente: "+(cardsPlayed.length==0? "aucune": (cardsPlayed[cardsPlayed.length-1]+" par "+players[lastPlayer].name))+".");
            // log("\t"+"cartes ("+p.cards.length+"): "+p.cards+
            //     "\t"+"jouables: "+[for(c in p.cards) if(nextCard==Card.ANY || nextCard==c.rank) c]);
            // log("\t"+"premier tour: "+firstTurn);
		var roundEnd:StateId = addState("Fin de manche",()->log("Le round n°"+round+" est terminé !"));
        var gameEnd:StateId = addState("Fin de partie",
            ()->{
                var losers:Array<Int> = [for(i in 0...players.length) if(players[i].money<15) i];
                var maxMoney:Int = 0;
                for(p in players) if(p.money>maxMoney) maxMoney = p.money;
                var winners: Array<Int> = [for(i in 0...players.length) if(players[i].money==maxMoney) i];

                if(losers.length==1) log("[GAME]\t"+"le perdant est n°"+losers[0]+" "+players[losers[0]].name+" ("+players[losers[0]].money+")"+".");
                else log("[GAME]\t"+"les perdants sont "+[for(i in 0...losers.length)
                        "n°"+losers[i]+" "+players[losers[i]].name+" ("+players[losers[i]].money+")"
                    ].join(", ")+".");

                if(winners.length==1) log("[GAME]\t"+"le gagnant est n°"+winners[0]+" "+players[winners[0]].name+" ("+players[winners[0]].money+")"+".");
                else log("[GAME]\t"+"les gagnants sont "+[for(i in 0...winners.length)
                        "n°"+winners[i]+" "+players[winners[i]].name+" ("+players[winners[i]].money+")"
                    ].join(", ")+".");

                log("[GAME]\t"+"la partie a duré "+(round+1)+" manches.");
            }
        );

        // INITIAL & FINAL STATES
        setInitial(gameStart,()->log("[GAME]\t"+"partie créée"));
        setFinal(gameEnd);

        // GO
        addTransition(gameStart,roundStart,"Go",null,
            (_)->{
                // params init
                deck = new Deck();
                for(p in players) {
                    p.money = initialMoney;
                    p.cards = [];
                }
                dealer = Std.int(Math.random()*players.length);
                currentPlayer = (dealer+1)%players.length;
                lastPlayer = currentPlayer;
                board = [for(i in 0...5) 0];
                round = 0;

                log("[GAME]\t"+
                    "round: "+round+" |\t"+
                    "joueurs: "+[for(p in players) p.name+"("+p.money+")"]+".");
                log("[GAME]\t"+
                    "dealer: n°"+dealer+" "+players[dealer].name+" |\t"+
                    "actuel: "+(currentPlayer==-1? "null": ("n°"+currentPlayer+" "+players[currentPlayer].name))+".");
            }
        );
        addTransition(roundStart,turn,"Go",null,
            (_)->{
                // board
                for(p in players) {
                    for(i in 0...5) {
                        if(p.money>i) {
                            board[i] += i+1;
                            p.money -= i+1;
                        } else {
                            //err: game should be finished
                            log("[ERR]\t"+"game should be finished");
                            throw "wtf";
                        }
                    }
                }
                firstTurn = true;
                // Distribution
                deck.shuffle();
                // log("[DEBUG]\t"+"mélangées: "+deck.cards);

                var next:Int = currentPlayer;
                for(i in 0...Game.cartesParJoueur[players.length]) {
                    for(p in 0...players.length) {
                        players[next].cards.push(deck.cards.pop());
                        next++;
                        next%=players.length;
                    }
                }
                for(p in players)
                    p.cards.sort((c1:Card,c2:Card)->(c1.rank==c2.rank)? c1.suit-c2.suit: c1.rank-c2.rank);

                deck.cards.sort((c1:Card,c2:Card)->(c1.rank==c2.rank)? c1.suit-c2.suit: c1.rank-c2.rank);
                // log("[DEBUG]\t"+"talon: "+deck.cards.length+"\t"+deck.cards);

                // Prochaine carte
                nextCard = Card.ANY;
                nextSweep = -1;
            }
        );
        addTransition(roundEnd,roundStart,"Go",
            (_)->([for(p in players) if(p.money<15) p].length==0),
            (_)->{
                log("[GAME]\t"+"tous les joueurs peuvent payer, passage à la prochaine manche.");

                for(p in players){
                    deck.cards = deck.cards.concat(p.cards);
                    p.cards = [];
                }
                deck.cards = deck.cards.concat(cardsPlayed);
                cardsPlayed = [];

                dealer = (dealer+1)%players.length;
                currentPlayer = (dealer+1)%players.length;
                lastPlayer = currentPlayer;
                round++;
            }
        );
        addTransition(roundEnd,gameEnd,"Go",
            (_)->([for(p in players) if(p.money<15) p].length!=0),
            (_)->log("[GAME]\t"+"au moins un joueur ne peut plus payer, fin de la partie.")
        );

        // JOUER
        addTransition(turn,turn,"Jouer",
            (e)->( cardOwned((cast e:MyEvent).card,players[currentPlayer]) && rankMatches((cast e:MyEvent).card,nextCard) ),
            (e)->{
                var card:Card = (cast e:MyEvent).card;
                var cards:Array<Card> = players[currentPlayer].cards;
                
                // reset prise
                if(nextSweep!=-1) log("Oubli de "+sweeps[nextSweep]);
                if(nextSweep!=-1) nextSweep = -1;

                // jouer carte
                cards.remove(card);
                cardsPlayed.push(card);
                nextCard = card.rank==12? Card.ANY: card.rank+1;
                lastPlayer = currentPlayer;
                
                // màj prise
                for(i in 0...5)
                    if( card.rank==sweeps[i].rank && card.suit==sweeps[i].suit )
                        nextSweep = i;

                log("[GAME]\t"+"carte jouée par n°"+lastPlayer+" "+players[lastPlayer].name+": "+cardsPlayed[cardsPlayed.length-1]+(nextSweep!=-1? " (prise).": "."));
            }
        );
        addTransition(turn,turn,"Jouer",
            (e)->( !cardOwned((cast e:MyEvent).card,players[currentPlayer]) || !rankMatches((cast e:MyEvent).card,nextCard) ),
            (e)->{
                if(!cardOwned((cast e:MyEvent).card,players[currentPlayer])) log("[GAME]\t"+"pas dans la main.");
                else if(!rankMatches((cast e:MyEvent).card,nextCard)) log("[GAME]\t"+"pas la bonne valeur.");
                else log("[GAME]\t"+"err carte.");
            }
        );
        addTransition(turn,turn,"Jouer",null,(_)->log("wtf"));
        
        // PRENDRE
        addTransition(turn,turn,"Prendre",
            (e)->( nextSweep!=-1 && cardMatches((cast e:MyEvent).card,sweeps[nextSweep]) ),
            (_)->{
                log("[GAME]\t"+"prise de \""+sweeps[nextSweep]+"\""+
                    " par n°"+currentPlayer+" "+players[currentPlayer].name+
                    " pour "+board[nextSweep]+" ("+players[currentPlayer].money+"->"+(players[currentPlayer].money+board[nextSweep])+").");
                players[currentPlayer].money += board[nextSweep];
                board[nextSweep] = 0;
                nextSweep = -1;
            }
        );
        addTransition(turn,turn,"Prendre",
            (e)->( nextSweep!=-1 && !cardMatches((cast e:MyEvent).card,sweeps[nextSweep]) ),
            (e)->log("[GAME]\t"+"pas la bonne carte.")
        );
        addTransition(turn,turn,"Prendre",
            (_)->( nextSweep==-1 ),
            (_)->log("[GAME]\t"+"pas de prise.")
        );
        addTransition(turn,turn,"Prendre",null,(_)->log("wtf"));

        // PASSER
        addTransition(turn,turn,"Passer",
            (_)->( nextCard==Card.ANY && players[currentPlayer].cards.length>0 ),
            (_)->log("[GAME]\t"+"le joueur actuel doit jouer une carte.")
        );
        addTransition(turn,turn,"Passer",
            (_)->( nextCard!=Card.ANY && players[currentPlayer].cards.length>0 ),
            (_)->{
                log("[GAME]\t"+"sans "+Card.RANKS[nextCard]+".");
                // reset prise
                if(nextSweep!=-1) {
                    log("[GAME]\t"+"oubli de \""+sweeps[nextSweep]+"\"");
                    nextSweep = -1;
                }

                // jouer suivant
                firstTurn = currentPlayer==dealer? false: firstTurn;
                currentPlayer = ++currentPlayer==players.length? 0: currentPlayer;

                // carte suivante si tour complet
                if(currentPlayer==lastPlayer)
                    nextCard = nextCard==12? Card.ANY: nextCard+1;
            }
        );
        addTransition(turn,turn,"Passer",
            (_)->( players[currentPlayer].cards.length==0 ),
            (_)->log("[GAME]\t"+"la partie doit se finir.")
        );
        addTransition(turn,turn,"Passer",null,(_)->log("wtf"));

        //FIN
        addTransition(turn,turn,"Fin",
            (_)->( players[currentPlayer].cards.length!=0 ),
            (_)->log("[GAME]\t"+"le joueur actuel a encore des cartes en main.")
        );
        addTransition(turn,roundEnd,"Fin",
            (_)->( players[currentPlayer].cards.length==0 ),
            (_)->{
                /*fin de la manche*/

                if(firstTurn) {
                    // Grand Opera
                    log("[GAME]\t"+"Grand Opéra par n°"+currentPlayer+" "+players[currentPlayer].name+".");
                    for(i in 0...players.length) {
                        if( i!=currentPlayer ){
                            var sum:Int = 0;
                            for(c in players[i].cards) sum += c.rank<10? c.rank+1: 10;
                            log("[GAME]\t"+players[i].name+
                                " paye "+sum+" ("+players[i].money+"->"+
                                (sum<players[i].money? ""+(players[i].money-sum): "ruine")+")"+
                                " à "+players[currentPlayer].name+".");
                            sum = Std.int(Math.min(players[i].money,sum));
                            players[i].money -= sum;
                            players[currentPlayer].money += sum;
                        }
                    }
                    for(i in 0...sweeps.length){
                        log("[GAME]\t"+"prise de \""+sweeps[i]+"\""+
                            " par "+players[currentPlayer].name+
                            " pour "+board[i]+" ("+players[currentPlayer].money+"->"+(players[currentPlayer].money+board[i])+").");
                        players[currentPlayer].money += board[i];
                        board[i] = 0;
                    }

                } else {
                    log("[GAME]\t"+"manche remportée par n°"+currentPlayer+" "+players[currentPlayer].name+".");
    
                    if(nextSweep!=-1) log("[GAME]\t"+"oubli de \""+sweeps[nextSweep]+"\"");

                    for(i in 0...players.length) {
                        if( i!=currentPlayer ){
                            var sum:Int = 0;
                            for(c in players[i].cards) sum += c.rank<10? c.rank+1: 10;
                            log("[GAME]\t"+players[i].name+
                                " paye "+sum+" ("+players[i].money+"->"+
                                (sum<players[i].money? ""+(players[i].money-sum): "ruine")+")"+
                                " à "+players[currentPlayer].name+".");
                            sum = Std.int(Math.min(players[i].money,sum));
                            players[i].money -= sum;
                            players[currentPlayer].money += sum;
                            
                            for(j in 0...sweeps.length){
                                for(c in players[i].cards){
                                    if(cardMatches(c, sweeps[j])) {
                                        var sum:Int = board[j];
                                        log("[GAME]\t"+players[i].name+
                                            " double la mise de "+sweeps[j]+
                                            " pour "+sum+" ("+players[i].money+"->"+
                                            (sum<players[i].money? ""+(players[i].money-sum): "ruine")+").");
                                        sum = Std.int(Math.min(players[i].money,sum));
                                        players[i].money -= sum;
                                        board[j] += sum;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                log("[GAME]\t"+"talon: "+deck.cards);
            });
        addTransition(turn,turn,"Fin",null,(_)->log("wtf"));

        return true;
    }

    static public function cardOwned(card:Card,player:Player):Bool {
        // le joueur possède la carte
        return player.cards.indexOf(card)!=-1;
    }
    static public function rankMatches(card:Card,rank:Int):Bool {
        // le joueur possède la carte ET elle correspond aux paramètres
        return rank==Card.ANY || card.rank==rank;
    }
    static public function cardMatches(card:Card,model:Card):Bool {
        // le joueur possède la carte ET elle correspond aux paramètres
        return (model.rank==Card.ANY || card.rank==model.rank) && card.suit==model.suit;
    }

	static public function create(playerList:Array<String>):Game  {
        var game:Game = new Game();
        if(game.init(playerList))
            return game;
        return null;
    }
}

private class Player {
    public var name:String;
    public var money:Int;
	public var cards:Array<Card>;

    public function new(name:String) {
        this.name = name;
        this.money = 0;
        this.cards = [];
    }
	public function toString():String { return name+"("+money+")"; }
}

class MyEvent extends Event {
    public var card:Card;

    public function new(t:String,?c:Card) {
        super(t);
        // ToDo : err handling
        card = c;
    }
}

class Card {
    public static var ANY:Int = -1;
	public static var SUITS:ReadOnlyArray<String> = ["Coeur","Carreau","Trefle","Pique"];
	public static var RANKS:ReadOnlyArray<String> = [for(i in 1...11) '$i'].concat(["Valet","Dame","Roi"]);
	public static var ALL56:ReadOnlyArray<Card> = [for(s in SUITS) for(r in RANKS) new Card(r,s)];
	public static var ALL32:ReadOnlyArray<Card> = [for(s in SUITS) for(r in RANKS.slice(RANKS.indexOf("Sept")).concat([RANKS[0]])) new Card(r,s)];

	public var rank(default,null):Int;
	public var suit(default,null):Int;

	public function new(rank:String,suit:String) {
        this.rank = RANKS.indexOf(rank);
        this.suit = SUITS.indexOf(suit);
        if( this.rank==-1 || this.suit==-1 )
            log("carte invalide "+rank+" de "+suit+".");
	}
	public function toString():String { return RANKS[rank].substr(0,rank<10?2:1)+["♥","♦","♣","♠"][suit]; }
}

class Deck {
	public var cards:Array<Card>;

	public function new(?is32:Bool=false) {
		if(is32) cards = Card.ALL32.copy();
		else cards = Card.ALL56.copy();
    }
    
    public function shuffle() {
        // Fisher–Yates shuffle
        var index:Int = cards.length;
        while(index!=0) {
            var rand:Int = Std.int(Math.random()*index--);
            var temp:Card = cards[index];
            cards[index] = cards[rand];
            cards[rand] = temp;
        }
    }
}

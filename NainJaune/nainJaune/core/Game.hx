package nainJaune.core;

import fsm.FSM;
import nainJaune.core.Card;
using util.ArrayExt;

@:expose
class Game extends FSM {
    function new() { super(); }

    public static final sweeps:Array<Card> = [
        new Card("10","Carreau"),
        new Card("Valet","Trefle"),
        new Card("Dame","Pique"),
        new Card("Roi","Coeur"),
        new Card("7","Carreau")
    ];
    public static final sweepValues:Array<Int> = [for(i in 0...Game.sweeps.length) i+1];
    public static final cardPerPlayer:Array<Int> = [0,0,0,15,12,9,8,7,6]; // talon= [0,0,0,7,4,7,4,3,4]

    public var initialMoney(default,null):Int=0;
    public var round(default,null):Int=-1;
    public var firstTurn(default,null):Bool=false;
    public var players(default,null):Array<Player>=[];
    public var dealer(default,null):Int=Player.NULL_ID;
    public var currentPlayer(default,null):PlayerId=Player.NULL_ID;
    public var lastPlayer(default,null):PlayerId=Player.NULL_ID;
    public var board(default,null):Array<Int>=[];
    public var deck(default,null):Deck=null;
    public var nextCard(default,null):Int=Card.ANY;
    public var nextSweep(default,null):Int=-1;
    public var cardsPlayed(default,null):Array<Card>=[];
    public var messages(default,null):Array<Message>=[];

    // Create FMS
	static public function create(playerList:Array<String>, initialMoney:Int):Game  {
        var game:Game = new Game();
        if(game.init(playerList,initialMoney))
            return game;
        return null;
    }

    // Init FSM
    function init(playerList:Array<String>,initialMoney):Bool {
        if( playerList.length<3 || playerList.length>8 ) {
            return false;
        }
        var id:Int = 0;
        players = [for(name in playerList) new Player(id++,name)];
        this.initialMoney = initialMoney;

        // STATES
		var gameStart:StateId = addState("Debut de partie",()->entryGameStart());
		var roundStart:StateId = addState("Debut de manche",()->entryRoundStart());
        var turn:StateId = addState("Debut de tour",()->entryTurn());
		var roundEnd:StateId = addState("Fin de manche",()->entryRoundEnd());
        var gameEnd:StateId = addState("Fin de partie",()->entryGameEnd());
        // INITIAL & FINAL STATES
        setInitial(gameStart,()->messages.push(GameInit));
        setFinal(gameEnd);

        // GO
        addTransition(gameStart,roundStart,Go,null,
            (args)->startGame(args[0])
        );
        addTransition(roundStart,turn,Go,null,
            (args)->startRound(args[0],args[1])
        );
        addTransition(roundEnd,roundStart,Go,
            (_)->([for(p in players) if(p.money<15) p].length==0),
            (_)->nextRound()
        );
        addTransition(roundEnd,gameEnd,Go,
            (_)->([for(p in players) if(p.money<15) p].length!=0),
            (_)->endGame()
        );

        // JOUER
        addTransition(turn,turn,Jouer,true,
            (args)->( args[0]==currentPlayer && args[1]!=null && cardOwned(args[1],players[currentPlayer]) && rankMatches(args[1],nextCard) ),
            (args)->playCard(args[1])
        );
        addTransition(turn,turn,Jouer,true,
            (args)->( args[0]==currentPlayer && args[1]!=null && cardOwned(args[1],players[currentPlayer]) && !rankMatches(args[1],nextCard) ),
            (args)->messages.push(CannotPlay(args[0],args[1],"Wrong"))
        );
        addTransition(turn,turn,Jouer,true,
            (args)->( args[0]==currentPlayer && args[1]!=null && !cardOwned(args[1],players[currentPlayer]) ),
            (args)->messages.push(CannotPlay(args[0],args[1],"NotOwned"))
            );
        addTransition(turn,turn,Jouer,true,
            (args)->( args[0]==currentPlayer && args[1]==null ),
            (args)->messages.push(CannotPlay(args[0],"NoTarget"))
        );
        addTransition(turn,turn,Jouer,true,
            (args)->( args[0]!=currentPlayer ),
            (args)->messages.push(CannotPlay(args[0],"NotTurn"))
        );
        
        // PRENDRE
        addTransition(turn,turn,Prendre,true,
            (args)->( args[0]==currentPlayer && args[1]!=null && nextSweep!=-1 && cardMatches(args[1],sweeps[nextSweep]) ),
            (_)->winSweep(nextSweep)
        );
        addTransition(turn,turn,Prendre,true,
            (args)->( args[0]==currentPlayer && args[1]!=null && nextSweep!=-1 && !cardMatches(args[1],sweeps[nextSweep]) ),
            (args)->messages.push(CannotWin(args[0],args[1],"Wrong"))
        );
        addTransition(turn,turn,Prendre,true,
            (args)->( args[0]==currentPlayer && args[1]!=null && nextSweep==-1 ),
            (args)->messages.push(CannotWin(args[0],args[1],"NoSweep"))
        );
        addTransition(turn,turn,Prendre,true,
            (args)->( args[0]==currentPlayer && args[1]==null ),
            (args)->messages.push(CannotWin(args[0],"NoTarget"))
        );
        addTransition(turn,turn,Prendre,true,
            (args)->( args[0]!=currentPlayer ),
            (args)->messages.push(CannotWin(args[0],"NotTurn"))
        );

        // PASSER
        addTransition(turn,turn,Passer,
            (args)->( args[0]==currentPlayer && nextCard!=Card.ANY && players[currentPlayer].cards.length>0 ),
            (_)->pass()
        );
        addTransition(turn,turn,Passer,true,
            (args)->( args[0]==currentPlayer && players[currentPlayer].cards.length==0 ),
            (args)->messages.push(CannotPass(args[0],"MustEnd"))
        );
        addTransition(turn,turn,Passer,true,
            (args)->( args[0]==currentPlayer && nextCard==Card.ANY ),
            (args)->messages.push(CannotPass(args[0],"MustPlay"))
        );
        addTransition(turn,turn,Passer,true,
            (args)->( args[0]!=currentPlayer ),
            (args)->messages.push(CannotPass(args[0],"NotTurn"))
        );

        //FIN
        addTransition(turn,roundEnd,Fin,
            (args)->( args[0]==currentPlayer && players[currentPlayer].cards.length==0 ),
            (_)->endRound()
        );
        addTransition(turn,turn,Fin,true,
            (args)->( args[0]==currentPlayer && players[currentPlayer].cards.length!=0 ),
            (args)->messages.push(CannotEnd(args[0],round,"CardsLeft"))
        );
        addTransition(turn,turn,Fin,true,
            (args)->( args[0]!=currentPlayer ),
            (args)->messages.push(CannotEnd(args[0],round,"NotTurn"))
        );

        return true;
    }

    // state entrys/exits
    function entryGameStart():Void {
        // init deck
        deck = new Deck();
        // init cards played
        cardsPlayed = [];
        // init board
        board = [for(i in 0...Game.sweeps.length) 0];
        // init round
        round = 0;
        firstTurn = false;
        nextCard = Card.ANY;
        nextSweep = -1;
        // init players
        for(p in players) {
            p.money = initialMoney;
            p.cards = [];
        }
        dealer = currentPlayer = lastPlayer = Player.NULL_ID;

        messages.push(GameReady);
    }
    function entryRoundStart():Void {
        // init
        firstTurn = false;
        nextCard = Card.ANY;
        nextSweep = -1;

        messages.push(RoundReady(round,dealer));
        // pay
        for(p in players) {
            for(sweep in 0...5) {
                if(p.money>sweep) {
                    board[sweep] += sweepValues[sweep];
                    p.money -= sweepValues[sweep];
                } else throw "wtf"; //err: game should be finished
            }
            messages.push(PlayerBet(p.id,null,null,"Bet"));
        }
    }
    function entryTurn():Void {
        messages.push(TurnStart(currentPlayer,players[currentPlayer].cards));
    }
    function entryRoundEnd():Void {
        if(firstTurn) {
            messages.push(RoundOver(currentPlayer,round,"Opera"));
        } else {
            messages.push(RoundOver(currentPlayer,round));
        }

        // collect sweep if opera
        if(firstTurn) {
            for(sweepId in 0...sweeps.length){
                if(board[sweepId]!=0){
                    winSweep(sweepId,"Opera");
                }
            }
        }

        for(p in players) {
            if( p.id!=currentPlayer ){
                // pay winner
                var sum:Int = 0;
                for(c in p.cards) sum += c.rank<10? c.rank+1: 10;
                p.money -= sum;
                players[currentPlayer].money += sum;
                messages.push(PlayerPay(p.id,currentPlayer,sum));
                if(p.money<=0)
                    messages.push(PlayerBankruptcy(p.id));
                // repay sweeps if not an opera
                if(!firstTurn) {
                    for(i in 0...sweeps.length) {
                        for(c in p.cards) {
                            if(cardMatches(c, sweeps[i])) {
                                var sum:Int = board[i];
                                p.money -= sum;
                                board[i] += sum;
                                messages.push(PlayerBet(p.id,i,sum,"Repay"));
                                if(p.money<=0) {
                                    messages.push(PlayerBankruptcy(p.id));
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        messages.push(CardStock(deck.cards,"End"));
    }
    function entryGameEnd():Void {
        var maxMoney:Int = 0;
        for(p in players)
            if(p.money>maxMoney)
                maxMoney = p.money;
        messages.push(GameOver([for(p in players) if(p.money==maxMoney) p.id]));
    }

    // transition actions
    function startGame(?forcedDealer:Int=null):Void {
        // First dealer
        lastPlayer = currentPlayer = dealer = forcedDealer==null? Std.int(Math.random()*players.length): forcedDealer;
        // First round
        round = 1;

        messages.push(GameStart(dealer));
    }
    function startRound(?forcedHands:Array<Array<Card>>=null,?forcedStock:Array<Card>=null):Void {
        if( forcedHands==null && forcedStock==null ) {
            // deal
            deck.shuffle();
            var next:Int = dealer;
            for(i in 0...Game.cardPerPlayer[players.length]) {
                for(p in 0...players.length) {
                    next++;
                    next%=players.length;
                    players[next].cards.push(deck.cards.pop());
                }
            }
        } else {
            for(i in 0...forcedHands.length)
                players[i].cards = forcedHands[i];
            deck.cards = forcedStock;
        }

        for(p in players)
            p.cards.sort((c1:Card,c2:Card)->(c1.rank==c2.rank)? c1.suit-c2.suit: c1.rank-c2.rank);
        deck.cards.sort((c1:Card,c2:Card)->(c1.rank==c2.rank)? c1.suit-c2.suit: c1.rank-c2.rank);
        messages.push(CardStock(deck.cards,"Start"));
        // jouer suivant
        firstTurn = true;
        currentPlayer = ++currentPlayer==players.length? 0: currentPlayer;

        messages.push(RoundStart(round,dealer,[for(p in players) p.cards],deck.cards));
    }
    function playCard(card:Card):Void {
        // reset prise
        if(nextSweep!=-1){
            messages.push(SweepMiss(nextSweep,currentPlayer));
            nextSweep = -1;
        }
        // jouer carte
        players[currentPlayer].cards = [for(c in players[currentPlayer].cards) if(!cardMatches(c,card)) c];
        cardsPlayed.push(card);
        nextCard = card.rank==12? Card.ANY: card.rank+1;
        lastPlayer = currentPlayer;
        // màj prise
        for(i in 0...5)
            if( card.rank==sweeps[i].rank && card.suit==sweeps[i].suit )
                nextSweep = i;

        messages.push(CardPlay(cardsPlayed.last(),currentPlayer));
    }
    function winSweep(sweepId:Int=null,?type:String=null):Void {
        messages.push(SweepWin(sweepId,currentPlayer,board[sweepId],type));
        players[currentPlayer].money += board[sweepId];
        board[sweepId] = 0;
        nextSweep = -1;
    }
    function pass():Void {
        // reset prise
        if(nextSweep!=-1) {
            messages.push(SweepMiss(nextSweep,currentPlayer));
            nextSweep = -1;
        }
        messages.push(PlayerPass(currentPlayer,nextCard));
        // jouer suivant
        firstTurn = currentPlayer==dealer? false: firstTurn;
        currentPlayer = ++currentPlayer==players.length? 0: currentPlayer;
        // carte suivante si tour complet
        if(currentPlayer==lastPlayer)
            nextCard = nextCard==12? Card.ANY: nextCard+1;
    }
    function endRound():Void {
        // reset prise
        if( !firstTurn && nextSweep!=-1 ) {
            messages.push(SweepMiss(nextSweep,currentPlayer));
        }
        messages.push(PlayerEnd(currentPlayer,round));
    }
    function nextRound():Void {
        // Reset cards
        for(p in players)
            while(p.cards.length>0)
                deck.cards.push(p.cards.pop());
        while(cardsPlayed.length>0)
            deck.cards.push(cardsPlayed.pop());
        // Next round
        round++;
        // Next dealer
        lastPlayer = currentPlayer = dealer = (dealer+1)%players.length;

        messages.push(RoundEnd(round));
    }
    function endGame():Void {
        var losers:Array<Int> = [for(p in players) if(p.money<15) p.id];
        messages.push(GameEnd(losers));
    }

    // Helper functions
    static public function cardOwned(card:Card,player:Player):Bool {
        // le joueur possède la carte
        return card.rank!=Card.ANY && player.cards.filter((c)->(cardMatches(c,card))).length==1;
    }
    static public function rankMatches(card:Card,rank:Int):Bool {
        // le joueur possède la carte ET elle correspond aux paramètres
        return rank==Card.ANY || card.rank==rank;
    }
    static public function cardMatches(card:Card,model:Card):Bool {
        // le joueur possède la carte ET elle correspond aux paramètres
        return (model.rank==Card.ANY || card.rank==model.rank) && card.suit==model.suit;
    }
}

enum abstract Event(String) to String {
	var Go;
	var Jouer;
	var Prendre;
	var Passer;
	var Fin;
}

enum Message {
    GameInit;
    GameReady;
    GameStart(dealer:Int);
    GameEnd(losers:Array<Int>);
    GameOver(winners:Array<Int>);

    RoundReady(round:Int,dealer:Int);
    RoundStart(round:Int,dealer:Int,hands:Array<Array<Card>>,stock:Array<Card>);
    RoundEnd(round:Int);
    RoundOver(round:Int,player:PlayerId,?type:String);

    TurnStart(player:PlayerId,cards:Array<Card>);

    PlayerBet(player:PlayerId,sweep:Int,value:Int,type:String);
    PlayerPay(fromPlayer:PlayerId,toPlayer:PlayerId,value:Int);
    PlayerBankruptcy(player:PlayerId);
    PlayerPass(player:PlayerId,rank:Int);
    PlayerEnd(player:PlayerId,round:Int);

    // CardGet(card:Card,player:PlayerId);
    CardStock(stock:Array<Card>,type:String);
    CardPlay(card:Card,player:PlayerId);

    SweepWin(sweep:Int,player:PlayerId,value:Int,?type:String);
    SweepMiss(sweep:Int,player:PlayerId);

    CannotPlay(player:PlayerId,?card:Card,type:String);
    CannotWin(player:PlayerId,?card:Card,type:String);
    CannotPass(player:PlayerId,type:String);
    CannotEnd(player:PlayerId,round:Int,?type:String);
}

typedef PlayerId = Int;

@:allow(nainJaune.core.Game)
class Player {
    public var id(default,null):PlayerId;
    public var name(default,null):String;
    public var money(default,null):Int;
	public var cards(default,null):Array<Card>;

    public static var NULL_ID:PlayerId = -1;

    public function new(id:PlayerId,name:String) {
        this.id = id;
        this.name = name;
        this.money = 0;
        this.cards = [];
    }
	public function toString():String { return id+":"+name+"("+money+")"; }
}

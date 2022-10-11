package nainJaune.client;

import Peer;
import fsm.FSM;
import nainJaune.core.Card;
import nainJaune.core.Game;
import nainJaune.core.Game.Message as GameMessage;
import nainJaune.core.Game.Event as GameEvent;

using util.ArrayExt;

import haxe.Timer;
using Std;

@:expose
@:access(nainJaune.core)
class Client extends FSM {
    function new() { super(); }

    public var g(default,null):Game = null;
    public var r(default,null):WebRenderer = null;

    public var role(default,null):Role = None;
    public var name(default,null):String = someNames[Std.int(Math.random()*someNames.length)];
    public var peer(default,null):Peer = null;
    public var hostCo(default,null):DataConnection = null;
    public var guests(default,null):Array<Guest> = null;
    public var playerId(default,null):PlayerId = Player.NULL_ID;
    public var gameState(default,null):String = "";
    //public var gameMessages:Array<GameMessage> = [];
    
    static public var someNames:Array<String> = [
        "Red","Leaf",
        "Luth","Célesta",
        "Brice","Flora",
        "Louka","Aurore",
        "Ludwig","Ludvina",
        "Mélis","Echo",
        "Kalem","Serena",
        "Elio","Selene",
        "Victor","Gloria",
        "Aurel","Lucia"
    ];

    // Create client
	static public function create():Client  {
        var client:Client = new Client();
        if(client.init())
            return client;
        return null;
    }

    // Init client
    function init():Bool {
        // RENDERER
        r = new WebRenderer(this);

        // PEER
        initPeer();

        // STATES
        var mainMenu:StateId = addState("Menu principal",()->entryMainMenu());
        var localGame:StateId = addState("Partie locale",()->entryLocalGame());
        var roomHost:StateId = addState("Hote du salon",()->entryRoomHost());
        var roomWait:StateId = addState("Attente du salon",()->entryRoomWait());
        var roomGuest:StateId = addState("Invite du salon",()->entryRoomGuest());
        var gameRunning:StateId = addState("Partie en cours",()->entryGameRunning());

        // INITIAL STATE
        setInitial(mainMenu);

        // MAIN MENU
        addTransition(mainMenu,localGame,CreateLocal,null,
            (_)->trace("TR: salon local créé")
        );
        addTransition(mainMenu,roomHost,CreateRoom,null,
            (_)->{
                trace("TR: salon créé");
                guests = [new Guest(null,peer.id,name)];
            }
        );
        addTransition(mainMenu,roomWait,JoinRoom,
            (args)->(args[0]!=""&&args[0]!=peer.id&&hostCo==null),
            (args)->{
                connectToHost(args[0]);
                trace("TR: demande envoyée");
            }
        );
        addTransition(mainMenu,mainMenu,JoinRoom,true,
            (args)->(args[0]==""),
            (_)->trace("no targetedHost")
        );
        addTransition(mainMenu,mainMenu,JoinRoom,true,
            (args)->(args[0]==peer.id),
            (_)->trace("targetedHost = selfId")
        );
        addTransition(mainMenu,mainMenu,JoinRoom,true,
            (_)->(hostCo!=null),
            (_)->trace("hostCo not null")
        );
        addTransition(roomWait,roomGuest,JoinRoom,null,
            (_)->trace("TR: salon rejoint")
        );
        
        // RETURN TO MAIN MENU
        addTransition(localGame,mainMenu,Return,null,
            (_)->trace("TR: salon local fermé")
        );
        addTransition(roomHost,mainMenu,Return,null,
            (_)->{
                closeRoom();
                trace("TR: salon fermé");
            }
        );
        addTransition(roomWait,mainMenu,Return,null,
            (_)->trace("TR: demande refusée")
        );
        addTransition(roomGuest,mainMenu,Return,null,
            (_)->{
                quitRoom();
                trace("TR: salon quitté");
            }
        );
        addTransition(gameRunning,mainMenu,Return,
            (_)->( !g.isRunning || role.match(Guest) ),
            (_)->{
                r.clearOutput();
                trace("TR: retour au menu");
            }
        );
        
        // LAUNCH GAME
        addTransition(localGame,gameRunning,Launch,
            (_)->(g!=null),
            (_)->{
                r.clearOutput();
                trace("TR: partie locale lancée");
            }
        );
        addTransition(roomHost,gameRunning,Launch,
            (_)->(g!=null),
            (_)->{
                r.clearOutput();
                trace("TR: partie lancée");
            }
        );
        addTransition(roomGuest,gameRunning,Launch,null,
            (_)->{
                r.clearOutput();
                trace("TR: partie lancée par l'hôte");
            }
        );

        // UPDATE GAME
        addTransition(roomHost,roomHost,Update,null,
            (_)->{
                sendToAll(GuestList([for(guest in guests) guest.name],[for(guest in guests)guest.id]));
                trace("TR: salon mis à jour");
            }
        );
        addTransition(roomGuest,roomGuest,Update,null,
            (_)->trace("TR: salon mis à jour")
        );
        addTransition(gameRunning,gameRunning,Update,null,
            (_)->trace("TR: partie mise à jour")
        );

        return true;
    }
    
    // state entrys/exits
    function entryMainMenu() {
        role = None;
        r.clearElements();
        r.printState();
        r.printMenu();
        
    }
    function entryLocalGame() {
        role = Local;
        r.clearElements();
        r.printState();
        r.printCreateLocal();
        r.printReturn();
        
    }
    function entryRoomHost() {
        role = Host;
        r.clearElements();
        r.printState();
        r.printHostId();
        r.printConnectedPlayers(true);
        r.printReturn();
        
    }
    function entryRoomWait() {
        role = Guest;
        guests = [];
        r.clearElements();
        r.printState();
    }
    function entryRoomGuest() {
        role = Guest;
        r.clearElements();
        r.printState();
        r.printConnectedPlayers();
        r.printReturn();
    }
    function entryGameRunning() {
        if(g==null) {
            trace("err wtf no game");
            return;
        }

        // State
        gameState = g.states[g.currentState].name;

        // Messages
        var message:GameMessage = null;
        if(role.match(Guest)) {
            while( (message=g.messages.shift())!=null ) {
                processGameMessage(message);
        }
        } else {
            while( (message=g.messages.shift())!=null ) {
                processGameMessage(message);
                if(role.match(Host))
                    sendToAll(GameUpdate(message));
            }
        }

        // Game state
        r.clearElements();
        r.printState(true);
        switch(gameState){
            case "Debut de partie":
                r.printBoard(g.board,g.nextSweep,true);
                r.printPlayers(g.players,g.currentPlayer);
                if( role.match(Local) || role.match(Host) )
                    r.printStartGame();
            case "Debut de manche":
                r.printBoard(g.board,g.nextSweep,true);
                r.printPlayers(g.players,g.currentPlayer);
                if( role.match(Local) || role.match(Host) )
                    r.printStartRound();
            case "Debut de tour":
                if(role.match(Local)) {
                    r.printBoard(g.board,g.nextSweep);
                    r.printPlayers(g.players,g.currentPlayer);
                    r.printLastCard(g.cardsPlayed.last(),g.players[g.lastPlayer]);
                    r.printNextCard(g.nextCard);
                    r.printPlayerHand(g.currentPlayer,g.nextCard,g.firstTurn);
                } else {
                    r.printBoard(g.board,g.nextSweep);
                    r.printPlayers(g.players,g.currentPlayer);
                    r.printLastCard(g.cardsPlayed.last(),g.players[g.lastPlayer]);
                    r.printNextCard(g.nextCard);
                    if(playerId==g.currentPlayer)
                        r.printPlayerHand(g.currentPlayer,g.nextCard,g.firstTurn);
                }
            case "Fin de manche":
                r.printBoard(g.board,g.nextSweep,true);
                r.printPlayers(g.players,g.currentPlayer);
                if( role.match(Local) || role.match(Host) )
                    r.printStopRound();
            case "Fin de partie":
                r.printBoard(g.board,g.nextSweep,true);
                r.printPlayers(g.players,g.currentPlayer);
                if( role.match(Local) || role.match(Host) )
                    r.printStopGame();
        }
    }

    // Game controls
    public function createGame(?players:Array<String>,initialMoney:Int) {
        if(role.match(Local)) {
            g = Game.create(players,initialMoney);

        } else if(role.match(Host)) {
            g = Game.create([for(guest in guests) guest.name],initialMoney);

        } else if(role.match(Guest)) {
            g = Game.create([for(guest in guests) guest.name],initialMoney);

        } else {
            r.printOutput("Votre rôle ne permet pas de créer une partie.");
        }
        
        if(g==null) {
            r.printOutput("Erreur lors de la création de la partie.");
            return;
        }
        
        if(role.match(Host)||role.match(Guest)) {
            for(i in 0...guests.length)
                if(guests[i].id==peer.id) {
                    playerId = i;
                    return;
                }
        }
    }
    public function startGame() {
        if(g==null) return;
        g.start();
        if(role.match(Host)) sendToAll(RoomLaunch(g.initialMoney));
        update(Launch);
    }
    public function stopGame() {
        if(g==null) return;
        g.stop();
        update(Return);
    }
    public function updateGame(event:GameEvent,?player:Int=null,?card:Card=null) {
        if(role.match(Guest)) {
            hostCo.send(GuestAction(event,card));

        } else if(role.match(Host)) {
            if(event==Go)
                g.update(event);
            else if( event==Jouer || event==Prendre )
                g.update(event,playerId,card);
            else if( event==Passer || event==Fin )
                g.update(event,playerId);
            update(Update);
            
        } else {
            if(event==Go)
                g.update(event);
            else if( event==Jouer || event==Prendre )
                g.update(event,g.currentPlayer,card);
            else if( event==Passer || event==Fin )
                g.update(event,g.currentPlayer);
            update(Update);
        }
    }
    public function getCards(player:PlayerId):Array<Card> {
        return g.players[player].cards;
    }

    // Peer/Room controls
    function initPeer() {
        peer = new Peer({debug:2});
        // connection to server established
        peer.on("open", (id)->{
            trace("PEER OPEN "+id);
        });
        // connection recieved, only for hosts
        peer.on("connection", (c)->{
            var co:DataConnection = (c:DataConnection);
            trace("PEER CONNECTION "+co.peer);
            if(role!=Host) {
                r.printOutput("Connection from guest "+co.peer+" refused because not hosting");
                co.on("open", (_)->{
                    co.send(CannotJoin("NoHost"));
                    Timer.delay(()->{if(co!=null) co.close();}, 500);
                });
            } else if( [for(guest in guests) if(guest.id==co.peer)true].length!=0 ) {
                r.printOutput("Connection from guest "+co.peer+" refused because guest already here");
                co.on("open", (_)->{
                    co.send(CannotJoin("AlreadyJoined"));
                    Timer.delay(()->{if(co!=null) co.close();}, 500);
                });
            } else if(guests.length>=8) {
                r.printOutput("Connection from guest "+co.peer+" refused because room full");
                co.on("open", (_)->{
                    co.send(CannotJoin("Full"));
                    Timer.delay(()->{if(co!=null) co.close();}, 500);
                });
            } else if(states[currentState].name=="Partie en cours") {
                r.printOutput("Connection from guest "+co.peer+" refused because already playing");
                co.on("open", (_)->{
                    co.send(CannotJoin("AlreadyPlaying"));
                    Timer.delay(()->{if(co!=null) co.close();}, 500);
                });
            } else {
                r.printOutput("Connection from guest "+co.peer+" accepted");
                // save connection
                guests.push(new Guest(co,co.peer,co.label));
                // notify guest
                co.on("open", (_)->{
                    co.send(RoomJoin);
                    update(Update);
                });
                // on data reception
                co.on("data", function(data) {
                    processMessageHost((data:Message),co.peer);
                });
                // connection closed
                co.on("close", (_)->{
                    r.printOutput("Connection closed with guest "+co.peer);
                    for(guest in guests) if(guest.id==co.peer) {
                        guests.remove(guest);
                        update(Update);
                        break;
                    }
                });
                // errors
                co.on("error", function(err){
                    trace("HOST CONNECTION ERROR "+err);
                    switch((err:Error).type){
                        default:
                            r.printOutput("error with guest "+err);
                    }
                });
            }
        });
        // connection lost
        peer.on("disconnected", (_)->{trace("PEER DISCONNECTED");});
        // connection destroyed
        peer.on("close", (_)->{trace("PEER CLOSE");});
        // errors
        peer.on("error", (err)->{
            trace("PEER ERROR "+err);
            switch((err:Error).type){
                case "peer-unavailable":
                    hostCo = null;
                    update(Return);
                default:
                    r.printOutput("error with peer "+err);
            }
        });
    }
    function connectToHost(id:String) {
        trace("ID: "+id+" "+peer.id);
        // connect to host
        hostCo = peer.connect(id,{label:name,metadata:null,serialization:"json",reliable:true});
        // on connection established
        hostCo.on("open", (_)->{
            r.printOutput("Connection to host "+hostCo.peer+" established");
        });
        // on data reception
        hostCo.on("data", (data)->{
            processMessageGuest((data:Message));
        });
        // connection closed
        hostCo.on("close", (_)->{
            r.printOutput("Connection closed with host "+hostCo.peer);
            hostCo = null;
            update(Return);
        });
        // errors
        hostCo.on("error", (err)->{
            trace("GUEST CONNECTION ERROR "+err);
            switch((err:Error).type){
                default:
                    r.printOutput("error with host "+err);
            }
        });
    }
    function closeRoom() {
        r.printOutput("Room closed");
        for(guest in guests) if(guest.id!=peer.id){
            guest.co.send(RoomClose("Closed"));
            Timer.delay(()->{if(guest.co!=null) guest.co.close();}, 500);
            r.printOutput("Disconnect "+guest.id);
        }
    }
    function quitRoom() {
        if(hostCo==null)
            return;
        hostCo.send(GuestQuit);
        Timer.delay(()->{if(hostCo!=null) hostCo.close();}, 500);
        hostCo = null;
    }
    function sendToAll(message:Message) {
        for(guest in guests)
            if(guest.co!=null)
                guest.co.send(message);
    }

    // Messages control
    function processGameMessage(message:GameMessage) {
        var elem:String = "";
        switch(message) {
            case GameInit:
                elem += "[Tr] [Init] La partie est créée !";
            case GameReady:
                elem += "</p><hr><p>";
                elem += "[St] La partie est prête à commencer !";
            case GameStart(dealer):
                elem += "[Tr] La partie commence ! ";
                elem += r.formatPlayerName(g.players[dealer].name);
                elem += " sera le premier donneur.";
            case GameEnd(losers):
                elem += "[Tr] La partie se termine, certains joueurs ne peuvent pas payer : ";
                for(i in 0...losers.length)
                    elem += (i!=0? "<span class='spacer medium'></span>": "")+
                        r.formatPlayerName(g.players[losers[i]].name);

            case GameOver(winners):
                elem += "</p><hr><p>";
                elem += "[St] [Fin] La partie est terminée ! Les gagnants sont ";
                for(i in 0...winners.length)
                    elem += (i!=0? "<span class='spacer medium'></span>": "")+
                        r.formatPlayerName(g.players[i].name);
                
            case RoundReady(round,dealer):
                elem += "</p><hr><p>";
                elem += "[St] La manche ";
                elem += r.formatValue(round);
                elem += " est prête à commencer, ";
                elem += r.formatPlayerName(g.players[dealer].name);
                elem += " est le donneur !";
            case RoundStart(round,dealer,hands,stock): 
                elem += "[Tr] La manche ";
                elem += r.formatValue(round);
                elem += " commence, ";
                elem += r.formatPlayerName(g.players[dealer].name);
                elem += " a distribué les cartes !";
            case RoundEnd(round):
                elem += "[Tr] Passage à la manche suivante !";
            case RoundOver(round,player,type):
                if(type=="Opera") {
                    elem += "</p><hr><p>";
                    elem += "[St] ";
                    elem += r.formatPlayerName(g.players[player].name);
                    elem += " réalise un Grand Opéra et remporte la manche ";
                    elem += r.formatValue(round);
                    elem += " !";
                } else if(type==null) {
                    elem += "</p><hr><p>";
                    elem += "[St] La manche ";
                    elem += r.formatValue(round);
                    elem += " a été remportée par ";
                    elem += r.formatPlayerName(g.players[player].name);
                    elem += " !";
                } else {
                    elem += "Message RoundOver -> "+message;
                }
            
            case TurnStart(player,cards):
                elem += "</p><hr><p>";
                elem += "[St] C'est à ";
                elem += r.formatPlayerName(g.players[player].name);
                elem += " de jouer, il lui reste ";
                elem += r.formatValue(cards.length);
                elem += " cartes en main.";
            
            case CardPlay(card,player):
                elem += "[Tr] ";
                elem += r.formatPlayerName(g.players[player].name);
                elem += " vient de jouer ";
                elem += r.formatCard(card);
                elem += ".";
            case CardStock(stock,type):
                if(type=="Start") {
                    elem += "Il y a ";
                    elem += r.formatValue(stock.length);
                    elem += " cartes dans le talon.";
                } else if(type=="End") {
                    elem += "Le talon était ";
                    for(i in 0...stock.length)
                        elem += (i!=0? "<span class='spacer medium'></span>": "")+
                            r.formatCard(stock[i]);
                    elem += ".";
                } else {
                    elem += "Message CardStock -> "+message;
                }
                
            case SweepWin(sweep,player,value,type):
                if(type=="Opera") {
                    elem += r.formatPlayerName(g.players[player].name);
                    elem += " remporte la mise de ";
                    elem += r.formatCard(Game.sweeps[sweep]);
                    elem += " pour ";
                    elem += r.formatMoney(value);
                    elem += " gràce au Grand Opera.";
                } else if( type==null||type=="" ) {
                    elem += r.formatPlayerName(g.players[player].name);
                    elem += " remporte la mise de ";
                    elem += r.formatCard(Game.sweeps[sweep]);
                    elem += " pour ";
                    elem += r.formatMoney(value);
                    elem += ".";
                } else {
                    elem += "Message SweepWin -> "+message;
                }
            case SweepMiss(sweep,player):
                elem += r.formatPlayerName(g.players[player].name);
                elem += " a oublié de récupérer ";
                elem += r.formatCard(Game.sweeps[sweep]);
                elem += ".";

            case PlayerPass(player,rank):
                elem += "[Tr] ";
                elem += r.formatPlayerName(g.players[player].name);
                elem += " : Sans ";
                elem += r.formatCardRank(Card.RANKS[rank]);
                elem += ".";
            case PlayerEnd(player,round):
                elem += "[Tr] ";
                elem += r.formatPlayerName(g.players[player].name);
                elem += " termine la manche ";
                elem += r.formatValue(round);
                elem += ".";
            case PlayerBet(player,sweep,value,type):
                if(type=="Bet") {
                    elem += r.formatPlayerName(g.players[player].name);
                    elem += " a misé.";
                } else if(type=="Repay") {
                    elem += r.formatPlayerName(g.players[player].name);
                    elem += " double la mise de ";
                    elem += r.formatCard(Game.sweeps[sweep]);
                    elem += " pour ";
                    elem += r.formatMoney(value);
                    elem += ".";
                } else {
                    elem += "Message PlayeBet -> "+message;
                }
            case PlayerPay(from,to,value):
                elem += r.formatPlayerName(g.players[from].name);
                elem += " paye ";
                elem += r.formatMoney(value);
                elem += " à ";
                elem += r.formatPlayerName(g.players[to].name);
                elem += ".";
            case PlayerBankruptcy(player):
                elem += r.formatPlayerName(g.players[player].name);
                elem += " est ruiné.";

            case CannotPlay(player,card,type):
                elem += "Impossible de joueur la carte ! ("+type+")";
            case CannotWin(player,card,type):
                elem += "Impossible de prendre la mise ! ("+type+")";
            case CannotPass(player,type):
                elem += "Impossible de passer son tour ! ("+type+")";
            case CannotEnd(player,round,type):
                elem += "Impossible de terminer la manche ! ("+type+")";
        }
        r.printOutput(elem);
    }
    function processGameMessageGuest(message:GameMessage) {
        switch(message) {
            case GameStart(dealer):
                g.update(Go,dealer);
            case RoundStart(_,_,hands,stock):
                g.update(Go,hands,stock);
            case RoundEnd(_):
                g.update(Go);
            case GameEnd(_):
                g.update(Go);
                
            case CardPlay(card,player):
                g.update(Jouer,player,card);
            case CannotPlay(player,card,_):
                g.update(Jouer,player,card);

            case SweepWin(sweep,player,_,type):
                if( type==null || type=="" ) {
                    g.update(Prendre,player,Game.sweeps[sweep]);
                }
            case CannotWin(player,card,_):
                g.update(Prendre,player,card);

            case PlayerPass(player,_):
                g.update(Passer,player);
            case CannotPass(player,_):
                g.update(Passer,player);

            case PlayerEnd(player,_):
                g.update(Fin,player);
            case CannotEnd(player,_,_):
                g.update(Fin,player);

            default:
        }
    }
    function processMessageHost(message:Message,sender:String) {
        if(!role.match(Host))
            return;
        var elem:String = "";
        switch(message) {
            // Host
            case GuestQuit:
                r.printOutput("Départ du joueur : "+sender);
                for(guest in guests) if(guest.id==sender) {
                    guests.remove(guest);
                    update(Update);
                    break;
                }
            case GuestAction(event,card):
                var player:Int = -1;
                for(i in 0...guests.length)
                    if(guests[i].id==sender) {
                        player = i;
                        break;
                    }
                g.update(event,player,Card.clone(card));
                update(Update);
            default :
                elem += "Message Host -> "+message;
        }
        r.printOutput(elem);
    }
    function processMessageGuest(message:Message) {
        if(!role.match(Guest))
            return;
        var elem:String = "";
        switch(message) {
            // Guest
            case RoomJoin:
                r.printOutput("Salon rejoint !");
                update(JoinRoom);
            case CannotJoin(reason):
                r.printOutput("Impossible de rejoindre le salon : "+reason);
                update(Return);
            case RoomClose(reason):
                r.printOutput("Salon fermé ! "+reason);
                update(Return);
            case RoomLaunch(money):
                r.printOutput("L'hôte commence la partie !");
                createGame(money);
                startGame();
                update(Launch);
            case GuestList(names,ids):
                guests = [for(i in 0...names.length) new Guest(null,ids[i],names[i])];
                update(Update);
            case GameUpdate(message):
                // gameMessages.push(fixGameMessage(message));
                processGameMessageGuest(fixGameMessage(message));
                update(Update);
            case CannotAct(reason):
                r.printOutput("Action impossible : "+reason);
                update(Update);
            
            default :
                elem += "Message Guest -> "+message;
        }
        r.printOutput(elem);
    }
    function fixGameMessage(message:GameMessage):GameMessage {
        return switch(message){
            case RoundStart(round,dealer,hands,stock):
                RoundStart(round,dealer,[for(h in hands) h.map((c)->Card.clone(c))],stock.map((c)->Card.clone(c)));
                
            case TurnStart(player,cards):
                TurnStart(player,cards.map((c)->Card.clone(c)));
            
            case CardPlay(card,player):
                CardPlay(Card.clone(card),player);
            case CardStock(stock,type):
                CardStock(stock.map((c)->Card.clone(c)),type);

            case CannotPlay(player,card,type):
                CannotPlay(player,Card.clone(card),type);
            case CannotWin(player,card,type):
                CannotWin(player,Card.clone(card),type);

            default:
                message;
        }
    }
}

enum abstract Event(String) to String {
    var CreateLocal;
    var CreateRoom;
    var JoinRoom;
    var Return;
    var Launch;
    var Update;
}

enum Message {
    // Guest -> Host
    GuestQuit;
    GuestAction(event:GameEvent,card:Card);

    // Host -> Guest
    RoomJoin;
    RoomClose(reason:String);
    RoomLaunch(money:Int);
    GuestList(names:Array<String>,ids:Array<String>);
    GameUpdate(message:GameMessage);
    CannotJoin(reason:String);
    CannotAct(reason:String);
}

enum Role {
    None;
    Local;
    Host;
    Guest;
}

class Guest {
    public function new(?co:DataConnection,?id:String,?name:String) {
        this.co = co;
        this.id = co!=null? co.peer: id;
        this.name = name!=null? name: "MissingNo.";
    }

    public var id:String;
    public var co:DataConnection;
    public var name:String;
}

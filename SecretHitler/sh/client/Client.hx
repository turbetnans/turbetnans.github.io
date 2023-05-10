package sh.client;

import sh.client.components.Buttons;
import Peer;
import sh.client.components.Log;
import sh.client.components.TopBoard;
import sh.client.components.PlayerList;
import sh.client.components.FascistBoard;
import sh.client.components.LiberalBoard;
import sh.client.components.BottomBoard;
import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;
import js.Browser;
import js.html.InputElement;

typedef PropsType = {}
typedef StateType = {
    state:State,
    peer:String,
    name:String,
    playerId:Int,
    role:Role,
    guests:Array<Guest>,
    host:DataConnection,
    history:Array<Message>
}

@:expose
class Client extends ReactComponent<PropsType,StateType> {
    public function new(props) {
        super(props);
        state = {
            state:MENU,
            peer:"",
            name:"",
            playerId:null,
            role:Role.NONE,
            guests:[],
            host:null,
            history:[]
        };
    }

    override function componentDidMount() {
        peer = new Peer({debug:2});
        peer.on("open", peerId->setState({state:MENU, peer:peerId}));
        peer.on("connection", c->{
            var co:DataConnection = (c:DataConnection);
            if(state.role!=Role.HOST) {
                co.send(HostMessage.REJECT(Reason.NOT_HOSTING));
                co.on("open", _->co.close());
            } else if( state.guests.filter(g->g.co!=null&&g.co.peer==co.peer).length>0 ) {
                co.send(HostMessage.REJECT(Reason.ALREADY_CONNECTED));
                co.on("open", _->co.close());
            } else if(state.guests.length>=10) {
                co.send(HostMessage.REJECT(Reason.ROOM_FULL));
                co.on("open", _->co.close());
            } else if(state.state==GAME) {
                co.send(HostMessage.REJECT(Reason.GAME_LAUNCHED));
                co.on("open", _->co.close());
            } else {
                co.on("open", _->{
                    co.send(HostMessage.ACCEPT);
                    setState({guests:state.guests.concat([new Guest(co.label, co, state.guests.length)])},
                        ()->sendToAllGuests(LIST([for(guest in state.guests) guest.name]))
                    );
                });
                co.on("data", data->processGuestMessage((data:GuestMessage), co.peer));
                co.on("close", _->{
                    trace('co close');
                    for(guest in state.guests) {
                        if(guest.co!=null&&guest.co.peer==co.peer) {
                            state.guests.remove(guest);
                            setState({guests:state.guests},
                                ()->sendToAllGuests(LIST([for(guest in state.guests) guest.name]))
                            );
                            break;
                        }
                    }
                });
                co.on("error", err->trace('co error '+(err:Error)));
            }
        });
        peer.on("disconnected", _->trace('peer disconnected'));
        peer.on("close", _->trace('peer close'));
        peer.on("error", err->trace('peer error '+(err:Error)));
    }
    override function componentDidUpdate(prevProps:PropsType, prevState:StateType) {}
    override function componentWillUnmount() {}

    public var game:Game;
    public var peer:Peer;

    function create() {
        if(state.name=="") {
            return;
        }
        setState({state:ROOM, role:HOST, guests:state.guests.concat([new Guest(state.name, null, 0)])});
    }

    function join() {
        var hostId:String = (cast Browser.document.getElementById('hostId'):InputElement).value;
        if(hostId=="" || hostId==state.peer || state.name=="") {
            return;
        }
        state.host = peer.connect(hostId,{label:state.name,metadata:null,serialization:'json',reliable:true});
        state.host.on("open", _->trace('host co open'));
        state.host.on("data", data->processHostMessage((data:HostMessage)));
        state.host.on("close", _->trace('host co close'));
        state.host.on("error", err->trace('host co error '+(err:Error)));
        setState({state:LOADING, role:GUEST});
    }

    function generateRandomName() {
        setState({name: Player.NAMES[Std.random(Player.NAMES.length)]});
    }

    function start(nbPlayers:Int, role:Role) {
        if(nbPlayers<5||nbPlayers>10)
            return;
        game = Game.create(nbPlayers, [for(g in state.guests) g.name]);
        game.fsm.start();
        if(state.role==Role.HOST) {
            for(guest in state.guests) {
                if(guest.co!=null) {
                    guest.co.send(HostMessage.LAUNCH(guest.id));
                }
            }
            var message:Message = null;
            while( (message=game.messages.shift())!=null ) {
                state.history.push(message);
                sendToAllGuests(UPDATE(message));
            }
            setState({state:GAME, role:role, playerId:0});
        } else {
            setState({state:GAME, role:role});
        }
        update();
    }

    function back() {
        switch(state.role) {
            case HOST:
                sendToAllGuests(CLOSE);
                state.guests = [];
            case GUEST:
                state.host.send(QUIT);
            default:
        }
        setState({state: MENU});
    }

    function update(?event:Event, ?source:PlayerId, ?target:Int) {
        var message:Message = null;
        var error:Error = null;
        switch(state.role) {
            case GUEST:
                state.host.send(PLAY(event, source, target));
            case HOST:
                game.update(event, source, target);
                while( (message=game.messages.shift())!=null ) {
                    state.history.push(message);
                    sendToAllGuests(UPDATE(message));
                }
                while( (error=game.errors.shift())!=null ) {
                    trace(error);
                }
            case LOCAL:
                game.update(event, source, target);
                while( (message=game.messages.shift())!=null ) {
                    state.history.push(message);
                }
                while( (error=game.errors.shift())!=null ) {
                    trace(error);
                }
            case NONE:
        }
        setState({});
    }

    function processGuestMessage(guestMessage:GuestMessage,sender:String) {
        if(state.role!=Role.HOST)
            return;
        switch(guestMessage) {
            case QUIT:
                for(guest in state.guests) {
                    if(guest.co!=null&&guest.co.peer==sender) {
                        state.guests.remove(guest);
                        setState({guests:state.guests},
                            ()->sendToAllGuests(LIST([for(guest in state.guests) guest.name]))
                        );
                        break;
                    }
                }
            case PLAY(event, source, target):
                update(event, source, target);
        }
    }
    function processHostMessage(hostMessage:HostMessage) {
        if(state.role!=Role.GUEST)
            return;
        switch(hostMessage) {
            case ACCEPT:
                setState({state:ROOM});
            case REJECT(reason):
                trace(reason);
                setState({state:MENU, role:NONE});
            case CLOSE:
                setState({state:MENU, role:NONE});
            case LAUNCH(id):
                setState({playerId:id});
                start(state.guests.length, Role.GUEST);
            case LIST(names):
                var i:Int = 0;
                setState({guests: [for(name in names) new Guest(name, null, i++)]});
            case UPDATE(gameMessage):
                switch(gameMessage) {
                    case INIT(cards,firstPresident,roles):
                        game.drawPile = cards;
                        game.president = firstPresident;
                        game.roles = roles;
                        for(i in 0...game.roles.length)
                            game.players[i].role = game.roles[i];
                    case DECK(cards):
                        game.drawPile = cards;
                    case STATE(state):
                    case EVENT(event,source,target):
                        game.update(event, source, target);
                }
                var message:Message = null;
                while( (message=game.messages.shift())!=null ) {
                    state.history.push(message);
                }
        }
        setState({});
    }

    function sendToAllGuests(message:HostMessage) {
        for(guest in state.guests)
            if(guest.co!=null)
                guest.co.send(message);
    }

    function changeName(event) {
        setState({name: event.target.value});
    }

    function renderTitle():ReactElement {
        return jsx(
            <span>{'Can you find and stop the... SECRET HITLER'}</span>
        );
    }

    function renderCredits():ReactElement {
        return jsx(
            <span>{'https://www.secrethitler.com/ | https://turbetnans.github.io/'}</span>
        );
    }

    function renderMenu():ReactElement {
        return jsx(
            <div id="client">
                <div id="background"/>
                <div className='header'>
                    {renderTitle()}
                    <div id='top'><span>{"Menu Principal"}</span></div>
                </div>
                <div id="menu">
                    <span id='id'>{state.peer}</span><br/>
                    <input id='name' type='text' placeholder='Entrez votre nom' onChange={changeName} value={state.name}/>
                    <i className="bi bi-dice-6-fill" onClick={_->generateRandomName()}></i>
                    <br/>
                    <button onClick={_->start(5, Role.LOCAL)}>{'Créer partie locale'}</button>
                    <br/>
                    <button onClick={_->create()}>{'Créer partie en ligne'}</button>
                    <br/>
                    <button onClick={_->join()}>{'Rejoindre partie en ligne'}</button>
                    <br/>
                    <input id='hostId' type='text' placeholder="Entrez l'ID de l'hote"/>
                    <br/>
                </div>
                <div className='footer'>
                    <div id='bottom'><span>{"Menu Principal"}</span></div>
                    {renderCredits()}
                </div>
            </div>
        );
    }
    
    function renderRoom():ReactElement {
        var players:Array<ReactElement> = [];
        for(i in 0...state.guests.length) {
            players.push(jsx(
                <input key={'g$i'} type='text' disabled={true} value={state.guests[i].name}/>
            ));
        }
        return jsx(
            <div id="client">
                <div id="background"/>
                <div className='header'>
                    {renderTitle()}
                    <div id='top'><span>{"Salon"}</span></div>
                </div>
                <div id="room">
                    <span id='id'>{state.peer}</span><br/>
                    {players}
                    <br/>
                    <button onClick={_->start(state.guests.length, HOST)} hidden={state.role!=Role.HOST}>{'Lancer partie en ligne'}</button><br/>
                    <button onClick={_->back()}>{'Retour'}</button><br/>
                </div>
                <div className='footer'>
                    <div id='bottom'><span>{"Salon"}</span></div>
                    {renderCredits()}
                </div>
            </div>
        );
    }
    
    function renderGame():ReactElement {
        return jsx(
            <div id="client">
                <div id="background"/>
                <div className='header'>
                    {renderTitle()}
                    <TopBoard game={game}/>
                    <LiberalBoard game={game}/>
                    <FascistBoard game={game}/>
                    <PlayerList game={game} clickHandeler={update} local={state.role==Role.LOCAL} id={state.playerId}/>
                    <Buttons game={game} clickHandeler={update} local={state.role==Role.LOCAL} id={state.playerId}/>
                </div>
                <Log game={game} history={state.history}/>
                <div className='footer'>
                    <BottomBoard game={game}/>
                    {renderCredits()}
                </div>
            </div>
        );
    }

    override function render():ReactElement {
        return switch(state.state) {
            case LOADING: jsx(<div id="client">{'chargement'}</div>);
            case MENU: renderMenu();
            case ROOM: renderRoom();
            case GAME: renderGame();
            default: jsx(<span>ERROR</span>);
        }
    }
}

enum GuestMessage {
    QUIT;
    PLAY(event:Event, source:PlayerId, target:Int);
}
enum HostMessage {
    ACCEPT;
    CLOSE;
    LAUNCH(id:Int);
    LIST(names:Array<String>);
    UPDATE(message:Message);
    REJECT(reason:Reason);
}
enum Reason {
    NOT_HOSTING;
    SELF_CONNECT;
    ALREADY_CONNECTED;
    ROOM_FULL;
    GAME_LAUNCHED;
}

enum abstract State(String) from String to String {
    var LOADING;
    var MENU;
    var ROOM;
    var GAME;
}
enum abstract Role(String) from String to String {
    var NONE;
    var HOST;
    var GUEST;
    var LOCAL;
}

class Guest {
    public function new(name:String, ?co:DataConnection, id:Int) {
        this.co = co;
        this.name = name!=null? name: "MissingNo.";
        this.id = id;
    }

    public var co:DataConnection;
    public var name:String;
    public var id:Int;
}

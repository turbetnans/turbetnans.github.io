package sh.client.components;

import react.native.component.props.Style;
import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

@:expose
class Player extends ReactComponent {
    public function new(props) {
        super(props);
    }

    private function formatRole(role:Role) {
        return switch(role){
            case NONE: "";
            case HITLER: "Hitler";
            case FASCIST: "Fasciste";
            case LIBERAL: "Liberal";
        };
    }

    override function render() {
        var id:PlayerId = props.id;
        var game:Game = props.game;
        var className:String = "";

        if(game.players[id].status==DEAD) {
            className = "dead";
        } else if(game.votes[id]==JA && game.isInState(State.VOTE_COUNTING)) {
            className = "ja";
        } else if(game.votes[id]==NEIN && game.isInState(State.VOTE_COUNTING)) {
            className = "nein";
        } else if(game.isInState(State.FASCISTS_REVEAL) && props.local) {
            if(game.players[id].role==HITLER) {
                className = "hitler";
            } else if(game.players[id].role==FASCIST) {
                className = "fascist";
            }
        } else if(game.isInState(State.FASCISTS_REVEAL) && game.players[props.localId].role==FASCIST) {
            if(game.players[id].role==HITLER) {
                className = "hitler";
            } else if(game.players[id].role==FASCIST) {
                className = "fascist";
            }
        } else if(game.isInState(State.FASCISTS_REVEAL) && game.players[props.localId].role==HITLER && game.players.length<7) {
            if(game.players[id].role==HITLER) {
                className = "hitler";
            } else if(game.players[id].role==FASCIST) {
                className = "fascist";
            }
        } else if(game.isInState(State.LOYALTY_INVESTIGATION_RESULT) && props.localId==game.president && id==game.investigatedPlayer) {
            if(game.players[id].role==HITLER || game.players[id].role==FASCIST) {
                className = "fascist";
            } else {
                className = "liberal";
            }
        } else if(game.isInState(State.LOYALTY_INVESTIGATION_RESULT) && props.local && id==game.investigatedPlayer) {
            if(game.players[id].role==HITLER || game.players[id].role==FASCIST) {
                className = "fascist";
            } else {
                className = "liberal";
            }
        } else if(id==game.president) {
            className = "president";
        } else if(id==game.chancelor) {
            className = "chancelor";
        }

        var content:ReactElement = null;
        if(!game.fsm.isRunning) {
            content = null;
            
        } else if( game.players[id].status==DEAD ) {
            content = jsx(
                <div>
                    {'Mort'}
                </div>
            );

        } else if( game.isInState(State.CHANCELOR_NOMINATION) && id!=game.president && game.checkEligibility(id) && ( props.localId==game.president || props.local ) ) {
            content = jsx(
                <div>
                    <button onClick={()->props.clickHandeler(NOMINATE, game.president, id)}>{"Nommer"}</button>
                </div>
            );

        } else if( game.isInState(State.GOVERNMENT_VOTE) && !game.votes.exists(id) && props.local ){
            content = jsx(
                <div>
                    <button className={'half'} onClick={()->props.clickHandeler(JA, id)}>{"Ja !"}</button>
                    <button className={'half'} onClick={()->props.clickHandeler(NEIN, id)}>{"Nein !"}</button>
                </div>
            );
        } else if( game.isInState(State.GOVERNMENT_VOTE) && game.votes.exists(id) ) {
            content = jsx(
                <div>
                    <span>{'voted'}</span>
                </div>
            );
        } else if( game.isInState(State.VOTE_COUNTING) ) {
            content = jsx(
                <div>
                    {game.votes[id]}
                </div>
            );

        } else if( game.isInState(State.LOYALTY_INVESTIGATION) && id!=game.president && ( props.localId==game.president || props.local ) ) {
            content = jsx(
                <div>
                    <button onClick={()->props.clickHandeler(INVESTIGATE, game.president, id)}>{"Enquêter"}</button>
                </div>
            );
        } else if( game.isInState(State.SPECIAL_ELECTION) && id!=game.president && ( props.localId==game.president || props.local ) ) {
            content = jsx(
                <div>
                    <button onClick={()->props.clickHandeler(CHOOSE, game.president, id)}>{"Choisir"}</button>
                </div>
            );
        } else if( game.isInState(State.EXECUTION) && id!=game.president && ( props.localId==game.president || props.local ) ) {
            content = jsx(
                <div>
                    <button onClick={()->props.clickHandeler(EXECUTE, game.president, id)}>{"Exécuter"}</button>
                </div>
            );
        }

        var role:ReactElement= null;
        if( props.local || id==props.localId ) {
            role = jsx(
                <div>
                    {'${formatRole(game.players[id].role)}'}
                </div>
            );
        }

        return jsx(
            <div className={'player '+className} key={'player$id'}>
                <div className='title'>
                    <input type='checkbox' hidden={!props.local && id==props.localId}/>
                    <span>{'${game.players[id].name}'}</span>
                    <input type='checkbox' hidden={!props.local && id==props.localId}/>
                </div>
                <div>
                    {role}
                </div>
                <div>
                    {content}
                </div>
                <div>
                    {id==game.president? 'President': id==game.chancelor? 'Chancelier': ''}
                </div>
            </div>
        );
    }
}

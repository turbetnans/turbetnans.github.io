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

    override function render() {
        var id:PlayerId = props.id;
        var game:Game = props.game;
        var style:Style = {
            backgroundColor:
                game.players[id].status==DEAD ? 'dimgray':
                game.votes[id]==JA && game.isInState(State.VOTE_COUNTING)? 'forestgreen':
                game.votes[id]==NEIN && game.isInState(State.VOTE_COUNTING)? 'firebrick':
                game.isInState(State.FASCISTS_REVEAL) && props.local ? 
                    game.players[id].role==HITLER ? 'red':
                    game.players[id].role==FASCIST ? 'sienna':
                    'silver':
                game.isInState(State.FASCISTS_REVEAL) && game.players[props.localId].role==FASCIST ? 
                    game.players[id].role==HITLER ? 'red':
                    game.players[id].role==FASCIST ? 'sienna':
                    'silver':
                game.isInState(State.FASCISTS_REVEAL) && game.players[props.localId].role==HITLER && game.players.length<7 ? 
                    game.players[id].role==HITLER ? 'red':
                    game.players[id].role==FASCIST ? 'sienna':
                    'silver':
                game.isInState(State.LOYALTY_INVESTIGATION_RESULT) && props.localId==game.president && id==game.investigatedPlayer ? 
                    game.players[id].role==HITLER || game.players[id].role==FASCIST ? 'sienna':
                    'cyan':
                game.isInState(State.LOYALTY_INVESTIGATION_RESULT) && props.local && id==game.investigatedPlayer ? 
                    game.players[id].role==HITLER || game.players[id].role==FASCIST ? 'sienna':
                    'cyan':
                id==game.president? 'chartreuse':
                id==game.chancelor? 'orange':
                'silver'
        };

        var content:ReactElement = null;
        if(!game.fsm.isRunning) {
            content = null;
            
        } else if( game.players[id].status==DEAD ) {
            content = jsx(
                <div>
                    {'dead'}
                </div>
            );

        } else if( game.isInState(State.CHANCELOR_NOMINATION) && id!=game.president && ( props.localId==game.president || props.local ) ) {
            content = jsx(
                <div>
                    <button onClick={()->props.clickHandeler(game.president, NOMINATE, id)}>{NOMINATE}</button>
                </div>
            );

        } else if( game.isInState(State.GOVERNMENT_VOTE) && game.votes.get(id)==null && props.local ){
            content = jsx(
                <div>
                    <button className={'half'} onClick={()->props.clickHandeler(id, JA)}>{JA}</button>
                    <button className={'half'} onClick={()->props.clickHandeler(id, NEIN)}>{NEIN}</button>
                </div>
            );
        } else if( game.isInState(State.GOVERNMENT_VOTE) && game.votes.get(id)!=null ) {
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
                    <button onClick={()->props.clickHandeler(game.president, INVESTIGATE, id)}>{INVESTIGATE}</button>
                </div>
            );
        } else if( game.isInState(State.SPECIAL_ELECTION) && id!=game.president && ( props.localId==game.president || props.local ) ) {
            content = jsx(
                <div>
                    <button onClick={()->props.clickHandeler(game.president, CHOOSE, id)}>{CHOOSE}</button>
                </div>
            );
        } else if( game.isInState(State.EXECUTION) && id!=game.president && ( props.localId==game.president || props.local ) ) {
            content = jsx(
                <div>
                    <button onClick={()->props.clickHandeler(game.president, EXECUTE, id)}>{EXECUTE}</button>
                </div>
            );
        }

        var role:ReactElement= null;
        if( props.local || id==props.localId ) {
            role = jsx(
                <div>
                    {'${game.players[id].role}'}
                </div>
            );
        }

        return jsx(
            <div className='player' style={style} key={'player$id'}>
                <div className='title'>
                    {'${game.players[id].name}'}
                </div>
                <div hidden={role==null}>
                    {role}
                </div>
                <div hidden={id!=game.president && id!=game.chancelor}>
                    {id==game.president? 'President': id==game.chancelor? 'Chancelor': ''}
                </div>
                <div hidden={content==null}>
                    {content}
                </div>
            </div>
        );
    }
}

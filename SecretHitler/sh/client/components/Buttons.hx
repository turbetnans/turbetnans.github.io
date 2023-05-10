package sh.client.components;

import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

using util.ArrayExt;

@:expose
class Buttons extends ReactComponent {
    public function new(props) {
        super(props);
    }

    override function render() {
        var game:Game = props.game;
        
        var showStartButton:Bool =
            game.isInState(State.GAME_START) &&
            (props.id==game.president || props.local);

        var showNextButton:Bool =
            (props.id==game.president || props.local) && (
            game.isInState(State.FASCISTS_REVEAL) ||
            game.isInState(State.VOTE_COUNTING) && (game.voteResult==JA || game.electionTracker<2) ||
            game.isInState(State.POLICY_REVEAL) ||
            game.isInState(State.POLICY_PEEK_RESULT) ||
            game.isInState(State.LOYALTY_INVESTIGATION_RESULT) ||
            game.isInState(State.SPECIAL_ELECTION_RESULT) ||
            game.isInState(State.POLICY_PEEK_RESULT) ||
            game.isInState(State.EXECUTION_RESULT) );
        
        var showRevealButton:Bool =
            game.isInState(State.GOVERNMENT_VOTE) &&
            Lambda.count(game.votes)==game.players.filter(p->p.status==ALIVE).length &&
            (props.id==game.president || props.local);
        
        var showChaosButton:Bool =
            (game.isInState(State.VOTE_COUNTING) && game.voteResult==NEIN && game.electionTracker==2 ||
            game.isInState(State.VETO_PROPOSITION) && game.electionTracker==2) &&
            (props.id==game.president || props.local);

        var showVoteButtons:Bool = 
            game.isInState(State.GOVERNMENT_VOTE) &&
            game.votes.get(props.id)==null &&
            !props.local;

        var showDiscardButton:Bool = 
            game.isInState(State.PRESIDENT_SESSION) &&
            (props.id==game.president || props.local);

        var showSelectButton:Bool = 
            game.isInState(State.CHANCELOR_SESSION) &&
            (props.id==game.chancelor || props.local);

        var showVetoButton:Bool = 
            game.isInState(State.CHANCELOR_SESSION) &&
            (props.id==game.chancelor || props.local) &&
            game.fascistPoliciesPassed==5 &&
            !game.vetoUsed;

        var showAcceptButton:Bool =
            game.isInState(State.VETO_PROPOSITION) &&
            game.electionTracker<2 &&
            (props.id==game.president || props.local);

        var showDeclineButton:Bool =
            game.isInState(State.VETO_PROPOSITION) &&
            (props.id==game.president || props.local);

        var showPeekButton:Bool =
            game.isInState(State.POLICY_PEEK) &&
            (props.id==game.president || props.local);

        var showPeekResult:Bool =
            game.isInState(State.POLICY_PEEK_RESULT) &&
            (props.id==game.president || props.local);

        return jsx(
            <div id='buttons'>
                <button hidden={!showStartButton} onClick={()->props.clickHandeler(0, START)}>{'Commencer'}</button>
                <button hidden={!showRevealButton} onClick={()->props.clickHandeler(0, REVEAL)}>{'Révéler'}</button>
                <button hidden={!showChaosButton} onClick={()->props.clickHandeler(0, CHAOS)}>{'CHAOS'}</button>
                <button hidden={!showNextButton} onClick={()->props.clickHandeler(0, NEXT)}>{'Suivant'}</button>
                <button hidden={!showVoteButtons} onClick={()->props.clickHandeler(props.id, JA)}>{'JA !'}</button>
                <button hidden={!showVoteButtons} onClick={()->props.clickHandeler(props.id, NEIN)}>{'NEIN !'}</button>
                <button hidden={!showDiscardButton} onClick={()->props.clickHandeler(game.president, DISCARD, 0)}>{game.proposedPolicies[0]}</button>
                <button hidden={!showDiscardButton} onClick={()->props.clickHandeler(game.president, DISCARD, 1)}>{game.proposedPolicies[1]}</button>
                <button hidden={!showDiscardButton} onClick={()->props.clickHandeler(game.president, DISCARD, 2)}>{game.proposedPolicies[2]}</button>
                <button hidden={!showSelectButton} onClick={()->props.clickHandeler(game.chancelor, SELECT, 0)}>{game.proposedPolicies[0]}</button>
                <button hidden={!showSelectButton} onClick={()->props.clickHandeler(game.chancelor, SELECT, 1)}>{game.proposedPolicies[1]}</button>
                <button hidden={!showVetoButton} onClick={()->props.clickHandeler(game.chancelor, VETO)}>{'Demander un véto'}</button>
                <button hidden={!showAcceptButton} onClick={()->props.clickHandeler(game.president, ACCEPT)}>{'Accepter'}</button>
                <button hidden={!showDeclineButton} onClick={()->props.clickHandeler(game.president, DECLINE)}>{'Refuser'}</button>
                <button hidden={!showPeekButton} onClick={()->props.clickHandeler(game.president, PEEK)}>{'Espionner'}</button>
                <button hidden={!showPeekResult} disabled={true}>{game.drawPile[0]}</button>
                <button hidden={!showPeekResult} disabled={true}>{game.drawPile[1]}</button>
                <button hidden={!showPeekResult} disabled={true}>{game.drawPile[2]}</button>
            </div>
        );
    }
}

package sh.client.components;

import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

@:expose
class Buttons extends ReactComponent {
    public function new(props) {
        super(props);
    }

    private function formatPolicy(policy:Policy) {
        return switch(policy){
            case FASCIST_POLICY: "Décret fasciste";
            case LIBERAL_POLICY: "Décret liberal";
        };
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
            !game.votes.exists(props.id) &&
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
        
        if(!showDiscardButton && !showSelectButton && !showSelectButton &&
                !showPeekResult && !showStartButton && !showRevealButton &&
                !showChaosButton && !showNextButton && !showVoteButtons &&
                !showVetoButton && !showAcceptButton && !showDeclineButton &&
                !showPeekButton) {
            return null;
        }

        return jsx(
            <div id='buttons'>
                <button hidden={!showDiscardButton} onClick={()->props.clickHandeler(DISCARD, game.president, 0)}>{formatPolicy(game.proposedPolicies[0])}</button>
                <button hidden={!showDiscardButton} onClick={()->props.clickHandeler(DISCARD, game.president, 1)}>{formatPolicy(game.proposedPolicies[1])}</button>
                <button hidden={!showDiscardButton} onClick={()->props.clickHandeler(DISCARD, game.president, 2)}>{formatPolicy(game.proposedPolicies[2])}</button>
                <button hidden={!showSelectButton} onClick={()->props.clickHandeler(SELECT, game.chancelor, 0)}>{formatPolicy(game.proposedPolicies[0])}</button>
                <button hidden={!showSelectButton} onClick={()->props.clickHandeler(SELECT, game.chancelor, 1)}>{formatPolicy(game.proposedPolicies[1])}</button>
                <button hidden={!showPeekResult} disabled={true}>{formatPolicy(game.drawPile[0])}</button>
                <button hidden={!showPeekResult} disabled={true}>{formatPolicy(game.drawPile[1])}</button>
                <button hidden={!showPeekResult} disabled={true}>{formatPolicy(game.drawPile[2])}</button>
                <button hidden={!showStartButton} onClick={()->props.clickHandeler(START, 0)}>{'Commencer'}</button>
                <button hidden={!showRevealButton} onClick={()->props.clickHandeler(REVEAL, 0)}>{'Révéler'}</button>
                <button hidden={!showChaosButton} onClick={()->props.clickHandeler(CHAOS, 0)}>{'CHAOS'}</button>
                <button hidden={!showNextButton} onClick={()->props.clickHandeler(NEXT, 0)}>{'Suivant'}</button>
                <button hidden={!showVoteButtons} onClick={()->props.clickHandeler(JA, props.id)}>{'JA !'}</button>
                <button hidden={!showVoteButtons} onClick={()->props.clickHandeler(NEIN, props.id)}>{'NEIN !'}</button>
                <button hidden={!showVetoButton} onClick={()->props.clickHandeler(VETO, game.chancelor)}>{'Véto'}</button>
                <button hidden={!showAcceptButton} onClick={()->props.clickHandeler(ACCEPT, game.president)}>{'Accepter'}</button>
                <button hidden={!showDeclineButton} onClick={()->props.clickHandeler(DECLINE, game.president)}>{'Refuser'}</button>
                <button hidden={!showPeekButton} onClick={()->props.clickHandeler(PEEK, game.president)}>{'Espionner'}</button>
            </div>
        );
    }
}

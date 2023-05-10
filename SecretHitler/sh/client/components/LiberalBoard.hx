package sh.client.components;

import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

@:expose
class LiberalBoard extends ReactComponent {
    public function new(props) {
        super(props);
    }

    function formatPower(power:Power):String {
        return switch(power) {
            case NO_POWER : "Aucun pouvoir";
            case LOYALTY_INVESTIGATION : "Enquête";
            case SPECIAL_ELECTION : "Élection spéciale";
            case POLICY_PEEK : "Espionnage";
            case EXECUTION : "Exécution";
            case FASCIST_VICTORY : "Victoire fasciste";
            case LIBERAL_VICTORY : "Victoire libérale";
        }
    }

    override function render() {
        var game:Game = props.game;
        var policies:Array<ReactElement> = [];
        if(game==null || !game.fsm.isRunning)
            return jsx(<div id='liberal-board'><br/></div>);

        for(i in 1...Game.LIBERAL_BOARDS[game.liberalBoard].length) {
            policies.push(jsx(
                <span key={'liberalpolicy$i'} className={i<=game.liberalPoliciesPassed? 'passed': ''}>
                    {'${formatPower(Game.LIBERAL_BOARDS[game.liberalBoard][i])}'}
                </span>
            ));
        }
            
        return jsx(
            <div id='liberal-board' className='board'>
                {policies}
            </div>
        );
    }
}

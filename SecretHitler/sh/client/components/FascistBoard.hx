package sh.client.components;

import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

@:expose
class FascistBoard extends ReactComponent {
    public function new(props) {
        super(props);
    }

    function format(power:Power):String {
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
            return jsx(<div id='fascist-board'><br/></div>);
        for(i in 1...Game.FASCIST_BOARDS[game.fascistBoard].length)
            policies.push(jsx(
                <span key={'fascistpolicy$i'} style={{margin: '.5em', fontWeight: i<=game.fascistPoliciesPassed? 'bold': ''}}>
                    {'${format(Game.FASCIST_BOARDS[game.fascistBoard][i])} '}
                </span>
            ));
        
        return jsx(
            <div id='fascist-board'>
                {policies}
            </div>
        );
    }
}

package sh.client.components;

import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

@:expose
class TopBoard extends ReactComponent {
    public function new(props) {
        super(props);
    }

    override function render() {
        var game:Game = props.game;
        return game==null?
            jsx(
                <div id='top'><br/></div>
            ):
            jsx(
                <div id='top'>
                    <span>{'Chaos : ${game.electionTracker}/3'}</span>
                    <span>{' | '}</span>
                    <span>{'Pioche : ${game.drawPile.length}/17'}</span>
                    <span>{' | '}</span>
                    <span>{'Défausse : ${game.discardPile.length}/17'}</span>
                </div>
            );
    }
}

package sh.client.components;

import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

using util.ArrayExt;

@:expose
class BottomBoard extends ReactComponent {
    public function new(props) {
        super(props);
    }

    override function render() {
        var game:Game = props.game;
        return game==null?
            jsx(
                <div id='bottom'><br/></div>
            ):
            jsx(
                <div id='bottom'>
                    <span>{'Election tracker : ${game.electionTracker}/3'}</span>
                    <span>{' | '}</span>
                    <span>{'Draw pile : ${game.drawPile.length}/17'}</span>
                    <span>{' | '}</span>
                    <span>{'Discard pile : ${game.discardPile.length}/17'}</span>
                </div>
            );
    }
}

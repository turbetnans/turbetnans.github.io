package sh.client.components;

import sh.client.components.Player;
import sh.core.Game.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

@:expose
class PlayerList extends ReactComponent {
    public function new(props) {
        super(props);
    }

    override function render() {
        var game:Game = props.game;
        var players:Array<ReactElement> = [];

        for(id in 0...game.players.length) {
            if(id==Math.round(game.players.length/2) && game.players.length>5)
                players.push(jsx(<br key={id}/>));
            players.push(jsx(
                <Player key={'player$id'} game={game} id={id} clickHandeler={props.clickHandeler} local={props.local} localId={props.id}/>
            ));
        }

        return jsx(
            <div className='playerList'>
                {players}
            </div>
        );
    }
}

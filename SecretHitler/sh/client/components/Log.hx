package sh.client.components;

import js.Browser;
import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

using util.ArrayExt;

@:expose
class Log extends ReactComponent {
    public function new(props) {
        super(props);
    }

    var size:Int = 0;

    private function formatPolicy(policy:Policy) {
        return switch(policy){
            case FASCIST_POLICY: "Fasciste";
            case LIBERAL_POLICY: "Liberal";
        };
    }

    override function componentDidUpdate(prevProps:Dynamic, prevState:Dynamic) {
        Browser.document.getElementById('log').scrollTop = Browser.document.getElementById('log').scrollHeight;
    }

    override function render() {
        var game:Game = props.game;
        var logs:Array<ReactElement> = [];
        var history:Array<Message>=props.history;

        for(i in 0...history.length) {
            var className = (history[i].match(STATE(_))? "state": "event") +" "+ (i>size? "new": "");
            switch(history[i]){
                case STATE(CHANCELOR_NOMINATION):
                    logs.push(jsx(<hr key='l$i'/>));

                case STATE(POLICY_REVEAL):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le décret adopté est : '+formatPolicy(game.playedPolicies.last())+'.'}</p>));

                case STATE(state):
                    
                case EVENT(START, _, _):
                    logs.push(jsx(<p key='l$i' className={className}>{'La partie commence !'}</p>));

                case EVENT(NEXT, _, _):

                case EVENT(NOMINATE, president, chancelor):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le president ${game.players[president].name} a nommé ${game.players[chancelor].name} comme chancelier.'}</p>));

                case EVENT(JA, player, _) | EVENT(NEIN, player, _):
                    logs.push(jsx(<p key='l$i' className={className}>{'${game.players[player].name} a voté.'}</p>));
                
                case EVENT(REVEAL, _, _):
                    logs.push(jsx(<p key='l$i' className={className}>{'Les votes sont révélés.'}</p>));
                
                case EVENT(CHAOS, _, _):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le pays sombre dans le chaos et adopte le décret : '+formatPolicy(game.playedPolicies.last())+'.'}</p>));

                case EVENT(DISCARD, president, policy):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le president ${game.players[president].name} a défaussé un décret.'}</p>));

                case EVENT(SELECT, chancelor, policy):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le chancelier ${game.players[chancelor].name} a choissi un décret.'}</p>));
                    
                case EVENT(VETO, chancelor, _):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le chancelier ${game.players[chancelor].name} a proposé un véto.'}</p>));

                case EVENT(ACCEPT, president, _):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le président ${game.players[president].name} a accepté le véto.'}</p>));

                case EVENT(DECLINE, president, _):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le président ${game.players[president].name} a refusé le véto.'}</p>));

                case EVENT(INVESTIGATE, president, target):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le président ${game.players[president].name} a enquété ${game.players[target].name}.'}</p>));

                case EVENT(CHOOSE, president, target):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le président ${game.players[president].name} a choisi ${game.players[target].name} comme successeur.'}</p>));

                case EVENT(PEEK, president, _):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le président ${game.players[president].name} a espionné les trois prochains décrets.'}</p>));

                case EVENT(EXECUTE, president, target):
                    logs.push(jsx(<p key='l$i' className={className}>{'Le président ${game.players[president].name} a exécuté ${game.players[target].name}.'}</p>));
                
                case INIT(_, _, _):
                    logs.push(jsx(<p key='l$i' className={className}>{'La partie est initialisée.'}</p>));
                    
                case DECK(_):
                    logs.push(jsx(<p key='l$i' className={className}>{'La pioche est re-mélangée.'}</p>));
                
            }
        }

        size = history.length-1;

        return jsx(
            <div id='log'>
                {logs}
            </div>
        );
    }
}

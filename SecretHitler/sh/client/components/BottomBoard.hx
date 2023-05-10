package sh.client.components;

import sh.core.Game;
import react.ReactMacro.jsx;
import react.ReactComponent;

@:expose
class BottomBoard extends ReactComponent {
    public function new(props) {
        super(props);
    }

    override function render() {
        var game:Game = props.game;
        var content:ReactElement = switch(game.getState()) {
            case GAME_START:
                jsx(<span key='state' className={'state'}>{'La partie commence !'}</span>);
                
            case FASCISTS_REVEAL:
                jsx(<span key='state' className={'state'}>{'Les fascistes se découvrent.'}</span>);

            case CHANCELOR_NOMINATION:
                jsx(<span key='state' className={'state'}>{'Le président va nommer son chancelier.'}</span>);

            case GOVERNMENT_VOTE:
                jsx(<span key='state' className={'state'}>{'Les joueurs votent pour le gouvernement proposé.'}</span>);

            case VOTE_COUNTING:
                jsx(<span key='state' className={'state'}>{'Les votes sont comptés.'}</span>);

            case PRESIDENT_SESSION:
                jsx(<span key='state' className={'state'}>{'Le président choisi un décret à défausser.'}</span>);

            case CHANCELOR_SESSION:
                jsx(<span key='state' className={'state'}>{'Le chancelier choisi le décret à adpter.'}</span>);

            case VETO_PROPOSITION:
                jsx(<span key='state' className={'state'}>{'Lechancelier demande le véto.'}</span>);

            case POLICY_REVEAL:
                jsx(<span key='state' className={'state'}>{'Le décret choisi est révélé.'}</span>);

            case LOYALTY_INVESTIGATION:
                jsx(<span key='state' className={'state'}>{'Le président va enquêter sur un joueur.'}</span>);

            case LOYALTY_INVESTIGATION_RESULT:
                jsx(<span key='state' className={'state'}>{'Le président reçoit le résultat de l\'enquête.'}</span>);

            case SPECIAL_ELECTION:
                jsx(<span key='state' className={'state'}>{'Le président va choisir son successeur.'}</span>);

            case SPECIAL_ELECTION_RESULT:
                jsx(<span key='state' className={'state'}>{'Le président a choisi son successeur.'}</span>);

            case POLICY_PEEK:
                jsx(<span key='state' className={'state'}>{'Le présdent va espionner les trois prochains décrets.'}</span>);

            case POLICY_PEEK_RESULT:
                jsx(<span key='state' className={'state'}>{'Le présdent a espionné les trois prochains décrets.'}</span>);

            case EXECUTION:
                jsx(<span key='state' className={'state'}>{'Le président va choisir le joueur a éxécuter.'}</span>);

            case EXECUTION_RESULT:
                jsx(<span key='state' className={'state'}>{'Le président a choisi le joueur a éxécuter.'}</span>);

            case FASCIST_VICTORY:
                jsx(<span key='state' className={'state'}>{'Victoire des fascistes !'}</span>);

            case LIBERAL_VICTORY:
                jsx(<span key='state' className={'state'}>{'Victoire des libéraux !'}</span>);
        }
        return jsx(
            <div id='bottom'>
                <span>{content}</span>
            </div>
        );
    }
}

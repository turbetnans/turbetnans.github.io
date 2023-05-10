package sh.core;

import fsm.FSM;

using util.ArrayExt;

@:expose
class Game {
    // STATIC PARAMS
    static public var NB_FASCIST_POLICIES:Int = 11;
    static public var NB_LIBERAL_POLICIES:Int = 6;

    static public var NB_LIBERALS:Array<Int> = [null,null,null,null,null,1,1,2,2,3,3];
    static public var NB_FASCISTS:Array<Int> = [null,null,null,null,null,3,4,4,5,5,6];
    
    static public var FASCIST_BOARD:Array<Int> = [null,null,null,null,null,1,1,2,2,3,3];
    static public var LIBERAL_BOARD:Array<Int> = [null,null,null,null,null,1,1,1,1,1,1];
    static public var FASCIST_BOARDS:Array<Array<Power>> = [
        null,
        [null, NO_POWER, NO_POWER, POLICY_PEEK, EXECUTION, EXECUTION, FASCIST_VICTORY],
        [null, NO_POWER, LOYALTY_INVESTIGATION, SPECIAL_ELECTION, EXECUTION, EXECUTION, FASCIST_VICTORY],
        [null, LOYALTY_INVESTIGATION, LOYALTY_INVESTIGATION, SPECIAL_ELECTION, EXECUTION, EXECUTION, FASCIST_VICTORY]
    ];
    static public var LIBERAL_BOARDS:Array<Array<Power>> =[
        null,
        [null, NO_POWER, NO_POWER, NO_POWER, NO_POWER, LIBERAL_VICTORY]
    ];

    // Boards
    public var fascistBoard:Int = 0;
    public var liberalBoard:Int = 0;
    
    // Election
    public var electionTracker:Int = 0;
    public var votes:Map<PlayerId, Event> = [];
    public var voteResult:Event = null;

    // Players and roles
    public var players:Array<Player> = [];
    public var president:PlayerId = PlayerId.NONE;
    public var chancelor:PlayerId = PlayerId.NONE;
    public var lastPresident:PlayerId = PlayerId.NONE;
    public var lastChancelor:PlayerId = PlayerId.NONE;
    public var presidentForced:Bool = false;
    public var previousPresident:PlayerId = PlayerId.NONE;
    public var roles:Array<Role> = [];
    public var nbFascists:Int = 0;
    public var nbLiberals:Int = 0;

    // Policies
    public var drawPile:Array<Policy> = [];
    public var discardPile:Array<Policy> = [];
    public var playedPolicies:Array<Policy> = [];
    public var proposedPolicies:Array<Policy> = [];
    public var fascistPoliciesPassed:Int = 0;
    public var liberalPoliciesPassed:Int = 0;
    public var vetoUsed:Bool = false;

    // Powers
    public var nextPower:Power = null;
    public var investigatedPlayer:PlayerId = PlayerId.NONE;

    // Messages
    public var messages:Array<Message> = [];

    // FSM
    public var fsm:FSM = null;

    // Constructor
    function new() {
        fsm = new FSM();
    }
    
    // Create game
	static public function create(nbPlayers:Int, ?names:Array<String>):Game  {
        if(nbPlayers<5||nbPlayers>10)
            return null;

        var game:Game = new Game();
        game.init(nbPlayers, names);
        return game;
    }

    // Init game
    function init(nbPlayers:Int, ?names:Array<String>) {
        // INIT PLAYERS
        for(i in 0...nbPlayers)
            players.push(new Player(i, names[i]));

        // SETUP
        var gameStart:StateId = fsm.addState(State.GAME_START, ()->onGameStart());
        var fascistsReveal:StateId = fsm.addState(State.FASCISTS_REVEAL);
        // ELECTION
        var chancelorNomination:StateId = fsm.addState(State.CHANCELOR_NOMINATION, ()->chancelor=null);
        var governmentVote:StateId = fsm.addState(State.GOVERNMENT_VOTE, ()->votes.clear());
        var voteCounting:StateId = fsm.addState(State.VOTE_COUNTING, ()->onVoteCounting());
        // LEGISLATIVE SESSION
        var presidentSession:StateId = fsm.addState(State.PRESIDENT_SESSION, ()->onPresidentSession());
        var chancelorSession:StateId = fsm.addState(State.CHANCELOR_SESSION);
        var vetoProposition:StateId = fsm.addState(State.VETO_PROPOSITION);
        var policyReveal:StateId = fsm.addState(State.POLICY_REVEAL, ()->onPolicyReveal());
        // EXECUTIVE ACTION
        var loyaltyInvestigation:StateId = fsm.addState(State.LOYALTY_INVESTIGATION);
        var loyaltyInvestigationResult:StateId = fsm.addState(State.LOYALTY_INVESTIGATION_RESULT);
        var specialElection:StateId = fsm.addState(State.SPECIAL_ELECTION);
        var specialElectionResult:StateId = fsm.addState(State.SPECIAL_ELECTION_RESULT);
        var policyPeek:StateId = fsm.addState(State.POLICY_PEEK);
        var policyPeekResult:StateId = fsm.addState(State.POLICY_PEEK_RESULT);
        var execution:StateId = fsm.addState(State.EXECUTION);
        var executionResult:StateId = fsm.addState(State.EXECUTION_RESULT);
        // END
        var fascistVictory:StateId = fsm.addState(State.FASCIST_VICTORY);
        var liberalVictory:StateId = fsm.addState(State.LIBERAL_VICTORY);

        fsm.setInitial(gameStart);
        fsm.setFinal(fascistVictory);
        fsm.setFinal(liberalVictory);

        // SETUP
        fsm.addTransition(gameStart, fascistsReveal, START);
        fsm.addTransition(fascistsReveal, chancelorNomination, NEXT);

        // ELECTION
        fsm.addTransition(chancelorNomination, governmentVote, NOMINATE, false,
            args->args[0]==president && checkEligibility(args[1]) && players[(args[1]:Int)].status==ALIVE,
            args->onNominate(args[1])
        );

        fsm.addTransition(governmentVote, governmentVote, JA, true,
            args->votes.get(args[0])==null && players[(args[0]:Int)].status==ALIVE,
            args->onVote(args[0], JA)
        );
        fsm.addTransition(governmentVote, governmentVote, NEIN, true,
            args->votes.get(args[0])==null && players[(args[0]:Int)].status==ALIVE,
            args->onVote(args[0], NEIN)
        );

        fsm.addTransition(governmentVote, voteCounting, REVEAL, false,
            args->Lambda.count(votes)==players.filter(p->p.status==ALIVE).length,
            _->onVoteEnded()
        );

        fsm.addTransition(voteCounting, fascistVictory, CHAOS, false,
            _->voteResult==NEIN && electionTracker==2 && fascistPoliciesPassed==5 && drawPile.last()==FASCIST_POLICY,
            _->onChaos()
        );
        fsm.addTransition(voteCounting, liberalVictory, CHAOS, false,
            _->voteResult==NEIN && electionTracker==2 && liberalPoliciesPassed==4 && drawPile.last()==LIBERAL_POLICY,
            _->onChaos()
        );
        fsm.addTransition(voteCounting, chancelorNomination, CHAOS, false,
            _->voteResult==NEIN && electionTracker==2,
            _->onChaos()
        );
        fsm.addTransition(voteCounting, chancelorNomination, NEXT, false,
            _->voteResult==NEIN && electionTracker<2,
            _->onFailedVote()
        );
        fsm.addTransition(voteCounting, fascistVictory, NEXT, false,
            _->voteResult==JA && players[chancelor].role==HITLER && fascistPoliciesPassed>=3,
            _->onHitlerElected()
        );
        fsm.addTransition(voteCounting, presidentSession, NEXT, false,
            _->voteResult==JA && (players[chancelor].role!=HITLER || fascistPoliciesPassed<3),
            _->onSuccessfulVote()
        );

        // LEGISLATIVE SESSION
        fsm.addTransition(presidentSession, chancelorSession, DISCARD, false,
            args->args[0]==president && args[1]!=null && (args[1]:Int)>=0 && (args[1]:Int)<3,
            args->onPolicyDiscarded(args[1])
        );
        fsm.addTransition(chancelorSession, policyReveal, SELECT, false,
            args->args[0]==chancelor && args[1]!=null && (args[1]:Int)>=0 && (args[1]:Int)<2,
            args->onPolicySelected(args[1])
        );
        fsm.addTransition(chancelorSession, vetoProposition, VETO, false,
            args->args[0]==chancelor && fascistPoliciesPassed==5 && !vetoUsed,
            _->onVetoProposed()
        );
        fsm.addTransition(vetoProposition, fascistVictory, CHAOS, false,
            args->args[0]==president && electionTracker==2 && fascistPoliciesPassed==5 && drawPile.last()==FASCIST_POLICY,
            _->onChaos()
        );
        fsm.addTransition(vetoProposition, liberalVictory, CHAOS, false,
            args->args[0]==president && electionTracker==2 && liberalPoliciesPassed==4 && drawPile.last()==LIBERAL_POLICY,
            _->onChaos()
        );
        fsm.addTransition(vetoProposition, chancelorNomination, CHAOS, false,
            args->args[0]==president && electionTracker==2,
            _->onChaos()
        );
        fsm.addTransition(vetoProposition, chancelorNomination, ACCEPT, false,
            args->args[0]==president && electionTracker<2,
            _->onVetoRejected()
        );
        fsm.addTransition(vetoProposition, chancelorSession, DECLINE, false,
            args->args[0]==president,
            _->onVetoAccepted()
        );

        // EXECUTIVE ACTION
        fsm.addTransition(policyReveal, chancelorNomination, NEXT, false,
            _->nextPower==NO_POWER,
            _->nextPresident()
        );

        fsm.addTransition(policyReveal, loyaltyInvestigation, NEXT, false,
            _->nextPower==LOYALTY_INVESTIGATION,
            _->onPolicyRevealed()
        );
        fsm.addTransition(loyaltyInvestigation, loyaltyInvestigationResult, INVESTIGATE, false,
            args->args[0]==president && args[1]!=null && args[1]!=president && players[(args[1]:Int)].status==ALIVE,
            args->onInvestigate(args[1])
        );
        fsm.addTransition(loyaltyInvestigationResult, chancelorNomination, NEXT, false,
            _->true,
            args->nextPresident()
        );

        fsm.addTransition(policyReveal, specialElection, NEXT, false,
            _->nextPower==SPECIAL_ELECTION,
            _->onPolicyRevealed()
        );
        fsm.addTransition(specialElection, specialElectionResult, CHOOSE, false,
            args->args[0]==president && args[1]!=null && args[1]!=president && players[(args[1]:Int)].status==ALIVE,
            args->onChoose(args[1])
        );
        fsm.addTransition(specialElectionResult, chancelorNomination, NEXT, false,
            _->true,
            _->null
        );

        fsm.addTransition(policyReveal, policyPeek, NEXT, false,
            _->nextPower==POLICY_PEEK,
            _->onPolicyRevealed()
        );
        fsm.addTransition(policyPeek, policyPeekResult, PEEK, false,
            args->args[0]==president,
            args->onPeek()
        );
        fsm.addTransition(policyPeekResult, chancelorNomination, NEXT, false,
            _->true,
            args->nextPresident()
        );

        fsm.addTransition(policyReveal, execution, NEXT, false,
            _->nextPower==EXECUTION,
            _->onPolicyRevealed()
        );
        fsm.addTransition(execution, executionResult, EXECUTE, false,
            args->args[0]==president && args[1]!=null && args[1]!=president && players[(args[1]:Int)].status==ALIVE,
            args->onExecute(args[1])
        );
        fsm.addTransition(executionResult, chancelorNomination, NEXT, false,
            _->players.filter(p->p.role==HITLER && p.status==DEAD).length==0,
            args->nextPresident()
        );
        fsm.addTransition(executionResult, liberalVictory, NEXT, false,
            _->players.filter(p->p.role==HITLER && p.status==DEAD).length>0,
            _->onHitlerKilled()
        );

        fsm.addTransition(policyReveal, fascistVictory, NEXT, false,
            _->nextPower==FASCIST_VICTORY,
            _->onAllFascistPoliciesPassed()
        );
        fsm.addTransition(policyReveal, liberalVictory, NEXT, false,
            _->nextPower==LIBERAL_VICTORY,
            _->onAllLiberalPoliciesPassed()
        );
    }

    // Update game
    public function update(event:String, ...args:Any) {
        if(fsm.update(event, ...args)) {
            messages.push(Message.EVENT(event, args[0], args[1]));
            messages.push(Message.STATE(fsm.states[fsm.currentState].name));
        }
    }

    // ON STATE ENTRY
    function onGameStart() {
        // select number of each roles
        nbFascists = NB_LIBERALS[players.length];
        nbLiberals = NB_FASCISTS[players.length];

        // set passed policies
        fascistPoliciesPassed = 0;
        liberalPoliciesPassed = 0;

        // set tracker
        electionTracker = 0;

        // select board
        fascistBoard = FASCIST_BOARD[players.length];
        liberalBoard = LIBERAL_BOARD[players.length];

        // shuffle policies
        drawPile = [];
        for(i in 0...NB_FASCIST_POLICIES)
            drawPile.push(FASCIST_POLICY);
        for(i in 0...NB_LIBERAL_POLICIES)
            drawPile.push(LIBERAL_POLICY);
        drawPile.shuffle();
        
        // shuffle roles
        roles = [];
        for(i in 0...nbFascists)
            roles.push(FASCIST);
        for(i in 0...nbLiberals)
            roles.push(LIBERAL);
        roles.push(HITLER);
        roles.shuffle();
        for(i in 0...roles.length)
            players[i].role = roles[i];

        // shuffle first president
        president = Std.random(players.length);

        // message
        messages.push(INIT(drawPile, president, roles));
    }
    function onVoteCounting() {
        var jaVotes:Int = 0;
        for(vote in votes)
            if(vote==JA)
                jaVotes++;
        if(jaVotes>players.filter(p->p.status==ALIVE).length/2) {
            voteResult = JA;
        } else {
            voteResult = NEIN;
        }
    }
    function onPresidentSession() {
        for(i in 0...3)
            proposedPolicies.push(drawPile.pop());
        vetoUsed = false;
    }
    function onPolicyReveal() {
        // increment policy counter
        if(proposedPolicies[0]==FASCIST_POLICY) {
            fascistPoliciesPassed++;
            nextPower = FASCIST_BOARDS[fascistBoard][fascistPoliciesPassed];
        } else if(proposedPolicies[0]==LIBERAL_POLICY) {
            liberalPoliciesPassed++;
            nextPower = LIBERAL_BOARDS[liberalBoard][liberalPoliciesPassed];
        }

        // clear proposed policies array
        playedPolicies.push(proposedPolicies.pop());

        // tracker is reset when a policy is passed
        electionTracker = 0;
    }

    // ON STATE EXIT

    // ON TRANSITION
    function onNominate(target:PlayerId) {
        chancelor=target;
    }
    function onVote(player:PlayerId, vote:Event) {
        votes.set(player, vote);
    }
    function onVoteEnded() {
    }
    function onChaos() {
        electionTracker = 3;

        // enact top policy and ignore power");
        if(drawPile.last()==FASCIST_POLICY)
            fascistPoliciesPassed++;
        else if(drawPile.last()==LIBERAL_POLICY)
            liberalPoliciesPassed++;
        playedPolicies.push(drawPile.pop());

        if(liberalPoliciesPassed==5) {

        } else if(fascistPoliciesPassed==6) {

        } else {
            if(drawPile.length<3)
                shufflePolicies();

            // reset tracker");
            electionTracker = 0;

            // forget term limits");
            lastChancelor = PlayerId.NONE;
            lastPresident = PlayerId.NONE;

            // next president");
            nextPresident();
        }
    }
    function onFailedVote() {
        electionTracker++;
        nextPresident();
    }
    function onHitlerElected() {
    }
    function onSuccessfulVote() {
        lastChancelor = chancelor;
        lastPresident = president;
    }
    function onPolicyDiscarded(policy:Int) {
        var discardedPolicy:Policy = proposedPolicies[policy];
        discardPile.push(discardedPolicy);
        proposedPolicies.remove(discardedPolicy);
    }
    function onPolicySelected(policy:Int) {
        var discardedPolicy:Policy = proposedPolicies[(policy+1)%2];
        discardPile.push(discardedPolicy);
        proposedPolicies.remove(discardedPolicy);
        if(drawPile.length<3)
            shufflePolicies();
    }
    function onVetoProposed() {
        vetoUsed = true;
    }
    function onVetoRejected() {
    }
    function onVetoAccepted() {
        electionTracker++;
        nextPresident();
    }
    function onPolicyRevealed() {
    }
    function onInvestigate(target:PlayerId) {
        investigatedPlayer = target;
    }
    function onChoose(target:PlayerId) {
        previousPresident = president;
        president = target;
        presidentForced = true;
    }
    function onPeek() {
        trace("president looks at the top 3 policies");
    }
    function onExecute(target:PlayerId) {
        players[target].status = DEAD;
    }
    function onHitlerKilled() {
    }
    function onAllFascistPoliciesPassed() {
    }
    function onAllLiberalPoliciesPassed() {
    }
    // HELPERS
    function shufflePolicies() {
        drawPile = drawPile.concat(discardPile);
        drawPile.shuffle();
        discardPile = [];

        // message
        messages.push(DECK(drawPile));
    }
    function checkEligibility(id:Int):Bool {
        // can't vote for one of the last chancelors since reset, previous president or current president
        if(players.filter(p->p.status==ALIVE).length>5)
            return id!=lastChancelor && id!=lastPresident && id!=president && id!=null && id>=0 && id<players.length && players[id].status==ALIVE;
        // if only 5 players remain, only the last chancelor is inelidgible 
        return id!=lastChancelor && id!=president && id!=null && id>=0 && id<players.length && players[id].status==ALIVE;
    }
    function nextPresident() {
        if(presidentForced) {
            presidentForced = false;
            president = previousPresident;
        }
        do {
            president = (president+1)%players.length;
        } while(players[president].status==DEAD);
    }

    public function getState():State {
        return fsm.states[fsm.currentState].name;
    }
    public function isInState(state:State) {
        return fsm.states[fsm.currentState].name==state;
    }
}

// GAME STATES
enum abstract State(String) from String to String {
    var GAME_START;
    var FASCISTS_REVEAL;
    var CHANCELOR_NOMINATION;
    var GOVERNMENT_VOTE;
    var VOTE_COUNTING;

    var PRESIDENT_SESSION;
    var CHANCELOR_SESSION;
    var VETO_PROPOSITION;
    var POLICY_REVEAL;

    var LOYALTY_INVESTIGATION;
    var LOYALTY_INVESTIGATION_RESULT;
    var SPECIAL_ELECTION;
    var SPECIAL_ELECTION_RESULT;
    var POLICY_PEEK;
    var POLICY_PEEK_RESULT;
    var EXECUTION;
    var EXECUTION_RESULT;

    var FASCIST_VICTORY;
    var LIBERAL_VICTORY;
}
// GAME EVENTS
enum abstract Event(String) from String to String {
    var START;
    var NEXT;
    var NOMINATE;
    var JA;
    var NEIN;
    var REVEAL;
    var CHAOS;
    var SELECT;
    var DISCARD;
    var VETO;
    var ACCEPT;
    var DECLINE;
    var INVESTIGATE;
    var CHOOSE;
    var PEEK;
    var EXECUTE;
}

// GAME MESSAGES
enum Message {
    STATE(state:State);
    EVENT(event:Event, source:Int, target:Int);
    INIT(cards:Array<Policy>, firstPresident:PlayerId, roles:Array<Role>);
    DECK(cards:Array<Policy>);
    ERROR(error:Error);
}

// PLAYER
class Player {
    public function new(id:Int, ?name:String=null) {
        this.id = id;
        this.name = name!=null? name: NAMES[Std.random(NAMES.length)];
        this.role = NONE;
        this.status = ALIVE;
    }
    public var id:Int;
    public var name:String;
    public var role:Role;
    public var status:Status;

    static public var NAMES:Array<String> = [
        "Red","Leaf",   
        "Luth","Célesta",
        "Brice","Flora",
        "Louka","Aurore",
        "Ludwig","Ludvina",
        "Mélis","Echo",
        "Kalem","Serena",
        "Elio","Selene",
        "Victor","Gloria",
        "Aurel","Lucia",
        "Florian","Juliana",
        "Nathan","Sandrine",
        "Lunick","Solana",
        "Primo","Clara",
        "Sully","Ethelle",
        "Jamie","River",
        "Marc","Mint",
        "Lucas", "Anna",
        "Scottie","Bettie"
    ];
}
abstract PlayerId(Int) from Int to Int {
    static public var NONE:PlayerId = -1;
}

// PLAYER ROLES
enum abstract Role(String) from String to String {
    var NONE;
    var LIBERAL;
    var FASCIST;
    var HITLER;
}
// PLAYER STATUS
enum abstract Status(String) from String to String {
    var ALIVE;
    var DEAD;
}

// BOARD POWERS
enum abstract Power(String) from String to String {
    var NO_POWER;
    var LOYALTY_INVESTIGATION;
    var SPECIAL_ELECTION;
    var POLICY_PEEK;
    var EXECUTION;
    var FASCIST_VICTORY;
    var LIBERAL_VICTORY;
}

// POLICIES
enum abstract Policy(String) from String to String {
    var LIBERAL_POLICY;
    var FASCIST_POLICY;
}

// ERRORS
enum abstract Error(String) from String to String {
}

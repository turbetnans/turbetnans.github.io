package fsm;

class FSM {
    public static final NULL_STATE_ID:StateId = State.NULL_ID;
    public static final NULLTRANSITION_ID:TransitionId = Transition.NULL_ID;

    public var states(default,null):Array<State> = [];
    public var transitions(default,null):Array<Transition> = [];

    public var currentState(default,null):StateId = State.NULL_ID;

    public var initial(default,null):StateId = State.NULL_ID;
    dynamic function initialAction():Void {};

    public var isRunning(get,null):Bool;
    inline function get_isRunning():Bool { return currentState!=State.NULL_ID; }
    public var isFinished(get,null):Bool;
    inline function get_isFinished():Bool { return currentState!=State.NULL_ID&&states[currentState].isFinal; }

    public function new() {
        states = new Array<State>();
        transitions = new Array<Transition>();
    }

    public function setInitial(initialState:StateId,?action:Void->Void):StateId {
        if(isRunning) {
            trace("[ERR]\t"+"setInitial\t"+"can't modify while running.");
            return State.NULL_ID;
        }

        if(states[initialState]==null) {
            trace("[ERR]\t"+"setInitial\t"+"invalid state."+"\n\t"+initialState);
            return State.NULL_ID;
        }
        initialAction = action!=null? action: ()->{};
        return initial=initialState;
    }

    public function addState(name:String,?onEntry:()->Void,?onExit:()->Void):StateId {
        if(isRunning) {
            trace("[ERR]\t"+"addstate\t"+"can't modify while running.");
            return State.NULL_ID;
        }

        if( name==null || name=="" ) {
            trace("[ERR]\t"+"addstate\t"+"empty name."+"\n\t"+name);
            return State.NULL_ID;
        }

        for(s in states)
            if(name==s.name) {
                trace("[ERR]\t"+"addstate\t"+"name already exists."+"\n\t"+name);
                return State.NULL_ID;
            }

        var s:State = new State(name,this);
        s.onEntry = onEntry!=null? onEntry: ()->{};
        s.onExit = onExit!=null? onExit: ()->{};
        s.id = states.push(s)-1;

        return s.id;
    }

    public function addTransition(from:StateId,to:StateId,event:String,?isInternal:Bool=false,?guard:(...Any)->Bool,?action:(...Any)->Void):TransitionId {
        if(isRunning) {
            trace("[ERR]\t"+"addTransition\t"+"can't modify while running.");
            return Transition.NULL_ID;
        }

        if(event==null) {
            trace("[ERR]\t"+"addTransition\t"+"empty event."+"\n\t"+event);
            return Transition.NULL_ID;
        }

        if( states[from]==null || states[to]==null ) {
            trace("[ERR]\t"+"addTransition\t"+"invalid state."+"\n\t"+from+" "+to);
            return Transition.NULL_ID;
        }

        if(states[from].isFinal) {
            trace("[ERR]\t"+"addTransition\t"+"transition from a final state."+"\n\t"+from);
            return Transition.NULL_ID;
        }

        if( isInternal && from!=to ) {
            trace("[ERR]\t"+"addTransition\t"+"invalid internal transition."+"\n\t"+from+" "+to);
            return Transition.NULL_ID;
        }

        var t:Transition = new Transition(from,to,event);
        t.guard = guard!=null? guard: (_)->true;
        t.action = action!=null? action: (_)->{};
        t.isInternal = isInternal;
        t.id = transitions.push(t)-1;
        states[from].transitions.push(t.id);

        return t.id;
    }

    public function setFinal(state:StateId):StateId {
        if(isRunning) {
            trace("[ERR]\t"+"setFinal\t"+"can't modify while running.");
            return State.NULL_ID;
        }

        if(states[state]==null) {
            trace("[ERR]\t"+"setFinal\t"+"invalid state."+"\n\t"+state);
            return State.NULL_ID;
        }

        for(t in transitions) {
            if(t.from==state) {
                trace("[ERR]\t"+"addTransition\t"+"transition is leaving the state."+"\n\t"+t+" "+state);
                return State.NULL_ID;
            }
        }

        states[state].isFinal = true;
        return state;
    }

    public function start():Bool {
        if( initial==State.NULL_ID || states.length==0 || transitions.length==0 ) {
            trace("[ERR]\t"+"start\t"+"not fully initialized."+"\n\t"+initial+" "+states.length+" "+transitions.length);
            return false;
        }

        if(isRunning) if(!stop()) return false;
        // start
        currentState = initial;
        initialAction();
        states[currentState].onEntry();
        return true;
    }

    public function stop(?forceStop:Bool=false):Bool {
        if(!isRunning) {
            trace("[ERR]\t"+"stop\t"+"not started.");
            return false;
        }
        if( !isFinished && !forceStop ) {
            trace("[ERR]\t"+"stop\t"+"not finished, use stop(true) to force stopping.");
            return false;
        }
        // stop
        currentState = State.NULL_ID;
        return true;
    }

    public function update(event:String, ...args:Any):Bool {
        if(!isRunning) {
            trace("[ERR]\t"+"update\t"+"not started.");
            return false;
        }

        if(states[currentState]==null) {
            trace("[ERR]\t"+"update\t"+"invalid current state."+"\n\t"+currentState+" "+states[currentState]);
            return false;
        }

        for(t in states[currentState].transitions) {
            var transition:Transition = transitions[t];
            if( transition!=null && transition.event==event ) {
                if(transition.guard(...args)) {
                    //trace("[INFO]\t"+"update\t"+"guard true for event \""+event+"\" on transition \""+transition+"\".");
                    //if(!transition.isInternal) trace("[INFO]\t"+"update\t"+"going to \""+states[transition.to]+"\".");
                    if(!transition.isInternal)
                        states[currentState].onExit();
                    transition.action(...args);
                    currentState = transition.to;
                    if(!transition.isInternal)
                        states[currentState].onEntry();
                    return true;
                }
                //else trace("[INFO]\t"+"update\t"+"guard false for event \""+event+"\" on transition \""+transition+"\".");
            }
        }
        //trace("[INFO]\t"+"update\t"+"no valid transition for event \""+event+"\" in state \""+states[currentState].name+"\".");
        return true;
    }
}

typedef StateId = Int;
typedef TransitionId = Int;

private class State {
    public var fsm:FSM = null;
    public var id:StateId = NULL_ID;
    public var name:String = "state";
    public var transitions(default,null):Array<TransitionId> = [];
    public var isFinal:Bool = false;

    dynamic public function onEntry():Void {};
    dynamic public function onExit():Void {};

    public function new(name:String,fsm:FSM) {
        this.name = name;
        this.fsm = fsm;
    };
    public function toString():String { return (isFinal? "Final-ST-":"ST-")+id+"|"+name; }

    public static final NULL_ID:StateId = -1;
}   

private class Transition {
    public var fsm:FSM = null;
    public var id:TransitionId = NULL_ID;
    public var from:StateId = NULL_ID;
    public var to:StateId = NULL_ID;
    public var event:String = null;
    public var isInternal:Bool = false;

    dynamic public function guard(...Any):Bool { return true; };
    dynamic public function action(...Any):Void {};

    public function new(from:StateId,to:StateId,event:String) {
        this.from = from;
        this.to = to;
        this.event =  event;
    };
    public function toString():String { return (isInternal? "Internal-TR-":"TR-")+id+"|"+event+":"+from+"->"+to; }

    public static final NULL_ID:TransitionId = -1;
}

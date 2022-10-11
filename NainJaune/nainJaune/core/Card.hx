package nainJaune.core;

import haxe.ds.ReadOnlyArray;

class Card {
    public static final ANY:Int = -1;
    
    public static final SUITS:ReadOnlyArray<String> = ["Coeur","Carreau","Trefle","Pique"];
    public static final SYMBOLS:ReadOnlyArray<String> = ["♥","♦","♣","♠","A"];
    public static final RANKS:ReadOnlyArray<String> = ([for(i in 1...11) '$i']:ReadOnlyArray<String>).concat(["Valet","Dame","Roi"]);

	public var rank(default,null):Int;
	public var suit(default,null):Int;

	public function new(rank:String,suit:String) {
        this.suit = SUITS.indexOf(suit);
        this.rank = RANKS.indexOf(rank);
        if( this.rank==-1 || this.suit==-1 )
            trace("carte invalide "+rank+" de "+suit+" ("+this.suit+" "+this.rank+")");
	}

    public static function clone(card:Card) {
        return card==null? null: new Card(Card.RANKS[card.rank],Card.SUITS[card.suit]);
    }

	public function toString():String {
        return RANKS[rank].substr(0,rank<10?2:1)+" "+SYMBOLS[suit];
    }
}

// public static var RANKS32:ReadOnlyArray<String> = ([for(i in 7...11) '$i']:ReadOnlyArray<String>).concat(["Valet","Dame","Roi","As"]);
// public static var SUITS78:ReadOnlyArray<String> = ["Coeur","Carreau","Trefle","Pique","Atout"];
// public static var RANKS78:ReadOnlyArray<String> = ([for(i in 1...11) '$i']:ReadOnlyArray<String>).concat(["Valet","Cavalier","Dame","Roi"]);
// public static var TRUMPRANKS:ReadOnlyArray<String> = ["Excuse"].concat([for(i in 1...22) '$i']);

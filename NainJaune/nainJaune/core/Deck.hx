package nainJaune.core;

import nainJaune.core.Card;
import haxe.ds.ReadOnlyArray;

@:allow(nainJaune.core)
class Deck {
	public var cards(default,null):Array<Card>;

	public static final DECK:ReadOnlyArray<Card> = [for(s in Card.SUITS) for(r in Card.RANKS) new Card(r,s)];

    public function new() {
		cards = Deck.DECK.copy();
    }
    
    public function shuffle() {
        // Fisher–Yates shuffle
        var index:Int = cards.length;
        while(index!=0) {
            var rand:Int = Std.int(Math.random()*index--);
            var temp:Card = cards[index];
            cards[index] = cards[rand];
            cards[rand] = temp;
        }
    }
}

// public static var DECK32:ReadOnlyArray<Card> = [for(s in Card.SUITS) for(r in Card.RANKS32) new Card(r,s,32)];
// public static var DECK78:ReadOnlyArray<Card> = [for(s in Card.SUITS78.slice(0,4)) for(r in Card.RANKS78) new Card(r,s,78)].concat([for(r in Card.TRUMPRANKS) new Card(r,Card.SUITS78[4],78)]);


/*----------------------------------------------------------------------------*/
package hexlib;

/*----------------------------------------------------------------------------*/
// Lib (helpers and consts)
class HexLib {
	// Distance to given Hex
	static public inline function distance(hex1:Hex, hex2:Hex): Int {
	    return (hex1-hex2).length;
	}

	// Linear interpolation
	static public inline function lerp(fhex1:FractionalHex, fhex2:FractionalHex, ?ratio: Float=.5): FractionalHex {
		// 0=fhex1, .5=midpoint, 1=fhex2
		return new FractionalHex( fhex1.u*(1-ratio) + fhex2.u*ratio, fhex1.w*(1-ratio) + fhex2.w*ratio );
	}

	// barycentre / triangular interpolation
		// ToDo : expand for any number of input using one of :
			// hexes:Array<FreactionalHex> & weights:Array<Float> of same sizes
			// inputs:Map<FractionalHex,Float>
	static public inline function barycentre(
		fhex1:FractionalHex, ?w1:Float=1,
		fhex2:FractionalHex, ?w2:Float=1,
		fhex3:FractionalHex, ?w3:Float=1
	): FractionalHex {
		return new FractionalHex((fhex1.u*w1 + fhex2.u*w2 + fhex3.u*w3)/(w1+w2+w3), (fhex1.w*w1 + fhex2.w*w2 + fhex3.w*w3)/(w1+w2+w3));
	}

	// Rounds fhex to the nearest Hex.
		// ToDo : Ties consistency
		// Source : https://www.redblobgames.com/grids/hexagons/#rounding
	static public function round(fhex:FractionalHex): Hex {
		// round each coordinate
		var ru: Int = Math.round(fhex.u);
		var rv: Int = Math.round(fhex.v);
		var rw: Int = Math.round(fhex.w);

		// compute each delta
		var du: Float = Math.abs(fhex.u-ru);
		var dv: Float = Math.abs(fhex.v-rv);
		var dw: Float = Math.abs(fhex.w-rw);

		// reset the largest delta
		if( du>dv && du>=dw ) ru = -rv-rw;
		else if( dv>dw ) rv = -ru-rw;
		else rw = -ru-rv;

		// result with the rounded values
		return new Hex(ru, rw);
	}

	// return an integer in [0,2], such as two adjacent hexs have different hexmods
	static public inline function hexmod(h:Hex): Int {
		return hxd.Math.umod(h.u-h.w,3);
	}

	// return the path between 2 hexagons
	static public function pathFinding<T>(grid:HexGrid<T>, start:Hex, target:Hex, weight:HexCell<T>->Float): Array<Hex> {
		var open: Array<Hex> = [];
		var close: Map<String, Hex> = [];
		var f: Map<String, Float> = [];
		var g: Map<String, Float> = [];

		open.push(start);
		f.set(start.toString(), 0);
		g.set(start.toString(), 0);

		while(open.length>0) {
			open.sort((a: Hex, b: Hex) -> f.get(a.toString())<f.get(b.toString())? 1: -1);
			var current: Hex = open[open.length-1];
			if(current == target) {
				var path: Array<Hex> = [current];
				while(current != start) {
					current = close.get(current.toString());
					path = [current].concat(path);
				}
				return path;
			}
			open.pop();
			for(hex in current.getNeigbours()) {
				if(grid.getCellAt(hex.u, hex.w)!=null){
					var score: Float = g.get(current.toString()) + weight(grid.getCellAt(hex.u, hex.w));
					if(score < (g.get(hex.toString()) ?? Math.POSITIVE_INFINITY)) {
						close.set(hex.toString(), current);
						g.set(hex.toString(), score);
						f.set(hex.toString(), score + distance(start, hex));
						if(!open.contains(hex)) {
							open.push(hex);
						}
					}
				}
			}
		}

		return [];
	}
	

	// Correctness check (precision is used to compensate for float errors)
	static public inline function validityCheck(u:Float,v:Float,w:Float,?strict:Bool=false): Bool {
		if(strict)
			return u+v+w==0;
		else
			return u+v+w<1/PRECISION;
	}
	// Static Helpers / Const values
	static private inline var PRECISION = 1000000;

	// Cardinal directions

	// ORIGIN : ( 0, 0,  0)
	static public var ORIGIN(get, never): Hex;
	static public inline function get_ORIGIN(): Hex { return new Hex(0,0); }
	
	// EAST : ( 1, -1,  0)
	static public var EAST(get, never): Hex;
	static public inline function get_EAST(): Hex { return new Hex(1,0); }

	// NORTH_EAST : ( 1,  0, -1)
	static public var NORTH_EAST(get, never): Hex;
	static public inline function get_NORTH_EAST(): Hex { return new Hex(1,-1); }

	// NORTH_WEST : ( 0,  1, -1)
	static public var NORTH_WEST(get, never): Hex;
	static public inline function get_NORTH_WEST(): Hex { return new Hex(0,-1); }

	// WEST : (-1,  1,  0)
	static public var WEST(get, never): Hex;
	static public inline function get_WEST(): Hex { return new Hex(-1,0); }

	// SOUTH_WEST : (-1,  0,  1)
	static public var SOUTH_WEST(get, never): Hex;
	static public inline function get_SOUTH_WEST(): Hex { return new Hex(-1,1); }

	// SOUTH_EAST : ( 0, -1,  1)
	static public var SOUTH_EAST(get, never): Hex;
	static public inline function get_SOUTH_EAST(): Hex { return new Hex(0,1); }
}

/*----------------------------------------------------------------------------*/
// Cell (grid element)
class HexCell<D> {
	// Constructor
	public function new(u:Int,v:Int,d:D) {
		coord = new Hex(u,v);
		data = d;
	}

	public var coord: Hex = HexLib.ORIGIN;
	public var data: D;

	// toString
	public inline function toString(): String {
		return "[Cell] "+coord+" ; ("+data+")";
	}
}

/*----------------------------------------------------------------------------*/
// Grid
class HexGrid<D> {
	// Constructor
	public function new(r:Int) {
		radius = r;
		content = new Map<Int,HexCell<D>>();
		offset = new Hex(0,0);
	}
	public function setCellAt(u:Int, w:Int, cell:HexCell<D>) {
		content.set((u-offset.u+radius)+(2*radius+1)*(w-offset.w+radius), cell);
	}
	public function getCellAt(u:Int, w:Int): Null<HexCell<D>> {
		if(u-offset.u<-radius||u-offset.u>radius||w-offset.w<-radius||w-offset.w>radius)
			return null;
		return content.get((u-offset.u+radius)+(2*radius+1)*(w-offset.w+radius));
	}

	public var content: Map<Int,HexCell<D>>;
	public var radius: Int;

	public var offset: Hex;
}

/*----------------------------------------------------------------------------*/
// Base Hex object
private class HexBase {
	// Constructor
	public inline function new(u:Float,w:Float) {
		setUW(u, w);
	}
	
	// Content
	public var u: Float;
	public var w: Float;
	public var z: Float = 0;

	public var v(get, never): Float;
	public inline function get_v(): Float { return -u-w; }

	// length of the vector aka distance from origin
	public var length(get, never): Float;
	public inline function get_length(): Float {
		return ( Math.abs(u) + Math.abs(v) + Math.abs(w) )/2;
	}

	// Setters
	private inline function setUW(u:Float, w:Float) {
		this.u=u;
		this.w=w;
	}
	public inline function set(u:Float, v:Float, w:Float) {
		if(HexLib.validityCheck(u,v,w))
			setUW(u, w);
		// else trace("ERROR");
		// else throw("ERR !=0");
	}

	// toString
	public inline function toString(): String {
		return "[HexBase] "+u+", "+v+", "+w;
	}
}

/*----------------------------------------------------------------------------*/
// Float coordinates
@:forward(length,set)
abstract FractionalHex(HexBase) from HexBase to HexBase {
	// Constructor
	public inline function new(?fhex:FractionalHex, ?u:Float=0, ?w:Float=0) {
		this = (null!=fhex)? new HexBase(fhex.u,fhex.w): new HexBase(u,w);
	}

	// Properties
	public var u(get, never): Float;
	public inline function get_u(): Float { return this.u; }
	public var v(get, never): Float;
	public inline function get_v(): Float { return this.v; }
	public var w(get, never): Float;
	public inline function get_w(): Float { return this.w; }

	public var z(get, never): Float;
	public inline function get_z(): Float { return this.z; }

	// Operator overloading

	// Add A+B
	@:op(A+B)
	static public inline function add(fhex1:FractionalHex, fhex2:FractionalHex): FractionalHex {
		return new FractionalHex(fhex1.u+fhex2.u, fhex1.w+fhex2.w);
	}
	// Subtract A-B
	@:op(A-B)
	static public inline function subtract(fhex1:FractionalHex, fhex2:FractionalHex): FractionalHex {
		return new FractionalHex(fhex1.u-fhex2.u, fhex1.w-fhex2.w);
	}
	// Multiply A*B
	@:op(A*B) @:commutative
	static public inline function multiply(fhex:FractionalHex, a:Float): FractionalHex {
		return new FractionalHex(fhex.u*a, fhex.w*a);
	}
	// Divide A/B
	@:op(A/B)
	static public inline function divide(fhex:FractionalHex, a:Float): FractionalHex {
		return new FractionalHex(fhex.u/a, fhex.w/a);
	}
	// Negate -A
	@:op(-A)
	static public inline function negate(fhex:FractionalHex): FractionalHex {
		return new FractionalHex(-fhex.u, -fhex.w);
	}

	// Equal A==B
	@:op(A==B)
	static public inline function eq(fhex1:FractionalHex, fhex2:FractionalHex): Bool {
		return (null==fhex1||null==fhex2)? (null==fhex1&&null==fhex2): (fhex1.u==fhex2.u && fhex1.w==fhex2.w);
	}
	// Lower than A<B
	@:op(A<B)
	static public inline function lt(fhex1:FractionalHex, fhex2:FractionalHex): Bool {
		return (null==fhex1||null==fhex2)? false: (fhex1.length<fhex2.length);
	}
	// Greater than A>B
	@:op(A>B)
	static public inline function gt(fhex1:FractionalHex, fhex2:FractionalHex): Bool {
		return (null==fhex1||null==fhex2)? false: (fhex1.length>fhex2.length);
	}
	
	// Not equal A!=B
	@:op(A!=B)
	static public inline function neq(fhex1:FractionalHex, fhex2:FractionalHex): Bool {
		return !eq(fhex1,fhex2);
	}
	// Lower than or equal A<=B
	@:op(A<=B)
	static public inline function lte(fhex1:FractionalHex, fhex2:FractionalHex): Bool {
		return !gt(fhex1,fhex2);
	}
	// Greater than or equal A>=B
	@:op(A>=B)
	static public inline function gte(fhex1:FractionalHex, fhex2:FractionalHex): Bool {
		return !lt(fhex1,fhex2);
	}

	// Distance to given FHex
	public inline function distanceTo(fhex:FractionalHex): Float {
	    return (abstract-fhex).length;
	}

	// toString
	public inline function toString(): String {
		var x:Int = 1000000;
		return this==null? "Null_FHex": ("[FractionalHex] "+(Math.round(u*x)/x)+", "+(Math.round(v*x)/x)+", "+(Math.round(w*x)/x));
	}

	// Creation helper
	static private inline function create(u:Float, v:Float, w:Float): FractionalHex {
		return HexLib.validityCheck(u,v,w)? new FractionalHex(u, w): null;
	}
}

/*----------------------------------------------------------------------------*/
// Int coordinates
abstract Hex(HexBase) from HexBase to HexBase {
	// Constructor
	public inline function new(?hex:Hex, ?u:Int=0, ?w:Int=0) {
		this = (null!=hex)? new HexBase(hex.u,hex.w): new HexBase(u,w);
	}

	// Properties
	public var u(get, never): Int;
	public inline function get_u(): Int { return Std.int(this.u); }
	public var v(get, never): Int;
	public inline function get_v(): Int { return -Std.int(this.u)-Std.int(this.w); }
	public var w(get, never): Int;
	public inline function get_w(): Int { return Std.int(this.w); }

	public var z(get, never): Int;
	public inline function get_z(): Int { return Std.int(this.z); }

	public var length(get, never): Int;
	public inline function get_length(): Int { return Std.int(this.length); }

	// Setter
	public inline function set(u:Int, v:Int, w:Int) {
		if(HexLib.validityCheck(u,v,w,true))
			this.set(u,v,w);
	}

	// Cast
	@:to
	public inline function toFractionalHex(): FractionalHex {
		return new FractionalHex(u,w);
	}

	// Operator overloading

	// Add A+B
	@:op(A+B)
	static public inline function add(hex1:Hex, hex2:Hex): Hex {
		return new Hex(hex1.u+hex2.u, hex1.w+hex2.w);
	}
	// Subtract A-B
	@:op(A-B)
	static public inline function subtract(hex1:Hex, hex2:Hex): Hex {
		return new Hex(hex1.u-hex2.u, hex1.w-hex2.w);
	}
	// Multiply A*B
	@:op(A*B) @:commutative
	static public inline function multiply(hex:Hex, a:Int): Hex {
		return new Hex(hex.u*a, hex.w*a);
	}
	@:op(A*B) @:commutative
	static public inline function multiplyf(hex:Hex, a:Float): FractionalHex {
		return FractionalHex.multiply(hex, a);
	}
	// Divide A/B
	@:op(A/B)
	static public inline function divide(hex:Hex, a:Float): FractionalHex {
		return new FractionalHex(hex.u/a, hex.w/a);
	}
	// Negate -A
	@:op(-A)
	static public inline function negate(hex:Hex): Hex {
		return new Hex(-hex.u, -hex.w);
	}

	// Equal A==B
	@:op(A==B)
	static public inline function eq(hex1:Hex, hex2:Hex): Bool {
		return (null==hex1||null==hex2)? (null==hex1&&null==hex2): (hex1.u==hex2.u && hex1.w==hex2.w);
	}
	// Lower than A<B
	@:op(A<B)
	static public inline function lt(hex1:Hex, hex2:Hex): Bool {
		return (null==hex1||null==hex2)? false: (hex1.length<hex2.length);
	}
	// Greater than A>B
	@:op(A>B)
	static public inline function gt(hex1:Hex, hex2:Hex): Bool {
		return (null==hex1||null==hex2)? false: (hex1.length>hex2.length);
	}
	
	// Not equal A!=B
	@:op(A!=B)
	static public inline function neq(hex1:Hex, hex2:Hex): Bool {
		return !eq(hex1,hex2);
	}
	// Lower than or equal A<=B
	@:op(A<=B)
	static public inline function lte(hex1:Hex, hex2:Hex): Bool {
		return !gt(hex1, hex2);
	}
	// Greater than or equal A>=B
	@:op(A>=B)
	static public inline function gte(hex1:Hex, hex2:Hex): Bool {
		return !lt(hex1, hex2);
	}

	// Distance to given (Fractional) Hex
	public inline function distanceTo(hex:Hex): Int {
	    return (abstract-hex).length;
	}
	public inline function distanceToF(fhex:FractionalHex): Float {
	    return (abstract-fhex).length;
	}

	// Get corners : returns an array with the 6 FHex coord of the 6 corners
	public inline function getCorners(): Array<FractionalHex> {
		return [
			new FractionalHex(u+1/3,w-2/3),
			new FractionalHex(u+2/3,w-1/3),
			new FractionalHex(u+1/3,w+1/3),
			new FractionalHex(u-1/3,w+2/3),
			new FractionalHex(u-2/3,w+1/3),
			new FractionalHex(u-1/3,w-1/3)
		];
	}

	// Get neighbours : returns an array with the 6 Hex coord of the 6 nearby Hexs
	public inline function getNeigbours(): Array<Hex> {
		return [
			abstract+HexLib.NORTH_EAST,
			abstract+HexLib.EAST,
			abstract+HexLib.SOUTH_EAST,
			abstract+HexLib.SOUTH_WEST,
			abstract+HexLib.WEST,
			abstract+HexLib.NORTH_WEST
		];
	}

	// toString
	public inline function toString(): String {
		return this==null? "Null_Hex": ("[Hex] "+u+", "+v+", "+w);
	}

	// Creation helper
	static private inline function create(u:Int, v:Int, w:Int): Hex {
		return HexLib.validityCheck(u,v,w,true)? new Hex(u, w): null;
	}
}

/*----------------------------------------------------------------------------*/

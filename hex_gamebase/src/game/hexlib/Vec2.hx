/*----------------------------------------------------------------------------*/
package hexlib;

/*----------------------------------------------------------------------------*/
// 2D vector base
private class VecBase {
	// Constructor
	public inline function new(?x:Float=0, ?y:Float=0) {
		this.x = x;
		this.y = y;
	}

	// Properties (r/w from inside, ro from outside)
	public var x(default, null): Float;
	public var y(default, null): Float;

	// Global setter
	public inline function set(x:Float, y:Float) { this.x = x; this.y = y; }
}

/*----------------------------------------------------------------------------*/
// 2D vector
@:forward
abstract Vec2(VecBase) {
	public inline function new(?v:Vec2=null, ?x:Float=0, ?y:Float=0) {
		this = (null!=v)? new VecBase(v.x,v.y): new VecBase(x,y);
	}

	// Operator overloading
		// TODO

	// toString
	public inline function toString(): String { return "[Vec2] "+(this.x)+", "+(this.y); }
}

/*----------------------------------------------------------------------------*/

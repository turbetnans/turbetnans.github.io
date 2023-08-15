/*----------------------------------------------------------------------------*/
package hexlib;

import hexlib.HexLib;

/*----------------------------------------------------------------------------*/
// Projection helper
	// https://www.redblobgames.com/grids/hexagons/#pixel-to-hex

	// Sorting algorithms :
		// https://gamedev.stackexchange.com/questions/8151/how-do-i-sort-isometric-sprites-into-the-correct-order
        // https://gamedev.stackexchange.com/questions/3454/most-efficient-3d-depth-sorting-for-isometric-3d-in-as3/3532#3532
        
/*----------------------------------------------------------------------------*/
class Projector {
    // Constructor
    public function new(properties:ProjectorProperties) {
        this.properties = (properties==null)? new ProjectorProperties(19,9): properties;
        origin = new Vec2();
        origin.set(.5, .5);
    }

    // Origin point, relative to the scene (0.5,0.5 = centered)
    public var origin(default, set): Vec2;
    public function set_origin(o:Vec2): Vec2 {
        return origin = new Vec2(o);
    }

    // properties (for const values & scene size)
    public var properties(default, null): ProjectorProperties;

    // From FHex to pixel
    public function project(h:FractionalHex, ?zIgnored:Bool = false): Vec2 {

        // coordinates transformation
        var x: Float = ( h.u + h.w/2 ) * properties.tileDW;
        var y: Float = h.w*properties.tileDH;

        if(!zIgnored)
         y -= h.z*properties.tileDZ;

        // translation
        x += properties.w*origin.x;
        y += properties.h*origin.y;

        // return result
        var result: Vec2 = new Vec2();
        result.set(x, y);
        return result;
    }

    // From pixel to FHex, given z-plane
    public function unproject(v2:Vec2, ?z:Int = 0): FractionalHex {
        // translation
        var x: Float = v2.x - properties.w * origin.x;
        var y: Float = v2.y - properties.h * origin.y + z*properties.tileDZ;

        // projection
        var w: Float = y/properties.tileDH;
        var u: Float = x/properties.tileDW - w/2;
        var v: Float = -u-w;

        // return result
        var result: FractionalHex = new FractionalHex();
        result.set(u, v, w);
        // set Z
        return result;
    }

    // toString
    public function toString(): String { return "[Projector] ("+origin+") ; ("+properties+")"; }
}

/*----------------------------------------------------------------------------*/
// ProjectorProperties
class ProjectorProperties {
    // HexConstructor
    public function new(w:Int,h:Int) { this.w=w; this.h=h; };

    // Scene size
    public var w(default, null): Int = 80;
    public var h(default, null): Int = 60;

    // Tile size
    public var tileW(default, null): Int = 16;
    public var tileH(default, null): Int = 12;

    // Tile deltas between consecutive columns, rows and z-planes
    public var tileDW(default, null): Int = 16;
    public var tileDH(default, null): Int = 9;
    public var tileDZ(default, null): Int = 2;

    // toString
    public function toString(): String { return "[ProjectorProperties] "+w+", "+h+" | "+tileW+", "+tileH+" ; "+tileDW+", "+tileDH; }
}

/*----------------------------------------------------------------------------*/
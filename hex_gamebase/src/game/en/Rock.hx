package en;

import hexlib.HexLib;
import hexlib.Projector;
import hexlib.Vec2;

import h2d.Tile;

class Rock extends HexEntity {
    public function new(x: Int, y: Int) {
        super(x, y);
        spr.set(Assets.rock);
        spr.anim.registerStateAnim("idle",0);
        dir = Std.random(2)==0? -1: 1;
    }
}
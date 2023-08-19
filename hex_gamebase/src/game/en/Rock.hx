package en;

class Rock extends HexEntity {
    public function new(x: Int, y: Int) {
        super(x, y);

        spr.set(Assets.rock);
        spr.anim.registerStateAnim("idle",0);
        collidable = true;
    }
}
package en;

class Tree extends HexEntity {
    public function new(x: Int, y: Int) {
        super(x, y);

        spr.set(Assets.tree);
        spr.anim.registerStateAnim("idle",0);
        collidable = true;
    }
}
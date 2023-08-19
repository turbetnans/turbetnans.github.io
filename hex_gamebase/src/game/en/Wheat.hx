package en;

class Wheat extends HexEntity {
    public function new(x: Int, y: Int) {
        super(x, y);

        spr.set(Assets.wheat);
        spr.anim.registerStateAnim("idle",0);
    }
}
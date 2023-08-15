class HexEntity extends Entity {

    public function new(x: Int, y: Int) {
        super(x, y);
        setPosPixel(x,y);
    }
}
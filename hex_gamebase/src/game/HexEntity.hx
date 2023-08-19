class HexEntity extends Entity {

    public var chunkId: String;

    public function new(x: Int, y: Int) {
        super(x, y);
        setPosPixel(x,y);
    }
}

import hexlib.HexLib.Hex;

class HexEntity extends Entity {

    public var chunkCoords: Hex;

    public function new(x: Int, y: Int) {
        super(x, y);
        setPosPixel(x,y);
    }
}

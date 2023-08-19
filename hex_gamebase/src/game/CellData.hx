import hexlib.HexLib.Hex;

class CellData {
	public var biomeType: String;
	public var cellType: String;
	public var entityType: String;
	public var chunk: Hex;
	public function new(biomeType:String, chunk:Hex) {
		this.biomeType = biomeType;
		this.cellType = "";
		this.entityType = "";
		this.chunk = chunk;
	}
}
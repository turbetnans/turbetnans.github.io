import js.html.svg.ZoomAndPan;
import seedyrng.Xorshift64Plus;
import seedyrng.Random;
import hexlib.HexLib;

class Chunk {
	static public var SIZE(default, never): Int = 3;

	public var grid: HexGrid<CellData>;

	public var u: Int;
	public var w: Int;

	public function new(u: Int, w: Int, worldSeed: String) {
		var random = new Random(new Xorshift64Plus());

		this.u = u;
		this.w = w;

		// grid
		grid = new HexGrid<CellData>(SIZE);
		
		// populate
		var chunk: Hex = new Hex(u, w);
		var chunkId: String = u+","+w;
		random.setStringSeed(worldSeed+chunkId);

		var biome = switch(random.randomInt(0,7)){
			case 0,1: new CellData("forest", chunk);
			case 2,3: new CellData("field", chunk);
			case 4,5: new CellData("plain", chunk);
			case _: new CellData("ocean", chunk);
		};

		for(z in (-grid.radius)...(grid.radius+1)) {
			for(x in (z<0?-z-grid.radius:-grid.radius)...(z>0?-z+grid.radius+1:grid.radius+1)) {
				var y: Int = -x-z;
				var cellId: Int = (x+u*SIZE+SIZE)+(2*SIZE+1)*(z+w*SIZE+SIZE);
				random.setStringSeed(worldSeed+cellId);
				if(Math.abs(x)==SIZE && Math.abs(y)==SIZE) {
					if(random.randomInt(0,2)!=0) {
						continue;
					}
				} else if(Math.abs(y)==SIZE && Math.abs(z)==SIZE) {
					if(random.randomInt(0,2)!=1) {
						continue;
					}
				} else if(Math.abs(z)==SIZE && Math.abs(x)==SIZE) {
					if(random.randomInt(0,2)!=2) {
						continue;
					}
				} else if(Math.abs(x)==SIZE) {
					if(random.randomInt(0,1)==(x>0?0:1)) {
						continue;
					}
				} else if(Math.abs(y)==SIZE) {
					if(random.randomInt(0,1)==(y>0?0:1)) {
						continue;
					}
				} else if(Math.abs(z)==SIZE) {
					if(random.randomInt(0,1)==(z>0?0:1)) {
						continue;
					}
				}
				grid.setCellAt(x,z,new HexCell(x,z,biome));
			}
		}

		for(i in 0...3) {
			var nextData = new Map<Int, CellData>();
			for(cellKey in grid.content.keys()) {
				var cell = grid.content.get(cellKey);
				var count: Map<String, Float> = [
					"forest" => 0,
					"field" => 0,
					"plain" => 0,
					"ocean" => 0
				];
				count[cell.data.biomeType] += 2;
				for(h1 in cell.coord.getNeigbours()) {
					var c = grid.getCellAt(h1.u,h1.w);
					if(c!=null) {
						count[c.data.biomeType]++;
					}
				}
				var data = "ocean";
				for(countKey in count.keys()) {
					if(count[countKey]>count[data]) {
						data = countKey;
					}
				}
				nextData.set(cellKey, new CellData(data, chunk));
			}
			for(dataKey in nextData.keys()) {
				grid.content[dataKey].data = nextData[dataKey];
			}
		}

		for(cell in grid.content) {
			if(cell.data.biomeType=="forest") {
				cell.data.cellType = "grass";
			} else if(cell.data.biomeType=="field") {
				cell.data.cellType = "grass";
			} else if(cell.data.biomeType=="plain") {
				cell.data.cellType = "stone";
			} else {
				cell.data.cellType = "water";
			}
		}

		for(cell in grid.content) {
			if(cell.data.cellType == "water") {
				var count: Int = 6;
				for(h1 in cell.coord.getNeigbours()) {
					var c = grid.getCellAt(h1.u,h1.w);
					if(c!=null) {
						if(c.data.cellType!="water") {
							count-=1;
						}
					}
				}
				cell.data.cellType = switch(random.randomInt(count, 6)) {
					case 0: "water";
					case 5: "sand";
					case _: cell.data.cellType;
				}
			}
		}

		for(cell in grid.content) {
			if(cell.data.biomeType=="forest" && random.randomInt(0,5)<1) {
				cell.data.entityType = "tree";
			}
			if(cell.data.biomeType=="field" && cell.coord.getNeigbours().filter(h->grid.getCellAt(h.u,h.w)?.data.cellType=="grass").length>=6) {
				cell.data.entityType = "wheat";
			} else if(cell.data.biomeType=="field" && cell.coord.getNeigbours().filter(h->grid.getCellAt(h.u,h.w)?.data.cellType=="grass").length>=5 && random.randomInt(0,2)<2) {
				cell.data.entityType = "wheat";
			} else if(cell.data.biomeType=="field" && cell.coord.getNeigbours().filter(h->grid.getCellAt(h.u,h.w)?.data.cellType=="grass").length>=4 && random.randomInt(0,2)<1) {
				cell.data.entityType = "wheat";
			}
			if(cell.data.biomeType=="plain" && cell.data.cellType=="stone" && random.randomInt(0,3)<1) {
				cell.data.entityType = "rock";
			}
		}
	}

	public function getNeighboursCoords(): Array<Hex> {
		return [
			new Hex(u+1, w-2), new Hex(u-1, w-1),
			new Hex(u+2, w-1), new Hex(u-2, w+1),
			new Hex(u+1, w+1), new Hex(u-1, w+2)
		];
	}
}

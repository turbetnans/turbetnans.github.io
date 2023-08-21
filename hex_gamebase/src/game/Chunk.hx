import seedyrng.Xorshift64Plus;
import seedyrng.Random;
import hexlib.HexLib;

class Chunk {
	public var grid: HexGrid<CellData>;

	public var u: Int;
	public var w: Int;

	public var destroyed: Bool;

	public function new(u: Int, w: Int) {
		this.u = u;
		this.w = w;
		this.destroyed = false;
	}

	public function generate(worldSeed: String) {

		// grid
		grid = new HexGrid<CellData>(Const.CHUNK_SIZE);
		
		// populate
		var chunk: Hex = new Hex(u, w);

		var biome: String = generateBiome(u, w, worldSeed);

		var neighboursBiomes: Map<String, String> = [];
		for(h in getNeighboursCoords()) {
			neighboursBiomes[h.u+","+h.w] = generateBiome(h.u, h.w, worldSeed);
		};

		var oceanCount: Int = 0;
		for(biome in neighboursBiomes) {
			if(biome == "ocean") {
				oceanCount++;
			}
		}

		if(biome != "ocean" && oceanCount != 0) {
			var randomBeach = new Random(new Xorshift64Plus());
			randomBeach.setStringSeed(worldSeed+u+w+"beach");
			if(randomBeach.randomInt(oceanCount,7)>6) {
				biome = "beach";
			}
		}

		for(z in (-grid.radius)...(grid.radius+1)) {
			for(x in (z<0?-z-grid.radius:-grid.radius)...(z>0?-z+grid.radius+1:grid.radius+1)) {
				var y: Int = -x-z;
				var cellId: Int = (x+u*Const.CHUNK_SIZE+Const.CHUNK_SIZE)+(2*Const.CHUNK_SIZE+1)*(z+w*Const.CHUNK_SIZE+Const.CHUNK_SIZE);
				var randomBorders = new Random(new Xorshift64Plus());
				randomBorders.setStringSeed(worldSeed+cellId);
				if(Math.abs(x)==Const.CHUNK_SIZE && Math.abs(y)==Const.CHUNK_SIZE) {
					if(randomBorders.randomInt(0,2)!=0) {
						continue;
					}
				} else if(Math.abs(y)==Const.CHUNK_SIZE && Math.abs(z)==Const.CHUNK_SIZE) {
					if(randomBorders.randomInt(0,2)!=1) {
						continue;
					}
				} else if(Math.abs(z)==Const.CHUNK_SIZE && Math.abs(x)==Const.CHUNK_SIZE) {
					if(randomBorders.randomInt(0,2)!=2) {
						continue;
					}
				} else if(Math.abs(x)==Const.CHUNK_SIZE) {
					if(randomBorders.randomInt(0,1)==(x>0?0:1)) {
						continue;
					}
				} else if(Math.abs(y)==Const.CHUNK_SIZE) {
					if(randomBorders.randomInt(0,1)==(y>0?0:1)) {
						continue;
					}
				} else if(Math.abs(z)==Const.CHUNK_SIZE) {
					if(randomBorders.randomInt(0,1)==(z>0?0:1)) {
						continue;
					}
				}
				grid.setCellAt(x,z,new HexCell(x,z,new CellData(biome, chunk)));
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
					"beach" => 0,
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
			} else if(cell.data.biomeType=="beach") {
				cell.data.cellType = "sand";
			} else {
				cell.data.cellType = "water";
			}
		}

		for(cell in grid.content) {
			var randomEntity = new Random(new Xorshift64Plus());
			randomEntity.setStringSeed(worldSeed+u+w+cell.coord.u+cell.coord.w+"entity");
			if(cell.data.biomeType=="forest" && cell.data.cellType=="grass" && randomEntity.randomInt(0,5)<1) {
				cell.data.entityType = "tree";
			}
			if(cell.data.biomeType=="field" && cell.data.cellType=="grass" && cell.coord.getNeigbours().filter(h->grid.getCellAt(h.u,h.w)?.data.cellType=="grass").length>=5) {
				cell.data.entityType = "wheat";
			} else if(cell.data.biomeType=="field" && cell.data.cellType=="grass" && cell.coord.getNeigbours().filter(h->grid.getCellAt(h.u,h.w)?.data.cellType=="grass").length>=3 && randomEntity.randomInt(0,2)<2) {
				cell.data.entityType = "wheat";
			} else if(cell.data.biomeType=="field" && cell.data.cellType=="grass" && cell.coord.getNeigbours().filter(h->grid.getCellAt(h.u,h.w)?.data.cellType=="grass").length>=1 && randomEntity.randomInt(0,2)<1) {
				cell.data.entityType = "wheat";
			}
			if(cell.data.biomeType=="plain" && cell.data.cellType=="stone" && randomEntity.randomInt(0,3)<1) {
				cell.data.entityType = "rock";
			}
		}
	}

	public function generateBiome(u: Int, w: Int, worldSeed: String) {
		var random = new Random(new Xorshift64Plus());
		random.setStringSeed(worldSeed+u+w+"biome");
		return switch(random.randomInt(0,10)){
			case 0,1: "forest";
			case 2,3: "field";
			case 4,5: "plain";
			case _: "ocean";
		};
	}

	public function getNeighboursCoords(): Array<Hex> {
		return [
			new Hex(u+1, w-2),
			new Hex(u+2, w-1),
			new Hex(u+1, w+1),
			new Hex(u-1, w+2),
			new Hex(u-2, w+1),
			new Hex(u-1, w-1)
		];
	}
}

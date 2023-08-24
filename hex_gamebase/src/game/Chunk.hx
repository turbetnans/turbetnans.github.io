import seedyrng.Xorshift64Plus;
import seedyrng.Random;
import hexlib.HexLib;

class Chunk {
	public static var CHUNKS: Map<String, Chunk> = [];

	public var grid: HexGrid<CellData>;

	public var u: Int;
	public var w: Int;

	public function new(u: Int, w: Int) {
		this.u = u;
		this.w = w;
	}

	public function generate(worldSeed: String) {
		if(CHUNKS.exists(u+","+w)) {
			grid = new HexGrid<CellData>(Const.CHUNK_SIZE);
			grid.content = CHUNKS.get(u+","+w).grid.content.copy();
			return;
		}

		// grid
		grid = new HexGrid<CellData>(Const.CHUNK_SIZE);
		
		// populate
		var chunk: Hex = new Hex(u, w);
		var chunkWorld: Hex = getChunkWorldCoords();

		var biome: String = generateBiome(u, w, worldSeed);

		var neighboursBiomes: Map<String, String> = [];
		for(h in chunk.getNeigbours()) {
			neighboursBiomes[h.u+","+h.w] = generateSmoothBiome(h.u, h.w, worldSeed, 1);
		};

		var landCount: Int = 0;
		for(neighboursBiome in neighboursBiomes) {
			if(neighboursBiome == "ocean") {
				landCount++;
			}
		}

		for(z in (-grid.radius)...(grid.radius+1)) {
			for(x in (z<0?-z-grid.radius:-grid.radius)...(z>0?-z+grid.radius+1:grid.radius+1)) {
				var y: Int = -x-z;
				var cellId: Int = (x+chunkWorld.u+Const.CHUNK_SIZE)+(2*Const.CHUNK_SIZE+1)*(z+chunkWorld.w+Const.CHUNK_SIZE);
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

		for(cell in grid.content) {
			switch(cell.data.biomeType) {
				case "forest":
					cell.data.cellType = "grass";
				case "field" :
					cell.data.cellType = "grass";
				case "plain" :
					cell.data.cellType = "stone";
				case "desert" :
					cell.data.cellType = "sand";
				case "ocean" :
					cell.data.cellType = "water";
			}
		}

		for(cell in grid.content) {
			var randomEntity = new Random(new Xorshift64Plus());
			randomEntity.setStringSeed(worldSeed+u+w+cell.coord.u+cell.coord.w+"entity");
			if(cell.data.biomeType=="forest" && cell.data.cellType=="grass" && randomEntity.randomInt(0,5)<1) {
				cell.data.entityType = "tree";
			} else if(cell.data.biomeType=="field" && cell.data.cellType=="grass" && cell.coord.getNeigbours().filter(h->grid.getCellAt(h.u,h.w)?.data.cellType=="grass").length>=5) {
				cell.data.entityType = "wheat";
			} else if(cell.data.biomeType=="field" && cell.data.cellType=="grass" && cell.coord.getNeigbours().filter(h->grid.getCellAt(h.u,h.w)?.data.cellType=="grass").length>=3 && randomEntity.randomInt(0,2)<2) {
				cell.data.entityType = "wheat";
			} else if(cell.data.biomeType=="field" && cell.data.cellType=="grass" && cell.coord.getNeigbours().filter(h->grid.getCellAt(h.u,h.w)?.data.cellType=="grass").length>=1 && randomEntity.randomInt(0,2)<1) {
				cell.data.entityType = "wheat";
			} else if(cell.data.biomeType=="plain" && cell.data.cellType=="stone" && randomEntity.randomInt(0,3)<1) {
				cell.data.entityType = "rock";
			}
		}

		CHUNKS.set(u+","+w, this);
	}

	public function generateBiome(u: Int, w: Int, worldSeed: String) {
		var random = new Random(new Xorshift64Plus());
		random.setStringSeed(worldSeed+u+w+"biome");
		return switch(random.randomInt(0,15)){
			case 0,1: "forest";
			case 2,3: "field";
			case 4,5: "plain";
			case 6: "desert";
			case _: "ocean";
		};
	}

	public function generateSmoothBiome(u: Int, w: Int, worldSeed: String, iterations: Int) {
		var biome: String = generateBiome(u, w, worldSeed);
		var chunk: Hex = new Hex(u, w);
		
		var neighboursBiomes: Map<String, String> = [];
		for(h in chunk.getNeigbours()) {
			if(iterations==0) {
				neighboursBiomes[h.u+","+h.w] = generateBiome(h.u, h.w, worldSeed);
			} else {
				neighboursBiomes[h.u+","+h.w] = generateSmoothBiome(h.u, h.w, worldSeed, iterations-1);
			}
		};

		var count: Map<String, Float> = [
			"forest" => 0,
			"field" => 0,
			"plain" => 0,
			"desert" => 0,
			"ocean" => 0
		];
		count[biome] += 1;
		for(neighboursBiome in neighboursBiomes) {
			count[neighboursBiome]++;
		}
		var nextBiome: String = "ocean";
		for(countKey in count.keys()) {
			if(count[countKey]>count[nextBiome]) {
				nextBiome = countKey;
			}
		}
		biome = nextBiome;

		return biome;
	}

	public function getChunkWorldCoords(): Hex {
		return (new Hex(u, w) + HexLib.rotateAroundOrigin(new Hex(u, w), 1))*Const.CHUNK_SIZE;
	}
}

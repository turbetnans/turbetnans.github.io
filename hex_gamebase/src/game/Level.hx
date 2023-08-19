import seedyrng.Xorshift64Plus;
import seedyrng.Random;
import h2d.TileGroup;
import hxd.Res;
import hexlib.Projector;
import hexlib.Vec2;
import hexlib.HexLib;

class Level extends GameChildProcess {
	/** Level grid-based width**/
	public var cWid(default,null): Int;
	/** Level grid-based height **/
	public var cHei(default,null): Int;

	/** Level pixel width**/
	public var pxWid(default,null) : Int;
	/** Level pixel height**/
	public var pxHei(default,null) : Int;

	public var data : World_Level;
	var tilesetSource : h2d.Tile;

	public var marks : dn.MarkerMap<LevelMark>;
	var invalidated = true;

	public var grid: HexGrid<CellData>;

	public var uOffset: Int;
	public var wOffset: Int;

	public var chunks: Map<String, Chunk>;

	public var entities: Array<HexEntity>;

	public var seed: String;

	public function new(u: Int, w: Int) {
		super();

		uOffset = u*Chunk.SIZE;
		wOffset = w*Chunk.SIZE;

		var random = new Random(new Xorshift64Plus());
        seed = random.nextInt()+"";
		seed = "test";

		createRootInLayers(Game.ME.scroller, Const.DP_BG);

		// grid
		grid = new HexGrid<CellData>(Chunk.SIZE);

		// entities
		entities = [];

		// chunks
		chunks = [];
		loadChunk(u, w);
	}

	public function loadChunksAround(u: Int, w: Int, radius: Int){
		uOffset = u*Chunk.SIZE;
		wOffset = w*Chunk.SIZE;

		chunks = [];

		grid = new HexGrid<CellData>(Chunk.SIZE*5);
		
		for(e in entities)
			e.destroy();
		entities = [];

		loadChunk(u, w);
		for(i in 0...radius)
			for(chunk in chunks)
				for(coords in chunk.getNeighboursCoords())
					loadChunk(coords.u, coords.w);
	}

	function loadChunk(u: Int, w: Int) {
		if(chunks.exists(u+","+w))
			return;


		var chunk = new Chunk(u, w, seed);
		chunks.set(u+","+w, chunk);

		var random = new Random(new Xorshift64Plus());

		for(cell in chunk.grid.content) {
			var newCell = new HexCell<CellData>(
				cell.coord.u + u*Chunk.SIZE - uOffset,
				cell.coord.w + w*Chunk.SIZE - wOffset,
				cell.data
			);
			grid.setCellAt(newCell.coord.u, newCell.coord.w, newCell);
			
			var proj: Projector = new Projector(new ProjectorProperties(0, 0));
			proj.origin = new Vec2(.5,.5);
			
			random.setStringSeed(cell.coord.u+","+cell.coord.w);

			if(newCell.data.entityType=="wheat") {
				var wheatPos = proj.project(newCell.coord);
				var entity = new Wheat(Math.round(wheatPos.x)+random.randomInt(0,2)-1, Math.round(wheatPos.y)+3+random.randomInt(0,2)-1);
				entity.dir = random.randomInt(0,1)==0? -1: 1;
				entities.push(entity);
			} else if(newCell.data.entityType=="tree") {
				var treePos = proj.project(newCell.coord);
				var entity = new Tree(Math.round(treePos.x)+random.randomInt(0,2)-1, Math.round(treePos.y)+3+random.randomInt(0,2)-1);
				entity.dir = random.randomInt(0,1)==0? -1: 1;
				entities.push(entity);
			} else if(newCell.data.entityType=="rock") {
				var rockPos = proj.project(newCell.coord);
				var entity = new Rock(Math.round(rockPos.x)+random.randomInt(0,2)-1, Math.round(rockPos.y)+3+random.randomInt(0,2)-1);
				entity.dir = random.randomInt(0,1)==0? -1: 1;
				entities.push(entity);
			}
		}

		invalidate();
	}

	override function onDispose() {
		super.onDispose();
		chunks = null;
	}

	/** Ask for a level render that will only happen at the end of the current frame. **/
	public inline function invalidate() {
		invalidated = true;
	}

	/** Return TRUE if "Collisions" layer contains a collision value **/
	public inline function hasCollision(cx,cy) : Bool {
		return false;
	}

	/** Render current level**/
	function render() {
		// Placeholder level render
		root.removeChildren();

		var random = new Random(new Xorshift64Plus());

		var proj: Projector = new Projector(new ProjectorProperties(0, 0));
		proj.origin = new Vec2(.5,.5);

		var tilesGrid = Res.atlas.world.toAseprite().toTile().gridFlatten(16);
		var tileGroup = new TileGroup(tilesGrid[0]);

		var tiles = [
			"grass" => Res.atlas.world.toAseprite().getSlice("grass").tile.gridFlatten(16),
			"stone" => Res.atlas.world.toAseprite().getSlice("stone").tile.gridFlatten(16),
			"water" => Res.atlas.world.toAseprite().getSlice("water").tile.gridFlatten(16),
			"sand" => Res.atlas.world.toAseprite().getSlice("sand").tile.gridFlatten(16)
		];

		var sides = [
			"grass" => Res.atlas.world.toAseprite().getSlice("grass-sides").tile.gridFlatten(16),
			"stone" => Res.atlas.world.toAseprite().getSlice("stone-sides").tile.gridFlatten(16),
			"water" => Res.atlas.world.toAseprite().getSlice("water-sides").tile.gridFlatten(16),
			"sand" => Res.atlas.world.toAseprite().getSlice("sand-sides").tile.gridFlatten(16)
		];

		var priorities = [
			"grass" => 4,
			"stone" => 3,
			"water" => 2,
			"sand" => 1
		];

		tileGroup.colorKey = 0xff00ff;
		root.add(tileGroup, Const.DP_BG);

		// display tiles
		for(cell in grid.content) {
			if( cell==null ) continue;
			var pos: Vec2 = proj.project(cell.coord);
			random.setStringSeed((cell.coord.u-cell.data.chunk.u*Chunk.SIZE+uOffset)+","+(cell.coord.w-cell.data.chunk.w*Chunk.SIZE+wOffset));
			tileGroup.add(pos.x,pos.y,tiles[cell.data.cellType][random.randomInt(0,tiles[cell.data.cellType].length-1)].center());
		}
		// display sides
		for(cell in grid.content) {
			var count:Int=0;
			if( cell==null ) continue;
			for(h1 in cell.coord.getNeigbours()){
				var c: HexCell<CellData> = grid.getCellAt(h1.u,h1.w);
				var me = priorities[cell.data.cellType];
				var other = c==null? -1: priorities[c.data.cellType];
				if(me>other) {
					var h2 = HexLib.lerp(cell.coord,h1);
					var pos: Vec2 = proj.project(h2);
					tileGroup.add(pos.x,pos.y,sides[cell.data.cellType][count].center());
				} else if(me<other) {
					var h2 = HexLib.lerp(cell.coord,h1);
					var pos: Vec2 = proj.project(h2);
					tileGroup.add(pos.x,pos.y,sides[c.data.cellType][(count+3)%6].center());
				}
				count++;
			}
		}
	}

	override function postUpdate() {
		super.postUpdate();

		if( invalidated ) {
			invalidated = false;
			render();
		}
	}
}

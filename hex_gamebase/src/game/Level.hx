import h2d.TileGroup;
import hxd.Res;
import hexlib.Projector;
import h2d.Tile;
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


	public var grid: HexGrid<String>;

	public function new(ldtkLevel:World.World_Level) {
		super();

		createRootInLayers(Game.ME.scroller, Const.DP_BG);

		// grid
		grid = new HexGrid<String>(24);
		
		// populate
		for(z in (-grid.radius)...(grid.radius+1)) {
			for(x in (z<0?-z-grid.radius:-grid.radius)...(z>0?-z+grid.radius+1:grid.radius+1)) {
				grid.setCellAt(x,z,new HexCell(x,z,
					Std.random(3)==0? "water":
					Std.random(3)==0? "sand":
					Std.random(2)==0? "stone":
					"grass"
				));
			}
		}
		for(i in 0...4) {
			var nextData = new Map<Int, String>();
			for(cellKey in grid.content.keys()) {
				var cell = grid.content.get(cellKey);
				var count: Map<String, Float> = [
					"grass" => 0,
					"stone" => 0,
					"water" => 0,
					"sand" => -2
				];
				count[cell.data] += 3;
				for(h1 in cell.coord.getNeigbours()) {
					var c = grid.getCellAt(h1.u,h1.w);
					if(c!=null) {
						count[c.data]++;
						if(i<3 && c.data=="water" && cell.data!="water") {
							count["sand"]+=1.33;
						}
					}
				}
				var data = "grass";
				for(countKey in count.keys()) {
					if(count[countKey]>count[data]) {
						data = countKey;
					}
				}
				nextData.set(cellKey, data);
			}
			for(dataKey in nextData.keys()) {
				grid.content[dataKey].data = nextData[dataKey];
			}
		}
	}

	override function onDispose() {
		super.onDispose();
		grid = null;
	}

	/** TRUE if given coords are in level bounds **/
	public inline function isValid(cx,cy) return true;

	/** Gets the integer ID of a given level grid coord **/
	public inline function coordId(cx,cy) return cx + cy*cWid;

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

		var proj: Projector = new Projector(new ProjectorProperties(0, 0));
		var origin = new Vec2();
		origin.set(.5,.5);
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
			tileGroup.add(pos.x,pos.y,tiles[cell.data][Std.random(tiles[cell.data].length)].center());
		}
		// display sides
		for(cell in grid.content) {
			var count:Int=0;
			for(h1 in cell.coord.getNeigbours()){
				var h2 = HexLib.lerp(cell.coord,h1);
				var c: HexCell<String> = grid.getCellAt(h1.u,h1.w);
				var pos: Vec2 = proj.project(h2);

				var me = priorities[cell.data];
				var other = c==null? -1: priorities[c.data];
				if(me>other) {
					tileGroup.add(pos.x,pos.y,sides[cell.data][count].center());
				} else if(me<other) {
					tileGroup.add(pos.x,pos.y,sides[c.data][(count+3)%6].center());
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
package en;

import hexlib.HexLib;
import hexlib.Projector;
import hexlib.Vec2;

import h2d.Tile;

class Hero extends HexEntity {
    
	var ca : ControllerAccess<GameAction>;

    var path: Array<Hex> = [];
    var pathStep: Int = 0;

	var avatarPosition: FractionalHex = new FractionalHex();
	var avatarTarget: FractionalHex = new FractionalHex();

    public function new(x: Int, y: Int) {
        super(x, y);

        camera.trackEntity(this, true);
        
		ca = App.ME.controller.createAccess();

        spr.set(Assets.horty);

        spr.anim.registerStateAnim("swimming", 2,
            ()->Game.ME.level.grid.getCellAt(HexLib.round(avatarPosition).u, HexLib.round(avatarPosition).w).data=="water"
        );
        spr.anim.registerStateAnim("walking", 1,
            ()->avatarPosition!=avatarTarget
        );
        spr.anim.registerStateAnim("idle", 0);
    }

    override public function frameUpdate() {
        if(ca.isPressed(Click)) {
            var proj: Projector = new Projector(new ProjectorProperties(0, 0));
            proj.origin = new Vec2(.5,.5);
            var mx: Int = Math.floor(App.ME.mouse.levelX);
            var my: Int = Math.floor(App.ME.mouse.levelY);
            var hex: Hex = HexLib.round(proj.unproject(new Vec2( mx+.5, my+.5 )));
            var obstacles = Entity.ALL.mapToArray(e->e).filter(e->e.collidable);
            path = HexLib.pathFinding(
                level.grid,
                HexLib.round(avatarPosition),
                hex,
                (c:HexCell<String>) -> {
                    if(obstacles.filter(e->HexLib.round(proj.unproject(new Vec2(e.sprX, e.sprY)))==c.coord).length>0) {
                        Math.POSITIVE_INFINITY;
                    } else {
                        switch(c.data){
                            case "stone": 1;
                            case "grass": 2;
                            case "sand": 3;
                            case "water": 4;
                            default: Math.POSITIVE_INFINITY;
                        }
                    }
                }
            );
            pathStep = 1;
        }
    }

    override public function fixedUpdate() {
        var oldPosition = avatarPosition;
		if(avatarPosition != avatarTarget) {
            var proj: Projector = new Projector(new ProjectorProperties(0, 0));
            proj.origin = new Vec2(.5,.5);
			var vector: FractionalHex = avatarTarget - avatarPosition;
			vector *= 0.1/vector.length;
			if (vector.length < avatarPosition.distanceTo(avatarTarget)) {
				avatarPosition += vector;
			} else {
				avatarPosition = avatarTarget;
			}
			var avatarPos: Vec2 = proj.project(avatarPosition);
            setPosPixel(avatarPos.x, avatarPos.y);
		}
		if(avatarPosition == avatarTarget && pathStep < path.length) {
			avatarTarget = path[pathStep++];
		}
        var dx = (oldPosition-avatarPosition).u + (oldPosition-avatarPosition).w/2;
        dir = dx<0? 1: dx>0? -1: dir;
    }
}
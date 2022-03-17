// Three.js / WebGL
var stats, gui, txt, composer;

var normalCamera, p1Camera, p2Camera, ballCamera;
var currentCamera;

var currentRenderer, normalRenderer, glitchedRenderer;

var gameScene;
var currentScene;

var loader = new THREE.FontLoader();

// Game state (in menu, playing, etc...)
var state = {menu: 0, play: 1, wait: 2, pause: 3, end: 4};
var gameState;

// Level (in vs AI mode)
var level;
var levelMesh;
var maxLevel = 3;

// Cheats
var godMode;

// Ball
var ball;
var smallBalls = [null, null, null];
var ballRadius;
var ballSpeed;
var collisionType = {edge: 0, shield1: 1, shield2: 2, scoring1: 3, scoring2 : 4, bar1: 5, bar2: 6, brick: 7, bonusEdge: 8};

// Edges
var edges = [];
var bonusEdges = [];
var scoringZone1;
var scoringZone2;

// Player bars
var p1Bar;
var p2Bar;
var p1BarSpeed;		// On x axis.
var p2BarSpeed;		// On x axis.
var barMaxSpeed;
var barAcceleration;		// For inertia.

// Shields
var nbShields;
var p1Shields = [], p2Shields = [];

// Bricks
var bricks = [];
var brickCount;

// Keyboard
var keyboard = new KeyboardState();

// P2
var player2;
var p2Mesh = {body: null, head: null};

// Score
var p1Score, p2Score;
var maxScore;

// Public
var publicMeshes = [];
var jump;

// Sound
var bgm;
var hitPaddle;
var hitWall;

// Useful materials
var whiteMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
var blackMaterial = new THREE.MeshPhongMaterial({color: 0x000000});
var darkRedMaterial = new THREE.MeshPhongMaterial({color: 0x4d0000});
var redMaterial = new THREE.MeshPhongMaterial({color: 0x7f0000});
var blueMaterial = new THREE.MeshPhongMaterial({color: 0x00007f});


// load THREE.js
if( !init() )
	animate();

// Sound
bgm = new Howl({ src: ['src/sound/pong.mp3'], html5: true, preload: true });
hitWall = new Howl({ src: ['src/sound/wall.wav'], html5: true, preload: true });
hitPaddle = new Howl({ src: ['src/sound/paddle.wav'], html5: true, preload: true });


function init(){

	// Default renderer
	if( Detector.webgl ){
		normalRenderer = new THREE.WebGLRenderer({
			antialias : true,				// to get smoother output
			preserveDrawingBuffer : true	// to allow screenshot
		});

		var color = new THREE.Color();
		color.r = (Math.cos(0)/3)+0.5;
		color.g = (Math.cos(2)/3)+0.5;
		color.b = (Math.cos(-2)/3)+0.5;
		normalRenderer.setClearColor(color);
	}else{
		Detector.addGetWebGLMessage();
		return true;
	}
	normalRenderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById("container").appendChild(normalRenderer.domElement);

	// Glitched renderer (whith post processing)
	if( Detector.webgl ){
		glitchedRenderer = new THREE.WebGLRenderer({
			antialias : true,				// to get smoother output
			preserveDrawingBuffer : true	// to allow screenshot
		});
		glitchedRenderer.setClearColor( 0x000000 );
	}else{
		Detector.addGetWebGLMessage();
		return true;
	}
	glitchedRenderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById("container").appendChild(glitchedRenderer.domElement);

	currentRenderer = normalRenderer;


	// Init variables
	gameState = state.menu;

	godMode = {p1: false, p2: false};

	ballSpeed = {x:- 0.15, z:-0.2, xmin: 0.05, xmax: 0.75, zmin: 0.05, zmax: 0.5};

	edges = [];

	p1BarSpeed = 0;
	p2BarSpeed = 0;
	barMaxSpeed = 0.25;
	barAcceleration = barMaxSpeed*0.1;

	nbShields = 3;
	p1Shields = [], p2Shields = [];

	bricks = [];
	brickCount = {p1: null, p2: null};

	p1Score = {value: 0, mesh: null};
	p2Score = {value: 0, mesh: null};
	maxScore = 3;

	publicMeshes = [];
	jump = {jumping: false, falling: false, jumps: 0, maxJumps: 3};


	// Add Stats.js - https://github.com/mrdoob/stats.js
	stats = new Stats();
	stats.domElement.style.position	= 'absolute';
	stats.domElement.style.bottom	= '0px';
	document.body.appendChild( stats.domElement );


	// create a scene
	gameScene = new THREE.Scene();

	// Starting scene
	currentScene = gameScene;

	// allow 'p' to make screenshot
	THREEx.Screenshot.bindKey(currentRenderer);

	// allow 'f' to go fullscreen where this feature is supported
	if( THREEx.FullScreen.available() ){
		THREEx.FullScreen.bindKey();		
	}


	// Main camera
	normalCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
    gameScene.add(normalCamera);
    normalCamera.up.set(0, 0, 1);
	normalCamera.position.set(13.5, -53, 16);
	normalCamera.lookAt(13.5, 0, 16);

	// P1 bar camera
	p1Camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
	gameScene.add(p1Camera);
	p1Camera.up.set(0, 0, 1);

	// P2 bar camera
	p2Camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
	gameScene.add(p2Camera);
	p2Camera.up.set(0, 0, 1);

	// Ball camera
	ballCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 100);
	gameScene.add(ballCamera);
	ballCamera.up.set(0, 0, 1);

	// Camera at start
	currentCamera = normalCamera;

	// transparently support window resize
	THREEx.WindowResize.bind(normalRenderer, normalCamera);
	THREEx.WindowResize.bind(normalRenderer, p1Camera);
	THREEx.WindowResize.bind(normalRenderer, p2Camera);
	THREEx.WindowResize.bind(normalRenderer, ballCamera);

	THREEx.WindowResize.bind(glitchedRenderer, normalCamera);
	THREEx.WindowResize.bind(glitchedRenderer, p1Camera);
	THREEx.WindowResize.bind(glitchedRenderer, p2Camera);
	THREEx.WindowResize.bind(glitchedRenderer, ballCamera);


	// Lights
	var ambientLight = new THREE.AmbientLight(0x7f7f7f);
	gameScene.add(ambientLight);

	var dLightColor = 0x808080;

	var directionalLight1 = new THREE.DirectionalLight(dLightColor, 0.4);
	directionalLight1.position.set(0, 0, 1);
	gameScene.add(directionalLight1);

	var directionalLight2 = new THREE.DirectionalLight(dLightColor, 0.4);
	directionalLight2.position.set(0, 0, -1);
	gameScene.add(directionalLight2);

	var directionalLight3 = new THREE.DirectionalLight(dLightColor, 0.2);
	directionalLight3.position.set(1, 0, 0);
	gameScene.add(directionalLight3);

	var directionalLight4 = new THREE.DirectionalLight(dLightColor, 0.2);
	directionalLight4.position.set(-1, 0, 0);
	gameScene.add(directionalLight4);

	var mainLight = new THREE.PointLight();
	mainLight.position.set(13.5, -5, 16);
	gameScene.add(mainLight);

    // Edges
	var edgesMaterial = new THREE.MeshPhongMaterial({color: 0x123456});

	var botGeometry1 = new THREE.BoxGeometry(10, 1, 1);
	var botMesh1 = new THREE.Mesh(botGeometry1, edgesMaterial);
	botMesh1.position.set(6, 0, 0.5);
	gameScene.add(botMesh1);

    var sideGeometry1 = new THREE.BoxGeometry(1, 1, 32);
    var sideMesh1 = new THREE.Mesh(sideGeometry1, edgesMaterial);
    sideMesh1.position.set(0.5, 0, 16);
    gameScene.add(sideMesh1);

    var botGeometry = new THREE.BoxGeometry(5, 1, 10);
    var botMesh = new THREE.Mesh(botGeometry, edgesMaterial);
    botMesh.position.set(13.5, 0, 5);
    gameScene.add(botMesh);

    var topGeometry = new THREE.BoxGeometry(25, 1, 1);
    var topMesh = new THREE.Mesh(topGeometry, edgesMaterial);
    topMesh.position.set(13.5, 0 ,31.5);
    gameScene.add(topMesh);

	var botGeometry2 = new THREE.BoxGeometry(10, 1, 1);
	var botMesh2 = new THREE.Mesh(botGeometry2, edgesMaterial);
	botMesh2.position.set(21, 0, 0.5);
	gameScene.add(botMesh2);

    var sideGeometry2 = new THREE.BoxGeometry(1, 1, 32);
    var sideMesh2 = new THREE.Mesh(sideGeometry2, edgesMaterial);
    sideMesh2.position.set(26.5, 0, 16);
    gameScene.add(sideMesh2);


	scoringZone1 = botMesh1;
	scoringZone2 = botMesh2;

	edges.push(sideMesh1);
	edges.push(botMesh);
	edges.push(topMesh);
	edges.push(sideMesh2);


	// Background
	var backgroundMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color( 0.1+0.3*Math.random(), 0.1+0.3*Math.random(), 0.1+0.3*Math.random() )});
	var backgroundGeometry = new THREE.BoxGeometry(25.5, 2, 0.5);

	var backgroundSideGeometry = new THREE.BoxGeometry(0.5, 2.75, 31.5);

	var backgroundSide1Mesh = new THREE.Mesh(backgroundSideGeometry, backgroundMaterial);
	backgroundSide1Mesh.position.set(0.5, 1.875, 16);
	gameScene.add(backgroundSide1Mesh);

	var backgroundSide2Mesh = new THREE.Mesh(backgroundSideGeometry, backgroundMaterial);
	backgroundSide2Mesh.position.set(26.5, 1.875, 16);
	gameScene.add(backgroundSide2Mesh);

	var backgroundTopGeometry = new THREE.BoxGeometry(25.5, 2.75, 0.5);

	var backgroundTopMesh = new THREE.Mesh(backgroundTopGeometry, backgroundMaterial);
	backgroundTopMesh.position.set(13.5, 1.875, 31.5);
	gameScene.add(backgroundTopMesh);

	var backgroundBotMesh = new THREE.Mesh(backgroundTopGeometry, backgroundMaterial);
	backgroundBotMesh.position.set(13.5, 1.875, 0.5);
	gameScene.add(backgroundBotMesh);

    var backgroundCenterGeometry = new THREE.BoxGeometry(4.5, 2, 9.5);

    var backgroundMesh = new THREE.Mesh(backgroundCenterGeometry, backgroundMaterial);
    backgroundMesh.position.set(13.5, 1.5, 5);
    gameScene.add(backgroundMesh);

	var backgroundBackMaterial = new THREE.MeshBasicMaterial({color: 0x101010});

	var backgroundBackGeometry = new THREE.BoxGeometry(25.5, 0.5, 30.5);

	var backgroundBackMesh = new THREE.Mesh(backgroundBackGeometry, backgroundBackMaterial);
	backgroundBackMesh.position.set(13.5, 2.75, 16);
	gameScene.add(backgroundBackMesh);

	for(var i=0; i<28; i=i+4){
		var backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
		backgroundMesh.position.set(13.5, 1.5, i+4);
		gameScene.add(backgroundMesh);
	}


	// Sides
    var hGeometry = new THREE.BoxGeometry(16, 1, 1);
    var vGeometry = new THREE.BoxGeometry(1, 1, 30);

    var shGeometry = new THREE.BoxGeometry(15.5, 9, 0.5);
    var svGeometry = new THREE.BoxGeometry(0.5, 9, 30.5);

    var bGeometry = new THREE.BoxGeometry(14.5, 0.5, 30.5);


	var p1TopMesh = new THREE.Mesh(hGeometry, edgesMaterial);
	p1TopMesh.position.set(-10, 0, 31.5);
    gameScene.add(p1TopMesh);

	var p1BotMesh = new THREE.Mesh(hGeometry, edgesMaterial);
	p1BotMesh.position.set(-10, 0, 0.5);
    gameScene.add(p1BotMesh);

	var p1RightMesh = new THREE.Mesh(vGeometry, edgesMaterial);
	p1RightMesh.position.set(-2.5, 0, 16);
    gameScene.add(p1RightMesh);

	var p1LeftMesh = new THREE.Mesh(vGeometry, edgesMaterial);
	p1LeftMesh.position.set(-17.5, 0, 16);
    gameScene.add(p1LeftMesh);


    var p1SideTopMesh = new THREE.Mesh(shGeometry, backgroundMaterial);
    p1SideTopMesh.position.set(-10, 5, 31.5);
    gameScene.add(p1SideTopMesh);

    var p1SideBotMesh = new THREE.Mesh(shGeometry, backgroundMaterial);
    p1SideBotMesh.position.set(-10, 5, 0.5);
    gameScene.add(p1SideBotMesh);

    var p1SideRightMesh = new THREE.Mesh(svGeometry, backgroundMaterial);
    p1SideRightMesh.position.set(-2.5, 5, 16);
    gameScene.add(p1SideRightMesh);

    var p1SideLeftMesh = new THREE.Mesh(svGeometry, backgroundMaterial);
    p1SideLeftMesh.position.set(-17.5, 5, 16);
    gameScene.add(p1SideLeftMesh);


    var p1BackMesh = new THREE.Mesh(bGeometry, backgroundBackMaterial);
    p1BackMesh.position.set(-10, 9, 16);
    gameScene.add(p1BackMesh);


	var p2TopMesh = new THREE.Mesh(hGeometry, edgesMaterial);
	p2TopMesh.position.set(37, 0, 31.5);
    gameScene.add(p2TopMesh);

	var p2BotMesh = new THREE.Mesh(hGeometry, edgesMaterial);
	p2BotMesh.position.set(37, 0, 0.5);
    gameScene.add(p2BotMesh);

	var p2RightMesh = new THREE.Mesh(vGeometry, edgesMaterial);
	p2RightMesh.position.set(44.5, 0, 16);
    gameScene.add(p2RightMesh);

	var p2LeftMesh = new THREE.Mesh(vGeometry, edgesMaterial);
	p2LeftMesh.position.set(29.5, 0, 16);
    gameScene.add(p2LeftMesh);


    var p2SideTopMesh = new THREE.Mesh(shGeometry, backgroundMaterial);
    p2SideTopMesh.position.set(37, 5, 31.5);
    gameScene.add(p2SideTopMesh);

    var p2SideBotMesh = new THREE.Mesh(shGeometry, backgroundMaterial);
    p2SideBotMesh.position.set(37, 5, 0.5);
    gameScene.add(p2SideBotMesh);

    var p2SideRightMesh = new THREE.Mesh(svGeometry, backgroundMaterial);
    p2SideRightMesh.position.set(44.5, 5, 16);
    gameScene.add(p2SideRightMesh);

    var p2SideLeftMesh = new THREE.Mesh(svGeometry, backgroundMaterial);
    p2SideLeftMesh.position.set(29.5, 5, 16);
    gameScene.add(p2SideLeftMesh);


    var p2BackMesh = new THREE.Mesh(bGeometry, backgroundBackMaterial);
    p2BackMesh.position.set(37, 9, 16);
    gameScene.add(p2BackMesh);


 	// P1 Stickman
	var p1Material = new THREE.MeshPhongMaterial({color: 0x00C040});

 	var p1Geometry = new THREE.CylinderGeometry(3, 3, 12, 16);
	var p1Mesh = new THREE.Mesh(p1Geometry, p1Material);
	p1Mesh.position.set(-10, 4, 7);
	p1Mesh.rotateX(Math.PI/2);

	var p1HeadGeometry = new THREE.SphereGeometry(4, 20, 15);
	var p1HeadMesh = new THREE.Mesh(p1HeadGeometry, p1Material);
	p1HeadMesh.position.set(-10, 4, 18);

	var p1GlassesGeometry = new THREE.BoxGeometry(2, 0.5, 1.25);

	var p1Glasses1Mesh = new THREE.Mesh(p1GlassesGeometry, blueMaterial);
	p1Glasses1Mesh.position.set(-2, -4, 0);
	p1HeadMesh.add(p1Glasses1Mesh);

	var p1Glasses2Mesh = new THREE.Mesh(p1GlassesGeometry, redMaterial);
	p1Glasses2Mesh.position.set(2, -4, 0);
	p1HeadMesh.add(p1Glasses2Mesh);

	var p1GlassesFrameGeometry = new THREE.BoxGeometry(2.7, 0.48, 1.7);

	var p1GlassesFrame1Mesh = new THREE.Mesh(p1GlassesFrameGeometry, whiteMaterial);
	p1GlassesFrame1Mesh.position.set(-2, -4, 0);
	p1HeadMesh.add(p1GlassesFrame1Mesh);	

	var p1GlassesFrame2Mesh = new THREE.Mesh(p1GlassesFrameGeometry, whiteMaterial);
	p1GlassesFrame2Mesh.position.set(2, -4, 0);
	p1HeadMesh.add(p1GlassesFrame2Mesh);

	var p1GlassesFrameLinkGeometry = new THREE.BoxGeometry(1.3, 0.48, 0.7);
	var p1GlassesFrameLinkMesh = new THREE.Mesh(p1GlassesFrameLinkGeometry, whiteMaterial);
	p1GlassesFrameLinkMesh.position.set(0, -4, 0.5);
	p1HeadMesh.add(p1GlassesFrameLinkMesh);

	p1HeadMesh.up.set(0, 0, 1);
	p1HeadMesh.lookAt(normalCamera.position);
	p1HeadMesh.rotateX(-Math.PI/2);
	gameScene.add(p1HeadMesh);

	gameScene.add(p1Mesh);


	// P2 '?'
	loadPlayer2(false);

	// Bars
	var barGeometry = new THREE.BoxGeometry(3, 1, 0.5);

	var bar1Material = new THREE.MeshPhongMaterial({color: 0x00C040});
	var bar1Mesh = new THREE.Mesh(barGeometry, bar1Material);
	bar1Mesh.position.set(6, 0, 3);
	gameScene.add(bar1Mesh);

	var bar2Material = new THREE.MeshPhongMaterial({color: 0xC00040});
	var bar2Mesh = new THREE.Mesh(barGeometry, bar2Material);
	bar2Mesh.position.set(21, 0, 3);
	gameScene.add(bar2Mesh);

	p1Bar = bar1Mesh;
	p2Bar = bar2Mesh;


	// Public
	loadPublic();

	// Shields
	loadShields();

	// Bricks
	loadBricks();


    // Ball
    var ballMaterial = new THREE.MeshPhongMaterial({color: 0xc0c0c0});
    var ballGeometry = new THREE.BoxGeometry(.5, .5, .5);
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(13.5, 0, 16);
    gameScene.add(ball);

    // Small balls
    for(var i=0; i<3; i++){
    	var scale = 0.9-0.1*i;

	    var smallBallMaterial = (i==0)? new THREE.MeshBasicMaterial({color: 0xc0c000}):
	                            (i==1)? new THREE.MeshBasicMaterial({color: 0xc06000}):
	                            (i==2)? new THREE.MeshBasicMaterial({color: 0xc00000}):
	                            new THREE.MeshPhongMaterial({color: 0xc0c0c0});	// error

	    var smallBallMesh = new THREE.Mesh(ballGeometry, smallBallMaterial);
	    smallBallMesh.position.set(ball.position.x, ball.position.y, ball.position.z);
	    smallBallMesh.scale.set(scale, scale, scale);
	    gameScene.add(smallBallMesh);

	    smallBalls[i] = smallBallMesh;
    }


	// Init scores
	setScore(1, 0);
	setScore(2, 0);

	// Point camera at ball
	normalCamera.lookAt(ball.position);
}

function animate() {

	// loop on request animation loop
	// - it has to be at the begining of the function
	// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	requestAnimationFrame( animate );

	// do the render
	render();

	// update stats
	stats.update();
}

var nbFrames=0;
function render() {
	nbFrames++;

	// Get keyboard inputs
	keyboard.update();

	// background color changing
	if(nbFrames%10==0){
		var color = normalRenderer.getClearColor();

		color.r = (Math.cos(nbFrames/100)/3)+0.5;
		color.g = (Math.cos(2+nbFrames/150)/3)+0.5;
		color.b = (Math.cos(-2+nbFrames/225)/3)+0.5;

		normalRenderer.setClearColor(color);
	}

	// Game states
	if(gameState==state.end){
		// A player has won

	}else{

		if( gameState==state.play || gameState==state.wait ){

			if( keyboard.down("1") && currentCamera!==p1Camera )
				currentCamera = p1Camera;

			if( keyboard.down("2") && currentCamera!==p2Camera )
				currentCamera = p2Camera;

			if( keyboard.down("3") && currentCamera!==ballCamera )
				currentCamera = ballCamera;

			if( keyboard.down("4") && currentCamera!==normalCamera )
				currentCamera = normalCamera;
		}

		if(currentCamera===normalCamera){
			// Nothing to do ?

		}else if(currentCamera===p1Camera){
			p1Camera.position.set( p1Bar.position.x - 0.5*(p1Bar.position.x-6), -12, 0);
			p1Camera.lookAt(new THREE.Vector3(p1Bar.position.x, p1Bar.position.y, p1Bar.position.z+4));

		}else if(currentCamera===p2Camera){
			p2Camera.position.set( p2Bar.position.x - 0.66*(p2Bar.position.x-21), -12, 0);
			p2Camera.lookAt(new THREE.Vector3(p2Bar.position.x, p2Bar.position.y, p2Bar.position.z+4));

		}else if(currentCamera===ballCamera){
			ballCamera.position.set( ball.position.x-0.25, -12, ball.position.z-0.25);
			ballCamera.lookAt(new THREE.Vector3(ball.position.x, ball.position.y, ball.position.z));
		}


		// Player(s) controls
		if(gameState===state.play){
			// Menu controls
			if(keyboard.up("esc"))
				pauseGame();

			if(keyboard.up("H"))
				showHelp();

			// P1 controls

			if( keyboard.pressed("Q") && !keyboard.pressed("D") && p1BarSpeed>-barMaxSpeed ){
				p1BarSpeed = Math.max(-barMaxSpeed, p1BarSpeed-barAcceleration);

			}else if( keyboard.pressed("D") && !keyboard.pressed("Q") && p1BarSpeed<barMaxSpeed ){
				p1BarSpeed = Math.min(barMaxSpeed, p1BarSpeed+barAcceleration);

			}else{
				p1BarSpeed = p1BarSpeed>0? Math.max(0, p1BarSpeed-0.5*barAcceleration): Math.min(0, p1BarSpeed+0.5*barAcceleration);
			}

			// P2 controls
			if(player2){
				if( keyboard.pressed("left") && !keyboard.pressed("right") && p2BarSpeed>-barMaxSpeed ){
					p2BarSpeed = Math.max(-barMaxSpeed, p2BarSpeed-barAcceleration);

				}else if( keyboard.pressed("right") && !keyboard.pressed("left") && p2BarSpeed<barMaxSpeed ){
					p2BarSpeed = Math.min(barMaxSpeed, p2BarSpeed+barAcceleration);

				}else{
					p2BarSpeed = p2BarSpeed>0? Math.max(0, p2BarSpeed-0.5*barAcceleration): Math.min(0, p2BarSpeed+0.5*barAcceleration);
				}

			// AI controls (AI acceleraation increases with level: 50% 75% 100%) (barAcceleration * level==0? 1: 0.25*level)
			}else{
				if( (ball.position.x<(p2Bar.position.x-((level==0||level==3)? 1.5: 1)) && ball.position.x>13.5) || ((ball.position.x<13.5||ball.position.z>15) && p2Bar.position.x>22.5) ){
					p2BarSpeed = Math.min(barMaxSpeed, p2BarSpeed-(barAcceleration * (level==0? 2/3: (0.25*level))));

				}else if( (ball.position.x>(p2Bar.position.x+((level==0||level==3)? 1.5: 1))) || ((ball.position.x<17.5||ball.position.z>15) && p2Bar.position.x<19.5) ){
					p2BarSpeed = Math.min(barMaxSpeed, p2BarSpeed+(barAcceleration * (level==0? 2/3: (0.25*level))));

				}else{
					p2BarSpeed = p2BarSpeed>0? Math.max(0, p2BarSpeed-0.5*barAcceleration): Math.min(0, p2BarSpeed+0.5*barAcceleration);
				}
			}

			// CHEAT : immortal
			if(keyboard.down("I")){
				// Toggle god mode for p2
				if(keyboard.pressed("shift")){
					godMode.p2=!godMode.p2;
					if(godMode.p2){
						p2Bar.material.color.setHex(0xcc9900);
					}else{
						p2Bar.material.color.setHex(0xC00040);
					}

				// Toggle god mode for p1
				}else{
					godMode.p1=!godMode.p1;
					if(godMode.p1){
						p1Bar.material.color.setHex(0xcc9900);
					}else{
						p1Bar.material.color.setHex(0x00C040);
					}
				}
			}

			// CHEAT : next joker (shift: p2, ctrl: big bonus)
			if(keyboard.down("J"))
				giveBonus(keyboard.pressed("shift")? 2: 1, keyboard.pressed("alt")? 15: 5);

			// CHEAT : next level (story mode)
			if( keyboard.down("K") && level!=0 && !player2 ){
				if(level>=maxLevel){
					// Victory (story mode)
					gameState = state.end;
    				document.getElementById("title").style.visibility = "visible";
					document.getElementById("victory").style.visibility = "visible";
					//document.getElementById("exitVictory").disabled = false;

				}else{
					// Next level
					gameState = state.end;
    				document.getElementById("title").style.visibility = "visible";
					document.getElementById("nextLevel").style.visibility = "visible";
					//document.getElementById("next").disabled = false;
					//document.getElementById("exitNext").disabled = false;
				}
			}

			// Update bars positions
			barUpdate();

			// Small balls
			for(var i=2; i>0; i--)
				smallBalls[i].position.set(smallBalls[i-1].position.x, smallBalls[i-1].position.y, smallBalls[i-1].position.z);
			smallBalls[0].position.set(ball.position.x, ball.position.y, ball.position.z);

			// Compute collisions (looking for first collision)
			var result = null;
			var ratio = 1;
			do{
				// Compute collisions (looking for first collision)
				result = collisionManager(ratio);

				// Compute bouncing (compute new position and new speed vector)
				ratio = bounceManager(ratio, result);

			}while( result!=null && ratio!=0 );

			// Public update
			publicUpdate();

		}else if(gameState==state.pause){
			if( keyboard.up("esc") && document.getElementById("pauseMenu").style.visibility=="visible" )
				unpauseGame();

			if( keyboard.up("H") && document.getElementById("helpMenu").style.visibility=="visible" )
				closeHelp();

			if( keyboard.up("esc") && document.getElementById("helpMenu").style.visibility=="visible" )
				closeHelp();

		}else if(gameState==state.wait){
			// Public update
			publicUpdate();

			// At the end of jumping animation -> falling
			if(jump.jumping){
				if( publicMeshes[0].mesh.position.z >= 0.6+publicMeshes[0].initial ){
					if(jump.jumps<=0)
						jump.jumps=0;
					jump.jumping = false;
					jump.falling = true;
				}

			// At the end of falling animation -> jumping OR end victory/defeat/next level menu
			}else if(jump.falling){
				if( publicMeshes[0].mesh.position.z <= publicMeshes[0].initial ){
					jump.jumps++;
					if(jump.jumps>=jump.maxJumps){
						jump.jumps = 0;
						jump.jumping = false;
						jump.falling = false;

						if( p1Score.value>=maxScore && maxScore!=0 ){
							if(!player2){
								if(level>=maxLevel){
									// Victory (story mode)
									gameState = state.end;
				    				document.getElementById("title").style.visibility = "visible";
									document.getElementById("victory").style.visibility = "visible";
									//document.getElementById("exitVictory").disabled = false;

								}else if(level==0){
									// Victory (vs AI)
									gameState = state.end;
				    				document.getElementById("title").style.visibility = "visible";
									document.getElementById("victory").style.visibility = "visible";
									//document.getElementById("exitVictory").disabled = false;

								}else{
									// Next level (story mode)
									gameState = state.end;
				    				document.getElementById("title").style.visibility = "visible";
									document.getElementById("nextLevel").style.visibility = "visible";
									//document.getElementById("next").disabled = false;
									//document.getElementById("exitNext").disabled = false;
								}
							}else{
								// Victory (vs P2)
								gameState = state.end;
				    			document.getElementById("title").style.visibility = "visible";
								document.getElementById("p1Victory").style.visibility = "visible";
								//document.getElementById("exitVictory1").disabled = false;
							}
						}

						if( p2Score.value>=maxScore && maxScore!=0 ){
							if(!player2){
								// AI Victory
								gameState = state.end;
				    			document.getElementById("title").style.visibility = "visible";
								document.getElementById("defeat").style.visibility = "visible";
								//document.getElementById("exitDefeat").disabled = false;

							}else{
								// P2 Victory
								gameState = state.end;
				    			document.getElementById("title").style.visibility = "visible";
								document.getElementById("p2Victory").style.visibility = "visible";
								//document.getElementById("exitVictory2").disabled = false;
							}
						}
					}else{
						jump.jumping = true;
						jump.falling = false;
					}
				}
			}
		}

		// End of game
		if( gameState==state.wait && !jump.falling && !jump.jumping ){
			if( (p1Score.value>=maxScore || p2Score.value>=maxScore) && maxScore!=0 ){
				gameState=state.end;
			}else{
				if(ballSpeed.x<0)
					ball.position.set(p1Bar.position.x, 0, p1Bar.position.z+1);
				if(ballSpeed.x>0)
					ball.position.set(p2Bar.position.x, 0, p2Bar.position.z+1);
				gameState=state.play;
			}
		}
	}

	// Render
	currentRenderer.render(currentScene, currentCamera);
}

function barUpdate(){
	p1Bar.position.x = p1Bar.position.x+p1BarSpeed<2.5? 2.5:
					   p1Bar.position.x+p1BarSpeed>9.5? 9.5:
					   p1Bar.position.x+p1BarSpeed;

	p2Bar.position.x = p2Bar.position.x+p2BarSpeed<17.5? 17.5:
					   p2Bar.position.x+p2BarSpeed>24.5? 24.5:
					   p2Bar.position.x+p2BarSpeed;

	if( p1BarSpeed<0 && p1Bar.position.x==2.5 )
		p1BarSpeed = 0;
	else if( p1BarSpeed>0 && p1Bar.position.x==9.5 )
		p1BarSpeed = 0;

	if( p2BarSpeed<0 && p2Bar.position.x==17.5 )
		p2BarSpeed = 0;
	else if( p2BarSpeed>0 && p2Bar.position.x==24.5 )
		p2BarSpeed = 0;
}

function publicUpdate(){
	for(var i=0; i<publicMeshes.length; i++){
		var public = publicMeshes[i];

		// Jumping
		if(jump.jumping){
			if(public.mesh.position.z === public.initial){
				public.headMesh.rotation.set(0, 0, 0);
			}
			public.mesh.translateY(0.06);
			public.headMesh.translateZ(0.06);

		// Falling
		}else if(jump.falling){
			public.mesh.translateY(-0.06);
			public.headMesh.translateZ(-0.06);

		}else if(gameState==state.play){
			// Looking at the ball if close enough
		    if( ball.position.z-public.headMesh.position.z<6 &&
		    		ball.position.z-public.headMesh.position.z>-3 &&
		    		Math.abs(ball.position.x-public.headMesh.position.x)<9 ){
				public.headMesh.lookAt(ball.position);
				public.headMesh.rotateX(-Math.PI/2);

			// Reset rotation
			}else if( gameState==state.play &&
				      public.headMesh.rotation.x!=0 ||
				      public.headMesh.rotation.y!=0 ||
				      public.headMesh.rotation.z!=0 ){
				var rotationSpeed = 0.05;

				if( public.headMesh.rotation.x<rotationSpeed && public.headMesh.rotation.x>-rotationSpeed )
					public.headMesh.rotation.x=0;
				else if(public.headMesh.rotation.x>0)
					public.headMesh.rotation.x=public.headMesh.rotation.x-rotationSpeed;
				else
					public.headMesh.rotation.x=public.headMesh.rotation.x+rotationSpeed;
				
				if( public.headMesh.rotation.x===0 && public.headMesh.rotation.y<rotationSpeed && public.headMesh.rotation.y>-rotationSpeed )
					public.headMesh.rotation.y=0;
				else if(public.headMesh.rotation.y>0)
					public.headMesh.rotation.y=public.headMesh.rotation.y-rotationSpeed;
				else
					public.headMesh.rotation.y=public.headMesh.rotation.y+rotationSpeed;
				
				if( public.headMesh.rotation.x===0 && public.headMesh.rotation.z<rotationSpeed && public.headMesh.rotation.z>-rotationSpeed )
					public.headMesh.rotation.z=0;
				else if(public.headMesh.rotation.z>0)
					public.headMesh.rotation.z=public.headMesh.rotation.z-rotationSpeed;
				else
					public.headMesh.rotation.z=public.headMesh.rotation.z+rotationSpeed;
			}
		}
	}
}

function collisionManager(ratio){
	// Collision detection (source: http://stemkoski.github.io/Three.js/Collision-Detection.html)
	var result = null;

	// collision with scoring zone 	=> add point + reset ball position and speed (if score == maxScore => end of set)
	var r = collide(scoringZone1, ratio);
	if( r!=null ){
		r.type = collisionType.scoring1;
		result = r;
	}

	r = collide(scoringZone2, ratio);
	if( r!=null && (result==null || (result!=null && result.distance>r.distance))){
		r.type = collisionType.scoring2;
		result = r;
	}

	// collision with shield 		=> remove shield from scene + rebound (+ increase speed ?)
	for(var i=0; i<p1Shields.length; i++){
		if(p1Shields[i].isUp){
			r = collide(p1Shields[i].mesh, ratio);
			if( r!=null && (result==null || (result!=null && result.distance>r.distance))){
				r.type = collisionType.shield1;
				r.shield = p1Shields[i];
				result = r;
			}
		}
	}

	for(var i=0; i<p2Shields.length; i++){
		if(p2Shields[i].isUp){
			r = collide(p2Shields[i].mesh, ratio);
			if( r!=null && (result==null || (result!=null && result.distance>r.distance))){
				r.type = collisionType.shield2;
				r.shield = p2Shields[i];
				result = r;
			}
		}
	}

	// collision with bricks
	for(var i=0; i<bricks.length; i++){
		if(bricks[i].isUp){
			r = collide(bricks[i].mesh, ratio);
			if( r!=null && (result==null || (result!=null && result.distance>r.distance))){
				r.type = collisionType.brick;
				r.brick = bricks[i];
				result = r;
			}
		}
	}

	// collision with bar 			=> rebound + increase speed
	r = collide(p1Bar, ratio);
	if( r!=null && (result==null || (result!=null && result.distance>r.distance))){
		r.type = collisionType.bar1;
		result = r;
	}

	r = collide(p2Bar, ratio);
	if( r!=null && (result==null || (result!=null && result.distance>r.distance))){
		r.type = collisionType.bar2;
		result = r;
	}

	// collision with bonus edge 	=> rebound
	for(var i=0; i<bonusEdges.length; i++){
		r = collide(bonusEdges[i], ratio);
		if( r!=null && (result==null || (result!=null && result.distance>r.distance))){
			r.type = collisionType.edge;
			result = r;
		}
	}

	// collision with edge 			=> rebound
	for(var i=0; i<edges.length; i++){
		r = collide(edges[i], ratio);
		if( r!=null && (result==null || (result!=null && result.distance>r.distance))){
			r.type = collisionType.edge;
			result = r;
		}
	}

	return result;
}

// Source: http://stemkoski.github.io/Three.js/Collision-Detection.html
function collide(obj, ratio){
	var originPoint = ball.position.clone();

	var bestResult = null;

	obj.updateMatrixWorld();
	
	for(var vertexIndex = 0; vertexIndex < ball.geometry.vertices.length; vertexIndex++){		
		var localVertex = ball.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.clone().applyMatrix4(ball.matrix);

		var speed = new THREE.Vector3(ballSpeed.x*ratio, 0, ballSpeed.z*ratio);
		
		var ray = new THREE.Raycaster(globalVertex, speed.clone().normalize());

		var results = ray.intersectObject(obj);

		if( results.length>0 && results[0].distance<speed.length() ){
			if( bestResult==null || results[0].distance<bestResult.distance )
				bestResult = {normal: results[0].face.normal.clone().normalize(), distance: results[0].distance, type: null, shield: null, brick: null};
		}
	}

	return bestResult;
}

function bounceManager(oldRatio, result){
	var nextRatio = 0;

	if(result!=null){
		var ratio = result.distance/Math.sqrt(Math.pow(ballSpeed.x, 2) + Math.pow(ballSpeed.z, 2));
		nextRatio = oldRatio-ratio;

		if( Math.abs(result.normal.x)===1 ){
			// x translation
			ball.translateZ(ballSpeed.x*ratio);
			ballSpeed.x *= -1;

			// z translation
			ball.translateZ(ballSpeed.z*ratio);

		}else if( Math.abs(result.normal.z)===1 ){
			// x translation
			ball.translateX(ballSpeed.x*ratio);
			
			// z translation
			ball.translateZ(ballSpeed.z*ratio);
			ballSpeed.z *= -1;
		}

		switch(result.type){
			case collisionType.edge:
				// Nothing
				break;

			case collisionType.bonusEdge:
				// Nothing
				break;

			case collisionType.shield1:
				// Break the shield
				gameScene.remove(result.shield.mesh);
				result.shield.isUp = false;
				// Bonus
				if(brickCount.p1==null){
					brickCount.p2 += 2;
				}else{
					brickCount.p1 = Math.max(0, brickCount.p1-2);
				}
				break;
				
			case collisionType.shield2:
				// Break the shield
				gameScene.remove(result.shield.mesh);
				result.shield.isUp = false;
				// Bonus
				if(brickCount.p2==null){
					brickCount.p1 += 2;
				}else{
					brickCount.p2 = Math.max(0, brickCount.p2-2);
				}
				break;
				
			case collisionType.scoring1:
				// If not in god mode, add a point to opponent
				if(!godMode.p1){
					addPoint(2);
					jump.jumping = true;
					jump.maxJumps = 3;
					ballSpeed.x = -0.15;
					ballSpeed.z = -0.2;
				    for(var i=0; i<3; i++)
				    	smallBalls[i].position.set(ball.position.x, ball.position.y, ball.position.z);
					gameState = state.wait;
					nextRatio = 0;
					brickCount = {p1: null, p2: null};
				}
				break;
				
			case collisionType.scoring2:
				// If not in god mode, add a point to opponent
				if(!godMode.p2){
					addPoint(1);
					jump.jumping = true;
					jump.maxJumps = 3;
					ballSpeed.x = 0.15;
					ballSpeed.z = -0.2;
				    for(var i=0; i<3; i++)
				    	smallBalls[i].position.set(ball.position.x, ball.position.y, ball.position.z);
					gameState = state.wait;
					nextRatio = 0;
					brickCount = {p1: null, p2: null};
				}
				break;
				
			case collisionType.bar1:
				// Change ball x speed depending on bar speed
				ballSpeed.x *= p1BarSpeed==0? 1: Math.sign(p1BarSpeed)==Math.sign(ballSpeed.x)? 3/2: 2/3;
				// Accelerate ball z speed
				ballSpeed.z += Math.sign(ballSpeed.z)*0.01;
				// Bonus
				if( brickCount.p1==null && brickCount.p2!=null ){
					console.log("P2 count= " + brickCount.p2);
					giveBonus(2, brickCount.p2);
					brickCount = {p1: 0, p2: null};
				}else if(brickCount.p1==null){
					brickCount = {p1: 0, p2: null};
				}
				break;
				
			case collisionType.bar2:
				// Change ball x speed depending on bar speed
				ballSpeed.x *= p2BarSpeed==0? 1:Math.sign(p2BarSpeed)==Math.sign(ballSpeed.x)? 3/2: 2/3;
				// Accelerate ball z speed
				ballSpeed.z += Math.sign(ballSpeed.z)*0.01;
				// Bonus
				if( brickCount.p2==null && brickCount.p1!=null ){
					console.log("P1 count= " + brickCount.p1);
					giveBonus(1, brickCount.p1);
					brickCount = {p1: null, p2: 0};
				}else if(brickCount.p2==null){
					brickCount = {p1: null, p2: 0};
				}
				break;

			case collisionType.brick:
				// Pop a bonus edge
				if(Math.random()<(result.brick.mesh.position.z-20)*0.02+0.05){
					var geometry = new THREE.BoxGeometry(1.67, 1, 0.67)
					var material = new THREE.MeshPhongMaterial({color: 0x123481});
					var edge = new THREE.Mesh(geometry, material);
					edge.position.set(result.brick.mesh.position.x, result.brick.mesh.position.y, result.brick.mesh.position.z);
					gameScene.add(edge);
					bonusEdges.push(edge);
				}
				// Break the brick
				gameScene.remove(result.brick.mesh);
				result.brick.isUp = false;
				// Bonus
				if( brickCount.p2==null && brickCount.p1!=null )
					brickCount.p1 ++;
				if( brickCount.p1==null && brickCount.p2!=null )
					brickCount.p2 ++;
				break;

			default:
				// ERROR
				break;
		}
		switch(result.type){
			case collisionType.edge:
			case collisionType.bonusEdge:
			case collisionType.shield1:
			case collisionType.shield2:
			case collisionType.scoring1:
			case collisionType.scoring2:
			case collisionType.brick:
				if(hitWall.playing())
					hitWall.stop();
				hitWall.play();
				break;

			case collisionType.bar1:
			case collisionType.bar2:
				if(hitPaddle.playing())
					hitPaddle.stop();
				hitPaddle.play();
				break;

			default:
				// ERROR
				break;
		}
		ballSpeed.x = Math.sign(ballSpeed.x)*Math.max(ballSpeed.xmin, Math.min(ballSpeed.xmax, Math.abs(ballSpeed.x)));
		ballSpeed.z = Math.sign(ballSpeed.z)*Math.max(ballSpeed.zmin, Math.min(ballSpeed.zmax, Math.abs(ballSpeed.z)));

	}else{
		// move the ball
		ball.translateX(ballSpeed.x*oldRatio);
		ball.translateZ(ballSpeed.z*oldRatio);	
	}

	return nextRatio;
}

function loadShields(){
	// Delete old shields
	for(var i=0; i<p1Shields.length; i++)
		gameScene.remove(p1Shields[i].mesh);
	for(var i=0; i<p2Shields.length; i++)
		gameScene.remove(p2Shields[i].mesh);

	p1Shields = [];
	p2Shields = [];

	// Create shields
	var shieldGeometry = new THREE.BoxGeometry(10/nbShields -0.125, 0.67, 0.33);
	var shield1Material = new THREE.MeshBasicMaterial({color: 0x00C040, transparent: true, opacity: 0.1});
	var shield2Material = new THREE.MeshBasicMaterial({color: 0xC00040, transparent: true, opacity: 0.1});	

	for(var i=0; i<nbShields; i++){
		var shield;

		var shield1Mesh = new THREE.Mesh(shieldGeometry, shield1Material);
		shield1Mesh.position.set(1 + 5/nbShields + i*10/nbShields, 0, 2);

		var shield2Mesh = new THREE.Mesh(shieldGeometry, shield2Material);
		shield2Mesh.position.set(16 + 5/nbShields + i*10/nbShields, 0, 2);

		for(var j=0; j<5; j++){
			var scale = (19-j)/20;

			var innerShield1Mesh = shield1Mesh.clone();
			innerShield1Mesh.scale.set(scale, scale, scale);
			innerShield1Mesh.position.set(0, 0.01, 0);
			shield1Mesh.add(innerShield1Mesh);

			var innerShield2Mesh = shield2Mesh.clone();
			innerShield2Mesh.scale.set(scale, scale, scale);
			innerShield2Mesh.position.set(0, 0.01, 0);
			shield2Mesh.add(innerShield2Mesh);
		}

		gameScene.add(shield2Mesh);
		gameScene.add(shield1Mesh);

		shield = {mesh: shield1Mesh, isUp: true};
		p1Shields.push(shield);

		shield = {mesh: shield2Mesh, isUp: true};
		p2Shields.push(shield);
	}
}

// Restore all shields
function reloadShields(player){
	if( player!=1 && player!=2 )
		return; // ERROR

	for(var i=0; i<nbShields; i++){
		if(player==1){
			if(!p1Shields[i].isUp){
				p1Shields[i].isUp=true;
				gameScene.add(p1Shields[i].mesh);
			}

		}else if(player==2){
			if(!p2Shields[i].isUp){
				p2Shields[i].isUp=true;
				gameScene.add(p2Shields[i].mesh);
			}
		}
	}
}

// Restore a single shield
function reloadShield(player){
	if( player!=1 && player!=2 )
		return; // ERROR

	for(var i=0; i<nbShields; i++){
		if(player==1){
			if(!p1Shields[i].isUp){
				p1Shields[i].isUp=true;
				gameScene.add(p1Shields[i].mesh);
				return;
			}

		}else if(player==2){
			if(!p2Shields[i].isUp){
				p2Shields[i].isUp=true;
				gameScene.add(p2Shields[i].mesh);
				return;
			}
		}
	}
}

// Break all shields
function breakShields(player){
	if( player!=1 && player!=2 )
		return; // ERROR

	for(var i=0; i<nbShields; i++){
		if(player==1){
			if(p1Shields[i].isUp){
				p1Shields[i].isUp=false;
				gameScene.remove(p1Shields[i].mesh);
			}

		}else if(player==2){
			if(p2Shields[i].isUp){
				p2Shields[i].isUp=false;
				gameScene.remove(p2Shields[i].mesh);
			}
		}
	}
}

// Break a single shield
function breakShield(player){
	if( player!=1 && player!=2 )
		return; // ERROR

	for(var i=0; i<nbShields; i++){
		if(player==1){
			if(p1Shields[i].isUp){
				p1Shields[i].isUp=false;
				gameScene.remove(p1Shields[i].mesh);
				return;
			}

		}else if(player==2){
			if(p2Shields[i].isUp){
				p2Shields[i].isUp=false;
				gameScene.remove(p2Shields[i].mesh);
				return;
			}
		}
	}
}

function loadBricks(){
	var brickGeometry = new THREE.BoxGeometry(1.67, 0.67, 0.67);

	for(var j=0; j<11; j++){
		for(var i=1; i<13; i++){
			var brickMaterial = new THREE.MeshBasicMaterial({color: 0xffb020, transparent: true, opacity: 0.66});

			brickMaterial.color.g *= 1 - (11-j)/16.5;
			brickMaterial.color.r *= 1 - (13-i)/39;
			brickMaterial.color.b *= 1 - (13-i)/13;
			var brickMesh = new THREE.Mesh(brickGeometry, brickMaterial);

			brickMesh.position.set(0.5+2*i, 0, 30-j);
			gameScene.add(brickMesh);

			var brick = {mesh: brickMesh, isUp: true};
			bricks.push(brick);
		}
	}

	// Reset brick count
	brickCount = {p1: null, p2: null};
}

function reloadBricks(){
	clearBonusEdges();

	for(var i=0; i<bricks.length; i++){
		bricks[i].isUp = true;
		gameScene.add(bricks[i].mesh);
	}

	// Reset brick count
	brickCount = {p1: null, p2: null};
}

function clearBonusEdges(){
	for(var i=0; i<bonusEdges.length; i++)
		gameScene.remove(bonusEdges[i]);
	bonusEdges = [];
}

function giveBonus(player, count){
	if( player!=1 && player!=2 )
		return;	// ERROR

	/* BONUS
		15 : 	50 -> full heal
				50 -> full break
		10 : 	25 -> full heal
				25 -> full break
				50 -> 5
		5 : 	50 -> heal
				50 -> break
	*/

	// Heal one shield
	if( (count<15 && count>=10 && Math.random()>0.25) || (count>=15 && Math.random()>0.5) ){
		console.log("full heal P" + player);
		reloadShields(player);

	// Break opponent shield
	}else if( (count<15 && count>=10 && Math.random()>0.25) || count>=15 ){
		console.log("full break P" + (player==1? 2: 1));
		breakShields((player==1? 2: 1));

	// Heal one shield
	}else if( count<10 && count>=5 && Math.random()>0.5 ){
		console.log("heal P" + player);
		reloadShield(player);

	// Break opponent shield
	}else if( count<10 && count>=5 ){
		console.log("break P" + (player==1? 2: 1));
		breakShield((player==1? 2: 1));

	// Nothing...
	}else{
		console.log("nothing P" + (player==1? 2: 1));
	}
}

function loadPublic(){
	for(var i=0; i<28; i=i+4){

		if(i+4<32){
			var r = 0.2+0.3*Math.random(), g = 0.2+0.3*Math.random(), b =0.2+0.3*Math.random();
			var shade = 0.5+0.25*Math.random();
			var publicMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color( r, g, b )});
			var hatMaterial = new THREE.MeshPhongMaterial({color: new THREE.Color( r*shade, g*shade, b*shade )});
			for(var j=0; j<8; j++){
				if(i<8 && (j===3 || j===4) )
					j=5;

				var r = 0.2 + Math.random() * 0.2;
				var h = 0.6 + Math.random() * 0.6;
				var x = 2 + 3*j + Math.random()*2;

				var publicGeometry = new THREE.CylinderGeometry(r, r, h);
				var publicMesh = new THREE.Mesh(publicGeometry, publicMaterial);
				publicMesh.position.set(x, 1.5, i+4+0.25+h/2);
				publicMesh.rotateX(Math.PI/2);

				// 20% chance : tie
				if(Math.random()<0.2){
					var knotGeometry = new THREE.BoxGeometry(r/2, r/4, r/3);
					var knotMesh = new THREE.Mesh(knotGeometry, hatMaterial);
					knotMesh.position.set(0, h/2-r/4, r);
					publicMesh.add(knotMesh);

					var tieGeometry = new THREE.BoxGeometry(r/3, h/3, r/8);
					var tieTopMesh = new THREE.Mesh(tieGeometry, hatMaterial);
					tieTopMesh.position.set(0, h/2-r/4-h/6, r);
					publicMesh.add(tieTopMesh);
				}

				var s = r + 0.05 + Math.random() * 0.1;
				var publicHeadGeometry = new THREE.SphereGeometry(s, 12, 9);
				var publicHeadMesh = new THREE.Mesh(publicHeadGeometry, publicMaterial);
				publicHeadMesh.position.set(x, 1.5, i+4+0.25 + h + 1.25*s);

				// 20% chance : glasses
				if(Math.random()<0.2){
					var publicGlassesGeometry = new THREE.BoxGeometry(s/2, s/8, s*1.25/4);

					// 33% chance : sun glasses
					if(Math.random()<1/3){
						var publicGlasses1Mesh = new THREE.Mesh(publicGlassesGeometry, darkRedMaterial);
						publicGlasses1Mesh.position.set(-s/2, -s, 0);
						publicHeadMesh.add(publicGlasses1Mesh);

						var publicGlasses2Mesh = new THREE.Mesh(publicGlassesGeometry, darkRedMaterial);
						publicGlasses2Mesh.position.set(s/2, -s, 0);
						publicHeadMesh.add(publicGlasses2Mesh);

					// Regular glasses
					}else{
						var publicGlasses1Mesh = new THREE.Mesh(publicGlassesGeometry, whiteMaterial);
						publicGlasses1Mesh.position.set(-s/2, -s, 0);
						publicHeadMesh.add(publicGlasses1Mesh);

						var publicGlasses2Mesh = new THREE.Mesh(publicGlassesGeometry, whiteMaterial);
						publicGlasses2Mesh.position.set(s/2, -s, 0);
						publicHeadMesh.add(publicGlasses2Mesh);
					}

					var publicGlassesFrameGeometry = new THREE.BoxGeometry(s*2.7/4, s*0.48/4, s*1.7/4);

					var publicGlassesFrame1Mesh = new THREE.Mesh(publicGlassesFrameGeometry, blackMaterial);
					publicGlassesFrame1Mesh.position.set(-s/2, -s, 0);
					publicHeadMesh.add(publicGlassesFrame1Mesh);	

					var publicGlassesFrame2Mesh = new THREE.Mesh(publicGlassesFrameGeometry, blackMaterial);
					publicGlassesFrame2Mesh.position.set(s/2, -s, 0);
					publicHeadMesh.add(publicGlassesFrame2Mesh);

					var publicGlassesFrameLinkGeometry = new THREE.BoxGeometry(s*1.3/4, s*0.48/4, s*0.7/4);
					var publicGlassesFrameLinkMesh = new THREE.Mesh(publicGlassesFrameLinkGeometry, blackMaterial);
					publicGlassesFrameLinkMesh.position.set(0, -s, s/8);
					publicHeadMesh.add(publicGlassesFrameLinkMesh);

				// Regular eyes
				}else{
					var publicEyeGeometry1 = new THREE.SphereGeometry(s/3);

					var publicEye1Mesh = new THREE.Mesh(publicEyeGeometry1, whiteMaterial);
					publicEye1Mesh.position.set(-s/2, -0.8*s, 0);

					var publicEye2Mesh = new THREE.Mesh(publicEyeGeometry1, whiteMaterial);
					publicEye2Mesh.position.set(s/2, -0.8*s, 0);

					var publicEyeGeometry2 = new THREE.SphereGeometry(s/4);

					var publicEyeBlack1Mesh = new THREE.Mesh(publicEyeGeometry2, blackMaterial);
					publicEyeBlack1Mesh.position.set(0, -0.12*s, 0);

					var publicEyeBlack2Mesh = new THREE.Mesh(publicEyeGeometry2, blackMaterial);
					publicEyeBlack2Mesh.position.set(0, -0.12*s, 0);

					publicEye1Mesh.add(publicEyeBlack1Mesh);
					publicHeadMesh.add(publicEye1Mesh);

					publicEye2Mesh.add(publicEyeBlack2Mesh);
					publicHeadMesh.add(publicEye2Mesh);
				}
	
				// 10% chance : hat
				if(Math.random()<0.1){
					var hatBotGeometry = new THREE.CylinderGeometry(1.2*s, 1.2*s, s/4, 12);
					var hatBotMesh = new THREE.Mesh(hatBotGeometry, hatMaterial);
					hatBotMesh.position.set(0, 0, 0.8*s);
					hatBotMesh.rotateX(Math.PI/2);
					publicHeadMesh.add(hatBotMesh);

					var hatTopGeometry = new THREE.CylinderGeometry(s*2/3, s*2/3, s);
					var hatTopMesh = new THREE.Mesh(hatTopGeometry, hatMaterial);
					hatTopMesh.position.set(0, 0, s);
					hatTopMesh.rotateX(Math.PI/2);
					publicHeadMesh.add(hatTopMesh);
				}

				publicHeadMesh.up.set(0, 0, 1);

				gameScene.add(publicHeadMesh);

				var public = {mesh: publicMesh, headMesh: publicHeadMesh, row: i/4, col: j, height: h, initial: publicMesh.position.z};
				
				publicMeshes.push(public);

				gameScene.add(publicMesh);
			}
		}
	}
}

function addPoint(player){
	if(player===1)
		setScore(1, p1Score.value+1);

	else if(player==2)
		setScore(2, p2Score.value+1);
}

function setScore(player, score){
	if(player===1)
		p1Score.value=score;

	else if(player==2)
		p2Score.value=score;

	setScoreMesh(player);
}

function setScoreMesh(player){
	var score = player==1? p1Score: player==2? p2Score: null;
	if(score==null)
		return;

	gameScene.remove(score.mesh);

	loader.load('src/fonts/gentilis_regular.typeface.json', function(font){
		var scoreMaterial = player==1? new THREE.MeshPhongMaterial({color: 0x00C040}): new THREE.MeshPhongMaterial({color: 0xC00040});

		var scoreGeometry = new THREE.TextGeometry(score.value, {font: font, size: 5, height: 0.2});
		scoreGeometry.computeBoundingBox();

		score.mesh = new THREE.Mesh(scoreGeometry, scoreMaterial);
		score.mesh.rotateX(Math.PI/2);

		var box = new THREE.Box3().setFromObject(score.mesh);

		score.mesh.position.set((player==1? -10: 37)-0.5*box.getSize().x, 4, 27-0.5*box.getSize().z);
		gameScene.add(score.mesh);

		if(score.value==maxScore-1)
			score.mesh.material.color.setHex(0xb3b3b3);

		else if( maxScore!=0 && score.value>=maxScore )
			score.mesh.material.color.setHex(0xcc9900);
	});
}

function nextLevel(){
	// Score
	setScore(1, 0);
	setScore(2, 0);

	// Level
	setLevel(level+1);

	// Public
	for(var i=0; i<publicMeshes.length; i++)
		publicMeshes[i].headMesh.rotation.set(0, 0, 0);

	// Bars
	p1Bar.position.set(6, 0, 3);
	p2Bar.position.set(21, 0, 3);
	p1BarSpeed = 0;
	p2BarSpeed = 0;

	// Bricks
	reloadBricks();

	// Ball(s)
    ball.position.set(13.5, 0, 16);
	ballSpeed = {x:- 0.15, z:-0.2, xmin: 0.05, xmax: 0.75, zmin: 0.05, zmax: 0.5};
    for(var i=0; i<3; i++)
    	smallBalls[i].position.set(ball.position.x, ball.position.y, ball.position.z);

	// Reset god mode
	godMode.p1=false;
	p1Bar.material.color.setHex(0x00C040);

	godMode.p2=false;
	p2Bar.material.color.setHex(0xC00040);

    // P2
	loadPlayer2(true);

	// UI
	document.getElementById("title").style.visibility = "hidden";
	document.getElementById("nextLevel").style.visibility = "hidden";
	//document.getElementById("next").disabled = true;
	//document.getElementById("exitNext").disabled = true;

    // Go
    gameState = state.wait;
}

function setLevel(lvl){
	if(lvl<0){
    	console.log("ERROR");
    	return;
    }

    level = lvl;

    gameScene.remove(levelMesh);
    if(level!=0){
		loader.load('src/fonts/gentilis_regular.typeface.json', function(font){
			var levelGeometry = new THREE.TextGeometry(level, {font: font, size: 3, height: 0.2});
			levelGeometry.computeBoundingBox();

			levelMesh = new THREE.Mesh(levelGeometry, blackMaterial.clone());
			levelMesh.rotateX(Math.PI/2);

			var box = new THREE.Box3().setFromObject(levelMesh);

			levelMesh.position.set(13.2-box.getSize().x/2, -0.5, 7-box.getSize().z/2);
			gameScene.add(levelMesh);

			if(level>=maxLevel)
				levelMesh.material.color.setHex(0xcc9900);
		});
    }

    // Create shields
    nbShields = (level==0)? 3: 2*level-1;
    loadShields();
}

function launchGame(vsHuman, max, story){
    if( (vsHuman===true || vsHuman===false) && (story===true || story===false) && max>=0 )
    	player2 = vsHuman;
    else{
    	console.log("ERROR");
    	return;
    }

    // VS P2
    if(player2){
    	maxScore = max;
    	setLevel(0);

	// History mode
    }else if(story){
		maxScore = max;
		if(maxScore<=0)
			maxScore = 3;
    	setLevel(1);

	// VS AI
    }else{
		maxScore = max;
    	setLevel(0);
	}

	// Reset god mode
	godMode.p1=false;
	p1Bar.material.color.setHex(0x00C040);

	godMode.p2=false;
	p2Bar.material.color.setHex(0xC00040);

    // P2/AI Stickman/Satan
	loadPlayer2(true);

	// Ball(s)
    ball.position.set(13.5, 0, 16);
	normalCamera.lookAt(ball.position);
 	ball.position.set(p1Bar.position.x, 0, p1Bar.position.z+1);

 	// UI
    document.getElementById("title").style.visibility = "hidden";
    document.getElementById("mainMenu").style.visibility = "hidden";
    //document.getElementById("launchStory").disabled = true;
    //document.getElementById("launchAI").disabled = true;
    //document.getElementById("changeAI").disabled = true;
    //document.getElementById("launch2P").disabled = true;
    //document.getElementById("change2P").disabled = true;
    //document.getElementById("help").disabled = true;

    // Music
	if(bgm.playing())
		bgm.stop();
    bgm.loop(true);
    bgm.play();

    // Go
    gameState = state.play;
}

function loadPlayer2(inGame){
	gameScene.remove(p2Mesh.body);
	gameScene.remove(p2Mesh.head);

	// Real P2 ou AI
	if(inGame){
		// stickman : vs Player 2
	 	if(player2){
	 		var p2Material = new THREE.MeshPhongMaterial({color: 0xC00040});

		 	var p2Geometry = new THREE.CylinderGeometry(3, 3, 12, 16);
			p2Mesh.body = new THREE.Mesh(p2Geometry, p2Material);
			p2Mesh.body.position.set(37, 4, 7);
			p2Mesh.body.rotateX(Math.PI/2);

			var p2HeadGeometry = new THREE.SphereGeometry(4, 20, 15);
			p2Mesh.head = new THREE.Mesh(p2HeadGeometry, p2Material);
			p2Mesh.head.position.set(37, 4, 18);

			var p2GlassesGeometry = new THREE.BoxGeometry(2, 0.5, 1.25);

			var p2Glasses1Mesh = new THREE.Mesh(p2GlassesGeometry, darkRedMaterial);
			p2Glasses1Mesh.position.set(-2, -4, 0);
			p2Mesh.head.add(p2Glasses1Mesh);

			var p2Glasses2Mesh = new THREE.Mesh(p2GlassesGeometry, darkRedMaterial);
			p2Glasses2Mesh.position.set(2, -4, 0);
			p2Mesh.head.add(p2Glasses2Mesh);

			var p2GlassesFrameGeometry = new THREE.BoxGeometry(2.7, 0.48, 1.7);

			var p2GlassesFrame1Mesh = new THREE.Mesh(p2GlassesFrameGeometry, blackMaterial);
			p2GlassesFrame1Mesh.position.set(-2, -4, 0);
			p2Mesh.head.add(p2GlassesFrame1Mesh);	

			var p2GlassesFrame2Mesh = new THREE.Mesh(p2GlassesFrameGeometry, blackMaterial);
			p2GlassesFrame2Mesh.position.set(2, -4, 0);
			p2Mesh.head.add(p2GlassesFrame2Mesh);

			var p2GlassesFrameLinkGeometry = new THREE.BoxGeometry(1.3, 0.48, 0.7);
			var p2GlassesFrameLinkMesh = new THREE.Mesh(p2GlassesFrameLinkGeometry, blackMaterial);
			p2GlassesFrameLinkMesh.position.set(0, -4, 0.5);
			p2Mesh.head.add(p2GlassesFrameLinkMesh);

			p2Mesh.head.up.set(0, 0, 1);
			p2Mesh.head.lookAt(normalCamera.position);
			p2Mesh.head.rotateX(-Math.PI/2);
			gameScene.add(p2Mesh.head);

			gameScene.add(p2Mesh.body);

		// Imp : story mode lvl 1-2 and vs AI (75%)
	 	}else if( level==1 || level==2 || (level==0 && Math.random()<2/3) ){
	 		var p2Material = new THREE.MeshPhongMaterial({color: 0xBF0000});

		 	var p2Geometry = new THREE.CylinderGeometry(3, 3, 12, 16);
			p2Mesh.body = new THREE.Mesh(p2Geometry, p2Material);
			p2Mesh.body.position.set(37, 4, 7);
			p2Mesh.body.rotateX(Math.PI/2);

			var p2HeadGeometry = new THREE.SphereGeometry(4, 20, 15);
			p2Mesh.head = new THREE.Mesh(p2HeadGeometry, p2Material);
			p2Mesh.head.position.set(37, 4, 18);

			var p2EyesGeometry = new THREE.BoxGeometry(0.5, 0.48, 1.5);

			var p2Eyes1Mesh = new THREE.Mesh(p2EyesGeometry, blackMaterial);
			p2Eyes1Mesh.position.set(-2, -4, 0);
			p2Mesh.head.add(p2Eyes1Mesh);

			var p2Eyes2Mesh = new THREE.Mesh(p2EyesGeometry, blackMaterial);
			p2Eyes2Mesh.position.set(2, -4, 0);
			p2Mesh.head.add(p2Eyes2Mesh);

			var p2EyebrowsGeometry = new THREE.BoxGeometry(2.5, 0.5, 0.5);

			var p2Eyebrows1Mesh = new THREE.Mesh(p2EyebrowsGeometry, blackMaterial);
			p2Eyebrows1Mesh.position.set(-2, -4, 0.6);
			p2Eyebrows1Mesh.rotateY(Math.PI/8);
			p2Mesh.head.add(p2Eyebrows1Mesh);

			var p2Eyebrows2Mesh = new THREE.Mesh(p2EyebrowsGeometry, blackMaterial);
			p2Eyebrows2Mesh.position.set(2, -4, 0.6);
			p2Eyebrows2Mesh.rotateY(-Math.PI/8);
			p2Mesh.head.add(p2Eyebrows2Mesh);

			var p2HornsGeometry = new THREE.ConeGeometry(1, 3);

			var p2Horns1Mesh = new THREE.Mesh(p2HornsGeometry, redMaterial);
			p2Horns1Mesh.rotateX(Math.PI/2);
			p2Horns1Mesh.rotateZ(Math.PI/6);
			p2Horns1Mesh.position.set(-3, 0, 4);
			p2Mesh.head.add(p2Horns1Mesh);

			var p2Horns2Mesh = new THREE.Mesh(p2HornsGeometry, redMaterial);
			p2Horns2Mesh.rotateX(Math.PI/2);
			p2Horns2Mesh.rotateZ(-Math.PI/6);
			p2Horns2Mesh.position.set(3, 0, 4);
			p2Mesh.head.add(p2Horns2Mesh);

			p2Mesh.head.up.set(0, 0, 1);
			p2Mesh.head.lookAt(normalCamera.position);
			p2Mesh.head.rotateX(-Math.PI/2);
			gameScene.add(p2Mesh.head);

			gameScene.add(p2Mesh.body);

			// Imp size
			var scale = 1;
			if(level==1){
				scale = 2/3;

			}else if(level==2){
				scale = 3/4;

			}else if(level==0){
				scale = 0.5+0.5*Math.random();
			}
			p2Mesh.body.scale.set(scale*3/4, scale, scale*3/4);
			p2Mesh.body.position.z = 1+(p2Mesh.body.position.z-1)*scale;
			p2Mesh.head.scale.set(scale, scale, scale);
			p2Mesh.head.position.z = 1+(p2Mesh.head.position.z-1)*scale;
	 	
	 	// Boss : story mode lvl 3 and vs AI (25%)
	 	}else{
	 		var p2Material = new THREE.MeshPhongMaterial({color: 0xBF0000});

		 	var p2Geometry = new THREE.CylinderGeometry(3, 3, 12, 16);
			p2Mesh.body = new THREE.Mesh(p2Geometry, p2Material);
			p2Mesh.body.position.set(37, 4, 7);
			p2Mesh.body.rotateX(Math.PI/2);

			var p2HeadGeometry = new THREE.SphereGeometry(4, 20, 15);
			p2Mesh.head = new THREE.Mesh(p2HeadGeometry, p2Material);
			p2Mesh.head.position.set(37, 4, 18);

			var p2EyesGeometry = new THREE.SphereGeometry(.5, 12, 9);

			var p2Eyes1Mesh = new THREE.Mesh(p2EyesGeometry, blackMaterial);
			p2Eyes1Mesh.position.set(-1.5, -4, 0);
			p2Eyes1Mesh.scale.set(1, 1, 2);
			p2Mesh.head.add(p2Eyes1Mesh);

			var p2Eyes2Mesh = new THREE.Mesh(p2EyesGeometry, blackMaterial);
			p2Eyes2Mesh.position.set(1.5, -4, 0);
			p2Eyes2Mesh.scale.set(1, 1, 2);
			p2Mesh.head.add(p2Eyes2Mesh);

			var p2EyebrowsGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);

			var p2Eyebrows1Mesh = new THREE.Mesh(p2EyebrowsGeometry, blackMaterial);
			p2Eyebrows1Mesh.position.set(-1.5, -4, 1);
			p2Eyebrows1Mesh.rotateY(Math.PI/8);
			p2Mesh.head.add(p2Eyebrows1Mesh);

			var p2Eyebrows2Mesh = new THREE.Mesh(p2EyebrowsGeometry, blackMaterial);
			p2Eyebrows2Mesh.position.set(1.5, -4, 1);
			p2Eyebrows2Mesh.rotateY(-Math.PI/8);
			p2Mesh.head.add(p2Eyebrows2Mesh);

			var p2Mouth1Geometry = new THREE.BoxGeometry(0.3, 0.3, 0.4);

			var p2MouthMesh = new THREE.Mesh(p2Mouth1Geometry, blackMaterial);
			p2MouthMesh.position.set(0, -4, -3);
			p2Mesh.head.add(p2MouthMesh);

			var p2Mouth2Geometry = new THREE.BoxGeometry(1, 0.3, 0.3);

			var p2Mouth1Mesh = new THREE.Mesh(p2Mouth2Geometry, blackMaterial);
			p2Mouth1Mesh.position.set(-0.8, -4, -2);
			p2Mouth1Mesh.rotateY(-Math.PI/9);
			p2Mesh.head.add(p2Mouth1Mesh);

			var p2Mouth2Mesh = new THREE.Mesh(p2Mouth2Geometry, blackMaterial);
			p2Mouth2Mesh.position.set(0.8, -4, -2);
			p2Mouth2Mesh.rotateY(Math.PI/9);
			p2Mesh.head.add(p2Mouth2Mesh);

			var p2HornsGeometry = new THREE.ConeGeometry(0.67, 4.5);

			var p2Horns1Mesh = new THREE.Mesh(p2HornsGeometry, darkRedMaterial);
			p2Horns1Mesh.rotateX(Math.PI/2);
			p2Horns1Mesh.rotateX(Math.PI/8);
			p2Horns1Mesh.rotateZ(Math.PI/8);
			p2Horns1Mesh.position.set(-3, -2, 5);
			p2Mesh.head.add(p2Horns1Mesh);

			var p2Horns2Mesh = new THREE.Mesh(p2HornsGeometry, darkRedMaterial);
			p2Horns2Mesh.rotateX(Math.PI/2);
			p2Horns2Mesh.rotateX(Math.PI/8);
			p2Horns2Mesh.rotateZ(-Math.PI/8);
			p2Horns2Mesh.position.set(3, -2, 5);
			p2Mesh.head.add(p2Horns2Mesh);

			p2Mesh.head.up.set(0, 0, 1);
			p2Mesh.head.lookAt(normalCamera.position);
			p2Mesh.head.rotateX(-Math.PI/2);
			gameScene.add(p2Mesh.head);

			gameScene.add(p2Mesh.body);
	 	}

 	// Unknown player 2
	}else{
		loader.load('src/fonts/gentilis_regular.typeface.json', function(font){
			var p2Geometry = new THREE.TextGeometry("?", {font: font, size: 20, height: 0.2});
			p2Geometry.computeBoundingBox();

			p2Mesh.body = new THREE.Mesh(p2Geometry, redMaterial.clone());
			p2Mesh.body.rotateX(Math.PI/2);
			p2Mesh.head = null;

			var box = new THREE.Box3().setFromObject(p2Mesh.body);

			p2Mesh.body.position.set(37-0.5*box.getSize().x, 4, 12-0.5*box.getSize().z);
			gameScene.add(p2Mesh.body);
		});
	}
}

function quitGame(){
    document.getElementById("title").style.visibility = "visible";
	document.getElementById("pauseMenu").style.visibility = "hidden";
    //document.getElementById("closeHelp").disabled = true;
	document.getElementById("p1Victory").style.visibility = "hidden";
    //document.getElementById("exitVictory1").disabled = true;
	document.getElementById("p2Victory").style.visibility = "hidden";
    //document.getElementById("exitVictory2").disabled = true;
	document.getElementById("victory").style.visibility = "hidden";
    //document.getElementById("exitVictory").disabled = true;
	document.getElementById("defeat").style.visibility = "hidden";
    //document.getElementById("exitDefeat").disabled = true;
	document.getElementById("nextLevel").style.visibility = "hidden";
    //document.getElementById("next").disabled = true;
    //document.getElementById("exitNext").disabled = true;
    document.getElementById("mainMenu").style.visibility = "visible";
    //document.getElementById("launchStory").disabled = false;
    //document.getElementById("launchAI").disabled = false;
    //document.getElementById("changeAI").disabled = false;
    //document.getElementById("launch2P").disabled = false;
    //document.getElementById("change2P").disabled = false;
    //document.getElementById("help").disabled = false;

    gameState = state.menu;
    bgm.stop();

    nbShields = 1;
	reloadGame();
}

function reloadGame(){
	// Camera
	currentCamera = normalCamera;

	// P2
	loadPlayer2(false);

	// Score
	setScore(1, 0);
	setScore(2, 0);
	maxScore = 3;

	// Level
	setLevel(0);

	// Public
	for(var i=0; i<publicMeshes.length; i++)
		publicMeshes[i].headMesh.rotation.set(0, 0, 0);

	// Bars
	p1Bar.position.set(6, 0, 3);
	p2Bar.position.set(21, 0, 3);
	p1BarSpeed = 0;
	p2BarSpeed = 0;

	// Shields
	loadShields();

	// Bricks
	reloadBricks();

	// Ball(s)
    ball.position.set(13.5, 0, 16);
	ballSpeed = {x:- 0.15, z:-0.2, xmin: 0.05, xmax: 0.75, zmin: 0.05, zmax: 0.5};
    for(var i=0; i<3; i++)
    	smallBalls[i].position.set(ball.position.x, ball.position.y, ball.position.z);
}

function pauseGame(){
	gameState = state.pause;
    document.getElementById("title").style.visibility = "visible";
	document.getElementById("pauseMenu").style.visibility = "visible";
	//document.getElementById("unpause").disabled  = false;
	//document.getElementById("exitPause").disabled  = false;
	console.log("--- pause ---");
}

function unpauseGame(){
	gameState = state.play;
	document.getElementById("title").style.visibility = "hidden";
	document.getElementById("pauseMenu").style.visibility = "hidden";
	//document.getElementById("unpause").disabled  = true;
	//document.getElementById("exitPause").disabled  = true;
	console.log("--- go ------");
}

function showHelp(){
	if(gameState==state.play)
		gameState = state.pause;

	document.getElementById("title").style.visibility = "visible";
	document.getElementById("mainMenu").style.visibility = "hidden";
    //document.getElementById("launchStory").disabled = true;
    //document.getElementById("launchAI").disabled = true;
    //document.getElementById("changeAI").disabled = true;
    //document.getElementById("launch2P").disabled = true;
    //document.getElementById("change2P").disabled = true;
    //document.getElementById("help").disabled = true;
	document.getElementById("helpMenu").style.visibility = "visible";
    //document.getElementById("closeHelp").disabled = false;
}

function closeHelp(){
	if(gameState==state.pause){
		gameState = state.play;
		document.getElementById("title").style.visibility = "hidden";
	}else if(gameState==state.menu){
		document.getElementById("mainMenu").style.visibility = "visible";
	    //document.getElementById("launchStory").disabled = false;
	    //document.getElementById("launchAI").disabled = false;
	    //document.getElementById("changeAI").disabled = false;
	    //document.getElementById("launch2P").disabled = false;
	    //document.getElementById("change2P").disabled = false;
	    //document.getElementById("help").disabled = false;
	}
	document.getElementById("helpMenu").style.visibility = "hidden";
    //document.getElementById("closeHelp").disabled = true;
}

function changeMaxScore(nbPlayers){
	// VS AI
	if(nbPlayers==1){
		var button = document.getElementById("changeAI");

		if(button==null)
			return;

		if(button.firstChild.data=="3"){
			button.firstChild.data = "5";
			document.getElementById("launchAI").onclick = function(){launchGame(false, 5, false);};

		}else if(button.firstChild.data=="5"){
			button.firstChild.data = "10";
			document.getElementById("launchAI").onclick = function(){launchGame(false, 10, false);};

		}else if(button.firstChild.data=="10"){
			button.firstChild.data = "\u221E";
			document.getElementById("launchAI").onclick = function(){launchGame(false, 0, false);};

		}else if(button.firstChild.data=="\u221E"){
			button.firstChild.data = "3";
			document.getElementById("launchAI").onclick = function(){launchGame(false, 3, false);};
		}

	// VS player
	}else if(nbPlayers==2){
		var button = document.getElementById("change2P");

		if(button==null)
			return;

		if(button.firstChild.data=="3"){
			button.firstChild.data = "5";
			document.getElementById("launch2P").onclick = function(){launchGame(true, 5, false);};

		}else if(button.firstChild.data=="5"){
			button.firstChild.data = "10";
			document.getElementById("launch2P").onclick = function(){launchGame(true, 10, false);};

		}else if(button.firstChild.data=="10"){
			button.firstChild.data = "\u221E";
			document.getElementById("launch2P").onclick = function(){launchGame(true, 0, false);};

		}else if(button.firstChild.data=="\u221E"){
			button.firstChild.data = "3";
			document.getElementById("launch2P").onclick = function(){launchGame(true, 3, false);};
		}
	}
}

function musicVolume(){
	var button = document.getElementById("bgmVolume");

	if(button==null)
		return;

	if(button.firstChild.data=="Musique 100%"){
		button.firstChild.data = "Musique 50%";
		bgm.volume(.5);
		bgm.mute(false);

	}else if(button.firstChild.data=="Musique 50%"){
		button.firstChild.data = "Musique 0%";
		bgm.volume(1);
		bgm.mute(true);

	}else if(button.firstChild.data=="Musique 0%"){
		button.firstChild.data = "Musique 100%";
		bgm.volume(1);
		bgm.mute(false);

	}
}

function soundVolume(){
	var button = document.getElementById("sfxVolume");

	if(button==null)
		return;

	if(button.firstChild.data=="Sons 100%"){
		button.firstChild.data = "Sons 50%";
		hitWall.volume(.5);
		hitWall.mute(false);
		hitPaddle.volume(.5);
		hitPaddle.mute(false);

	}else if(button.firstChild.data=="Sons 50%"){
		button.firstChild.data = "Sons 0%";
		hitWall.volume(1);
		hitWall.mute(true);
		hitPaddle.volume(1);
		hitPaddle.mute(true);

	}else if(button.firstChild.data=="Sons 0%"){
		button.firstChild.data = "Sons 100%";
		hitWall.volume(1);
		hitWall.mute(false);
		hitPaddle.volume(1);
		hitPaddle.mute(false);

	}
}

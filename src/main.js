var realScene = new THREE.Scene();
realScene.background = new THREE.Color( 0xaaaaaa );
scene = new THREE.Group();
realScene.add(scene);

// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 500 );

var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let curCubeColor = Math.floor(Math.random() * 360);
var geometry = new THREE.BoxGeometry( 500, 1400, 500 );
var material = new THREE.MeshLambertMaterial( { color: new THREE.Color("hsl(" + curCubeColor + ", 55%, 50%)") } );
var cube = new THREE.Mesh( geometry, material );
cube.position.y = -800;
let lastCube = cube;
let curCube = null;
// hsl的第一个参数
scene.add( cube );

hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.34 )
hemiLight.position.set( 0, 2000, 0 );
scene.add( hemiLight );
hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
scene.add( hemiLightHelper );

camera.position.z = 750;
camera.position.x = 750;
camera.position.y = 1000;
camera.lookAt(0,0,0);

let raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onTouchStart( event, a) {

	let touchEvent = event.touches[0];

	mouse.x = ( touchEvent.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( touchEvent.clientY / window.innerHeight ) * 2 + 1;

	triggerTouchStart();

}

function triggerTouchStart(){
		// update the picking ray with the camera and mouse position
	fixCube();
	if(true){
		return;
	}
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( [realScene], true );

	console.log(intersects, scene.children);

	for ( var i = 0; i < intersects.length; i++ ) {

		console.log(intersects[i]);

	}
}

window.addEventListener( 'touchstart', onTouchStart, false );

let floor = -1;
const CUBE_DEPTH = 500;
const CUBE_WIDTH = 500;
const CUBE_HEIGHT = 100;
const SPEED = 500;
const MOVE_LENGTH = 1.2 * CUBE_WIDTH;
let speedRate = 1.0;
let forward = 1;

function createNewCube(){
	floor++;
	let params = lastCube.geometry.parameters;
	console.log("param = ", params);
	curCubeColor = (curCubeColor + 10) % 360;
	let geometry = new THREE.BoxGeometry( params.width, CUBE_HEIGHT, params.depth );
	let material = new THREE.MeshLambertMaterial( { color: new THREE.Color("hsl(" + curCubeColor + ", 65%, 50%)") } );
	let cube = new THREE.Mesh( geometry, material );
	cube.userData = {remove: false};
	cube.position.y = -100 + (floor + 0.5) * CUBE_HEIGHT;
	if(floor % 2 == 0){
		cube.position.x = -MOVE_LENGTH;
		cube.position.z = lastCube.position.z;
	}
	else{
		cube.position.z = -MOVE_LENGTH;
		cube.position.x = lastCube.position.x;
	}
	scene.add( cube );

	let cubeMove = function(timestamp){
		// console.log(delta);
		if(cube.userData.remove){
			return ;
		}
		requestAnimationFrame(cubeMove);
		if(!cube.userData.lastTime){
			cube.userData.lastTime = timestamp;
			return;
		}
		let delta = (timestamp - cube.userData.lastTime) / 1000;
		// console.log(delta);
		cube.userData.lastTime = timestamp;
		if(floor % 2 == 0){
			let posX = cube.position.x + forward * SPEED * speedRate * delta;
			cube.position.x = limitValue(-MOVE_LENGTH, MOVE_LENGTH, posX);
		}
		else{
			let posZ = cube.position.z = cube.position.z + forward * SPEED * speedRate * delta;	
			cube.position.z = limitValue(-MOVE_LENGTH, MOVE_LENGTH, posZ);
		}
		if(cube.position.x >= MOVE_LENGTH || cube.position.z >= MOVE_LENGTH){
			forward = -1;
		}
		else if(cube.position.x <= -MOVE_LENGTH || cube.position.z <= -MOVE_LENGTH){
			forward = 1;
		}
	}
	curCube = cube;
	cubeMove();
}


/**
 * @param {上一个cube坐标} lastCube 
 * @param {当前移动cube坐标} curCube 
 */
function fixCube(){
	let lastParam =  lastCube.geometry.parameters;
	let lastPos = lastCube.position;
	let curParam = curCube.geometry.parameters;
	let curPos = curCube.position;
	let disX = Math.abs(lastPos.x - curPos.x);
	let disZ = Math.abs(lastPos.z - curPos.z);
	let newWidth = (lastParam.width + curParam.width) / 2 - disX;
	let newDepth = (lastParam.depth + curParam.depth) / 2 - disZ;
	console.log("newWidth = ", newWidth, newDepth);
	if(newWidth <= 0 || newDepth <= 0){
		// todo game over
		return false;
	}
	let newX = (lastPos.x + curPos.x) / 2;
	let newZ = (lastPos.z + curPos.z) / 2;
	curCube.geometry.dispose();
	curCube.geometry = new THREE.BoxGeometry( newWidth, CUBE_HEIGHT, newDepth );
	curCube.userData.remove = true;
	curPos.x = newX;
	curPos.z = newZ;
	lastCube = curCube;

	camera.position.y += CUBE_HEIGHT;

	createNewCube();
	console.log(curCube);
}

function limitValue(minValue, maxValue, value){
	return Math.max(Math.min(value, maxValue), minValue);
}

createNewCube();

var animate = function () {
	requestAnimationFrame( animate );
	renderer.render( realScene, camera );
};

animate();
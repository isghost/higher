var realScene = new THREE.Scene();
realScene.background = new THREE.Color( 0xaaaaaa );
scene = new THREE.Group();
realScene.add(scene);

// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 500 );

var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 10000 );

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 500, 1400, 500 );
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
cube.position.y = -800;
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

let floor = 0;
const CUBE_DEPTH = 500;
const CUBE_WIDTH = 500;
const CUBE_HEIGHT = 100;
const SPEED = 500;
const MOVE_LENGTH = 1.2 * CUBE_WIDTH;
let speedRate = 1.0;
let forward = 1;

function createNewCube(){
	let geometry = new THREE.BoxGeometry( CUBE_WIDTH, CUBE_HEIGHT, CUBE_DEPTH );
	let material = new THREE.MeshLambertMaterial( { color: 0xaaff44 } );
	let cube = new THREE.Mesh( geometry, material );
	cube.userData = {remove: false};
	cube.position.y = -100 + (floor + 0.5) * CUBE_HEIGHT;
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

	cubeMove();
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
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xaaaaaa );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 500 );

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 100, 100, 100 );
var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.34 );
hemiLight.position.set( 0, 150, 0 );
scene.add( hemiLight );
hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
scene.add( hemiLightHelper );

camera.position.z = 150;
camera.position.x = 150;
camera.position.y = 200;
camera.lookAt(0,0,0);

var animate = function () {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();
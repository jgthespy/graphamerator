// Constants
const width = 700;
const height = 700;
const cameraDistance = 30;

// Rendering
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let objectComponents = {
	// Geometries
	objectPlaneGeometry: 	new THREE.PlaneGeometry(2000, 2000),
	nodeGeometry:			new THREE.CircleGeometry(1, 32),
	// Materials
	objectPlaneMaterial:	new THREE.MeshBasicMaterial({color: 0xff0000, visible: false }),
	nodeMaterial:			new THREE.MeshBasicMaterial( {color: 0x000000})	
}

// Interaction
let raycaster = new THREE.Raycaster();
let mouse = {
	position:		new THREE.Vector2(),
	selectedObject: null,
};

// Objects
let graph = new Graph(false);
let nodes = [];
let objectPlane = null;

// Debugging
let debugBox;

function init() {
	// Init scene
	camera.position.z = cameraDistance;
	renderer.setSize(width, height);
	renderer.setClearColor(0xFFFFFF);
	let canvas = document.getElementsByClassName("canvas")[0];
	canvas.style.width = width + "px";
	canvas.style.height = height + "px";
	canvas.appendChild(renderer.domElement);
	 
	// Initialize objects
	debugBox = document.getElementsByClassName("debug-info")[0];
	objectPlane = new THREE.Mesh(objectComponents.objectPlaneGeometry, objectComponents.objectPlaneMaterial);
	scene.add(objectPlane);	

	// Event listeners
	renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
	renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
	renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);

	render();	
}

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	updateDebug();
}

function onDocumentMouseDown(event) {
	event.preventDefault();
	
	raycaster.setFromCamera(mouse.position, camera);
	let intersects = raycaster.intersectObjects(nodes);
	if (intersects.length > 0) {
		mouse.selectedObject = intersects[0].object;
	} else {
		intersects = raycaster.intersectObjects([objectPlane]);
		addNode(intersects[0].point);
	}
}

function onDocumentMouseUp(event) {
	event.preventDefault();
	mouse.selectedObject = null;	
}


function onDocumentMouseMove(event) {
	event.preventDefault();

	mouse.position.x = (event.clientX / width) * 2 - 1
	mouse.position.y = - (event.clientY / height) * 2 + 1;
	
	if (mouse.selectedObject) {
		raycaster.setFromCamera(mouse.position, camera);
		let intersects = raycaster.intersectObjects([objectPlane]);
		mouse.selectedObject.position.copy(intersects[0].point);
	}	
}

function updateDebug() {
	debugBox.innerHTML = "<p>mouse.x: " + mouse.position.x + "</p>";
	debugBox.innerHTML += "<p>mouse.y: " + mouse.position.y + "</p>";
	debugBox.innerHTML += "<p>selected object: " + mouse.selectedObject + "</p>";
	if (mouse.selectedObject) {
		debugBox.innerHTML += "<p>selected object position.x: " + mouse.selectedObject.position.x + "</p>";
		debugBox.innerHTML += "<p>selected object position.y: " + mouse.selectedObject.position.y + "</p>";
		debugBox.innerHTML += "<p>selected object position.z: " + mouse.selectedObject.position.z + "</p>";
	}
}

function addNode(position){
	let newNode = new THREE.Mesh(objectComponents.nodeGeometry, objectComponents.nodeMaterial);
	newNode.position.copy(position);
	nodes.push(newNode);
	scene.add(newNode);
	graph.addNode(true, newNode);
}

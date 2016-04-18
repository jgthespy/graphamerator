class AdjacencyMatrix {  // babbby's first es2015 class
	constructor() {
		this.thingie = 5;
	}
	
	addNode() {
		console.log("Adding node");
	}
	
	addEdge() {
		console.log("Adding edge");
	}
	
	set thing(value) {
		this.thingie = value;
	}
	
	get thing() {
		return this.thingie;
	}
}

class Graph {
	constructor() {
		this.settings = {};
		this.adjacencyMatrix = [];
		this.nodes = [];
		this.edges = [];
	}
	
	addNode(position) {
		var newNode = new Node(this.settings, this.nodes.length, position);
		this.nodes.push(newNode);
		return newNode;
		// Add to adjacencyMatrix
	}
	
	addEdge(startNode, endNode, directed) {
		var newEdge = new Edge(this.settings, this.edges.length, startNode, endNode, directed);
		this.edges.push(newEdge);
		startNode.addEdge(newEdge);
		endNode.addEdge(newEdge);	
		return newEdge;
		// Add to adjacencyMatrix	
	}
	
	print(){
		console.log(this.nodes);
		console.log(this.edges);	
	}
}

class Node {
	constructor (graphSettings, index, position, value) {	
		this.value = value | 0;
		this.edges = [];
		this.graphIndex = index;
	}
	
	addEdge(newEdge) {
		this.edges.push(newEdge);	
	}
	
	getAdjacent() {
		return this.edges[0].getNeighbor(this);
	};
	
	
/*
{
	// Drawspace stuff
	this.drawSpace = {
		position: 		position,
		radius: 		graphSettings.radius,
		color: 			[1.0, 1.0, 1.0, 1.0],
		labelString: 	"",
		labelElement: 	document.createElement("div"),
		
		changePosition: function(newPosition) {
			this.position = newPosition;	
		},
		
		changeColor: function(newColor) {
			this.color = newColor;	
		}
	};

	// WebGL stuff
	this.webgl = {
		positionBuffer: graphSettings.gl.createBuffer(),
		drawStyle: 		graphSettings.gl.TRIANGLE_FAN,
		
		init: function() {
			
		}
	};
	
	this.webgl.init();
}
*/

}

class Edge {
	constructor(graphSettings, index, startNode, endNode, directed){
		this.startNode = startNode;
		this.endNode = endNode;
		this.directed = directed | false;
		this.graphIndex = index;		
	}
	
	getNeighbor(callerNode) {
		if (this.directed) {
			return (callerNode === this.endNode) ? null : this.startNode;
		} else {
			return callerNode === this.startNode ? this.endNode : this.startNode;
		}		
	}
	
/*
{
	// Drawspace stuff
	this.color;
		
	// WebGL stuff
	this.webgl = {
		positionBuffer: graphSettings.gl.createBuffer,
		drawStyle: 		graphSettings.gl.TRIANGLE_STRIP,
		
		init: function() {
			
		}
	};

	this.webgl.init();
}
*/
	
}


function start() {
	let test = new Graph();
	let node1 = test.addNode();
	let node2 = test.addNode();
	test.addEdge(node1, node2, false);
	test.print();
	
	let am = new AdjacencyMatrix();
	am.addNode();
	am.addEdge();
	console.log(am.thing);
	am.thing = 3;
	console.log(am.thing);
}


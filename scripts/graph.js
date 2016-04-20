class AdjacencyMatrix {  
	constructor(directed) {
		this.directed = directed;
		this.matrix = [];
		this.numNodes = 0;
	}
	
	addNode() {
		let newMatrix = [];
		this.numNodes++;
		
		for (let i = 0; i < this.numNodes * this.numNodes; i++) {
			let col = i % this.numNodes;
			let row = Math.floor(i / this.numNodes);
			if (col < this.numNodes - 1 && row < this.numNodes - 1) {
				newMatrix.push(this.matrix[i - row]);
			} else {
				newMatrix.push(0);
			}
		}
		this.matrix = newMatrix;
		return this.numNodes;		
	}
	
	removeNode(node) {
		var newMatrix = [];
		node = Math.floor(node);
		if (node < 0 || node > this.numElements) {
			throw node + " is an invalid vertex";
		} else {
			for (let i = 0; i < this.numNodes * this.numNodes; i++) {
				let col = i % this.numNodes;
				let row = Math.floor(i / this.numNodes);
				if (col != node && row != node) {
					newMatrix.push(this.matrix[i]);
				}
			}
		}
		this.numNodes--;
		this.matrix = newMatrix;		
	}
	
	setEdge(start, end, value) {
		start = Math.floor(start);
		end = Math.floor(end);
		value = value == true ? 1 : 0; 
		if (start > this.numNodes || start < 0) {
			throw start + " is not a valid vertex";
		} else if (end > this.numNodes || end < 0){
			throw end + " is not a valid vertex";
		} else {
			this.matrix[this.numNodes * start + end] = value;
			if (!this.directed) {
				this.matrix[this.numNodes * end + start] = value;
			}
		}
	}
	
	isAdjacent(i, j) {
		return Boolean(this.matrix[this.numNodes * (i - 1) + j - 1]);
	}
	
	print() {
		let nextLine = "%c  ";
		for (let k = 0; k < this.numNodes; k++) {
			nextLine = nextLine + k + " ";
		}
		console.log(nextLine, "color: #AAA");
		for(let i = 0; i < this.numNodes; i++) {
			nextLine = "%c" + i + "%c" + " ";
			for (let j = 0; j < this.numNodes; j++) {
				nextLine = nextLine + this.matrix[this.numNodes * i + j] + " ";
			}
			console.log(nextLine, "color: #AAA", "color: black");
		}
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
	
	let am = new AdjacencyMatrix(false);
	am.addNode(); 
	am.addNode(); 
	am.setEdge(0, 1, 1);
	am.addNode();
	am.removeNode(1);
	am.addNode();
	am.addNode();
	am.addNode();
	am.setEdge(0, 1, 1);
	am.setEdge(1, 2, 1);
	am.setEdge(4, 2, 1);
	am.print();
}


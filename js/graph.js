//  AdjacencyMatrix, Node, and Edge are general classes for graphs

class AdjacencyMatrix {  
	constructor(directed) {
		this.directed = directed || false;
		this.matrix = [];
		this.numNodes = 0;
	}
	
	validateMatrix(matrixToCheck) {
		if (Math.sqrt(matrixToCheck.length) % 1 !== 0) {
			// Want to eventually display this error on the page as well
			console.log("Invalid matrix.  Square matrix required.");
			return false;
		} else {
			matrixToCheck.forEach(function(element) {
				if (element !== 0 && element !== 1) {
					return false;
				}
			});	
		}
		
		return true;
	}
	
	setMatrix(newMatrix, directed) {
		if (this.validateMatrix(newMatrix)) {
			this.directed = directed || false;		
			this.matrix = newMatrix;
			this.numNodes = Math.floor(Math.sqrt(newMatrix.length));
			return true;
		}
		
		return false;	
	}
	
	addNode() {
		let newMatrix = [];
		this.numNodes++;
		
		for (let i = 0; i < this.numNodes * this.numNodes; i++) {
			let row = Math.floor(i / this.numNodes);
			let col = i % this.numNodes;			
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
		let newMatrix = [];
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
		start = (start < 0) ? 0 : Math.floor(start);  
		end = (end < 0) ? 0 : Math.floor(end);
		value = (value < 0) ? 0 : Math.floor(value);		
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
		return Boolean(this.matrix[this.numNodes * i + j]);
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

class Node {
	constructor (index, value) {	
		this.graphIndex = index;
		this.value = value || 0;
		this.edges = [];				
	}
	
	addEdge(newEdge) {
		this.edges.push(newEdge);	
	}
	
	getAdjacent() {
		return this.edges[0].getNeighbor(this);
	};
	
	setValue(newValue) {
		this.value = newValue;
	}
	
	getValue() {
		return this.value;
	}
}

class Edge {
	constructor(index, startNode, endNode, directed){
		this.graphIndex = index;
		this.startNode = startNode;
		this.endNode = endNode;
		this.directed = directed || false;
	}
	
	getNeighbor(callerNode) {
		if (this.directed) {
			return (callerNode === this.endNode) ? null : this.startNode;
		} else {
			return (callerNode === this.startNode) ? this.endNode : this.startNode;
		}	
	}
}


// NodeData and EdgeData contain all relevant data specific to this program for a given node or edge

function NodeData(nodeObject, displayObject, startPosition) {
	this.node = nodeObject;
	this.display = displayObject;
	this.position = startPosition;
}

function EdgeData(edgeObject, displayObject) {
	this.edge = edgeObject;
	this.display = displayObject;
}



// Graph is mostly a general graph class but its nodes and edges are containers for data relevant to this program.
// It shouldn't handle display data directly but it holds display data that can be accessed by the display controller.
// I may end up taking display stuff out of this, but right now it's easier just to keep everything for a given node or edge together.  

class Graph {
	constructor(directed) {
		this.directed = directed || false;
		this.adjacencyMatrix = new AdjacencyMatrix();
		this.nodes = [];
		this.edges = [];
	}
	
	addNode(displayObject) {
		let newNode = new NodeData(
			new Node(this.nodes.length, displayObject)
		); 
		this.nodes.push(newNode);
		this.adjacencyMatrix.addNode();
		return newNode;
	}
	
	addEdge(startNode, endNode, directed, displayObject) {
		let newEdge = new EdgeData(
			new Edge(this.edges.length, startNode, endNode, directed, displayObject)
		);
		this.edges.push(newEdge);
		startNode.addEdge(newEdge);
		endNode.addEdge(newEdge);
		this.adjacencyMatrix.setEdge(startNode, endNode, 1);
	
		return newEdge;
	}
	
	print(){
		console.log(this.nodes);
		console.log(this.edges);
		this.adjacencyMatrix.print();
	}
}


class AdjacencyMatrix {  
	constructor(directed) {
		this.directed = directed || false;
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

class Node {
	constructor (index, value, object) {	
		this.graphIndex = index;
		this.value = value || 0;
		this.displayObject = object || null;
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
	constructor(index, startNode, endNode, directed, object){
		this.graphIndex = index;
		this.startNode = startNode;
		this.endNode = endNode;
		this.directed = directed || false;
		this.displayObject = object;		
	}
	
	getNeighbor(callerNode) {
		if (this.directed) {
			return (callerNode === this.endNode) ? null : this.startNode;
		} else {
			return (callerNode === this.startNode) ? this.endNode : this.startNode;
		}		
	}

}

class Graph {
	constructor(directed) {
		this.directed = directed || false;
		this.adjacencyMatrix = new AdjacencyMatrix(directed);
		this.nodes = [];
		this.edges = [];
	}
	
	addNode(object) {
		var newNode = new Node(this.nodes.length, object);
		this.nodes.push(newNode);
		this.adjacencyMatrix.addNode();
		return newNode;
	}
	
	addEdge(startNode, endNode, directed, object) {
		var newEdge = new Edge(this.edges.length, startNode, endNode, directed, object);
		this.edges.push(newEdge);
		startNode.addEdge(newEdge);
		endNode.addEdge(newEdge);
		this.adjacencyMatrix.setEdge(startNode, endNode, 1);	
		return newEdge;
	}
	
	findNodesByValue(value) {
		let foundNodes = []
		this.nodes.forEach(function (node) {
			if (node.getValue() === value) {
				foundNodes.push(node);
			}
		});
		return foundNodes;
	}
	
	print(){
		console.log(this.nodes);
		console.log(this.edges);	
	}
}


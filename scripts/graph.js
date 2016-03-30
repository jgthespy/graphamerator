function Graph() {
	this.settings = {};
	this.adjacencyMatrix = [];
	this.nodes = [];
	this.edges = [];
	
	this.addNode = function(position){
		this.nodes.push(new Node(this.settings, position));
		// Add to adjacencyMatrix
	};
	
	this.addEdge = function(startNode, endNode, directed) {
		var newEdge = new Edge(this.settings, startNode, endNode, directed);
		this.edges.push(newEdge);
		startNode.addEdge(endNode);
		endNode.addEdge(startNode);	
		
		// Add to adjacencyMatrix	
	};
}

function Node(graphSettings, position, value) {
	// Graph stuff
	this.value = value | 0;
	this.edges = [];
	
/*{
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
}*/
	
	this.addEdge = function (neighbor) {
		this.edges.push(neighbor);	
	};

	this.isAdjacent = function (nodeToCheck) {
		this.edges[0].getAdjacent(this);
	};

}

function Edge(graphSettings, startNode, endNode, directed) {
	// Graph stuff
	this.startNode = startNode;
	this.endNode = endNode;
	this.directed = directed;
	
/*{
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
}*/
	
	
	this.getAdjacent = function(callerNode) {
		if (this.directed) {
			return (callerNode === this.endNode) ? null : this.startNode;
		} else {
			return callerNode === this.startNode ? this.endNode : this.startNode;
		}		
	};
	
}


function start() {
	var test = new Graph();
	test.addNode();
	test.addNode();
	test.addEdge(test.nodes[0], test.nodes[1]);
	console.log(test);
	
	console.log(test.nodes[0].isAdjacent(test.nodes[1]));
}


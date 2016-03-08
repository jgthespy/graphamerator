function createNode(gl, adjacencyMatrix, radius, position, color) {

	var node = {
		type: "node",
		index: adjacencyMatrix.numElements,
		value: adjacencyMatrix.numElements,
		groupNumber: adjacencyMatrix.numElements,
		clean: false,
		positionBuffer: gl.createBuffer(),
		color: color || [1.0, 1.0, 1.0, 1.0],
		numPositionItems: 20,
		drawStyle: gl.TRIANGLE_FAN,
		radius: radius || 20,
		position: position || [0.0, 0.0],
		edges: [],
		label: document.createElement("div"),

		updatePosition: function(newPosition) {
			this.position = newPosition;
			this.edges.forEach(function(edge) {
				edge.updatePosition();
			});
			this.label.style.top = (canvas.height/2) - this.position[1] + "px";
			this.label.style.left = (canvas.width/2) + this.position[0] + "px";
		},

		updateColor: function(newColor) {
			this.color = newColor;
		},

		pointIsInMySpace: function(x, y) {
			return (x >= this.position[0] - this.radius && x <= this.position[0] + this.radius
				&& y >= this.position[1] - this.radius && y <= this.position[1] + this.radius);
		},

		delete: function() {
			this.edges.forEach(function(edge) {
				edge.delete();
			});
			gl.deleteBuffer(this.positionBuffer);
			this.clean = true;
			adjacencyMatrix.removeNode(this.index);
			document.getElementById("draw-space").removeChild(this.label);
		}
	};

	adjacencyMatrix.addNode();

	var vertices = [0.0, 0.0];
	var angleDivision = (node.numPositionItems - 2) / 2;
	for (var i = 0; i < node.numPositionItems - 1; i++) {
		vertices.push(node.radius * Math.cos(i * Math.PI / angleDivision));
		vertices.push(node.radius * Math.sin(i * Math.PI / angleDivision));
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, node.positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	node.label.className = 'node-label';
	node.label.innerHTML = node.value;
	node.label.style.fontSize = node.radius + "px";
	node.label.style.top = (canvas.height/2) - node.position[1] + "px";
	node.label.style.left = (canvas.width/2) + node.position[0] + "px";
	document.getElementById("draw-space").appendChild(node.label);

	return node;
}


function createEdge(gl, adjacencyMatrix, startNode, endNode, color, directed ) {

	var edge = {
		type: "edge",
		clean: false,
		positionBuffer: gl.createBuffer(),
		color: color || [1.0, 1.0, 1.0, 1.0],
		numPositionItems: 10,
		drawStyle: gl.TRIANGLE_STRIP,
		directed: directed || false,
		startNode: startNode,
		endNode: endNode,
		offset: 3,

		updatePosition: function() {
			var start = {
				x: this.startNode.position[0],
				y: this.startNode.position[1]
			};
			var end = {
				x: this.endNode.position[0],
				y: this.endNode.position[1]
			};

			var vertices = [
				// Horizontal
				start.x + this.offset, start.y,
				end.x + this.offset, end.y,
				end.x - this.offset, end.y,
				start.x - this.offset, start.y,
				start.x + this.offset, start.y,

				// Vertical
				start.x, start.y + this.offset,
				end.x, end.y + this.offset,
				end.x, end.y - this.offset,
				start.x, start.y - this.offset,
				start.x, start.y + this.offset

			];

			gl.bindBuffer(gl.ARRAY_BUFFER, edge.positionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		},

		updateColor: function(newColor) {
			this.color = newColor;
		},

		pointIsInMySpace: function(x, y) {
			var slope = (this.endNode.position[1] - this.startNode.position[1]) / (this.endNode.position[0] - this.startNode.position[0]);
			return (y > slope*(x - this.startNode.position[0]) + this.startNode.position[1] - 2*this.offset && y < slope*(x - this.startNode.position[0]) + this.startNode.position[1] + 2*this.offset);
		},

		delete: function() {
			gl.deleteBuffer(this.positionBuffer);
			this.clean = true;
			adjacencyMatrix.removeEdge(this.startNode.index, this.endNode.index);
		}
	};

	adjacencyMatrix.addEdge(edge.startNode.index, edge.endNode.index);

	// Group 
	edge.endNode.groupNumber = edge.startNode.groupNumber;

	edge.updatePosition();

	return edge;
}
function generateNodes() {
	var numberOfNodes = document.getElementById("number-of-nodes").value;
	var currentX = -(canvas.width / 2) + globals.gridSpacing;
	var currentY = (canvas.height / 2) - globals.gridSpacing;
		
	for (var i = 0; i < numberOfNodes; i++) {
		elements.push(createNode(gl, adjacencyMatrix, globals.nodeRadius, [currentX, currentY]));
		currentX += globals.gridSpacing;
		if (currentX > (canvas.width / 2) - globals.gridSpacing) {
			currentX = -(canvas.width / 2) + globals.gridSpacing;
			currentY -= globals.gridSpacing;
		}
	}
	
}


function generateEdges() {
	var generator = document.getElementById("generator").value;
	var nodes = adjacencyMatrix.getNodes();
	
	nodes.forEach(function(element){
		var result = (generator * element.value) % adjacencyMatrix.numNodes;
		var newEdge = createEdge(gl, adjacencyMatrix, element, nodes[result], globals.edgeColors[globals.currentEdgeColor]);
		elements.push(newEdge);
		element.edges.push(newEdge);
		nodes[result].edges.push(newEdge);
	});
	
	globals.nextEdgeColor();
		
}


function inputAdjacencyMatrix() {
	var matrixInput = document.getElementById("adjacency-input-field").value;
	var validatedMatrix = []; 
	
	for (var i = 1, endInput = matrixInput.length; i < endInput; i += 2) {
		if (matrixInput[i] !== "0" && matrixInput[i] !== "1"){
			throw "Invalid input";
		} else {
			validatedMatrix.push(Number(matrixInput[i]));
		}
	}
	
	var numberOfElements = Math.sqrt(validatedMatrix.length);  
	if (numberOfElements % 1 !== 0 || numberOfElements <= 0) {
		throw "Adjacency matrix must be square";
	}
	
	var currentX = -(canvas.width / 2) + globals.gridSpacing;
	var currentY = (canvas.height / 2) - globals.gridSpacing;
	for (var i = 0; i < numberOfElements; i++) {
		elements.push(createNode(gl, adjacencyMatrix, globals.nodeRadius, [currentX, currentY]));
		currentX += globals.gridSpacing;
		if (currentX > (canvas.width / 2) - globals.gridSpacing) {
			currentX = -(canvas.width / 2) + globals.gridSpacing;
			currentY -= globals.gridSpacing;
		}
	}

	for (var i = 0; i < numberOfElements * numberOfElements; i++) {
		if (validatedMatrix[i] == 1) {
			var node1 = elements[Math.floor(i / numberOfElements)];
			var node2 = elements[i % numberOfElements];
			var newEdge = createEdge(gl, adjacencyMatrix, node1, node2, globals.edgeColors[globals.currentEdgeColor]);
			elements.push(newEdge);
			node1.edges.push(newEdge);
			node2.edges.push(newEdge);
		}
	}
	
}


function toggleGrid() {
	globals.lockToGrid = document.getElementById("toggle-grid").checked;
}


function planarizeGraph() {

	var nodes = adjacencyMatrix.getNodes();

	nodes.forEach(function(node){
		console.log(node.groupNumber);
	});
	
}
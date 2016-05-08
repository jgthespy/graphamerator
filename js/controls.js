function printAdjacencyMatrix() {
	graph.adjacencyMatrix.print();
}

function inputAdjacencyMatrix() {
	let adjacencyButton = document.getElementsByName("input-adjacency-button")[0];
	let adjacencyElement = document.getElementsByClassName("adjacency")[0];

	if (getComputedStyle(adjacencyElement).display === "none") {
		adjacencyElement.style.display = "block";
		adjacencyButton.value = "Submit matrix";
	} else {
		//adjacencyElement.style.display = "none";
		adjacencyButton.value = "Input adjacency matrix";
		
		let newMatrix = [];
		let input = document.getElementsByName("adjacency-input")[0].value;
		
		for (let i = 0, end = input.length; i < end; i++ ) {
			let entry = parseInt(input[i]);
			if (entry === 0 || entry === 1){
				newMatrix.push(entry);
			}
		}
		
		if (newMatrix.length > 0) {
			let directed = document.getElementsByName("directed-input")[0].checked;
			graph = new Graph(directed);
			if (graph.adjacencyMatrix.validateMatrix(newMatrix)) {

				let numberOfNodes = Math.floor(Math.sqrt(newMatrix.length));
				// Create the nodes
				for (let i = 0; i < numberOfNodes; i++) {
					graph.addNode();
				}
				// Create the edges
				for (let i = 0; i < numberOfNodes; i++) {
					let row = Math.floor(i / numberOfNodes);
					for (let j = 0; j < numberOfNodes; i++) {
						let col = i % numberOfNodes;
						if (newMatrix[row + col] === 1) {
							graph.addEdge(row, col);
						}
					}
				}
			}
		}				
	} 
}
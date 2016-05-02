function printAdjacencyMatrix() {
	fullGraph.adjacencyMatrix.print();
}

function inputAdjacencyMatrix() {
	let adjacencyButton = document.getElementsByName("input-adjacency-button")[0];
	let adjacencyElement = document.getElementsByClassName("adjacency")[0];

	if (getComputedStyle(adjacencyElement).display === "none") {
		adjacencyElement.style.display = "block";
		adjacencyButton.value = "Submit matrix";
	} else {
		adjacencyElement.style.display = "none";
		adjacencyButton.value = "Input adjacency matrix";
		
		let entries = [];
		let input = document.getElementsByName("adjacency-input")[0].value;
		let currentInputValue = "";
		
		for (let i = 0, end = input.length; i < end; i++ ) {
			if (Number.isSafeInteger(parseInt(input[i]))){
				currentInputValue += input[i];
			} else if (currentInputValue !== "") {
				entries.push(parseInt(currentInputValue));
				currentInputValue = "";
			}
		}		
		if (currentInputValue !== "") {
			entries.push(parseInt(currentInputValue));
		}
		
		if (entries.length > 0) {
			fullGraph.setAdjacencyMatrix(entries);
		}
				
	} 
}
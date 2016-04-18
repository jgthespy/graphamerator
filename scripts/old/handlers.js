function setupMouseHandlers() {
	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	canvas.onmousemove = handleMouseMove;
}


function setupKeyboardHandlers() {
	document.addEventListener('keydown', function(event) {
		if (mouse.selectedNode && !mouse.shiftDown) {
			resetSelectedNode();
		}
		switch (event.keyCode) {
		case 16:
			mouse.shiftDown = true;
			break;
		case 17:
			mouse.ctrlDown = true;
			break;
		case 32: // Space
			event.preventDefault();
			var horizontal = canvas.width / 2;
			var vertical = canvas.height / 2;
			if (mouse.x > -horizontal && mouse.x < horizontal && mouse.y > -vertical && mouse.y <= vertical) {
				elements.push(createNode(gl, adjacencyMatrix, globals.nodeRadius, [mouse.x, mouse.y]));
			}
			break;
		}
	});

	document.addEventListener('keyup', function(event) {
		switch (event.keyCode) {
		case 16: // shift
			mouse.shiftDown = false;
			break;
		case 17: // ctrl
			mouse.ctrlDown = false;
			break;
		}
	});
}


function handleMouseUp(event) {
	mouse.isDown = false;
	if (!mouse.shiftDown) {
		if (mouse.selectedNode) {
			mouse.selectedNode.updateColor([1.0, 1.0, 1.0, 1.0]);
		}
		mouse.selectedNode = null;
	} else {
		if (mouse.selectedNode) {
			var nextNode = getSelectedObject(mouse.x, mouse.y);
			if (nextNode && nextNode != mouse.selectedNode) {
				if (adjacencyMatrix.edgeExists(mouse.selectedNode.index, nextNode.index)) {
					console.log("Edge already exists from " + mouse.selectedNode.index + " to  " + nextNode.index);
				} else {
					var newEdge = createEdge(gl, adjacencyMatrix, mouse.selectedNode, nextNode);
					elements.push(newEdge);
					mouse.selectedNode.edges.push(newEdge);
					nextNode.edges.push(newEdge);
				}
			}
			resetSelectedNode();
		}
	}
}


function handleMouseDown(event) {
	event.preventDefault();

	if (mouse.shiftDown) {  // Create edge
		if (!mouse.selectedNode) {
			mouse.selectedNode = getSelectedObject(mouse.x, mouse.y);
			if (mouse.selectedNode) {
				mouse.selectedNode.updateColor([1.0, 0.5, 0.75, 1.0]);
			}
		}
	} else if (mouse.ctrlDown) { // Delete object
		var selectedIndex = elements.indexOf(getSelectedObject(mouse.x, mouse.y));
		if (selectedIndex >= 0){
			elements[selectedIndex].delete();
			elements = cleanElementArray(elements);
		}
	} else { // Move
		mouse.selectedNode = getSelectedObject(mouse.x, mouse.y);
		if (mouse.selectedNode) {
			mouse.selectedNode.updateColor([0.0, 0.75, 1.0, 1.0]);
		}
	}

	mouse.isDown = true;
}


function handleMouseMove(event) {
	var canvasRect = canvas.getBoundingClientRect();
	mouse.x = event.clientX - canvasRect.left - (canvas.width / 2);
	mouse.y = - (event.clientY - canvasRect.top - (canvas.height / 2));

	if (mouse.isDown && mouse.selectedNode && !mouse.shiftDown && !mouse.ctrlDown ) {
		if (!globals.lockToGrid) {
			mouse.selectedNode.updatePosition([mouse.x, mouse.y]);
		} else {
			mouse.selectedNode.updatePosition(getNearestGridPosition(mouse.x, mouse.y));
		}
	}
}



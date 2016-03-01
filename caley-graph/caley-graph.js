var canvas;
var gl;
var matrixDiv;

var globals = {
    nodeRadius: 15,
    currentEdgeColor: 0,
    gridSpacing: 60,
    lockToGrid: false,
    
    // Edge colors
    edgeColors: [
      [1.0, 0.0, 0.0, 1.0],
      [0.0, 1.0, 0.0, 1.0],
      [0.0, 0.0, 1.0, 1.0],
      [1.0, 1.0, 0.0, 1.0],
      [1.0, 0.0, 1.0, 1.0],
      [0.0, 1.0, 1.0, 1.0],
      [1.0, 1.0, 1.0, 1.0]
    ],
    nextEdgeColor: function(){
      this.currentEdgeColor = (this.currentEdgeColor + 1) % this.edgeColors.length;
     }
    
}

var mouse = {
  isDown: false,
  shiftDown: false,
  ctrlDown: false,
  selectedNode: null,
  x: 0,
  y: 0,
}

var elements = [];

var adjacencyMatrix = {
  data: [],
  numElements: 0,
  numNodes: 0,

  edgeExists: function(node1, node2) {
    if (this.data[node1 * this.numElements + node2] == 1) {
      return true;
    } else {
      return false;
    }
  },

  addNode: function() {
    var newMatrix = [];
    this.numElements++;
    this.numNodes++;

    for (var i = 0; i < this.numElements * this.numElements; i++) {
      if (i % this.numElements < this.numElements - 1 && Math.floor(i / this.numElements) < this.numElements - 1) {
        newMatrix.push(this.data[i - Math.floor(i / this.numElements)]);
      } else {
        newMatrix.push(0);
      }
    }

    this.data = newMatrix;
  },

  removeNode: function(nodeIndex) {
    var newMatrix = [];
    nodeIndex = Math.floor(clamp(nodeIndex, 0, this.numElements));

    for (var i = 0; i < this.numElements * this.numElements; i++) {
      if (i % this.numElements != nodeIndex && Math.floor(i / this.numElements) != nodeIndex) {
        newMatrix.push(this.data[i]);
      }
    }
    elements.forEach(function(element){
      if (element.type == "node" && element.index > nodeIndex) {
        element.index--;
      }
    });

    this.numElements--;

    this.data = newMatrix;
  },

  addEdge: function(node1, node2) {
    node1 = Math.floor(clamp(node1, 0, this.numElements));
    node2 = Math.floor(clamp(node2, 0, this.numElements));

    this.data[this.numElements * node1 + node2] = 1;
    this.data[this.numElements * node2 + node1] = 1;
  },

  removeEdge: function(node1, node2) {
    node1 = Math.floor(clamp(node1, 0, this.numElements));
    node2 = Math.floor(clamp(node2, 0, this.numElements));

    this.data[this.numElements * node1 + node2] = 0;
    this.data[this.numElements * node2 + node1] = 0;
  },
  
  getNodes: function() {
    var nodes = Array(this.numNodes);
  
    elements.forEach(function(element) {
      if (element.type == "node") {
        nodes[element.value] = element;
      }
    });
    
    return nodes;  
  }
    
}

function start() {
  canvas = document.getElementById("canvas");
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  matrixDiv = document.getElementById("adjacency-matrix");

  setupMouseHandlers();
  setupKeyboardHandlers();

  // Initialize stuff
  initWebGL(gl);
  var shaderProgram = initShaderProgram(gl);

  // Draw
  requestAnimationFrame(function(){
    drawScene(gl, shaderProgram)
  });

}


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


function initWebGL(gl){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
}


function initShaderProgram(gl) {
  var shaderProgram = {};

  shaderProgram.translate = [0.0, 0.0];
  shaderProgram.program = createProgramFromScripts(gl, "shader-vs", "shader-fs");
  gl.useProgram(shaderProgram.program);

  // attributes
  shaderProgram.positionAttribute = gl.getAttribLocation(shaderProgram.program, "a_position");
  gl.enableVertexAttribArray(shaderProgram.positionAttribute);

  // uniforms
  shaderProgram.resolutionAttribute = gl.getUniformLocation(shaderProgram.program, "u_resolution");
  gl.uniform2f(shaderProgram.resolutionAttribute, canvas.width / 2, canvas.height / 2);
  shaderProgram.translateUniform = gl.getUniformLocation(shaderProgram.program, "u_translate");
  shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram.program, "u_color");

  return shaderProgram;
}


function setMatrixUniforms(gl, shaderProgram){
  gl.uniform2fv(shaderProgram.translateUniform, shaderProgram.translate);
}


function draw(gl, shaderProgram, elementToDraw){
  shaderProgram.translate = elementToDraw.position || [0.0, 0.0];
  gl.bindBuffer(gl.ARRAY_BUFFER, elementToDraw.positionBuffer);
  gl.vertexAttribPointer(shaderProgram.positionAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.uniform4fv(shaderProgram.colorUniform, elementToDraw.color);
  setMatrixUniforms(gl, shaderProgram);
  gl.drawArrays(elementToDraw.drawStyle, 0, elementToDraw.numPositionItems);
}


function drawScene(gl, shaderProgram){
  gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
  elements.forEach(function(element){
   draw(gl, shaderProgram, element);
  });

  requestAnimationFrame(function(){
  drawScene(gl, shaderProgram, elements)
  });
}


function getSelectedObject(x, y){
  for (var i = 0, end = elements.length; i < end; i++){
    if (elements[i].pointIsInMySpace(x, y)) {
      return elements[i];
    }
  }
  return null;
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


function resetSelectedNode() {
  mouse.selectedNode.updateColor([1.0, 1.0, 1.0, 1.0]);
  mouse.selectedNode = null;
 }


function cleanElementArray(array) {
  var cleanedArray = [];

  array.forEach(function(element) {
    if (!element.clean) {
      cleanedArray.push(element);
    }
  });

  return cleanedArray;
}


function getNearestGridPosition(x, y) {
  if (globals.gridSpacing <= 0) {
    return [x, y];
  } else {
    return [globals.gridSpacing * Math.floor(x / globals.gridSpacing), globals.gridSpacing * Math.floor(y / globals.gridSpacing)];
  }
}


// Controls //

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
    if (matrixInput[i] !== '0' && matrixInput[i] !== '1'){
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
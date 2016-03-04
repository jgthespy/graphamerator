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
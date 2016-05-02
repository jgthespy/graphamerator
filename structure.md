# **_graph.js_**

**class AdjacencyMatrix**  
constructor(directed)  
addNode()  
removeNode(node)  
setEdge(start, end, value)  
isAdjacent(i, j)  
print()  

**class Node**  
constructor (index, value, object)    	
addEdge(newEdge)  
getAdjacent()  
setValue(newValue)  
getValue()  

**class Edge**  
constructor(index, startNode, endNode, directed, object)  
getNeighbor(callerNode)  

**class Graph**  
constructor(directed)  
addNode(object)  
addEdge(startNode, endNode, directed, object)  	
findNodesByValue(value)  
setAdjacencyMatrix(newMatrix)  
print()  


# **_controls.js_**

function printAdjacencyMatrix()  
function inputAdjacencyMatrix()  


# **_main.js_**

function init()  
function render()  
function onDocumentMouseDown(event)  
function onDocumentMouseUp(event)  
function onDocumentMouseMove(event)  
function updateDebug()  
function addNode(position)  
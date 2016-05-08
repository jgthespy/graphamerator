# *graph.js*

**class AdjacencyMatrix**  
constructor()  
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
constructor(index, startNode, endNode, object)  
getNeighbor(callerNode)  

**class Graph**  
constructor()  
addNode(object)  
addEdge(startNode, endNode, object)  	
findNodesByValue(value)  
setAdjacencyMatrix(newMatrix)  
print()  


# *controls.js*

function printAdjacencyMatrix()  
function inputAdjacencyMatrix()  


# *main.js*

function init()  
function render()  
function onDocumentMouseDown(event)  
function onDocumentMouseUp(event)  
function onDocumentMouseMove(event)  
function updateDebug()  
function addNode(position)  
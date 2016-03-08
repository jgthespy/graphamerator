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
		
};

var mouse = {
	isDown: false,
	shiftDown: false,
	ctrlDown: false,
	selectedNode: null,
	x: 0,
	y: 0
};

var elements = [];


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

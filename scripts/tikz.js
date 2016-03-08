function generateTikZ() {
	var nodeString = "";
	var edgeString = "";
	var codeBlock = document.getElementById("tikz-output");
	var colorString = document.getElementById("tikz-color").value;
	var graphWidth = document.getElementById("tikz-width").value;

	var scale = 2 * graphWidth / canvas.width;
	
	elements.forEach(function(element) {
		if (element.type == "node") {
			var i = element.value;
			var x = Math.floor(element.position[0] * scale * 100) / 100;
			var y = Math.floor(element.position[1] * scale * 100) / 100;
			nodeString += "\\node[draw, circle, minimum width=0.7cm](" + i + ") at (" + x + "," + y + ") {$" + i + "$};\n"; 
		} else if (element.type == "edge") {
			edgeString += "\\draw [->, >=latex," + colorString + ",ultra thick] (" + element.startNode.value + ") to (" + element.endNode.value + ");\n";
		}
	});



	codeBlock.innerHTML = "\\[\\begin{tikzpicture}\n" + nodeString + edgeString + "\\end{tikzpicture}\\]";   
}


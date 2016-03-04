function clamp(number, min, max) {
  if (number < min) {
    number = min;
  } else if (number > max) {
    number = max;
  }

  return number;
}


function drawMatrix(div, matrix) {
  var length = matrix.data.length;
  div.innerHTML = "";

  for (i = 0; i < length; i++) {
    if (i % matrix.numElements == 0) {
      div.innerHTML = div.innerHTML + "<p>";
    }
    div.innerHTML = div.innerHTML + matrix.data[i] + "     ";
    if (i % matrix.numElements == matrix.numElements - 1) {
      div.innerHTML = div.innerHTML + "</p>";
    }
  }
}



function getSelectedObject(x, y){
  for (var i = 0, end = elements.length; i < end; i++){
    if (elements[i].pointIsInMySpace(x, y)) {
      return elements[i];
    }
  }
  return null;
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

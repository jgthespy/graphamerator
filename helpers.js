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

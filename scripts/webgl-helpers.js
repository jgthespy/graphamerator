// http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

function compileShader(gl, shaderSource, shaderType) {
    // Create the shader object
    var shader = gl.createShader(shaderType);

    // Set the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Verify that it compiled
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw("Could not compile shader: " + gl.getShaderInfoLog(shader));
    }

    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    // Create a program
    var program = gl.createProgram();

    // Attach the shader
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program
    gl.linkProgram(program);

    // Verify that it linked
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw("Program link failed: " + gl.getProgramInfoLog(program));
    }

    return program;
}

function createShaderFromScript(gl, scriptId, opt_shaderType) {
    // Look up the script tag by id
    var shaderScript = document.getElementById(scriptId);
    if (!shaderScript) {
        throw("Error: Unknown script element " + scriptId);
    }

    // Extract contents of the script tag
    var shaderSource = shaderScript.text;

    // Use type from script tag if not passed a type
    if (!opt_shaderType) {
        if (shaderScript.type == "x-shader/x-vertex") {
            opt_shaderType = gl.VERTEX_SHADER;
        } else if (shaderScript.type == "x-shader/x-fragment") {
            opt_shaderType = gl.FRAGMENT_SHADER;
        } else if (!opt_shaderType) {
            throw("Error: Shader type not set");
        }
    }

    return compileShader(gl, shaderSource, opt_shaderType);
}

function createProgramFromScripts(gl, vertexShaderId, fragmentShaderId) {
    var vertexShader = createShaderFromScript(gl, vertexShaderId);
    var fragmentShader = createShaderFromScript(gl, fragmentShaderId);

    return createProgram(gl, vertexShader, fragmentShader);
}

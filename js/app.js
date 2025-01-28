var vertexShaderText = `
precision mediump float;
attribute vec2 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

void main()
{
    fragColor = vertColor;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}

`

var fragmentShaderText = `
precision mediump float;

varying vec3 fragColor;

void main()
{
    gl_FragColor = vec4(fragColor, 1.0);
}

`

function init_demo() {
    console.log('this is working')

    let canvas = document.getElementById('canvas');
    let gl = canvas.getContext('webgl')

    if (!gl) {
        console.log("WebGL not supported, falling back on experimental WebGL")
        gl = canvas.getContext('experimental-webgl')
    }

    if (!gl) {
        alert("Your Browser does not support WebGL")
    }

    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    //gl.viewport(0, 0, window.innerWidth, window.innerHeight)

    gl.clearColor(0.75, 0.85, 0.8, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR COMPILING VERTEX SHADER: ", gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR COMPILING FRAGMENT SHADER: ", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error("ERROR linking program", gl.getProgramInfoLog(program))
        return
    }

    gl.validateProgram(program)
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error("ERROR Validating program", gl.getProgramInfoLog(program))
        return
    }

     //
     //     Create Buffer
     //

    let triangleVertices = 
    [ // X,   Y         R   G   B
        0.0, 0.5,      1.0, 0,  0,
        -0.5, -0.5,     0, 1.0, 0,
        0.5, -0.5,      0,  0, 1.0
    ]  
    let triangleVertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

    let positionAttriLocation = gl.getAttribLocation(program, 'vertPosition')
    let colorAttriLocation = gl.getAttribLocation(program, 'vertColor')
    gl.vertexAttribPointer(
        positionAttriLocation, // Attribute Location
        2, // Number of elements per attribute
        gl.FLOAT, // type of elements,
        gl.FALSE, 
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual Vertex -> 4
        0 // Offset from the beginning of a single vertex to this attribute
    )
    gl.vertexAttribPointer(
        colorAttriLocation, // Attribute Location
        3, // Number of elements per attribute
        gl.FLOAT, // type of elements,
        gl.FALSE, 
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual Vertex -> 4
        2 * Float32Array.BYTES_PER_ELEMENT,// Offset from the beginning of a single vertex to this attribute
    )

    gl.enableVertexAttribArray(positionAttriLocation)
    gl.enableVertexAttribArray(colorAttriLocation)
    
    //
    // Main render loop
    //
  
    gl.useProgram(program)
    gl.drawArrays(gl.TRIANGLES, 0, 3);

}


init_demo()
var vertexShaderText = `
precision mediump float;
attribute vec3 vertPosition;
attribute vec3 vertColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

varying vec3 fragColor;

void main()
{
    fragColor = vertColor;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
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
    
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.cullFace(gl.Front)

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

    let boxVertices = 
    [ //  X,     Y,    Z        R      G      B
        -1.0,   1.0,  -1.0,     0.50,   0.50,   0.50, // TOP
        -1.0,   1.0,   1.0,     0.50,   0.50,   0.50,
         1.0,   1.0,   1.0,     0.50,   0.50,   0.50,
         1.0,   1.0,  -1.0,     0.50,   0.50,   0.50,
         
        -1.0,   1.0,   1.0,     0.75,   0.25,   0.5, // Left
        -1.0,  -1.0,   1.0,     0.75,   0.25,   0.5,
        -1.0,  -1.0,  -1.0,     0.75,   0.25,   0.5,
        -1.0,   1.0,  -1.0,     0.75,   0.25,   0.5,
        
         1.0,   1.0,   1.0,     0.25,   0.25,   0.75, // Right
         1.0,  -1.0,   1.0,     0.25,   0.25,   0.75,
         1.0,  -1.0,  -1.0,     0.25,   0.25,   0.75,
         1.0,   1.0,  -1.0,     0.25,   0.25,   0.75,
        
         1.0,   1.0,   1.0,     1.00,   0.00,   0.15, // Front
         1.0,  -1.0,   1.0,     1.00,   0.00,   0.15,
        -1.0,  -1.0,   1.0,     1.00,   0.00,   0.15,
        -1.0,   1.0,   1.0,     1.00,   0.00,   0.15,
        
         1.0,   1.0,  -1.0,     1.00,   0.00,   0.15, // Back
         1.0,  -1.0,  -1.0,     1.00,   0.00,   0.15,
        -1.0,  -1.0,  -1.0,     1.00,   0.00,   0.15,
        -1.0,   1.0,  -1.0,     1.00,   0.00,   0.15,

        -1.0,  -1.0,  -1.0,     0.50,   0.50,   1.00, // Bottom
        -1.0,  -1.0,   1.0,     0.50,   0.50,   1.00,
         1.0,  -1.0,   1.0,     0.50,   0.50,   1.00,
         1.0,  -1.0,  -1.0,     0.50,   0.50,   1.00,

    ] 

    let boxIndices = [
        // TOP
        0, 1, 2,
        0, 2, 3,

        // LEFT
        5, 4, 6, 
        6, 4, 7,

        // RIGHT
        8, 9, 10,
        8, 10, 11,

        // FRONT
        13, 12, 14,
        15, 14, 12,

        // BACK
        16, 17, 18,
        16, 18, 19,

        // BOTTOM
        21, 20, 22,
        22, 20, 23
    ]

    let BoxVertexBufferObject = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, BoxVertexBufferObject)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW)

    let BoxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BoxIndexBufferObject)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW)


    let positionAttriLocation = gl.getAttribLocation(program, 'vertPosition')
    let colorAttriLocation = gl.getAttribLocation(program, 'vertColor')
    gl.vertexAttribPointer(
        positionAttriLocation, // Attribute Location
        3, // Number of elements per attribute
        gl.FLOAT, // type of elements,
        gl.FALSE, 
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual Vertex -> 4
        0 // Offset from the beginning of a single vertex to this attribute
    )
    gl.vertexAttribPointer(
        colorAttriLocation, // Attribute Location
        3, // Number of elements per attribute
        gl.FLOAT, // type of elements,
        gl.FALSE, 
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual Vertex -> 4
        3 * Float32Array.BYTES_PER_ELEMENT,// Offset from the beginning of a single vertex to this attribute
    )

    gl.enableVertexAttribArray(positionAttriLocation)
    gl.enableVertexAttribArray(colorAttriLocation)

    // Tell OpenGL which program should be active 
    gl.useProgram(program)

    let matWorldUniformLocation         = gl.getUniformLocation(program, 'mWorld')
    let matViewUniformLocation          = gl.getUniformLocation(program, 'mView')
    let matProjectionUniformLocation    = gl.getUniformLocation(program, 'mProj')

    let worldMatrix         = new Float32Array(16)
    let viewMatrix          = new Float32Array(16)
    let projectionMatrix    = new Float32Array(16)

    glMatrix.mat4.identity(worldMatrix) 
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0])
    glMatrix.mat4.perspective(projectionMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0)

    gl.uniformMatrix4fv(matWorldUniformLocation,        gl.FALSE, worldMatrix)
    gl.uniformMatrix4fv(matViewUniformLocation,         gl.FALSE, viewMatrix)
    gl.uniformMatrix4fv(matProjectionUniformLocation,   gl.FALSE, projectionMatrix)
    
    //
    // Main render loop
    //

    let identityMatrix = new Float32Array(16)
    glMatrix.mat4.identity(identityMatrix)

    let xRotationMatrix = new Float32Array(16)
    let yRotationMatrix = new Float32Array(16)

    function loop() {   // miliseconds / seconds/ 6 seconds/ 1 rotation each 6 seconds
        var angle = performance.now() / 1000 / 6 * 2 * Math.PI
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0])
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0])
        glMatrix.mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix)
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
        
        gl.clearColor(0.75, 0.85, 0.8, 1.0)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
        //gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0)
        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)


}


init_demo()
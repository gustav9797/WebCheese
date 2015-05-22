var canvas;
var gl;
var squareVerticesBuffer;
var squareVerticesColorBuffer;
var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;

//
// start
//
// Called when the canvas is created to get the ball rolling.
// Figuratively, that is. There's nothing moving in this demo.
//
function start() {
  canvas = document.getElementById("glcanvas");

  var glManager = new GLManager(canvas);
  //glManager.initWebGL(canvas);
  //initWebGL(canvas);      // Initialize the GL context
  
  // Only continue if WebGL is available and working
  
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    
    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    
    //initShaders();
    
    // Here's where we call the routine that builds all the objects
    // we'll be drawing.
    
    initBuffers();
    
    // Set up to draw the scene periodically.
    
    setInterval(drawScene, 15);
  }
}



//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// one object -- a simple two-dimensional square.
//
function initBuffers() {
  
  // Create a buffer for the square's vertices.
  
  squareVerticesBuffer = gl.createBuffer();
  
  // Select the squareVerticesBuffer as the one to apply vertex
  // operations to from here out.
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  
  // Now create an array of vertices for the square. Note that the Z
  // coordinate is always 0 here.
  
  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  
  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
  // Now set up the colors for the vertices
  
  var uv = [
    1.0,  1.0,
    -1.0, 1.0,
    1.0,  -1.0,
    -1.0, -1.0
  ];
  
  squareVerticesColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
}

//
// drawScene
//
// Draw the scene.
//
function drawScene() {
  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 640:480, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  
  loadIdentity();
  
  // Now move the drawing position a bit to where we want to start
  // drawing the square.
  
  mvTranslate([-0.0, 0.0, -6.0]);
  
  // Draw the square by binding the array buffer to the square's vertices
  // array, setting attributes, and pushing it to GL.
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
  // Set the colors attribute for the vertices.
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 2, gl.FLOAT, false, 0, 0);
  
  // Draw the square.
  
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


//
// Matrix utility functions
//

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  
  var time = (Date.now()/1000.0)%86400.0;
  var timeUniform = gl.getUniformLocation(shaderProgram, "uTime");
  gl.uniform1f(timeUniform, time);
}
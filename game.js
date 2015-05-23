var canvas;
var gl;
var mvMatrix;
var shaderProgram;
var perspectiveMatrix;
var glManager;
var spriteBatch;


function start() {
	canvas = document.getElementById("glcanvas");
	glManager = new GLManager(canvas);
	spriteBatch = new SpriteBatch();

  if (gl) {
	spriteBatch.init(gl);
    setInterval(drawScene, 15);
  }
}



function drawScene() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
  
  loadIdentity();
  
  mvTranslate([-0.0, 0.0, -3.0]);
  
 
  setMatrixUniforms();
 
  var sprite = new Sprite();
  sprite.pos.x = 0.0;
  spriteBatch.draw(sprite);
  
  spriteBatch.render(gl);
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
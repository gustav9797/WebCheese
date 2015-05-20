var Game = {};
Game.fps = 50;
Game.rectangles = [];

Game.initialize = function() {
  this.entities = [];
  this.context = document.getElementById("viewport").getContext("2d");
};

Game.draw = function() {
	for	(index = 0; index < Game.rectangles.length; index++) {
		Game.drawRect(Game.rectangles[index].x, Game.rectangles[index].y, Game.rectangles[index].width, Game.rectangles[index].height);
	}

};

Game.update = function() {

};

Game.initialize = function() {
	for	(index = 0; index < 20; index++) {
		var rect = {};
		rect.x = index * 80;
		rect.y = 500;
		rect.width = 50;
		rect.height = 50;
		Game.rectangles[index] = rect;
	}
};

Game.run = (function() {
Game.initialize();
var loops = 0, msPerFrame = 1000 / Game.fps,
	maxMsPerFrame = 10,
	nextGameTick = (new Date).getTime();

	return function() {
	  loops = 0;

	  while ((new Date).getTime() > nextGameTick) {
		Game.update();
		nextGameTick += msPerFrame;
		loops++;
	  }
	  Game.draw();
	};
})();

Game.drawRect = function(x, y, width, height) {
	// setup a GLSL program
	var vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
	var fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
	var program = createProgram(gl, [vertexShader, fragmentShader]);
	gl.useProgram(program);
	// look up where the vertex data needs to go.
	var positionLocation = gl.getAttribLocation(program, "a_position");
	
	// Create a buffer and put a single clipspace rectangle in
	// it (2 triangles)
	// set the resolution
	var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
	gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(
		gl.ARRAY_BUFFER, 
		new Float32Array([
			x, y, 
			 x + width, y, 
			x,  y + height, 
			x,  y + height, 
			 x + width, y, 
			 x + width,  y + height]), 
		gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	
	// draw
	gl.drawArrays(gl.TRIANGLES, 0, 6);
};
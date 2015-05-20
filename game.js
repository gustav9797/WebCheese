var Game = {};
	Game.fps = 50;

	Game.initialize = function() {
	  this.entities = [];
	  this.context = document.getElementById("viewport").getContext("2d");
	};

	Game.draw = function() {
		// setup a GLSL program
		var vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
		var fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
		var program = createProgram(gl, [vertexShader, fragmentShader]);
		gl.useProgram(program);
		
		// look up where the vertex data needs to go.
		var positionLocation = gl.getAttribLocation(program, "a_position");
		
		// Create a buffer and put a single clipspace rectangle in
		// it (2 triangles)
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER, 
			new Float32Array([
				-1.0, -1.0, 
				 1.0, -1.0, 
				-1.0,  1.0, 
				-1.0,  1.0, 
				 1.0, -1.0, 
				 1.0,  1.0]), 
			gl.STATIC_DRAW);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
		
		// draw
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	};

	Game.update = function() {

	};

	Game.run = (function() {
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
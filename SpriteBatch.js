var vertexPositionAttribute;
var vertexUVAttribute;

var SpriteBatch = function SpriteBatch(canvas) {
	this.m_sprites = [];
	//this.m_vertexPositionAttribute = -1;
	//this.m_vertexUVAttribute = -1;
	this.m_squareVerticesBuffer = -1;
	this.m_squareVerticesUVBuffer = -1;
}

SpriteBatch.prototype.init = function(gl) {
	this.m_squareVerticesBuffer = gl.createBuffer();
	this.m_squareVerticesUVBuffer = gl.createBuffer();
};

SpriteBatch.prototype.draw = function(sprite) {
	this.m_sprites.push(sprite);
};


SpriteBatch.prototype.render = function(gl) {
  var vertices = [];
  
  var uv = [];
	
	for (var i = 0; i < this.m_sprites.length; ++i) {
		var sprite = this.m_sprites[i];
		
		// TODO: Add sprite.pos and sprite.size 
		// TODO: Add rotations
		var svertices = [
			0.0+1.0,  0.0+1.0,  0.0,
			0.0-1.0, 0.0+1.0,  0.0,
			0.0+1.0,  0.0-1.0, 0.0,
			0.0-1.0, 0.0-1.0, 0.0
		];
		
		var suv = [
			1.0,  1.0,
			-1.0, 1.0,
			1.0,  -1.0,
			-1.0, -1.0
		];
		
		vertices = vertices.concat(svertices);
		uv = uv.concat(suv);
	}
	
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.m_squareVerticesBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
	gl.bindBuffer(gl.ARRAY_BUFFER, this.m_squareVerticesUVBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STREAM_DRAW);
	gl.vertexAttribPointer(vertexUVAttribute, 2, gl.FLOAT, false, 0, 0);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4*this.m_sprites.length);
	
	this.m_sprites = [];
};
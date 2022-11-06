function Vector(x, y, z = 0){
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector.prototype.sum = function(v){
	return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
};

Vector.prototype.subtract = function(v){
	return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
};

Vector.prototype.dotproduct = function(v){
	return this.x * v.x + this.y * v.y + this.z * v.z;
};

Vector.prototype.crossproduct = function(v){
	return new Vector(this.y * v.z - this.z * v.y , this.z * v.x - this.x * v.z , this.x * v.y - this.y * v.x);
};


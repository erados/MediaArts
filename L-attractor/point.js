function Point(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}
Point.prototype.update = function(){

	var dt = 0.01;
	var dx = sigma * (this.y - this.x);
	var dy = this.x * (rho - this.z) - this.y;
	var dz = (this.x * this.y) - (beta * this.z);
	this.x += dx*dt;
	this.y += dy*dt;
	this.z += dz*dt;
};
Point.prototype.draw = function(){
	//ctx.rect(this.x * scale, this.y * scale, size, size);
	ctx.moveTo(this.x * scale, this.y * scale);
	ctx.lineTo(this.x * scale, this.y * scale + size);
};
Point.prototype.rotate = function(axis){
	var x = this.x;
	var y = this.y;
	var z = this.z;
	switch(axis){
		case 'x':
		this.x = rm_x[0][0]*x + rm_x[0][1]*y + rm_x[0][2]*z ;
		this.y = rm_x[1][0]*x + rm_x[1][1]*y + rm_x[1][2]*z ;
		this.z = rm_x[2][0]*x + rm_x[2][1]*y + rm_x[2][2]*z ;
		break;

		case 'y':
		this.x = rm_y[0][0]*x + rm_y[0][1]*y + rm_y[0][2]*z ;
		this.y = rm_y[1][0]*x + rm_y[1][1]*y + rm_y[1][2]*z ;
		this.z = rm_y[2][0]*x + rm_y[2][1]*y + rm_y[2][2]*z ;
		break;
		
		case 'z':
		this.x = rm_z[0][0]*x + rm_z[0][1]*y + rm_z[0][2]*z ;
		this.y = rm_z[1][0]*x + rm_z[1][1]*y + rm_z[1][2]*z ;
		this.z = rm_z[2][0]*x + rm_z[2][1]*y + rm_z[2][2]*z ;
		break;
	}
};

Point.prototype.drawline = function(){
	ctx.moveTo(this.x * scale, this.y * scale);
	ctx.lineTo(-this.x * scale, -this.y * scale);
};
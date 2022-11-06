function Complex(a, b){
	this.a = a;
	this.b = b;
}

Complex.prototype.multiply = function(c){
	return new Complex( this.a * c.a -  this.b * c.b , this.a * c.b + c.a * this.b);		
};

Complex.prototype.add = function(c){
	return new Complex( this.a + c.a , this.b + c.b);		
};

Complex.prototype.clone = function(c){
	return new Complex( this.a, this.b);	
};

Complex.prototype.evaluate = function(c){
	if(Math.abs(this.a + this.b) > critic ) return false;
	else return true;
};

Complex.prototype.sine = function(){
	return new Complex(Math.sin(this.a) * Math.cosh(this.b), Math.cos(this.a) * Math.sinh(this.b)  );
};
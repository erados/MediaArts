function Dot(x, y, z, stuck = false){
	if (x != undefined && y != undefined && z != undefined) {
		this.x = x;
		this.y = y;
		this.z = z;
	}else{
		this.setRanPos();
	}
	this.stuck = stuck ;
	this.radius = 1;
}

Dot.prototype.walk = function(){
	this.setPos((this.x + (Math.random()-0.5)*speed)%width, 
		(this.y + (Math.random()-0.5)*speed)%width, 
		(this.z + (Math.random()-0.5)*speed)%width);
}

Dot.prototype.setRanPos = function(){
	var dice = Math.floor(Math.random()*4);
	var ran1 = Math.floor(Math.random()*width)%width;
	var ran2 = Math.floor(Math.random()*width)%width;
	var ran3 = Math.floor(Math.random()*width)%width;
	this.setPos(ran1, ran2, ran3 );
	// switch(dice){
	// 	case 0: return this.setPos(0, ran1, ran2 ); break;
	// 	case 1: return this.setPos(ran1, 0, ran2 ); break;
	// 	case 2: return this.setPos(ran1, width*0.98, ran2 ); break;
	// 	case 3: return this.setPos(width, ran1, ran2 ); break;
//		case 4: return this.setPos(ran1, ran2, 0 ); break;
//		case 5: return this.setPos(ran1, ran2, width ); break;}
}

Dot.prototype.setPos = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
}

Dot.prototype.chkStuck = function(){
	for(var i = 0; i < tree.length; i++){
		if(distSquare(tree[i], this)<(tree[i].radius+this.radius)*(tree[i].radius+this.radius)){
			this.stuck = true;
			break;
		}
	}
}

function distSquare(a, b){
	return (a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y)
}
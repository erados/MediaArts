function Block(x, y, num, ismine){
	this.x = x;
	this.y = y;
	this.num = (num)? num : 0;
	this.isMine = (ismine)? ismine : false;
	this.open = false;
	this.checked = false;
}
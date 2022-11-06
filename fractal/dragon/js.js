var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth*0.9;
canvas.height = window.innerHeight*0.9;
var width = canvas.width;
var height = canvas.height;
var lines = [0];
var start = {x : width/2, y : height/2};
var end = {x : width/2, y : height/2};
var ctx = canvas.getContext('2d');
var long = 1;
var level = 0;

function update(){
	if(level < 15){
		for(var i = lines.length-1; i >= 0; i--){
			lines.push((lines[i]+3)%4);
		}
		wipe();
		draw();
		level++;
	}
	return;
}

function draw(){
	ctx.beginPath();
	ctx.moveTo(end.x, end.y);
	for(var i = 0; i < lines.length; i++){
		switch(lines[i]){
			case 0 : end.y -= long; break;
			case 1 : end.x += long; break;
			case 2 : end.y += long; break;
			case 3 : end.x -= long; break;
		}
		ctx.lineTo(end.x, end.y);
	}
	ctx.moveTo(start.x, start.y);
	ctx.closePath();
	ctx.stroke();
	end = {x : width/2, y : height/2};
}

function onWheel(e){
	var dy = e.deltaY;
	(dy > 0)? long += 1 : long -= 1;
	if(long < 1) long = 1;
	if(long > 50) long = 50;
	wipe();
	draw();
}

function wipe(){
	ctx.clearRect(0,0,width,height);
}

canvas.addEventListener('wheel', function(e){onWheel(e)});
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth*0.9;
canvas.height = window.innerHeight*0.9;
var width = canvas.width;
var height = canvas.height;
var lines = [0];
var start = {x : width/2, y : height/2};
var end = {x : width/2, y : height/2};
var ctx = canvas.getContext('2d');
var ratioR = 2;
var ratioW = 5;
var num = 6;
var T = 5;
var t = 0;
var dt = 0.0001;
var dots = [];
var angularW = [(2*Math.PI/T).toFixed(3)];
var radi = [100];

function init(){
	for(var i = 0; i < num; i++){
		radi[radi.length] = radi[radi.length-1]/ratioR;
		angularW[angularW.length] = angularW[angularW.length-1]*-ratioW;
	}
}

function draw(){
	wipe();
	ctx.beginPath();
	ctx.strokeStyle = "#FF0000";
	ctx.moveTo(start.x, start.y);
	for(var i = 0; i < num; i++){
		end.x += radi[i]*Math.cos(angularW[i]*t);
		end.y += radi[i]*Math.sin(angularW[i]*t);
		ctx.lineTo(end.x, end.y);
	}
	ctx.moveTo(start.x, start.y);
	ctx.closePath();
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = "#FFFFFF";
	ctx.moveTo(dots[0], dots[1]);
	for(var j = 1; j < dots.length/T*t/2; j++){
		ctx.lineTo(dots[2*j+2], dots[2*j+3]);
	}
	ctx.moveTo(dots[0], dots[1]);
	ctx.closePath();
	ctx.stroke();
	end = {x : width/2, y : height/2};
	t += 0.1/num;
	if(t < T) window.requestAnimationFrame(draw);
}

function drawDots(){
	wipe();
	ctx.beginPath();
	ctx.strokeStyle = "#FFFFFF";
	ctx.moveTo(dots[0], dots[1]);
	for(var j = 1; j < dots.length; j++){
		ctx.lineTo(dots[2*j+2], dots[2*j+3]);
	}
	ctx.moveTo(dots[0], dots[1]);
	ctx.closePath();
	ctx.stroke();
}

function wipe(){
	//ctx.clearRect(0, 0, width, height);
	ctx.fillStyle = '#000000';
	ctx.fillRect(0,0,width,height);
}

function calDots(){
	dots = [];
	for(var tt = 0; tt < T; tt += dt){
		for(var ii = 0; ii < num; ii++){
			end.x += radi[ii]*Math.cos(angularW[ii]*tt);
			end.y += radi[ii]*Math.sin(angularW[ii]*tt);
		}
		dots.push(end.x);
		dots.push(end.y);
		end = {x : width/2, y : height/2};
	}
}

function onWheel(e){
	t = 0;
	var n = radi[0];
	var nn = angularW[0];
	var dy = e.deltaY;
	(dy > 0)? n += 3 : n -= 3;
	if(n < 1) n = 1;
	if(n > 150) n = 150;
	radi = [n];
	angularW = [nn];
	init();
	wipe();
	calDots();
	drawDots();
}

function numUp(){
	if(num < 9){
		num++;
		init();
		calDots();
		drawDots();
	}
}
function numDown(){
	if(num > 1){
		num--;
		init();
		calDots();
		drawDots();
	}
}
function ratioWUp(){
	if(ratioW < 9){
		ratioW++;
		temp = radi[0]*1;
		radi = [];
		radi[0] = temp;
		temp = angularW[0]*1;
		angularW = [];
		angularW[0] = temp;
		init();
		calDots();
		drawDots();
	}
}
function ratioWDown(){
	if(ratioW > 1){
		ratioW--;
		temp = radi[0]*1;
		radi = [];
		radi[0] = temp;
		temp = angularW[0]*1;
		angularW = [];
		angularW[0] = temp;
		init();
		calDots();
		drawDots();
	}
}
function rUp(){
	if(radi[0] < 150){
		temp = radi[0]*1 + 10;
		radi = [];
		radi[0] = temp;
		temp = angularW[0]*1;
		angularW = [];
		angularW[0] = temp;
		init();
		calDots();
		drawDots();
	}
}

function rDown(){
	if(radi[0] > 1){
		temp = radi[0]*1 - 10;
		radi = [];
		radi[0] = temp;
		temp = angularW[0]*1;
		angularW = [];
		angularW[0] = temp;
		init();
		calDots();
		drawDots();
	}
}

canvas.addEventListener('wheel', function(e){onWheel(e)});
init();
calDots();
draw();

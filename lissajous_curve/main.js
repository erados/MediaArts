var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var	horizontal = Math.floor(width);
var	vertical = Math.floor(height);
var a = 1, aa = 1.25, b = 1, bb = 7, c = 1, cc = 4; // 1 이상의 수만 가능
var phi = Math.PI;
var twophi = 2 * phi; 
var period = 100 ;
var magnifier = vertical / 2 / Math.max(a, b, c) * 0.5;
var imageData, data;
var xrm, yrm, zrm;
var theta = 0;
var poles = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
var colors = ["#ff0000", "#88ff00", "#8800ff"];

function init(){
	imageData = ctx.getImageData(0, 0, horizontal, vertical);
	data = imageData.data;
}

function setup(){
	var color, index;
	init();
	for (var x = 0; x < horizontal; x ++) {
		for(var y = 0; y < vertical; y ++){
			index = (x + y * horizontal) * 4;
			color = 0;
			data[index]     = color;
			data[index + 1] = color;
			data[index + 2] = color;
			data[index + 3] = 255 ;
		}
	}
	ctx.putImageData(imageData, 0, 0);
	setupMatrix();
	draw();
}

function calculate(t){
	var x = a * Math.sin( aa * t) * magnifier;
	var y = b * Math.sin( bb * t) * magnifier;
	var z = c * Math.sin( cc * t) * magnifier;
	return {x : x, y : y, z : z};
}

function draw(){
	aa = (aa + 0.0001) % 10;
	bb = (bb + 0.00047) % 10;
	cc = (cc + 0.0009) % 10;
	var x, y, z, index, color, co;
	setupMatrix();
	clearCanvas();
	for(var t = 0; t < period; t += 0.0007){
		co = calculate(t);
		co = rotate(co);
		co = modifyPos(co);
		x = Math.floor(co.x);
		y = Math.floor(co.y);
		z = Math.floor(co.z);
		index = (x + y * horizontal) * 4;
		color = 255;
		data[index]     = color;
		data[index + 1] = color;
		data[index + 2] = color;
		data[index + 3] = 255 ;
	}

	ctx.putImageData(imageData, 0, 0);	
	drawpoles();
	window.requestAnimationFrame(draw);
}

function clearCanvas(){
	for (var x = 0; x < horizontal; x ++) {
		for(var y = 0; y < vertical; y ++){
			index = (x + y * horizontal) * 4;
			color = 0;
			data[index]     = color;
			data[index + 1] = color;
			data[index + 2] = color;
			data[index + 3] = 255 ;
		}
	}
}

function setupMatrix(){
	theta += Math.PI / 180 * 2;
	var sin = Math.sin(theta);
	var cos = Math.cos(theta);
	xrm = [[1, 0 ,0], [0, cos, -sin], [0, sin, cos]];
	yrm = [[cos, 0 ,-sin], [0, 1, 0], [sin, 0, cos]];
	zrm = [[cos, -sin ,0], [sin, cos, 0], [0, 0, 1]];
}

function multiplyMatrix(co, axis){ // Must be (q X w) , (w X e)
	var x, y, z;
	switch(axis){
		case 'x' :	
		x = xrm[0][0] * co.x + xrm[0][1] * co.y + xrm[0][2] * co.z;
		y = xrm[1][0] * co.x + xrm[1][1] * co.y + xrm[1][2] * co.z;
		z = xrm[2][0] * co.x + xrm[2][1] * co.y + xrm[2][2] * co.z;
		break;
		case 'y' :	
		x = yrm[0][0] * co.x + yrm[0][1] * co.y + yrm[0][2] * co.z;
		y = yrm[1][0] * co.x + yrm[1][1] * co.y + yrm[1][2] * co.z;
		z = yrm[2][0] * co.x + yrm[2][1] * co.y + yrm[2][2] * co.z;
		break;
		case 'z' :	
		x = zrm[0][0] * co.x + zrm[0][1] * co.y + zrm[0][2] * co.z;
		y = zrm[1][0] * co.x + zrm[1][1] * co.y + zrm[1][2] * co.z;
		z = zrm[2][0] * co.x + zrm[2][1] * co.y + zrm[2][2] * co.z;
		break;
	}
	return {x : x, y : y, z : z};
}
function rotate(co){
	var co = multiplyMatrix(co, 'x');
	co = multiplyMatrix(co, 'y');
	co = multiplyMatrix(co, 'z');

	return co;
}

function modifyPos(co){
	var x = co.x + horizontal/2;
	var y = co.y + vertical/2;
	var z = co.z;
	return {x : x, y : y, z : z};
}

function drawpoles(){
	// 
	// ctx.strokeStyle = "#88ff00";
	for(var i = 0; i < 3; i++){
		ctx.beginPath();
		ctx.strokeStyle = colors[i];
		var co = { x: poles[i][0], y : poles[i][1], z : poles[i][2] };
		co = rotate(co);
		ctx.moveTo(co.x * 200 + horizontal/2, co.y * 200  + vertical/2);
		ctx.lineTo(-co.x * 200 + horizontal/2, -co.y * 200  + vertical/2);
		ctx.stroke();
	}

}

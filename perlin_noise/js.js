var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = Math.floor(window.innerWidth);
var height = Math.floor(window.innerHeight);
var gScl = Math.min(height, width);
var pScl = 1;

canvas.width = width;
canvas.height = height;


var gradVectors;
var distVectors;
function allocateVectors(){
	gradVectors = [];
	distVectors = [];
	for (var y = 0; y <= height; y += gScl){
		for (var x = 0; x <= width; x += gScl){
			var theta = 2 * (Math.random() * Math.PI).toFixed(2);
			var gradVector = {xi : x, yi : y, dx :Math.cos(theta), dy : Math.sin(theta)};
			gradVectors.push(gradVector);
		}
	}
	for (var y = 0; y < height; y += pScl){
		var yi = Math.floor(y / gScl);
		for (var x = 0; x < width; x += pScl){
			var xi = Math.floor(x / gScl);
			var idx = Math.floor((x + y * Math.floor(width / pScl)) / pScl);
			distVectors[idx] = [];
			distVectors[idx].push({xi : xi * gScl,       yi : yi * gScl,       dx : x - xi * gScl,       dy : y - yi * gScl, x : x, y : y});
			distVectors[idx].push({xi : (xi + 1) * gScl, yi : yi * gScl,       dx : x - (xi + 1) * gScl, dy : y - yi * gScl, x : x, y : y});	
			distVectors[idx].push({xi : xi * gScl,       yi : (yi + 1) * gScl, dx : x - xi * gScl,       dy : y - (yi + 1) * gScl, x : x, y : y});
			distVectors[idx].push({xi : (xi + 1) * gScl, yi : (yi + 1) * gScl, dx : x - (xi + 1) * gScl, dy : y - (yi + 1) * gScl, x : x, y : y});
		}
	}
}	

var resDots;
function calDotproduct(){
	resDots = [];
	for (var y = 0; y < height; y += pScl){
		var yi = Math.floor(y / gScl);
		for (var x = 0; x < width; x += pScl){
			var xi = Math.floor(x / gScl);
			var gIdx = xi + yi * (Math.ceil(width / gScl));
			var dIdx = Math.floor((x + y * Math.floor(width / pScl)) / pScl);
			var idx = dIdx;

			if(!gradVectors[gIdx+1]) gradVectors[gIdx+1] = gradVectors[gIdx];
			resDots[idx] = [];
			resDots[idx].push({x : gradVectors[gIdx].dx * distVectors[dIdx][0].dx, y : gradVectors[gIdx].dy * distVectors[dIdx][0].dy});
			resDots[idx].push({x : gradVectors[gIdx+1].dx * distVectors[dIdx][1].dx, y : gradVectors[gIdx+1].dy * distVectors[dIdx][1].dy});
			
			gIdx = xi + (yi + 1) * (Math.ceil(width / gScl));
			if(!gradVectors[gIdx+1]) gradVectors[gIdx+1] = gradVectors[gIdx];
			resDots[idx].push({x : gradVectors[gIdx].dx * distVectors[dIdx][2].dx, y : gradVectors[gIdx].dy * distVectors[dIdx][2].dy});
			resDots[idx].push({x : gradVectors[gIdx+1].dx * distVectors[dIdx][3].dx, y : gradVectors[gIdx+1].dy * distVectors[dIdx][3].dy});
		}
	}
}

var values;
function interpolate(){
	values = [];
	for (var y = 0; y < height; y += pScl){
		var dy = y % gScl / gScl;
		for (var x = 0; x < width; x += pScl){
			var dx = x % gScl / gScl;
			var idx = Math.floor((x + y * Math.floor(width / pScl)) / pScl);
			var valueX1 = lerp(fade(1-dx) , resDots[idx][0].x, resDots[idx][1].x);
			var valueX2 = lerp(fade(1-dx) , resDots[idx][2].x, resDots[idx][3].x);
			values.push(lerp(fade(1-dy), valueX1, valueX2));
		}
	}
}
function lerp(dx, value1, value2){
	return dx * value1 + (1 - dx) * value2;
}

function fade(t){
	//return t * t * t * (t * (t * 6 - 15) + 10);
	return ( 3- 2 * t ) * t * t;
}

var canvasData= ctx.getImageData(0, 0, width, height);
var imgData = canvasData.data;
function draw(){
	ctx.clearRect(0, 0, width, height);
	for (var x = 0; x < width; x ++){
		for (var y = 0; y < width; y ++){
			var idx = (x + y * width) * 4;
			var vIdx = Math.floor(x / pScl) + Math.floor(y / pScl) * width;
			// imgData[idx] = values[vIdx+gScl];
			// imgData[idx + 1] = values[vIdx+gScl];
			// imgData[idx + 2] = values[vIdx+gScl];
			var delta = ((values[vIdx]+gScl/2) / gScl / 4);
			if(step == 1){
				imgData[idx] = delta * 255;
				imgData[idx + 1] = delta * 255;
				imgData[idx + 2] = delta * 255;
				imgData[idx + 3] = 255;
			}
			else{
				imgData[idx] = (imgData[idx] / 255 * (step - 1) + delta)/step * 255;
				imgData[idx + 1] = (imgData[idx + 1] / 255 * (step - 1) + delta)/step * 255;
				imgData[idx + 2] = (imgData[idx + 2] / 255 * (step - 1) + delta)/step * 255;
			}
		}
	}
	ctx.putImageData(canvasData, 0, 0);
	// ctx.beginPath();
	// for(var i = 0; i < gradVectors.length; i++){
	// 	ctx.moveTo(gradVectors[i].xi, gradVectors[i].yi);
	// 	ctx.lineTo(gradVectors[i].xi + gradVectors[i].dx * gScl, gradVectors[i].yi + gradVectors[i].dy * gScl);
	// }
	// for(var j = 0; j < distVectors.length; j+=20){
	// 	ctx.moveTo(distVectors[j][0].xi, distVectors[j][0].yi);
	// 	ctx.lineTo(distVectors[j][0].x, distVectors[j][0].y);
	// }
	// ctx.closePath();
	// ctx.stroke();
}

var step = 1;
var span = document.getElementById('span');
function update(){
	gScl = Math.floor(gScl / 2);
	step += 1;
	allocateVectors();
	calDotproduct();
	interpolate();
	draw();
	span.innerText = 'Overlap : ' + step;
}


allocateVectors();
calDotproduct();
interpolate();
draw();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width =150; 
var height = canvas.height = 150; 
var halfWidth = width/2;
var tree = [];
var walkers = [];

var num_walkers =1000;
var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var data = imageData.data;
var blurRate = 1;
var iteration = 100;
var speed = 1;

function setup(){
	var center = new Dot(halfWidth, halfWidth, halfWidth, true);
	tree.push(center);
	while(walkers.length < num_walkers){
		walkers.push(new Dot());
	}

	draw();
}

function draw(){
	clearRect();
	update();
	drawPixel(tree, 250,222,62);
	drawPixel(walkers, 40, 133, 42, 100);
	ctx.putImageData(imageData, 0 , 0);
	window.requestAnimationFrame(draw);
}

function update(){
	for(var j = 0; j < iteration; j++){
		for(var i = 0; i < walkers.length; i++){
			walkers[i].walk();
			walkers[i].chkStuck();
			if(walkers[i].stuck){
				tree.push(walkers[i]);
				walkers.splice(i,1);
				break;
			}
		}
	}
}

function drawPixel(arr, r = 0, g = 0, b = 0, a = 255){
	for(var i = 0; i < arr.length; i++){
		var idx = (Math.round(arr[i].x) + Math.round(arr[i].y) * canvas.width ) * 4;
		for(var j = idx - arr[i].radius*4; j < idx + arr[i].radius*4; j+=4){
			for(var k = j; k < j + arr[i].radius*2 * canvas.width *4; k+=canvas.width*4){
				data[k] = r;
				data[k + 1] = g;
				data[k + 2] = b;
				data[k + 3] = a;
			}
		}
	}
}
function clearRect(){
	for(var i = 0, lim = data.length/4; i < lim; i++){
		data[4 * i] = 0;
		data[4 * i + 1] = 0;
		data[4 * i + 2] = 0;
		data[4 * i + 3] = 0;
	}
}

function blur(){
	for(var i = 0, lim = data.length/4; i < lim; i++){
		if(data[4 * i] < 255){
			data[4 * i] += blurRate;
			data[4 * i + 1] += blurRate;
			data[4 * i + 2] += blurRate;
		}
	}
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width = 500;
var height = canvas.height = 500;
var pi = Math.PI;
var twoPi = 2*pi;
var unitTheta = pi / 180;
var radius = height/2;
var theta = 0;
var times = 0;
var num1 = 0,
	num2 = 0,
	num3 = 0;
var flag1 = true,
	flag2 = true,
	flag3 = true;
var moving = true;
var timeSlider = document.getElementById('timeslider');
var timeSpan = document.getElementById('timespan');
var powerButton = document.getElementById('power');

function setUp(){
	ctx.translate(width/2, height/2);
	ctx.beginPath();
	ctx.arc(0, 0, radius, 0, 2 * Math.PI);
	ctx.stroke();

	powerButton.onclick = function(){ moving = !moving;};

	draw();	
}

function draw(){
	ctx.clearRect(-width/2, -height/2, width, height);	
	ctx.beginPath();
	ctx.strokeStyle = '#' + (num1.toFixed(0)).toString()+ (num2.toFixed(0)).toString()+ (num3.toFixed(0)).toString();

	for(var theta = 0; theta < twoPi; theta += unitTheta){
		var sx = radius * Math.cos(theta);
		var sy = radius * Math.sin(theta);
		var ex = radius * Math.cos(theta * times);
		var ey = radius * Math.sin(theta * times);
		ctx.moveTo(sx,sy);
		ctx.lineTo(ex,ey);
	}
	ctx.stroke();
	if(moving){
		times += 0.01;
		times = parseFloat(times);
		timeSlider.value = times;
	}else times = timeSlider.value;
	timeSpan.innerHTML = parseFloat(times).toFixed(2);
	if(flag1) num1 += Math.random()/2; else num1 -= Math.random()/2;
	if(flag2) num2 += Math.random()/3; else num2 -= Math.random()/4;
	if(flag3) num3 += Math.random()/4; else num3 -= Math.random()/3;
	if(num1 >= 99 || num1 <= 0) flag1 = !flag1;
	if(num2 >= 99 || num2 <= 0) flag2 = !flag2;
	if(num3 >= 99 || num3 <= 0) flag3 = !flag3;


	requestAnimationFrame(draw);
}



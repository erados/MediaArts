var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
document.body.style = "width:" + window.innerWidth + "px;" + "height:" + window.innerHeight + "px;";
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
ctx.strokeStyle = '#ffffff';
canvas.addEventListener('mousemove', mousemove);
canvas.addEventListener('click', allocate);

var mouse = { x: canvas.width/2, y: canvas.height/2};
var row = 100;
var col = 100;
ctx.fillRect(0, 0, canvas.width, canvas.height);
var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
var data = imageData.data;
var dt = 3;
var magnifier = 1000;
var blurRate = 9;
var rad = 40;
var rvx =  10;
var rvy =  10;
var thetaCo = 1;
sliderChg = false;
function mousemove(e){
	mouse.x = e.clientX;
	mouse.y = e.clientY;
}

var stars;

function allocate(){
	stars = [];
	var unitX = width/col;
	var unitY = height/row;
	for(var i = 0; i < row; i++){
		var y = i * unitY;
		for(var j = 0; j < col; j++){
			var randX = Math.random()*unitX;
			var randY = Math.random()*unitY;
			var star = { x : j * unitX + randX, y : y + randY };
			stars.push(star);
		}
	}
}

function update(element, index, array){
	changePos(element);
	if(element.x > 0 && element.x < width && element.y > 0 && element.y < height ){
		var idx = (Math.round(element.x) + Math.round(element.y) * canvas.width ) * 4;
		data[idx] = 255;
		data[idx + 1] = 255;
		data[idx + 2] = 255;
		data[idx + 3] = 255;
	}
}

function draw(){
	blur();
	stars.forEach(update);
	ctx.putImageData(imageData, 0 , 0);
	chkSliderChg();
	if(sliderChg){
		if(row != row_slider.value){
			row = row_slider.value;
			allocate();
		}
		applySliderValues();
		showSliderValues();
		sliderChg = false;
	}
	window.requestAnimationFrame(draw);
}

function changePos(element){
	var dx = element.x - mouse.x;
	var dy = element.y - mouse.y;
	var dist = Math.sqrt(dx * dx + dy * dy);
	var distSq = dx * dx + dy * dy;
	var distCb = dist * dist * dist;

	var theta = Math.atan2(-dy, dx)*thetaCo;
	var att = { x : - Math.cos(theta)/distSq, y : Math.sin(theta)/distSq};
	var rep = { x : rad * Math.cos(theta)/distCb, y : - rad * Math.sin(theta)/distCb};
	var rev = { x : rvx * Math.sin(theta)/dist, y : rvy * Math.cos(theta)/dist};
	element.x = element.x + magnifier * (att.x + rep.x ) * dt * dt + rev.x;
	element.y = element.y + magnifier * (att.y + rep.y ) * dt * dt + rev.y;
}
function blur(){
	for(var i = 0, lim = data.length/4; i < lim; i++){
		if(data[4 * i] > 0){
			data[4 * i] -= blurRate;
			data[4 * i + 1] -= blurRate;
			data[4 * i + 2] -= blurRate;
		}
	}
}
//--------------------------------------------------------------------//메인
//--------------------------------------------------------------------//그 뭐냐 그거 슬라이더
var row_span = document.getElementById("row_span");
var col_span = document.getElementById("col_span");
var dt_span = document.getElementById("dt_span");
var mag_span = document.getElementById("mag_span");
var blurRate_span = document.getElementById("blurRate_span");
var rad_span = document.getElementById("rad_span");
var rvx_span = document.getElementById("rvx_span");
var rvy_span = document.getElementById("rvy_span");
var theta_co_span = document.getElementById("theta_co_span");

var row_slider = document.getElementById("row");
var col_slider = document.getElementById("col");
var dt_slider = document.getElementById("dt");
var mag_slider = document.getElementById("mag");
var blurRate_slider = document.getElementById("blurRate");
var rad_slider = document.getElementById("rad");
var rvx_slider = document.getElementById("rvx");
var rvy_slider = document.getElementById("rvy");
var theta_co_slider = document.getElementById("theta_co");


function applySliderValues() {
	row = row_slider.value;
	dt = dt_slider.value;
	magnifier = mag_slider.value;
	blurRate = blurRate_slider.value;
	rad = rad_slider.value;
	rvx =  rvx_slider.value;
	rvy =  rvy_slider.value;
	thetaCo = theta_co_slider.value;
}

function showSliderValues() {
	row_span.innerHTML = row;
	dt_span.innerHTML = dt;
	mag_span.innerHTML = magnifier;
	blurRate_span.innerHTML = blurRate;
	rad_span.innerHTML = rad;
	rvx_span.innerHTML = rvx;
	rvy_span.innerHTML = rvy;
	theta_co_span.innerHTML = thetaCo;
}

function chkSliderChg(){
	if(row != row_slider.value
		||dt != dt_slider.value
		||magnifier != mag_slider.value
		||blurRate != blurRate_slider.value
		||rad != rad_slider.value
		||rvx !=  rvx_slider.value
		||rvy !=  rvy_slider.value
		||thetaCo != theta_co_slider.value)
		sliderChg = true;
}
showSliderValues();
allocate();
draw();
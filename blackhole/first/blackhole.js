var magnify = 5;
var radius = 2;
var frame = 60;
var rowcolumn = 100;
var afterImg = 5;
var xr = 300;
var yr = 300;
var sine = 1;

var pattern = [0];
pattern[0] = [-44.4, -49.2890188864292, 60, -2, 150, 986.4852753003195, -697.6878713155807, -2.1286083063007024];
pattern[1] = [49, 16, 60, 3, 150,605, 323, 1.3];
pattern[2] = [36.8, 39, 60, -2, 150, 473, 464.7, 4];
pattern[3] = [17.9, 47.677, 60, 1.58, 150, 803, 647, 1.635];
pattern[4] = [10, 2, 60, 2, 150, 300, 300, 7];
pattern[5] = [10, 9.5, 60, 3, 150, 132.7, 603.94, 1.207];
pattern[6] = [-49.37565063303763, -49.77730345414407, 60, 5.636372257584677, 150, 861.9220233557846, -937.4725987341069, -1.7686111933808892];
pattern[7] = [-25.41095477642916, 41.624340250466375, 60, 1.3434185956108262, 107.30473357514654, 366.8070106399007, -934.3188385190596, -0.9523848656759148];

var canvas, ctx;
var width = window.innerWidth;
var height = window.innerHeight;
var center = {x : width / 2, y: height/2};
var position = new Array;
var mouse = {x : 0, y : 0};
var moving = true;
var time = 1000 / frame;

var powerButton = document.getElementById('move');
var renewButton = document.getElementById('renew');
var hideButton = document.getElementById('hide');
var autoButton = document.getElementById('autoChg');
var randomButton = document.getElementById('randomChg');
var copyButton = document.getElementById('copy');
var parameters = document.getElementsByTagName('input');
function copy() {
	str = "pattern[" + pattern.length + "] = [" + magnify +', '+ radius +', '+ frame +', '+ afterImg +', '+ rowcolumn +', '+ xr +', '+ yr +', '+ sine + "];";
	if( is_ie() ) {
		window.clipboardData.setData("Text", str);
		alert("복사되었습니다.");
		return;
	}
	prompt("Ctrl+C를 눌러 복사하세요.", str);
}
function is_ie() {
	if(navigator.userAgent.toLowerCase().indexOf("chrome") != -1) return false;
	if(navigator.userAgent.toLowerCase().indexOf("msie") != -1) return true;
	if(navigator.userAgent.toLowerCase().indexOf("windows nt") != -1) return true;
	return false;
}

function showParameters(){
	parameters[0].value = magnify;
	parameters[1].value = radius ;
	parameters[2].value = frame;
	parameters[3].value = afterImg;
	parameters[4].value = rowcolumn;
	parameters[5].value = xr;
	parameters[6].value = yr;
	parameters[7].value = sine;
}
function getParameters(){
	magnify = parameters[0].value;
	radius = parameters[1].value;
	frame = parameters[2].value;
	afterImg = parameters[3].value;
	rowcolumn = parameters[4].value;
	xr = parameters[5].value;
	yr = parameters[6].value;		
	sine = parameters[7].value;
}
function initParameters(){
	magnify = 5;
	radius = 2;
	frame = 60;
	afterImg = 5;
	rowcolumn = 150;
	xr = 300;
	yr = 300;
	sine = 1;
}
function changePattern(i){
	magnify = pattern[i][0];
	radius = pattern[i][1];
	frame = pattern[i][2];
	afterImg = pattern[i][3];
	rowcolumn = pattern[i][4];
	xr = pattern[i][5];
	yr = pattern[i][6];		
	sine = pattern[i][7];
}
// 지정된 범위의 정수 1개를 랜덤하게 반환하는 함수
// n1 은 "하한값", n2 는 "상한값"
function randomRange(n1, n2) {
	return (Math.random() * (n2 - n1 + 1)) + n1;
}
function randomPattern(){
	magnify = randomRange(-50, 50);
	radius = randomRange(-50, 50);
	frame = 60;
	rowcolumn = randomRange(50, 110);
	allocate();
	afterImg = randomRange(-10, 10);
	xr = randomRange(-1000, 1000);
	yr = randomRange(-1000, 1000);		
	sine = randomRange(-3, 7);
}

function play(){ 
	if (moving) {
		init();
		draw();
		window.requestAnimationFrame(play);
	}
}

function dot(x, y, theta) {
	ctx.beginPath();
	ctx.moveTo(x-afterImg*Math.cos(-theta), y-afterImg*Math.sin(-theta));
	ctx.lineTo(x,y);	 
	ctx.strokeStyle = '#FFFFFF';
	ctx.stroke();
}

function cnvs_getCoordinates(e){
	mouse.x = (e.clientX - width/2);
	mouse.y = (e.clientY - height/2);
}

function allocate() {
	for (var i = 0; i < rowcolumn ; i ++) {
		position[i] = [];
		for (var j = 0; j < rowcolumn ; j ++) {
			position[i][j] = {x: (i-2) * width/rowcolumn + Math.random()*100 - width/2, y: (j-2) * height/rowcolumn  + Math.random()*100 - height/2};
		}
	}
}


function draw() {
	// ctx.beginPath();
	for (var i = 0; i < rowcolumn ; i ++) {
		for (var j = 0; j < rowcolumn ; j ++) {
			var dy = position[i][j].y - mouse.y;
			var dx = position[i][j].x - mouse.x;	
			var distance = Math.sqrt(dy * dy + dx * dx);
			var theta = sine * Math.atan2(dy, dx);
			var del = getDel(position[i][j].x - mouse.x, position[i][j].y - mouse.y, theta, distance);
			var dx = del.xa * time * time / 2 - del.xp * time * time / 2 + del.xv;
			var dy = del.ya * time * time / 2 - del.yp * time * time / 2 + del.yv;
			position[i][j].x += dx;
			position[i][j].y += dy;
			var theta2 = Math.atan2(-dy, dx);
			dot(position[i][j].x, position[i][j].y, theta2);
			// ctx.moveTo(position[i][j].x + center.x-afterImg*Math.cos(theta2), -position[i][j].y + center.y-afterImg*Math.sin(theta2));
			// ctx.lineTo(position[i][j].x + center.x,-position[i][j].y + center.y);	 
		}
	}
	// ctx.strokeStyle = '#FFFFFF';
	// ctx.stroke();
}

function init() {
	ctx.fillStyle = "#000000";
	ctx.strokeStyle = "#ffffff";
	ctx.fillRect(-width/2 ,-height/2 , width, height);		
}

function reset() {
	init();
	allocate();
	mouse = {x : -center.x, y : center.y};
	draw();

}


function getDel(dx, dy, theta, distance) {
	var delAttract = {x : - magnify * dx/Math.pow(distance, 2), y : - magnify * dy/Math.pow(distance, 2)};
	var delRepulse = {x : - radius * magnify * dx/Math.pow(distance, 2.5), y : - radius * magnify * dy/Math.pow(distance, 2.5)};
	var delRevolve = {x : xr * magnify * Math.cos(theta + Math.PI / 2)/Math.pow(distance, 1), y : yr * magnify * Math.sin(theta + Math.PI / 2)/Math.pow(distance, 1)};

	return {xa : delAttract.x, ya : delAttract.y, xp : delRepulse.x, yp: delRepulse.y, xv : delRevolve.x, yv : delRevolve.y};
}

window.onload = function() {
	canvas = document.getElementById("blackhole");
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext('2d');
	ctx.translate(center.x,center.y);
	init();
	allocate();		
	draw();
	isAuto = 1
	powerButton.onclick = function() {moving = !moving; };
	renewButton.onclick = function() {getParameters();allocate();};
	randomButton.onclick = function() {randomPattern();showParameters();};
	hideButton.onclick = function() {document.getElementById('parameters').style.display = 'none';};	
	autoButton.onclick = function() {
		isAuto = !isAuto; 
		var i = 0;		
		setInterval(
			function(){if(moving){changePattern( (i += 1) % (pattern.length)); showParameters();}}, 5000);};

		window.onload = window.requestAnimationFrame(play);
		copyButton.onclick = function() {copy();};
	};
var canvas = document.getElementById('canvas');
var margin = 100; // px
var cHeight = window.innerHeight; // 한줄에 등호 2개 쓰면 의도대로 안됨
canvas.height = window.innerHeight;
var cWidth = window.innerWidth;
canvas.width = window.innerWidth;
var height = canvas.height - 2 * margin;
var width = canvas.width - 2 * margin;
var ctx = canvas.getContext('2d');
var dots = [];
var lines, lines0, lines1;
var numOfDots = 15;
var dotRadius = 10; //px
var startDot, endDot;
var selectingFlag = false;
var color0 = "#158001";
var color1 = "#0781FF";
var colorNow = color0;
var turn = 0; // 0 or 1
var mouseX, mouseY;
var startTime, timeNow;
var timeLimit = 15; // second
var moving = true;
var points0 = 0, points1 = 0;
var imageData, data;
var color0H = hex2rgb(color0);
var color1H = hex2rgb(color1);

function setGame(){
	ctx.lineWidth = 6;
	startTime = new Date();
	setDots();
	setLineArray();
	initImgData();
	draw();
}

function initCanvas(){
	ctx.clearRect(0, 0, cWidth, cHeight);
}

function highlight(){
	if(startDot !== undefined){
		dots[startDot].color = 'red';
	}else
	for(var i = 0; i < numOfDots; i++){	
		dots[i].color = '#000000';
	}
}

function initImgData(){
	imageData = ctx.getImageData(0, 0, cWidth, cHeight);
	data = imageData.data;
}

function paintTriangles(){
	ctx.putImageData(imageData, 0, 0);
}
function hex2rgb(hex) {
	r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
	if (r) {
		return r.slice(1,4).map(function(x) { return parseInt(x, 16); }); // 정규식을 공부할 필요가 있다, 배열로 반환해버린다.
	} // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
}
function updateTriangleAreas(triangle){
	var color = (triangle[3] === 1)? color1H : color0H;
	var x1 = dots[triangle[0]].x;
	var y1 = dots[triangle[0]].y;
	var x2 = dots[triangle[1]].x;
	var y2 = dots[triangle[1]].y;
	var x3 = dots[triangle[2]].x;
	var y3 = dots[triangle[2]].y;
	var mX = Math.round(Math.min(x1, x2, x3));
	var MX = Math.round(Math.max(x1, x2, x3));
	var mY = Math.round(Math.min(y1, y2, y3));
	var MY = Math.round(Math.max(y1, y2, y3));
	for (var x = mX; x < MX; x ++) {
		for(var y = mY; y < MY; y ++){
			if(isDotInTriangle(x, y, x1, y1, x2, y2, x3, y3)){
				var index = (x + y * cWidth) * 4;
				data[index]     = color[0];
				data[index + 1] = color[1];
				data[index + 2] = color[2];
				data[index + 3] = 100 ;
			}
		}
	}
}

function sign(p1, p2, p3){
	return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function isDotInTriangle(xp, yp, x1, y1, x2, y2, x3, y3){
	//https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
	var pt = new Vector(xp, yp);
	var v1 = new Vector(x1, y1);
	var v2 = new Vector(x2, y2);
	var v3 = new Vector(x3, y3);



	var a1 = sign(pt, v2, v1) < 0;
	var a2 = sign(pt, v3, v2) < 0;
	var a3 = sign(pt, v1, v3) < 0;

	var b1 = sign(pt, v1, v2) < 0;
	var b2 = sign(pt, v2, v3) < 0;
	var b3 = sign(pt, v3, v1) < 0;

	return ( ((a1 == a2) && (a2 == a3)) && ((b1 == b2) && (b2 == b3)) );


	// var vp = new Vector(xp, yp);
	// var v1 = new Vector(x1, y1);
	// var v2 = new Vector(x2, y2);
	// var v3 = new Vector(x3, y3);
	// if(sameSide(vp, v1, v2, v3) && sameSide(vp, v3, v1, v2) && sameSide(vp, v2, v3, v1))
	// 	return true;
	// else return false;


	// if(!isColide(x, y, x1, y1, x2, y2, x3, y3) && !isColide(x, y, x2, y2, x3, y3, x1, y1) && !isColide(x, y, x3, y3, x1, y1, x2, y2)){
	// 	if(x !== x1 && x !== x2 && x !== x3){
	// 		return true;
	// 	}
	// }
	// return false;
	// 외적의 방향으로 삼각형 내부의 점이 있나 없나 판단해야한다. 둔각삼각형의경우 충돌로는 부족함.
}

function sameSide(vp1, vp2, va, vb){
	cp1 = vb.subtract(va).crossproduct(vp1.subtract(va));
	cp2 = vb.subtract(va).crossproduct(vp2.subtract(va));
	if (cp1.dotproduct(cp2) < 0 ) return false;
	else return true;
}

function setDots(){
	for(var i = 0; i < numOfDots; i++){	
		var x = Math.random() * width + margin;
		var y = Math.random() * height + margin;
		var color = "#000000";
		dots.push(new Dot(i, x, y, color));
	}
}

function setLineArray(){
	lines = new Array(numOfDots);
	lines0 = new Array(numOfDots);
	lines1 = new Array(numOfDots);
	for(var i = 0; i < numOfDots; i++){	
		lines[i] = [];
		lines0[i] = [];
		lines1[i] = [];
	}
}

function drawDots(){				
	for(var i = 0; i < numOfDots; i++){
		ctx.beginPath();		
		ctx.arc(dots[i].x, dots[i].y, dotRadius, 0, Math.PI*2);
		ctx.closePath();
		ctx.fillStyle = dots[i].color;
		ctx.fill();
	}
}
function drawLines(){
	for(var i = 0; i < numOfDots; i++){
		for(var j = 0; j < numOfDots; j++){
			if(lines0[i][j] !== undefined){
				ctx.beginPath();
				ctx.strokeStyle = color0;
				ctx.moveTo(dots[i].x, dots[i].y);
				ctx.lineTo(dots[lines0[i][j]].x, dots[lines0[i][j]].y);
				ctx.closePath();
				ctx.stroke();
			}
			if(lines1[i][j] !== undefined){
				ctx.beginPath();
				ctx.strokeStyle = color1;
				ctx.moveTo(dots[i].x, dots[i].y);
				ctx.lineTo(dots[lines1[i][j]].x, dots[lines1[i][j]].y);
				ctx.closePath();
				ctx.stroke();
			}
		}
	}
	if(selectingFlag){
		ctx.strokeStyle = colorNow;
		ctx.beginPath();
		ctx.moveTo(dots[startDot].x, dots[startDot].y);
		ctx.lineTo(mouseX, mouseY);
		ctx.closePath();
		ctx.stroke();
	}
}

function draw(){
	initCanvas();	
	paintTriangles(); 
	drawLines();
	highlight();
	drawDots();
	showPoints();
	if(moving)
		countTime();
	window.requestAnimationFrame(draw);
}

function selectDots(x, y){ 
	var theDot = isNearbyAnyDots(x, y);
	console.log(theDot);
	if(theDot !== undefined){
		selectingFlag = true;
		if(startDot !== undefined && (startDot !== theDot)){
			endDot = theDot;
			if(!isOverlaped() && !isCrossing()){
				lines[startDot].push(endDot);
				lines[endDot].push(startDot);
				switch(turn){
					case 0 : lines0[startDot].push(endDot); break;
					case 1 : lines1[startDot].push(endDot); break;
					default : alert('turn err');
				}
				givePoints(checkTriangles(getTriangles(startDot, endDot)));
				startDot = endDot = undefined;
				selectingFlag = false;
				changeTurn();
			}
		}
		else
			startDot = theDot;
	}else{
		startDot = endDot = undefined;
		selectingFlag = false;
	}
}

function countTime(){
	timeNow = new Date();
	var timeLeft = Math.ceil(timeLimit - (timeNow - startTime)/1000);

	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	if(timeLeft > 0)
		ctx.fillText(timeLeft, cWidth/2, cHeight/2); 
	else{
		ctx.fillText('Game Over..', cWidth/2, cHeight/2); 
		canvas.removeEventListener('click', clickToSelect);
		moving = false;
	}
}

function checkTriangles(newTriangles){
	var points = 0;
	if(newTriangles){
		for(var i = 0; i < newTriangles.length; i++){
			var x1 = dots[newTriangles[i][0]].x;
			var y1 = dots[newTriangles[i][0]].y;
			var x2 = dots[newTriangles[i][1]].x;
			var y2 = dots[newTriangles[i][1]].y;
			var x3 = dots[newTriangles[i][2]].x;
			var y3 = dots[newTriangles[i][2]].y;
			var mX = Math.round(Math.min(x1, x2, x3));
			var MX = Math.round(Math.max(x1, x2, x3));
			var mY = Math.round(Math.min(y1, y2, y3));
			var MY = Math.round(Math.max(y1, y2, y3));
			for(var j = 0; j < numOfDots; j++){
				var x = dots[j].x;
				var y = dots[j].y;
				if(mX < x && x < MX && mY < y && y < MY){
					if(isDotInTriangle(x, y, x1, y1, x2, y2, x3, y3)){
						j = numOfDots;
					}
				}
				if(j == numOfDots-1) {
					points++;
					updateTriangleAreas(newTriangles[i]);
				}

			}
		}
	}
	return points;
}

function givePoints(points){
	switch(turn){
		case 0 : points0 += points; break;
		case 1 : points1 += points; break;
		default : console.log('points err');
	}
}

function changeTurn(){
	turn = (turn === 0)? 1 : 0;
	colorNow = (turn === 0)? color0 : color1;
	startTime = new Date();
}

function showPoints(){
	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = color0;
	ctx.textAlign = "right";
	ctx.fillText(points0, cWidth/2-margin, margin); 	
	ctx.fillStyle = color1;
	ctx.textAlign = "left";
	ctx.fillText(points1, cWidth/2+margin, margin); 
}

function gameover(){

}

/* --------------- 주 함수와 부 함수 --------------- */

function isColide(x1, y1, x2, y2, x3, y3, x4, y4){
	// if(x1 == x2 || x1 == x3 || x1 == x4 || x2 == x3 || x2 == x4 || x3 == x4) return false; 
	var m1 = (y2-y1)/(x2-x1);
	var a1 = m1 * (x3-x1)+y1-y3; 
	var b1 = m1 * (x4-x1)+y1-y4;
	var m2 = (y4-y3)/(x4-x3);
	var a2 = m2 * (x1-x3)+y3-y1; 
	var b2 = m2 * (x2-x3)+y3-y2; 
	return (a1*b1 < 0 && a2*b2 < 0);
}

function getTriangles(a, b){
	var newTriangles = [];
	var flag = false;
	for(var i = 0; i < lines[b].length; i++){
		if(lines[lines[b][i]].includes(a)){	
			newTriangles.push(new Array(a,b,lines[b][i],turn));
			flag = true;
		}
	}
	if(flag){
		return newTriangles;
	}
}


function isNearbyAnyDots(x, y){
	var dot;
	var distances = [];
	var min;
	for(var i = 0; i < numOfDots; i++){
		distances.push(calDistance(x, y, dots[i].x, dots[i].y));
		min = Math.min.apply(null, distances); // 공부가 필요한 부분
		if(min < 4*dotRadius)
			dot = distances.indexOf(min);
	}
	return dot;
}

function isOverlaped(){
	if(lines0[startDot].includes(endDot) || lines0[endDot].includes(startDot) || lines1[startDot].includes(endDot) || lines1[endDot].includes(startDot)) {
		console.log('you are overlaping');
		return true;
	}
	else return false;
}

function isCrossing(){
	var x1 = dots[startDot].x;
	var y1 = dots[startDot].y;
	var x2 = dots[endDot].x;
	var y2 = dots[endDot].y;

	for(var i = 0; i < lines.length; i++){
		for(var j = 0; j < lines[i].length; j++){
			if(isColide(x1, y1, x2, y2, dots[i].x, dots[i].y, dots[lines[i][j]].x, dots[lines[i][j]].y)){
				console.log('you are crossing / '+ i , lines[i][j]);
				return true;
			}
		}
	}
	return false;
}
function calDistance(x1, y1, x2, y2){
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function fadeOutText(something){

}

canvas.addEventListener("click", function clickToSelect(e){
	selectDots(e.clientX, e.clientY);
});
canvas.addEventListener("mousemove", function(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
});
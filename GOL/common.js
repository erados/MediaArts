var canvas = document.getElementById('canvas-html');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var canvas_ratio = 1;

var moving = 1;


var ctx = canvas.getContext('2d');

var y_num = 100;
var unit = canvas.height/y_num;
var x_num = Math.floor(canvas.width/unit);  // 순서 지켜야됨 씨씨씼빠라빠라ㅃ라삐라

function move(){
	(moving)? moving = 0 : moving = 1;
}


function initiate(){ //-1과 max+1 및 blocks_storage이 레퍼런스로 필요하기에 추가함
	blocks = [];
	blocks_s = [];
	for (var i = -1 ; i <= x_num; i++) {
		blocks.push(i);
		blocks_s.push(i);
		blocks[i] = [];
		blocks_s[i] = [];
		for (var j = -1 ; j <= y_num; j++) {
			blocks[i].push(j);
			blocks[i][j] = 0;
			blocks_s[i].push(j);
			blocks_s[i][j] = 0;
		}
	}
}

function modify(){ //레퍼런스 값을 복사해옴
	for (var i = 0 ; i < x_num; i++) {
		blocks[i][-1] = blocks[i][y_num-1];
		blocks[i][y_num] = blocks[i][0];
	}
	for (var j = 0 ; j < y_num; j++) {
		blocks[-1][j] = blocks[x_num-1][j];
		blocks[x_num][j] = blocks[0][j];
	}
	blocks[-1][-1] = blocks[x_num-1][y_num-1];
	blocks[-1][y_num] = blocks[x_num-1][0];
	blocks[x_num][-1] = blocks[0][y_num-1];
	blocks[x_num][y_num] = blocks[0][0];
}

function calculate(){
	for (var i = 0 ; i < x_num; i++) {
		for (var j = 0 ; j < y_num; j++) {
			if(blocks[i][j]){
				blocks_s[i][j] = can_survive(i,j);
			} else {
				blocks_s[i][j] = can_revive(i,j);
			}
			
		}
	}
	for (var i = 0 ; i < x_num; i++) {
		for (var j = 0 ; j < y_num; j++) {
			blocks[i][j] = blocks_s[i][j];
		}
	}
}

function can_survive(i,j){
	var value =
	blocks[i-1][j-1] + blocks[i][j-1] + blocks[i+1][j-1] +
	blocks[i-1][j] + 					  blocks[i+1][j] +
	blocks[i-1][j+1] + blocks[i][j+1] + blocks[i+1][j+1];
	return (value == '2' || value == '3') ? 1 : 0 ;
}

function can_revive(i,j){
	var value =
	blocks[i-1][j-1] + blocks[i][j-1] + blocks[i+1][j-1] +
	blocks[i-1][j] + 					  blocks[i+1][j] +
	blocks[i-1][j+1] + blocks[i][j+1] + blocks[i+1][j+1];
	return (value == '3') ? 1 : 0 ;
}

function draw(){
	ctx.fillStyle = "#ffffff"
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.beginPath();
	for (var i = 0; i < x_num; i ++) {
		for (var j = 0; j < y_num; j ++) {
			(blocks[i][j])? ctx.fillStyle = "#000000" : ctx.strokeStyle = "#d2e7ef";
			(blocks[i][j])? ctx.fillRect(i*unit, j*unit, unit, unit): ctx.strokeRect(i*unit, j*unit, unit, unit)
		}
	}
}



function test(){
	initiate();
	random();
	setInterval(
		function(){if(moving){
			calculate();
			draw();
			modify();}
		}
		, 100)
	;
}

function random(){
	for (var i = 0; i <= Math.pow(y_num,1.7); i++) {
		blocks[Math.floor(Math.random()*x_num)][Math.floor(Math.random()*y_num)] = 1;
	}
}


function cnvs_getCoordinates(e){
	var x = Math.floor(e.clientX/unit);
	var y = Math.floor(e.clientY/unit);
	blocks[x][y] = 1;
	console.log(blocks[x][y], x, y);
	draw();
}
var canvas = document.getElementById('canvas');
var rowcul = 8;								
var ctx = canvas.getContext('2d');
var height = canvas.height = window.innerHeight*0.8; 
var width = canvas.width = height; 				
var unit = width/rowcul;						
var coins = [];									
var turns = 0;									

function initiate() {
	initiate_cvs();
	initiate_array();
	draw();
}

function initiate_cvs() {						
	ctx.fillStyle = "#DEB887";
	ctx.fillRect(0,0,width,height);
	ctx.beginPath();
	for(var i = 0; i < rowcul; i ++){
		ctx.moveTo(i*unit,0);
		ctx.lineTo(i*unit,height);
		ctx.moveTo(0, i*unit);
		ctx.lineTo(width, i*unit);
	}
	ctx.stroke();
}

function initiate_array(){ 						
	for(var i = -1; i <= rowcul; i++){			
		coins[i] = [];
		for(var j = -1; j <= rowcul; j++){
			coins[i][j] = '0';
		}
	}
	var center = rowcul/2;
	coins[center-1][center-1] = coins[center][center] = 'w';
	coins[center][center-1] = coins[center-1][center] = 'b';
}

function drawCoin(x, y, color) {				
	ctx.fillStyle = '#DEB887';
	ctx.beginPath();
	var x = x*unit+(unit/2);
	var y = y*unit+(unit/2);
	ctx.arc(x, y, unit/2, 0, Math.PI*2);
	ctx.closePath();
	switch(color){								
		case 'w' : ctx.fillStyle = '#ffffff'; break;
		case 'b' : ctx.fillStyle = '#000000'; break;
		case '0' : break;
	}
	ctx.fill();

}

function draw(){								
	initiate_cvs();
	for(var x = 0; x < rowcul; x++){
		for(var y = 0; y < rowcul; y++){
			if(coins[x][y] != "0")drawCoin(x,y,coins[x][y]);
		}
	}
}

function cordinate_to_number(x){				
	return Math.floor(x/unit);
}

function add_turn(){
	turns += 1;
}

function cal_color_from_turn(turns){
	return	(turns % 2 == 1)? "w" : "b";		
}

function is_empty(x,y){
	return (coins[x][y] == "0")? true : false ;
}
function seek_enemy_row(x, y, i){
	var color_now = cal_color_from_turn(turns);
	var color_enemy = cal_color_from_turn(turns + 1);
	var n = 0;
	var x_shift, y_shift;
	switch(i){
		case 0 : x_shift = -1; y_shift = -1; break;
		case 1 : x_shift = 0; y_shift = -1; break;
		case 2 : x_shift = 1; y_shift = -1; break;
		case 3 : x_shift = -1; y_shift = 0; break;
		case 4 : x_shift = 1; y_shift = 0; break;
		case 5 : x_shift = -1; y_shift = 1; break;
		case 6 : x_shift = 0; y_shift = 1; break;
		case 7 : x_shift = 1; y_shift = 1; break;
	}
	do {
		n += 1;
	}while(coins[x+n*x_shift][y+n*y_shift] == color_enemy)
	switch (coins[x+n*x_shift][y+n*y_shift]){
		case color_now :  return {num : n , x_shift : x_shift, y_shift : y_shift};
		// case color_enemy : return false;
		// case '0' : return false;
		default : return false;
	}
}


function put_coins(x,y){
	var color_now = cal_color_from_turn(turns);
	var color_enemy = cal_color_from_turn(turns + 1);
	var sum =
	coins[x-1][y-1] + coins[x][y-1] + coins[x+1][y-1] +
	coins[x-1][y]	+				  	coins[x+1][y] +
	coins[x-1][y+1]	+ coins[x][y+1] + coins[x+1][y+1];
	if(is_empty(x, y)){
		if(sum.indexOf(color_enemy) != -1){
			for( var i = 0; i < 8; i ++){
				if(sum.indexOf(color_enemy) == i){
					var storage = seek_enemy_row(x, y, i);
					if(storage){
						for(var j = 1; j < storage.num; j++){
							var x_shift = storage.x_shift;
							var y_shift = storage.y_shift;
							coins[x+j*x_shift][y+j*y_shift] = color_now;
						}
						coins[x][y] = color_now;
					}
					sum = sum.substring(0, i)+'0'+sum.substring(i+1,sum.length);
				}
			}
			if(coins[x][y] !== "0") return true; 
		} else return false;
	}
}

function can_put(x,y){
	var color_now = cal_color_from_turn(turns);
	var color_enemy = cal_color_from_turn(turns + 1);
	var sum =
	coins[x-1][y-1] + coins[x][y-1] + coins[x+1][y-1] +
	coins[x-1][y]	+				  	coins[x+1][y] +
	coins[x-1][y+1]	+ coins[x][y+1] + coins[x+1][y+1];
	
	if(is_empty(x,y)){
		if(sum.indexOf(color_enemy) != -1){
			for( var i = 0; i < 8; i ++){
				if(sum.indexOf(color_enemy) == i){
					var storage = seek_enemy_row(x, y, i);
					if(storage){
						return 1; 
					}else return 0;

				}
				sum = sum.substring(0, i)+'0'+sum.substring(i+1,sum.length);
			}
		}
	} 
}

function turn_notify(i){
	var h1 = document.getElementById('turn');
	if(!i){
		h1.style.color = "BLACK";	
		(h1.innerHTML === "BLACK")? h1.innerHTML = "WHITE" : h1.innerHTML = "BLACK";
	}else h1.style.color = "RED";
}

function can_pass(){
	var chk = 0;
	for(var i = 0; i < rowcul; i++){
		for(var j = 0; j < rowcul; j++){
			chk += can_put(i,j);
		}
	}
	if(chk == 0) return true;
	else return false;
}

canvas.addEventListener("click", function(e) {
	var x = cordinate_to_number(e.layerX);
	var y = cordinate_to_number(e.layerY);
	console.log(x,y);
	if(!can_pass()){
		if(is_empty(x,y) && put_coins(x,y)){
			add_turn();
			turn_notify();
			draw();
		}
	} else {
		turn_notify(1);
		add_turn();
	}
});												
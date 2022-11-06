var blockNum = prompt('가로 세로', 10)*1;
var scale = 2;
var mineNum = blockNum;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var blocks = [];
var img = new Image();
img.src = 'image.png';

function initCanvasSize(){
	canvas.width = blockNum * 10 * scale;
	canvas.height = blockNum * 10 * scale;
}
function initBlocks(){
	for(var x = 0; x < blockNum; x++){
		var row = [];
		for(var y = 0; y < blockNum; y++){
			row.push(new Block(x, y));
		}
		blocks.push(row);
	}
	for(var i = 0; i < mineNum; i++){
		var temp = blocks[Math.floor(Math.random() * blockNum)][Math.floor(Math.random() * blockNum)];
		if(temp.isMine){
			i--;
			continue;
		}
		temp.isMine = true;
		surroundNumUp(temp);
	}
}
function surroundNumUp(block){
	for(var i = 0, x = block.x - 1; i < 3; i++, x++){
		for(var j = 0, y = block.y - 1; j < 3; j++, y++){
			if(0 <= x && x < blockNum && 0 <= y && y < blockNum) blocks[x][y].num++;
		}
	}
}

function surroundZeroOpenBasic(xx, yy){
	for(var i = 0, x = xx - 1; i < 3; i++, x++){
		for(var j = 0, y = yy - 1; j < 3; j++, y++){
			if(((i + j) % 2 == 1) && 0 <= x && x < blockNum && 0 <= y && y < blockNum){
				if(!blocks[x][y].open && !blocks[x][y].isMine){
					blocks[x][y].open = true;
					if(blocks[x][y].num == 0) surroundZeroOpenBasic(x, y);
				}
			}		
		}
	}
}

function draw(){
	for(var x = 0; x < blockNum; x++){
		for(var y = 0; y < blockNum; y++){
			if(blocks[x][y].open){
				if(blocks[x][y].isMine) ctx.drawImage(img, 110, 0, 10, 10, blocks[x][y].x * scale * 10, blocks[x][y].y * scale * 10, 10 * scale, 10 * scale);
				else ctx.drawImage(img, blocks[x][y].num * 10, 0, 10, 10, blocks[x][y].x * scale * 10, blocks[x][y].y * scale * 10, 10 * scale, 10 * scale);
			}
			else if(blocks[x][y].checked) ctx.drawImage(img, 120, 0, 10, 10, blocks[x][y].x * scale * 10, blocks[x][y].y * scale * 10, 10 * scale, 10 * scale);
			else ctx.drawImage(img, 100, 0, 10, 10, blocks[x][y].x * scale * 10, blocks[x][y].y * scale * 10, 10 * scale, 10 * scale);
		}
	}
}

function mouseClick(e){
	var x = Math.floor(e.offsetX / (10 * scale));
	var y = Math.floor(e.offsetY / (10 * scale));
	blocks[x][y].open = true;
	if(blocks[x][y].num == 0) surroundZeroOpenBasic(x, y);
	draw();
	if(blocks[x][y].isMine){
		alert('Die');
		window.location.reload();
	}
}
function rightClick(e){
	var x = Math.floor(e.offsetX / (10 * scale));
	var y = Math.floor(e.offsetY / (10 * scale));
	blocks[x][y].checked = true;
	draw();
	for(var i = 0; i < blockNum; i++){
		for(var j = 0; j < blockNum; j++){
			if(blocks[x][y].checked != blocks[i][j].isMine){
				console.log(i, j);
				return;
			}
		}		
	}
	alert('YOU WIN!!');
}

canvas.addEventListener('click', mouseClick);
canvas.addEventListener('contextmenu', rightClick);

initCanvasSize();
initBlocks();
draw();
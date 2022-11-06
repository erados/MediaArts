var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width  = window.innerWidth;
var height = window.innerHeight;
var imageData, data;

var horizontal = Math.floor(width);
var vertical = Math.floor(height);

var MAX = 100;
var critic = 4;
var scale = width/5;

var level = 1;

var powerButton = document.getElementById('move');
var upButton = document.getElementById('up');
var downButton = document.getElementById('down');
var levelSpan =  document.getElementById('level');

var theta = 0;
var pi = Math.PI;

var moving = false;


var save;
var flag = false;

function setup(){
  init();

  for (var x = 0; x < horizontal; x ++) {
    for(var y = 0; y < vertical; y ++){
      var index = (x + y * horizontal) * 4;
      var color = calculate(x, y) * 255;
      data[index]     = color;
      data[index + 1] = color;
      data[index + 2] = color;
      data[index + 3] = 255 ;
    }
  }
  save = imageData;


  ctx.putImageData(imageData, 0, 0);

  animate();
}


function animate(){

  if(moving){
   theta += pi / 180;
   ca = Math.sin(theta*7.7);
   cb = Math.cos(theta*4.4);
   for (var x = 0; x < horizontal; x ++) {
    for(var y = 0; y < vertical; y ++){
      var index = (x + y * horizontal) * 4;
      var color = calculate(x, y) * 255;
      data[index]     = color;
      data[index + 1] = color;
      data[index + 2] = color;
      data[index + 3] = 255 ;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  levelSpan.innerHTML = level;
}
else if(flag){
  draw();
}

requestAnimationFrame(animate);
}


function calculate(x, y){
  var oldCom;
  var newCom ;
  var middleCom;
  if(!moving)  {
    oldCom = new Complex((x - width/2)/scale, (y - height/2)/scale);
    newCom = new Complex((x - width/2)/scale, (y - height/2)/scale);
    for(var i = 0; i < MAX; i ++){
      middleCom = newCom.clone();
      for(var j = 0; j < level; j ++){
        newCom = newCom.multiply(middleCom);
      }
      newCom = newCom.add(oldCom);
      if( !newCom.evaluate() ){
        return i/MAX;
      }
    }
  }else{
    oldCom = new Complex(ca,cb);
    newCom = new Complex((x - width/2)/scale, (y - height/2)/scale);
    for(var ii = 0; ii < MAX; ii ++){
            middleCom = newCom.clone();
      for(var jj = 0; jj < level; jj ++){
        newCom = newCom.multiply(middleCom);   
      }
            newCom = newCom.add(oldCom);
      if( !newCom.evaluate() ){
        return ii/MAX ;
      }
    }
  }
  return 0;
}
powerButton.onclick = function() {

  if(moving){

    flag = true;
    width  = window.innerWidth;
    height = window.innerHeight;
    MAX = 100;
    critic = 4;
    scale = width/10;
    init();
  }  else {

    flag = true;
    width = height = 1000;
    MAX = 40;
    critic = 4;
    scale = width/10;
    init();
  }
  moving = !moving;
};

function init(){

  horizontal = Math.floor(width);
  vertical = Math.floor(height);

  canvas.width = width;
  canvas.height = height;
  imageData = ctx.getImageData(0, 0, horizontal, vertical);
  data = imageData.data;
}

function draw(){
  levelSpan.innerHTML = 'wait...'; 
  setTimeout(function(){
    for (var x = 0; x < horizontal; x ++) {
      for(var y = 0; y < vertical; y ++){
        var index = (x + y * horizontal) * 4;
        var color = calculate(x, y) * 255;
        data[index]     = color;
        data[index + 1] = color;
        data[index + 2] = color;
        data[index + 3] = 255 ;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    flag = false;
    levelSpan.innerHTML = level;
  },0);

}



function levelUp() {  
 level += 1; flag = true; moving = false;
}



function levelDown() {
  if(level > 0){
    level -= 1; flag = true;moving = false;
  }
}

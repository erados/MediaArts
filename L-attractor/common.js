var canvas, ctx, width, height, points, rm_x, rm_y, rm_z, size, sigma, rho, beta, scale, points_view, unit_theta, num, x_on, y_on, z_on, moving, xpole, ypole, zpole, poles;
var sigma_slider = document.getElementById('sigma');
var rho_slider = document.getElementById('rho');
var beta_slider = document.getElementById('beta');
var scale_slider = document.getElementById('scale');
var size_slider = document.getElementById('size');
var num_slider = document.getElementById('num');
var ang_speed_slider = document.getElementById('ang_speed');

var x_on_button = document.getElementById('x_on');
var y_on_button = document.getElementById('y_on');
var z_on_button = document.getElementById('z_on');
var move_button = document.getElementById('move');
var reset_button = document.getElementById('reset');

var pi = Math.PI;






x_on_button.onclick = function(){ x_on = !x_on; };
y_on_button.onclick = function(){ y_on = !y_on; };
z_on_button.onclick = function(){ z_on = !z_on; };
move_button.onclick = function(){ moving = !moving; };
reset_button.onclick = function(){ setup(); };

function init(){
	ctx.fillStyle = "#ffffff";
	ctx.clearRect(-width/2, -height/2, width, height);
}

function setup(){
	setPoles();
	x_on = y_on = z_on = false;
	moving = true;
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	theta = [0, 0, 0];
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	sigma_slider.value = (10) * 5;
	rho_slider.value = (28) * 5;
	beta_slider.value = (8/3) * 20;
	scale_slider.value = (20) * 4;
	size_slider.value = (1) * 40;
	ang_speed_slider.value = (0.01) * 18000/pi;
	num_slider.value = (5000)/200;
	ctrlChk();
	// unit_theta = pi / 180;
	// num = 2000;
	// sigma = 10;
	// rho = 28;
	// beta = 8/3;
	// scale = 5;	
	// size = 2;


	ctx.translate(width/2, height/2);
	points = [];
	points_view = [];

	rm_x = [[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0] ];
	rm_y = [[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0] ];
	rm_z = [[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0] ];

	for(var i = 0; i < num; i++){
		addPoint();
	}
	draw();
}

function setupRM(axis){

	var sin, cos;
	switch(axis){
		case 'x':
		var sinx = Math.sin(theta[0]);
		var cosx = Math.cos(theta[0]);
		rm_x[0][0] = 1;
		rm_x[0][1] = 0;
		rm_x[0][2] = 0;
		rm_x[1][0] = 0;
		rm_x[1][1] = cosx;
		rm_x[1][2] = -sinx;
		rm_x[2][0] = 0;
		rm_x[2][1] = sinx;
		rm_x[2][2] = cosx;

		break;

		case 'y':
		var siny = Math.sin(theta[1]);
		var cosy = Math.cos(theta[1]);
		rm_y[0][0] = cosy;
		rm_y[0][1] = 0;
		rm_y[0][2] = siny;
		rm_y[1][0] = 0;
		rm_y[1][1] = 1;
		rm_y[1][2] = 0;
		rm_y[2][0] = -siny;
		rm_y[2][1] = 0;
		rm_y[2][2] = cosy;

		break;
		
		case 'z':
		var sinz = Math.sin(theta[2]);
		var cosz = Math.cos(theta[2]);
		rm_z[0][0] = cosz;
		rm_z[0][1] = -sinz;
		rm_z[0][2] = 0;
		rm_z[1][0] = sinz;
		rm_z[1][1] = cosz;
		rm_z[1][2] = 0;
		rm_z[2][0] = 0;
		rm_z[2][1] = 0;
		rm_z[2][2] = 1;

		break;	
	}
}

function update() {
	addjustNum();
	points_view = [];
	for(var i = 0; i < points.length; i++){
		points[i].update();
		var copy = new Point(points[i].x, points[i].y, points[i].z);
		points_view.push(copy); 
	}
	setPoles();
}
function draw() {
	if(moving){
		ctrlChk();
		init();
		update();
		rotate('z');		
		rotate('y');
		rotate('x');



		ctx.beginPath();
		ctx.lineWidth = size;
		ctx.strokeStyle = "#000000";
		for(var i = 0; i < points_view.length; i++){
			points_view[i].draw();
		}
		ctx.stroke();		

		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#008800";
		for(var j = 0; j < 3; j++){
			poles[j].drawline();
		}
		ctx.stroke();
	}
	requestAnimationFrame(draw);

}
function rotate(axis) {
	setupRM(axis);
	for(var i = 0; i < points_view.length; i++){
		points_view[i].rotate(axis);
	}
	for(var j = 0; j < 3; j++){
		poles[j].rotate(axis);
	}
	switch(axis){
		case "x": if(x_on){theta[0] -= unit_theta;} break;
		case "y": if(y_on){theta[1] -= unit_theta;} break;
		case "z": if(z_on){theta[2] -= unit_theta;} break;
	}
}
function addPoint() {
	var point = new Point( Math.random() * 50 - 25, Math.random() * 50 - 25 , Math.random()* 50 - 25 );
	points.push(point);
}

/*-----------------------------controller setting ------------------------*/

function ctrlChk(){
	sigma = sigma_slider.value/5;
	rho = rho_slider.value/5;
	beta = beta_slider.value/20;
	scale = scale_slider.value/4;
	size = size_slider.value/40;
	unit_theta = pi/180 * ang_speed_slider.value/100;
	num = num_slider.value * 300;
}

function addjustNum(){
	if(points.length != num){
		points = [];
		for(var i = 0; i < num; i++){
			addPoint();
		}
	}
}

function setPoles(){
	xpole = new Point(10, 0, 0);
	ypole = new Point(0, 10, 0);
	zpole = new Point(0, 0, 30);
	poles = [xpole, ypole, zpole];
}
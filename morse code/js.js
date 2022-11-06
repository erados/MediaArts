var dash = new Audio('./mp3/dash.mp3');
var dot = new Audio('./mp3/dot.mp3');

var ta = document.getElementById('input');
var result = document.getElementById('result');

var MCArr = {a : '.-', b : '-...', c : '-.-.', d : '-..', e : '.', f : '..-.', g : '--.', h : '....', i : '..', j :'.---', k : '-.-', l : '.-..', m :'--', n : '-.', o : '---', p : '.--.', q : '--.-', r : '.-.', s : '...', t : '-', u : '..-', v : '...-', w : '.--', x : '-..-', y : '-.--', z: '--..', 1 : '.----', 2 : '..---', 3 : '...--', 4 : '....-', 5 : '.....', 6 : '-....', 7 : '--...', 8 : '---..', 9 : '----.', 0 : '-----', ' ' : ' '};


document.getElementById('encode').addEventListener('click', encodeMC);

function encodeMC(){
	var string = ta.value.toLowerCase();
	var tmp = "";
	for(var i = 0, lim = string.length; i < lim; i++){
		tmp += MCArr[string[i]] + 's'; //letter space
	}
	showMC(tmp.replace(/undefined/g, '?').replace(/s/g, ' '));
	sound(tmp);
}

async function sound(MC){
	for(var i = 0, lim = MC.length; i < lim; i++){
		switch(MC[i]){
			case '.' : dot.currentTime = 0; dot.play(); await sleep(200);  break;
			case '-' : dash.currentTime = 0; dash.play(); await sleep(400); break;
			case 's' : await sleep(200); break;
			case ' ' : await sleep(500); 
		}
	}
}

function sleep(n){
	return new Promise(resolve => setTimeout(resolve, n));
}

function showMC(str){
	result.innerHTML = str;
}
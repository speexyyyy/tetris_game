const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

var gb = new Image();
gb.src = "src/gb.png";
ctx.drawImage(gb, 0, 0, canvas.width, canvas.height);

ctx.scale(20,20);

const colors = ['','purple','yellow','red','green','blue','orange','cyan'];

var img = new Image();
img.src = "src/logo.png";

window.onload=function(){
  mute();
  mute();
  update();
  menu(false, false);
  ctx.drawImage(img, 2, 6, 10, 5);
}

function showInfo(){
	document.getElementById("info").style.visibility = "visible";
}

function mute(){
	document.getElementById('themesong').volume = 0.6;
    if(document.getElementById('themesong').muted == false){
       document.getElementById('themesong').muted = true;
        } else {
        document.getElementById('themesong').muted = false;
              }

}

function hideButton(){
	var button = document.getElementById("newgame");
	button.style.display = "none";
}

function showButton(){
	var button = document.getElementById("newgame");
	button.style.display = "block";
}

var mutepic = 'volume';
function volumepic(){
	if(mutepic == 'volume'){
		document.getElementById("muteicon").src = "src/mute.png";
		mutepic = 'mute';
	}else{
	document.getElementById("muteicon").src = "src/volume.png";
	mutepic = 'volume';
	}
}

function rowScored(){
	tone = document.getElementById("rowScored");
	tone.volume = 1;
	tone.play();
}

function createMatrix(height, width){
	game = [];
	for(var i = 0; i < height; i++){
		game.push(new Array(width).fill(0));
	}
	return game;
}

function draw(){
	ctx.drawImage(gb, 0, 0, 14, 25);
	drawMatrix(arena, {x: 0, y: 0});
	drawMatrix(player.matrix, player.pos);
}


function playerReset(){
	player.matrix = createPiece(Math.floor(Math.random() * Math.floor(7)));
	player.pos.y = 0;
	player.pos.x = 6;
	gameOver();
}


function gameOver(){
	if(collide(arena, player)){
		arena.forEach(function(row){
			row.fill(0);
		})
		menu(true, true);
		score = 0;
		rowsScored = 0;
		level = 0;
		nextLevel = 0;
		dropInterval = 1000;
	}
}

var gameover = new Image();
gameover.src = "src/gameover.png";

function menu(scoretext, gmover){
	ctx.fillStyle = '#000'
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	cancelAnimationFrame(animation);
	ctx.font = "2px Comic Sans MS";
	ctx.fillStyle = "white";
	if(gmover){
		ctx.drawImage(gameover, 2, 6, 10, 5);
	}
	if(scoretext){
	ctx.font = "1px Comic Sans MS";
	ctx.fillText("Your Score:", 2.5,11);
	ctx.fillText(score, 8,12.5);
	}
	showButton();
}

var lastPos;

function createPiece(position){
	if(position == lastPos){
		position = Math.floor(Math.random() * Math.floor(7));
	}
	lastPos = position;
	if(position === 0){
		return [
			[1,1,1],
			[0,1,0],
			[0,0,0]
				]; 
	} else if(position === 1){
		return [
			[2,2],
			[2,2],
		];
	} else if(position === 2){
		return  [
			[3,3,0],
			[0,3,3],
			[0,0,0]
				];
	} else if(position === 3){
		return [
			[0,4,4],
			[4,4,0],
			[0,0,0]
				];	
	} else if(position === 4){
		return [
			[0,5,0],
			[0,5,0],
			[5,5,0]
				];
	} else if(position === 5){
		return [
			[0,6,0],
			[0,6,0],
			[0,6,6]
				];
	} else {
		return [
			[0,7,0,0],
			[0,7,0,0],
			[0,7,0,0],
			[0,7,0,0],
				];
			}
}


function drawMatrix(matrix, offset){
	matrix.forEach(function(row, y){
		row.forEach(function(value, x){
			if(value !== 0){
				ctx.fillStyle = colors[value];
				ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

var dropCount = 0;
var lastTime = 0;
var dropInterval = 1000;

function update(time = 0) {
	draw();
	animation = requestAnimationFrame(update);
	var deltaTime = 0;
	deltaTime = time - lastTime;
	lastTime = time;
	dropCount += deltaTime;
	if(dropCount > dropInterval){
		playerDrop();
		dropCount = 0;
	}
	document.getElementById('score').innerText = 'Score: ' + score;
	document.getElementById('rows').innerText = 'Lines: ' + rowsScored;
	document.getElementById('level').innerText = 'Level: ' + level;
}

function merge(arena, player){
	player.matrix.forEach(function(row, y){
		row.forEach(function(value, x){
			if(value !== 0){
				arena[player.pos.y + y][player.pos.x + x] = value;
			}
		})
	})
	//console.table(arena);
};

function collide(arena, player){
	var collide = false;
	player.matrix.forEach(function(row, y){
		row.forEach(function(value, x){
			if(value !== 0){
				if(arena[player.pos.y + y] == undefined || arena[player.pos.y + y]
																[player.pos.x + x] !== 0){
					collide = true;
				}
			}	
		})
	})
	return collide;
};

function rotate(matrix, dir){
	newMatrix = [];
	for (var i = 0; i < matrix.length; i++) {
		newMatrix.push(new Array(matrix.length).fill(0))
	}
	matrix.forEach(function(row, y){
		row.forEach(function(value, x){
			newMatrix[x][y] = value;
		});
	});
	if(dir > 0){
		newMatrix.forEach(function(row){
			row.reverse();
		})
	}else{
		newMatrix.reverse();
	}
	player.matrix = newMatrix;
};

function playerDrop(){
	player.pos.y += 1;
	if(collide(arena, player)){
		player.pos.y--;
		merge(arena, player);	
		playerReset();
		checkMatch(arena);
	};
};

score = 0;
rowsScored = 0;
level = 0;
rowsSweeped = 0;
nextLevel = 0;

function addScore(number){
	if(number === 1){
		score += 40 * (level + 1);
	} else if(number === 2 ){
		score += 100 * (level + 1);
	} else if(number === 3){
		score += 300 * (level + 1);
	} else if(number === 4){
		score += 1200 * (level + 1);
	}
	if(nextLevel >= 10){
		level += 1;
		nextLevel = 0;
		dropInterval = ((11 - level) * 0.085) * 1000;
		document.getElementById("levelUP").play();
	}
}


function checkMatch(arena){
	arena.forEach(function(row, y){
		if(!row.includes(0)){
			const row = arena.splice(y, 1)[0].fill(0);
			arena.unshift(row);
			rowsScored += 1;
			nextLevel += 1;
			rowsSweeped += 1;
			rowScored();
		};
	});
	addScore(rowsSweeped);
	rowsSweeped = 0;
};


var pause = false;

function paused(){
	if(pause == false){
		cancelAnimationFrame(animation);
		pause = true;
	}else{
		update();
		pause = false;
	}
}

document.addEventListener('keydown', function(event){

	event.preventDefault();

	if(event.keyCode === 39 || event.keyCode === 76){
		player.pos.x += 1;
		if(pause == true){
			player.pos.x -= 1;
		}
		if(collide(arena, player)){
			player.pos.x -= 1;
		};
	}else if(event.keyCode === 37 || event.keyCode === 74){
		player.pos.x -= 1;
		if(pause == true){
			player.pos.x += 1;
		}
		if(collide(arena, player)){
			player.pos.x += 1;
		}
	}else if (event.keyCode === 40 || event.keyCode === 75){
		playerDrop();
		if(pause == true){
			player.pos.y -= 1;
		}
		dropCount = 0;
	}else if(event.keyCode === 81){
		rotate(player.matrix, -1);
		if(pause == true){
			rotate(player.matrix, 1);
		}
		if(collide(arena, player)){
			rotate(player.matrix, 1);
		}
	}else if(event.keyCode === 69){
		rotate(player.matrix, 1);
		if(pause == true){
			rotate(player.matrix, -1);
		}
		if(collide(arena, player)){
			rotate(player.matrix, -1);
		}
	}else if(event.keyCode === 32){
		paused();
	}
});


arena = createMatrix(25, 14);

const player = {
	pos: {x: 4, y: 0},
	matrix: createPiece(1),
}

/*********************/
/* utility functions */
/*********************/

function probability(max) {
//generate a random whole number between 0 and max
return Math.floor(Math.random()*max);
}
 
function respawnBall() {
pingpong.respawning = true;
//reset ball coords
ball.x = (ctx.canvas.width / 2) - (ball.width / 2);
ball.y = probability(ctx.canvas.height / 2) + (ctx.canvas.height / 4);
var dspeed = ball.speed;
ball.speed = 0;
ball.speedModifier = 0;
//randomize ball direction
if (probability(2) == 0) {
	ball.directionX = 1;
}
else {
	ball.directionX = -1;
}
if (probability(2) == 0) {
	ball.directionY = 1;
}
else {
	ball.directionY = -1;
}
notafication("3",ctx.canvas.width / 2,ctx.canvas.height - 100,"#FFFFFF","60px pong","center","top",1,1000);
setTimeout(function() {
	notafication("2",ctx.canvas.width / 2,ctx.canvas.height - 100,"#FFFFFF","60px pong","center","top",1,1000);
},500);
setTimeout(function() {
	notafication("1",ctx.canvas.width / 2,ctx.canvas.height - 100,"#FFFFFF","60px pong","center","top",1,1000);
},1000);
setTimeout(function() {
	notafication("GO",ctx.canvas.width / 2,ctx.canvas.height - 100,"#FFFFFF","60px pong","center","top",1,1000);
	ball.speed = dspeed;
	pingpong.respawning = false;
},1500);
}

function increaseBallSpeed() {
//get the probability of 1 in 4 and increase ball speed
if (probability(4) == 1) {
	ball.speedModifier++;
	notafication("Speed Increased!",ctx.canvas.width / 2,ctx.canvas.height - 100,"#FFFFFF","60px pong","center","top",3,750);
}
}

function notafication(text,x,y,color,font,align,baseline,count,interval) {
//apply passed vars to global vars
notafication.text = text;
notafication.x = x;
notafication.y = y;
notafication.color = color;
notafication.font = font;
notafication.align = align;
notafication.baseline = baseline;
//enable notafication rendering
render.notafication = true;
//toggle notafication x times
clearInterval(pingpong.flashTimer);
pingpong.flashTimer = setInterval(function() {
	count--;
	if (count%2 == 1) {
		render.notafication = true;
	}
	else {
		render.notafication = false;
	}
	if (count == 0) {
		clearInterval(pingpong.flashTimer);
		render.notafication = false;
	}
},interval);
}

function pause() {
//if not paused, pause game
if (!pingpong.paused) {
	//stop game loop and change render toggles
	clearInterval(pingpong.gameloop);
	render.scoreA = false;
	render.scoreB = false;
	render.paused = true;
	//re-enable rendering seperate from gameloop
	pingpong.pauseloop = setInterval(function() {
		renderGraphics();
		//key listener for unpause
		if (pingpong.pressedKeys[KEY.P].isDown) {
			if (!pingpong.pressedKeys[KEY.P].wasDown) {
				pause();
			}
		}
		for (var keyCode in KEY) {
			if (KEY.hasOwnProperty(keyCode)) {
				pingpong.pressedKeys[KEY[keyCode]].wasDown = pingpong.pressedKeys[KEY[keyCode]].isDown;
			}
		}
	},1000/pingpong.fps);
	pingpong.paused = true;
}
else {
	//disable pauseloop, re-enable gameloop
	clearInterval(pingpong.pauseloop);
	render.paused = false;
	render.scoreA = true;
	render.scoreB = true;
	pingpong.gameloop = setInterval(gameloop,1000/pingpong.fps);
	pingpong.paused = false;
}
}
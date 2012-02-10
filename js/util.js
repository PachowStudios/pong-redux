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
ball.x = ctxWD2 - (ball.width / 2);
ball.y = probability(ctxHD2) + (ctxH / 4);
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
pingpong.notafications.push(notafication({text:"3",x:ctxWD2,y:ctxH - 100,font:"60px pong",color:"#FFFFFF",baseline:"top",align:"center",count:1,interval:500}));
setTimeout(function() {
	pingpong.notafications.push(notafication({text:"2",x:ctxWD2,y:ctxH - 100,font:"60px pong",color:"#FFFFFF",baseline:"top",align:"center",count:1,interval:500}));
},500);
setTimeout(function() {
	pingpong.notafications.push(notafication({text:"1",x:ctxWD2,y:ctxH - 100,font:"60px pong",color:"#FFFFFF",baseline:"top",align:"center",count:1,interval:500}));
},1000);
setTimeout(function() {
	pingpong.notafications.push(notafication({text:"GO",x:ctxWD2,y:ctxH - 100,font:"60px pong",color:"#FFFFFF",baseline:"top",align:"center",count:1,interval:500}));
	ball.speed = dspeed;
	pingpong.respawning = false;
},1500);
}

function increaseBallSpeed() {
//get the probability of 1 in 4 and increase ball speed
if (probability(4) == 1) {
	ball.speedModifier++;
	pingpong.notafications.push(notafication({text:"Speed Increased!",x:ctxWD2,y:ctxH - 100,font:"60px pong",color:"#FFFFFF",baseline:"top",align:"center",count:3,interval:750}));
}
}

function notafication(I) {
I.active = true;
I.render = true;
I.flashTimer = setInterval(function() {
	if (!pingpong.paused) {
		I.count--;
		if (I.count%2 == 1) {
			I.render = true;
		}
		else {
			I.render = false;
		}
		if (I.count == 0) {
			clearInterval(I.flashTimer);
			I.render = false;
			I.active = false;
		}
	}
},I.interval);
return I;
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
/*****************/
/* vars and init */
/*****************/

function init() {
//setup canvas
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
//var arrays
KEY = {
	UP: 38,
	DOWN: 40,
	W: 87,
	S: 83,
	D: 68,
	P: 80,
	O: 79,
	I: 73
}
pingpong = {
	fps: 60,
	win: 10,
	pressedKeys: [],
	debug: false,
	paused: false,
	respawning: false,
	ball: {         
		x: null,
		y: null,
		width: 20,
		height: 20,
		speed: 5,
		speedModifier: 0,
		directionX: 1,
		directionY: 1,
		color: "#FFFFFF",
	},
	paddleA: {
		x: 100,
		y: null,
		width: 10,
		height: 80,
		heightModifier: 0,
		speed: 8,
		speedModifier: 0,
		color: "#FFFFFF",
		expanded: false,
		shrunk: false,
	},
	paddleB: {
		x: null,
		y: null,
		width: 10,
		height: 80,
		heightModifier: 0,
		speed: 8,
		speedModifier: 0,
		color: "#FFFFFF",
		expanded: false,
		shrunk: false,
	},
	scoreA: {
		value: 0,
		x: null,
		y: 20,
		color: "#FFFFFF",
	},
	scoreB: {
		value: 0,
		x: null,
		y: 20,
		color: "#FFFFFF",
	},
	complete: {
		value: false,
		text: null,
		x: null,
		y: 20,
		color: "#FFFFFF",
	},
	notafication: {
		text: null,
		x: null,
		y: null,
		color: "#FFFFFF",
		font: "60px pong",
		align: "center",
		baseline: "top",
	},
	powerup: {
		x: null,
		y: null,
		width: 10,
		height: 10,
		speed: 5,
		color: "#FFFFFF",
		active: false,
		move: false,
		dir: null,
		obj: null,
	},
	paddleAI: {
		paddleA: false,
		paddleB: false,
	},
	render: {
		ball: true,
		paddleA: true,
		paddleB: true,
		scoreA: true,
		scoreB: true,
		notafication: false,
		powerup: false,
		complete: false,
		paused: false,
		version: true
	}
};
//redefine sub-arrays
ball = pingpong.ball;
paddleA = pingpong.paddleA;
paddleB = pingpong.paddleB;
scoreA = pingpong.scoreA;
scoreB = pingpong.scoreB;
complete = pingpong.complete;
powerup = pingpong.powerup;
paddleAI = pingpong.paddleAI;
render = pingpong.render;
//adjust positioning according to window size
paddleA.y = (ctx.canvas.height - paddleA.height) / 2;
paddleB.y = (ctx.canvas.height - paddleB.height) / 2;
paddleB.x = ctx.canvas.width - 100 - paddleB.width;
scoreA.x = (ctx.canvas.width / 2) - 200;
scoreB.x = (ctx.canvas.width / 2) + 200;
complete.x = (ctx.canvas.width / 2);
//get the ball rolling (not really)
respawnBall();
//initialize key listeners
for (var keyCode in KEY) {
	if (KEY.hasOwnProperty(keyCode)) {
		pingpong.pressedKeys[KEY[keyCode]] = {
			isDown: false,
			wasDown: false
		};
	}
}
$(document).keydown(function(e) {
	for (var x in KEY) {
		if (KEY[x] == e.which) {
			pingpong.pressedKeys[e.which].isDown = true;
		}
	}
});
$(document).keyup(function(e) {
	for (var x in KEY) {
		if (KEY[x] == e.which) {
			pingpong.pressedKeys[e.which].isDown = false;
		}
	}
});
//initialize gameloop
pingpong.gameloop = setInterval(gameloop,1000/pingpong.fps);
}

/************/
/* gameloop */
/************/

function gameloop() {
checkInput();
calculateAI();
moveBall();
checkCollision();
checkComplete();
calculatePowerups();
renderGraphics();
}

function renderGraphics() {
//resize if window size changes
if (ctx.canvas.width != window.innerWidth || ctx.canvas.height != window.innerHeight) {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	paddleA.y = (ctx.canvas.height - paddleA.height) / 2;
	paddleB.y = (ctx.canvas.height - paddleB.height) / 2;
	paddleB.x = ctx.canvas.width - 100 - paddleB.width;
	scoreA.x = (ctx.canvas.width / 2) - 200;
	scoreB.x = (ctx.canvas.width / 2) + 200;
}
//clear canvas
ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
//draw ball
if (render.ball) {
	ctx.fillStyle = ball.color;
	ctx.fillRect(ball.x,ball.y,ball.width,ball.height);
}
//draw paddleA
if (render.paddleA) {
	ctx.fillStyle = paddleA.color;
	ctx.fillRect(paddleA.x,paddleA.y,paddleA.width,paddleA.height + paddleA.heightModifier);
}
//draw paddleB
if (render.paddleB) {
	ctx.fillStyle = paddleB.color;
	ctx.fillRect(paddleB.x,paddleB.y,paddleB.width,paddleB.height + paddleB.heightModifier);
}
//draw powerup
if (render.powerup) {
	ctx.fillStyle = powerup.color;
	ctx.fillRect(powerup.x,powerup.y,powerup.width,powerup.height);
}
//draw scores
ctx.font = "120px pong";
ctx.textAlign = "center";
ctx.textBaseline = "top";
if (render.scoreA) {
	ctx.fillStyle = scoreA.color;
	ctx.fillText(scoreA.value,scoreA.x,scoreA.y);
}
if (render.scoreB) {
	ctx.fillStyle = scoreB.color;
	ctx.fillText(scoreB.value,scoreB.x,scoreB.y);
}
//draw win screen
if (render.complete) {
	ctx.fillStyle = complete.color;
	ctx.fillText(complete.text,complete.x,complete.y);
}
//draw pause screen
if (render.paused) {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Paused",ctx.canvas.width / 2,20);
}
//draw version number
if (render.version) {
	ctx.font = "20px pong";
	ctx.textAlign = "right";
	ctx.fillText("v1.4",ctx.canvas.width - 5,5);
}
//draw notafication
if (render.notafication) {
	ctx.font = notafication.font;
	ctx.textAlign = notafication.align;
	ctx.textBaseline = notafication.baseline;
	ctx.fillStyle = notafication.color;
	ctx.fillText(notafication.text,notafication.x,notafication.y);
}
}

function checkInput() {
//move paddleB up
if (pingpong.pressedKeys[KEY.UP].isDown && paddleB.y > 0 && !paddleAI.paddleB) {
	paddleB.y -= paddleB.speed + paddleB.speedModifier;
}
//mobe paddleB down
if (pingpong.pressedKeys[KEY.DOWN].isDown && paddleB.y + paddleB.height + paddleB.heightModifier< ctx.canvas.height && !paddleAI.paddleB) {
	paddleB.y += paddleB.speed + paddleB.speedModifier;
}
//move paddleA up
if (pingpong.pressedKeys[KEY.W].isDown && paddleA.y > 0 && !paddleAI.paddleA) {
	paddleA.y -= paddleA.speed + paddleA.speedModifier;
}
//move paddleA down
if (pingpong.pressedKeys[KEY.S].isDown && paddleA.y + paddleA.height + paddleA.heightModifier < ctx.canvas.height && !paddleAI.paddleA) {
	paddleA.y += paddleA.speed + paddleA.speedModifier;
}
//pause game
if (pingpong.pressedKeys[KEY.P].isDown && !pingpong.pressedKeys[KEY.P].wasDown) {
	pause();
}
//slow down ball and paddles [DEBUG]
if (pingpong.pressedKeys[KEY.D].isDown && pingpong.debug) {
	if (!pingpong.pressedKeys[KEY.D].wasDown) {
		ball.speedModifier -= 4.5;
		paddleA.speedModifier -= 9;
		paddleB.speedModifier -= 9;
	}
} 
//return ball and paddles to normal speed [DEBUG]
else if (pingpong.pressedKeys[KEY.D].wasDown && pingpong.debug) {
	ball.speedModifier += 4.5;
	paddleA.speedModifier += 9;
	paddleB.speedModifier += 9;
}
for (var keyCode in KEY) {
	if (KEY.hasOwnProperty(keyCode)) {
		pingpong.pressedKeys[KEY[keyCode]].wasDown = pingpong.pressedKeys[KEY[keyCode]].isDown;
	}
}
}

function calculateAI() {
for (paddle in paddleAI) {
	var obj = pingpong[paddle];
	var by = ctx.canvas.height / 2;
	if (!paddleAI[paddle]) {
		return;
	}
	switch(paddle) {
		case "paddleA":
			if (ball.x + (ball.width / 2) <= ctx.canvas.width * 0.4 && ball.directionX == -1) {
				by = ball.y + (ball.height / 2) - ((obj.height + obj.heightModifier) / 2);
			}
			if (powerup.x <= ctx.canvas.width * 0.4 || ball.directionX == 1) {
				if (render.powerup && ball.x + (ball.width / 2) > ctx.canvas.width * 0.3) {
					by = powerup.y + (powerup.height / 2) - ((obj.height + obj.heightModifier) / 2);
				}
			}
			break;
		case "paddleB":
			if (ball.x + (ball.width / 2) >= ctx.canvas.width * 0.6 && ball.directionX == 1) {
				by = ball.y + (ball.height / 2) - ((obj.height + obj.heightModifier) / 2);
			}
			if (powerup.x >= ctx.canvas.width * 0.6 || ball.directionX == -1) {
				if (render.powerup && ball.x + (ball.width / 2) < ctx.canvas.width * 0.7) {
					by = powerup.y + (powerup.height / 2) - ((obj.height + obj.heightModifier) / 2);
				}
			}
			break;
	}
    if (by > obj.y + ((obj.height + obj.heightModifier) / 2)) {
        obj.y += obj.speed + obj.speedModifier;
    }
    else if (by < obj.y - ((obj.height + obj.heightModifier) / 2)) {
            obj.y -= obj.speed + obj.speedModifier;
	}
}
}

function moveBall() {
//check top edge
if (ball.y < 0) {
	ball.directionY = 1;
}
//check bottom edge
if (ball.y + 20 > ctx.canvas.height) {
	ball.directionY = -1;
}
//actualy move the ball
ball.x += (ball.speed + ball.speedModifier) * ball.directionX;
ball.y += (ball.speed + ball.speedModifier) * ball.directionY;
}

function checkCollision() {
//ball
//left paddle
if (ball.x <= paddleA.x + paddleA.width && ball.x + ball.width >= paddleA.x) {
	if (ball.y <= paddleA.y + paddleA.height + paddleA.heightModifier && ball.y + ball.height >= paddleA.y) {
		ball.directionX = 1;
		if (ball.y + (ball.height / 2) <= paddleA.y + (paddleA.height * 0.25)){
			ball.directionY = -1;
		}
		else if (ball.y + (ball.height / 2) >= paddleA.y + (paddleA.height * 0.75)) {
			ball.directionY = 1;
		}
		increaseBallSpeed();
	}
}
//right paddle
if (ball.x + ball.width >= paddleB.x && ball.x <= paddleB.x + paddleB.width) {
	if (ball.y <= paddleB.y + paddleB.height + paddleB.heightModifier && ball.y + ball.height >= paddleB.y) {
		ball.directionX = -1;
		if (ball.y + (ball.height / 2) <= paddleB.y + (paddleB.height * 0.25)){
			ball.directionY = -1;
		}
		else if (ball.y + (ball.height / 2) >= paddleB.y + (paddleB.height * 0.75)) {
			ball.directionY = 1;
		}
		increaseBallSpeed();
	}
}
//left edge
if (ball.x < -20) {
	//player A lost, reset ball
	scoreB.value++;
	if (scoreB.value < pingpong.win) {
		respawnBall();
	}
}
//right edge
if (ball.x > ctx.canvas.width) {
	//player B lost, reset ball
	scoreA.value++;
	if (scoreA.value < pingpong.win) {
		respawnBall();
	}
}
//powerup
//left paddle
if (powerup.x <= paddleA.x + paddleA.width && powerup.x + powerup.width >= paddleA.x && render.powerup) {
	if (powerup.y + powerup.height >= paddleA.y && powerup.y <= paddleA.y + paddleA.height + paddleA.heightModifier) {
		render.powerup = false;
		clearInterval(pingpong.movePowerup);
		powerup.obj = paddleA;
		applyPowerup();
	}
}
//right paddle
if (powerup.x + powerup.width >= paddleB.x && powerup.x <= paddleB.x + paddleB.width && render.powerup) {
	if (powerup.y + powerup.height >= paddleB.y && powerup.y <= paddleB.y + paddleB.height + paddleB.heightModifier) {
		render.powerup = false;
		clearInterval(pingpong.movePowerup);
		powerup.obj = paddleB;
		applyPowerup();
	}
}
//left edge
if (powerup.x <= 0) {
	render.powerup = false;
	powerup.move = false;
}
//right edge
if (powerup.x + powerup.width >= ctx.canvas.width) {
	render.powerup = false;
	powerup.move = false;
}
}

function checkComplete() {
//check scoreA
if (scoreA.value >= pingpong.win) {
	complete.text = "Player 1 wins!";
	complete.value = true;
}
//check scoreB
if (scoreB.value >= pingpong.win) {
	complete.text = "Player 2 wins!";
	complete.value = true;
}
//if complete, end game
if (complete.value == true) {
	render.ball = false;
	render.paddleA = false;
	render.paddleB = false;
	render.powerup = false;
	scoreA.y = complete.y + 150;
	scoreB.y = complete.y + 150;
	render.complete = true;
	clearInterval(pingpong.gameloop);
	renderGraphics();
}
}

function calculatePowerups() {
if (probability(100) == 1 && !render.powerup && !powerup.active && !pingpong.respawning) {
	if (probability(2) == 1) {
		//go left
		powerup.dir = -1;
		powerup.x = probability(ctx.canvas.width / 8) + (ctx.canvas.width * 0.25);
	}
	else {
		//go right
		powerup.dir = 1;
		powerup.x = probability(ctx.canvas.width / 8) + (ctx.canvas.width * 0.5);
	}
	powerup.y = probability(ctx.canvas.height / 2) + (ctx.canvas.height / 8);
	render.powerup = true;
	powerup.move = true;
}
if (powerup.move) {
	powerup.x += powerup.speed * powerup.dir;
}
}

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

/************/
/* powerups */
/************/

function applyPowerup() {
switch(probability(4)) {
	//expand powerup
	case 0:
		powerup.active = true;
		expand(powerup.obj,2,40,10);
		break;
	//shrink powerdown
	case 1:
		powerup.active = true;
		shrink(powerup.obj,2,-40,10);
		break;
	//speed powerup
	case 2:
		powerup.active = true;
		paddleSpeed(powerup.obj,8,10);
		break;
	//speed powerdown
	case 3:
		powerup.active = true;
		paddleSpeed(powerup.obj,-4,10);
		break;
}
}

function expand(paddle,inc,amt,time) {
//animate expansion if not active
if (!paddle.expanded) {
	if (paddle.x <= ctx.canvas.width / 2) {
		notafication("Paddle Expand!",10,ctx.canvas.height - 10,"#FFFFFF","30px pong","left","bottom",3,750);
	}
	else {
		notafication("Paddle Expand!",ctx.canvas.width - 10,ctx.canvas.height - 10,"#FFFFFF","30px pong","right","bottom",3,750);
	}
	//get current height modifier for reference
	var origM = paddle.heightModifier;
	paddle.expanded = true;
	paddle.expand_expandloop = setInterval(function() {
		paddle.heightModifier += inc;
		paddle.y -= inc / 2;
		if (paddle.heightModifier >= amt + origM) {
			clearInterval(paddle.expand_expandloop);
		}
	},1000/pingpong.fps);
	//return to normal size after set time
	setTimeout(function() {
		//update current height modifier in case it changed due to multiple powerups
		var newM = paddle.heightModifier;
		paddle.expand_shrinkloop = setInterval(function() {
			paddle.heightModifier -= inc;
			paddle.y += inc / 2;
			if (paddle.heightModifier <= newM - amt) {
				clearInterval(paddle.expand_shrinkloop);
				paddle.expanded = false;
				powerup.active = false;
			}
		},1000/pingpong.fps);
	},1000*time);
}
//end if powerup is already active
else if (paddle.expanded) {
	return
}
}

function shrink(paddle,inc,amt,time) {
//animate shrinkage if not active
if (!paddle.shrunk) {
	if (paddle.x <= ctx.canvas.width / 2) {
		notafication("Paddle Shrink!",10,ctx.canvas.height - 10,"#FFFFFF","30px pong","left","bottom",3,750);
	}
	else {
		notafication("Paddle Shrink!",ctx.canvas.width - 10,ctx.canvas.height - 10,"#FFFFFF","30px pong","right","bottom",3,750);
	}
	//get current height modifier for reference
	var origM = paddle.heightModifier;
	paddle.shrunk = true;
	paddle.shrink_shrinkloop = setInterval(function() {
		paddle.heightModifier -= inc;
		paddle.y += inc / 2;
		if (paddle.heightModifier <= amt + origM) {
			clearInterval(paddle.shrink_shrinkloop);
		}
	},1000/pingpong.fps);
	//return to normal size after set time
	setTimeout(function() {
		//update current height modifier in case it changed due to multiple powerups
		var newM = paddle.heightModifier;
		paddle.shrink_expandloop = setInterval(function() {
			paddle.heightModifier += inc;
			paddle.y -= inc / 2;
			if (paddle.heightModifier >= newM - amt) {
				clearInterval(paddle.shrink_expandloop);
				paddle.shrunk = false;
				powerup.active = false;
			}
		},1000/pingpong.fps);
	},1000*time);
}
//end if powerup is already active
else if (paddle.shrunk) {
	return
}
}

function paddleSpeed(paddle,amt,time) {
if (!paddle.speedpowerup) {
	if (amt >= 0) {
		if (paddle.x <= ctx.canvas.width / 2) {
			notafication("Paddle Speedup!",10,ctx.canvas.height - 10,"#FFFFFF","30px pong","left","bottom",3,750);
		}
		else {
			notafication("Paddle Speedup!",ctx.canvas.width - 10,ctx.canvas.height - 10,"#FFFFFF","30px pong","right","bottom",3,750);
		}
	}
	else {
		if (paddle.x <= ctx.canvas.width / 2) {
			notafication("Paddle Slowdown!",10,ctx.canvas.height - 10,"#FFFFFF","30px pong","left","bottom",3,750);
		}
		else {
			notafication("Paddle Slowdown!",ctx.canvas.width - 10,ctx.canvas.height - 10,"#FFFFFF","30px pong","right","bottom",3,750);
		}
	}
	paddle.speedpowerup = true;
	paddle.speedModifier += amt;
	setTimeout(function() {
		paddle.speedModifier -= amt;
		paddle.speedpowerup = false;
		powerup.active = false;
	},1000*time);
}
else if (paddle.speedpowerup) {
	return
}
}
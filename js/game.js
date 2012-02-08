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
	pressedKeys: [],
	debug: false,
	paused: false,
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
		speed: 12,
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
		speed: 12,
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
	},
	render: {
		scoreA: true,
		scoreB: true,
		notafication: false,
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
moveBall();
checkCollision();
checkComplete();
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
ctx.fillStyle = ball.color;
ctx.fillRect(ball.x,ball.y,ball.width,ball.height);
//draw paddleA
ctx.fillStyle = paddleA.color;
ctx.fillRect(paddleA.x,paddleA.y,paddleA.width,paddleA.height + paddleA.heightModifier);
//draw paddleB
ctx.fillStyle = paddleB.color;
ctx.fillRect(paddleB.x,paddleB.y,paddleB.width,paddleB.height + paddleB.heightModifier);
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
ctx.font = "60px pong";
//draw notafication
if (render.notafication) {
	ctx.fillStyle = notafication.color;
	ctx.fillText(notafication.text,notafication.x,notafication.y);
}
//draw version number
if (render.version) {
	ctx.font = "20px pong";
	ctx.textAlign = "right";
	ctx.fillText("v1.1",ctx.canvas.width - 5,5);
}
}

function checkInput() {
//move paddleB up
if (pingpong.pressedKeys[KEY.UP].isDown) {
	if (paddleB.y > 0) {
		paddleB.y -= paddleB.speed + paddleB.speedModifier;
	}
}
//mobe paddleb down
if (pingpong.pressedKeys[KEY.DOWN].isDown) {
	if (paddleB.y + paddleB.height + paddleB.heightModifier< ctx.canvas.height) {
		paddleB.y += paddleB.speed + paddleB.speedModifier;
	}
}
//move paddleA up
if (pingpong.pressedKeys[KEY.W].isDown) {
	if (paddleA.y > 0) {
		paddleA.y -= paddleA.speed + paddleA.speedModifier;
	}
}
//move paddleA down
if (pingpong.pressedKeys[KEY.S].isDown) {
	if (paddleA.y + paddleA.height + paddleA.heightModifier < ctx.canvas.height) {
		paddleA.y += paddleA.speed + paddleA.speedModifier;
	}
}
//pause game
if (pingpong.pressedKeys[KEY.P].isDown) {
	if (!pingpong.pressedKeys[KEY.P].wasDown) {
		pause();
	}
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
//test paddle expansion [DEBUG]
if (pingpong.pressedKeys[KEY.O].isDown && pingpong.debug) {
	if (!pingpong.pressedKeys[KEY.O].wasDown) {
		expand(paddleB,2,40,3);
	}
}
//test paddle shrinkage [DEBUG]
if (pingpong.pressedKeys[KEY.I].isDown && pingpong.debug) {
	if (!pingpong.pressedKeys[KEY.I].wasDown) {
		shrink(paddleB,2,-40,3);
	}
}
for (var keyCode in KEY) {
	if (KEY.hasOwnProperty(keyCode)) {
		pingpong.pressedKeys[KEY[keyCode]].wasDown = pingpong.pressedKeys[KEY[keyCode]].isDown;
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
//check right edge
if (ball.x > ctx.canvas.width) {
	//player B lost, reset ball
	scoreA.value++;
	respawnBall();
}
//check left edge
if (ball.x < -20) {
	//player A lost, reset ball
	scoreB.value++;
	respawnBall();
}
//actualy move the ball
ball.x += (ball.speed + ball.speedModifier) * ball.directionX;
ball.y += (ball.speed + ball.speedModifier) * ball.directionY;
}

function checkCollision() {
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
}

function checkComplete() {
//check scoreA
if (scoreA.value >= 10) {
	complete.text = "Player 1 wins!";
	complete.value = true;
}
//check scoreB
if (scoreB.value >= 10) {
	complete.text = "Player 2 wins!";
	complete.value = true;
}
//if complete, end game
if (complete.value == true) {
	render.scoreA = false;
	render.scoreB = false;
	render.complete = true;
	clearInterval(pingpong.gameloop);
	renderGraphics();
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
//reset ball coords
ball.x = (ctx.canvas.width / 2) - (ball.width / 2);
ball.y = probability(ctx.canvas.height / 2) + (ctx.canvas.height / 4);
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
}

function increaseBallSpeed() {
//get the probability of 1 in 3 and increase ball speed
if (probability(3) == 1) {
	ball.speedModifier++;
	notafication("Speed Increased!",ctx.canvas.width / 2,ctx.canvas.height - 100,"#FFFFFF",3,750);
}
}

function notafication(text,x,y,color,count,interval) {
//apply passed vars to global vars
notafication.text = text;
notafication.x = x;
notafication.y = y;
notafication.color = color;
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

function expand(paddle,inc,amt,time) {
//animate expansion if not active
if (!paddle.expanded) {
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
		//update current height modifier in case it may have changed due to multiple powerups
		var newM = paddle.heightModifier;
		paddle.expand_shrinkloop = setInterval(function() {
			paddle.heightModifier -= inc;
			paddle.y += inc / 2;
			if (paddle.heightModifier <= newM - amt) {
				clearInterval(paddle.expand_shrinkloop);
				paddle.expanded = false;
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
		//update current height modifier in case it may have changed due to multiple powerups
		var newM = paddle.heightModifier;
		paddle.shrink_expandloop = setInterval(function() {
			paddle.heightModifier += inc;
			paddle.y -= inc / 2;
			if (paddle.heightModifier >= newM - amt) {
				clearInterval(paddle.shrink_expandloop);
				paddle.shrunk = false;
			}
		},1000/pingpong.fps);
	},1000*time);
}
//end if powerup is already active
else if (paddle.shrunk) {
	return
}
}
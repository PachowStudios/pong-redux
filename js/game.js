/*****************/
/* vars and init */
/*****************/

function init() {
//setup canvas
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
//setup overlay
overlay = document.getElementById("overlay");
ctxOverlay = overlay.getContext("2d");
ctxOverlay.canvas.width = window.innerWidth;
ctxOverlay.canvas.height = window.innerHeight;
//var arrays
KEY = {
	UP: 38,
	DOWN: 40,
	W: 87,
	S: 83,
	D: 68,
	P: 80,
	O: 79
}
pingpong = {
	fps: 60,
	pressedKeys: [],
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
//clarify some vars
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
renderGraphics();
checkInput();
moveBall();
checkCollision();
checkComplete();
}

function renderGraphics() {
//resize if window size changes
if (ctx.canvas.width != window.innerWidth || ctx.canvas.height != window.innerHeight) {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctxOverlay.canvas.width = ctx.canvas.width;
	ctxOverlay.canvas.height = ctx.canvas.height;
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
if (render.complete) {
	ctx.fillStyle = complete.color;
	ctx.fillText(complete.text,complete.x,complete.y);
}
if (render.paused) {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Paused",ctx.canvas.width / 2,20);
}
ctx.font = "60px pong";
if (render.notafication) {
	ctx.fillStyle = notafication.color;
	ctx.fillText(notafication.text,notafication.x,notafication.y);
}
if (render.version) {
	ctx.font = "20px pong";
	ctx.textAlign = "right";
	ctx.fillText("v1.0",ctx.canvas.width - 5,5);
}
}

function checkInput() {
if (pingpong.pressedKeys[KEY.UP].isDown) {
	if (paddleB.y > 0) {
		paddleB.y -= paddleB.speed + paddleB.speedModifier;
	}
}
if (pingpong.pressedKeys[KEY.DOWN].isDown) {
	if (paddleB.y + paddleB.height + paddleB.heightModifier< ctx.canvas.height) {
		paddleB.y += paddleB.speed + paddleB.speedModifier;
	}
}
if (pingpong.pressedKeys[KEY.W].isDown) {
	if (paddleA.y > 0) {
		paddleA.y -= paddleA.speed + paddleA.speedModifier;
	}
}
if (pingpong.pressedKeys[KEY.S].isDown) {
	if (paddleA.y + paddleA.height + paddleA.heightModifier < ctx.canvas.height) {
		paddleA.y += paddleA.speed + paddleA.speedModifier;
	}
}
if (pingpong.pressedKeys[KEY.P].isDown) {
	if (!pingpong.pressedKeys[KEY.P].wasDown) {
		pause();
	}
}
/*if (pingpong.pressedKeys[KEY.D].isDown) {
	if (!pingpong.pressedKeys[KEY.D].wasDown) {
		ball.speedModifier -= 4.5;
		paddleA.speedModifier -= 9;
		paddleB.speedModifier -= 9;
	}
} 
else if (pingpong.pressedKeys[KEY.D].wasDown) {
	ball.speedModifier += 4.5;
	paddleA.speedModifier += 9;
	paddleB.speedModifier += 9;
}
if (pingpong.pressedKeys[KEY.O].isDown) {
	if (!pingpong.pressedKeys[KEY.O].wasDown) {
		expand(paddleA,2,40,10);
	}
}*/
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
if (ball.x < paddleA.x + paddleA.width && ball.x > paddleA.x) {
	if (ball.y <= paddleA.y + paddleA.height + paddleA.heightModifier && ball.y + ball.height >= paddleA.y) {
		ball.directionX = 1;
		increaseBallSpeed();
	}
}
//right paddle
if (ball.x + ball.width >= paddleB.x && ball.x + ball.width <= paddleB.x + paddleB.width) {
	if (ball.y <= paddleB.y + paddleB.height + paddleB.heightModifier && ball.y + ball.height >= paddleB.y) {
		ball.directionX = -1;
		increaseBallSpeed();
	}
}
}

function checkComplete() {
if (scoreA.value >= 10) {
	complete.text = "Player 1 wins!";
	complete.value = true;
}
if (scoreB.value >= 10) {
	complete.text = "Player 2 wins!";
	complete.value = true;
}
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
return Math.floor(Math.random()*max);
}

function respawnBall() {
ball.x = (ctx.canvas.width / 2) - (ball.width / 2);
ball.y = probability(ctx.canvas.height / 2) + (ctx.canvas.height / 4);
ball.speedModifier = 0;
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
if (probability(3) == 1) {
	ball.speedModifier++;
	notafication("Speed Increased!",ctx.canvas.width / 2,ctx.canvas.height - 100,"#FFFFFF",3,750);
}
}

function notafication(text,x,y,color,count,interval) {
notafication.text = text;
notafication.x = x;
notafication.y = y;
notafication.color = color;
render.notafication = true;
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
if (!pingpong.paused) {
	clearInterval(pingpong.gameloop);
	render.scoreA = false;
	render.scoreB = false;
	render.paused = true;
	pingpong.pauseloop = setInterval(function() {
		renderGraphics();
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
if (paddle.expanded == false) {
	paddle.expanded = true;
	pingpong.expandloop = setInterval(function() {
		paddle.heightModifier += inc;
		paddle.y -= inc / 2;
		if (paddle.heightModifier >= amt) {
			clearInterval(pingpong.expandloop);
		}
	},1000/pingpong.fps);
	setTimeout(function() {
		pingpong.shrinkloop = setInterval(function() {
			paddle.heightModifier -= inc;
			paddle.y += inc / 2;
			if (paddle.heightModifier <= 0) {
				clearInterval(pingpong.shrinkloop);
				paddle.expanded = false;
			}
		},1000/pingpong.fps);
	},1000*time);
}
else if (paddle.expanded == true) {
	return;
}
}
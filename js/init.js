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
	debug: true,
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
		paddleA: true,
		paddleB: true,
		miss: 0,
		difficulty: 500,
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
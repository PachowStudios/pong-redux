/*****************/
/* vars and init */
/*****************/

function init() {
//setup canvas
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctxW = ctx.canvas.width;
ctxH = ctx.canvas.height;
ctxWD2 = ctxW / 2;
ctxHD2 = ctxH / 2;
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
pong = {
	ver: "v1.6beta",
	fps: 60,
	win: 10,
	pressedKeys: [],
	ntfs: [],
	pwrs: [],
	debug: true,
	paused: false,
	respawning: false,
	ball: {         
		x: null,
		y: null,
		w: 20,
		wM: 0,
		h: 20,
		hM: 0,
		s: 5,
		sM: 0,
		dirX: 1,
		dirY: 1,
		c: "#FFFFFF",
	},
	pA: {
		x: 100,
		y: null,
		w: 10,
		h: 80,
		hM: 0,
		s: 8,
		sM: 0,
		c: "#FFFFFF",
	},
	pB: {
		x: null,
		y: null,
		w: 10,
		h: 80,
		hM: 0,
		s: 8,
		sM: 0,
		c: "#FFFFFF",
	},
	sA: {
		val: 0,
		x: null,
		y: 20,
		c: "#FFFFFF",
	},
	sB: {
		val: 0,
		x: null,
		y: 20,
		c: "#FFFFFF",
	},
	cmpt: {
		val: false,
		txt: null,
		x: null,
		y: 20,
		c: "#FFFFFF",
	},
	pwr: {
		x: null,
		y: null,
		w: 10,
		h: 10,
		s: 5,
		c: "#FFFFFF",
		move: false,
		dir: null,
		obj: null,
		rsp: 0,
	},
	pAI: {
		pA: true,
		pB: true,
	},
	pAIOpt: {
		miss: 0,
		diff: 1000,
	},
	render: {
		ball: true,
		pA: true,
		pB: true,
		sA: true,
		sB: true,
		ntf: true,
		pwr: false,
		cmpt: false,
		paused: false,
		version: true
	}
};
//redefine sub-arrays
ball = pong.ball;
pA = pong.pA;
pB = pong.pB;
sA = pong.sA;
sB = pong.sB;
cmpt = pong.cmpt;
pwr = pong.pwr;
pAI = pong.pAI;
pAIOpt = pong.pAIOpt;
render = pong.render;
//adjust positioning according to window size
pA.y = (ctxH - pA.h) / 2;
pB.y = (ctxH - pB.h) / 2;
pB.x = ctxW - 100 - pB.w;
sA.x = ctxWD2 - 200;
sB.x = ctxWD2 + 200;
cmpt.x = ctxWD2;
//get the ball rolling (not really)
respawnBall();
//initialize key listeners
for (var keyCode in KEY) {
	if (KEY.hasOwnProperty(keyCode)) {
		pong.pressedKeys[KEY[keyCode]] = {
			isDown: false,
			wasDown: false
		};
	}
}
$(document).keydown(function(e) {
	for (var x in KEY) {
		if (KEY[x] == e.which) {
			pong.pressedKeys[e.which].isDown = true;
		}
	}
});
$(document).keyup(function(e) {
	for (var x in KEY) {
		if (KEY[x] == e.which) {
			pong.pressedKeys[e.which].isDown = false;
		}
	}
});
//initialize gameloop
pong.gameloop = setInterval(gameloop,1000/pong.fps);
}
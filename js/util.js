/*********************/
/* utility functions */
/*********************/

function rand(max) {
//generate a random whole number between 0 and max (non inclusive)
return Math.floor(Math.random()*max);
}

function dist(p1,p2) {
var xs = p2.x - p1.x;
var ys = p2.y - p1.y;
var xs = xs * xs;
var ys = ys * ys;
return Math.floor(Math.sqrt(xs + ys));
}

function respawnBall() {
pong.respawning = true;
//reset ball coords
ball.x = ctxWD2 - (ball.w / 2);
ball.y = rand(ctxHD2) + (ctxH / 4);
var ds = ball.s;
ball.s = 0;
ball.sM = 0;
//randomize ball dir
if (rand(2) == 0) {
	ball.dirX = 1;
}
else {
	ball.dirX = -1;
}
if (rand(2) == 0) {
	ball.dirY = 1;
}
else {
	ball.dirY = -1;
}
pong.ntfs.push(ntf({txt:"3",x:ctxWD2,y:ctxH - 100,f:"60px pong",c:"#FFFFFF",b:"top",a:"center",cn:1,i:500}));
setTimeout(function() {
	pong.ntfs.push(ntf({txt:"2",x:ctxWD2,y:ctxH - 100,f:"60px pong",c:"#FFFFFF",b:"top",a:"center",cn:1,i:500}));
	setTimeout(function() {
		pong.ntfs.push(ntf({txt:"1",x:ctxWD2,y:ctxH - 100,f:"60px pong",c:"#FFFFFF",b:"top",a:"center",cn:1,i:500}));
		setTimeout(function() {
			pong.ntfs.push(ntf({txt:"GO",x:ctxWD2,y:ctxH - 100,f:"60px pong",c:"#FFFFFF",b:"top",a:"center",cn:1,i:500}));
			ball.s = ds;
			pong.respawning = false;
		},500);
	},500);
},500);
}

function increaseBallSpeed() {
//get the rand of 1 in 4 and increase ball s
if (rand(4) == 1) {
	ball.sM++;
	pong.ntfs.push(ntf({txt:"Speed Increased!",x:ctxWD2,y:ctxH - 100,f:"60px pong",c:"#FFFFFF",b:"top",a:"center",cn:3,i:750}));
}
}

function ntf(I) {
I.active = true;
I.render = true;
I.flashTimer = setInterval(function() {
	if (!pong.paused) {
		I.cn--;
		if (I.cn%2 == 1) {
			I.render = true;
		}
		else {
			I.render = false;
		}
		if (I.cn == 0) {
			clearInterval(I.flashTimer);
			I.render = false;
			I.active = false;
		}
	}
},I.i);
return I;
}

function pause() {
//if not paused, pause game
if (!pong.paused) {
	//stop game loop and change render toggles
	clearInterval(pong.gameloop);
	render.sA = false;
	render.sB = false;
	render.paused = true;
	//re-enable rendering seperate from gameloop
	pong.pauseloop = setInterval(function() {
		renderGraphics();
		//key listener for unpause
		if (pong.pressedKeys[KEY.P].isDown) {
			if (!pong.pressedKeys[KEY.P].wasDown) {
				pause();
			}
		}
		for (var keyCode in KEY) {
			if (KEY.hasOwnProperty(keyCode)) {
				pong.pressedKeys[KEY[keyCode]].wasDown = pong.pressedKeys[KEY[keyCode]].isDown;
			}
		}
	},1000/pong.fps);
	pong.paused = true;
}
else {
	//disable pauseloop, re-enable gameloop
	clearInterval(pong.pauseloop);
	render.paused = false;
	render.sA = true;
	render.sB = true;
	pong.gameloop = setInterval(gameloop,1000/pong.fps);
	pong.paused = false;
}
}
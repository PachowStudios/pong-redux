/************/
/* gameloop */
/************/

function gameloop() {
checkInput();
calculateAI();
moveBall();
checkCollision();
checkcmpt();
calculatePowerups();
renderGraphics();
trimArrays();
}

function renderGraphics() {
//resize if window size changes
if (ctxW != window.innerWidth || ctxH != window.innerHeight) {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctxW = ctx.canvas.width;
	ctxH = ctx.canvas.height;
	ctxWD2 = ctxW / 2;
	ctxHD2 = ctxH / 2;
	pA.y = (ctxH - pA.h) / 2;
	pB.y = (ctxH - pB.h) / 2;
	pB.x = ctxW - 100 - pB.w;
	sA.x = ctxWD2 - 200;
	sB.x = ctxWD2 + 200;
}
//clear canvas
ctx.clearRect(0,0,ctxW,ctxH)
//draw ball
if (render.ball) {
	ctx.fillStyle = ball.c;
	ctx.fillRect(ball.x,ball.y,ball.w,ball.h);
}
//draw pA
if (render.pA) {
	ctx.fillStyle = pA.c;
	ctx.fillRect(pA.x,pA.y,pA.w,pA.h + pA.hM);
}
//draw pB
if (render.pB) {
	ctx.fillStyle = pB.c;
	ctx.fillRect(pB.x,pB.y,pB.w,pB.h + pB.hM);
}
//draw pwr
if (render.pwr) {
	ctx.fillStyle = pwr.c;
	ctx.fillRect(pwr.x,pwr.y,pwr.w,pwr.h);
}
//draw scores
ctx.font = "120px pong";
ctx.textAlign = "center";
ctx.textBaseline = "top";
if (render.sA) {
	ctx.fillStyle = sA.c;
	ctx.fillText(sA.val,sA.x,sA.y);
}
if (render.sB) {
	ctx.fillStyle = sB.c;
	ctx.fillText(sB.val,sB.x,sB.y);
}
//draw win screen
if (render.cmpt) {
	ctx.fillStyle = cmpt.c;
	ctx.fillText(cmpt.txt,cmpt.x,cmpt.y);
}
//draw pause screen
if (render.paused) {
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Paused",ctxWD2,20);
}
//draw version number
if (render.version) {
	ctx.font = "20px pong";
	ctx.textAlign = "right";
	ctx.fillText("v1.5beta",ctxW - 5,5);
}
//draw ntf
if (render.ntf) {
	pong.ntfs.forEach(function ntf(I) {
		ctx.font = I.font;
		ctx.textAlign = I.align;
		ctx.textBaseline = I.baseline;
		ctx.fillStyle = I.c;
		if (I.render) {
			ctx.fillText(I.txt,I.x,I.y);
		}
	});
}
}

function checkInput() {
//move paddleB up
if (pong.pressedKeys[KEY.UP].isDown && pB.y > 0 && !pAI.pB) {
	pB.y -= pB.s + pB.sM;
}
//mobe paddleB down
if (pong.pressedKeys[KEY.DOWN].isDown && pB.y + pB.h + pB.hM< ctxH && !pAI.pB) {
	pB.y += pB.s + pB.sM;
}
//move paddleA up
if (pong.pressedKeys[KEY.W].isDown && pA.y > 0 && !pAI.pA) {
	pA.y -= pA.s + pA.sM;
}
//move paddleA down
if (pong.pressedKeys[KEY.S].isDown && pA.y + pA.h + pA.hM < ctxH && !pAI.pA) {
	pA.y += pA.s + pA.sM;
}
//pause game
if (pong.pressedKeys[KEY.P].isDown && !pong.pressedKeys[KEY.P].wasDown) {
	pause();
}
//slow down ball and paddles [DEBUG]
if (pong.pressedKeys[KEY.D].isDown && pong.debug) {
	if (!pong.pressedKeys[KEY.D].wasDown) {
		ball.sM -= 4.5;
		pA.sM -= 9;
		pB.sM -= 9;
	}
} 
//return ball and paddles to normal speed [DEBUG]
else if (pong.pressedKeys[KEY.D].wasDown && pong.debug) {
	ball.sM += 4.5;
	pA.sM += 9;
	pB.sM += 9;
}
for (var keyCode in KEY) {
	if (KEY.hasOwnProperty(keyCode)) {
		pong.pressedKeys[KEY[keyCode]].wasDown = pong.pressedKeys[KEY[keyCode]].isDown;
	}
}
}

function calculateAI() {
for (paddle in pAI) {
	var obj = pong[paddle];
	var by = ctxHD2;
	if (!pAI[paddle]) {
		return;
	}
	if (pAI.miss == 0) {
		switch(rand(pAI.diff)) {
			case 0:
				pAI.miss = 30;
				break;
			case 1:
				pAI.miss = 60;
				break;
		}
	}
	else if (pAI.miss > 0) {
		pAI.miss--;
		return;
	}
	switch(paddle) {
		case "pA":
			if (ball.x + (ball.w / 2) <= ctxW * 0.4 && ball.dirX == -1) {
				by = ball.y + (ball.h / 2) - ((obj.h + obj.hM) / 2);
			}
			if (pwr.x <= ctxW * 0.4 && render.pwr) {
				if (ball.dirX == 1 || ball.x + (ball.w / 2) > ctxW * 0.3) {
					by = pwr.y + (pwr.h / 2) - ((obj.h + obj.hM) / 2);
				}
			}
			break;
		case "pB":
			if (ball.x + (ball.w / 2) >= ctxW * 0.6 && ball.dirX == 1) {
				by = ball.y + (ball.h / 2) - ((obj.h + obj.hM) / 2);
			}
			if (pwr.x >= ctxW * 0.6 && render.pwr) {
				if (ball.dirX == -1 || ball.x + (ball.w / 2) < ctxW * 0.7) {
					by = pwr.y + (pwr.h / 2) - ((obj.h + obj.hM) / 2);
				}
			}
			break;
		case "miss":
			return;
			break;
		case "diff":
			return;
			break;
	}
    if (by > obj.y + ((obj.h + obj.hM) / 2)) {
        obj.y += obj.s + obj.sM;
    }
    else if (by < obj.y - ((obj.h + obj.hM) / 2)) {
            obj.y -= obj.s + obj.sM;
	}
}
}

function moveBall() {
//check top edge
if (ball.y < 0) {
	ball.dirY = 1;
}
//check bottom edge
if (ball.y + 20 > ctxH) {
	ball.dirY = -1;
}
//actualy move the ball
ball.x += (ball.s + ball.sM) * ball.dirX;
ball.y += (ball.s + ball.sM) * ball.dirY;
}

function checkCollision() {
//ball
//left paddle
if (ball.x <= pA.x + pA.w && ball.x + ball.w >= pA.x) {
	if (ball.y <= pA.y + pA.h + pA.hM && ball.y + ball.h >= pA.y) {
		ball.dirX = 1;
		if (ball.y + (ball.h / 2) <= pA.y + (pA.h * 0.25)){
			ball.dirY = -1;
		}
		else if (ball.y + (ball.h / 2) >= pA.y + (pA.h * 0.75)) {
			ball.dirY = 1;
		}
		increaseBalls();
	}
}
//right paddle
if (ball.x + ball.w >= pB.x && ball.x <= pB.x + pB.w) {
	if (ball.y <= pB.y + pB.h + pB.hM && ball.y + ball.h >= pB.y) {
		ball.dirX = -1;
		if (ball.y + (ball.h / 2) <= pB.y + (pB.h * 0.25)){
			ball.dirY = -1;
		}
		else if (ball.y + (ball.h / 2) >= pB.y + (pB.h * 0.75)) {
			ball.dirY = 1;
		}
		increaseBalls();
	}
}
//left edge
if (ball.x < -20) {
	//player A lost, reset ball
	sB.val++;
	if (sB.val < pong.win) {
		respawnBall();
	}
}
//right edge
if (ball.x > ctxW) {
	//player B lost, reset ball
	sA.val++;
	if (sA.val < pong.win) {
		respawnBall();
	}
}
//powerup
//left paddle
if (pwr.x <= pA.x + pA.w && pwr.x + pwr.w >= pA.x && render.pwr) {
	if (pwr.y + pwr.h >= pA.y && pwr.y <= pA.y + pA.h + pA.hM) {
		render.pwr = false;
		clearInterval(pong.movepwr);
		pwr.obj = pA;
		applypwr();
	}
}
//right paddle
if (pwr.x + pwr.w >= pB.x && pwr.x <= pB.x + pB.w && render.pwr) {
	if (pwr.y + pwr.h >= pB.y && pwr.y <= pB.y + pB.h + pB.hM) {
		render.pwr = false;
		clearInterval(pong.movepwr);
		pwr.obj = pB;
		applypwr();
	}
}
//left edge
if (pwr.x <= 0) {
	render.pwr = false;
	pwr.move = false;
}
//right edge
if (pwr.x + pwr.w >= ctxW) {
	render.pwr = false;
	pwr.move = false;
}
}

function checkcmpt() {
//check scoreA
if (sA.val >= pong.win) {
	cmpt.txt = "Player 1 wins!";
	cmpt.val = true;
}
//check scoreB
if (sB.val >= pong.win) {
	cmpt.txt = "Player 2 wins!";
	cmpt.val = true;
}
//if complete, end game
if (cmpt.val == true) {
	render.ball = false;
	render.pA = false;
	render.pB = false;
	render.pwr = false;
	sA.y = cmpt.y + 150;
	sB.y = cmpt.y + 150;
	render.cmpt = true;
	clearInterval(pong.gameloop);
	renderGraphics();
}
}

function calculatePowerups() {
if (rand(100) == 1 && !render.pwr && !pwr.active && !pong.respawning) {
	if (rand(2) == 1) {
		//go left
		pwr.dir = -1;
		pwr.x = rand(ctxW / 8) + (ctxW * 0.25);
	}
	else {
		//go right
		pwr.dir = 1;
		pwr.x = rand(ctxW / 8) + (ctxW * 0.5);
	}
	pwr.y = rand(ctxHD2) + (ctxH / 8);
	render.pwr = true;
	pwr.move = true;
}
if (pwr.move) {
	pwr.x += pwr.s * pwr.dir;
}
}

function trimArrays() {
pong.ntfs = pong.ntfs.filter(function ntf(I) {
	return I.active;
});
}
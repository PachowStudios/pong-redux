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
trimArrays();
}

function renderGraphics() {
//resize if window size changes
if (ctxW != window.innerWidth || ctxH != window.innerHeight) {
	ctxW = window.innerWidth;
	ctxH = window.innerHeight;
	paddleA.y = (ctxH - paddleA.height) / 2;
	paddleB.y = (ctxH - paddleB.height) / 2;
	paddleB.x = ctxW - 100 - paddleB.width;
	scoreA.x = ctxWD2 - 200;
	scoreB.x = ctxWD2 + 200;
}
//clear canvas
ctx.clearRect(0,0,ctxW,ctxH)
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
	ctx.fillText("Paused",ctxWD2,20);
}
//draw version number
if (render.version) {
	ctx.font = "20px pong";
	ctx.textAlign = "right";
	ctx.fillText("v1.5beta",ctxW - 5,5);
}
//draw notafication
if (render.notafication) {
	pingpong.notafications.forEach(function notafication(I) {
		ctx.font = I.font;
		ctx.textAlign = I.align;
		ctx.textBaseline = I.baseline;
		ctx.fillStyle = I.color;
		if (I.render) {
			ctx.fillText(I.text,I.x,I.y);
		}
	});
}
}

function checkInput() {
//move paddleB up
if (pingpong.pressedKeys[KEY.UP].isDown && paddleB.y > 0 && !paddleAI.paddleB) {
	paddleB.y -= paddleB.speed + paddleB.speedModifier;
}
//mobe paddleB down
if (pingpong.pressedKeys[KEY.DOWN].isDown && paddleB.y + paddleB.height + paddleB.heightModifier< ctxH && !paddleAI.paddleB) {
	paddleB.y += paddleB.speed + paddleB.speedModifier;
}
//move paddleA up
if (pingpong.pressedKeys[KEY.W].isDown && paddleA.y > 0 && !paddleAI.paddleA) {
	paddleA.y -= paddleA.speed + paddleA.speedModifier;
}
//move paddleA down
if (pingpong.pressedKeys[KEY.S].isDown && paddleA.y + paddleA.height + paddleA.heightModifier < ctxH && !paddleAI.paddleA) {
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
	var by = ctxHD2;
	if (!paddleAI[paddle]) {
		return;
	}
	if (paddleAI.miss == 0) {
		switch(probability(paddleAI.difficulty)) {
			case 0:
				paddleAI.miss = 30;
				break;
			case 1:
				paddleAI.miss = 60;
				break;
		}
	}
	else if (paddleAI.miss > 0) {
		paddleAI.miss--;
		return;
	}
	switch(paddle) {
		case "paddleA":
			if (ball.x + (ball.width / 2) <= ctxW * 0.4 && ball.directionX == -1) {
				by = ball.y + (ball.height / 2) - ((obj.height + obj.heightModifier) / 2);
			}
			if (powerup.x <= ctxW * 0.4 || ball.directionX == 1) {
				if (render.powerup && ball.x + (ball.width / 2) > ctxW * 0.3) {
					by = powerup.y + (powerup.height / 2) - ((obj.height + obj.heightModifier) / 2);
				}
			}
			break;
		case "paddleB":
			if (ball.x + (ball.width / 2) >= ctxW * 0.6 && ball.directionX == 1) {
				by = ball.y + (ball.height / 2) - ((obj.height + obj.heightModifier) / 2);
			}
			if (powerup.x >= ctxW * 0.6 || ball.directionX == -1) {
				if (render.powerup && ball.x + (ball.width / 2) < ctxW * 0.7) {
					by = powerup.y + (powerup.height / 2) - ((obj.height + obj.heightModifier) / 2);
				}
			}
			break;
		case "miss":
			return;
			break;
		case "difficulty":
			return;
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
if (ball.y + 20 > ctxH) {
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
if (ball.x > ctxW) {
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
if (powerup.x + powerup.width >= ctxW) {
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
		powerup.x = probability(ctxW / 8) + (ctxW * 0.25);
	}
	else {
		//go right
		powerup.dir = 1;
		powerup.x = probability(ctxW / 8) + (ctxW * 0.5);
	}
	powerup.y = probability(ctxHD2) + (ctxH / 8);
	render.powerup = true;
	powerup.move = true;
}
if (powerup.move) {
	powerup.x += powerup.speed * powerup.dir;
}
}

function trimArrays() {
pingpong.notafications = pingpong.notafications.filter(function notafication(I) {
	return I.active;
});
}
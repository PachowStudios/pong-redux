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
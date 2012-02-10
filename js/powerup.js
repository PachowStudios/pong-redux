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
	if (paddle.x <= ctxWD2) {
		pingpong.notafications.push(notafication({text:"Paddle Expand!",x:10,y:ctxH - 10,font:"30px pong",color:"#FFFFFF",baseline:"bottom",align:"left",count:3,interval:750}));
	}
	else {
		pingpong.notafications.push(notafication({text:"Paddle Expand!",x:ctxW - 10,y:ctxH - 10,font:"30px pong",color:"#FFFFFF",baseline:"bottom",align:"right",count:3,interval:750}));
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
	if (paddle.x <= ctxWD2) {
		pingpong.notafications.push(notafication({text:"Paddle Shrink!",x:10,y:ctxH - 10,font:"30px pong",color:"#FFFFFF",baseline:"bottom",align:"left",count:3,interval:750}));
	}
	else {
		pingpong.notafications.push(notafication({text:"Paddle Expand!",x:ctxW - 10,y:ctxH - 10,font:"30px pong",color:"#FFFFFF",baseline:"bottom",align:"right",count:3,interval:750}));
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
		if (paddle.x <= ctxWD2) {
			pingpong.notafications.push(notafication({text:"Paddle Speedup!",x:10,y:ctxH - 10,font:"30px pong",color:"#FFFFFF",baseline:"bottom",align:"left",count:3,interval:750}));
		}
		else {
			pingpong.notafications.push(notafication({text:"Paddle Speedup!",x:ctxW - 10,y:ctxH - 10,font:"30px pong",color:"#FFFFFF",baseline:"bottom",align:"right",count:3,interval:750}));
		}
	}
	else {
		if (paddle.x <= ctxWD2) {
			pingpong.notafications.push(notafication({text:"Paddle Slowdown!",x:10,y:ctxH - 10,font:"30px pong",color:"#FFFFFF",baseline:"bottom",align:"left",count:3,interval:750}));
		}
		else {
			pingpong.notafications.push(notafication({text:"Paddle Slowdown!",x:ctxW - 10,y:ctxH - 10,font:"30px pong",color:"#FFFFFF",baseline:"bottom",align:"right",count:3,interval:750}));
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
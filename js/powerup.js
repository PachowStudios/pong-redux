/************/
/* pwrs */
/************/

function applypwr() {
switch(rand(4)) {
	//exp pwr
	case 0:
		pwr.active = true;
		exp(pwr.obj,2,40,10);
		break;
	//shrink powerdown
	case 1:
		pwr.active = true;
		shrink(pwr.obj,2,-40,10);
		break;
	//s pwr
	case 2:
		pwr.active = true;
		paddles(pwr.obj,8,10);
		break;
	//s powerdown
	case 3:
		pwr.active = true;
		paddles(pwr.obj,-4,10);
		break;
}
}

function exp(paddle,inc,amt,time) {
//animate expansion if not active
if (!paddle.expd) {
	if (paddle.x <= ctxWD2) {
		pong.ntfs.push(ntf({txt:"Paddle Expand!",x:10,y:ctxH - 10,font:"30px pong",c:"#FFFFFF",baseline:"bottom",align:"left",count:3,interval:750}));
	}
	else {
		pong.ntfs.push(ntf({txt:"Paddle Expand!",x:ctxW - 10,y:ctxH - 10,font:"30px pong",c:"#FFFFFF",baseline:"bottom",align:"right",count:3,interval:750}));
	}
	//get current h M for reference
	var origM = paddle.hM;
	paddle.expd = true;
	paddle.exp_exploop = setInterval(function() {
		paddle.hM += inc;
		paddle.y -= inc / 2;
		if (paddle.hM >= amt + origM) {
			clearInterval(paddle.exp_exploop);
		}
	},1000/pong.fps);
	//return to normal size after set time
	setTimeout(function() {
		//update current h M in case it changed due to multiple pwrs
		var newM = paddle.hM;
		paddle.exp_shrinkloop = setInterval(function() {
			paddle.hM -= inc;
			paddle.y += inc / 2;
			if (paddle.hM <= newM - amt) {
				clearInterval(paddle.exp_shrinkloop);
				paddle.expd = false;
				pwr.active = false;
			}
		},1000/pong.fps);
	},1000*time);
}
//end if pwr is already active
else if (paddle.expd) {
	return
}
}

function shrink(paddle,inc,amt,time) {
//animate shrinkage if not active
if (!paddle.shrunk) {
	if (paddle.x <= ctxWD2) {
		pong.ntfs.push(ntf({txt:"Paddle Shrink!",x:10,y:ctxH - 10,font:"30px pong",c:"#FFFFFF",baseline:"bottom",align:"left",count:3,interval:750}));
	}
	else {
		pong.ntfs.push(ntf({txt:"Paddle Expand!",x:ctxW - 10,y:ctxH - 10,font:"30px pong",c:"#FFFFFF",baseline:"bottom",align:"right",count:3,interval:750}));
	}
	//get current h M for reference
	var origM = paddle.hM;
	paddle.shrunk = true;
	paddle.shrink_shrinkloop = setInterval(function() {
		paddle.hM -= inc;
		paddle.y += inc / 2;
		if (paddle.hM <= amt + origM) {
			clearInterval(paddle.shrink_shrinkloop);
		}
	},1000/pong.fps);
	//return to normal size after set time
	setTimeout(function() {
		//update current h M in case it changed due to multiple pwrs
		var newM = paddle.hM;
		paddle.shrink_exploop = setInterval(function() {
			paddle.hM += inc;
			paddle.y -= inc / 2;
			if (paddle.hM >= newM - amt) {
				clearInterval(paddle.shrink_exploop);
				paddle.shrunk = false;
				pwr.active = false;
			}
		},1000/pong.fps);
	},1000*time);
}
//end if pwr is already active
else if (paddle.shrunk) {
	return
}
}

function paddles(paddle,amt,time) {
if (!paddle.spwr) {
	if (amt >= 0) {
		if (paddle.x <= ctxWD2) {
			pong.ntfs.push(ntf({txt:"Paddle Speedup!",x:10,y:ctxH - 10,font:"30px pong",c:"#FFFFFF",baseline:"bottom",align:"left",count:3,interval:750}));
		}
		else {
			pong.ntfs.push(ntf({txt:"Paddle Speedup!",x:ctxW - 10,y:ctxH - 10,font:"30px pong",c:"#FFFFFF",baseline:"bottom",align:"right",count:3,interval:750}));
		}
	}
	else {
		if (paddle.x <= ctxWD2) {
			pong.ntfs.push(ntf({txt:"Paddle Slowdown!",x:10,y:ctxH - 10,font:"30px pong",c:"#FFFFFF",baseline:"bottom",align:"left",count:3,interval:750}));
		}
		else {
			pong.ntfs.push(ntf({txt:"Paddle Slowdown!",x:ctxW - 10,y:ctxH - 10,font:"30px pong",c:"#FFFFFF",baseline:"bottom",align:"right",count:3,interval:750}));
		}
	}
	paddle.spwr = true;
	paddle.sM += amt;
	setTimeout(function() {
		paddle.sM -= amt;
		paddle.spwr = false;
		pwr.active = false;
	},1000*time);
}
else if (paddle.spwr) {
	return
}
}
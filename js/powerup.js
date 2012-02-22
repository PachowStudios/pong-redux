/************/
/* powerups */
/************/

function pwrup(I) {
I.active = true;
I.timer = 60 * I.time;
I.obj = pwr.obj;
I.x = 0;
I.y = 0;
I.f = "30px pong";
I.c = "#FFFFFF";
I.b = "bottom";
switch(pwr.obj) {
	case pA:
		I.Np = 10;
		I.Na = "left";
		break;
	case pB:
		I.Np = ctxW - 10;
		I.Na = "right"
		break;
}
switch(rand(12)) {
	case 0:
	case 1:
		pong.ntfs.push(ntf({txt:"Paddle Expand!",x:I.Np,y:ctxH - 10,f:I.f,c:I.c,b:I.b,a:I.Na,cn:3,i:750}));
		I.loop = setInterval(function() {
			if (!pong.paused) {
				I.obj.hM += I.inc;
				I.obj.y -= I.inc / 2;
				if (I.x < I.amt) I.x++;
				else clearInterval(I.loop);
			}
		},1000/pong.fps);
		I.end = function() {
			I.endloop = setInterval(function() {
				if (!pong.paused) {
					I.obj.hM -= I.inc;
					I.obj.y += I.inc / 2;
					if (I.y < I.amt) I.y++;
					else {
						clearInterval(I.endloop);
						I.active = false;
					}
				}
			},1000/pong.fps);
		}
		break;
	case 2:
		pong.ntfs.push(ntf({txt:"Paddle Shrink!",x:I.Np,y:ctxH - 10,f:I.f,c:I.c,b:I.b,a:I.Na,cn:3,i:750}));
		I.loop = setInterval(function() {
			if (!pong.paused) {
				I.obj.hM -= I.inc;
				I.obj.y += I.inc / 2;
				if (I.x < I.amt) I.x++;
				else clearInterval(I.loop);
			}
		},1000/pong.fps);
		I.end = function() {
			I.endloop = setInterval(function() {
				if (!pong.paused) {
					I.obj.hM += I.inc;
					I.obj.y -= I.inc / 2;
					if (I.y < I.amt) I.y++;
					else {
						clearInterval(I.endloop);
						I.active = false;
					}
				}
			},1000/pong.fps);
		}
		break;
	case 3:
	case 4:
		pong.ntfs.push(ntf({txt:"Paddle Speedup!",x:I.Np,y:ctxH - 10,f:I.f,c:I.c,b:I.b,a:I.Na,cn:3,i:750}));
		I.obj.sM += I.amtS;
		I.end = function() {
			I.obj.sM -= I.amtS;
			I.active = false;
		}
		break;
	case 5:
		pong.ntfs.push(ntf({txt:"Paddle Slowdown!",x:I.Np,y:ctxH - 10,f:I.f,c:I.c,b:I.b,a:I.Na,cn:3,i:750})); 
		I.obj.sM -= I.amtS / 2;
		I.end = function() {
			I.obj.sM += I.amtS / 2;
			I.active = false;
		}
		break;
	case 6:
	case 7:
		pong.ntfs.push(ntf({txt:"Ball Expand!",x:I.Np,y:ctxH - 10,f:I.f,c:I.c,b:I.b,a:I.Na,cn:3,i:750}));
		I.loop = setInterval(function() {
			if (!pong.paused) {
				ball.hM += I.inc;
				ball.wM += I.inc;
				ball.x -= I.inc / 2;
				ball.y -= I.inc / 2;
				if (I.x < I.amt / 4) I.x++;
				else clearInterval(I.loop);
			}
		},1000/pong.fps);
		I.end = function() {
			I.endloop = setInterval(function() {
				if (!pong.paused) {
					ball.hM -= I.inc;
					ball.wM -= I.inc;
					ball.x += I.inc / 2;
					ball.y += I.inc / 2;
					if (I.y < I.amt / 4) I.y++;
					else {
						clearInterval(I.endloop);
						I.active = false;
					}
				}
			},1000/pong.fps);
		}
		break;
	case 8:
		pong.ntfs.push(ntf({txt:"Ball Shrink!",x:I.Np,y:ctxH - 10,f:I.f,c:I.c,b:I.b,a:I.Na,cn:3,i:750}));
		I.loop = setInterval(function() {
			if (!pong.paused) {
				ball.hM -= I.inc;
				ball.wM -= I.inc;
				ball.x += I.inc / 2;
				ball.y += I.inc / 2;
				if (I.x < I.amt / 4) I.x++;
				else clearInterval(I.loop);
			}
		},1000/pong.fps);
		I.end = function() {
			I.endloop = setInterval(function() {
				if (!pong.paused) {
					ball.hM += I.inc;
					ball.wM += I.inc;
					ball.x -= I.inc / 2;
					ball.y -= I.inc / 2;
					if (I.y < I.amt / 4) I.y++;
					else {
						clearInterval(I.endloop);
						I.active = false;
					}
				}
			},1000/pong.fps);
		}
		break;
	case 9:
	case 10:
		pong.ntfs.push(ntf({txt:"Ball Speedup!",x:I.Np,y:ctxH - 10,f:I.f,c:I.c,b:I.b,a:I.Na,cn:3,i:750}));
		ball.sM += I.amtS / 2;
		I.end = function() {
			ball.sM -= I.amtS / 2;
			I.active = false;
		}
		break;
	case 11:
		pong.ntfs.push(ntf({txt:"Ball Slowdown!",x:I.Np,y:ctxH - 10,f:I.f,c:I.c,b:I.b,a:I.Na,cn:3,i:750}));
		ball.sM -= I.amtS / 2;
		I.end = function() {
			ball.sM += I.amtS / 2;
			I.active = false;
		}
		break;
}
return I;
}
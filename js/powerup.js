/************/
/* powerups */
/************/

function pwrup(I) {
I.active = true;
I.timer = 60 * I.time;
I.obj = pwr.obj;
I.x = 0;
I.y = 0;
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
switch(rand(6)) {
	case 0:
	case 1:
		pong.ntfs.push(ntf({txt:"Paddle Expand!",x:I.Np,y:ctxH - 10,f:"30px pong",c:"#FFFFFF",b:"bottom",a:I.Na,cn:3,i:750}));
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
		pong.ntfs.push(ntf({txt:"Paddle Shrink!",x:I.Np,y:ctxH - 10,f:"30px pong",c:"#FFFFFF",b:"bottom",a:I.Na,cn:3,i:750}));
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
		pong.ntfs.push(ntf({txt:"Paddle Speedup!",x:I.Np,y:ctxH - 10,f:"30px pong",c:"#FFFFFF",b:"bottom",a:I.Na,cn:3,i:750}));
		I.obj.sM += I.amtS;
		I.end = function() {
			I.obj.sM -= I.amtS;
			I.active = false;
		}
		break;
	case 5:
		pong.ntfs.push(ntf({txt:"Paddle Slowdown!",x:I.Np,y:ctxH - 10,f:"30px pong",c:"#FFFFFF",b:"bottom",a:I.Na,cn:3,i:750})); 
		I.obj.sM -= I.amtS / 2;
		I.end = function() {
			I.obj.sM += I.amtS / 2;
			I.active = false;
		}
		break;
}
return I;
}
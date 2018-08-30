/*
 * 
 * Developer Name: "Pankaj Bisht",
 * 
 */


function log(msg) {

     console.log(msg);
}


function Charater(x, y, w, h) {

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

Charater.prototype.leftAndRight = function (ctx) {

	ctx.drawImage(basket, this.x, this.y, this.w, this.h);
};

function MyObj(x, y) {

	this.x = x;
	this.y = y;
	this.dy = 1;
	this.w = 20;
	this.h = 20;
}

MyObj.prototype.create = function (ctx) {

    ctx.fillStyle = "red";
    ctx.drawImage(apple, this.x, this.y, this.w, this.h);
};

MyObj.prototype.move = function (ctx, cheight,cwidth, phy, missD, info) {

    this.y += this.dy;
    this.dy += phy.gravity;

    if (this.y+this.w > cheight) {

       info.increment("miss");

       this.y = -info.random("Y");
       this.dy = phy.gravity;
       this.x = info.random("X", (cwidth  - this.w));

       missD.innerHTML = info.miss;
    }
};

function Apple(x, y, w, h) {

   this.x = x;
   this.y = y;
   this.w = w;
   this.h = h;
}

/*
function Canvas (w, h) {
	
	this.cheight = cheight;
	this.cwidth = cwidth;
}
*/

function Physics () {
	
	this.gravity = 0.04;
}

function GameInformation () {
	
	this.miss = 0;
	this.count = 0;
	this.WIN = 20-1;
	this.gamePause = false;
	this.noOfApple = 4;
	
	this.y = 0;
}

GameInformation.prototype.increment = function (key) {
	
	if (key == "miss") {
		
		++this.miss;
	} else {
		
		++this.count;
	}
};

GameInformation.prototype.addMissCount = function () {
	
	return this.miss + this.count;
};


GameInformation.prototype.random = function (x, key) {
	var tmp = null; 
	
	if (x === "X") {
	
		tmp = Math.floor(Math.random() * key); 
	} else if (x === "Y") {
		
		tmp = Math.floor(Math.random() * 20) + 10; 
		log(tmp);
	} else {
		
		tmp = Math.floor(Math.random() * 40) + 20; 
	}
	return tmp;
};


(function init($w, dom) {

   	// shim layer with setTimeout fallback
   	$w.requestAnimFrame = (function() {
	      	return $w.requestAnimationFrame ||	      	
	         	    $w.webkitRequestAnimationFrame ||
	         	    $w.mozRequestAnimationFrame ||

	        function(callback) {

	      		$w.setTimeout(callback, 1000 / 60);
	         };
   	}());

// This is my Game Function

function init() {

// My sexy variable's

var can = dom.getElementById('gameCanvas'),
	ctx = can.getContext('2d'),
	sound = dom.getElementById("startC"),
	missD = dom.getElementById("miss"),
	loading = dom.getElementById("image"),
	para = dom.getElementById('score'),
	startBtn = dom.getElementById('startBtn'),
	gameOver = dom.getElementById('gameOver'),

	cwidth = can.width, cheight = can.height,
	_snow = [],
	cH = 50, cW = 40,
	cureentScreen, vx = 0,
	cObj = new Charater(cwidth / 2, cheight - 50, 40, 50);

	var physics = new Physics(),
		info = new GameInformation();
		//c = new Canvas(cwidth, cheight);
	
	
	background = new Image(); background.src = 'images/background.png';
	apple = new Image(); apple.src = 'images/apple.png';
	basket = new Image(); basket.src = 'images/basket.png';

loading.remove();

for (var i = 0; i < info.noOfApple; i++) {

     _snow.push(new MyObj(info.random("X", cwidth), info.random("Z") ));
}


// return true if the circle is inside the rectangle
   
function checkCollitsion(test) {

      return (
         cObj.x + cObj.w >= test.x && cObj.x <= test.x + test.w && cObj.y >= test.y && cObj.y <= test.y + test.h
      );
}

// Game Start Screen

var splashScreen = function() {
     
   cureentScreen = 1;
};

//Game Game Over Screen

var gameOverScreen = function () {

	startBtn.classList.remove("hidden");
	gameOver.classList.remove("hidden");

};

//Game Play Screen

var startScreean = function () {

   	cureentScreen = 2;

   	(function draw() {

   		var tmp;
   			ctx.clearRect(0, 0, cwidth, cheight);
   			ctx.save();

   			for (var i = 0, iCount; i < _snow.length; i++) {
   				
   				iCount = info.addMissCount();
   				
   				tmp = _snow[i];
   				tmp.create(ctx);
   				tmp.move(ctx, cheight,cwidth, physics, missD, info);
   				
   				if(iCount > info.WIN)
   					info.gamePause = true;
   				
   						if (checkCollitsion(tmp)) {
   							
   							sound.play();
   							tmp.y = info.random("Y");
   							tmp.dy = physics.gravity;	
   							tmp.x = info.random("X", (cwidth  - tmp.w));

   							info.increment("count")
   							para.innerHTML = info.count;
   						}
   				}
   			ctx.restore();
   			cObj.leftAndRight(ctx);
   			
   			if(!info.gamePause) requestAnimationFrame(draw);
   			else {
            
   				ctx.clearRect(0, 0, cwidth, cheight);
                para.innerHTML = info.count;
                missD.innerHTML = info.miss;
                gameOverScreen();
   			}
   	}());
};


function moveCharacter(e) {
	
	x = e.clientX;
	y = e.clientY;
	x -= dom.getElementById("gameArea").offsetLeft;
	y -= can.offsetTop;

	if (x >= cwidth - cObj.w) {

		cObj.x = cwidth - cObj.w;
	} else {

		cObj.x = x;
	}
}

function screenChange() {
	
	sound.play();
	
	if (cureentScreen == 1) {
         
		startScreean();
    } else if(cureentScreen == 2) {
	  
      info.gamePause = false;
	  info.miss = 0;
	  info.count = 0;
	  para.innerHTML = info.count;
	  missD.innerHTML = info.miss;
	
	  startBtn.classList.add("hidden");
	  gameOver.classList.add("hidden");
	  
	  startScreean();
    }

	this.classList.add("hidden");
}

function leftRight (event) {

	var lR = event.gamma;
	
	if(lR > 0) {
		
		cObj.x += Math.floor(lR);
		
		if (cObj.x >= cwidth - cObj.w) {
		
			cObj.x = cwidth-cObj.w;
		}
	} else {
		
		cObj.x -= Math.floor(lR);
		
		if (cObj.x < 0) {
		
			cObj.x = 0;
		}
	}
}

splashScreen();

can.addEventListener("mousemove", moveCharacter, false);
dom.getElementById('startBtn').addEventListener("click", screenChange, false);
//$w.addEventListener("deviceorientation", leftRight, false);

}

$w.addEventListener("load", init, false);

}(window, document, undefined))

var AM = new AssetManager();
const WINDOW_WIDTH = 800;
const DEBUG = false;

function Sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = 0.7;
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

var soundSong = new Sound("audio/Thomas Bergersen - Fearless.mp3");
	
function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function CustomAnimation(spriteSheet, startX, startY, offset, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
	this.startX = startX;
	this.startY = startY;
	this.offset = offset;
}

CustomAnimation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 this.startX + (xindex * (this.frameWidth + this.offset)), this.startY + yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

CustomAnimation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

CustomAnimation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

/*
Tile
*/

function Tile(game, spritesheet, sourceX, sourceY, width, height, x, y, numberOfXRepeats, numberOfYRepeats) {
    this.spritesheet = spritesheet;
    this.ctx = game.ctx;
	this.game = game;
	this.x = x;
	this.y = y;
	this.sourceX = sourceX;
	this.sourceY = sourceY;
	this.width = width;
	this.height = height;
	this.numberOfXRepeats = numberOfXRepeats;
	this.numberOfYRepeats = numberOfYRepeats;
	Entity.call(game, spritesheet, sourceX, sourceY, width, height, x, y, numberOfXRepeats, numberOfYRepeats);
}

Tile.prototype = new Entity();
Tile.prototype.constructor = Tile;

Tile.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Tile.prototype.draw = function () {
	for (var rows = 0; rows < this.numberOfYRepeats; rows++) {
		for (var i = 0; i < this.numberOfXRepeats; i++)  
			this.ctx.drawImage(this.spritesheet, this.sourceX, this.sourceY,
			this.width, this.height,
			Math.round(this.x - Camera.x + (this.width * i)), this.y + (this.height * rows),
			this.width, this.height);
	}
    
    Entity.prototype.draw.call(this);
}

/*
Background
*/

function Background(game, spritesheet, x, y) {
    this.animation = new Animation(spritesheet, 640, 480, 1, 1, 1, true, 1.5);
    this.spritesheet = spritesheet;
    this.ctx = game.ctx;
	this.game = game;
	this.x = x;
	this.y = y;
    Entity.call(game, spritesheet, x, y);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Background.prototype.draw = function () {

	this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.collide = function (oth) {
    if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) return true;
    return false;
}

function Border(game, spritesheet, sourceX, sourceY, x, y, numberOfXRepeats, numberOfYRepeats) {
    this.spritesheet = spritesheet;
    this.ctx = game.ctx;
	this.game = game;
	this.x = x;
	this.y = y;
	this.sourceX = sourceX;
	this.sourceY = sourceY;
	this.width = 32;
	this.height = 32;
	this.numberOfXRepeats = numberOfXRepeats;
	this.numberOfYRepeats = numberOfYRepeats;
	this.boundingbox = new BoundingBox(x, y, this.width*numberOfXRepeats, this.height*numberOfYRepeats);
	Entity.call(game, spritesheet, sourceX, sourceY, this.width, this.height, x, y, numberOfXRepeats, numberOfYRepeats);
}

Border.prototype = new Entity();
Border.prototype.constructor = Border;

Border.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Border.prototype.draw = function () {
	for (var rows = 0; rows < this.numberOfYRepeats; rows++) {
		for (var i = 0; i < this.numberOfXRepeats; i++)  
			this.ctx.drawImage(this.spritesheet, this.sourceX, this.sourceY,
			this.width, this.height,
			this.x + (this.width * i), this.y + (this.height * rows),
			this.width, this.height);
	}
    
	if (DEBUG) {
		this.ctx.strokeStyle = "red";
		this.ctx.strokeRect(this.boundingbox.left, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
	}
    Entity.prototype.draw.call(this);
}


function Brick(game, spritesheet, sourceX, sourceY, x, y, scale) {
    this.spritesheet = spritesheet;
    this.ctx = game.ctx;
	this.game = game;
	this.x = x;
	this.y = y;
	this.sourceX = sourceX;
	this.sourceY = sourceY;
	this.width = 386 * scale;
	this.height = 130 * scale;
	this.hit = false;
	this.clinkSound = new Sound("audio/clink.wav");
	this.boundingbox = new BoundingBox(x, y, this.width, this.height);
	Entity.call(game, spritesheet, sourceX, sourceY, this.width, this.height, x, y);
}

Brick.prototype = new Entity();
Brick.prototype.constructor = Brick;

Brick.prototype.update = function () {

	if (this.hit) {
		this.clinkSound.play();
		// remove brick
		for( var i = 0; i < this.game.bricks.length; i++){ 
			if ( this.game.bricks[i] === this) {
				this.game.bricks.splice(i, 1); 
				this.removeFromWorld = true;
			}
		}
	}

    Entity.prototype.update.call(this);
}

Brick.prototype.draw = function () {

	this.ctx.drawImage(this.spritesheet, this.sourceX, this.sourceY,
	386, 130,
	this.x, this.y,
	this.width, this.height);
	
    
	if (DEBUG) {
		this.ctx.strokeStyle = "red";
		this.ctx.strokeRect(this.boundingbox.left, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
	}
    Entity.prototype.draw.call(this);
}


/*
Bouncing Asteroid
*/
function Ball(game, spritesheet, x, y, scale) {
    this.animation = new Animation(spritesheet, 72, 72, 5, 0.10, 19, true, scale);
    this.speed = 250;
    this.ctx = game.ctx;
	this.game = game;
	var randomNegative = Math.random() < 0.5 ? -1 : 1;
    this.xMultiplier = -1 * randomNegative;
    this.yMultiplier = -1;
	this.xRandom = Math.floor(Math.random() * 20 + 50) / 100;
	this.x = x;
	this.y = y;
	this.lastX = x;
	this.lastY = y;
	this.width = 72 * scale;
	this.height = 72 * scale;
	this.center = this.x + (0.5*this.width);
	this.dangerLevel = this.yMultiplier * this.y;
	this.boundingbox = new BoundingBox(x, y, this.width, this.height);
   // Entity.call(this, game, x, y, scale);
}

Ball.prototype = new Entity();
Ball.prototype.constructor = Ball;

Ball.prototype.update = function () {
	this.dangerLevel = this.yMultiplier * this.y;
	this.center = this.x + (0.5*this.width);
	this.lastboundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
	this.lastX = this.x;
	this.lastY = this.y;
	
    this.x += this.game.clockTick * this.speed * this.xMultiplier * this.xRandom;
    this.y += this.game.clockTick * this.speed * this.yMultiplier;
	
	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    
	// Check for borders
	for (var i = 0; i < this.game.borders.length; i++) {
		var border = this.game.borders[i];

		// collide with border         
		if (this.boundingbox.collide(border.boundingbox)) {
			
			// collide with right side
			if ( this.lastboundingbox.left > border.boundingbox.right) {
				this.xMultiplier = 1;		
				this.x = this.lastX;
			}
			
			// collide with left side
			else if  (this.lastboundingbox.right < border.boundingbox.left) {
				this.xMultiplier = -1;		
				this.x = this.lastX;
			}
			
			// collide with bottom
			else if ( (this.lastboundingbox.top > border.boundingbox.bottom) ) {

			this.yMultiplier = 1;		
			this.y = this.lastY;
			}
			
		}
	}
	
	// Check for bricks
	for (var i = 0; i < this.game.bricks.length; i++) {
		var brick = this.game.bricks[i];

		// collide with border         
		if (this.boundingbox.collide(brick.boundingbox)) {
			
			// collide with bottom or top
			if ( (this.lastboundingbox.top > brick.boundingbox.bottom) || (this.lastboundingbox.bot < brick.boundingbox.top)) {
				this.yMultiplier *= -1;		
				this.boundingbox = this.lastboundingbox;
			}
			
			// collide with right side or left side
			else if ( (this.lastboundingbox.left > brick.boundingbox.right) || (this.lastboundingbox.right < brick.boundingbox.left) ) {
				this.xMultiplier *= -1;		
				this.boundingbox = this.lastboundingbox;
			}

			brick.hit = true;
			i = this.game.bricks.length;
		}
	}
	
	// Check for offscreen
	if (this.y > 700 || this.x < -50 || this.x > 800) {
		// remove ball
		for( var i = 0; i < this.game.balls.length; i++){ 
			if ( this.game.balls[i] === this) {
				this.game.balls.splice(i, 1); 
				this.removeFromWorld = true;
				console.log("Ball removed.");
			}
		}
	}
    Entity.prototype.update.call(this);
}

Ball.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
		if (DEBUG) {
		this.ctx.strokeStyle = "red";
		this.ctx.strokeRect(this.boundingbox.left, this.boundingbox.top, this.boundingbox.width, this.boundingbox.height);
	}
    Entity.prototype.draw.call(this);
}

/*
Paddle
*/
function Paddle(game, spritesheet, scale) {
    this.animation = new Animation(AM.getAsset("./img/paddle.png"), 485, 128, 3, 0.05, 3, 1, scale);
	
    this.speed = 800;
    this.ctx = game.ctx;
    this.xMultiplier = 1;
    this.yMultiplier = 1;
	this.x = 400;
	this.y = 650;
	this.width = 485 * scale;
	this.height = 128 * scale;
	this.target = game.balls[0];
	this.center = this.x + (0.5*this.width);
	this.bounceSound = new Sound("audio/bounce.wav");
	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.call(this, game, 400, 650, scale);
}

Paddle.prototype = new Entity();
Paddle.prototype.constructor = Paddle;

Paddle.prototype.update = function () {
	this.center = this.x + (0.5*this.width);
	
	// Decide on target ball
	this.dangerLevel = -800;
	for (var i = 0; i < this.game.balls.length; i++) {
		var target = this.game.balls[i];
		if (target.dangerLevel > this.dangerLevel) {
			this.dangerLevel = target.dangerLevel;
			this.target = target;
		}
	}
	
	var dist = this.center - this.target.center;
	// Track Target Ball
	if (dist > 0) {
		this.xMultiplier = -1;
	} else {
		this.xMultiplier = 1;
	}
	if (Math.abs(dist) > 15) this.x += this.game.clockTick * this.speed * this.xMultiplier;
	
	
	this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
	
	// Check for Ball
	for (var i = 0; i < this.game.balls.length; i++) {
		var ball = this.game.balls[i];
		if (this.boundingbox.collide(ball.boundingbox) && ball.lastY < this.boundingbox.top) {
			ball.y = ball.lastY;
			ball.yMultiplier = -1;
			//ball.speed += 15;
			this.bounceSound.play();
		}
	}
	

	
    Entity.prototype.update.call(this);
}

Paddle.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/background.png");
AM.queueDownload("./img/asteroid.png");
AM.queueDownload("./img/breakout_sprites.png");
AM.queueDownload("./img/tiles.png");
AM.queueDownload("./img/paddle.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

	var gameEngine = new GameEngine();
	
    var bricks = [];
    gameEngine.bricks = bricks;
	
    var borders = [];
    gameEngine.borders = borders;
	
	var balls = [];
    gameEngine.balls = balls;
	
    gameEngine.init(ctx);
    gameEngine.start();
	
	// Background (gameEngine, spritesheet, x, y)
	gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.png"), -90, 0));
	
	// Border(game, spritesheet, sourceX, sourceY, x, y, numberOfXRepeats, numberOfYRepeats)
	var border = new Border(gameEngine, AM.getAsset("./img/breakout_sprites.png"), 0, 40, 0, 0, 1, 20);
	gameEngine.addEntity(border);
	borders.push(border);
	
	border = new Border(gameEngine, AM.getAsset("./img/breakout_sprites.png"), 0, 40, 32, 0, 23, 1);
	gameEngine.addEntity(border);
	borders.push(border);
	
	border = new Border(gameEngine, AM.getAsset("./img/breakout_sprites.png"), 0, 40, 24*32, 0, 1, 20);
	gameEngine.addEntity(border);
	borders.push(border);
	
	
	// Brick(game, spritesheet, sourceX, sourceY, x, y, scale) 

	// grey bricks
	for (var i = 0; i < 7; i ++) {
		var brick = new Brick(gameEngine, AM.getAsset("./img/tiles.png"), 771, 519, 32 + (i*386*0.27), 32, 0.27);
		gameEngine.addEntity(brick);
		bricks.push(brick);
	}
	
	// brown bricks
	for (var i = 0; i < 7; i ++) {
		var brick = new Brick(gameEngine, AM.getAsset("./img/tiles.png"), 385, 779, 32 + (i*386*0.27), 32*2, 0.27);
		gameEngine.addEntity(brick);
		bricks.push(brick);
	}
	
	
	// dark green
	for (var i = 0; i < 7; i ++) {
		var brick = new Brick(gameEngine, AM.getAsset("./img/tiles.png"), 385, 129, 32 + (i*386*0.27), 32*3, 0.27);
		gameEngine.addEntity(brick);
		bricks.push(brick);
	}
	
	// light green
	for (var i = 0; i < 7; i ++) {
		var brick = new Brick(gameEngine, AM.getAsset("./img/tiles.png"), 0, 129, 32 + (i*386*0.27), 32*4, 0.27);
		gameEngine.addEntity(brick);
		bricks.push(brick);
	}
	
	// purple
	for (var i = 0; i < 7; i ++) {
		var brick = new Brick(gameEngine, AM.getAsset("./img/tiles.png"), 0, 389, 32 + (i*386*0.27), 32*5, 0.27);
		gameEngine.addEntity(brick);
		bricks.push(brick);
	}
	
	// red
	for (var i = 0; i < 7; i ++) {
		var brick = new Brick(gameEngine, AM.getAsset("./img/tiles.png"), 771, 259, 32 + (i*386*0.27), 32*6, 0.27);
		gameEngine.addEntity(brick);
		bricks.push(brick);
	}
	
	// dark blue
	for (var i = 0; i < 7; i ++) {
		var brick = new Brick(gameEngine, AM.getAsset("./img/tiles.png"), 771, 389, 32 + (i*386*0.27), 32*7, 0.27);
		gameEngine.addEntity(brick);
		bricks.push(brick);
	}
	
	// light blue
	for (var i = 0; i < 7; i ++) {
		var brick = new Brick(gameEngine, AM.getAsset("./img/tiles.png"), 385, 649, 32 + (i*386*0.27), 32*8, 0.27);
		gameEngine.addEntity(brick);
		bricks.push(brick);
	}	
	
	
	// orange
	for (var i = 0; i < 7; i ++) {
		var brick = new Brick(gameEngine, AM.getAsset("./img/tiles.png"), 771, 0, 32 + (i*386*0.27), 32*9, 0.27);
		gameEngine.addEntity(brick);
		bricks.push(brick);
	}	

	// Ball
	var ball = new Ball(gameEngine, AM.getAsset("./img/asteroid.png"), Math.floor(Math.random() * 700) + 50, 600, 0.25);
	gameEngine.addEntity(ball);
	balls.push(ball);

	// Paddle
	gameEngine.addEntity(new Paddle(gameEngine, AM.getAsset("./img/paddle.png"), 0.3));
	

	
	// Key Listener
    document.addEventListener('keydown', function(e){

		e.preventDefault();
		switch(e.keyCode) {
			// Spacebar
			case 32:
			    break;

				
		}
      });
	document.addEventListener('keyup', function(e){
		
		e.preventDefault();
		switch (e.keyCode) {
		    // space
		    case 32:
			
				// Ball
				var ball = new Ball(gameEngine, AM.getAsset("./img/asteroid.png"), Math.floor(Math.random() * 700) + 50, 600, 0.25);
				gameEngine.addEntity(ball);
				balls.push(ball);
				break;
		}
	});

	soundSong.play();

	console.log("All Done!");
});
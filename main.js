/**
 * Place your JS-code here.
 */
$(document).ready(function(){
  'use strict';
  // Restarts the game
  $("#restart").on('click', function(){
	location.reload(); // reloads the page so the game starts over
  });
  
  
  //////////////////////////////////////////////////////////// AUDIO ///////////////////////////////////////////////////////////////
  (function(){
	var audio = document.getElementById("sound1");
	audio.loop = true;
	audio.autoplay = true;
	// audio.load();
  })();
  
  function deathSound(){
	var audio1 = document.getElementById("sound1");
	audio1.pause();
	var audio = document.getElementById("sound2");
	console.log("playing sound 2");
	audio.play();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  //////////////////////////// KEY HANDLING CODE ///////////////////////////////
  var Key = {
      _pressed: {},

      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,

      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },

      onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
      },

      onKeyup: function(event) {
        delete this._pressed[event.keyCode];
      }
    };
        
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
  /////////////////////////////////////////////////////////////////////////////
  /////////////////////////////// GAME LOOP STUFF BELOW //////////////////////
  var Game = {
      fps: 60,
      width: 640,
      height: 480,
	  endGame: false
    };

    Game._onEachFrame = (function() {
      var requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || window.requestAnimationFrame;

      if (requestAnimationFrame) {
       return function(cb) {
          var _cb = function() { cb(); requestAnimationFrame(_cb); }
          _cb();
        };
      } else {
        return function(cb) {
          setInterval(cb, 1000 / Game.fps);
        }
      }
    })();
	
	Game.start = function() {
      Game.canvas = document.getElementById('gameCanvas'); // document.createElement("canvas")
      // Game.canvas.width = Game.width;
      // Game.canvas.height = Game.height;
	  Game.width = Game.canvas.width;
	  Game.height = Game.canvas.height;
      Game.context = Game.canvas.getContext("2d");
	  
	  Game.score = 0;
      // document.body.appendChild(Game.canvas);
	  var player1 = new Player();
	  player1.position = new Vector(50, 50);
	  
	  // var player2 = new Player();
	  // player2.position = new Vector(200, 200);
	  
	  var background = new Background(Game.width, Game.height);
	  
	  var enemy1 = new Enemy(Game.width, Game.height);
	  enemy1.position = new Vector(150, 150);
	  
	  var collision = new Collision([player1, enemy1]); // objects added here must contain certain functions to work
	  // Game.player = player1;
	  
	  //objects added here must contain an update(timeStep) function and one draw(context) function, the order is important cause of z-index
	  Game.updateEntities = [collision, background, player1, enemy1]; 
	  
	  Game.collisionHandler = collision;
	  
      Game._onEachFrame(Game.run);
    };
	
	// TODO: this shit needs some rework....
	// Time-stepped game loop
	Game.run = (function() {
      var loops = 0, gameOver = false, lastIteration = (new Date).getTime(); // timesPerSec = ms

      return function() {
        // loops = 0;
		if(Game.endGame){
			Game.drawEndScreen();
			if(!gameOver){
				gameOver = true;
				deathSound();
			}
			return;
		}
		var now = (new Date).getTime();
		
		Game.update(1);// (now-lastIteration)/10
		lastIteration = now;
		Game.draw();
		
		// // while we are not at a time where we should redraw, that is we are currently behind and must update until we catch up
        // while ((new Date).getTime() > nextGameTick && !Game.endGame) { 
			// nextGameTick += skipTicks;
			// loops++;
			// // will need the difference between the previous time we updated and the new and send that into update and use as time difference(td)
			// Game.update();
          
        // }

        // if (loops) Game.draw();
      }
    })();
	//////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// GAME DRAW AND UPDATE FUNCTIONS //////////////////////////////////////
    Game.draw = function() {
      Game.context.clearRect(0, 0, Game.width, Game.height); // clears the drawing area each time so the width and height must match or it will leave drawn
      // Game.player.draw(Game.context);
	  for(var entity in Game.updateEntities){
			Game.updateEntities[entity].draw(Game.context);
		}
    };
    
	Game.drawEndScreen = function(){
		drawText(Game.context, (Game.width/2)-175, (Game.height/2), "Game over - score: " + Game.score);
	}
	
    Game.update = function(timeStep) {
		// Game.player.update(timeStep);
		for(var entity in Game.updateEntities){
			Game.updateEntities[entity].update(timeStep);
		}
    };
	
	//////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////// PLAYER FUNCTIONS ///////////////////////////////////////////////
	// function Position(x, y){
		// this.x = x || 0; // Keeps track of the position in the x-coordinate
		// this.y = y || 0; // Keeps track of the position in the y-coordinate
	// }
	
	// function Velocity(x, y){
		// this.x = x || 1; // Keeps track of the velocity in the x-coordinate
		// this.y = y || 1; // Keeps track of the velocity in the y-coordinate
	// }
	
	function Vector(x, y) {
	  this.x = x || 0;
	  this.y = y || 0;
	}
 
	Vector.prototype = {
	  // Multiply with scalar
	  muls:  function (scalar) { return new Vector( this.x * scalar, this.y * scalar); }, 
	  // Multiply itself with scalar
	  imuls: function (scalar) { this.x *= scalar; this.y *= scalar; return this; },      
	  // Add with scalar
	  adds:  function (scalar) { return new Vector( this.x + scalar, this.y + scalar); },
	  // Add itself with Vector
	  iadd:  function (vector) { this.x += vector.x; this.y += vector.y; return this; },
	  // The length of the vector, calculated by taking the squareroot of the sum of adding the two variabels raised to the power of two, Math.pow(x, 2) = x*x
	  dist: function(){var length = Math.sqrt((Math.pow(this.x, 2) + Math.pow(this.y, 2))); return length;},
	  // Returns the dot product for this vector and the vector supplied as an argument
	  dot: function(vector){var xR = this.x*vector.x, yR = this.y*vector.y; return xR+yR;},
	  // Returns the angle between this vector and the vector supplied as an argument
	  angle: function(vector){var aDotB = this.dot(vector), lengthA = this.dist(), lengthB = vector.dist(), lengthATimesLengthB = lengthA*lengthB,
		realAngle = aDotB/lengthATimesLengthB; return Math.acos(realAngle);}
	}
	
	
    function Player() {
      this.position = new Vector();
	  this.direction = 0; // The directional angle in radians
	  this.velocity = new Vector(0, 0);
	  this.isAccelarating = false;
	  this.acceleration = 0;
	  this.maxSpeed = 5;
	  
	  // COLLISION SPECIFIC
	  this.cWidth = 10;
	  this.cHeight = 10;
    }

    Player.prototype.draw = function(context) {
	  
      // context.fillRect(this.x, this.y, 32, 32);
	  context.save(); // saves the current world state so we can return to it after we have done the translations and rotations necessary for correct handling
	  context.translate(this.position.x, this.position.y);
	  context.rotate(this.direction);
	  
	  context.strokeStyle = "white"; // "rgb(200, 0, 0)";
	  
	  if(this.isAccelerating){
		drawSpaceShip(context, 10, 0, true);
	  } else{
		drawSpaceShip(context, 10, 0);
	  }
	  context.restore();
	  this.isAccelerating = false;
    };

    Player.prototype.rotateLeft = function(timeStep) {
      this.direction -= (Math.PI/30)*timeStep;
    };

    Player.prototype.rotateRight = function(timeStep) {
		this.direction += (Math.PI/30)*timeStep;
    };
	
	Player.prototype.accelerate = function(timeStep){
		this.velocity.x += 0.1 * Math.cos(this.direction) * timeStep;
		this.velocity.y += 0.1 * Math.sin(this.direction) * timeStep;
		if(this.velocity.x > this.maxSpeed){
			this.velocity.x = this.maxSpeed;
		}
		if(this.velocity.x < -this.maxSpeed){
			this.velocity.x = -this.maxSpeed;
		}
		if(this.velocity.y > this.maxSpeed){
			this.velocity.y = this.maxSpeed;
		}
		if(this.velocity.y < -this.maxSpeed){
			this.velocity.y = -this.maxSpeed;
		}
		this.isAccelerating = true;
	}
	
	// Player.prototype.deAccelerate = function(timeStep){
		// this.velocity.x -= 0.1 * timeStep;
		// this.velocity.y -= 0.1 * timeStep;
		// if(this.velocity.x <= 0){
			// this.velocity.x = 0;
		// }
		// if(this.velocity.y <= 0){
			// this.velocity.y = 0;
		// }
	// }
	
    Player.prototype.move = function(timeStep) {
		this.position.x += this.velocity.x * timeStep; // * Math.cos(this.direction)
		this.position.y += this.velocity.y * timeStep; // * Math.sin(this.direction)
    };
	
	Player.prototype.stayInArea = function(width, height) {
    if(this.position.y < 0)  this.position.y = height;
    if(this.position.y > height)        this.position.y = 0;
    if(this.position.x > width)         this.position.x = 0;
    if(this.position.x < 0)   this.position.x = width;
  }
    
    Player.prototype.update = function(timeStep) {
      if (Key.isDown(Key.UP)) this.accelerate(timeStep);
      if (Key.isDown(Key.LEFT)) this.rotateLeft(timeStep);
      // if (Key.isDown(Key.DOWN)) this.deAccelerate(timeStep);
      if (Key.isDown(Key.RIGHT)) this.rotateRight(timeStep);
	  // this.Forces.update(this.velocity, timeStep);
	  this.move(timeStep);
	  this.stayInArea(Game.width, Game.height);
    };
	
	// object is the object it has collided with
	Player.prototype.collision = function(timeStep, object){
		// an collision has occured, handle it
		if(object instanceof Enemy){
			console.log("collided with enemy, game over");
			Game.endGame = true;
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////// BACKGROUND /////////////////////////////////////////////////////////////////////////////
	function Background(width, height){
		this.width = width;
		this.height = height;
	}
	
	// The function used for drawing the background 
	Background.prototype.draw = function(context) {
		context.fillStyle = "black";
		context.fillRect(0, 0, this.width, this.height);
	}
	
	// The function used for updating the background, eg. if one wants an moving background
	Background.prototype.update = function(timeStep)  {
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////// ENEMY /////////////////////////////////////////////////////////////////////////////
	function Enemy(width, height){
		this.width = width;
		this.height = height;
		this.creationTime = (new Date).getTime();
		this.newEnemyTime = 15000; // the time between the creation of a new enemy
		this.position = new Vector(0, 0);
		this.velocity = new Vector(1, 0);
		this.canCreate = true;//used so that the number of enemies created are linear and not exponential, that is only on enemy at the time creates new enemies
		// COLLISION SPECIFIC
		this.cWidth = 10;
		this.cHeight = 10;
		
		// Adds one point for each enemy you got
		Game.score++;
	}
	
	// The function used for drawing the Enemy 
	Enemy.prototype.draw = function(context) {
		context.fillStyle = "white";
		context.strokeStyle = "red";
		drawSmileyFace(context, this.position.x, this.position.y, 0.2);
	}
	
	// The function used to move the enemy
	Enemy.prototype.move = function(timeStep){
		// this.position.iadd(this.velocity * timeStep);
		this.position.x += this.velocity.x * timeStep;
	}
	
	Enemy.prototype.stayInArea = function(width, height) {
		if(this.position.y < 0)  this.velocity.y = -this.velocity.y;
		if(this.position.y > height) this.velocity.y = -this.velocity.y;
		if(this.position.x > width) this.velocity.x = -this.velocity.x;
		if(this.position.x < 0) this.velocity.x = -this.velocity.x;
  }
	
	// The function used for updating the Enemy
	Enemy.prototype.update = function(timeStep)  {
		if(((new Date).getTime() - this.creationTime) > this.newEnemyTime && this.canCreate){
			// Create a new enemy and add to game
			var tempEnemy = new Enemy(this.width, this.height);
			tempEnemy.position = new Vector(randomInteger2(this.width, 0), randomInteger2(this.height, 0));
			console.log("adding new enemy");
			(Game.updateEntities).push(tempEnemy);
			Game.collisionHandler.collisionObject.push(tempEnemy);
			// Add to collision object
			this.canCreate = false;
		}
		this.move(timeStep);
		this.stayInArea(Game.width, Game.height);
	}
	
	// object is the object it has collided with
	Enemy.prototype.collision = function(timeStep, object){
		// an collision has occured, handle it
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////// COLLISION /////////////////////////////////////////////////////////////////////////////
	// NOTE: To add collision handling on an object one must first implement the necessary functions and variables which is:
	// function: collision(timeStep, object), where timestep is the timestep and object is the object that we have collided with
	// variable: cWidth, which is the variable that defines the objects collision rectangles width
	// variable: cHeight, which is the variable that defines the objects collision rectangles heights
	// variable: position, as an vector object which specifies the current position of this object that we want to check for collisions with
	function Collision(objects){
		this.collisionObject = objects;
	}
	
	// No drawing for collision so the draw is empty
	Collision.prototype.draw = function(context) {
	}
	
	// NOTE: Requires all objects added to this to implement the function collision and to have two variable cWidth and cHeight which specifies the collision
	// area as an rectangle, and also they must contain position as an vector so we know where to check for collision
	Collision.prototype.update = function(timeStep)  {
		// Check all the entities added to the collision against all other entities and if an collision has occured alert them with which object they have
		// collided with and let them determine the appropiate action
		for(var i = 0; i < this.collisionObject.length; i++){
			var object1 = this.collisionObject[i];
			for(var j = i+1; j < this.collisionObject.length; j++){
				var object2 = this.collisionObject[j];
				
				if((Math.abs(object1.position.x - object2.position.x) < (object1.cWidth+object2.cWidth)) && 
					(Math.abs(object1.position.y - object2.position.y) < (object1.cHeight+object2.cHeight))){
					// Collision, announce it to the two objects
					object1.collision(timeStep, object2);
				}
				
			}
		}
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // function used to draw inside the canvas
  function draw(){
	var canvas = document.getElementById('firstCanvas');
	if (canvas.getContext){
		var ctx = canvas.getContext('2d'); // here we say we are gonna draw in 2D and gets a reference to the drawing canvas so we can draw onto it
		
		// The red rectangle
		ctx.fillStyle = "rgb(270, 0, 0)"; // uses the color with RGB-value (red, green, blue)=270, 0, 0
		ctx.fillRect(150, 150, 50, 50); // ctx.fillRect(X-cord, Y-cord, width, heigth)
		
		// The blue rectangle
		ctx.fillStyle = "rgba(0, 0, 52, 0.5)"; // uses the color with RGBA-value (red, green, blue, alpha(transparency))=0, 0, 52, 0.5
		ctx.fillRect(175, 175, 50, 50); // ctx.fillRect(X-cord, Y-cord, width, heigth)
		
		// The green rectangle
		drawRectangle(ctx, "rgb(0, 250, 0)", 10, 10, 10, 10);
		
		drawFilledTriangleAt(ctx, 150, 50);
		drawEmptyTriangleAt(ctx, 150, 50);
		
		drawSmileyFace(ctx, 300, 100);
		drawSmileyFace(ctx, 500, 100);
		drawImgAtCords(ctx, 110, 110, "img/grass.png");
		drawImgAtCords(ctx, 142, 110, "img/grass.png");
	}
  };
  
  // Draws a rectangle with the specified color at the specified coordinates with the specified metrics, ctx is the canvas onto which it will be drawn
  function drawText(ctx, xCord, yCord, text){
	ctx.fillStyle = "green";
	ctx.font = "24pt Helvetica";
	ctx.fillText(text, xCord, yCord);
  }
  
  
  // Draws a rectangle with the specified color at the specified coordinates with the specified metrics, ctx is the canvas onto which it will be drawn
  function drawRectangle(ctx, color, xCord, yCord, width, height){
	ctx.fillStyle = color; // uses the color with RGB-value (red, green, blue)=270, 0, 0
	ctx.fillRect(xCord, yCord, width, height); // ctx.fillRect(X-cord, Y-cord, width, heigth)
  }
  
  // Draws a triangle with the left corner at the specified coordinates
  function drawFilledTriangleAt(ctx, xCord, yCord){
	// Used to draw on free hand
	ctx.beginPath();
	ctx.moveTo(xCord, yCord); // Moves the "pen" to this coordinates and sets them as the starting point
	ctx.lineTo(xCord+50, yCord); // Draws a line to these coordinates and these will be the new coordinates of "the pen"
	ctx.lineTo(xCord+25, yCord+25); // uses absolute coordinates
	// ctx.lineTo(xCord+15, yCord+25); // uses absolute coordinates
	ctx.fill(); // fills up the area currently enclosed by the drawn lines
	ctx.closePath();
  }
  
  // Draws a triangle with at the coordinates with the specified rotation
  function drawSpaceShip(ctx, xCord, yCord, withFire){
	// ctx.strokeStyle = "rgb(200, 200, 0)"; // sets the color of the line
	// Used to draw on free hand
	ctx.beginPath();
	ctx.moveTo(xCord, yCord); // Moves the "pen" to this coordinates and sets them as the starting point  *Math.sin(rotation)
	ctx.lineTo(xCord-20, yCord+10); // Draws a line to these coordinates and these will be the new coordinates of "the pen"
	ctx.lineTo(xCord-15, yCord);
	ctx.lineTo(xCord-20, yCord-10);
	// ctx.lineTo(xCord+25, yCord+25); // uses absolute coordinates
	
	ctx.lineTo(xCord, yCord);
	
	if(withFire){
		// small inner fire
		ctx.moveTo(xCord-15, yCord+2);
		ctx.lineTo(xCord-25, yCord);
		ctx.lineTo(xCord-15, yCord-2);
		
		// big outer fire
		ctx.moveTo(xCord-18, yCord+5);
		ctx.lineTo(xCord-35, (yCord-2)+(Math.random()*3)); // adds random here to give illusion of that the fire is moving
		ctx.lineTo(xCord-18, yCord-5);
	}
	ctx.stroke(); // draws the lines without filling up the resulting area
	ctx.closePath();
  }
  
  // Draws a triangle with at the coordinates with the specified rotation
  function drawEmptyTriangleAt(ctx, xCord, yCord, rotation){
	// ctx.strokeStyle = "rgb(200, 200, 0)"; // sets the color of the line
	rotation = rotation || 0;
	// Used to draw on free hand
	ctx.beginPath();
	ctx.moveTo(xCord, yCord); // Moves the "pen" to this coordinates and sets them as the starting point  *Math.sin(rotation)
	ctx.lineTo(xCord+50, yCord); // Draws a line to these coordinates and these will be the new coordinates of "the pen"
	
	ctx.lineTo(xCord+25, yCord+25); // uses absolute coordinates
	
	ctx.lineTo(xCord, yCord);
	ctx.stroke(); // draws the lines without filling up the resulting area
	ctx.closePath();
  }
  
  
  // Draws an smiley face at the specified coordinates
  function drawSmileyFace(ctx, xCord, yCord, scale){
	ctx.beginPath();
	scale = scale || 1;
	// ctx.moveTo(xCord, yCord);
	// arc(x, y, radius, startAngle, endAngle, anticlockwise), x and y is the center of the circle that would result from a whole lap(2*Pi);
    ctx.arc(xCord,yCord,50*scale,0,Math.PI*2,true); // Outer circle
    ctx.moveTo(xCord+35*scale,yCord);
    ctx.arc(xCord,yCord,35*scale,Math.PI,Math.PI*2,true);   // Mouth
    ctx.moveTo(xCord-10*scale,yCord-10*scale);
    ctx.arc(xCord-15*scale,yCord-15*scale,5*scale,0,Math.PI*2,true);  // Left eye
    ctx.moveTo(xCord+20*scale,yCord-10*scale);
    ctx.arc(xCord+15*scale,yCord-15*scale,5*scale,0,Math.PI*2,true);  // Right eye
    ctx.stroke();
  }
  
  // draws the specified img at the specified coordinates
  function drawImgAtCords(ctx, xCord, yCord, imgSrc){
	var img = new Image();   // Create new img element
	// img.addEventListener("load", function() {
	  // // execute drawImage statements here
	  
	// }, false);
	img.onload = function(){
		ctx.drawImage(img,xCord,yCord);
	};
	img.src = imgSrc; // Set source path
  }
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////// INITIATE DRAWING FUNCTIONS ///////////////////////////////////////////////////////////////
  // draw();
  Game.start();
});

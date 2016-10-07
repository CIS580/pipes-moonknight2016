(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes */
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
var bgm = new Audio();
bgm.src = 'Steve_Combs_04_Stereo_Abuse.mp3'
var pipeSound = new Audio();
pipeSound.src = 'blip.wav'
var winSound = new Audio();
winSound.src = 'pair.wav';
var loseSound = new Audio();
loseSound.src = 'flip.wav'

image.src = 'assets/pipes.png';
var state = "waiting for first click";
var timer = 0;
var menuTimer = 0;
var gridWidth  = canvas.width/6;
var gridHeight = canvas.height/7;
var xx=0;var yy=0;
var drawX = 0;
var drawY = 0;
var shapes = [];
var board  = [];
var waterPostionInBoard = 0;
var waterDir = 'nothing';
var waterSize = 0;
var whichWaterPortion = 1;
var waterPath = [];
var waterSpeed = 3;
var startPipePostion = 0;
var endPipePostion = 0;
var score = 0;
var playedWinSound = 0;
var playedLoseSound = 0;
canvas.onclick = function(event) {
  event.preventDefault();
  // TODO: Place or rotate pipe tile
   
   
   if (state == 'waiting inside game')
   {
		   xx = Math.floor(Math.random()*100)%4;
		   yy = Math.floor(Math.random()*100)%5;
		   
		   drawX = Math.floor((currentX ) /gridWidth);
		   drawY = Math.floor((currentY ) / gridHeight);
		   
		   var num = drawX+(6*drawY);
		   if (board[num] == 0)
			   {
			   board[num] = 1;
			   pipeSound.play();
			   var kind = Math.floor(Math.random()*100)%2;
			   //kind = 1;
			   var s;
			   if (kind == 0)
			   {
				   xx = 3;
				   yy = 2;
			   }
			   if (kind == 1)
			   {
				   xx = 1;
				   yy = 2;
			   }   
			   s = new singleShape(xx,yy ,kind );
			   shapes[num] = s;
			   }
			
			else
				if (shapes[num].changeAble == 'yes')
				{
					{
						pipeSound.play();
						if (shapes[num].kind == 0)
						{
							shapes[num].yy++;
							if (shapes[num].yy == 3)
								shapes[num].yy=1;
								
						}
						if (shapes[num].kind == 1)
						{
							shapes[num].xx++;
							if (shapes[num].xx==3)
							{
								shapes[num].yy++;
								shapes[num].xx = 1;
								if (shapes[num].yy == 3)
								{
									shapes[num].yy=1;
								}
								
							}
						}
						
					}
					
				}
		   
	   
   }
   
   if (state == "waiting for first click")
   {
	   startLevel();
	   state = 'waiting inside game';
	   
	   
	   
	   
   }
   
   //bgm.play();
}

var currentIndex, currentX, currentY;
canvas.onmousemove = function(event) {
  event.preventDefault();
  currentX = event.offsetX;
  currentY = event.offsetY;
  
  //currentIndex = y * 6 + x;
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // TODO: Advance the fluid
  
  
   if (state=='waiting inside game')
   {;bgm.play();;
	timer++;
		if (timer == 3)
	   { 
		timer = 0;
		//xx = Math.floor(Math.random()*100)%4;
		//yy = Math.floor(Math.random()*100)%5;
		waterSize+=waterSpeed;
		if (waterSize>gridHeight/2)
		{
			waterSize= 0;
			
			whichWaterPortion ++;
			var l = 1;
			if (whichWaterPortion==3)
			{
				switch (waterDir) {
					case 'up':
					waterDir = "up";
					waterPostionInBoard-=6;
					break;
					case 'down':
					waterPostionInBoard+=6;
					waterDir = "down";
					break;
					case 'left':
					waterPostionInBoard--;
					waterDir = "left";
					break;
					case 'right':
					waterPostionInBoard++;
					waterDir = "right";
					break;
				}
				score+=250;
				
			whichWaterPortion = 1;
			
			 waterY = Math.floor(waterPostionInBoard/6);
			 waterX = waterPostionInBoard-waterY*6;
			var w = new waterPortion (waterX,waterY,waterDir);
			waterPath[waterPath.length] = w;
			l= 1;
			}
			
			else 
			{
				//waterPostionInBoard++;
				l = 2;
				if (shapes[waterPostionInBoard].kind==1)
				{
					//waterPath[waterPath.length-1]
					var waterY;
					var waterX;
					switch (waterDir) {
							case 'up':
								if (shapes[waterPostionInBoard].xx==1)
								{
									waterY = waterPath[waterPath.length-1].yy;
									waterX = waterPath[waterPath.length-1].xx+0.5;
									waterDir = 'right';
								}
								else
								{
									waterY = waterPath[waterPath.length-1].yy;
									waterX = waterPath[waterPath.length-1].xx+0.5;
									waterDir = 'left';
									
								}	
								
								
								break;
							case 'down':
								if (shapes[waterPostionInBoard].xx==1)
								{
									waterY = waterPath[waterPath.length-1].yy;
									waterX = waterPath[waterPath.length-1].xx+0.5;
									waterDir = 'right';
								}
								else
								{
									waterY = waterPath[waterPath.length-1].yy;
									waterX = waterPath[waterPath.length-1].xx+0.5;
									waterDir = 'left';
									
								}	
								
								
								break;
							case 'left':
								if (shapes[waterPostionInBoard].yy==1)
								{
									waterY = waterPath[waterPath.length-1].yy+0.4;
									waterX = waterPath[waterPath.length-1].xx;
									waterDir = 'down';
								}
								else
								{
									waterY = waterPath[waterPath.length-1].yy+0.4;
									waterX = waterPath[waterPath.length-1].xx;
									waterDir = 'up';
									
								}	
								
								break;
							case 'right':
								if (shapes[waterPostionInBoard].yy==1)
								{
									waterY = waterPath[waterPath.length-1].yy+0.4;
									waterX = waterPath[waterPath.length-1].xx;
									waterDir = 'down';
								}
								else
								{
									waterY = waterPath[waterPath.length-1].yy+0.4;
									waterX = waterPath[waterPath.length-1].xx;
									waterDir = 'up';
									
								}	
								
								//ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8,  ,gridWidth/4 ,gridHeight );
								break;
							
						}
					
					//waterY = waterPath[waterPath.length-1].yy+0.4;
					//waterX = waterPath[waterPath.length-1].xx+0.5;
					var w = new waterPortion (waterX,waterY,waterDir);
					w.whichWaterPortion = l;
					waterPath[waterPath.length] = w;
				}
				
				else {
					if (shapes[waterPostionInBoard].yy==1)
					{
						waterY = waterPath[waterPath.length-1].yy;
						waterX = waterPath[waterPath.length-1].xx+0.5;
						
					}
					else 
					{
						waterY = waterPath[waterPath.length-1].yy+0.4;
						waterX = waterPath[waterPath.length-1].xx;
						
					}
					var w = new waterPortion (waterX,waterY,waterDir);
					w.whichWaterPortion = l;
					waterPath[waterPath.length] = w;
					
				}
				
			}
			
		}
	   }
		if (board[waterPostionInBoard] == 0 || waterPostionInBoard < 0 ||waterPostionInBoard > 41)
		{
			state = "game over screen";
			
		}
		
		else{
			
		shapes[waterPostionInBoard].changeAble= 'no';
		
		
		if (whichWaterPortion==1)
		{
			if (waterPostionInBoard == endPipePostion)
			{
				state = 'passed level screen';
			}
			if (shapes[waterPostionInBoard].kind==1)
			{
			switch (waterDir) {
							case 'up':
								if (shapes[waterPostionInBoard].yy==2)
								{
									state = 'game over screen';
								}
								
								
								
								break;
							case 'down':
								if (shapes[waterPostionInBoard].yy==1)
								{
									state = 'game over screen';
								}
								
								
								
								break;
							case 'left':
								if (shapes[waterPostionInBoard].xx==2)
								{
									state = 'game over screen';
								}
								else
								{
									
									
								}	
								
								break;
							case 'right':
								if (shapes[waterPostionInBoard].xx==1)
								{
									state = 'game over screen';
								}
								else
								{
									
								}	
								
								//ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8,  ,gridWidth/4 ,gridHeight );
								break;
							
						}
			}
			else
			{
				if (waterDir=='up' || waterDir == 'down')
				{
					if (shapes[waterPostionInBoard].yy==1)
					{
						state = 'game over screen';
					}
					else
					{
							
							
					}
						
					
				}
			else
			{
				if (shapes[waterPostionInBoard].yy==1)
					{
						
					}
					else
					{
						state = 'game over screen';	
							
					}
				
			}
			if (waterPostionInBoard == endPipePostion)
			{
				state = 'passed level screen';
			}
			}
		}
		}
		
		
   }
   
   if (state == 'game over screen')
   {
	   if (playedLoseSound==0)
	   {
		   loseSound.play();
	   playedLoseSound = 1;
	   }
	menuTimer++;
	if (menuTimer > 50)
	{
		menuTimer = 0; 
		gameOver();
	}
		
   }
   
   if (state == 'passed level screen')
   {
	   if (playedWinSound==0)
	   {
		   winSound.play();
	   playedWinSound = 1;
	   }
	   menuTimer++;
	if (menuTimer > 50)
	{
		menuTimer = 0; 
		
		advanceLevel();
	}
   }
  
}


/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  
  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (var j = 0 ; j < 7 ;j++)
  {
	   for (var i = 0 ; i < 6 ;i++)
	   {
				ctx.fillStyle = "#878787";
				ctx.fillRect(i*gridWidth, j*gridHeight,gridWidth-3 , gridHeight-3);
	   }
  }
	   
  
  // TODO: Render the board
  
   var x = image.width/4;
   var y = image.height/5;
   
   
  
	   
		   
		   
		   
	   
   
   
	
	
	
	//ctx.fillRect(waterX*gridWidth, waterY*gridHeight,gridWidth  , gridHeight);
	
			//water
		   if (state == 'waiting inside game')
			{
				ctx.fillStyle = "#3a63ea";
				for (var i = 0 ; i < waterPath.length;i++)
				{
				
					if (i==waterPath.length-1)
					{
						switch (waterPath[i].dir) {
							case 'up':                                     //waterPath[i].yy 
								if (whichWaterPortion==1)
									ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8, waterPath[i].yy*gridHeight+gridHeight - waterSize,gridWidth/4 , waterSize);
								else 
									ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8, waterPath[i].yy*gridHeight - waterSize,gridWidth/4 , waterSize);
								break;
							case 'down':
								ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8, waterPath[i].yy*gridHeight,gridWidth/4 , waterSize);
								break;
							case 'left':
								if (whichWaterPortion==1)
									ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth-waterSize, waterPath[i].yy*gridHeight+gridHeight/3,waterSize , gridHeight/4);
								else
									ctx.fillRect(waterPath[i].xx*gridWidth-waterSize, waterPath[i].yy*gridHeight+gridHeight/3,waterSize , gridHeight/4);
								break;
							case 'right':
								ctx.fillRect(waterPath[i].xx*gridWidth, waterPath[i].yy*gridHeight+gridHeight/3,waterSize , gridHeight/4);
								//ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8,  ,gridWidth/4 ,gridHeight );
								break;
							
						}
						
					}
					//var waterY = Math.floor(waterPostionInBoard/6);
				
					else
					{
						//var waterX = waterPostionInBoard-waterY*6;
						
						switch (waterPath[i].dir) {
							case 'up':
								if (waterPath[i].whichWaterPortion==1)
									ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8, waterPath[i].yy*gridHeight+gridHeight - gridHeight/2,gridWidth/4 , gridHeight/2);
								else 
									ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8, waterPath[i].yy*gridHeight - gridHeight/2,gridWidth/4 , gridHeight/2);
								break;
							case 'down':
								ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8, waterPath[i].yy*gridHeight,gridWidth/4 , gridHeight/2);
								break;
							case 'left':
								if (waterPath[i].whichWaterPortion==1)
									ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth-gridWidth/2, waterPath[i].yy*gridHeight+gridHeight/3,gridWidth/2 , gridHeight/4);
								else
									ctx.fillRect(waterPath[i].xx*gridWidth-gridWidth/2, waterPath[i].yy*gridHeight+gridHeight/3,gridWidth/2 , gridHeight/4);
								break;
							case 'right':
								ctx.fillRect(waterPath[i].xx*gridWidth, waterPath[i].yy*gridHeight+gridHeight/3,gridWidth/2 , gridHeight/4);
								//ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8,  ,gridWidth/4 ,gridHeight );
								break;
							
						}
						
					}
				}
			
			
			}
	
	for (var j = 0 ; j < 7 ;j++)
	   for (var i = 0 ; i < 6 ;i++)
	   {
		   var num = i+j*6;
		   
		   
		   
		   
		   if (state == 'waiting inside game')
			{
				//ctx.fillStyle = "#3a63ea";
			//var waterY = Math.floor(waterPostionInBoard/6);
			//var waterX = waterPostionInBoard-waterY*6;
	
			
		     if(board[num] == 1)
			    {
				  
				  ctx.drawImage(image,
			  // Source rect
			  x*shapes[num].xx,y*shapes[num].yy, x-2, y-2,
			  // Dest rect
			  gridWidth*i, gridHeight*j, gridWidth-3, gridHeight-3
								);
		   
		        }
				
				ctx.font="30px Georgia";
			ctx.fillText("level:"+waterSpeed,10,50);
			ctx.font="30px Georgia";
			ctx.fillText("score:"+score,10,70);
		   
			}
			
			
	   }
	   
	   if (state == 'game over screen')
	   {
		   
		   ctx.font="100px Verdana";
			// Create gradient
			var gradient=ctx.createLinearGradient(0,0,canvas.width,0);
			gradient.addColorStop("0","magenta");
			gradient.addColorStop("0.5","blue");
			gradient.addColorStop("1.0","red");
			// Fill with gradient
			ctx.fillStyle=gradient;
			ctx.fillText("Game Over!",1*gridWidth,2*gridWidth);
		   
	   }
	   
	   
	   if (state == 'waiting for first click')
	   {
		   
		   ctx.font="100px Verdana";
			// Create gradient
			var gradient=ctx.createLinearGradient(0,0,canvas.width,0);
			gradient.addColorStop("0","magenta");
			gradient.addColorStop("0.5","blue");
			gradient.addColorStop("1.0","red");
			// Fill with gradient
			ctx.fillStyle=gradient;
			ctx.fillText("click to start level",1*gridWidth,2*gridWidth);
		   
	   }
	   
	   if (state == 'passed level screen')
	   {
		   
		   ctx.font="100px Verdana";
			// Create gradient
			var gradient=ctx.createLinearGradient(0,0,canvas.width,0);
			gradient.addColorStop("0","magenta");
			gradient.addColorStop("0.5","blue");
			gradient.addColorStop("1.0","red");
			// Fill with gradient
			ctx.fillStyle=gradient;
			ctx.fillText("you passed the level",50,2*gridWidth);
		   
	   }
}
    


function singleShape (posx,posy,kind)
{
	this.xx = posx;
	this.yy = posy;
	this.kind = kind;
	this.changeAble = 'yes'
	
	
}

function startLevel ()
{
	shapes = [];
	waterPath = [];
	for(var j = 0 ; j<7 ; j++)
		   for(var i = 0 ; i<6 ; i++)
			   board[i+(6*j)] = 0;
		   
		   
	var num = Math.floor(300*(Math.random()))%35;
    //num = 8;	
	var shapexx = 0;
	var shapeyy = 0;
	waterDir = Math.floor(300*(Math.random()))%4;
	switch (waterDir) {
		
		case 0:
		waterDir = 'up'
		break;
		case 1:
		waterDir = 'down'
		break;
		case 2:
		waterDir = 'left'
		break;
		case 3:
		waterDir = 'right'
		break;
		
	}
	
	switch (waterDir) {
							case 'up':
								if (Math.floor(300*(Math.random()))%2==1)
								{
									 shapexx = 1;
									 shapeyy = 1;
								}
								else
								{
									shapexx = 2;
									shapeyy = 1;
									
								}	
								
								
								break;
							case 'down':
								if (Math.floor(300*(Math.random()))%2==1)
								{
									shapexx = 1;
									shapeyy = 2;
								}
								else
								{
									shapexx = 2;
									shapeyy = 2;
									
								}	
								
								
								break;
							case 'left':
								if (Math.floor(300*(Math.random()))%2==1)
								{
									shapexx = 1;
									shapeyy = 2;
								}
								else
								{
									shapexx = 1;
									shapeyy = 2;
									
								}	
								
								break;
							case 'right':
								if (Math.floor(300*(Math.random()))%2==1)
								{
									shapexx = 2;
									shapeyy = 2;
								}
								else
								{
									shapexx = 2;
									shapeyy = 1;
									
								}	
								
								//ctx.fillRect(waterPath[i].xx*gridWidth+gridWidth/2 -gridWidth/8,  ,gridWidth/4 ,gridHeight );
								break;
							
						}
	
	board[num] = 1;	   
    var startPipe = new singleShape (shapexx,shapeyy,1);
	startPipe.changeAble = 'no';
	shapes[num] = startPipe;
	var num2 = Math.floor(300*(Math.random()))%35;	
	for (var i = 0; num==num2; i++)
		num2 = Math.floor(300*(Math.random()))%35;	
	board[num2] = 1;	   
    var endPipe = new singleShape (0,0,0);
	endPipe.changeAble = 'no';
	shapes[num2] = endPipe;
	
	startPipePostion = num;
	endPipePostion = num2;
	
	waterPostionInBoard = num;
	//waterDir = 'up';
	
			var waterY = Math.floor(waterPostionInBoard/6);
			var waterX = waterPostionInBoard-waterY*6;
			var w = new waterPortion (waterX,waterY,waterDir);
			waterPath[0] = w;
	//endPipePostionInBoard = num2;
	
	
	
}

function waterPortion (posx,posy,dir)
{
	this.xx = posx;
	this.yy = posy;
	this.dir = dir;
	this.whichWaterPortion = 1;
	
	
}

function gameOver ()
{
	state = 'waiting for first click';
	score =0;
	playedLoseSound = 0;
	
}

function advanceLevel ()
{
	waterSpeed++;
	state = 'waiting for first click';
	score +=1000; 
	playedWinSound = 0;
}
},{"./game":2}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}]},{},[1]);

(() => {
    
    const MAX_INPUT = 10000000;
    
	const Directions = {
		DOWN: 0, 
		UP: 1,
		RIGHT: 2,
		LEFT: 3,
	}
	
	
	// == Apple Object ==
    function Apple(coord) {
        this.coord = coord;
	}
	Apple.prototype.draw = function(ctx) {
		const radius = 8;
		const lineWidth = 1;
		const x = this.coord.x + lineWidth*2;
		const y = this.coord.y + lineWidth*2;
		
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'yellow';
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
	}
	
	
	// == Coordinate Object ==
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    
    
    // == Snake Object ==
    function Snake() {
        this.numberOfElements = 0;
        this.coordinateArray = [MAX_INPUT];
    }
    Snake.prototype.coordinateArray = [MAX_INPUT];
	Snake.prototype.numberOfElements = 0;
    Snake.prototype.create = function() {
            coordinateHeadSnake = new Coord(0, 1);
            coordinateTail = new Coord(0,0);
            this.addCoordAtBack(coordinateHeadSnake);
            this.addCoordAtBack(coordinateTail);
    };
    Snake.prototype.moveSnake = function(coord, direction) {
		// when we hit a wall translate to other side
		if (direction == Directions.RIGHT && coord.x*16 > 500) {
			coord = new Coord(-1, coord.y);
		} else if (direction == Directions.LEFT && coord.x < 0) {
			coord = new Coord(500/16, coord.y);
		} else if (direction == Directions.DOWN && coord.y*16 > 300) {
			coord = new Coord(coord.x, -1);
		} else if (direction == Directions.UP && coord.y < 0) {
			coord = new Coord(coord.x, 300/16);
		}
		
		// actually movement
        for(let i = this.numberOfElements; i >= 1; i--) {
            this.coordinateArray[i] = this.coordinateArray[i-1];
        }
        this.coordinateArray[0] = coord;
        
    }
    Snake.prototype.moveDown = function() {
		const cH = game.snake.coordinateArray[0];
		let coordHeadSnake = new Coord(cH.x, cH.y + 1);
		game.snake.moveSnake(coordHeadSnake, Directions.DOWN);
	},
	Snake.prototype.moveUp = function() {
		const cH = game.snake.coordinateArray[0];
		coordHeadSnake = new Coord(cH.x, cH.y - 1);
		game.snake.moveSnake(coordHeadSnake, Directions.UP);
	},
	Snake.prototype.moveRight = function() {
		const cH = game.snake.coordinateArray[0];
		coordHeadSnake = new Coord(cH.x + 1, cH.y);
		game.snake.moveSnake(coordHeadSnake, Directions.RIGHT);
	},
	Snake.prototype.moveLeft = function() {
		const cH = game.snake.coordinateArray[0];
		coordHeadSnake = new Coord(cH.x - 1, cH.y);
		game.snake.moveSnake(coordHeadSnake, Directions.LEFT);
	},
    Snake.prototype.addCoordAtBack = function(coord) {
        this.coordinateArray[this.numberOfElements] = coord;
        this.numberOfElements++;
    }
    Snake.prototype.draw = function(ctx) {
		for(let i = 0; i <= this.numberOfElements -1; i++) {
            const radius = 8;
			const lineWidth = 1;
			const x = this.coordinateArray[i].x * 16 + radius + lineWidth*2;
			const y = this.coordinateArray[i].y * 16 + radius + lineWidth*2;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'green';
			if (i == 0) {
				ctx.fillStyle = 'red';
			}
			
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#003300';
			ctx.stroke();
        }
	}
	Snake.prototype.collidesWithHerself = function() {
		let head = this.coordinateArray[0];
		for(let i = 3; i <= this.numberOfElements -1; i++) {
			const radiusSum = 16;

			//substract vectors to calculate distance
			const x1 = head.x*16 - this.coordinateArray[i].x *16;
			const y1 = head.y*16 - this.coordinateArray[i].y*16;
			
			//calculate length of vector
			const length = Math.sqrt((x1 * x1) + (y1 * y1));

			if (length <= radiusSum) {
				return true;
			}
		}
		return false;
	}
	Snake.prototype.collidesWithCoord = function(coord) {
		//for(let i = 0; i <= this.numberOfElements -1; i++) {
			const radiusSum = 16;

			//substract vectors to calculate distance
			const x1 = coord.x - this.coordinateArray[0].x * 16;
			const y1 = coord.y - this.coordinateArray[0].y * 16;

			//calculate length of vector
			const length = Math.sqrt((x1 * x1) + (y1 * y1));

			if (length <= radiusSum) {
				return true;
			}
		//}
		return false;
	}
    
    // == Game Object ==
    function Game(ctx) {
        this.ctx = ctx; // drawing context
        this.snake = new Snake();
		this.apples = [];
		this.lastRender = 0;
		this.direction = Directions.DOWN;
		this.score = 0;
		this.text = "Press Space Key to start Game";
    }
    Game.prototype.pressedKeys = {
		left: false,
		right: false,
		up: false,
		down: false
	},
    Game.prototype.keyMap = {
		39: 'right',
		37: 'left',
		38: 'up',
		40: 'down'
	},
	Game.prototype.keyDown = function(event) {
		var key = this.keyMap[event.keyCode]
		this.pressedKeys[key] = true
	},
	Game.prototype.keyUp = function(event) {
		var key = this.keyMap[event.keyCode]
		this.pressedKeys[key] = false
	},
    Game.prototype.start = function(ctx) {
        //this.setSpeed(this.speed);
		this.reset();
		game.draw(ctx);
    }
    Game.prototype.draw = function(ctx) {
		// alle elemente zeichnen nach einem Durchlauf
		ctx.fillStyle = "grey";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillStyle = "black";
		this.ctx.fillText( this.text, 10, 280);
		ctx.fillStyle = "white";
		this.ctx.fillText( this.score, 450, 280);
		this.snake.draw(ctx);
		for(let apple of game.apples) {
			apple.draw(ctx);
		}
	}
	Game.prototype.reset = function() {
		score = 0;
		this.direction = Directions.DOWN;
		this.apples = [];
		this.snake = new Snake();
		this.snake.create();
		this.createApple();
	}
	Game.prototype.createApple = function() {
		const x1 = Math.floor(Math.random() * 500);
		const x2 = x1 - (x1 % 16);
		
		const y1 = Math.floor(Math.random() * 300);
		const y2 = y1 - (y1 % 16);
		coordApple = new Coord(x2, y2);
		if (game.snake.collidesWithCoord(coordApple)) {
			game.createApple();
		}
		game.apples.push(new Apple(coordApple));
	}
    
    const main = document.querySelector('#main');
    if (!main.getContext) {
        return;
    }
    // get the context
    let ctx = main.getContext('2d');
	ctx.font = "13px Impact";
	
	let game = new Game(ctx);
	
	
	 function loop(timestamp) {
		var progress = timestamp - game.lastRender;
		
		if (progress > 100) {
			
			console.log(game.apples.length);
			for (let i = 0; i<= game.apples.length-1; i++) {
				if (game.snake.collidesWithCoord(game.apples[i].coord)) {
					game.score++;
					game.apples.splice(i, 1);
					game.createApple();
					game.snake.numberOfElements++;
					break;
				}
			}
			
			if (game.pressedKeys.down && game.direction != Directions.UP) {
				game.direction = Directions.DOWN;
			} else if (game.pressedKeys.up && game.direction != Directions.DOWN) {
				game.direction = Directions.UP;
			} else if (game.pressedKeys.right && game.direction != Directions.LEFT) {
				game.direction = Directions.RIGHT;
			} else if (game.pressedKeys.left && game.direction != Directions.RIGHT) {
				game.direction = Directions.LEFT;
			}
			
			switch(game.direction) {
				case Directions.UP:
					game.snake.moveUp();
					break;
				case Directions.DOWN:
					game.snake.moveDown();
					break;
				case Directions.RIGHT:
					game.snake.moveRight();
					break;
				case Directions.LEFT:
					game.snake.moveLeft();
					break;
			}
			if (game.snake.collidesWithHerself()) {
				game.text = "Game Over";
				game.start(ctx);
				game.draw(ctx);
				return;
			}
			game.draw(ctx);
			
			game.lastRender = timestamp;
		}
		window.requestAnimationFrame(loop);
	}
	
	window.onkeydown = function(event){
		if(event.keyCode === 32) {
			game.start(ctx);
			game.text = "Let's go...";
			window.addEventListener("keydown", function(event) {game.keyDown(event);}, false);
			window.addEventListener("keyup", function(event) {game.keyUp(event);}, false);
			window.requestAnimationFrame(loop);
		}
	}

})();

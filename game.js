// Simple direction map to remove "switch" statements:
const DIRECTIONS = {
    right: { dx: 1,  dy: 0,  angle: 0   },
    down:  { dx: 0,  dy: 1,  angle: 90  },
    left:  { dx: -1, dy: 0,  angle: 180 },
    up:    { dx: 0,  dy: -1, angle: 270 }
  };
  
  // Game State class to manage global game state
  class GameState {
    constructor() {
      this.isGameOver = false;
      this.isPaused = false;
      this.score = 0;
      this.maxFood = 3;
    }
  }
  
  // Snake class to manage the snake's behavior and rendering
  class Snake {
    constructor(parentElement, gameState) {
      this.parentElement = parentElement;
      this.gameState = gameState;
      
      // Basic snake properties
      this.size = 5;            // in vmin
      this.speed = this.size;           // movement step in %
      this.direction = "right"; // current direction
      this.nextDirection = "right"; // used to prevent instant reverse
      this.body = [{ x: 50, y: 50 }]; // initial position
      this.snakeElements = [];  // references to DOM elements
      this.intervalId = null;
  
      this.createDomElements();
    }
  
    // Helper method to create a single snake-segment DOM element
    createSegmentElement() {
      const el = document.createElement("div");
      el.className = "snake-segment";
      el.style.position = "absolute";
      el.style.width = `${this.size}vmin`;
      el.style.height = `${this.size}vmin`;
      return el;
    }
  
    // Create DOM elements for the initial body of the snake
    createDomElements() {
      this.body.forEach((segment, index) => {
        const element = this.createSegmentElement();
        // Position it
        element.style.left = `calc(${segment.x}% - ${this.size / 2}vmin)`;
        element.style.top = `calc(${segment.y}% - ${this.size / 2}vmin)`;
  
        this.parentElement.appendChild(element);
        this.snakeElements.push(element);
  
        // The first segment is the head
        if (index === 0) {
          element.id = "snakeHead";
          element.style.transform = `rotate(${DIRECTIONS[this.direction].angle}deg)`;
        }
      });
    }
  
    // Main move method
    move() {
      if (this.gameState.isGameOver || this.gameState.isPaused) return;
  
      // Update the snake body from tail to head
      for (let i = this.body.length - 1; i > 0; i--) {
        this.body[i] = { ...this.body[i - 1] };
      }
  
      // Move the head based on current direction
      const head = this.body[0];
      const dir = DIRECTIONS[this.direction];
      head.x += dir.dx * this.speed;
      head.y += dir.dy * this.speed;
  
      // Render updated positions
      this.updateUI();
    }
  
    // Sync the DOM with the snake's new positions
    updateUI() {
      this.body.forEach((segment, index) => {
        const element = this.snakeElements[index];
        element.style.left = `calc(${segment.x}% - ${this.size / 2}vmin)`;
        element.style.top = `calc(${segment.y}% - ${this.size / 2}vmin)`;

        element.style.zIndex = this.body.length - index;
      });
  
      // Rotate the head based on direction
      const headElement = this.snakeElements[0];
      headElement.style.transform = `rotate(${DIRECTIONS[this.direction].angle}deg)`;
    }
  
    // Grow the snake when eating food
    grow() {
      const lastSegment = this.body[this.body.length - 1];
      // Duplicate the last segment's position
      this.body.push({ ...lastSegment });
  
      // Create a new DOM element for the new segment
      const element = this.createSegmentElement();
      this.parentElement.appendChild(element);
      this.snakeElements.push(element);
    }
  
    // Change direction if it's not the opposite of current
    changeDirection() {
      const oppositeDirections = {
        right: "left",  left: "right",
        up:    "down",  down: "up"
      };
  
      if (this.nextDirection !== oppositeDirections[this.direction]) {
        this.direction = this.nextDirection;
      }
    }
  
    // Check collisions: walls, self, food
    checkCollisions(foodArray) {
      if (this.gameState.isGameOver) return;
  
      const head = this.body[0];
  
      // 1. Boundary collisions
      if (head.x < 0 || head.x > 100 || head.y < 0 || head.y > 100) {
        this.gameOver();
        return;
      }
  
      // 2. Self collisions (start from 4 to avoid brand-new overlaps)
      for (let i = 4; i < this.body.length; i++) {
        if (head.x === this.body[i].x && head.y === this.body[i].y) {
          this.gameOver();
          return;
        }
      }
  
      // 3. Food collisions
      for (let i = 0; i < foodArray.length; i++) {
        const food = foodArray[i];
        const dx = Math.abs(head.x - food.positionX);
        const dy = Math.abs(head.y - food.positionY);
  
        if (dx < this.size && dy < this.size) {
          this.handleFoodCollision(food, foodArray, i);
          break;
        }
      }
    }
  
    // Handle eating food
    handleFoodCollision(food, foodArray, index) {
      // Remove food from DOM and array
      food.foodElm.remove();
      foodArray.splice(index, 1);
  
      // Grow snake and increase score
      this.grow();
      this.gameState.score += 10;
      this.updateScore();

      // coin sound effect
      const coinSound = new Audio('./assets/04_coinSound.mp3');
      coinSound.play();
    }
  
    // End game
    gameOver() {
      this.gameState.isGameOver = true;
      clearInterval(this.intervalId);
      this.showGameOverScreen();
    }
  
    // Show the game-over screen
    showGameOverScreen() {
      const gameOverElm = document.createElement("div");
      gameOverElm.className = "game-over";
      gameOverElm.innerHTML = `
        <h1>Game Over!</h1>
        <p>Score: ${this.gameState.score}</p>
        <button onclick="location.reload()">Play Again</button>
      `;
      this.parentElement.appendChild(gameOverElm);
    }
  
    // Update score on screen
    updateScore() {
      const scoreElm = document.getElementById("score");
      if (scoreElm) {
        scoreElm.textContent = `Score: ${this.gameState.score}`;
      }
    }
  
    // Start snake movement (only once)
    startMoving(foodArray) {
      if (this.intervalId) return;
  
      this.intervalId = setInterval(() => {
        if (!this.gameState.isPaused) {
          this.changeDirection();
          this.move();
          this.checkCollisions(foodArray);
        }
      }, 100);
    }
  }
  
  // Food class to manage food behavior and rendering
  class Food {
    constructor(parentElement, snake) {
      this.snake = snake;
      this.size = 5; // food size in vmin
  
      // Find a valid position that doesn't overlap with the snake
      do {
        this.positionX = Math.random() * (100 - this.size);
        this.positionY = Math.random() * (100 - this.size);
      } while (this.checkSnakeOverlap());
  
      // Create the food element
      this.foodElm = document.createElement("div");
      this.foodElm.className = "food";
      this.foodElm.style.position = "absolute";
      this.foodElm.style.width = `${this.size}vmin`;
      this.foodElm.style.height = `${this.size}vmin`;
      this.foodElm.style.left = `calc(${this.positionX}% - ${this.size / 2}vmin)`;
      this.foodElm.style.top = `calc(${this.positionY}% - ${this.size / 2}vmin)`;
  
      parentElement.appendChild(this.foodElm);
    }
  
    // Check if the generated position overlaps with the snake body
    checkSnakeOverlap() {
      return this.snake.body.some(segment => {
        return (
          Math.abs(this.positionX - segment.x) < this.size &&
          Math.abs(this.positionY - segment.y) < this.size
        );
      });
    }
  }
  
  // Game initialization
  document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("gameArea");

   
  
    // Create UI elements (score & instructions)
    const scoreElement = document.createElement("div");
    scoreElement.id = "score";
    scoreElement.className = "score";
    scoreElement.textContent = "Score: 0";
    gameArea.appendChild(scoreElement);
  
    const instructions = document.createElement("div");
    instructions.className = "instructions";
    instructions.textContent = "Press SPACE to start, P to pause";
    gameArea.appendChild(instructions);
  
    // Initialize game state, snake, and food array
    const gameState = new GameState();
    const snake = new Snake(gameArea, gameState);
    const foodArray = [];

     // background music
     const backgroundSound = new Audio('./assets/05_backgroundMusic.mp3');
     backgroundSound.loop = true;
     backgroundSound.play();
     backgroundSound.volume = 0.5;
  
    // Spawn initial food
    foodArray.push(new Food(gameArea, snake));
  
    // Spawn more food over time (max 3 by default)
    setInterval(() => {
      if (foodArray.length < gameState.maxFood && !gameState.isGameOver) {
        foodArray.push(new Food(gameArea, snake));
      }
    }, 2000);
  
    // Keyboard controls
    document.addEventListener("keydown", (event) => {
      if (gameState.isGameOver) return;
  
      switch (event.code) {
        case "ArrowLeft":
          snake.nextDirection = "left";
          break;
        case "ArrowRight":
          snake.nextDirection = "right";
          break;
        case "ArrowUp":
          snake.nextDirection = "up";
          break;
        case "ArrowDown":
          snake.nextDirection = "down";
          break;
        case "Space":
          snake.startMoving(foodArray);
          instructions.style.display = "none";
          break;
        case "KeyP":
          gameState.isPaused = !gameState.isPaused;
          break;
      }
    });
  });
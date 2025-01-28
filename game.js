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
        this.size = 5;
        this.speed = 2;
        this.direction = "right";
        this.nextDirection = "right";
        this.gameState = gameState;

        this.body = [{ x: 50, y: 50 }]; // Initial position of the snake
        this.snakeElements = [];
        this.parentElement = parentElement;
        this.createDomElements();
    }

    // Create DOM elements for the snake
    createDomElements() {
        this.body.forEach(segment => {
            const element = document.createElement("div");
            element.className = "snake-segment";
            element.style.position = "absolute";
            element.style.width = `${this.size}vmin`;
            element.style.height = `${this.size}vmin`;
            element.style.left = `calc(${segment.x}% - ${this.size / 2}vmin)`;
            element.style.top = `calc(${segment.y}% - ${this.size / 2}vmin)`;
            this.parentElement.appendChild(element);
            this.snakeElements.push(element);
        });

        // Rotate the snake head based on direction
        const headElement = this.snakeElements[0];
        headElement.id = "snakeHead";
        const rotation = { right: 0, down: 90, left: 180, up: 270 };
        headElement.style.transform = `rotate(${rotation[this.direction]}deg)`;
    }

    // Move the snake
    move() {
        if (this.gameState.isGameOver || this.gameState.isPaused) return;

        // Move the body segments
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = { ...this.body[i - 1] };
        }

        // Move the head based on direction
        const head = this.body[0];
        switch (this.direction) {
            case "right": head.x += this.speed; break;
            case "left": head.x -= this.speed; break;
            case "up": head.y -= this.speed; break;
            case "down": head.y += this.speed; break;
        }

        // Update the DOM
        this.updateUI();
    }

    // Update the snake's DOM elements
    updateUI() {
        this.body.forEach((segment, index) => {
            const element = this.snakeElements[index];
            element.style.left = `calc(${segment.x}% - ${this.size / 2}vmin)`;
            element.style.top = `calc(${segment.y}% - ${this.size / 2}vmin)`;
        });

        // Rotate the snake head
        const headElement = this.snakeElements[0];
        const rotation = { right: 0, down: 90, left: 180, up: 270 };
        headElement.style.transform = `rotate(${rotation[this.direction]}deg)`;
    }

    // Grow the snake when it eats food
    grow() {
        const lastSegment = this.body[this.body.length - 1];
        this.body.push({ ...lastSegment });

        const element = document.createElement("div");
        element.className = "snake-segment";
        element.style.position = "absolute";
        element.style.width = `${this.size}vmin`;
        element.style.height = `${this.size}vmin`;
        this.parentElement.appendChild(element);
        this.snakeElements.push(element);
    }

    // Change the snake's direction
    changeDirection() {
        const oppositeDirections = {
            right: "left",
            left: "right",
            up: "down",
            down: "up"
        };

        if (this.nextDirection !== oppositeDirections[this.direction]) {
            this.direction = this.nextDirection;
        }
    }

    // Check for collisions with boundaries, self, or food
    checkCollisions(foodArray) {
        if (this.gameState.isGameOver) return;

        const head = this.body[0];

        // Check boundary collisions
        if (head.x < 0 || head.x > 100 || head.y < 0 || head.y > 100) {
            this.gameOver();
            return;
        }

        // Check self collisions (skip the head)
        for (let i = 4; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                this.gameOver();
                return;
            }
        }

        // Check food collisions
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

    // Handle food collision
    handleFoodCollision(food, foodArray, index) {
        food.foodElm.remove();
        foodArray.splice(index, 1);
        this.grow();
        this.gameState.score += 10;
        this.updateScore();
    }

    // Game over logic
    gameOver() {
        this.gameState.isGameOver = true;
        clearInterval(this.intervalId);
        this.showGameOverScreen();
    }

    // Show game over screen
    showGameOverScreen() {
        const gameOver = document.createElement("div");
        gameOver.className = "game-over";
        gameOver.innerHTML = `
            <h1>Game Over!</h1>
            <p>Score: ${this.gameState.score}</p>
            <button onclick="location.reload()">Play Again</button>
        `;
        this.parentElement.appendChild(gameOver);
    }

    // Update the score display
    updateScore() {
        document.getElementById("score").textContent = `Score: ${this.gameState.score}`;
    }

    // Start the snake's movement
    startMoving(foodArray) {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            if (!this.gameState.isPaused) {
                this.changeDirection();
                this.move();
                this.checkCollisions(foodArray);
            }
        }, 50);
    }
}

// Food class to manage food behavior and rendering
class Food {
    constructor(parentElement, snake) {
        this.size = 5;
        this.snake = snake;

        // Find a valid position that doesn't overlap with the snake
        do {
            this.positionX = Math.random() * (100 - this.size);
            this.positionY = Math.random() * (100 - this.size);
        } while (this.checkSnakeOverlap());

        this.foodElm = document.createElement("div");
        this.foodElm.className = "food";
        this.foodElm.style.position = "absolute";
        this.foodElm.style.width = `${this.size}vmin`;
        this.foodElm.style.height = `${this.size}vmin`;
        this.foodElm.style.left = `calc(${this.positionX}% - ${this.size / 2}vmin)`;
        this.foodElm.style.top = `calc(${this.positionY}% - ${this.size / 2}vmin)`;
        parentElement.appendChild(this.foodElm);
    }

    // Check if the food overlaps with the snake
    checkSnakeOverlap() {
        return this.snake.body.some(segment => {
            return Math.abs(this.positionX - segment.x) < this.size &&
                   Math.abs(this.positionY - segment.y) < this.size;
        });
    }
}

// Game initialization
document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("gameArea");

    // Create UI elements
    const scoreElement = document.createElement("div");
    scoreElement.id = "score";
    scoreElement.className = "score";
    scoreElement.textContent = "Score: 0";
    gameArea.appendChild(scoreElement);

    const instructions = document.createElement("div");
    instructions.className = "instructions";
    instructions.textContent = "Press SPACE to start, P to pause";
    gameArea.appendChild(instructions);

    const gameState = new GameState();
    const snake = new Snake(gameArea, gameState);
    const foodArray = [];

    // Spawn initial food
    foodArray.push(new Food(gameArea, snake));

    // Spawn food at random intervals
    setInterval(() => {
        if (foodArray.length < gameState.maxFood && !gameState.isGameOver) {
            foodArray.push(new Food(gameArea, snake));
        }
    }, 2000);

    // Keyboard controls
    document.addEventListener("keydown", (event) => {
        if (gameState.isGameOver) return;

        switch (event.code) {
            case "ArrowLeft": snake.nextDirection = "left"; break;
            case "ArrowRight": snake.nextDirection = "right"; break;
            case "ArrowUp": snake.nextDirection = "up"; break;
            case "ArrowDown": snake.nextDirection = "down"; break;
            case "Space":
                snake.startMoving(foodArray);
                instructions.style.display = "none";
                break;
            case "KeyP": gameState.isPaused = !gameState.isPaused; break;
        }
    });
});
/*

// Game State class to manage global game state
class GameState {
    constructor() {
        this.isGameOver = false;
        this.isPaused = false;
        this.score = 0;
        this.maxFood = 3;
    }
}

class Snake {
    constructor(parentElement, gameState) {
        this.size = 5;
        this.speed = 2; // Increased for smoother movement
        this.direction = "right";
        this.nextDirection = "right";
        this.spacing = 1;
        this.gameState = gameState;

        this.body = [{ x: 50, y: 50 }];
        this.snakeElements = [];
        this.parentElement = parentElement;
        this.createDomElements();
    }

    createDomElements() {
        this.body.forEach(() => {
            const segment = document.createElement("div");
            segment.className = "snake-segment";
            segment.style.position = "absolute";
            segment.style.width = `${this.size}vmin`;
            segment.style.height = `${this.size}vmin`;
            this.parentElement.appendChild(segment);
            this.snakeElements.push(segment);
        });
        this.updateUI();
    }

    updateUI() {
        const unit = "vmin";
        this.body.forEach((segment, index) => {
            const element = this.snakeElements[index];
            element.style.left = `calc(${segment.x}% - ${this.size / 2}${unit})`;
            element.style.top = `calc(${segment.y}% - ${this.size / 2}${unit})`;
        });
    }

    move() {
        if (this.gameState.isGameOver || this.gameState.isPaused) return;

        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = { ...this.body[i - 1] };
        }

        const head = this.body[0];
        switch (this.direction) {
            case "right": head.x += this.speed; break;
            case "left": head.x -= this.speed; break;
            case "up": head.y -= this.speed; break;
            case "down": head.y += this.speed; break;
        }
        this.updateUI();
        this.snakeElements[0].id = "snakeHead";
        
        // Rotate snake head based on direction
        const headElement = this.snakeElements[0];
        const rotation = {
            right: 0,
            down: 90,
            left: 180,
            up: 270
        };
        headElement.style.transform = `rotate(${rotation[this.direction]}deg)`;
    }

    grow() {
        const lastSegment = this.body[this.body.length - 1];
        this.body.push({ ...lastSegment });

        const segment = document.createElement("div");
        segment.className = "snake-segment";
        segment.style.position = "absolute";
        segment.style.width = `${this.size}vmin`;
        segment.style.height = `${this.size}vmin`;
        this.parentElement.appendChild(segment);
        this.snakeElements.push(segment);
    }

    changeDirection() {
        // Store current direction
        const currentDirection = this.direction;
        
        // Only change direction if it's valid (not opposite of current direction)
        if (this.nextDirection === "left" && currentDirection !== "right") {
            this.direction = "left";
        } else if (this.nextDirection === "right" && currentDirection !== "left") {
            this.direction = "right";
        } else if (this.nextDirection === "up" && currentDirection !== "down") {
            this.direction = "up";
        } else if (this.nextDirection === "down" && currentDirection !== "up") {
            this.direction = "down";
        }
    }

    checkCollisions(foodArray) {
        if (this.gameState.isGameOver) return;

        const head = this.body[0];
        
        // Check fatal collisions (boundary and self)
        if (this.checkBoundaryCollision(head) || this.checkSelfCollision(head)) {
            this.gameOver();
            return;
        }

        // Check food collisions - these are good collisions!
        this.checkFoodCollisions(foodArray);
    }

    checkBoundaryCollision(head) {
        const margin = this.size / 2;
        return (head.x - margin < 0 || head.x + margin > 100 || 
                head.y - margin < 0 || head.y + margin > 100);
    }

    
    checkSelfCollision(head) {
        return this.body.slice(4).some(segment => {
         return Math.abs(head.x - segment.x) < this.size &&
                   Math.abs(head.y - segment.y) < this.size;
     });
   }
    

    checkFoodCollisions(foodArray) {
        const head = this.body[0];
        const collisionThreshold = (this.size + 5) / 2; // Adjusted collision threshold

        for (let i = foodArray.length - 1; i >= 0; i--) {
            const food = foodArray[i];
            const dx = Math.abs(head.x - food.positionX);
            const dy = Math.abs(head.y - food.positionY);
            
            if (dx < collisionThreshold && dy < collisionThreshold) {
                this.handleFoodCollision(food, foodArray, i);
            }
        }
    }

    handleFoodCollision(food, foodArray, index) {
        food.foodElm.remove();
        foodArray.splice(index, 1);
        this.grow();
        this.gameState.score += 10;
        this.updateScore();
    }

    gameOver() {
        this.gameState.isGameOver = true;
        clearInterval(this.intervalId);
        this.showGameOverScreen();
    }

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

    updateScore() {
        document.getElementById("score").textContent = `Score: ${this.gameState.score}`;
    }

    startMoving(foodArray) {
        if (this.intervalId) return;
        
        this.intervalId = setInterval(() => {
            if (!this.gameState.isPaused) {
                this.changeDirection();
                this.move();
                this.checkCollisions(foodArray);
            }
        }, 50); // Decreased interval for smoother movement
    }
}

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

    checkSnakeOverlap() {
        return this.snake.body.some(segment => {
            const distance = Math.sqrt(
                Math.pow(this.positionX - segment.x, 2) + 
                Math.pow(this.positionY - segment.y, 2)
            );
            return distance < (this.size + this.snake.size);
        });
    }
}

class FoodManager {
    constructor(gameArea, snake, gameState) {
        this.gameArea = gameArea;
        this.snake = snake;
        this.gameState = gameState;
        this.foods = [];
    }

    spawnFood() {
        if (this.foods.length < this.gameState.maxFood && !this.gameState.isGameOver) {
            const newFood = new Food(this.gameArea, this.snake);
            this.foods.push(newFood);
        }
    }

    removeOldestFood() {
        if (this.foods.length > 0) {
            const oldFood = this.foods.shift();
            oldFood.foodElm.remove();
        }
    }

    startFoodSystem() {
        setInterval(() => {
            if (Math.random() < 0.3) this.spawnFood();
        }, 2000);

        setInterval(() => this.removeOldestFood(), 8000);
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

    // Modified food spawning logic
    const spawnFood = () => {
        if (foodArray.length < gameState.maxFood && !gameState.isGameOver) {
            const newFood = new Food(gameArea, snake);
            foodArray.push(newFood);
        }
    };

    // Initial food spawn
    spawnFood();

    // Spawn food at random intervals
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance to spawn food
            spawnFood();
        }
    }, 2000);

    // Remove old food
    setInterval(() => {
        if (foodArray.length > 0) {
            const oldFood = foodArray.shift();
            oldFood.foodElm.remove();
        }
    }, 8000);

    // Enhanced keyboard controls
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


// V5 ***********

// Snake class
class Snake {
    constructor(parentElement) {
        this.size = 5; // Size of each segment
        this.speed = 1; // Movement increment
        this.direction = "right";
        this.nextDirection = "right";
        this.spacing = 1

        // Initialize the body with one segment (the head)
        this.body = [{ x: 50, y: 50 }];

        // Create the DOM elements for the snake
        this.snakeElements = [];
        this.parentElement = parentElement;
        this.createDomElements();
    }

    createDomElements() {
        this.body.forEach(() => {
            const segment = document.createElement("div");
            segment.className = "snake-segment";
            
            segment.style.position = "absolute";
            segment.style.width = `${this.size}vmin`;
            segment.style.height = `${this.size}vmin`;
            this.parentElement.appendChild(segment);
            this.snakeElements.push(segment);


        });
        this.updateUI();
    }

    updateUI() {
        const unit = "vmin";
        this.body.forEach((segment, index) => {
            const element = this.snakeElements[index];
            element.style.left = `calc(${segment.x}% - ${this.size / 2}${unit})`;
            element.style.top = `calc(${segment.y}% - ${this.size / 2}${unit})`;
        });
    }

    move() {
        // Shift each segment to the position of the previous one
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i] = { ...this.body[i - 1] };
        }

        // Move the head in the current direction
        const head = this.body[0];
        switch (this.direction) {
            case "right": head.x += this.speed; break;
            case "left": head.x -= this.speed; break;
            case "up": head.y -= this.speed; break;
            case "down": head.y += this.speed; break;
        }
        this.updateUI();
        this.snakeElements[0].id = "snakeHead";
    }

    grow() {
        // Add a new segment at the same position as the last segment
        const lastSegment = this.body[this.body.length - 1];
        this.body.push({ ...lastSegment });

        // Create a new DOM element for the new segment
        const segment = document.createElement("div");
        segment.className = "snake-segment";
        segment.style.position = "absolute";
        segment.style.width = `${this.size}vmin`;
        segment.style.height = `${this.size}vmin`;
        this.parentElement.appendChild(segment);
        this.snakeElements.push(segment);
    }

    changeDirection() {
        if (
            (this.nextDirection === "left" && this.direction !== "right") ||
            (this.nextDirection === "right" && this.direction !== "left") ||
            (this.nextDirection === "up" && this.direction !== "down") ||
            (this.nextDirection === "down" && this.direction !== "up")
        ) {
            this.direction = this.nextDirection;
        }
    }

    checkCollisions(foodArray) {
        const head = this.body[0];

        // Check boundary collisions
        if (head.x < 0 || head.x > 100 || head.y < 0 || head.y > 100) {
            console.log("Game over!");
            clearInterval(this.intervalId);
            return true;
        }

        // Check self-collision
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                console.log("Game over!");
                clearInterval(this.intervalId);
                return true;
            }
        }

        // Check food collisions
        foodArray.forEach((food, i) => {
            if (
                head.x < food.positionX + food.size &&
                head.x + this.size > food.positionX &&
                head.y < food.positionY + food.size &&
                head.y + this.size > food.positionY
            ) {
                food.foodElm.remove(); // Remove food from the DOM
                foodArray.splice(i, 1); // Remove from the array
                this.grow(); // Grow the snake
            }
        });
    }

    startMoving(foodArray) {
        this.intervalId = setInterval(() => {
            this.changeDirection();
            this.move();
            this.checkCollisions(foodArray);
        }, 100);
    }
}

// Food class
class Food {
    constructor(parentElement) {
        this.size = 5;
        this.positionX = Math.random() * (100 - this.size);
        this.positionY = Math.random() * (100 - this.size);

        this.foodElm = document.createElement("div");
        this.foodElm.className = "food";
        this.foodElm.style.position = "absolute";
        this.foodElm.style.width = `${this.size}vmin`;
        this.foodElm.style.height = `${this.size}vmin`;
        this.foodElm.style.left = `calc(${this.positionX}% - ${this.size / 2}vmin)`;
        this.foodElm.style.top = `calc(${this.positionY}% - ${this.size / 2}vmin)`;

        parentElement.appendChild(this.foodElm);
    }
}

// Game initialization
document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("gameArea");
    const snake = new Snake(gameArea);
    const foodArray = [];

    // Spawn food every 5 seconds
    setInterval(() => {
        const newFood = new Food(gameArea);
        foodArray.push(newFood);
    }, 5000);

    // Remove food every 5 seconds
    setInterval(() => {
        foodArray.shift();
    }, 8000);

    // Add keyboard controls
    document.addEventListener("keydown", (event) => {
        if (event.code === "ArrowLeft") {
            snake.nextDirection = "left";
        } else if (event.code === "ArrowRight") {
            snake.nextDirection = "right";
        } else if (event.code === "ArrowUp") {
            snake.nextDirection = "up";
        } else if (event.code === "ArrowDown") {
            snake.nextDirection = "down";
        } else if (event.code === "Space") {
            snake.startMoving(foodArray);
        }
    });
});

/* V4

/* V3

class Snake {
    constructor() {
        this.size = 5;
        this.positionX = 50;
        this.positionY = 50;
        this.speed = 1;
        this.direction = "right";
        this.nextDirection = "right";
    

        this.snakeElement = document.getElementById("snake");
        this.updateUI();
        
    }

    updateUI() {
        const unit = "vmin";
        this.snakeElement.style.width = `${this.size}${unit}`;
        this.snakeElement.style.height = `${this.size}${unit}`;
        this.snakeElement.style.left = `calc(${this.positionX}% - ${this.size / 2}${unit})`;
        this.snakeElement.style.top = `calc(${this.positionY}% - ${this.size / 2}${unit})`;
    }

    startMoving() {
        this.intervalId = setInterval(() => {
            this.changeDirection(); 
            this.move();
            this.checkCollisions();
            this.updateUI();
        }, 100); 
    }

    stopMoving() {
        clearInterval(this.intervalId);
    }

    changeDirection() {
        // Prevent the snake from reversing direction
        if (
            (this.nextDirection === "left" && this.direction !== "right") ||
            (this.nextDirection === "right" && this.direction !== "left") ||
            (this.nextDirection === "up" && this.direction !== "down") ||
            (this.nextDirection === "down" && this.direction !== "up")
        ) {
            this.direction = this.nextDirection;
        }
    }

    move() {
        switch (this.direction) {
            case "right":
                this.positionX += this.speed;
                break;
            case "left":
                this.positionX -= this.speed;
                break;
            case "up":
                this.positionY -= this.speed;
                break;
            case "down":
                this.positionY += this.speed;
                break;
        }
    }

    

    checkCollisions() {
        // Check boundary collisions
        if (
            this.positionX < 0 || 
            this.positionX > 100 ||
            this.positionY < 0 || 
            this.positionY > 100
        ) {
            console.log("game over...");
            this.stopMoving();
            return true;
        }

        // Check food collisions
        foodArray.forEach((food, i, array) => {
            if (
                this.positionX < food.positionX + food.size &&
                this.positionX + this.size > food.positionX &&
                this.positionY < food.positionY + food.size &&
                this.positionY + this.size > food.positionY
            ) {
                // Remove food element from DOM
                food.foodElm.remove();
                // Remove from array
                array.splice(i, 1);
               
            }
        });
    }
}

class Boundaries {
    constructor(){
        this.width = 25;
        this.height = 25;
        this.positionX = 50;
        this.positionY = 50;

        this.createDomElement();
    }
    createDomElement () {
        // step1: create the element:
        this.boundariesElm = document.createElement("div");

        // step2: add content or modify
        this.boundariesElm.className = "boundaries";
        this.boundariesElm.style.width = `${this.width}vw`;
        this.boundariesElm.style.height = `${this.height}vh`;
        this.boundariesElm.style.left = `${this.positionX}vw`;
        this.boundariesElm.style.top = `${this.positionY}vh`;

        //step3: append to the dom: `parentElm.appendChild()`
        const parentElm = document.getElementById("boundaries");
        parentElm.appendChild(this.boundariesElm);
    }


    

    checkCollisions() {
        // Check boundary collisions
        if (
            this.positionX < 0 || 
            this.positionX > 100 ||
            this.positionY < 0 || 
            this.positionY > 100
        ) {
            console.log("game over...");
            stopMoving();
            return true;
        }

    }
    
}


class Food { //change to food container

    constructor() {
        this.size = 5;
        // Random position within boundaries
        this.positionX = Math.floor(Math.random() * 100);
        this.positionY = Math.floor(Math.random() * 100);
        this.createDomElement();
    }

    createDomElement() {
        this.foodElm = document.createElement("div");
        this.foodElm.className = "food";
        this.foodElm.style.width = `${this.size}vmin`;
        this.foodElm.style.height = `${this.size}vmin`;
        
        this.foodElm.style.left = this.positionX + "vmin";
        this.foodElm.style.top = this.positionY + "vmin";

        const parentElm = document.getElementById("food");
        parentElm.appendChild(this.foodElm);
    }
}


const snake = new Snake();
const boundaries = new Boundaries();
const foodArray = [];



setInterval(() => {
    const newFood = new Food();
    foodArray.push(newFood);
}, 5000);

setInterval(() => {
    foodArray.forEach((food, i, array) => {
        if (
            snake.positionX < food.positionX + food.size &&
            snake.positionX + snake.size > food.positionX &&
            snake.positionY < food.positionY + food.size &&
            snake.positionY + snake.size > food.positionY
        ) {
            array.splice(i, 1);
        }
    });
}, 1000);



document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
        snake.nextDirection = "left";
        console.log("left");
    } else if (event.code === "ArrowRight") {
        snake.nextDirection = "right";
        console.log("right");
    } else if (event.code === "ArrowUp") {
        snake.nextDirection = "up";
        console.log("up");
    } else if (event.code === "ArrowDown") {
        snake.nextDirection = "down";
        console.log("down");
    } else if (event.code === "Space") {
        snake.startMoving();
        console.log("space");
    }
});




/* V2 ********

class Snake {
    constructor() {
        this.size = 5;
        this.positionX = 50;
        this.positionY = 50;
        this.speed = 1;
        this.direction = "right";
        this.nextDirection = "right";
    

        this.snakeElement = document.getElementById("snake");
        this.updateUI();
        //this.startMoving();
    }

    updateUI() {
        const unit = "vmin";
        this.snakeElement.style.width = `${this.size}${unit}`;
        this.snakeElement.style.height = `${this.size}${unit}`;
        this.snakeElement.style.left = `calc(${this.positionX}% - ${this.size / 2}${unit})`;
        this.snakeElement.style.top = `calc(${this.positionY}% - ${this.size / 2}${unit})`;
    }

    startMoving() {
        this.intervalId = setInterval(() => {
            this.changeDirection(); 
            this.move();
            this.checkCollisions();
            this.updateUI();
        }, 100); 
    }

    stopMoving() {
        clearInterval(this.intervalId);
    }

    changeDirection() {
        // Prevent the snake from reversing direction
        if (
            (this.nextDirection === "left" && this.direction !== "right") ||
            (this.nextDirection === "right" && this.direction !== "left") ||
            (this.nextDirection === "up" && this.direction !== "down") ||
            (this.nextDirection === "down" && this.direction !== "up")
        ) {
            this.direction = this.nextDirection;
        }
    }

    move() {
        switch (this.direction) {
            case "right":
                this.positionX += this.speed;
                break;
            case "left":
                this.positionX -= this.speed;
                break;
            case "up":
                this.positionY -= this.speed;
                break;
            case "down":
                this.positionY += this.speed;
                break;
        }
    }

    

    checkCollisions() {
        // Check boundary collisions
        if (
            this.positionX < 0 || 
            this.positionX > 100 ||
            this.positionY < 0 || 
            this.positionY > 100
        ) {
            console.log("game over...");
            this.stopMoving();
            return true;
        }

        // Check food collisions
        foodArray.forEach((food, i, array) => {
            if (
                this.positionX < food.positionX + food.size &&
                this.positionX + this.size > food.positionX &&
                this.positionY < food.positionY + food.size &&
                this.positionY + this.size > food.positionY
            ) {
                // Remove food element from DOM
                food.foodElm.remove();
                // Remove from array
                array.splice(i, 1);
               
            }
        });
    }
}

class Boundaries {
    constructor(){
        this.width = 25;
        this.height = 25;
        this.positionX = 50;
        this.positionY = 50;

        this.createDomElement();
    }
    createDomElement () {
        // step1: create the element:
        this.boundariesElm = document.createElement("div");

        // step2: add content or modify
        this.boundariesElm.className = "boundaries";
        this.boundariesElm.style.width = `${this.width}vw`
        this.boundariesElm.style.height = `${this.height}vh`
        this.boundariesElm.style.left = `${this.positionX}vw`
        this.boundariesElm.style.bottom = `${this.positionY}vh`

        //step3: append to the dom: `parentElm.appendChild()`
        const parentElm = document.getElementById("boundaries");
        parentElm.appendChild(this.boundariesElm);
    }
    
}

    class Food {
    constructor() {
        this.size = 5;
        // Random position within boundaries
        this.positionX = Math.floor(Math.random() * 100);
        this.positionY = Math.floor(Math.random() * 100);
        this.createDomElement();
    }

    createDomElement() {
        this.foodElm = document.createElement("div");
        this.foodElm.className = "food";
        this.foodElm.style.width = `${this.size}vmin`;
        this.foodElm.style.height = `${this.size}vmin`;
        this.foodElm.style.left = `calc(${this.positionX}% - ${this.size / 2}vmin)`;
        this.foodElm.style.top = `calc(${this.positionY}% - ${this.size / 2}vmin)`;

        const parentElm = document.getElementById("food");
        parentElm.appendChild(this.foodElm);
    }
}


const snake = new Snake();
const boundaries = new Boundaries();
const foodArray = [];

// create food

setInterval(() => {
    const newFood = new Food();
    foodArray.push(newFood);
}, 1000);

setInterval(() => {
    foodArray.forEach((food, i, array) => {
        if (
            snake.positionX < food.positionX + food.size &&
            snake.positionX + snake.size > food.positionX &&
            snake.positionY < food.positionY + food.size &&
            snake.positionY + snake.size > food.positionY
        ) {
            array.splice(i, 1);
        }
    });
}, 1000);


if (
    snake.positionX < boundaries.positionX + boundaries.width &&
    snake.positionX + snake.width > boundaries.positionX &&
    snake.positionY < boundaries.positionY + boundaries.height &&
    snake.positionY + snake.height > boundaries.positionY
) {
    // Collision detected!
    console.log("game over...");
    snake.stopMoving();
}

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
        snake.nextDirection = "left";
        console.log("left");
    } else if (event.code === "ArrowRight") {
        snake.nextDirection = "right";
        console.log("right");
    } else if (event.code === "ArrowUp") {
        snake.nextDirection = "up";
        console.log("up");
    } else if (event.code === "ArrowDown") {
        snake.nextDirection = "down";
        console.log("down");
    } else if (event.code === "Space") {
        snake.startMoving();
        console.log("space");
    }
});









/* V1 ***********
const gridSize = 10;

class Snake {
    constructor() {
        this.width = gridSize / 2;
        this.height = gridSize / 2;
        this.positionX = 25;
        this.positionY = 25;
        this.speed = 1;
        this.direction = "right";
        this.nextDirection = this.direction; // To handle direction changes
        this.body = [];
        this.snakeElement = document.getElementById("snake");
        this.updateUI();
        this.startMoving();
    }

    startMoving() {
        this.intervalId = setInterval(() => {
            this.changeDirection(); // Ensure direction updates smoothly
            this.move();
        }, 100); // Update every 100ms
    }

    stopMoving() {
        clearInterval(this.intervalId);
    }

    changeDirection() {
        // Prevent reversing direction
        if (
            (this.nextDirection === "right" && this.direction !== "left") ||
            (this.nextDirection === "left" && this.direction !== "right") ||
            (this.nextDirection === "up" && this.direction !== "down") ||
            (this.nextDirection === "down" && this.direction !== "up")
        ) {
            this.direction = this.nextDirection;
        }
    }

    move() {
        switch (this.direction) {
            case "right":
                this.positionX += this.speed;
                break;
            case "left":
                this.positionX -= this.speed;
                break;
            case "up":
                this.positionY -= this.speed;
                break;
            case "down":
                this.positionY += this.speed;
                break;
        }

        if (this.border) {
            this.checkBorderCollision();
        }

        this.updateUI();
    }

    updateUI() {
        this.snakeElement.style.width = `${this.width}vw`;
        this.snakeElement.style.height = `${this.height}vh`;
        this.snakeElement.style.left = `${this.positionX}vw`;
        this.snakeElement.style.top = `${this.positionY}vh`;
    }

    checkBorderCollision() {
        if (!this.border) return;
        
        // Log positions for debugging
        console.log('Snake position:', this.positionX, this.positionY);
        console.log('Border position:', this.border.positionX, this.border.positionY);
        
        if (
            this.positionX < this.border.positionX || // Left
            this.positionX + this.width > this.border.positionX + this.border.width || // Right
            this.positionY < this.border.positionY || // Top
            this.positionY + this.height > this.border.positionY + this.border.height // Bottom
        ) {
            console.log("Border collision!");
            this.stopMoving();
        }
    }
}

class Borders {
    constructor() {
        this.width = 50;  // 50% of viewport width
        this.height = 50; // 50% of viewport height
        this.positionX = 25; // Start from left edge of board
        this.positionY = 25; // Start from top edge of board
        this.createDomElement();
    }

    createDomElement() {
        this.bordersElement = document.getElementById("borders");
        if (!this.bordersElement) {
            console.error("Borders element not found in DOM!");
            return;
        }

        // Set the styles for the borders
        this.bordersElement.style.position = "absolute";
        this.bordersElement.style.width = `${this.width}vw`;
        this.bordersElement.style.height = `${this.height}vh`;
        this.bordersElement.style.left = `${this.positionX}vw`;
        this.bordersElement.style.top = `${this.positionY}vh`;
    }
}

// Initialize game components
const snake = new Snake();
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
        snake.nextDirection = "left";
    } else if (event.code === "ArrowRight") {
        snake.nextDirection = "right";
    } else if (event.code === "ArrowUp") {
        snake.nextDirection = "up";
    } else if (event.code === "ArrowDown") {
        snake.nextDirection = "down";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const border = new Borders();
    snake.border = border; // Link the border to the snake
});

*/
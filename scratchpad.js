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
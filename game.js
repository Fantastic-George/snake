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
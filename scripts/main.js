const snakeColor = "white";
const foodColor = "white";

// Our snake class that will represent a snake and contain functions that let us control our snake
class Snake {
  constructor() {
    this.body = [{ x: 5, y: 1 }];
    this.direction = Direction.Right;
  }

  // Increase the length of our snake by one square
  grow () {
    this.body.push({
      x: this.body[-1]
    })
  }

  // Draw each part of the snake on the canvas
  draw() {
    context.fillStyle = snakeColor;

    // Draw each 'block' of the snake's body
    this.body.forEach(block => {
      let x = block.x * resolution;
      let y = block.y * resolution;
      context.fillRect(x, y, resolution, resolution);
    });
  }

  // Update the position of the snake
  update() {
    for(let i = this.body.length - 1; i > 0; i--) {
      this.body[i] = { ...this.body[i - 1] };
    }

    switch(this.direction) {
      case Direction.Up:
        this.body[0].y--;
        break;
      case Direction.Down:
        this.body[0].y++;
        break;
      case Direction.Left:
        this.body[0].x--;
        break;
      case Direction.Right:
        this.body[0].x++;
        break;
    }
  }

  checkCollision() {
    // Check if the snake has hit a wall (convert head coordinates to actual position)
    let x = this.body[0].x * resolution;
    let y = this.body[0].y * resolution;

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
      return true;
    }

    // Now we just want to use the grid coordinates of the head
    x = this.body[0].x;
    y = this.body[0].y;

    // Check to see if the snake has hit itself
    if (this.body.length > 1) {
      for (let i = 4; i < this.body.length; i++) {
        if (this.body[i].x === x && this.body[i].y === y) {
          return true;
        }
      }
    }

    // Check to see if the snake has "eaten" (collided with) some food 
    if (x == gameState.food.x && y == gameState.food.y) {
      this.grow();
      spawnFood();
      setScore(gameState.score + 1);
    }
  }
}

// Grab a reference to our canvas in the JavaScript
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// This is the resolution of the game's grid. Increase this value to make things bigger
const resolution = 20;

const gameState = {
  snake: undefined,
  food: undefined,
  score: 0,
  intervalId: undefined
};

// An object to hold references to each of the main UI (user interface) elements
const uiElements = {
  startButton: document.getElementById('start'),  // The HTML button that starts and restarts the game
  score: document.getElementById('score')         // The HTML element that displays the current score
};

// A simple object that declares possible directions for the snake to take
// We could just use strings - but this way reduces the chance of spelling mistakes
const Direction = {
  Left: 'left',
  Right: 'right',
  Up: 'up',
  Down: 'down'
};

// Setup the mouse click event listener for the start button
uiElements.startButton.addEventListener('click', () => {
  start();
});

// Setup an event listener on the whole website to listen for key presses
document.addEventListener('keydown', e => {
  // Determine which key was pressed - updating the snakes direction depending on which key it was
  switch (e.key) {
    case "ArrowUp":
      if (gameState.snake.direction !== Direction.Down) {
        gameState.snake.direction = Direction.Up;
      }
      break;
    case "ArrowDown":
      if (gameState.snake.direction !== Direction.Up) {
        gameState.snake.direction = Direction.Down;
      }
      break;
    case "ArrowLeft":
      if (gameState.snake.direction !== Direction.Right) {
        gameState.snake.direction = Direction.Left;
      }
      brea
    case "ArrowRight":
      if (gameState.snake.direction !== Direction.Left) {
        gameState.snake.direction = Direction.Right;
      }
      break;
  }
});

// This will update the current game score counter in the code, as well as in the UI
const setScore = (score) => {
  gameState.score = score;
  uiElements.score.textContent = score;
}

// A function to update and redraw all the game elements on the canvas
const update = () => {
  // Update the snakes position
  gameState.snake.update();

  // Check for collisions (snake hit wall, etc...)
  if (gameState.snake.checkCollision()) {
    end();
    return;
  }

  // If there were no collisions, redraw the game elements with their new positions
  context.clearRect(0, 0, canvas.width, canvas.height);
  gameState.snake.draw();
  
  context.fillStyle = foodColor;
  
  let x = gameState.food.x * resolution;
  let y = gameState.food.y * resolution;

  context.fillRect(x, y, resolution, resolution);
};

// Overwrite the previous food position with a new random position to "spawn" some new food
const spawnFood = () => {
  let x = Math.floor(Math.random() * (canvas.width - resolution) / resolution);
  let y = Math.floor(Math.random() * (canvas.height - resolution) / resolution);
  gameState.food = { x, y }

  // Check if the new food will be spawned ontop of the snake
  gameState.snake.body.forEach(block => {
    if (x == block.x && y == block.y) {
      spawnFood(); // if it will - then just try again with another position
    }
  })
}

// Start the game by creating the snake and starting the update events
const start = () => {
  uiElements.startButton.classList.remove("primaryColor");
  uiElements.startButton.classList.add("disabled");
  uiElements.startButton.textContent = "..."
  uiElements.startButton.disabled = true;

  setScore(0);

  gameState.snake = new Snake();
  spawnFood();
  gameState.intervalId = setInterval(update, 100);
}

// End the game by stopping the update events
const end = () => {
  clearInterval(gameState.intervalId);

  uiElements.startButton.classList.add("primaryColor");
  uiElements.startButton.classList.remove("disabled");
  uiElements.startButton.textContent = "START"; 
  uiElements.startButton.disabled = false;
}
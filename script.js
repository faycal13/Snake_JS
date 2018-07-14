window.onload = function () {

  let canvasWidht = 900;
  let canvasHeight = 600;
  let blockSize = 30;
  let ctx;
  let delay = 100;
  let snake;
  let apple;
  let widhtInBlock = canvasWidht/blockSize;
  let heightInBlock = canvasHeight/blockSize;
  let score;
  let time;

  innit();

function innit() {
  let canvas = document.createElement('canvas');
  canvas.width = canvasWidht;
  canvas.height = canvasHeight;
  canvas.style.border = "30px solid";
  canvas.style.display = "block";
  canvas.style.margin = "50px auto";
  canvas.style.backgroundColor = "#ddd";
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  snake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
  apple = new Apple([10,10]);
  score = 0;
  refreshCanvas();

}

function refreshCanvas() {
  snake.advance();
  if (snake.checkCrash()) {
      gameOver();
  } else {
    if (snake.isEatingApple(apple)) {
      score++;
      snake.eatApple = true;
      do {
        apple.setNewPosition();
      } while (apple.isOnSnake(snake));

    }
    ctx.clearRect(0, 0, canvasWidht, canvasHeight);
    drawScore();
    snake.draw();
    apple.draw();
    time = setTimeout(refreshCanvas, delay);
  }

}
function gameOver() {
  ctx.save();
  ctx.font = "bold 70px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  let centerX = canvasWidht / 2;
  let centerY = canvasHeight / 2;
  ctx.strokeText("Game Over", centerX, centerY - 180);
  ctx.fillText("Game Over",centerX, centerY - 180);
  ctx.font = "bold 30px sans-serif";
  ctx.strokeText("Press Space For Replay", centerX, centerY - 120);
  ctx.fillText("Press Space For Replay", centerX, centerY - 120);
  ctx.restore();
}
function restart() {
  snake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
  apple = new Apple([10,10]);
  score = 0;
  clearTimeout(time);
  refreshCanvas();
}
function drawScore() {
  ctx.save();
  ctx.font = "bold 200px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let centerX = canvasWidht / 2;
  let centerY = canvasHeight / 2;
  ctx.fillText(score.toString(), centerX, centerY);
  ctx.restore();
}
function drawBlock(ctx, position) {
  let x = position[0] * blockSize;
  let y = position[1] * blockSize;
  ctx.fillRect(x, y, blockSize, blockSize);
}

function Snake(body, direction) {
  this.body = body;
  this.direction = direction;
  this.eatApple = false;
  this.draw = function() {
    ctx.save();
    ctx.fillStyle = "#d82c2e";
    for(let i = 0; i < this.body.length; i++)
    {
      drawBlock(ctx, this.body[i]);
    }
    ctx.restore();

  };
  this.advance = function () {
    let nexPosition = this.body[0].slice();
    switch (this.direction) {
      case "left":
      nexPosition[0]--;
        break;
      case "right":
      nexPosition[0]++;
        break;
      case "down":
      nexPosition[1]++;
        break;
        case "up":
        nexPosition[1]--;
          break;
          default:
          throw("invalid direction");
    }
    this.body.unshift(nexPosition);
    if (!this.eatApple)
        this.body.pop();
    else
        this.eatApple = false;
  };
  this.setDirection = function(newDirection) {
    let allowedDirection;
    switch (this.direction) {
      case "left":
      case "right":
    allowedDirection = ["up", "down"];
        break;
      case "down":
        case "up":
      allowedDirection = ["left", "right"];
          break;
          default:
          throw("invalid direction");
    }
    if (allowedDirection.indexOf(newDirection) > -1) {
      this.direction = newDirection;
    }
  };
  this.checkCrash = function() {
    let wallCrash = false;
    let snakeCrash = false;
    let head = this.body[0];
    let rest = this.body.slice(1);
    let snakeX = head[0];
    let snakeY = head[1];
    let minX = 0;
    let minY = 0;
    let maxX = widhtInBlock - 1;
    let maxY = heightInBlock - 1;
    let isNotBetweenHorizontalWall = snakeX < minX || snakeX > maxX;
    let isNotBetweenVerticalWall = snakeY < minY || snakeY > maxY;

    if (isNotBetweenHorizontalWall || isNotBetweenVerticalWall) {
      wallCrash = true;
    }
    for (var i = 0; i < rest.length; i++) {
      if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
        snakeCrash = true;
      }
    }
    return wallCrash || snakeCrash;
  };

  this.isEatingApple = function(appleToEat) {
    let head = this.body[0];
    if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
      return true;
    } else {
      return false;
    }
  };
}

function Apple(position) {
  this.position = position;
  this.draw = function() {
    ctx.save();
    ctx.fillStyle = "#33cc33";
    ctx.beginPath();
    let radius = blockSize/2;
    let x = this.position[0] * blockSize + radius;
    let y = this.position[1] * blockSize + radius;
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.fill();
    ctx.restore();
  }
  this.setNewPosition = function () {
    let newX = Math.round(Math.random() * (widhtInBlock - 1));
    let newY = Math.round(Math.random() * (heightInBlock - 1));
    this.position = [newX, newY];
  };
  this.isOnSnake = function(snakeToChek) {
    let isOnSnake = false;
    for (var i = 0; i < snakeToChek.body.length; i++) {
      if (this.position[0] === snakeToChek.body[i][0] && this.position[1] === snakeToChek.body[i][1]) {
        isOnSnake = true;
      }
    }
    return isOnSnake;
  };
}

document.onkeydown = function handletKeyDown(e) {
  let key = e.keyCode;
  let newDirection;
  switch (key) {
    case 37:
      newDirection = "left";
      break;
    case 38:
      newDirection = "up";
      break;
    case 39:
      newDirection = "right";
      break;
    case 40:
      newDirection = "down";
      break;
      case 32:
        restart();
        return;
      default:
      return;
  }
  snake.setDirection(newDirection);
}
}

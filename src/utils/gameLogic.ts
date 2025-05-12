
export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  gameOver: boolean;
  score: number;
  highScore: number;
  gamePaused: boolean;
  speed: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const INITIAL_SPEED = 200; // ms
export const MIN_SPEED = 60; // ms
export const SPEED_DECREASE = 5; // ms

export function createInitialGameState(): GameState {
  // Load high score from localStorage or default to 0
  const highScore = Number(localStorage.getItem('snakeHighScore') || '0');
  
  return {
    snake: [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
    ],
    food: generateFoodPosition([{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }]),
    direction: Direction.RIGHT,
    gameOver: false,
    score: 0,
    highScore,
    gamePaused: false,
    speed: INITIAL_SPEED,
  };
}

export function generateFoodPosition(snake: Position[]): Position {
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
  
  return position;
}

export function moveSnake(state: GameState): GameState {
  if (state.gameOver || state.gamePaused) {
    return state;
  }

  const head = { ...state.snake[0] };
  
  switch (state.direction) {
    case Direction.UP:
      head.y -= 1;
      break;
    case Direction.DOWN:
      head.y += 1;
      break;
    case Direction.LEFT:
      head.x -= 1;
      break;
    case Direction.RIGHT:
      head.x += 1;
      break;
  }

  // Check for collision with walls
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return {
      ...state,
      gameOver: true,
    };
  }

  // Check for collision with self
  if (state.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    return {
      ...state,
      gameOver: true,
    };
  }

  const newSnake = [head, ...state.snake];
  let newFood = state.food;
  let newScore = state.score;
  let newSpeed = state.speed;
  
  // Check for food collision
  if (head.x === state.food.x && head.y === state.food.y) {
    newFood = generateFoodPosition(newSnake);
    newScore = state.score + 1;
    
    // Increase speed as score increases (decrease delay time)
    newSpeed = Math.max(MIN_SPEED, state.speed - SPEED_DECREASE);
  } else {
    // Remove tail if no food was eaten
    newSnake.pop();
  }

  // Update high score if needed
  let newHighScore = state.highScore;
  if (newScore > state.highScore) {
    newHighScore = newScore;
    localStorage.setItem('snakeHighScore', newHighScore.toString());
  }

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    score: newScore,
    highScore: newHighScore,
    speed: newSpeed,
  };
}

export function changeDirection(state: GameState, newDirection: Direction): GameState {
  // Prevent 180-degree turns
  const { direction } = state;
  if (
    (direction === Direction.UP && newDirection === Direction.DOWN) ||
    (direction === Direction.DOWN && newDirection === Direction.UP) ||
    (direction === Direction.LEFT && newDirection === Direction.RIGHT) ||
    (direction === Direction.RIGHT && newDirection === Direction.LEFT)
  ) {
    return state;
  }

  return {
    ...state,
    direction: newDirection,
  };
}

export function resetGame(state: GameState): GameState {
  return {
    ...createInitialGameState(),
    highScore: state.highScore,
  };
}

export function togglePause(state: GameState): GameState {
  return {
    ...state,
    gamePaused: !state.gamePaused,
  };
}

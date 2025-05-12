
import { useEffect, useRef } from "react";
import { 
  GameState, 
  GRID_SIZE, 
  CELL_SIZE, 
  Direction 
} from "@/utils/gameLogic";

interface GameBoardProps {
  gameState: GameState;
  shake: boolean;
}

const GameBoard = ({ gameState, shake }: GameBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the grid (very subtle lines)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Draw vertical grid lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
    
    // Draw the snake
    const { snake, direction } = gameState;
    
    // Draw body segments
    ctx.fillStyle = '#FFFFFF';
    for (let i = 1; i < snake.length; i++) {
      const segment = snake[i];
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    }
    
    // Draw the head with a special color
    const head = snake[0];
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(
      head.x * CELL_SIZE + 1,
      head.y * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2
    );
    
    // Add eyes to the head
    ctx.fillStyle = '#000000';
    const eyeSize = CELL_SIZE / 5;
    
    if (direction === Direction.RIGHT) {
      ctx.fillRect(head.x * CELL_SIZE + CELL_SIZE - eyeSize * 1.5, head.y * CELL_SIZE + eyeSize, eyeSize, eyeSize);
      ctx.fillRect(head.x * CELL_SIZE + CELL_SIZE - eyeSize * 1.5, head.y * CELL_SIZE + CELL_SIZE - eyeSize * 2, eyeSize, eyeSize);
    } else if (direction === Direction.LEFT) {
      ctx.fillRect(head.x * CELL_SIZE + eyeSize / 2, head.y * CELL_SIZE + eyeSize, eyeSize, eyeSize);
      ctx.fillRect(head.x * CELL_SIZE + eyeSize / 2, head.y * CELL_SIZE + CELL_SIZE - eyeSize * 2, eyeSize, eyeSize);
    } else if (direction === Direction.UP) {
      ctx.fillRect(head.x * CELL_SIZE + eyeSize, head.y * CELL_SIZE + eyeSize / 2, eyeSize, eyeSize);
      ctx.fillRect(head.x * CELL_SIZE + CELL_SIZE - eyeSize * 2, head.y * CELL_SIZE + eyeSize / 2, eyeSize, eyeSize);
    } else if (direction === Direction.DOWN) {
      ctx.fillRect(head.x * CELL_SIZE + eyeSize, head.y * CELL_SIZE + CELL_SIZE - eyeSize * 1.5, eyeSize, eyeSize);
      ctx.fillRect(head.x * CELL_SIZE + CELL_SIZE - eyeSize * 2, head.y * CELL_SIZE + CELL_SIZE - eyeSize * 1.5, eyeSize, eyeSize);
    }
    
    // Draw the food with glow
    const { food } = gameState;
    
    // Add shadow for glow effect
    ctx.shadowColor = '#e71d36';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ea384c';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 1,
      0,
      2 * Math.PI
    );
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Draw game over overlay
    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = '#ea384c';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
      
      ctx.font = '12px "Press Start 2P"';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('PRESS SPACE TO RETRY', canvas.width / 2, canvas.height / 2 + 20);
    }
    
    // Draw pause overlay
    if (gameState.gamePaused && !gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '12px "Press Start 2P"';
      ctx.fillText('PRESS SPACE TO RESUME', canvas.width / 2, canvas.height / 2 + 30);
    }
    
  }, [gameState, shake]);
  
  return (
    <canvas 
      ref={canvasRef}
      width={GRID_SIZE * CELL_SIZE}
      height={GRID_SIZE * CELL_SIZE}
      className={`border-4 border-purple-700 rounded-lg ${shake ? 'shake' : ''}`}
    />
  );
};

export default GameBoard;

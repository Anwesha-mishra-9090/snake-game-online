
import { useState, useEffect, useCallback } from "react";
import GameBoard from "./GameBoard";
import ScoreBoard from "./ScoreBoard";
import Controls from "./Controls";
import { 
  GameState, 
  Direction, 
  createInitialGameState, 
  moveSnake, 
  changeDirection, 
  resetGame, 
  togglePause 
} from "@/utils/gameLogic";
import { 
  playSound, 
  SoundEffect, 
  initializeSounds 
} from "@/utils/soundEffects";
import { toast } from "@/components/ui/use-toast";

const Game = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [shake, setShake] = useState(false);
  const [gameLoopInterval, setGameLoopInterval] = useState<number | null>(null);
  
  // Initialize sounds on first render
  useEffect(() => {
    initializeSounds();
    
    // Clean up any existing interval on unmount
    return () => {
      if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
      }
    };
  }, []);
  
  // Handle score changes
  useEffect(() => {
    const previousScore = gameState.score - 1;
    if (gameState.score > previousScore && gameState.score > 0) {
      // Play eat sound and show toast
      playSound(SoundEffect.EAT);
      
      // Only show toast every 5 points to reduce spam
      if (gameState.score % 5 === 0 || gameState.score === 1) {
        toast({
          title: `Score: ${gameState.score}`,
          description: gameState.score % 5 === 0 
            ? "You're doing great!" 
            : "Yum! Keep going!",
          duration: 2000,
        });
      }
    }
  }, [gameState.score]);
  
  // Handle game over state
  useEffect(() => {
    if (gameState.gameOver) {
      playSound(SoundEffect.GAME_OVER);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      
      if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
        setGameLoopInterval(null);
      }
      
      toast({
        title: "Game Over!",
        description: `Final score: ${gameState.score}`,
        variant: "destructive",
      });
    }
  }, [gameState.gameOver]);
  
  // Set up game loop
  useEffect(() => {
    // Clear existing interval if game is over or paused
    if (gameLoopInterval) {
      clearInterval(gameLoopInterval);
    }
    
    // Don't start a new interval if game is over or paused
    if (gameState.gameOver || gameState.gamePaused) {
      return;
    }
    
    // Set new interval based on current speed
    const interval = window.setInterval(() => {
      setGameState(prevState => moveSnake(prevState));
    }, gameState.speed);
    
    setGameLoopInterval(interval);
    
    return () => {
      clearInterval(interval);
    };
  }, [gameState.gameOver, gameState.gamePaused, gameState.speed]);
  
  // Handle keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        setGameState(prevState => changeDirection(prevState, Direction.UP));
        break;
      case "ArrowDown":
        setGameState(prevState => changeDirection(prevState, Direction.DOWN));
        break;
      case "ArrowLeft":
        setGameState(prevState => changeDirection(prevState, Direction.LEFT));
        break;
      case "ArrowRight":
        setGameState(prevState => changeDirection(prevState, Direction.RIGHT));
        break;
      case " ": // Spacebar
        if (gameState.gameOver) {
          handleReset();
        } else {
          handlePause();
        }
        break;
    }
  }, [gameState.gameOver]);
  
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const handleDirectionChange = (direction: Direction) => {
    setGameState(prevState => changeDirection(prevState, direction));
    playSound(SoundEffect.MOVE);
  };
  
  const handleReset = () => {
    if (gameLoopInterval) {
      clearInterval(gameLoopInterval);
    }
    
    setGameState(prevState => resetGame(prevState));
  };
  
  const handlePause = () => {
    setGameState(prevState => togglePause(prevState));
  };
  
  return (
    <div className="flex flex-col items-center">
      <ScoreBoard gameState={gameState} />
      <GameBoard gameState={gameState} shake={shake} />
      <Controls 
        onDirectionChange={handleDirectionChange}
        onReset={handleReset}
        onPause={handlePause}
        isPaused={gameState.gamePaused}
        isGameOver={gameState.gameOver}
      />
    </div>
  );
};

export default Game;

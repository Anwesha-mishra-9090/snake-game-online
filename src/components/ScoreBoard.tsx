
import { GameState } from "@/utils/gameLogic";

interface ScoreBoardProps {
  gameState: GameState;
}

const ScoreBoard = ({ gameState }: ScoreBoardProps) => {
  return (
    <div className="flex justify-between items-center w-full max-w-md mx-auto my-4 px-4">
      <div className="text-center">
        <h3 className="text-sm text-purple-400 font-arcade mb-1">SCORE</h3>
        <p className="text-2xl font-arcade text-white neon-text">{gameState.score}</p>
      </div>
      
      <div className="text-center">
        <h3 className="text-sm text-purple-400 font-arcade mb-1">HIGH SCORE</h3>
        <p className="text-2xl font-arcade text-white">{gameState.highScore}</p>
      </div>
    </div>
  );
};

export default ScoreBoard;

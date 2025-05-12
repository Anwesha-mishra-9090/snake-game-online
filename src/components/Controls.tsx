
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad } from "lucide-react";
import { Direction } from "@/utils/gameLogic";
import { useIsMobile } from "@/hooks/use-mobile";

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onReset: () => void;
  onPause: () => void;
  isPaused: boolean;
  isGameOver: boolean;
}

const Controls = ({ 
  onDirectionChange, 
  onReset, 
  onPause, 
  isPaused, 
  isGameOver 
}: ControlsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mt-4 w-full max-w-md mx-auto">
      {isMobile ? (
        <div className="relative h-36">
          {/* Mobile touch controls */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 w-12 rounded-full bg-muted/30 backdrop-blur-sm"
              onClick={() => onDirectionChange(Direction.UP)}
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 w-12 rounded-full bg-muted/30 backdrop-blur-sm"
              onClick={() => onDirectionChange(Direction.DOWN)}
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute top-1/2 left-0 -translate-y-1/2">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 w-12 rounded-full bg-muted/30 backdrop-blur-sm"
              onClick={() => onDirectionChange(Direction.LEFT)}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute top-1/2 right-0 -translate-y-1/2">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 w-12 rounded-full bg-muted/30 backdrop-blur-sm"
              onClick={() => onDirectionChange(Direction.RIGHT)}
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center my-4">
          <p className="text-sm text-muted-foreground">Use arrow keys to control the snake</p>
        </div>
      )}
      
      <div className="flex justify-center gap-4 mt-2">
        <Button 
          variant="outline" 
          onClick={onReset}
          className="font-arcade"
        >
          New Game
        </Button>
        
        <Button 
          variant={isPaused ? "default" : "outline"} 
          onClick={onPause}
          disabled={isGameOver}
          className="font-arcade"
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-flex items-center text-xs text-muted-foreground">
          <Gamepad className="h-4 w-4 mr-1" /> 
          <p>Desktop: Use arrow keys. Mobile: Use buttons above</p>
        </div>
      </div>
    </div>
  );
};

export default Controls;

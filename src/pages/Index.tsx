
import Game from "@/components/Game";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-background to-black pt-8 pb-16 px-4">
      <header className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-arcade text-white neon-text animate-pulse mb-2">SNAKE ARCADE</h1>
        <p className="text-muted-foreground md:text-lg">The classic game reimagined for the web</p>
      </header>
      
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto my-12 text-center">
          <div className="border-4 border-purple-700 neon-border rounded-xl p-8 mb-8 bg-black/50 backdrop-blur">
            <h2 className="text-2xl font-arcade mb-6 text-white">HOW TO PLAY</h2>
            <ul className="space-y-4 text-left">
              <li className="flex items-start gap-2">
                <span className="font-arcade text-accent">→</span> 
                <span>Use arrow keys (desktop) or buttons (mobile) to control the snake</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-arcade text-accent">→</span>
                <span>Eat the red food to grow longer and score points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-arcade text-accent">→</span>
                <span>Don't hit the walls or yourself!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-arcade text-accent">→</span>
                <span>The snake speeds up as you eat more food</span>
              </li>
            </ul>
          </div>
          
          <Button 
            onClick={() => setGameStarted(true)}
            size="lg"
            className="font-arcade text-lg py-6 px-8 bg-purple-700 hover:bg-purple-800 neon-border"
          >
            START GAME
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <Game />
        </div>
      )}
      
      <footer className="mt-auto pt-6 w-full max-w-2xl text-center text-xs text-muted-foreground">
        <p>Original Python Snake Game adapted for the web • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;

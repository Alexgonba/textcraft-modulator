
import React from 'react';
import { useGame, availableGames } from './GameContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gamepad2, Swords, Target, Dice1 } from 'lucide-react';

const GameSelector = () => {
  const { selectedGame, setSelectedGame, isGameRequired } = useGame();

  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case 'chess': return <Gamepad2 className="h-4 w-4" />; 
      case 'swords': return <Swords className="h-4 w-4" />;
      case 'target': return <Target className="h-4 w-4" />;
      case 'dices': return <Dice1 className="h-4 w-4" />;
      default: return <Gamepad2 className="h-4 w-4" />;
    }
  };

  const handleGameChange = (gameId: string) => {
    const game = availableGames.find(g => g.id === gameId) || null;
    setSelectedGame(game);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Game:</span>
      <Select
        value={selectedGame?.id || ''}
        onValueChange={handleGameChange}
      >
        <SelectTrigger className="w-[200px] h-9 text-sm bg-background border-border hover:border-border-hover transition-colors">
          <SelectValue placeholder={isGameRequired ? "Select a game" : "Optional: Select game"} />
        </SelectTrigger>
        <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50">
          {availableGames.map((game) => (
            <SelectItem 
              key={game.id} 
              value={game.id} 
              className="flex items-center gap-2 hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {getGameIcon(game.icon)}
                <span className="font-medium">{game.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GameSelector;

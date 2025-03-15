
import React from 'react';
import { useGame, availableGames } from './GameContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Chess, Swords, Target, Dices, Gamepad2 } from 'lucide-react';

const GameSelector = () => {
  const { selectedGame, setSelectedGame, isGameRequired } = useGame();

  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case 'chess': return <Chess className="h-4 w-4" />;
      case 'swords': return <Swords className="h-4 w-4" />;
      case 'target': return <Target className="h-4 w-4" />;
      case 'dices': return <Dices className="h-4 w-4" />;
      default: return <Gamepad2 className="h-4 w-4" />;
    }
  };

  const handleGameChange = (gameId: string) => {
    const game = availableGames.find(g => g.id === gameId) || null;
    setSelectedGame(game);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Game:</span>
      <Select
        value={selectedGame?.id || ''}
        onValueChange={handleGameChange}
      >
        <SelectTrigger className="w-[180px] h-9 text-sm bg-background border-input">
          <SelectValue placeholder={isGameRequired ? "Select a game" : "Optional: Select game"} />
        </SelectTrigger>
        <SelectContent>
          {availableGames.map((game) => (
            <SelectItem key={game.id} value={game.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {getGameIcon(game.icon)}
                <span>{game.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GameSelector;

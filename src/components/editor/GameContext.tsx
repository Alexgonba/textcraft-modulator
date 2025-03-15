
import React, { createContext, useContext, useState } from 'react';

// Define the available games and their modules
export interface Game {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  modules: string[]; // List of module types this game supports
  color: string; // Theme color for the game
}

export const availableGames: Game[] = [
  {
    id: 'tft',
    name: 'Teamfight Tactics',
    icon: 'chess',
    modules: ['tft-builder'],
    color: 'bg-blue-500',
  },
  {
    id: 'lol',
    name: 'League of Legends',
    icon: 'swords',
    modules: ['lol-champions'],
    color: 'bg-red-500',
  },
  {
    id: 'valorant',
    name: 'Valorant',
    icon: 'target',
    modules: ['valorant-agents'],
    color: 'bg-pink-600',
  },
  {
    id: 'bg3',
    name: "Baldur's Gate 3",
    icon: 'dices',
    modules: ['bg3-builder'],
    color: 'bg-purple-600',
  },
];

interface GameContextType {
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  isGameRequired: boolean;
  availableModules: string[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const isGameRequired = true; // This can be made configurable if needed

  // Get available modules based on selected game
  const availableModules = selectedGame ? selectedGame.modules : [];

  return (
    <GameContext.Provider value={{ selectedGame, setSelectedGame, isGameRequired, availableModules }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};


import React, { useState, useRef, useEffect } from 'react';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { BlockType } from './EditorContext';
import { useGame } from './GameContext';
import MenuSection from './menu/MenuSection';
import { baseBlockOptions, mediaOptions, gameModuleOptions, MenuOption } from './menu/MenuOptions';

interface SlashMenuProps {
  position: { x: number; y: number };
  onSelect: (type: BlockType, moduleType?: string) => void;
  onClose: () => void;
}

const SlashMenu: React.FC<SlashMenuProps> = ({ position, onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const { selectedGame } = useGame();

  // Filter options based on search query and selected game
  const filterOptions = (options: MenuOption[]) => {
    // For game modules, filter by selected game and query
    if (options === gameModuleOptions) {
      return options.filter(option => 
        // Only show modules for the selected game or all if no game selected
        (!selectedGame || option.gameId === selectedGame.id) &&
        (option.label.toLowerCase().includes(query.toLowerCase()) ||
        option.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    // For other options, just filter by query
    return options.filter(option => 
      option.label.toLowerCase().includes(query.toLowerCase()) ||
      option.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredBaseOptions = filterOptions(baseBlockOptions);
  const filteredMediaOptions = filterOptions(mediaOptions);
  const filteredGameModules = filterOptions(gameModuleOptions);

  // All filtered options combined for keyboard navigation
  const allFilteredOptions = [
    ...filteredBaseOptions,
    ...filteredMediaOptions,
    ...filteredGameModules
  ];

  useEffect(() => {
    // Handle clicks outside of the menu
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % allFilteredOptions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + allFilteredOptions.length) % allFilteredOptions.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (allFilteredOptions[selectedIndex]) {
            const selected = allFilteredOptions[selectedIndex];
            onSelect(selected.type, selected.moduleType);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, allFilteredOptions, onSelect, onClose]);

  return (
    <div 
      ref={menuRef}
      className="editor-slash-menu max-w-xs w-72 bg-card border border-border rounded-md shadow-lg overflow-hidden"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px` 
      }}
    >
      <Command>
        <CommandInput 
          placeholder="Search for content..." 
          value={query}
          onValueChange={setQuery}
          autoFocus
        />
        <CommandList className="max-h-64 overflow-auto">
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Base blocks section */}
          <MenuSection 
            title="Basic Blocks"
            options={filteredBaseOptions}
            selectedIndex={selectedIndex}
            startIndex={0}
            onSelect={onSelect}
          />

          {/* Media embeds section */}
          <MenuSection 
            title="Media"
            options={filteredMediaOptions}
            selectedIndex={selectedIndex}
            startIndex={filteredBaseOptions.length}
            onSelect={onSelect}
            showSeparator={filteredMediaOptions.length > 0 && filteredBaseOptions.length > 0}
          />

          {/* Game Modules section */}
          <MenuSection 
            title={selectedGame ? `${selectedGame.name} Modules` : "Game Modules"}
            options={filteredGameModules}
            selectedIndex={selectedIndex}
            startIndex={filteredBaseOptions.length + filteredMediaOptions.length}
            onSelect={onSelect}
            showSeparator={filteredGameModules.length > 0 && (filteredBaseOptions.length > 0 || filteredMediaOptions.length > 0)}
          />
        </CommandList>
      </Command>
    </div>
  );
};

export default SlashMenu;


import React, { useState, useRef, useEffect } from 'react';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from "@/components/ui/command";
import { 
  Type, Heading1, Heading2, Heading3, List, ListOrdered, 
  CheckSquare, Quote, Code, Image, Youtube, Twitch, Instagram, 
  Gamepad2, Minus, Layout, Book, Dices
} from 'lucide-react';
import { BlockType } from './EditorContext';

interface SlashMenuProps {
  position: { x: number; y: number };
  onSelect: (type: BlockType, moduleType?: string) => void;
  onClose: () => void;
}

interface MenuOption {
  icon: React.ReactNode;
  label: string;
  type: BlockType;
  description: string;
  moduleType?: string;
}

// Base block options available for all types of content
const baseBlockOptions: MenuOption[] = [
  { icon: <Type size={18} />, label: 'Text', type: 'paragraph', description: 'Just start writing with plain text' },
  { icon: <Heading1 size={18} />, label: 'Heading 1', type: 'heading-1', description: 'Big section heading' },
  { icon: <Heading2 size={18} />, label: 'Heading 2', type: 'heading-2', description: 'Medium section heading' },
  { icon: <Heading3 size={18} />, label: 'Heading 3', type: 'heading-3', description: 'Small section heading' },
  { icon: <List size={18} />, label: 'Bullet List', type: 'bullet-list', description: 'Create a simple bullet list' },
  { icon: <ListOrdered size={18} />, label: 'Numbered List', type: 'ordered-list', description: 'Create a numbered list' },
  { icon: <CheckSquare size={18} />, label: 'Check List', type: 'check-list', description: 'Create a checklist' },
  { icon: <Quote size={18} />, label: 'Quote', type: 'blockquote', description: 'Insert a quotation or citation' },
  { icon: <Code size={18} />, label: 'Code', type: 'code', description: 'Add a code snippet' },
  { icon: <Image size={18} />, label: 'Image', type: 'image', description: 'Upload or embed an image' },
  { icon: <Minus size={18} />, label: 'Divider', type: 'divider', description: 'Insert a visual divider' },
];

// Media embed options
const mediaOptions: MenuOption[] = [
  { icon: <Youtube size={18} />, label: 'YouTube', type: 'video', description: 'Embed a YouTube video' },
  { icon: <Twitch size={18} />, label: 'Twitch', type: 'video', description: 'Embed a Twitch stream' },
  { icon: <Instagram size={18} />, label: 'Instagram', type: 'video', description: 'Embed Instagram content' },
];

// Game-specific module options
const gameModuleOptions: MenuOption[] = [
  { 
    icon: <Gamepad2 size={18} />, 
    label: 'TFT Team Comp Builder', 
    type: 'module', 
    description: 'Insert TFT team builder module',
    moduleType: 'tft-builder'
  },
  { 
    icon: <Layout size={18} />, 
    label: 'LoL Champions Overview', 
    type: 'module', 
    description: 'Insert League of Legends champion overview',
    moduleType: 'lol-champions'
  },
  { 
    icon: <Book size={18} />, 
    label: 'Valorant Agent Guide', 
    type: 'module', 
    description: 'Insert Valorant agent guide module',
    moduleType: 'valorant-agents'
  },
  { 
    icon: <Dices size={18} />, 
    label: 'Baldur\'s Gate Character Builder', 
    type: 'module', 
    description: 'Insert BG3 character builder module',
    moduleType: 'bg3-builder'
  },
];

const SlashMenu: React.FC<SlashMenuProps> = ({ position, onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filterOptions = (options: MenuOption[]) => {
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

  // Renders a menu item 
  const renderMenuItem = (option: MenuOption, index: number) => (
    <CommandItem
      key={`${option.type}-${option.label}`}
      onSelect={() => onSelect(option.type, option.moduleType)}
      className={`flex items-center px-3 py-2 text-sm cursor-pointer ${
        index === selectedIndex ? 'bg-accent' : ''
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground mr-2">
        {option.icon}
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{option.label}</span>
        <span className="text-xs text-muted-foreground">{option.description}</span>
      </div>
    </CommandItem>
  );

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
          {filteredBaseOptions.length > 0 && (
            <CommandGroup heading="Basic Blocks">
              {filteredBaseOptions.map((option, index) => 
                renderMenuItem(option, index)
              )}
            </CommandGroup>
          )}

          {/* Media embeds section */}
          {filteredMediaOptions.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Media">
                {filteredMediaOptions.map((option, index) => 
                  renderMenuItem(option, index + filteredBaseOptions.length)
                )}
              </CommandGroup>
            </>
          )}

          {/* Game Modules section */}
          {filteredGameModules.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Game Modules">
                {filteredGameModules.map((option, index) => 
                  renderMenuItem(option, index + filteredBaseOptions.length + filteredMediaOptions.length)
                )}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default SlashMenu;

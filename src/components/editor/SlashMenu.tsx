
import React, { useState, useRef, useEffect } from 'react';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem
} from "@/components/ui/command";
import { 
  Type, Heading1, Heading2, Heading3, List, ListOrdered, 
  CheckSquare, Quote, Code, Image, Youtube, Twitch, Instagram, 
  Gamepad2, Minus
} from 'lucide-react';
import { BlockType } from './EditorContext';

interface SlashMenuProps {
  position: { x: number; y: number };
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

interface MenuOption {
  icon: React.ReactNode;
  label: string;
  type: BlockType;
  description: string;
}

const menuOptions: MenuOption[] = [
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
  { icon: <Youtube size={18} />, label: 'YouTube', type: 'video', description: 'Embed a YouTube video' },
  { icon: <Twitch size={18} />, label: 'Twitch', type: 'video', description: 'Embed a Twitch stream' },
  { icon: <Instagram size={18} />, label: 'Instagram', type: 'video', description: 'Embed Instagram content' },
  { icon: <Gamepad2 size={18} />, label: 'TFT Team Comp Builder', type: 'module', description: 'Insert TFT team builder module' },
  { icon: <Minus size={18} />, label: 'Divider', type: 'divider', description: 'Insert a visual divider' },
];

const SlashMenu: React.FC<SlashMenuProps> = ({ position, onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredOptions = menuOptions.filter(option => 
    option.label.toLowerCase().includes(query.toLowerCase()) ||
    option.description.toLowerCase().includes(query.toLowerCase())
  );

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
          setSelectedIndex(prev => (prev + 1) % filteredOptions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[selectedIndex]) {
            onSelect(filteredOptions[selectedIndex].type);
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
  }, [selectedIndex, filteredOptions, onSelect, onClose]);

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
          placeholder="Search for a block type..." 
          value={query}
          onValueChange={setQuery}
          autoFocus
        />
        <CommandList className="max-h-64 overflow-auto">
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredOptions.map((option, index) => (
            <CommandItem
              key={option.label}
              onSelect={() => onSelect(option.type)}
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
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default SlashMenu;

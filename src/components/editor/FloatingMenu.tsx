
import React, { useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { BlockType } from './EditorContext';
import { baseBlockOptions } from './menu/MenuOptions';

interface FloatingMenuProps {
  position: { x: number; y: number };
  onSelect: (type: BlockType, moduleType?: string) => void;
  onClose: () => void;
  isEmptyLine?: boolean;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ 
  position, 
  onSelect, 
  onClose, 
  isEmptyLine = false 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Use a subset of options for the floating menu
  const items = baseBlockOptions.slice(0, 7).concat([
    baseBlockOptions.find(option => option.type === 'image')!,
    { 
      icon: baseBlockOptions.find(option => option.type === 'code')!.icon, 
      type: 'video' as BlockType, 
      label: 'Video', 
      moduleType: 'youtube',
      description: 'Add a YouTube video'
    },
    { 
      icon: baseBlockOptions.find(option => option.type === 'image')!.icon, 
      type: 'module' as BlockType, 
      label: 'Game Module', 
      moduleType: 'tft-builder',
      description: 'Add a game-specific module'
    },
  ]);

  return (
    <div
      ref={menuRef}
      className="floating-menu absolute z-50 bg-card border border-border rounded-md shadow-lg p-1 animate-scale-in"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex gap-1">
        {isEmptyLine ? (
          // For empty lines, show a "+" icon that opens the full slash menu
          <button
            className="p-1.5 rounded hover:bg-accent"
            onClick={() => onSelect('showSlashMenu' as BlockType)}
            title="Add content"
          >
            <Plus size={16} />
          </button>
        ) : (
          // For non-empty lines or selected text, show format options
          items.map((item) => (
            <button
              key={`${item.type}-${item.label}`}
              className="p-1.5 rounded hover:bg-accent group relative"
              onClick={() => onSelect(item.type, item.moduleType)}
              title={item.label}
            >
              {item.icon}
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default FloatingMenu;

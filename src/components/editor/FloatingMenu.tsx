
import React, { useRef, useEffect } from 'react';
import { 
  Plus, Type, Heading1, Heading2, Image, List, 
  ListOrdered, Quote, Code, Youtube, Gamepad2
} from 'lucide-react';
import { BlockType } from './EditorContext';

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

  const items = [
    { icon: <Type size={16} />, type: 'paragraph' as BlockType, label: 'Text' },
    { icon: <Heading1 size={16} />, type: 'heading-1' as BlockType, label: 'Heading 1' },
    { icon: <Heading2 size={16} />, type: 'heading-2' as BlockType, label: 'Heading 2' },
    { icon: <List size={16} />, type: 'bullet-list' as BlockType, label: 'Bullet List' },
    { icon: <ListOrdered size={16} />, type: 'ordered-list' as BlockType, label: 'Numbered List' },
    { icon: <Quote size={16} />, type: 'blockquote' as BlockType, label: 'Quote' },
    { icon: <Code size={16} />, type: 'code' as BlockType, label: 'Code' },
    { icon: <Image size={16} />, type: 'image' as BlockType, label: 'Image' },
    { icon: <Youtube size={16} />, type: 'video' as BlockType, label: 'Video', moduleType: 'youtube' },
    { icon: <Gamepad2 size={16} />, type: 'module' as BlockType, label: 'Game Module', moduleType: 'tft-builder' },
  ];

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

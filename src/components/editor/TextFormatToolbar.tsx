
import React from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Code, Link, AlignLeft,
  AlignCenter, AlignRight, AlignJustify, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote
} from 'lucide-react';
import { BlockType } from './EditorContext';

interface TextFormatToolbarProps {
  position: { x: number; y: number };
  onFormatText: (format: string) => void;
  onChangeBlockType: (type: BlockType) => void;
  currentBlockType: BlockType;
  onClose: () => void;
}

const TextFormatToolbar: React.FC<TextFormatToolbarProps> = ({
  position,
  onFormatText,
  onChangeBlockType,
  currentBlockType,
  onClose
}) => {
  const formatOptions = [
    { icon: <Bold size={16} />, format: 'bold', tooltip: 'Bold (Ctrl+B)' },
    { icon: <Italic size={16} />, format: 'italic', tooltip: 'Italic (Ctrl+I)' },
    { icon: <Underline size={16} />, format: 'underline', tooltip: 'Underline (Ctrl+U)' },
    { icon: <Strikethrough size={16} />, format: 'strikethrough', tooltip: 'Strikethrough' },
    { icon: <Code size={16} />, format: 'code', tooltip: 'Code (Ctrl+E)' },
    { icon: <Link size={16} />, format: 'link', tooltip: 'Insert Link (Ctrl+K)' },
  ];

  const alignOptions = [
    { icon: <AlignLeft size={16} />, format: 'align-left', tooltip: 'Align Left' },
    { icon: <AlignCenter size={16} />, format: 'align-center', tooltip: 'Align Center' },
    { icon: <AlignRight size={16} />, format: 'align-right', tooltip: 'Align Right' },
    { icon: <AlignJustify size={16} />, format: 'align-justify', tooltip: 'Justify' },
  ];

  const blockOptions = [
    { icon: <Heading1 size={16} />, type: 'heading-1' as BlockType, tooltip: 'Heading 1' },
    { icon: <Heading2 size={16} />, type: 'heading-2' as BlockType, tooltip: 'Heading 2' },
    { icon: <Heading3 size={16} />, type: 'heading-3' as BlockType, tooltip: 'Heading 3' },
    { icon: <List size={16} />, type: 'bullet-list' as BlockType, tooltip: 'Bullet List' },
    { icon: <ListOrdered size={16} />, type: 'ordered-list' as BlockType, tooltip: 'Numbered List' },
    { icon: <Quote size={16} />, type: 'blockquote' as BlockType, tooltip: 'Quote' },
  ];

  const isBlockType = (type: BlockType) => currentBlockType === type;

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as Node;
    if (target && !target.closest('.text-format-toolbar')) {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside as any);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as any);
    };
  }, []);

  return (
    <div
      className="text-format-toolbar animate-scale-in absolute z-50 bg-popover rounded-md shadow-lg p-1.5 flex gap-1 border border-border"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 45}px`, // Position above the selection
      }}
    >
      <div className="flex space-x-1 border-r border-border pr-1">
        {formatOptions.map((option) => (
          <button
            key={option.format}
            onClick={() => onFormatText(option.format)}
            className="p-1.5 rounded hover:bg-muted text-foreground"
            title={option.tooltip}
          >
            {option.icon}
          </button>
        ))}
      </div>
      
      <div className="flex space-x-1 border-r border-border pr-1">
        {alignOptions.map((option) => (
          <button
            key={option.format}
            onClick={() => onFormatText(option.format)}
            className="p-1.5 rounded hover:bg-muted text-foreground"
            title={option.tooltip}
          >
            {option.icon}
          </button>
        ))}
      </div>
      
      <div className="flex space-x-1">
        {blockOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onChangeBlockType(option.type)}
            className={`p-1.5 rounded hover:bg-muted ${
              isBlockType(option.type) ? 'bg-accent text-accent-foreground' : 'text-foreground'
            }`}
            title={option.tooltip}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TextFormatToolbar;

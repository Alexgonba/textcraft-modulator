
import React from 'react';
import { Check } from 'lucide-react';
import { EditorBlock } from '../types';

interface CheckListBlockProps {
  block: EditorBlock;
  contentRef: React.RefObject<HTMLDivElement>;
  toggleCheckListItem: (id: string) => void;
  handleContentChange: (e: React.FormEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleFocus: () => void;
  handleBlur: (e: React.FocusEvent) => void;
  handleMouseUp: () => void;
}

const CheckListBlock: React.FC<CheckListBlockProps> = ({
  block,
  contentRef,
  toggleCheckListItem,
  handleContentChange,
  handleKeyDown,
  handleFocus,
  handleBlur,
  handleMouseUp,
}) => {
  // Simplified styling for text direction
  const blockStyles = {
    direction: 'ltr' as const,
    textAlign: 'left' as const,
    // Removed unicodeBidi which may cause cursor positioning issues
  };
  
  return (
    <div className="flex items-start gap-2">
      <button 
        onClick={() => toggleCheckListItem(block.id)}
        className="mt-1.5 text-muted-foreground hover:text-primary transition-colors"
      >
        {block.checked ? <Check size={16} /> : <div className="w-4 h-4 border border-muted-foreground rounded" />}
      </button>
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none flex-1"
        style={blockStyles}
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseUp={handleMouseUp}
        dangerouslySetInnerHTML={{ __html: block.content }}
      />
    </div>
  );
};

export default CheckListBlock;

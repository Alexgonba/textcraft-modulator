
import React from 'react';
import { EditorBlock } from '../types';

interface DefaultBlockProps {
  contentRef: React.RefObject<HTMLDivElement>;
  block: EditorBlock;
  handleContentChange: (e: React.FormEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleFocus: () => void;
  handleBlur: (e: React.FocusEvent) => void;
  handleMouseUp: () => void;
}

const DefaultBlock: React.FC<DefaultBlockProps> = ({
  contentRef,
  block,
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
    <div
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      className="outline-none w-full"
      style={blockStyles}
      onInput={handleContentChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseUp={handleMouseUp}
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
};

export default DefaultBlock;

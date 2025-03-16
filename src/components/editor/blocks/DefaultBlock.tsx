
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
  // Force left-to-right text direction and remove any custom styling
  // that might interfere with cursor positioning
  const blockStyles = {
    direction: 'ltr' as const,
    textAlign: 'left' as const,
    unicodeBidi: 'isolate' as const,
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

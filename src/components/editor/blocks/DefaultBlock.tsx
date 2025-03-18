
import React, { useEffect } from 'react';
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
  // Initialize content when block is first rendered
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = block.content;
    }
  }, [block.id]);

  return (
    <div
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      className="outline-none w-full text-left focus:border-transparent focus:bg-transparent"
      onInput={handleContentChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseUp={handleMouseUp}
    />
  );
};

export default DefaultBlock;

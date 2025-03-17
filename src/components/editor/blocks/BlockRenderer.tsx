
import React from 'react';
import { EditorBlock as EditorBlockType } from '../EditorContext';
import { getBlockStyling } from '../utils/blockUtils';
import CheckListBlock from './CheckListBlock';
import DefaultBlock from './DefaultBlock';
import ModuleBlock from './ModuleBlock';

interface BlockRendererProps {
  block: EditorBlockType;
  contentRef: React.RefObject<HTMLDivElement>;
  toggleCheckListItem: (id: string) => void;
  handleContentChange: (e: React.FormEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleFocus: () => void;
  handleBlur: (e: React.FocusEvent) => void;
  handleMouseUp: () => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  contentRef,
  toggleCheckListItem,
  handleContentChange,
  handleKeyDown,
  handleFocus,
  handleBlur,
  handleMouseUp
}) => {
  const renderBlockContent = () => {
    switch (block.type) {
      case 'module':
        return <ModuleBlock block={block} />;
      case 'divider':
        return <hr className="my-4 border-border" />;
      case 'check-list':
        return (
          <CheckListBlock 
            block={block}
            contentRef={contentRef}
            toggleCheckListItem={toggleCheckListItem}
            handleContentChange={handleContentChange}
            handleKeyDown={handleKeyDown}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            handleMouseUp={handleMouseUp}
          />
        );
      default:
        return (
          <DefaultBlock 
            contentRef={contentRef}
            block={block}
            handleContentChange={handleContentChange}
            handleKeyDown={handleKeyDown}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            handleMouseUp={handleMouseUp}
          />
        );
    }
  };

  return (
    <div className={`${getBlockStyling(block.type)}`}>
      {renderBlockContent()}
    </div>
  );
};

export default BlockRenderer;

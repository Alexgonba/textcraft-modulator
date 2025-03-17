
import React from 'react';
import { EditorBlock as EditorBlockType } from './EditorContext';
import DraggableBlock from './blocks/DraggableBlock';

interface EditorBlockProps {
  block: EditorBlockType;
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: () => void;
}

const EditorBlock: React.FC<EditorBlockProps> = ({ 
  block, 
  index,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  return (
    <DraggableBlock
      block={block}
      index={index}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    />
  );
};

export default EditorBlock;

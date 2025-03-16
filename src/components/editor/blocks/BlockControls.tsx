
import React from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { getBlockIcon } from '../utils/blockUtils';
import { BlockType } from '../types';

interface BlockControlsProps {
  isHovering: boolean;
  deleteBlock: (id: string) => void;
  blockId: string;
  blockType: BlockType;
  handlePlusButtonClick: () => void;
}

const BlockControls: React.FC<BlockControlsProps> = ({
  isHovering,
  deleteBlock,
  blockId,
  blockType,
  handlePlusButtonClick,
}) => {
  return (
    <>
      <div className="editor-block-menu">
        <div className="flex flex-col items-center gap-1">
          <button 
            className="drag-handle p-1 rounded-full bg-secondary hover:bg-muted text-muted-foreground"
            title="Drag to reorder"
          >
            <GripVertical size={14} />
          </button>
          <button 
            className="p-1 rounded-full bg-secondary hover:bg-destructive hover:text-destructive-foreground text-muted-foreground"
            onClick={() => deleteBlock(blockId)}
            title="Delete block"
          >
            <Trash2 size={14} />
          </button>
          <div className="bg-muted text-muted-foreground p-1 rounded-full">
            {getBlockIcon(blockType)}
          </div>
        </div>
      </div>

      <div 
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity`}
      >
        <button 
          className="p-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
          onClick={handlePlusButtonClick}
          title="Add content"
        >
          <Plus size={16} />
        </button>
      </div>
    </>
  );
};

export default BlockControls;

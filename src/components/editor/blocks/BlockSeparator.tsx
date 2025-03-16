
import React from 'react';
import { Plus } from 'lucide-react';

interface BlockSeparatorProps {
  showPlusButton: boolean;
  setShowPlusButton: (show: boolean) => void;
  handlePlusButtonClick: () => void;
}

const BlockSeparator: React.FC<BlockSeparatorProps> = ({
  showPlusButton,
  setShowPlusButton,
  handlePlusButtonClick,
}) => {
  return (
    <div 
      className="editor-block-separator h-2 relative" 
      onMouseEnter={() => setShowPlusButton(true)}
      onMouseLeave={() => setShowPlusButton(false)}
    >
      {showPlusButton && (
        <button
          className="editor-plus-menu-button"
          onClick={handlePlusButtonClick}
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
};

export default BlockSeparator;


import React from 'react';
import { BlockType } from '../EditorContext';
import TextFormatToolbar from '../TextFormatToolbar';
import SlashMenu from '../SlashMenu';
import FloatingMenu from '../FloatingMenu';

interface MenusContainerProps {
  blockId: string;
  showFloatingMenu: boolean;
  floatingMenuPosition: { x: number, y: number };
  showFormatToolbar: boolean;
  formatToolbarPosition: { x: number, y: number };
  showSlashMenu: boolean;
  slashMenuPosition: { x: number, y: number };
  blockType: BlockType;
  isEmptyBlock: boolean;
  onSlashMenuSelect: (type: BlockType, moduleType?: string) => void;
  onFormatText: (format: string) => void;
  onChangeBlockType: (type: BlockType) => void;
  onSlashMenuClose: () => void;
  onFormatToolbarClose: () => void;
  onFloatingMenuClose: () => void;
  addBlock: (type: BlockType, afterId: string, moduleType?: string) => void;
}

const MenusContainer: React.FC<MenusContainerProps> = ({
  blockId,
  showFloatingMenu,
  floatingMenuPosition,
  showFormatToolbar,
  formatToolbarPosition,
  showSlashMenu,
  slashMenuPosition,
  blockType,
  isEmptyBlock,
  onSlashMenuSelect,
  onFormatText,
  onChangeBlockType,
  onSlashMenuClose,
  onFormatToolbarClose,
  onFloatingMenuClose,
  addBlock
}) => {
  return (
    <>
      {showFloatingMenu && isEmptyBlock && (
        <FloatingMenu
          position={floatingMenuPosition}
          onSelect={onSlashMenuSelect}
          onClose={onFloatingMenuClose}
          isEmptyLine={true}
        />
      )}

      {showFormatToolbar && (
        <TextFormatToolbar
          position={formatToolbarPosition}
          onFormatText={onFormatText}
          onChangeBlockType={onChangeBlockType}
          currentBlockType={blockType}
          onClose={onFormatToolbarClose}
        />
      )}

      {showSlashMenu && (
        <SlashMenu
          position={slashMenuPosition}
          onSelect={(type, moduleType) => {
            if (type === 'module') {
              const afterId = blockId;
              addBlock(type, afterId, moduleType);
            } else if (type === 'divider' || type === 'video') {
              addBlock(type, blockId, moduleType);
            } else {
              onSlashMenuSelect(type, moduleType);
            }
            onSlashMenuClose();
          }}
          onClose={onSlashMenuClose}
        />
      )}
    </>
  );
};

export default MenusContainer;

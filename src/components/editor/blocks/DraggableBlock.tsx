
import React from 'react';
import { useEditor } from '../EditorContext';
import { useBlockInteractions } from '../hooks/useBlockInteractions';
import { EditorBlock as EditorBlockType } from '../EditorContext';
import BlockControls from './BlockControls';
import BlockRenderer from './BlockRenderer';
import BlockSeparator from './BlockSeparator';
import MenusContainer from '../menus/MenusContainer';

interface DraggableBlockProps {
  block: EditorBlockType;
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: () => void;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  index,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const { 
    toggleCheckListItem,
    deleteBlock,
    changeBlockType,
    addBlock,
    focusedBlockId
  } = useEditor();

  const {
    contentRef,
    blockRef,
    isEmptyBlock,
    showSlashMenu,
    setShowSlashMenu,
    slashMenuPosition,
    setSlashMenuPosition,
    showFormatToolbar,
    setShowFormatToolbar,
    formatToolbarPosition,
    setFormatToolbarPosition,
    showPlusButton,
    setShowPlusButton,
    isHovering,
    setIsHovering,
    showFloatingMenu,
    setShowFloatingMenu,
    floatingMenuPosition,
    handleContentChange,
    handleKeyDown,
    handleSlashMenuSelect,
    handleMouseUp,
    handleFormatText,
    handlePlusButtonClick,
    handleFocus,
    handleBlur
  } = useBlockInteractions({
    blockId: block.id,
    blockContent: block.content,
    index
  });

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e, index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <>
      <div
        ref={blockRef}
        className={`editor-block px-3 py-2 my-0.5 ${
          focusedBlockId === block.id ? 'focused' : ''
        }`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseEnter={() => {
          setShowPlusButton(true);
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setShowPlusButton(false);
          setIsHovering(false);
        }}
      >
        <BlockControls
          isHovering={isHovering}
          deleteBlock={deleteBlock}
          blockId={block.id}
          blockType={block.type}
          handlePlusButtonClick={handlePlusButtonClick}
        />

        <BlockRenderer
          block={block}
          contentRef={contentRef}
          toggleCheckListItem={toggleCheckListItem}
          handleContentChange={handleContentChange}
          handleKeyDown={handleKeyDown}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          handleMouseUp={handleMouseUp}
        />
      </div>

      <BlockSeparator 
        showPlusButton={showPlusButton}
        setShowPlusButton={setShowPlusButton}
        handlePlusButtonClick={handlePlusButtonClick}
      />

      <MenusContainer
        blockId={block.id}
        showFloatingMenu={showFloatingMenu}
        floatingMenuPosition={floatingMenuPosition}
        showFormatToolbar={showFormatToolbar}
        formatToolbarPosition={formatToolbarPosition}
        showSlashMenu={showSlashMenu}
        slashMenuPosition={slashMenuPosition}
        blockType={block.type}
        isEmptyBlock={isEmptyBlock}
        onSlashMenuSelect={handleSlashMenuSelect}
        onFormatText={handleFormatText}
        onChangeBlockType={(type) => changeBlockType(block.id, type)}
        onSlashMenuClose={() => setShowSlashMenu(false)}
        onFormatToolbarClose={() => setShowFormatToolbar(false)}
        onFloatingMenuClose={() => setShowFloatingMenu(false)}
        addBlock={addBlock}
      />
    </>
  );
};

export default DraggableBlock;


import React, { useRef, useState, useEffect } from 'react';
import { useEditor, BlockType, EditorBlock as EditorBlockType } from './EditorContext';
import { getBlockStyling } from './utils/blockUtils';
import BlockControls from './blocks/BlockControls';
import CheckListBlock from './blocks/CheckListBlock';
import DefaultBlock from './blocks/DefaultBlock';
import ModuleBlock from './blocks/ModuleBlock';
import BlockSeparator from './blocks/BlockSeparator';
import TextFormatToolbar from './TextFormatToolbar';
import SlashMenu from './SlashMenu';
import FloatingMenu from './FloatingMenu';

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
  const { 
    focusedBlockId, 
    setFocusedBlockId, 
    updateBlockContent, 
    deleteBlock,
    changeBlockType,
    addBlock,
    toggleCheckListItem
  } = useEditor();
  
  const contentRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [formatToolbarPosition, setFormatToolbarPosition] = useState({ x: 0, y: 0 });
  const [showPlusButton, setShowPlusButton] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isEmptyBlock, setIsEmptyBlock] = useState(block.content.trim() === '');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [floatingMenuPosition, setFloatingMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (contentRef.current && block.id === focusedBlockId) {
      contentRef.current.focus();
      
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      const isEmpty = contentRef.current.textContent?.trim() === '';
      setIsEmptyBlock(isEmpty);
      
      if (isEmpty) {
        const rect = contentRef.current.getBoundingClientRect();
        setFloatingMenuPosition({
          x: rect.left + 20,
          y: rect.top - 10,
        });
        setShowFloatingMenu(true);
      }
    }
  }, [focusedBlockId, block.id]);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    updateBlockContent(block.id, content);
    
    setIsEmptyBlock(content.trim() === '');

    if (content === '/') {
      const rect = e.currentTarget.getBoundingClientRect();
      setSlashMenuPosition({
        x: rect.left,
        y: rect.bottom + window.scrollY
      });
      setShowSlashMenu(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock('paragraph', block.id);
    } else if (e.key === 'Backspace' && (contentRef.current?.textContent || '').length === 0) {
      e.preventDefault();
      deleteBlock(block.id);
    } else if (e.key === '/') {
      const rect = e.currentTarget.getBoundingClientRect();
      setSlashMenuPosition({
        x: rect.left,
        y: rect.bottom + window.scrollY
      });
      setShowSlashMenu(true);
    } else if (e.key === 'Escape') {
      setShowFloatingMenu(false);
      setShowFormatToolbar(false);
      setShowSlashMenu(false);
    } else {
      if (isEmptyBlock && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
        setShowFloatingMenu(false);
      }
    }
  };

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

  const handleSlashMenuSelect = (type: BlockType, moduleType?: string) => {
    if (type === 'showSlashMenu') {
      const rect = contentRef.current?.getBoundingClientRect() || { left: 0, bottom: 0 };
      setSlashMenuPosition({
        x: rect.left,
        y: rect.bottom + window.scrollY
      });
      setShowSlashMenu(true);
      setShowFloatingMenu(false);
    } else {
      changeBlockType(block.id, type, moduleType);
      setShowSlashMenu(false);
      setShowFloatingMenu(false);
      setTimeout(() => {
        setFocusedBlockId(block.id);
      }, 0);
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setFormatToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY
      });
      setShowFormatToolbar(true);
    }
  };

  const handleFormatText = (format: string) => {
    document.execCommand(format);
  };

  const handlePlusButtonClick = () => {
    const rect = blockRef.current?.getBoundingClientRect() || { left: 0, bottom: 0 };
    setSlashMenuPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY + 10
    });
    setShowSlashMenu(true);
  };

  const handleFocus = () => {
    setFocusedBlockId(block.id);
    
    if ((contentRef.current?.textContent || '').trim() === '') {
      setIsEmptyBlock(true);
      const rect = contentRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
      setFloatingMenuPosition({
        x: rect.left + 20,
        y: rect.top - 10
      });
      setShowFloatingMenu(true);
    } else {
      setIsEmptyBlock(false);
      setShowFloatingMenu(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (e.relatedTarget && e.relatedTarget.closest('.floating-menu')) {
      return;
    }
    
    setShowFloatingMenu(false);
  };

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

        <div className={`${getBlockStyling(block.type)}`}>
          {renderBlockContent()}
        </div>

        {showFloatingMenu && isEmptyBlock && (
          <FloatingMenu
            position={floatingMenuPosition}
            onSelect={handleSlashMenuSelect}
            onClose={() => setShowFloatingMenu(false)}
            isEmptyLine={true}
          />
        )}

        {showFormatToolbar && (
          <TextFormatToolbar
            position={formatToolbarPosition}
            onFormatText={handleFormatText}
            onChangeBlockType={(type) => {
              changeBlockType(block.id, type);
              setShowFormatToolbar(false);
            }}
            currentBlockType={block.type}
            onClose={() => setShowFormatToolbar(false)}
          />
        )}
      </div>

      <BlockSeparator 
        showPlusButton={showPlusButton}
        setShowPlusButton={setShowPlusButton}
        handlePlusButtonClick={handlePlusButtonClick}
      />

      {showSlashMenu && (
        <SlashMenu
          position={slashMenuPosition}
          onSelect={(type, moduleType) => {
            if (type === 'module') {
              const afterId = block.id;
              addBlock('module', afterId, moduleType);
            } else if (type === 'divider' || type === 'video') {
              addBlock(type, block.id, moduleType);
            } else {
              handleSlashMenuSelect(type, moduleType);
            }
            setShowSlashMenu(false);
          }}
          onClose={() => setShowSlashMenu(false)}
        />
      )}
    </>
  );
};

export default EditorBlock;

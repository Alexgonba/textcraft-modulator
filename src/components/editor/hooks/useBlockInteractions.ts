
import { useState, useRef, useEffect } from 'react';
import { useEditor, BlockType } from '../EditorContext';

interface UseBlockInteractionsProps {
  blockId: string;
  blockContent: string;
  index: number;
}

interface UseBlockInteractionsReturn {
  contentRef: React.RefObject<HTMLDivElement>;
  blockRef: React.RefObject<HTMLDivElement>;
  isEmptyBlock: boolean;
  setIsEmptyBlock: React.Dispatch<React.SetStateAction<boolean>>;
  showSlashMenu: boolean;
  setShowSlashMenu: React.Dispatch<React.SetStateAction<boolean>>;
  slashMenuPosition: { x: number; y: number };
  setSlashMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  showFormatToolbar: boolean;
  setShowFormatToolbar: React.Dispatch<React.SetStateAction<boolean>>;
  formatToolbarPosition: { x: number; y: number };
  setFormatToolbarPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  showPlusButton: boolean;
  setShowPlusButton: React.Dispatch<React.SetStateAction<boolean>>;
  isHovering: boolean;
  setIsHovering: React.Dispatch<React.SetStateAction<boolean>>;
  showFloatingMenu: boolean;
  setShowFloatingMenu: React.Dispatch<React.SetStateAction<boolean>>;
  floatingMenuPosition: { x: number; y: number };
  setFloatingMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  handleContentChange: (e: React.FormEvent<HTMLDivElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handleSlashMenuSelect: (type: BlockType, moduleType?: string) => void;
  handleMouseUp: () => void;
  handleFormatText: (format: string) => void;
  handlePlusButtonClick: () => void;
  handleFocus: () => void;
  handleBlur: (e: React.FocusEvent) => void;
}

export const useBlockInteractions = ({
  blockId,
  blockContent,
  index
}: UseBlockInteractionsProps): UseBlockInteractionsReturn => {
  const { 
    focusedBlockId, 
    setFocusedBlockId, 
    updateBlockContent, 
    deleteBlock,
    changeBlockType,
    addBlock,
  } = useEditor();
  
  const contentRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [formatToolbarPosition, setFormatToolbarPosition] = useState({ x: 0, y: 0 });
  const [showPlusButton, setShowPlusButton] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isEmptyBlock, setIsEmptyBlock] = useState(blockContent.trim() === '');
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [floatingMenuPosition, setFloatingMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (contentRef.current && blockId === focusedBlockId) {
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
  }, [focusedBlockId, blockId]);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    updateBlockContent(blockId, content);
    
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
      addBlock('paragraph', blockId);
    } else if (e.key === 'Backspace' && (contentRef.current?.textContent || '').length === 0) {
      e.preventDefault();
      deleteBlock(blockId);
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
      changeBlockType(blockId, type, moduleType);
      setShowSlashMenu(false);
      setShowFloatingMenu(false);
      setTimeout(() => {
        setFocusedBlockId(blockId);
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
    setFocusedBlockId(blockId);
    
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

  return {
    contentRef,
    blockRef,
    isEmptyBlock,
    setIsEmptyBlock,
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
    setFloatingMenuPosition,
    handleContentChange,
    handleKeyDown,
    handleSlashMenuSelect,
    handleMouseUp,
    handleFormatText,
    handlePlusButtonClick,
    handleFocus,
    handleBlur
  };
};

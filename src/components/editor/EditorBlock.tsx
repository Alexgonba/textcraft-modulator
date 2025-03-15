
import React, { useRef, useState, useEffect } from 'react';
import { useEditor, BlockType, EditorBlock as EditorBlockType } from './EditorContext';
import { 
  GripVertical, Plus, Trash2, Heading1, Heading2, Heading3, 
  List, ListOrdered, CheckSquare, Quote, Code, Type, Check
} from 'lucide-react';
import TextFormatToolbar from './TextFormatToolbar';
import SlashMenu from './SlashMenu';
import TFTTeamBuilder from '../modules/TFTTeamBuilder';

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
    addBlock
  } = useEditor();
  
  const contentRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [showFormatToolbar, setShowFormatToolbar] = useState(false);
  const [formatToolbarPosition, setFormatToolbarPosition] = useState({ x: 0, y: 0 });
  const [showPlusButton, setShowPlusButton] = useState(false);

  // Set up contentEditable
  useEffect(() => {
    if (contentRef.current && block.id === focusedBlockId) {
      contentRef.current.focus();
      
      // Place cursor at the end
      const range = document.createRange();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [focusedBlockId, block.id]);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    updateBlockContent(block.id, content);

    // Check for slash command
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

  const handleSlashMenuSelect = (type: BlockType) => {
    changeBlockType(block.id, type);
    setShowSlashMenu(false);
    setTimeout(() => {
      setFocusedBlockId(block.id);
    }, 0);
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

  const renderBlockContent = () => {
    switch (block.type) {
      case 'module':
        return <TFTTeamBuilder blockId={block.id} moduleData={block.moduleData} />;
      case 'divider':
        return <hr className="my-4 border-border" />;
      case 'check-list':
        return (
          <div className="flex items-start gap-2">
            <button 
              onClick={() => block.toggleCheckListItem && block.toggleCheckListItem(block.id)}
              className="mt-1 text-muted-foreground hover:text-primary transition-colors"
            >
              {block.checked ? <Check size={16} /> : <div className="w-4 h-4 border border-muted-foreground rounded" />}
            </button>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none flex-1"
              onInput={handleContentChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocusedBlockId(block.id)}
              onMouseUp={handleMouseUp}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        );
      default:
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="outline-none w-full"
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocusedBlockId(block.id)}
            onMouseUp={handleMouseUp}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );
    }
  };

  // Determine styling based on block type
  const getBlockStyling = () => {
    switch (block.type) {
      case 'heading-1':
        return 'text-3xl font-bold';
      case 'heading-2':
        return 'text-2xl font-bold';
      case 'heading-3':
        return 'text-xl font-bold';
      case 'bullet-list':
        return 'list-disc ml-6';
      case 'ordered-list':
        return 'list-decimal ml-6';
      case 'blockquote':
        return 'pl-4 border-l-2 border-primary/50 italic';
      case 'code':
        return 'font-mono bg-secondary p-4 rounded';
      default:
        return '';
    }
  };

  const getBlockIcon = () => {
    switch (block.type) {
      case 'heading-1': return <Heading1 size={14} />;
      case 'heading-2': return <Heading2 size={14} />;
      case 'heading-3': return <Heading3 size={14} />;
      case 'bullet-list': return <List size={14} />;
      case 'ordered-list': return <ListOrdered size={14} />;
      case 'check-list': return <CheckSquare size={14} />;
      case 'blockquote': return <Quote size={14} />;
      case 'code': return <Code size={14} />;
      default: return <Type size={14} />;
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
        onMouseEnter={() => setShowPlusButton(true)}
        onMouseLeave={() => setShowPlusButton(false)}
      >
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
              onClick={() => deleteBlock(block.id)}
              title="Delete block"
            >
              <Trash2 size={14} />
            </button>
            <div className="bg-muted text-muted-foreground p-1 rounded-full">
              {getBlockIcon()}
            </div>
          </div>
        </div>

        <div className={`${getBlockStyling()}`}>
          {renderBlockContent()}
        </div>

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

      {/* Block separator with + button */}
      <div 
        className="editor-block-separator h-2 relative" 
        onMouseEnter={() => setShowPlusButton(true)}
        onMouseLeave={() => setShowPlusButton(false)}
      >
        {showPlusButton && (
          <button
            className="editor-plus-menu-button"
            onClick={() => {
              const rect = blockRef.current?.getBoundingClientRect() || { left: 0, bottom: 0 };
              setSlashMenuPosition({
                x: rect.left,
                y: rect.bottom + window.scrollY + 10
              });
              setShowSlashMenu(true);
            }}
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {showSlashMenu && (
        <SlashMenu
          position={slashMenuPosition}
          onSelect={(type) => {
            if (type === 'module' || type === 'divider') {
              addBlock(type, block.id);
            } else {
              handleSlashMenuSelect(type);
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

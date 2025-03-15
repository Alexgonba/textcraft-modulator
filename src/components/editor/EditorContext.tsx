import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for our editor
export type BlockType = 
  | 'paragraph' 
  | 'heading-1' 
  | 'heading-2' 
  | 'heading-3' 
  | 'bullet-list' 
  | 'ordered-list'
  | 'check-list'
  | 'blockquote'
  | 'code'
  | 'image'
  | 'video'
  | 'module'
  | 'divider';

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: string;
  moduleType?: string;
  moduleData?: any;
  checked?: boolean;
  toggleCheckListItem?: (id: string) => void;
}

interface EditorContextType {
  blocks: EditorBlock[];
  focusedBlockId: string | null;
  setFocusedBlockId: (id: string | null) => void;
  updateBlockContent: (id: string, content: string) => void;
  addBlock: (type: BlockType, afterId?: string) => void;
  deleteBlock: (id: string) => void;
  changeBlockType: (id: string, newType: BlockType) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  toggleCheckListItem: (id: string) => void;
  updateModuleData: (id: string, moduleData: any) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Initial blocks with a welcome message
const initialBlocks: EditorBlock[] = [
  {
    id: uuidv4(),
    type: 'heading-1',
    content: 'Welcome to TextCraft Modulator',
  },
  {
    id: uuidv4(),
    type: 'paragraph',
    content: 'This is a modern, feature-rich text editor with a modular system that allows you to add custom modules like the TFT Team Comp Builder.',
  },
  {
    id: uuidv4(),
    type: 'heading-2',
    content: 'Getting Started',
  },
  {
    id: uuidv4(),
    type: 'paragraph',
    content: 'Click anywhere to start typing, or use the + button between blocks to add new content.',
  },
  {
    id: uuidv4(),
    type: 'bullet-list',
    content: 'Try formatting your text with the toolbar that appears when you select text.',
  },
  {
    id: uuidv4(),
    type: 'bullet-list',
    content: 'Use the slash command by typing / to access quick actions.',
  },
  {
    id: uuidv4(),
    type: 'bullet-list',
    content: 'Drag and drop blocks to reorder them.',
  },
  {
    id: uuidv4(),
    type: 'heading-2',
    content: 'Special Modules',
  },
  {
    id: uuidv4(),
    type: 'paragraph',
    content: 'Try out the TFT Team Comp Builder module by clicking the + button and selecting "TFT Team Comp Builder".',
  },
];

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks.map(block => ({
    ...block,
    toggleCheckListItem: (id: string) => toggleCheckListItem(id)
  })));
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  const updateBlockContent = useCallback((id: string, content: string) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, content } : block
      )
    );
  }, []);

  const addBlock = useCallback((type: BlockType, afterId?: string) => {
    const newBlock: EditorBlock = {
      id: uuidv4(),
      type,
      content: '',
      moduleType: type === 'module' ? 'tft-builder' : undefined,
      moduleData: type === 'module' ? { champions: [], synergies: [] } : undefined,
      toggleCheckListItem: (id: string) => toggleCheckListItem(id)
    };

    setBlocks(prevBlocks => {
      if (!afterId) {
        return [...prevBlocks, newBlock];
      }

      const index = prevBlocks.findIndex(block => block.id === afterId);
      if (index === -1) return [...prevBlocks, newBlock];

      const newBlocks = [...prevBlocks];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    setTimeout(() => {
      setFocusedBlockId(newBlock.id);
    }, 0);
  }, [toggleCheckListItem]);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prevBlocks => {
      // Don't delete the last block
      if (prevBlocks.length <= 1) return prevBlocks;
      
      const index = prevBlocks.findIndex(block => block.id === id);
      const newBlocks = prevBlocks.filter(block => block.id !== id);
      
      // Set focus to the block that will now be at the position of the deleted block,
      // or the last block if we're deleting the last block
      const newFocusIndex = Math.min(index, newBlocks.length - 1);
      setTimeout(() => {
        setFocusedBlockId(newBlocks[newFocusIndex]?.id || null);
      }, 0);
      
      return newBlocks;
    });
  }, []);

  const changeBlockType = useCallback((id: string, newType: BlockType) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, type: newType } : block
      )
    );
  }, []);

  const moveBlockUp = useCallback((id: string) => {
    setBlocks(prevBlocks => {
      const index = prevBlocks.findIndex(block => block.id === id);
      if (index <= 0) return prevBlocks;

      const newBlocks = [...prevBlocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index - 1];
      newBlocks[index - 1] = temp;

      return newBlocks;
    });
  }, []);

  const moveBlockDown = useCallback((id: string) => {
    setBlocks(prevBlocks => {
      const index = prevBlocks.findIndex(block => block.id === id);
      if (index === -1 || index >= prevBlocks.length - 1) return prevBlocks;

      const newBlocks = [...prevBlocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index + 1];
      newBlocks[index + 1] = temp;

      return newBlocks;
    });
  }, []);

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    setBlocks(prevBlocks => {
      const result = Array.from(prevBlocks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const toggleCheckListItem = useCallback((id: string) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, checked: !block.checked } : block
      )
    );
  }, []);

  const updateModuleData = useCallback((id: string, moduleData: any) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, moduleData } : block
      )
    );
  }, []);

  const value = {
    blocks,
    focusedBlockId,
    setFocusedBlockId,
    updateBlockContent,
    addBlock,
    deleteBlock,
    changeBlockType,
    moveBlockUp,
    moveBlockDown,
    reorderBlocks,
    toggleCheckListItem,
    updateModuleData,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

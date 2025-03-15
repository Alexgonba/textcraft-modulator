
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
  | 'divider'
  | 'showSlashMenu'; // Special type for UX only, not a real block type

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: string;
  moduleType?: string;
  moduleData?: any;
  checked?: boolean;
}

interface EditorContextType {
  blocks: EditorBlock[];
  focusedBlockId: string | null;
  setFocusedBlockId: (id: string | null) => void;
  updateBlockContent: (id: string, content: string) => void;
  addBlock: (type: BlockType, afterId?: string, moduleType?: string) => void;
  deleteBlock: (id: string) => void;
  changeBlockType: (id: string, newType: BlockType, moduleType?: string) => void;
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
    content: 'Welcome to MultiGame Editor',
  },
  {
    id: uuidv4(),
    type: 'paragraph',
    content: 'This is a versatile, feature-rich text editor with a modular system that supports multiple games and content types.',
  },
  {
    id: uuidv4(),
    type: 'heading-2',
    content: 'Getting Started',
  },
  {
    id: uuidv4(),
    type: 'paragraph',
    content: 'Click anywhere to start typing, or use the + button to add new content.',
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
    content: 'Try the new contextual editing - when a line is empty, a small menu will appear.',
  },
  {
    id: uuidv4(),
    type: 'heading-2',
    content: 'Game Modules',
  },
  {
    id: uuidv4(),
    type: 'paragraph',
    content: 'Try out different game modules by clicking the + button or using the slash command. Each game has its own specific modules.',
  },
];

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  const updateBlockContent = useCallback((id: string, content: string) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, content } : block
      )
    );
  }, []);

  const toggleCheckListItem = useCallback((id: string) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, checked: !block.checked } : block
      )
    );
  }, []);

  const addBlock = useCallback((type: BlockType, afterId?: string, moduleType?: string) => {
    // Set default moduleData based on moduleType
    let defaultModuleData;
    
    if (type === 'module') {
      switch(moduleType) {
        case 'tft-builder':
          defaultModuleData = { champions: [], synergies: [] };
          break;
        case 'lol-champions':
          defaultModuleData = { champions: [], roles: [] };
          break;
        case 'valorant-agents':
          defaultModuleData = { agents: [], roles: [] };
          break;
        case 'bg3-builder':
          defaultModuleData = { character: {}, abilities: [] };
          break;
        default:
          defaultModuleData = {};
      }
    } else if (type === 'video') {
      switch(moduleType) {
        case 'youtube':
          defaultModuleData = { videoId: '', title: '' };
          break;
        case 'twitch':
          defaultModuleData = { channelId: '' };
          break;
        case 'instagram':
          defaultModuleData = { postId: '' };
          break;
        default:
          defaultModuleData = {};
      }
    }

    const newBlock: EditorBlock = {
      id: uuidv4(),
      type,
      content: '',
      moduleType: (type === 'module' || type === 'video') ? moduleType : undefined,
      moduleData: (type === 'module' || type === 'video') ? defaultModuleData : undefined,
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
  }, []);

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

  const changeBlockType = useCallback((id: string, newType: BlockType, moduleType?: string) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => {
        if (block.id === id) {
          // If changing to a module type, set appropriate moduleType and data
          if (newType === 'module') {
            let defaultModuleData;
            const actualModuleType = moduleType || 'tft-builder';
            
            switch(actualModuleType) {
              case 'tft-builder':
                defaultModuleData = { champions: [], synergies: [] };
                break;
              case 'lol-champions':
                defaultModuleData = { champions: [], roles: [] };
                break;
              case 'valorant-agents':
                defaultModuleData = { agents: [], roles: [] };
                break;
              case 'bg3-builder':
                defaultModuleData = { character: {}, abilities: [] };
                break;
              default:
                defaultModuleData = {};
            }
            
            return { 
              ...block, 
              type: newType,
              moduleType: actualModuleType,
              moduleData: defaultModuleData
            };
          }
          
          // If changing to a video type
          if (newType === 'video') {
            let defaultModuleData;
            const actualModuleType = moduleType || 'youtube';
            
            switch(actualModuleType) {
              case 'youtube':
                defaultModuleData = { videoId: '', title: '' };
                break;
              case 'twitch':
                defaultModuleData = { channelId: '' };
                break;
              case 'instagram':
                defaultModuleData = { postId: '' };
                break;
              default:
                defaultModuleData = {};
            }
            
            return { 
              ...block, 
              type: newType,
              moduleType: actualModuleType,
              moduleData: defaultModuleData
            };
          }
          
          // Otherwise just change the type
          return { ...block, type: newType };
        }
        return block;
      })
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

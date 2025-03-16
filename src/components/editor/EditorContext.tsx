import React, { createContext, useContext, useState, useCallback } from 'react';
import { EditorContextType, EditorProviderProps, EditorBlock, BlockType } from './types';
import { initialBlocks } from './defaultBlocks';
import { 
  createNewBlock, 
  insertBlockAfter, 
  removeBlock, 
  updateBlock, 
  moveBlock, 
  reorderBlockList,
  createDefaultModuleData,
  createDefaultVideoData
} from './editorUtils';

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  const updateBlockContent = useCallback((id: string, content: string) => {
    setBlocks(prevBlocks => updateBlock(prevBlocks, id, { content }));
  }, []);

  const toggleCheckListItem = useCallback((id: string) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, checked: !block.checked } : block
      )
    );
  }, []);

  const addBlock = useCallback((type: BlockType, afterId?: string, moduleType?: string) => {
    const newBlock = createNewBlock(type, moduleType);
    
    setBlocks(prevBlocks => insertBlockAfter(prevBlocks, newBlock, afterId));

    setTimeout(() => {
      setFocusedBlockId(newBlock.id);
    }, 0);
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prevBlocks => {
      const index = prevBlocks.findIndex(block => block.id === id);
      const newBlocks = removeBlock(prevBlocks, id);
      
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
            const actualModuleType = moduleType || 'tft-builder';
            const defaultModuleData = createDefaultModuleData(actualModuleType);
            
            return { 
              ...block, 
              type: newType,
              moduleType: actualModuleType,
              moduleData: defaultModuleData
            };
          }
          
          // If changing to a video type
          if (newType === 'video') {
            const actualModuleType = moduleType || 'youtube';
            const defaultModuleData = createDefaultVideoData(actualModuleType);
            
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
    setBlocks(prevBlocks => moveBlock(prevBlocks, id, 'up'));
  }, []);

  const moveBlockDown = useCallback((id: string) => {
    setBlocks(prevBlocks => moveBlock(prevBlocks, id, 'down'));
  }, []);

  const reorderBlocks = useCallback((startIndex: number, endIndex: number) => {
    setBlocks(prevBlocks => reorderBlockList(prevBlocks, startIndex, endIndex));
  }, []);

  const updateModuleData = useCallback((id: string, moduleData: any) => {
    setBlocks(prevBlocks => updateBlock(prevBlocks, id, { moduleData }));
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

// Re-export types for convenience
export type { BlockType, EditorBlock } from './types';

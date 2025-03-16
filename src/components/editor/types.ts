
import { ReactNode } from 'react';

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

export interface EditorContextType {
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

export interface EditorProviderProps {
  children: ReactNode;
}

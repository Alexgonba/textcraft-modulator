
import { v4 as uuidv4 } from 'uuid';
import { BlockType, EditorBlock } from './types';

export const createDefaultModuleData = (moduleType: string | undefined): any => {
  if (!moduleType) return {};

  switch(moduleType) {
    case 'tft-builder':
      return { champions: [], synergies: [] };
    case 'lol-champions':
      return { champions: [], roles: [] };
    case 'lol-items':
      return { items: [] };
    case 'lol-runes':
      return { primaryPath: null, secondaryPath: null, runes: [] };
    case 'lol-abilities':
      return { championId: '', abilities: [] };
    case 'valorant-agents':
      return { agents: [], roles: [] };
    case 'bg3-builder':
      return { character: {}, abilities: [] };
    default:
      return {};
  }
};

export const createDefaultVideoData = (moduleType: string | undefined): any => {
  if (!moduleType) return {};

  switch(moduleType) {
    case 'youtube':
      return { videoId: '', title: '' };
    case 'twitch':
      return { channelId: '' };
    case 'instagram':
      return { postId: '' };
    default:
      return {};
  }
};

export const createNewBlock = (type: BlockType, moduleType?: string): EditorBlock => {
  let moduleData;
  
  if (type === 'module') {
    moduleData = createDefaultModuleData(moduleType);
  } else if (type === 'video') {
    moduleData = createDefaultVideoData(moduleType);
  }

  return {
    id: uuidv4(),
    type,
    content: '',
    moduleType: (type === 'module' || type === 'video') ? moduleType : undefined,
    moduleData: (type === 'module' || type === 'video') ? moduleData : undefined,
  };
};

export const insertBlockAfter = (
  blocks: EditorBlock[], 
  newBlock: EditorBlock, 
  afterId?: string
): EditorBlock[] => {
  if (!afterId) {
    return [...blocks, newBlock];
  }

  const index = blocks.findIndex(block => block.id === afterId);
  if (index === -1) return [...blocks, newBlock];

  const newBlocks = [...blocks];
  newBlocks.splice(index + 1, 0, newBlock);
  return newBlocks;
};

export const removeBlock = (blocks: EditorBlock[], id: string): EditorBlock[] => {
  // Don't delete the last block
  if (blocks.length <= 1) return blocks;
  
  return blocks.filter(block => block.id !== id);
};

export const updateBlock = (
  blocks: EditorBlock[], 
  id: string, 
  updates: Partial<EditorBlock>
): EditorBlock[] => {
  return blocks.map(block => 
    block.id === id ? { ...block, ...updates } : block
  );
};

export const moveBlock = (
  blocks: EditorBlock[], 
  id: string, 
  direction: 'up' | 'down'
): EditorBlock[] => {
  const index = blocks.findIndex(block => block.id === id);
  
  if (direction === 'up' && index <= 0) return blocks;
  if (direction === 'down' && (index === -1 || index >= blocks.length - 1)) return blocks;

  const newBlocks = [...blocks];
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  
  const temp = newBlocks[index];
  newBlocks[index] = newBlocks[swapIndex];
  newBlocks[swapIndex] = temp;

  return newBlocks;
};

export const reorderBlockList = (
  blocks: EditorBlock[], 
  startIndex: number, 
  endIndex: number
): EditorBlock[] => {
  const result = Array.from(blocks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

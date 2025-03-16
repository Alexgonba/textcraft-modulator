
import { v4 as uuidv4 } from 'uuid';
import { EditorBlock } from './types';

// Initial blocks with a welcome message
export const initialBlocks: EditorBlock[] = [
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

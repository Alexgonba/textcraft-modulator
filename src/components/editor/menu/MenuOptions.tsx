
import React from 'react';
import { 
  Type, Heading1, Heading2, Heading3, List, ListOrdered, 
  CheckSquare, Quote, Code, Image, Youtube, Twitch, Instagram, 
  Gamepad2, Minus, Layout, Book, Dices, Swords, Target
} from 'lucide-react';
import { BlockType } from '../EditorContext';

export interface MenuOption {
  icon: React.ReactNode;
  label: string;
  type: BlockType;
  description: string;
  moduleType?: string;
  gameId?: string; // Associated game ID
}

// Base block options available for all types of content
export const baseBlockOptions: MenuOption[] = [
  { icon: <Type size={18} />, label: 'Text', type: 'paragraph', description: 'Just start writing with plain text' },
  { icon: <Heading1 size={18} />, label: 'Heading 1', type: 'heading-1', description: 'Big section heading' },
  { icon: <Heading2 size={18} />, label: 'Heading 2', type: 'heading-2', description: 'Medium section heading' },
  { icon: <Heading3 size={18} />, label: 'Heading 3', type: 'heading-3', description: 'Small section heading' },
  { icon: <List size={18} />, label: 'Bullet List', type: 'bullet-list', description: 'Create a simple bullet list' },
  { icon: <ListOrdered size={18} />, label: 'Numbered List', type: 'ordered-list', description: 'Create a numbered list' },
  { icon: <CheckSquare size={18} />, label: 'Check List', type: 'check-list', description: 'Create a checklist' },
  { icon: <Quote size={18} />, label: 'Quote', type: 'blockquote', description: 'Insert a quotation or citation' },
  { icon: <Code size={18} />, label: 'Code', type: 'code', description: 'Add a code snippet' },
  { icon: <Image size={18} />, label: 'Image', type: 'image', description: 'Upload or embed an image' },
  { icon: <Minus size={18} />, label: 'Divider', type: 'divider', description: 'Insert a visual divider' },
];

// Media embed options
export const mediaOptions: MenuOption[] = [
  { icon: <Youtube size={18} />, label: 'YouTube', type: 'video', description: 'Embed a YouTube video', moduleType: 'youtube' },
  { icon: <Twitch size={18} />, label: 'Twitch', type: 'video', description: 'Embed a Twitch stream', moduleType: 'twitch' },
  { icon: <Instagram size={18} />, label: 'Instagram', type: 'video', description: 'Embed Instagram content', moduleType: 'instagram' },
];

// Game-specific module options
export const gameModuleOptions: MenuOption[] = [
  { 
    icon: <Gamepad2 size={18} />, // Changed from Chess to Gamepad2
    label: 'TFT Team Comp Builder', 
    type: 'module', 
    description: 'Insert TFT team builder module',
    moduleType: 'tft-builder',
    gameId: 'tft'
  },
  { 
    icon: <Swords size={18} />, 
    label: 'LoL Champions Overview', 
    type: 'module', 
    description: 'Insert League of Legends champion overview',
    moduleType: 'lol-champions',
    gameId: 'lol'
  },
  { 
    icon: <Target size={18} />, 
    label: 'Valorant Agent Guide', 
    type: 'module', 
    description: 'Insert Valorant agent guide module',
    moduleType: 'valorant-agents',
    gameId: 'valorant'
  },
  { 
    icon: <Dices size={18} />, 
    label: 'Baldur\'s Gate Character Builder', 
    type: 'module', 
    description: 'Insert BG3 character builder module',
    moduleType: 'bg3-builder',
    gameId: 'bg3'
  },
];

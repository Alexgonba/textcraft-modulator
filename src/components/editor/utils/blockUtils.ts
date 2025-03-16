
import { BlockType } from '../types';
import { 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, CheckSquare, Quote, Code, Type
} from 'lucide-react';
import React from 'react';

export const getBlockStyling = (blockType: BlockType): string => {
  switch (blockType) {
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

export const getBlockIcon = (blockType: BlockType): React.ReactNode => {
  switch (blockType) {
    case 'heading-1': 
      return React.createElement(Heading1, { size: 14 });
    case 'heading-2': 
      return React.createElement(Heading2, { size: 14 });
    case 'heading-3': 
      return React.createElement(Heading3, { size: 14 });
    case 'bullet-list': 
      return React.createElement(List, { size: 14 });
    case 'ordered-list': 
      return React.createElement(ListOrdered, { size: 14 });
    case 'check-list': 
      return React.createElement(CheckSquare, { size: 14 });
    case 'blockquote': 
      return React.createElement(Quote, { size: 14 });
    case 'code': 
      return React.createElement(Code, { size: 14 });
    default: 
      return React.createElement(Type, { size: 14 });
  }
};

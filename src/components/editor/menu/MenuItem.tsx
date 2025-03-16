
import React from 'react';
import { CommandItem } from "@/components/ui/command";
import { MenuOption } from './MenuOptions';
import { BlockType } from '../EditorContext';

interface MenuItemProps {
  option: MenuOption;
  isSelected: boolean;
  onSelect: (type: BlockType, moduleType?: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  option, 
  isSelected,
  onSelect 
}) => {
  return (
    <CommandItem
      key={`${option.type}-${option.label}`}
      onSelect={() => onSelect(option.type, option.moduleType)}
      className={`flex items-center px-3 py-2 text-sm cursor-pointer ${
        isSelected ? 'bg-accent' : ''
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground mr-2">
        {option.icon}
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{option.label}</span>
        <span className="text-xs text-muted-foreground">{option.description}</span>
      </div>
    </CommandItem>
  );
};

export default MenuItem;

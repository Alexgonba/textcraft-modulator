
import React from 'react';
import { CommandGroup, CommandSeparator } from "@/components/ui/command";
import MenuItem from './MenuItem';
import { MenuOption } from './MenuOptions';
import { BlockType } from '../EditorContext';

interface MenuSectionProps {
  title: string;
  options: MenuOption[];
  selectedIndex: number;
  startIndex: number;
  onSelect: (type: BlockType, moduleType?: string) => void;
  showSeparator?: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  options,
  selectedIndex,
  startIndex,
  onSelect,
  showSeparator = false
}) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <>
      {showSeparator && <CommandSeparator />}
      <CommandGroup heading={title}>
        {options.map((option, index) => (
          <MenuItem
            key={`${option.type}-${option.label}`}
            option={option}
            isSelected={selectedIndex === startIndex + index}
            onSelect={onSelect}
          />
        ))}
      </CommandGroup>
    </>
  );
};

export default MenuSection;

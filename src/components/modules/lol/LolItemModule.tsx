
import React, { useState } from 'react';
import { useEditor } from '../../editor/EditorContext';
import { useItems, getImageUrl, Item } from '../../../services/DataDragonService';
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SearchIcon, XIcon, PlusCircle, InfoIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LolItemModuleProps {
  blockId: string;
  moduleData: {
    items: string[];
  };
}

const LolItemModule: React.FC<LolItemModuleProps> = ({ blockId, moduleData }) => {
  const { updateModuleData } = useEditor();
  const { data: itemsData, isLoading, error } = useItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { toast } = useToast();

  const items = itemsData ? Object.entries(itemsData).map(([id, item]) => ({
    ...item,
    id
  })) : [];

  const itemTags = Array.from(
    new Set(
      items.flatMap(item => item.tags || [])
    )
  ).sort();

  const selectedItems = items.filter(item => 
    moduleData.items.includes(item.id)
  );

  const filteredItems = items.filter(item => {
    // Filter by search term
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected tag (if any)
    const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));
    
    // Filter out already selected items
    const notSelected = !moduleData.items.includes(item.id);
    
    // Filter out non-purchasable items
    const isPurchasable = item.gold && item.gold.total > 0;
    
    return matchesSearch && matchesTag && notSelected && isPurchasable;
  });

  const handleAddItem = (item: Item & { id: string }) => {
    if (moduleData.items.includes(item.id)) return;
    
    updateModuleData(blockId, {
      ...moduleData,
      items: [...moduleData.items, item.id]
    });
    
    toast({
      title: "Item added",
      description: `${item.name} has been added to the list`,
      duration: 2000,
    });
    
    setIsOpen(false);
  };

  const handleRemoveItem = (itemId: string) => {
    updateModuleData(blockId, {
      ...moduleData,
      items: moduleData.items.filter(id => id !== itemId)
    });
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  if (isLoading) return <div className="p-4 text-center">Loading items...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error loading items</div>;

  return (
    <div className="lol-item-module rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex gap-2">
            {itemTags.map(tag => (
              <Badge 
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Items</h3>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput 
                placeholder="Search items..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {filteredItems.map(item => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleAddItem(item)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <img 
                          src={getImageUrl('item', item.image.full)} 
                          alt={item.name}
                          className="w-8 h-8"
                        />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.gold.total} gold
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {selectedItems.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <SearchIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p>No items selected. Click "Add Item" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedItems.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative flex flex-col items-center p-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <img 
                          src={getImageUrl('item', item.image.full)} 
                          alt={item.name}
                          className="w-16 h-16 object-contain"
                        />
                        <Badge className="absolute -bottom-2 -right-2 text-xs">
                          {item.gold.total}g
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-2">
                        <div className="font-semibold">{item.name}</div>
                        <div dangerouslySetInnerHTML={{ __html: item.description }} className="text-sm" />
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm text-center truncate">{item.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LolItemModule;

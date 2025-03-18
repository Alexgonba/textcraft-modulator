
import React, { useState, useEffect } from 'react';
import { useEditor } from '../../editor/EditorContext';
import { 
  useChampions, 
  Champion, 
  getImageUrl 
} from '../../../services/DataDragonService';
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
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { SearchIcon, XIcon, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LolChampionModuleProps {
  blockId: string;
  moduleData: {
    champions: string[];
    roles: string[];
  };
}

const LolChampionModule: React.FC<LolChampionModuleProps> = ({ blockId, moduleData }) => {
  const { updateModuleData } = useEditor();
  const { data: champions, isLoading, error } = useChampions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const roles = [
    { id: 'Fighter', label: 'Fighter' },
    { id: 'Tank', label: 'Tank' },
    { id: 'Mage', label: 'Mage' },
    { id: 'Assassin', label: 'Assassin' },
    { id: 'Support', label: 'Support' },
    { id: 'Marksman', label: 'Marksman' },
  ];

  const selectedChampions = champions?.filter(champ => 
    moduleData.champions.includes(champ.id)
  ) || [];

  const filteredChampions = champions?.filter(champ => {
    // Filter by search term
    const matchesSearch = champ.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected roles (if any)
    const matchesRoles = moduleData.roles.length === 0 || 
      champ.tags.some(tag => moduleData.roles.includes(tag));
    
    // Filter out already selected champions
    const notSelected = !moduleData.champions.includes(champ.id);
    
    return matchesSearch && matchesRoles && notSelected;
  });

  const handleAddChampion = (champion: Champion) => {
    if (moduleData.champions.includes(champion.id)) return;
    
    updateModuleData(blockId, {
      ...moduleData,
      champions: [...moduleData.champions, champion.id]
    });
    
    toast({
      title: "Champion added",
      description: `${champion.name} has been added to the list`,
      duration: 2000,
    });
    
    setIsOpen(false);
  };

  const handleRemoveChampion = (championId: string) => {
    updateModuleData(blockId, {
      ...moduleData,
      champions: moduleData.champions.filter(id => id !== championId)
    });
  };

  const toggleRole = (roleId: string) => {
    if (moduleData.roles.includes(roleId)) {
      updateModuleData(blockId, {
        ...moduleData,
        roles: moduleData.roles.filter(id => id !== roleId)
      });
    } else {
      updateModuleData(blockId, {
        ...moduleData,
        roles: [...moduleData.roles, roleId]
      });
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading champions...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error loading champions</div>;

  return (
    <div className="lol-champion-module rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map(role => (
          <Badge 
            key={role.id}
            variant={moduleData.roles.includes(role.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleRole(role.id)}
          >
            {role.label}
          </Badge>
        ))}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Champions</h3>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Champion
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput 
                placeholder="Search champions..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>No champions found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-[300px]">
                    {filteredChampions?.map(champion => (
                      <CommandItem
                        key={champion.id}
                        onSelect={() => handleAddChampion(champion)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <img 
                          src={getImageUrl('champion', champion.image.full)} 
                          alt={champion.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{champion.name}</span>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {selectedChampions.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          <SearchIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p>No champions selected. Click "Add Champion" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedChampions.map(champion => (
            <Card key={champion.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={getImageUrl('champion', champion.image.full)} 
                  alt={champion.name}
                  className="w-full h-32 object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => handleRemoveChampion(champion.id)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm">{champion.name}</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <div className="flex flex-wrap gap-1">
                  {champion.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LolChampionModule;

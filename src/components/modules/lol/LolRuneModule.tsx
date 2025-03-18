import React, { useState } from 'react';
import { useEditor } from '../../editor/EditorContext';
import { useRunes, getRuneImageUrl, RunePath } from '../../../services/DataDragonService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface LolRuneModuleProps {
  blockId: string;
  moduleData: {
    primaryPath: number | null;
    secondaryPath: number | null;
    runes: number[];
  };
}

const LolRuneModule: React.FC<LolRuneModuleProps> = ({ blockId, moduleData }) => {
  const { updateModuleData } = useEditor();
  const { data: runesPaths, isLoading, error } = useRunes();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('primary');

  const handleSelectPath = (pathId: number) => {
    if (activeTab === 'primary') {
      // If selecting the same primary path as secondary, clear secondary
      if (pathId === moduleData.secondaryPath) {
        updateModuleData(blockId, {
          ...moduleData,
          primaryPath: pathId,
          secondaryPath: null,
          runes: moduleData.runes.filter(runeId => {
            // Keep only runes that don't belong to the paths we're clearing
            const belongsToPrimaryPath = runesPaths?.find(
              path => path.id === pathId
            )?.slots.some(slot => 
              slot.runes.some(rune => rune.id === runeId)
            );
            return belongsToPrimaryPath || false;
          })
        });
      } else {
        updateModuleData(blockId, {
          ...moduleData,
          primaryPath: pathId,
          runes: moduleData.runes.filter(runeId => {
            // Keep only runes that don't belong to the primary path we're replacing
            const belongsToOldPrimaryPath = runesPaths?.find(
              path => path.id === moduleData.primaryPath
            )?.slots.some(slot => 
              slot.runes.some(rune => rune.id === runeId)
            );
            
            const belongsToSecondaryPath = runesPaths?.find(
              path => path.id === moduleData.secondaryPath
            )?.slots.some(slot => 
              slot.runes.some(rune => rune.id === runeId)
            );
            
            return !belongsToOldPrimaryPath || belongsToSecondaryPath;
          })
        });
      }
      setActiveTab('secondary');
    } else {
      // If selecting the same path as primary, show error
      if (pathId === moduleData.primaryPath) {
        toast({
          title: "Invalid selection",
          description: "Primary and secondary paths must be different",
          variant: "destructive",
        });
        return;
      }
      
      updateModuleData(blockId, {
        ...moduleData,
        secondaryPath: pathId,
        runes: moduleData.runes.filter(runeId => {
          // Keep only runes that don't belong to the secondary path we're replacing
          const belongsToOldSecondaryPath = runesPaths?.find(
            path => path.id === moduleData.secondaryPath
          )?.slots.some(slot => 
            slot.runes.some(rune => rune.id === runeId)
          );
          
          const belongsToPrimaryPath = runesPaths?.find(
            path => path.id === moduleData.primaryPath
          )?.slots.some(slot => 
            slot.runes.some(rune => rune.id === runeId)
          );
          
          return !belongsToOldSecondaryPath || belongsToPrimaryPath;
        })
      });
    }
  };

  const handleSelectRune = (runeId: number, pathId: number, slotIndex: number) => {
    const isPrimaryPathRune = pathId === moduleData.primaryPath;
    const isSecondaryPathRune = pathId === moduleData.secondaryPath;
    
    if (!isPrimaryPathRune && !isSecondaryPathRune) return;
    
    // For primary path, we can select one rune from each slot
    // For secondary path, we can only select two runes from any slots except the first one
    
    const newRunes = [...moduleData.runes];
    
    // Remove any existing rune from the same slot and path
    if (isPrimaryPathRune) {
      const slotRunes = runesPaths?.find(p => p.id === pathId)?.slots[slotIndex].runes || [];
      const runeIdsInSlot = slotRunes.map(r => r.id);
      
      // Remove any rune from the same slot
      const filteredRunes = newRunes.filter(r => !runeIdsInSlot.includes(r));
      
      // Add the new rune
      filteredRunes.push(runeId);
      
      updateModuleData(blockId, {
        ...moduleData,
        runes: filteredRunes
      });
    } else if (isSecondaryPathRune) {
      // For secondary path, skip the first slot (keystone)
      if (slotIndex === 0) {
        toast({
          title: "Invalid selection",
          description: "Cannot select keystone runes from secondary path",
          variant: "destructive",
        });
        return;
      }
      
      // Count how many secondary runes we already have
      const secondaryRuneIds = runesPaths?.find(p => p.id === pathId)?.slots.flatMap(slot => 
        slot.runes.map(r => r.id)
      ) || [];
      
      const existingSecondaryRunes = newRunes.filter(r => secondaryRuneIds.includes(r));
      
      // Check if this rune is already selected
      if (newRunes.includes(runeId)) {
        // Remove it
        const filteredRunes = newRunes.filter(r => r !== runeId);
        updateModuleData(blockId, {
          ...moduleData,
          runes: filteredRunes
        });
        return;
      }
      
      // Check if we already have 2 secondary runes selected
      if (existingSecondaryRunes.length >= 2) {
        toast({
          title: "Maximum runes selected",
          description: "You can only select 2 runes from the secondary path",
          variant: "destructive",
        });
        return;
      }
      
      // Add the new rune
      newRunes.push(runeId);
      
      updateModuleData(blockId, {
        ...moduleData,
        runes: newRunes
      });
    }
  };

  const isRuneSelected = (runeId: number) => {
    return moduleData.runes.includes(runeId);
  };

  if (isLoading) return <div className="p-4 text-center">Loading runes...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error loading runes</div>;

  const primaryPath = runesPaths?.find(path => path.id === moduleData.primaryPath);
  const secondaryPath = runesPaths?.find(path => path.id === moduleData.secondaryPath);

  return (
    <div className="lol-rune-module rounded-lg border border-border bg-card p-4">
      <Tabs defaultValue="primary" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="primary">Primary Path</TabsTrigger>
          <TabsTrigger value="secondary" disabled={!moduleData.primaryPath}>Secondary Path</TabsTrigger>
        </TabsList>
        
        <TabsContent value="primary">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {runesPaths?.map(path => (
              <Card 
                key={path.id}
                className={`cursor-pointer transition-all ${moduleData.primaryPath === path.id ? 'ring-2 ring-primary' : 'hover:bg-accent'}`}
                onClick={() => handleSelectPath(path.id)}
              >
                <CardContent className="flex flex-col items-center p-4">
                  <img 
                    src={getRuneImageUrl(path.icon)} 
                    alt={path.name}
                    className="w-16 h-16 object-contain"
                  />
                  <CardTitle className="text-sm mt-2 text-center">{path.name}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {primaryPath && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">{primaryPath.name} Runes</h3>
              <div className="space-y-6">
                {primaryPath.slots.map((slot, slotIndex) => (
                  <div key={slotIndex}>
                    <h4 className="text-sm font-medium mb-2">
                      {slotIndex === 0 ? 'Keystone' : `Slot ${slotIndex}`}
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {slot.runes.map(rune => (
                        <Card 
                          key={rune.id}
                          className={`cursor-pointer transition-all ${isRuneSelected(rune.id) ? 'ring-2 ring-primary' : 'hover:bg-accent'}`}
                          onClick={() => handleSelectRune(rune.id, primaryPath.id, slotIndex)}
                        >
                          <CardContent className="flex flex-col items-center p-2">
                            <img 
                              src={getRuneImageUrl(rune.icon)} 
                              alt={rune.name}
                              className="w-10 h-10 object-contain"
                            />
                            <div className="text-xs mt-1 text-center">{rune.name}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="secondary">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {runesPaths?.filter(path => path.id !== moduleData.primaryPath).map(path => (
              <Card 
                key={path.id}
                className={`cursor-pointer transition-all ${moduleData.secondaryPath === path.id ? 'ring-2 ring-primary' : 'hover:bg-accent'}`}
                onClick={() => handleSelectPath(path.id)}
              >
                <CardContent className="flex flex-col items-center p-4">
                  <img 
                    src={getRuneImageUrl(path.icon)} 
                    alt={path.name}
                    className="w-16 h-16 object-contain"
                  />
                  <CardTitle className="text-sm mt-2 text-center">{path.name}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {secondaryPath && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">{secondaryPath.name} Runes (Select 2)</h3>
              <div className="space-y-6">
                {secondaryPath.slots.slice(1).map((slot, idx) => {
                  const slotIndex = idx + 1; // Skip the first slot (keystone)
                  return (
                    <div key={slotIndex}>
                      <h4 className="text-sm font-medium mb-2">Slot {slotIndex}</h4>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {slot.runes.map(rune => (
                          <Card 
                            key={rune.id}
                            className={`cursor-pointer transition-all ${isRuneSelected(rune.id) ? 'ring-2 ring-primary' : 'hover:bg-accent'}`}
                            onClick={() => handleSelectRune(rune.id, secondaryPath.id, slotIndex)}
                          >
                            <CardContent className="flex flex-col items-center p-2">
                              <img 
                                src={getRuneImageUrl(rune.icon)} 
                                alt={rune.name}
                                className="w-10 h-10 object-contain"
                              />
                              <div className="text-xs mt-1 text-center">{rune.name}</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LolRuneModule;

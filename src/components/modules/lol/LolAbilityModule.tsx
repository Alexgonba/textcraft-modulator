
import React, { useState } from 'react';
import { useEditor } from '../../editor/EditorContext';
import { 
  useChampions, 
  useChampionDetail, 
  getImageUrl 
} from '../../../services/DataDragonService';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface LolAbilityModuleProps {
  blockId: string;
  moduleData: {
    championId: string;
    abilities: any[];
  };
}

const LolAbilityModule: React.FC<LolAbilityModuleProps> = ({ blockId, moduleData }) => {
  const { updateModuleData } = useEditor();
  const { data: champions, isLoading: isLoadingChampions } = useChampions();
  const { data: championDetail, isLoading: isLoadingDetail } = useChampionDetail(moduleData.championId);
  
  const handleChampionChange = (value: string) => {
    updateModuleData(blockId, {
      ...moduleData,
      championId: value,
      abilities: []
    });
  };

  if (isLoadingChampions) return <div className="p-4 text-center">Loading champions...</div>;

  const sortedChampions = champions ? [...champions].sort((a, b) => a.name.localeCompare(b.name)) : [];

  return (
    <div className="lol-ability-module rounded-lg border border-border bg-card p-4">
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Champion</label>
        <Select value={moduleData.championId} onValueChange={handleChampionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a champion" />
          </SelectTrigger>
          <SelectContent>
            {sortedChampions.map(champion => (
              <SelectItem key={champion.id} value={champion.id}>
                <div className="flex items-center gap-2">
                  <img 
                    src={getImageUrl('champion', champion.image.full)} 
                    alt={champion.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{champion.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoadingDetail && moduleData.championId && (
        <div className="p-4 text-center">Loading champion details...</div>
      )}

      {championDetail && (
        <div className="champion-abilities">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={getImageUrl('champion', championDetail.image.full)} 
              alt={championDetail.name}
              className="w-20 h-20 rounded-lg"
            />
            <div>
              <h3 className="text-xl font-bold">{championDetail.name}</h3>
              <p className="text-muted-foreground">{championDetail.title}</p>
              
              <div className="flex gap-2 mt-2">
                {championDetail.tags.map(tag => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="stats grid grid-cols-4 gap-2 mb-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Attack</div>
              <Progress value={championDetail.info.attack * 10} className="h-2" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Defense</div>
              <Progress value={championDetail.info.defense * 10} className="h-2" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Magic</div>
              <Progress value={championDetail.info.magic * 10} className="h-2" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Difficulty</div>
              <Progress value={championDetail.info.difficulty * 10} className="h-2" />
            </div>
          </div>

          <Tabs defaultValue="abilities">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="abilities">Abilities</TabsTrigger>
              <TabsTrigger value="lore">Lore & Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="abilities" className="mt-4">
              <div className="space-y-4">
                {/* Passive */}
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getImageUrl('passive', championDetail.passive.image.full)} 
                        alt={championDetail.passive.name}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div>
                        <CardTitle className="text-base">Passive - {championDetail.passive.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {championDetail.passive.description}
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Spells (Q, W, E, R) */}
                {championDetail.spells.map((spell, index) => {
                  const keys = ['Q', 'W', 'E', 'R'];
                  return (
                    <Card key={spell.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={getImageUrl('spell', spell.image.full)} 
                            alt={spell.name}
                            className="w-12 h-12 rounded-lg"
                          />
                          <div>
                            <CardTitle className="text-base">
                              {keys[index]} - {spell.name}
                            </CardTitle>
                            <div className="text-xs text-muted-foreground mt-1">
                              Cooldown: {spell.cooldown[0]}s - Range: {spell.range[0]}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          {spell.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="lore" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Champion Lore</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{championDetail.lore}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ally Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {championDetail.allytips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enemy Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {championDetail.enemytips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!moduleData.championId && (
        <div className="text-center text-muted-foreground py-8">
          <p>Select a champion to view their abilities.</p>
        </div>
      )}
    </div>
  );
};

export default LolAbilityModule;

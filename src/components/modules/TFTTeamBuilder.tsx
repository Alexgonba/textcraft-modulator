
import React, { useState, useEffect } from 'react';
import { useEditor } from '../editor/EditorContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, X, Star, Shield, Swords, Dices, Settings, 
  ChevronDown, ChevronUp, Trophy 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock TFT champions data
const champions = [
  { id: 1, name: 'Ahri', cost: 4, traits: ['Spirit', 'Mage'] },
  { id: 2, name: 'Akali', cost: 4, traits: ['Ninja', 'Assassin'] },
  { id: 3, name: 'Ashe', cost: 3, traits: ['Crystal', 'Ranger'] },
  { id: 4, name: 'Azir', cost: 5, traits: ['Desert', 'Emperor', 'Summoner'] },
  { id: 5, name: 'Brand', cost: 4, traits: ['Inferno', 'Mage'] },
  { id: 6, name: 'Braum', cost: 2, traits: ['Glacial', 'Warden'] },
  { id: 7, name: 'Diana', cost: 1, traits: ['Inferno', 'Assassin'] },
  { id: 8, name: 'Dr. Mundo', cost: 3, traits: ['Poison', 'Berserker'] },
  { id: 9, name: 'Jax', cost: 2, traits: ['Light', 'Berserker'] },
  { id: 10, name: 'Karma', cost: 3, traits: ['Lunar', 'Mystic'] },
  { id: 11, name: 'Kindred', cost: 3, traits: ['Shadow', 'Ranger'] },
  { id: 12, name: 'Leona', cost: 1, traits: ['Lunar', 'Warden'] },
  { id: 13, name: 'Lucian', cost: 2, traits: ['Light', 'Soulbound'] },
  { id: 14, name: 'Lux', cost: 5, traits: ['Avatar', 'Light'] },
  { id: 15, name: 'Master Yi', cost: 5, traits: ['Mystic', 'Blademaster'] },
  { id: 16, name: 'Nautilus', cost: 3, traits: ['Ocean', 'Warden'] },
  { id: 17, name: 'Nami', cost: 5, traits: ['Ocean', 'Mystic'] },
  { id: 18, name: 'Ornn', cost: 1, traits: ['Mountain', 'Warden'] },
  { id: 19, name: 'Qiyana', cost: 3, traits: ['Qiyana', 'Assassin'] },
  { id: 20, name: 'Senna', cost: 3, traits: ['Shadow', 'Soulbound'] },
];

// Mock trait data
const traits = [
  { name: 'Assassin', levels: [3, 6], description: 'Assassins leap to the enemy backline.' },
  { name: 'Berserker', levels: [3, 6], description: 'Berserkers have a chance to hit in a cone.' },
  { name: 'Blademaster', levels: [2, 4, 6], description: 'Blademasters have a chance to strike additional times.' },
  { name: 'Crystal', levels: [2, 4], description: 'Crystal units take reduced damage.' },
  { name: 'Desert', levels: [2, 4], description: 'Desert reduces enemy armor.' },
  { name: 'Druid', levels: [2], description: 'Druids gain health regeneration.' },
  { name: 'Electric', levels: [2, 3, 4], description: 'Electric units shock nearby enemies.' },
  { name: 'Glacial', levels: [2, 4, 6], description: 'Glacial attacks have a chance to stun.' },
  { name: 'Inferno', levels: [3, 6, 9], description: 'Inferno spells burn the ground beneath them.' },
  { name: 'Light', levels: [3, 6, 9], description: 'Light units heal allies on death.' },
  { name: 'Lunar', levels: [2], description: 'Lunar units increase in power over the fight.' },
  { name: 'Mage', levels: [3, 6], description: 'Mages cast twice.' },
  { name: 'Mountain', levels: [2], description: 'Mountain units gain a shield at the start of combat.' },
  { name: 'Mystic', levels: [2, 4], description: 'Mystics provide magic resistance.' },
  { name: 'Ninja', levels: [1, 4], description: 'Ninjas gain attack damage and spell power.' },
  { name: 'Ocean', levels: [2, 4, 6], description: 'Ocean units restore mana.' },
  { name: 'Poison', levels: [3], description: 'Poison increases the mana costs of enemies.' },
  { name: 'Ranger', levels: [2, 4, 6], description: 'Rangers gain attack speed.' },
  { name: 'Shadow', levels: [2, 4], description: 'Shadow units deal increased damage when below half health.' },
  { name: 'Spirit', levels: [2], description: 'Spirits grant attack speed to allies.' },
  { name: 'Warden', levels: [2, 4, 6], description: 'Wardens gain increased armor.' },
];

// Mock items data
const items = [
  { id: 1, name: 'B.F. Sword', stats: '+10 Attack Damage' },
  { id: 2, name: 'Needlessly Large Rod', stats: '+20% Spell Power' },
  { id: 3, name: 'Recurve Bow', stats: '+15% Attack Speed' },
  { id: 4, name: 'Tear of the Goddess', stats: '+15 Starting Mana' },
  { id: 5, name: 'Chain Vest', stats: '+25 Armor' },
  { id: 6, name: 'Negatron Cloak', stats: '+25 Magic Resist' },
  { id: 7, name: 'Giant\'s Belt', stats: '+200 Health' },
  { id: 8, name: 'Spatula', stats: 'It\'s special.' },
  { id: 9, name: 'Infinity Edge', stats: '+25 Attack Damage, +25% Critical Strike Chance' },
  { id: 10, name: 'Rabadon\'s Deathcap', stats: '+50% Spell Power' },
];

interface Champion {
  id: number;
  name: string;
  cost: number;
  traits: string[];
  position?: number; // For the board position
  items?: number[]; // Item IDs
}

interface TFTTeamBuilderProps {
  blockId: string;
  moduleData: any;
}

const TFTTeamBuilder: React.FC<TFTTeamBuilderProps> = ({ blockId, moduleData }) => {
  const { updateModuleData } = useEditor();
  
  // Initialize state with moduleData or defaults
  const [selectedChampions, setSelectedChampions] = useState<Champion[]>(
    moduleData?.champions || []
  );
  const [teamName, setTeamName] = useState<string>(moduleData?.teamName || 'My TFT Team Comp');
  const [teamDescription, setTeamDescription] = useState<string>(
    moduleData?.description || 'A powerful team composition for TFT'
  );
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('champions');

  // Update module data when state changes
  useEffect(() => {
    updateModuleData(blockId, {
      champions: selectedChampions,
      teamName,
      description: teamDescription,
      synergies: calculateSynergies()
    });
  }, [selectedChampions, teamName, teamDescription, blockId, updateModuleData]);

  const calculateSynergies = () => {
    // Count occurrences of each trait
    const traitCount: Record<string, number> = {};
    
    selectedChampions.forEach(champion => {
      champion.traits.forEach(trait => {
        traitCount[trait] = (traitCount[trait] || 0) + 1;
      });
    });
    
    // Calculate active synergies
    const activeSynergies = Object.entries(traitCount).map(([trait, count]) => {
      const traitInfo = traits.find(t => t.name === trait);
      if (!traitInfo) return null;
      
      // Find highest active level
      let activeLevel = 0;
      for (let i = traitInfo.levels.length - 1; i >= 0; i--) {
        if (count >= traitInfo.levels[i]) {
          activeLevel = traitInfo.levels[i];
          break;
        }
      }
      
      return {
        name: trait,
        count,
        active: activeLevel > 0,
        activeLevel,
        nextLevel: traitInfo.levels.find(level => level > count) || null,
        description: traitInfo.description
      };
    }).filter(Boolean);
    
    return activeSynergies;
  };

  const addChampion = (champion: Champion) => {
    if (selectedChampions.length >= 10) return;
    
    // Check if champion is already added
    const existingChampionIndex = selectedChampions.findIndex(c => c.id === champion.id);
    
    if (existingChampionIndex !== -1) {
      // Champion already exists, handle duplicates
      // For simplicity, we'll just add a copy
      const newChampion = { ...champion, id: champion.id + 100 };
      setSelectedChampions([...selectedChampions, newChampion]);
    } else {
      setSelectedChampions([...selectedChampions, champion]);
    }
  };

  const removeChampion = (championId: number) => {
    setSelectedChampions(selectedChampions.filter(c => c.id !== championId));
  };

  const getCostColor = (cost: number) => {
    switch (cost) {
      case 1: return 'bg-gray-400 text-black';
      case 2: return 'bg-green-500 text-white';
      case 3: return 'bg-blue-500 text-white';
      case 4: return 'bg-purple-500 text-white';
      case 5: return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const activeSynergies = calculateSynergies();

  return (
    <Card className="w-full border-border bg-card shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Trophy size={24} className="text-yellow-500" /> 
              {teamName}
            </CardTitle>
            <CardDescription>{teamDescription}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="h-8 w-8 p-0 text-muted-foreground"
          >
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="pt-0">
          <Tabs defaultValue="champions" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="champions" className="flex items-center gap-1">
                <UserPlus size={14} /> Champions
              </TabsTrigger>
              <TabsTrigger value="synergies" className="flex items-center gap-1">
                <Shield size={14} /> Synergies
              </TabsTrigger>
              <TabsTrigger value="board" className="flex items-center gap-1">
                <Dices size={14} /> Board
              </TabsTrigger>
            </TabsList>

            <TabsContent value="champions" className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedChampions.map(champion => (
                  <Badge 
                    key={champion.id} 
                    className={`flex items-center gap-1 px-2 py-1 ${getCostColor(champion.cost)}`}
                  >
                    <span className="font-semibold">{champion.name}</span>
                    <button 
                      onClick={() => removeChampion(champion.id)}
                      className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {selectedChampions.length === 0 && (
                  <div className="text-muted-foreground italic">No champions selected yet</div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium flex justify-between items-center">
                  <span>Add Champions:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7">
                        <Settings size={14} className="mr-1" /> Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>All Champions</DropdownMenuItem>
                      <DropdownMenuItem>By Cost</DropdownMenuItem>
                      <DropdownMenuItem>By Trait</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                  {champions.map(champion => (
                    <Button
                      key={champion.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addChampion(champion)}
                      className={`h-auto text-xs justify-start p-2 ${
                        selectedChampions.some(c => c.id === champion.id) 
                          ? 'border-primary' 
                          : ''
                      }`}
                    >
                      <div className="flex flex-col items-start w-full">
                        <div className="flex justify-between w-full items-center">
                          <span className="font-medium">{champion.name}</span>
                          <Badge className={`${getCostColor(champion.cost)} text-xs px-1.5 py-0`}>
                            {champion.cost}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {champion.traits.map(trait => (
                            <span key={trait} className="text-[10px] bg-secondary px-1 rounded">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="synergies">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeSynergies.length > 0 ? (
                    activeSynergies.map(synergy => (
                      <div 
                        key={synergy.name}
                        className={`
                          p-2 rounded-md border
                          ${synergy.active 
                            ? 'border-primary bg-accent/20' 
                            : 'border-border bg-secondary/50'
                          }
                        `}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{synergy.name}</span>
                          <Badge 
                            className={`
                              ${synergy.active 
                                ? 'bg-primary/80 hover:bg-primary/90' 
                                : 'bg-secondary'
                              }
                            `}
                          >
                            {synergy.count}/{synergy.nextLevel || synergy.activeLevel}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {synergy.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground italic col-span-2">
                      No active synergies yet. Add champions to see synergies.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="board">
              <div className="space-y-4">
                <div className="tft-grid">
                  {Array.from({ length: 28 }).map((_, index) => {
                    const champion = selectedChampions.find(c => c.position === index);
                    
                    return (
                      <div 
                        key={index}
                        className={`tft-hex ${champion ? 'has-champion' : ''}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          // In a full implementation, this would handle dropping champions
                        }}
                      >
                        {champion && (
                          <div className="text-xs font-medium text-center">
                            <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${getCostColor(champion.cost)}`}>
                              {champion.name.charAt(0)}
                            </div>
                            <span className="text-xs">{champion.name}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-center text-xs text-muted-foreground italic">
                  Drag champions from your selected pool to position them on the board
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Swords size={14} />
              <span className="font-medium">{selectedChampions.length}/10 Champions</span>
            </Badge>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TFTTeamBuilder;

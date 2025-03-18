
import React from 'react';
import TFTTeamBuilder from '../../modules/TFTTeamBuilder';
import LolChampionModule from '../../modules/lol/LolChampionModule';
import LolItemModule from '../../modules/lol/LolItemModule';
import LolRuneModule from '../../modules/lol/LolRuneModule';
import LolAbilityModule from '../../modules/lol/LolAbilityModule';
import { EditorBlock } from '../types';

interface ModuleBlockProps {
  block: EditorBlock;
}

const ModuleBlock: React.FC<ModuleBlockProps> = ({ block }) => {
  const renderModule = () => {
    switch(block.moduleType) {
      case 'tft-builder':
        return <TFTTeamBuilder blockId={block.id} moduleData={block.moduleData} />;
      case 'lol-champions':
        return <LolChampionModule blockId={block.id} moduleData={block.moduleData} />;
      case 'lol-items':
        return <LolItemModule blockId={block.id} moduleData={block.moduleData} />;
      case 'lol-runes':
        return <LolRuneModule blockId={block.id} moduleData={block.moduleData} />;
      case 'lol-abilities':
        return <LolAbilityModule blockId={block.id} moduleData={block.moduleData} />;
      case 'valorant-agents':
        return <div className="p-4 bg-secondary rounded-lg text-center">Valorant Agents Guide Module (Coming Soon)</div>;
      case 'bg3-builder':
        return <div className="p-4 bg-secondary rounded-lg text-center">Baldur's Gate Character Builder (Coming Soon)</div>;
      case 'youtube':
        return <div className="p-4 bg-secondary rounded-lg text-center">YouTube Video Embed (Coming Soon)</div>;
      case 'twitch':
        return <div className="p-4 bg-secondary rounded-lg text-center">Twitch Stream Embed (Coming Soon)</div>;
      case 'instagram':
        return <div className="p-4 bg-secondary rounded-lg text-center">Instagram Post Embed (Coming Soon)</div>;
      default:
        return <div className="p-4 bg-secondary rounded-lg text-center">Unknown module type</div>;
    }
  };
  
  return renderModule();
};

export default ModuleBlock;

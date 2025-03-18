
import { useQuery } from '@tanstack/react-query';

// Interfaces for League of Legends data
export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
  };
  tags: string[];
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
}

export interface ChampionDetail extends Champion {
  lore: string;
  allytips: string[];
  enemytips: string[];
  passive: {
    name: string;
    description: string;
    image: {
      full: string;
    };
  };
  spells: {
    id: string;
    name: string;
    description: string;
    image: {
      full: string;
    };
    cooldown: number[];
    cost: number[];
    range: number[];
    tooltip: string;
  }[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  plaintext: string;
  gold: {
    base: number;
    total: number;
    sell: number;
  };
  image: {
    full: string;
  };
  tags: string[];
  stats: Record<string, number>;
}

export interface RunePath {
  id: number;
  key: string;
  name: string;
  icon: string;
  slots: {
    runes: {
      id: number;
      key: string;
      name: string;
      shortDesc: string;
      longDesc: string;
      icon: string;
    }[];
  }[];
}

const BASE_URL = 'https://ddragon.leagueoflegends.com/cdn';
let latestVersion = '14.7.1'; // Default version

// Function to get the latest version
export const fetchLatestVersion = async (): Promise<string> => {
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await response.json();
    latestVersion = versions[0];
    return latestVersion;
  } catch (error) {
    console.error('Failed to fetch latest version:', error);
    return latestVersion;
  }
};

// Use this hook to get the latest version
export const useLatestVersion = () => {
  return useQuery({
    queryKey: ['lol-version'],
    queryFn: fetchLatestVersion,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// Champions API
export const fetchChampions = async (): Promise<Champion[]> => {
  const response = await fetch(`${BASE_URL}/${latestVersion}/data/en_US/champion.json`);
  const data = await response.json();
  return Object.values(data.data) as Champion[];
};

export const useChampions = () => {
  return useQuery({
    queryKey: ['lol-champions'],
    queryFn: fetchChampions,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const fetchChampionDetail = async (championId: string): Promise<ChampionDetail> => {
  const response = await fetch(`${BASE_URL}/${latestVersion}/data/en_US/champion/${championId}.json`);
  const data = await response.json();
  return data.data[championId] as ChampionDetail;
};

export const useChampionDetail = (championId: string) => {
  return useQuery({
    queryKey: ['lol-champion', championId],
    queryFn: () => fetchChampionDetail(championId),
    enabled: !!championId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// Items API
export const fetchItems = async (): Promise<Record<string, Item>> => {
  const response = await fetch(`${BASE_URL}/${latestVersion}/data/en_US/item.json`);
  const data = await response.json();
  return data.data as Record<string, Item>;
};

export const useItems = () => {
  return useQuery({
    queryKey: ['lol-items'],
    queryFn: fetchItems,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// Runes API
export const fetchRunes = async (): Promise<RunePath[]> => {
  const response = await fetch(`${BASE_URL}/${latestVersion}/data/en_US/runesReforged.json`);
  const data = await response.json();
  return data as RunePath[];
};

export const useRunes = () => {
  return useQuery({
    queryKey: ['lol-runes'],
    queryFn: fetchRunes,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// Utility function to get image URL
export const getImageUrl = (type: 'champion' | 'item' | 'spell' | 'passive', filename: string): string => {
  switch (type) {
    case 'champion':
      return `${BASE_URL}/${latestVersion}/img/champion/${filename}`;
    case 'item':
      return `${BASE_URL}/${latestVersion}/img/item/${filename}`;
    case 'spell':
      return `${BASE_URL}/${latestVersion}/img/spell/${filename}`;
    case 'passive':
      return `${BASE_URL}/${latestVersion}/img/passive/${filename}`;
    default:
      return '';
  }
};

// Utility function to get rune image URL
export const getRuneImageUrl = (icon: string): string => {
  return `https://ddragon.leagueoflegends.com/cdn/img/${icon}`;
};

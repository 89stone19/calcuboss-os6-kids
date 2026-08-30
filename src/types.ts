export interface Teacher {
  id: string;
  name: string;
  subject: string;
  specialty: string;
  tagline: string;
  avatarType: 'nova' | 'treebo' | 'calcuboss';
  bgGradient: string;
  badgeColor: string;
  greeting: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'teacher';
  text: string;
  timestamp: string;
  cached?: boolean;
  hits?: number;
  teacherId?: string;
  subject?: string;
}

export interface CacheStats {
  subscriberCount: number;
  totalRevenue: number;
  totalQueries: number;
  savedQueries: number;
  cacheHitRate: string;
  costWithoutCache: string;
  costWithCache: string;
  netProfit: string;
  aiFuelCost: string;
}

export type AppMode = 'kids' | 'parents' | 'caching' | 'community' | 'puzzle';

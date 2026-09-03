export interface Teacher {
  id: string;
  name: string;
  subject: string;
  specialty: string;
  tagline: string;
  avatarType: 'nova' | 'treebo' | 'calcuboss' | 'music' | 'admeess' | 'demki' | 'lolers';
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
  modelUsed?: string;
  cost?: string;
  fileData?: {
    name: string;
    size: number;
    type: string;
    content?: string;
    dataUrl?: string;
  };
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  api_endpoint: string;
  pricing: {
    input_per_million: number;
    output_per_million: number;
    currency: string;
  };
  specs: {
    active_params: string;
    total_params: string;
    architecture: string;
    context_window: number;
    multimodal: boolean;
    supports_vision: boolean;
  };
  routing_rules: {
    grades: string[];
    subjects: string[];
    priority: number;
    fallback?: string;
  };
  cache_strategy: string;
  cost_optimization: string;
  status?: 'active' | 'fallback' | 'offline_vps' | 'standby';
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


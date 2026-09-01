import { AIModel } from './types';
import { PLANS, CEO_DerolWillis } from './plans';

/**
 * CALCUBOSS SCHOOL APP - R-12 ONLY - HOMEWORK HELPER (CAPS)
 * Chairman / Founder: Derol Willis
 * Scope: School kids Grade R to Grade 12 homework only.
 * Flag: PRICING-R50-R150-R200-R350-CODE-LOCKED 🚩
 */

export const SCHOOL_MODELS: Record<string, string> = {
  // Grade R - 7: Primary (Gemini 2.5 Flash Lite)
  "Grade R": "gemini-2.5-flash-lite",
  "Grade 1": "gemini-2.5-flash-lite", 
  "Grade 2": "gemini-2.5-flash-lite",
  "Grade 3": "gemini-2.5-flash-lite",
  "Grade 4": "gemini-2.5-flash-lite",
  "Grade 5": "gemini-2.5-flash-lite",
  "Grade 6": "gemini-2.5-flash-lite",
  "Grade 7 (CAPS)": "gemini-2.5-flash-lite",

  // Grade 8 - 12: Senior - Llama 4 Scout ONLY
  "Grade 8": "llama-4-scout-17b-16e-instruct",
  "Grade 9": "llama-4-scout-17b-16e-instruct",
  "Grade 10": "llama-4-scout-17b-16e-instruct",
  "Grade 11": "llama-4-scout-17b-16e-instruct",
  "Grade 12 (Matric)": "llama-4-scout-17b-16e-instruct"
};

export const AI_MODEL_REGISTRY: Record<string, AIModel> = {
  "llama-4-scout": {
    id: "llama-4-scout",
    name: "Llama 4 Scout 17B 16E Instruct",
    provider: "Groq",
    version: "llama-4-scout-17b-16e-instruct",
    api_endpoint: "https://api.groq.com/openai/v1/chat/completions",
    pricing: {
      input_per_million: 0.11,
      output_per_million: 0.34,
      currency: "USD"
    },
    specs: {
      active_params: "17B",
      total_params: "109B",
      architecture: "MoE - 16 Experts",
      context_window: 1310720,
      multimodal: true,
      supports_vision: true
    },
    routing_rules: {
      grades: ["8", "9", "10", "11", "12", "Matric"],
      subjects: ["Maths", "Natural Science", "Physical Science", "Coding & Robotics (Python/Scratch)", "English", "Afrikaans", "Life Sciences", "CAPS Homework"],
      priority: 1,
      fallback: "llama-3.2-3b-instruct"
    },
    cache_strategy: "preset-bank",
    cost_optimization: "Serve from semantic cache first - 0 tokens if cached",
    status: "active"
  },

  "gemini-2.5-flash-lite": {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    provider: "Google DeepMind",
    version: "gemini-2.5-flash-lite-001",
    api_endpoint: "https://generativelanguage.googleapis.com/v1beta",
    pricing: {
      input_per_million: 0.075,
      output_per_million: 0.30,
      currency: "USD"
    },
    specs: {
      active_params: "8B",
      total_params: "8B",
      architecture: "Dense Transformer",
      context_window: 1048576,
      multimodal: true,
      supports_vision: true
    },
    routing_rules: {
      grades: ["R", "1", "2", "3", "4", "5", "6", "7", "Primary"],
      subjects: ["Maths", "English", "Natural Science", "Life Skills", "Reading", "Afrikaans"],
      priority: 1,
      fallback: "llama-3.2-3b-instruct"
    },
    cache_strategy: "in-memory-hash + semantic",
    cost_optimization: "Free tier quota (100 calls/day) + 0 cost cache hits",
    status: "active"
  },

  "llama-3.2-3b-instruct": {
    id: "llama-3.2-3b-instruct",
    name: "Llama 3.2 3B Instruct",
    provider: "Meta / Groq",
    version: "llama-3.2-3b-instruct",
    api_endpoint: "https://api.groq.com/openai/v1/chat/completions",
    pricing: {
      input_per_million: 0.05,
      output_per_million: 0.33,
      currency: "USD"
    },
    specs: {
      active_params: "3B",
      total_params: "3B",
      architecture: "Dense Compact",
      context_window: 131072,
      multimodal: false,
      supports_vision: false
    },
    routing_rules: {
      grades: ["All School Grades (R-12)"],
      subjects: ["School Homework"],
      priority: 2,
      fallback: "tinyllama-1.1b"
    },
    cache_strategy: "fallback-cache",
    cost_optimization: "Ultra cheap $0.05/M input fallback when high tier quota reaches rate limit",
    status: "fallback"
  },

  "tinyllama-1.1b": {
    id: "tinyllama-1.1b",
    name: "TinyLlama 1.1B GGUF",
    provider: "Open Source (Local / VPS)",
    version: "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf",
    api_endpoint: "http://localhost:8080/v1/chat/completions",
    pricing: {
      input_per_million: 0.00,
      output_per_million: 0.00,
      currency: "ZAR"
    },
    specs: {
      active_params: "1.1B",
      total_params: "1.1B",
      architecture: "GGUF Quantized",
      context_window: 2048,
      multimodal: false,
      supports_vision: false
    },
    routing_rules: {
      grades: ["Grade R-7 Offline", "No-Data Areas"],
      subjects: ["School Maths", "Spelling", "Elementary Science"],
      priority: 3
    },
    cache_strategy: "local-sqlite",
    cost_optimization: "100% Offline VPS / Mobile clone execution — R0.00 data cost",
    status: "offline_vps"
  },

  "qwen2-0.5b": {
    id: "qwen2-0.5b",
    name: "Alibaba Qwen2 0.5B Instruct GGUF",
    provider: "Alibaba Cloud / Open Source",
    version: "qwen2-0_5b-instruct-q4_k_m.gguf",
    api_endpoint: "http://localhost:8081/v1/chat/completions",
    pricing: {
      input_per_million: 0.00,
      output_per_million: 0.00,
      currency: "ZAR"
    },
    specs: {
      active_params: "0.5B",
      total_params: "0.5B",
      architecture: "Micro GGUF",
      context_window: 32768,
      multimodal: false,
      supports_vision: false
    },
    routing_rules: {
      grades: ["All Offline School Learners", "Township Offline Hubs"],
      subjects: ["Quick Arithmetic", "Multilingual Translations", "School Vocabulary"],
      priority: 4
    },
    cache_strategy: "local-memory",
    cost_optimization: "Zero latency on-device / VPS lightweight micro-model",
    status: "offline_vps"
  }
};

export const CALCUBOSS_CONFIG = {
  version: "OS6.3.0-School-R12",
  appScope: "Grade R to Grade 12 Homework Only (CAPS)",
  environment: "Production + Offline VPS Hybrid",
  chairman: "Derol Willis (Founder)",
  founderEmail: "willisderol@gmail.com",
  schoolSubjects: ["Maths", "Natural Science", "Physical Science", "Coding & Robotics (Python/Scratch)", "English", "Afrikaans", "Life Sciences", "CAPS Homework"],
  defaultModelPrimary: "gemini-2.5-flash-lite",
  defaultModelSenior: "llama-4-scout",
  defaultFallback: "llama-3.2-3b-instruct",
  offlineModelPhone: "tinyllama-1.1b",
  offlineModelVps: "qwen2-0.5b",
  cachingProfitMargin: "99.6%",
  pricingTierCount: 4,
  plans: PLANS,
  founderVip: CEO_DerolWillis
};

export { PLANS, CEO_DerolWillis };


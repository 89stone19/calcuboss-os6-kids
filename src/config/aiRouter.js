const activeModelConfig = {
  primaryGateway: "openrouter",
  defaultModel: "gemini-2.5-flash-lite",
  fallbackModel: "llama-4-scout",
  apiKey: process.env.VITE_OPENROUTER_API_KEY || "",
  enableSemanticCache: true,
  maxCacheCost: 0.00
};


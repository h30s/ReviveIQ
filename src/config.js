import dotenv from 'dotenv';
dotenv.config();

export const config = {
  hubspot: {
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
    baseUrl: 'https://api.hubapi.com'
  },

  apis: {
    crunchbase: {
      apiKey: process.env.CRUNCHBASE_API_KEY,
      baseUrl: 'https://api.crunchbase.com/api/v4'
    },
    apollo: {
      apiKey: process.env.APOLLO_API_KEY,
      baseUrl: 'https://api.apollo.io/v1'
    },
    googleNews: {
      apiKey: process.env.GOOGLE_NEWS_API_KEY,
      searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
      baseUrl: 'https://www.googleapis.com/customsearch/v1'
    }
  },

  agent: {
    scanMonthsBack: parseInt(process.env.SCAN_MONTHS_BACK || '12'),
    minimumDealValue: parseInt(process.env.MINIMUM_DEAL_VALUE || '0'),
    confidenceThreshold: parseInt(process.env.CONFIDENCE_THRESHOLD || '7')
  },

  ai: {
    provider: process.env.AI_PROVIDER || 'gemini', // 'gemini' (free) or 'openrouter' (paid)
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL || 'gemini-1.5-flash',
    // OpenRouter specific (if using openrouter provider)
    openrouterModel: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet'
  }
};

export type Provider = 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek' | 'Custom';

export type ModelCategory = 'Reasoning' | 'Flagship' | 'Fast / Budget';

export interface ModelConfig {
  id: string;
  name: string;
  provider: Provider;
  inputCostPerMillion: number; // USD per 1M input tokens
  outputCostPerMillion: number; // USD per 1M output tokens
  contextWindow: number; // Maximum context tokens
  category: ModelCategory;
  isCustom?: boolean;
  description?: string;
  badge?: string;
  tokenizerFamily?: 'o200k' | 'cl100k' | 'claude' | 'gemini' | 'deepseek' | 'generic';
}

export interface TokenStats {
  tokens: number;
  characters: number;
  words: number;
  lines: number;
  readingTimeMinutes: number;
  charPerToken: number;
}

export interface ModelCostBreakdown {
  model: ModelConfig;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  isCheapest?: boolean;
  contextUsagePercent: number;
  remainingTokens: number;
  isExceeded: boolean;
}

export interface VolumeForecast {
  model: ModelConfig;
  dailyCost: number;
  monthlyCost: number;
  annualCost: number;
  monthlyInputTokens: number;
  monthlyOutputTokens: number;
  monthlyTotalTokens: number;
}

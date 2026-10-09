import { ModelConfig } from '@/types/model';

/**
 * Validated cutting-edge models snapshot from the Artificial Analysis leaderboard (2026-10-09).
 * Standardized on representative high/max first-party API configurations.
 */
export const DEFAULT_MODELS: ModelConfig[] = [
  // --- Anthropic ---
  {
    id: 'claude-opus-5-5-max',
    name: 'Claude Opus 5.5 (Max, default fallback)',
    provider: 'Anthropic',
    inputCostPerMillion: 4.00,
    outputCostPerMillion: 20.00,
    contextWindow: 1000000,
    category: 'Flagship',
    benchmarkScore: 58,
    badge: '#1 Leaderboard (58)',
    description: 'Anthropic’s top Claude 5.5 release: long-context reasoning flagship with adaptive thinking.',
    tokenizerFamily: 'claude',
  },
  {
    id: 'claude-sonnet-5-5-max',
    name: 'Claude Sonnet 5.5 (Max, default fallback)',
    provider: 'Anthropic',
    inputCostPerMillion: 2.00,
    outputCostPerMillion: 10.00,
    contextWindow: 1000000,
    category: 'Flagship',
    benchmarkScore: 56,
    badge: 'AA Index 56',
    description: 'Faster, lower-cost member of Anthropic’s 5.5 family with 1M context and 128k output ceiling.',
    tokenizerFamily: 'claude',
  },

  // --- OpenAI ---
  {
    id: 'gpt-6-astra-max',
    name: 'GPT-6 Astra (Max)',
    provider: 'OpenAI',
    inputCostPerMillion: 10.00,
    outputCostPerMillion: 50.00,
    contextWindow: 1000000,
    category: 'Flagship',
    benchmarkScore: 53,
    badge: 'AA Index 53',
    description: 'OpenAI’s high-end work and agent model with reasoning, computer-use, coding, and multimodal input.',
    tokenizerFamily: 'o200k',
  },

  // --- Google ---
  {
    id: 'gemini-4-argon-high',
    name: 'Gemini 4 Argon (High)',
    provider: 'Google',
    inputCostPerMillion: 2.00,
    outputCostPerMillion: 10.00,
    contextWindow: 1000000,
    category: 'Flagship',
    benchmarkScore: 53,
    badge: 'AA Index 53',
    description: 'Google’s frontier reasoning model with 1M-token output ceiling and introductory $2/$10 pricing.',
    tokenizerFamily: 'gemini',
  },

  // --- xAI ---
  {
    id: 'grok-4-7-xhigh',
    name: 'Grok 4.7 (Xhigh)',
    provider: 'xAI',
    inputCostPerMillion: 2.00,
    outputCostPerMillion: 6.00,
    contextWindow: 500000,
    category: 'Flagship',
    benchmarkScore: 46,
    badge: 'AA Index 46',
    description: 'xAI’s Xhigh reasoning configuration with 500k context and $2/$6 base API pricing.',
    tokenizerFamily: 'generic',
  },

  // --- Xiaomi ---
  {
    id: 'mimo-v2-6-pro-reasoning',
    name: 'MiMo-V2.6-Pro (reasoning)',
    provider: 'Xiaomi',
    inputCostPerMillion: 0.43,
    outputCostPerMillion: 0.87,
    contextWindow: 1000000,
    category: 'Reasoning',
    benchmarkScore: 46,
    badge: 'Open Weights 46',
    description: 'Xiaomi’s 1T-parameter MoE open-weights reasoning model with 42B active parameters and 1M context.',
    tokenizerFamily: 'generic',
  },

  // --- Alibaba ---
  {
    id: 'qwen3-8-max-0902',
    name: 'Qwen3.8 Max (0902)',
    provider: 'Alibaba',
    inputCostPerMillion: 2.00,
    outputCostPerMillion: 6.00,
    contextWindow: 984000,
    category: 'Reasoning',
    benchmarkScore: 45,
    badge: 'AA Index 45',
    description: 'Alibaba Cloud Model Studio reasoning flagship with 984k context and $2/$6 pricing.',
    tokenizerFamily: 'generic',
  },

  // --- Zhipu ---
  {
    id: 'glm-5-3-max',
    name: 'GLM-5.3 (Max)',
    provider: 'Zhipu',
    inputCostPerMillion: 1.40,
    outputCostPerMillion: 4.40,
    contextWindow: 1000000,
    category: 'Reasoning',
    benchmarkScore: 45,
    badge: 'AA Index 45',
    description: 'Z AI / Zhipu’s 753B MoE open-weights reasoning model with 40B active parameters and 1M context.',
    tokenizerFamily: 'generic',
  },

  // --- Moonshot ---
  {
    id: 'kimi-k3-max',
    name: 'Kimi K3 (Max)',
    provider: 'Moonshot',
    inputCostPerMillion: 3.00,
    outputCostPerMillion: 15.00,
    contextWindow: 1049000,
    category: 'Reasoning',
    benchmarkScore: 44,
    badge: 'AA Index 44',
    description: 'Moonshot AI’s open-weights reasoning flagship with ~1.049M context and adaptive thinking.',
    tokenizerFamily: 'generic',
  },

  // --- DeepSeek ---
  {
    id: 'deepseek-v4-1-flash-max',
    name: 'DeepSeek V4.1 Flash (Max)',
    provider: 'DeepSeek',
    inputCostPerMillion: 0.30,
    outputCostPerMillion: 1.20,
    contextWindow: 1000000,
    category: 'Reasoning',
    benchmarkScore: 39,
    badge: 'Price Leader (39)',
    description: 'DeepSeek’s fast open-weights reasoning model with 1M context and 552B total / 16B active parameters.',
    tokenizerFamily: 'deepseek',
  },
];

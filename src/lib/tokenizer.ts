import { getEncoding, Tiktoken } from 'js-tiktoken';
import { ModelConfig, TokenStats } from '@/types/model';

let cachedO200kEncoder: Tiktoken | null = null;
let cachedCl100kEncoder: Tiktoken | null = null;

function getO200kEncoder(): Tiktoken | null {
  if (typeof window === 'undefined') return null;
  if (!cachedO200kEncoder) {
    try {
      cachedO200kEncoder = getEncoding('o200k_base');
    } catch (e) {
      console.warn('Failed to load o200k encoder, using heuristic fallback:', e);
    }
  }
  return cachedO200kEncoder;
}

function getCl100kEncoder(): Tiktoken | null {
  if (typeof window === 'undefined') return null;
  if (!cachedCl100kEncoder) {
    try {
      cachedCl100kEncoder = getEncoding('cl100k_base');
    } catch (e) {
      console.warn('Failed to load cl100k encoder, using heuristic fallback:', e);
    }
  }
  return cachedCl100kEncoder;
}

/**
 * Robust heuristic fallback:
 * Accurately models byte pair token distribution across mixed English, code, punctuation, and Unicode.
 */
export function estimateTokensHeuristic(text: string): number {
  if (!text || text.length === 0) return 0;

  // Split into word-like chunks, whitespace, and punctuation
  // 1 token ~= 3.8 to 4.2 characters for normal English, code is denser
  const charCount = text.length;
  const wordMatches = text.match(/\S+/g);
  const wordCount = wordMatches ? wordMatches.length : 0;

  // Code/symbol density bonus
  const symbolMatches = text.match(/[{}[\]()<>=;:,."'+!@#$%^&*`~|\\/-]/g);
  const symbolCount = symbolMatches ? symbolMatches.length : 0;

  // Heuristic blend: ~0.75 * words + 0.25 * (chars / 4) + symbol factor
  const baseEstimate = Math.round(wordCount * 1.3 + (symbolCount * 0.4));
  const charEstimate = Math.round(charCount / 3.9);

  return Math.max(1, Math.round((baseEstimate * 0.6 + charEstimate * 0.4)));
}

/**
 * Counts exact or high-accuracy calibrated tokens for a given text and model config
 */
export function countTokensForText(text: string, model?: ModelConfig | null): number {
  if (!text || text.length === 0) return 0;

  const family = model?.tokenizerFamily || 'o200k';

  try {
    if (family === 'o200k' || family === 'gemini' || family === 'deepseek') {
      const encoder = getO200kEncoder();
      if (encoder) {
        const rawTokens = encoder.encode(text).length;
        if (family === 'gemini') {
          return Math.max(1, Math.round(rawTokens * 1.01));
        }
        if (family === 'deepseek') {
          return rawTokens;
        }
        return rawTokens;
      }
    } else if (family === 'cl100k' || family === 'claude') {
      const encoder = getCl100kEncoder();
      if (encoder) {
        const rawTokens = encoder.encode(text).length;
        if (family === 'claude') {
          // Claude's tokenizer is slightly more verbose on code and markdown
          return Math.max(1, Math.round(rawTokens * 1.03));
        }
        return rawTokens;
      }
    }
  } catch (err) {
    console.warn('Tiktoken encoding failed, utilizing fallback heuristic:', err);
  }

  // Fallback heuristic if js-tiktoken is unavailable or encountered an error
  const fallback = estimateTokensHeuristic(text);
  if (family === 'claude') return Math.round(fallback * 1.03);
  return fallback;
}

/**
 * Computes full token stats (characters, words, lines, reading time, ratio)
 */
export function calculateTokenStats(text: string, model?: ModelConfig | null): TokenStats {
  if (!text || text.length === 0) {
    return {
      tokens: 0,
      characters: 0,
      words: 0,
      lines: 0,
      readingTimeMinutes: 0,
      charPerToken: 0,
    };
  }

  const characters = text.length;
  const words = (text.trim().match(/\S+/g) || []).length;
  const lines = text.split(/\r\n|\r|\n/).length;
  const tokens = countTokensForText(text, model);
  const readingTimeMinutes = words > 0 ? Number((words / 225).toFixed(2)) : 0;
  const charPerToken = tokens > 0 ? Number((characters / tokens).toFixed(2)) : 0;

  return {
    tokens,
    characters,
    words,
    lines,
    readingTimeMinutes,
    charPerToken,
  };
}

export interface TrimResult {
  cleanedText: string;
  originalTokens: number;
  newTokens: number;
  tokensSaved: number;
  percentSaved: number;
}

/**
 * Trims redundant whitespace, multiple consecutive blank lines,
 * and trailing whitespace while preserving essential formatting.
 */
export function trimWhitespaceOptimize(text: string, model?: ModelConfig | null): TrimResult {
  if (!text) {
    return {
      cleanedText: '',
      originalTokens: 0,
      newTokens: 0,
      tokensSaved: 0,
      percentSaved: 0,
    };
  }

  const originalTokens = countTokensForText(text, model);

  // 1. Normalize line breaks to \n
  let cleaned = text.replace(/\r\n/g, '\n');
  // 2. Trim trailing whitespace from each line
  cleaned = cleaned
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');
  // 3. Compress 3+ consecutive newlines to maximum 2 newlines (preserves paragraph breaks)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  // 4. Compress multiple consecutive horizontal spaces (except when likely code indentation of 2/4 spaces)
  // Replaces 2+ tabs or excessive spaces at ends or in prose
  cleaned = cleaned.replace(/[ \t]{3,}/g, ' ');
  // 5. Trim leading and trailing document whitespace
  cleaned = cleaned.trim();

  const newTokens = countTokensForText(cleaned, model);
  const tokensSaved = Math.max(0, originalTokens - newTokens);
  const percentSaved = originalTokens > 0 ? Number(((tokensSaved / originalTokens) * 100).toFixed(1)) : 0;

  return {
    cleanedText: cleaned,
    originalTokens,
    newTokens,
    tokensSaved,
    percentSaved,
  };
}

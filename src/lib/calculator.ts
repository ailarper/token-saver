import { ModelConfig, ModelCostBreakdown, VolumeForecast } from '@/types/model';

/**
 * Calculates single-call costs and context headroom across models
 */
export function calculateModelCosts(
  models: ModelConfig[],
  inputTokens: number,
  outputTokens: number
): ModelCostBreakdown[] {
  const breakdowns: ModelCostBreakdown[] = models.map((model) => {
    const inputCost = (inputTokens / 1_000_000) * model.inputCostPerMillion;
    const outputCost = (outputTokens / 1_000_000) * model.outputCostPerMillion;
    const totalCost = inputCost + outputCost;
    const contextUsagePercent = model.contextWindow > 0 
      ? Math.min(100, Number(((inputTokens / model.contextWindow) * 100).toFixed(2)))
      : 0;
    const remainingTokens = Math.max(0, model.contextWindow - inputTokens);
    const isExceeded = inputTokens > model.contextWindow;

    return {
      model,
      inputCost,
      outputCost,
      totalCost,
      contextUsagePercent,
      remainingTokens,
      isExceeded,
    };
  });

  // Determine cheapest model (ignoring models that exceeded context limit unless all exceeded)
  const validModels = breakdowns.filter((b) => !b.isExceeded);
  const candidatePool = validModels.length > 0 ? validModels : breakdowns;

  let minCost = Infinity;
  let cheapestId = '';

  for (const b of candidatePool) {
    if (b.totalCost < minCost) {
      minCost = b.totalCost;
      cheapestId = b.model.id;
    }
  }

  return breakdowns.map((b) => ({
    ...b,
    isCheapest: b.model.id === cheapestId && b.totalCost > 0,
  }));
}

/**
 * Calculates daily, monthly, and annual billing forecasts
 */
export function calculateVolumeForecasts(
  models: ModelConfig[],
  inputTokens: number,
  avgOutputTokens: number,
  dailyCalls: number
): VolumeForecast[] {
  const effectiveInput = Math.max(1, inputTokens);
  const effectiveOutput = Math.max(1, avgOutputTokens);
  const effectiveCalls = Math.max(1, dailyCalls);

  const dailyInputTokens = effectiveInput * effectiveCalls;
  const dailyOutputTokens = effectiveOutput * effectiveCalls;

  const monthlyInputTokens = dailyInputTokens * 30;
  const monthlyOutputTokens = dailyOutputTokens * 30;
  const monthlyTotalTokens = monthlyInputTokens + monthlyOutputTokens;

  return models.map((model) => {
    const dailyCost =
      ((dailyInputTokens * model.inputCostPerMillion) +
        (dailyOutputTokens * model.outputCostPerMillion)) /
      1_000_000;
    const monthlyCost = dailyCost * 30;
    const annualCost = dailyCost * 365;

    return {
      model,
      dailyCost,
      monthlyCost,
      annualCost,
      monthlyInputTokens,
      monthlyOutputTokens,
      monthlyTotalTokens,
    };
  });
}

/**
 * Formats a currency value with appropriate precision
 */
export function formatCurrency(amount: number): string {
  if (amount === 0) return '$0.00';
  if (amount < 0.0001) {
    return `$${amount.toFixed(6)}`;
  }
  if (amount < 0.01) {
    return `$${amount.toFixed(4)}`;
  }
  if (amount < 10) {
    return `$${amount.toFixed(3)}`;
  }
  if (amount < 1_000) {
    return `$${amount.toFixed(2)}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats token count with K, M, or B suffixes
 */
export function formatTokenCount(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1)}K`;
  }
  return num.toLocaleString();
}

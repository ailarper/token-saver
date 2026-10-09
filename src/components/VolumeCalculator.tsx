'use client';

import React, { useState } from 'react';
import { ModelConfig } from '@/types/model';
import {
  calculateVolumeForecasts,
  formatCurrency,
  formatTokenCount,
} from '@/lib/calculator';
import {
  Calculator,
  Sliders,
  Clock,
  TrendingDown,
  Copy,
  Check,
} from 'lucide-react';

interface VolumeCalculatorProps {
  allModels: ModelConfig[];
  promptTokens: number;
}

const CALL_PRESETS = [100, 1000, 5000, 10000, 25000, 50000, 100000];

export function VolumeCalculator({ allModels, promptTokens }: VolumeCalculatorProps) {
  const [dailyCalls, setDailyCalls] = useState<number>(5000);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(600);
  const [copied, setCopied] = useState<boolean>(false);

  const inputTokensPerCall = Math.max(1, promptTokens || 800);

  const forecasts = calculateVolumeForecasts(
    allModels,
    inputTokensPerCall,
    avgOutputTokens,
    dailyCalls
  );

  // Sort by monthly cost ascending
  const sortedForecasts = [...forecasts].sort((a, b) => a.monthlyCost - b.monthlyCost);
  const cheapest = sortedForecasts[0];
  const mostExpensive = sortedForecasts[sortedForecasts.length - 1];
  const monthlySavingsPotential = mostExpensive && cheapest
    ? mostExpensive.monthlyCost - cheapest.monthlyCost
    : 0;

  // Total tokens per month
  const monthlyInputTotal = inputTokensPerCall * dailyCalls * 30;
  const monthlyOutputTotal = avgOutputTokens * dailyCalls * 30;
  const monthlyGrandTotal = monthlyInputTotal + monthlyOutputTotal;

  const handleCopySummary = async () => {
    const text = `## TokenSaver Volume & API Cost Forecast
- Daily API Calls: ${dailyCalls.toLocaleString()}
- Prompt Tokens / Call: ${inputTokensPerCall.toLocaleString()}
- Output Tokens / Call: ${avgOutputTokens.toLocaleString()}
- Total Monthly Tokens: ${formatTokenCount(monthlyGrandTotal)}

### Estimated Monthly Bills:
${sortedForecasts
  .map(
    (f) =>
      `- ${f.model.name} (${f.model.provider}): ${formatCurrency(f.monthlyCost)}/mo | ${formatCurrency(f.annualCost)}/yr`
  )
  .join('\n')}
`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  return (
    <div className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md p-5 shadow-2xl transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-800/60 border border-white/[0.08] text-violet-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              Monthly Scale & Production Volume Forecaster
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Simulate cloud API burn across Daily, Monthly, and Annual run-rates
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-750 border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition active:scale-95 shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied Markdown</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copy Forecast</span>
            </>
          )}
        </button>
      </div>

      {/* Sliders & Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-b border-white/[0.06]">
        {/* Daily API Calls Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-violet-400" />
              <span>Daily API Calls:</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="10"
                max="100000"
                step="100"
                value={dailyCalls}
                onChange={(e) => setDailyCalls(Math.max(1, Number(e.target.value)))}
                className="w-24 px-2 py-0.5 rounded bg-black/40 border border-white/[0.08] text-right font-mono tabular-nums text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
              <span className="text-xs text-zinc-500 font-mono">req/d</span>
            </div>
          </div>

          <input
            type="range"
            min="10"
            max="100000"
            step="100"
            value={dailyCalls}
            onChange={(e) => setDailyCalls(Number(e.target.value))}
            className="w-full cursor-pointer"
          />

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-zinc-500 font-mono uppercase">Presets:</span>
            {CALL_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDailyCalls(preset)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition tabular-nums ${
                  dailyCalls === preset
                    ? 'bg-violet-950/60 text-violet-300 border border-violet-500/40'
                    : 'bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 border border-white/[0.06]'
                }`}
              >
                {preset >= 1000 ? `${preset / 1000}k` : preset}
              </button>
            ))}
          </div>
        </div>

        {/* Avg Output Tokens Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-violet-400" />
              <span>Average Output Tokens:</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="100"
                max="4000"
                step="50"
                value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Math.max(50, Number(e.target.value)))}
                className="w-20 px-2 py-0.5 rounded bg-black/40 border border-white/[0.08] text-right font-mono tabular-nums text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
              <span className="text-xs text-zinc-500 font-mono">tokens</span>
            </div>
          </div>

          <input
            type="range"
            min="100"
            max="4000"
            step="50"
            value={avgOutputTokens}
            onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
            className="w-full cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-0.5">
            <span>Input: <strong className="tabular-nums text-zinc-400">{inputTokensPerCall.toLocaleString()}</strong> tok/call</span>
            <span>Output: <strong className="tabular-nums text-zinc-400">{avgOutputTokens.toLocaleString()}</strong> tok/call</span>
          </div>
        </div>
      </div>

      {/* Monthly Volume Stats Banner in Raycast Card Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
          <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
            Monthly Ingestion (Prompt)
          </span>
          <div className="text-sm sm:text-base font-semibold text-zinc-200 font-mono tabular-nums mt-0.5">
            {formatTokenCount(monthlyInputTotal)} tokens
          </div>
          <span className="text-[11px] text-zinc-500 font-mono tabular-nums">
            {(dailyCalls * 30).toLocaleString()} reqs/mo
          </span>
        </div>

        <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
          <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">
            Monthly Generation (Output)
          </span>
          <div className="text-sm sm:text-base font-semibold text-violet-300 font-mono tabular-nums mt-0.5">
            {formatTokenCount(monthlyOutputTotal)} tokens
          </div>
          <span className="text-[11px] text-zinc-500 font-mono tabular-nums">
            Avg {avgOutputTokens} tokens/completion
          </span>
        </div>

        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Monthly Spread Potential
          </span>
          <div className="text-sm sm:text-base font-semibold text-emerald-400 font-mono tabular-nums mt-0.5">
            Save {formatCurrency(monthlySavingsPotential)} / mo
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono line-clamp-1">
            Cheapest ({cheapest?.model.name}) vs Premium ({mostExpensive?.model.name})
          </span>
        </div>
      </div>

      {/* Comparative Monthly Billing Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-zinc-500 uppercase font-mono text-[11px] tracking-wider">
              <th className="py-2.5 px-3">Model</th>
              <th className="py-2.5 px-3">Provider</th>
              <th className="py-2.5 px-3">Daily Burn</th>
              <th className="py-2.5 px-3">Monthly Bill (30 Days)</th>
              <th className="py-2.5 px-3 text-right">Annual Run-Rate (365 Days)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] font-mono">
            {sortedForecasts.map((f, index) => {
              const isCheapest = index === 0;
              return (
                <tr
                  key={f.model.id}
                  className={`hover:bg-zinc-850/40 transition-colors ${
                    isCheapest ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs sm:text-sm text-zinc-200">{f.model.name}</span>
                      {isCheapest && (
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                          Lowest Cost
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400 font-sans">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/50 text-[10px] font-mono">
                      {f.model.provider}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-zinc-300">
                    {formatCurrency(f.dailyCost)}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums font-semibold text-zinc-100">
                    <span className={isCheapest ? 'text-emerald-400' : 'text-zinc-100'}>
                      {formatCurrency(f.monthlyCost)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-right font-semibold text-zinc-200">
                    {formatCurrency(f.annualCost)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

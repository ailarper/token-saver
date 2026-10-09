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
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Monthly Scale & Production Volume Forecaster
            </h2>
            <p className="text-xs text-slate-400">
              Simulate enterprise workload expenses across Daily, Monthly, and Annual horizons
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition active:scale-95 shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">Copied Markdown!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Copy Forecast</span>
            </>
          )}
        </button>
      </div>

      {/* Sliders & Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5 border-b border-slate-800/80">
        {/* Daily API Calls Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Daily API Calls</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="10"
                max="100000"
                step="100"
                value={dailyCalls}
                onChange={(e) => setDailyCalls(Math.max(1, Number(e.target.value)))}
                className="w-24 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-right font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <span className="text-xs text-slate-400 font-mono">reqs/day</span>
            </div>
          </div>

          <input
            type="range"
            min="10"
            max="100000"
            step="100"
            value={dailyCalls}
            onChange={(e) => setDailyCalls(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Presets:</span>
            {CALL_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDailyCalls(preset)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  dailyCalls === preset
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {preset >= 1000 ? `${preset / 1000}k` : preset}
              </button>
            ))}
          </div>
        </div>

        {/* Avg Output Tokens Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Average Output Tokens per Call</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="100"
                max="4000"
                step="50"
                value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Math.max(50, Number(e.target.value)))}
                className="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-right font-mono text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <span className="text-xs text-slate-400 font-mono">tokens</span>
            </div>
          </div>

          <input
            type="range"
            min="100"
            max="4000"
            step="50"
            value={avgOutputTokens}
            onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span>Input: {inputTokensPerCall.toLocaleString()} tokens/req</span>
            <span>Output: {avgOutputTokens.toLocaleString()} tokens/req</span>
          </div>
        </div>
      </div>

      {/* Monthly Volume Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
            Monthly Ingestion (Prompt)
          </span>
          <div className="text-base font-bold text-slate-200 font-mono mt-1">
            {formatTokenCount(monthlyInputTotal)} tokens
          </div>
          <span className="text-[11px] text-slate-500">
            {(dailyCalls * 30).toLocaleString()} total requests/mo
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
            Monthly Generation (Output)
          </span>
          <div className="text-base font-bold text-cyan-300 font-mono mt-1">
            {formatTokenCount(monthlyOutputTotal)} tokens
          </div>
          <span className="text-[11px] text-slate-500">
            Avg {avgOutputTokens} tokens/completion
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
          <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Max Monthly Arbitrage Spread
          </span>
          <div className="text-base font-bold text-emerald-300 font-mono mt-1">
            Save {formatCurrency(monthlySavingsPotential)} / mo
          </div>
          <span className="text-[11px] text-emerald-400/80">
            Cheapest ({cheapest?.model.name}) vs Premium ({mostExpensive?.model.name})
          </span>
        </div>
      </div>

      {/* Comparative Monthly Billing Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px] tracking-wider">
              <th className="py-3 px-3">Model</th>
              <th className="py-3 px-3">Provider</th>
              <th className="py-3 px-3">Daily Burn</th>
              <th className="py-3 px-3">Monthly Bill (30 Days)</th>
              <th className="py-3 px-3 text-right">Annual Run-Rate (365 Days)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 font-mono">
            {sortedForecasts.map((f, index) => {
              const isCheapest = index === 0;
              return (
                <tr
                  key={f.model.id}
                  className={`hover:bg-slate-850/50 transition-colors ${
                    isCheapest ? 'bg-emerald-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100">{f.model.name}</span>
                      {isCheapest && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase">
                          Lowest Cost
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                      {f.model.provider}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {formatCurrency(f.dailyCost)}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-100">
                    <span className={isCheapest ? 'text-emerald-300' : 'text-slate-100'}>
                      {formatCurrency(f.monthlyCost)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-200">
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

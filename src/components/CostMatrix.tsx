'use client';

import React, { useState, useMemo } from 'react';
import { ModelConfig, Provider } from '@/types/model';
import { calculateModelCosts, formatCurrency, formatTokenCount } from '@/lib/calculator';
import { deleteCustomModel } from '@/lib/storage';
import {
  Layers,
  Plus,
  Trash2,
  Sliders,
  CheckCircle2,
  ArrowUpDown,
  TrendingDown,
  Info,
  Award,
} from 'lucide-react';

interface CostMatrixProps {
  allModels: ModelConfig[];
  selectedModel: ModelConfig;
  onSelectModel: (model: ModelConfig) => void;
  inputTokens: number;
  outputTokens: number;
  onOutputTokensChange: (val: number) => void;
  onOpenCustomModal: () => void;
  onModelDeleted?: () => void;
}

export function CostMatrix({
  allModels,
  selectedModel,
  onSelectModel,
  inputTokens,
  outputTokens,
  onOutputTokensChange,
  onOpenCustomModal,
  onModelDeleted,
}: CostMatrixProps) {
  const [providerFilter, setProviderFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'total' | 'input' | 'output' | 'context' | 'score'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dynamically compute available providers from all active models
  const availableProviders = useMemo(() => {
    const list: (Provider | 'All')[] = ['All'];
    const seen = new Set<string>();
    for (const m of allModels) {
      if (m.isCustom) {
        seen.add('Custom');
      } else if (m.provider) {
        seen.add(m.provider);
      }
    }
    for (const p of seen) {
      list.push(p as Provider);
    }
    return list;
  }, [allModels]);

  // Filter models
  const filteredModels = allModels.filter((model) => {
    if (providerFilter !== 'All') {
      if (providerFilter === 'Custom' && !model.isCustom) return false;
      if (providerFilter !== 'Custom' && model.provider !== providerFilter) return false;
    }
    if (categoryFilter !== 'All' && model.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  // Calculate pricing breakdowns
  const breakdowns = calculateModelCosts(filteredModels, inputTokens, outputTokens);

  // Sort breakdowns
  const sortedBreakdowns = [...breakdowns].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'total') {
      diff = a.totalCost - b.totalCost;
    } else if (sortBy === 'input') {
      diff = a.model.inputCostPerMillion - b.model.inputCostPerMillion;
    } else if (sortBy === 'output') {
      diff = a.model.outputCostPerMillion - b.model.outputCostPerMillion;
    } else if (sortBy === 'context') {
      diff = a.model.contextWindow - b.model.contextWindow;
    } else if (sortBy === 'score') {
      diff = (a.model.benchmarkScore || 0) - (b.model.benchmarkScore || 0);
    }
    return sortOrder === 'asc' ? diff : -diff;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this custom model?')) {
      deleteCustomModel(id);
      if (onModelDeleted) onModelDeleted();
    }
  };

  const categories = ['All', 'Flagship', 'Reasoning', 'Fast / Budget'];

  return (
    <div className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md p-5 shadow-2xl transition-all">
      {/* Top Header & Output Slider */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-800/60 border border-white/[0.08] text-violet-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              Cost Matrix & Single-Call Pricing
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Live calculation: <span className="tabular-nums text-zinc-400">{inputTokens.toLocaleString()} in</span> +{' '}
              <span className="tabular-nums text-zinc-400">{outputTokens.toLocaleString()} out</span> tokens
            </p>
          </div>
        </div>

        {/* Output Token Slider & Add Custom Button */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.08] w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <Sliders className="w-3 h-3 text-violet-400" />
              <span>Output:</span>
            </div>
            <input
              type="range"
              min="50"
              max="4000"
              step="50"
              value={outputTokens}
              onChange={(e) => onOutputTokensChange(Number(e.target.value))}
              className="w-24 sm:w-32 cursor-pointer"
            />
            <span className="text-xs font-mono tabular-nums font-semibold text-violet-300 min-w-[50px]">
              {outputTokens.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenCustomModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-medium text-white shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Model</span>
          </button>
        </div>
      </div>

      {/* Dynamic Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 border-b border-white/[0.06]">
        {/* Dynamic Provider Filters with Horizontal Scroll on Mobile */}
        <div className="w-full sm:w-auto overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {availableProviders.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProviderFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition whitespace-nowrap shrink-0 ${
                  providerFilter === p
                    ? 'bg-violet-950/60 text-violet-300 border border-violet-500/40 shadow-sm'
                    : 'bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:bg-zinc-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition ${
                categoryFilter === cat
                  ? 'bg-zinc-800 text-zinc-100 font-medium border border-zinc-700/60'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Matrix Table with strict font-mono tabular-nums */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-zinc-500 uppercase font-mono text-[11px] tracking-wider">
              <th className="py-2.5 px-3">Model</th>
              <th className="py-2.5 px-3">Provider</th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-violet-300 transition"
                onClick={() => {
                  setSortBy('score');
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                }}
                title="Sort by Artificial Analysis Intelligence Index"
              >
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>AA Index</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-violet-300 transition"
                onClick={() => {
                  setSortBy('context');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Context Cap</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-violet-300 transition"
                onClick={() => {
                  setSortBy('input');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Input / 1M</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-violet-300 transition"
                onClick={() => {
                  setSortBy('output');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Output / 1M</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-2.5 px-3">Per Call (In + Out)</th>
              <th
                className="py-2.5 px-3 text-right cursor-pointer hover:text-violet-300 transition"
                onClick={() => {
                  setSortBy('total');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Total Single Call</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {sortedBreakdowns.map((b) => {
              const isSelected = selectedModel.id === b.model.id;
              return (
                <tr
                  key={b.model.id}
                  onClick={() => onSelectModel(b.model)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-violet-950/20 hover:bg-violet-950/30'
                      : 'hover:bg-zinc-850/40'
                  }`}
                >
                  {/* Model Name & Badges */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium text-xs sm:text-sm ${
                              isSelected ? 'text-violet-300 font-semibold' : 'text-zinc-200'
                            }`}
                          >
                            {b.model.name}
                          </span>
                          {b.isCheapest && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                              <TrendingDown className="w-3 h-3" />
                              Best Value
                            </span>
                          )}
                          {b.model.isCustom && (
                            <span className="px-1.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/50 text-[10px] font-mono text-zinc-300">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                          {b.model.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Provider */}
                  <td className="py-3 px-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                      {b.model.provider}
                    </span>
                  </td>

                  {/* Benchmark Quality Score (AA Index) */}
                  <td className="py-3 px-3 font-mono tabular-nums">
                    {b.model.benchmarkScore !== undefined ? (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-300">
                        {b.model.benchmarkScore}
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Context Window */}
                  <td className="py-3 px-3 font-mono tabular-nums text-zinc-300">
                    <div className="flex flex-col">
                      <span>{formatTokenCount(b.model.contextWindow)}</span>
                      {b.isExceeded ? (
                        <span className="text-[10px] text-rose-400 font-semibold">Exceeded</span>
                      ) : (
                        <span className="text-[10px] text-zinc-500">
                          {b.contextUsagePercent.toFixed(1)}% used
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Input Cost per 1M */}
                  <td className="py-3 px-3 font-mono tabular-nums text-zinc-300">
                    ${b.model.inputCostPerMillion.toFixed(2)}
                  </td>

                  {/* Output Cost per 1M */}
                  <td className="py-3 px-3 font-mono tabular-nums text-zinc-300">
                    ${b.model.outputCostPerMillion.toFixed(2)}
                  </td>

                  {/* Single Call Breakdown */}
                  <td className="py-3 px-3 font-mono tabular-nums text-zinc-400 text-[11px]">
                    <div>
                      In: <span className="text-zinc-300">{formatCurrency(b.inputCost)}</span>
                    </div>
                    <div>
                      Out: <span className="text-zinc-300">{formatCurrency(b.outputCost)}</span>
                    </div>
                  </td>

                  {/* Total Single Call Cost */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-mono tabular-nums font-semibold text-xs sm:text-sm ${
                            b.isCheapest ? 'text-emerald-400' : 'text-zinc-100'
                          }`}
                        >
                          {formatCurrency(b.totalCost)}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-violet-400 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>

                      {b.model.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(b.model.id, e)}
                          title="Delete custom model"
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedBreakdowns.length === 0 && (
        <div className="py-10 text-center text-zinc-500 text-xs font-mono">
          No models found matching the selected filters.
        </div>
      )}

      {/* Footnote on Pricing Accuracy */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-zinc-500 font-mono">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Click row to select active context model. AA Index from Artificial Analysis.</span>
        </div>
        <span>Representative first-party API rates</span>
      </div>
    </div>
  );
}

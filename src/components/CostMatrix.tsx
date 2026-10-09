'use client';

import React, { useState } from 'react';
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
  const [sortBy, setSortBy] = useState<'total' | 'input' | 'output' | 'context'>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const providers: (Provider | 'All')[] = [
    'All',
    'OpenAI',
    'Anthropic',
    'Google',
    'DeepSeek',
    'Custom',
  ];

  const categories = ['All', 'Reasoning', 'Flagship', 'Fast / Budget'];

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-5 shadow-2xl">
      {/* Top Header & Output Slider */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Multi-Model Cost Matrix & Single Call Pricing
            </h2>
            <p className="text-xs text-slate-400">
              Live calculation based on {inputTokens.toLocaleString()} input tokens + {outputTokens.toLocaleString()} output tokens
            </p>
          </div>
        </div>

        {/* Output Token Slider & Add Custom Button */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Output Tokens:</span>
            </div>
            <input
              type="range"
              min="50"
              max="4000"
              step="50"
              value={outputTokens}
              onChange={(e) => onOutputTokensChange(Number(e.target.value))}
              className="w-28 accent-cyan-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-semibold text-cyan-300 min-w-[50px]">
              {outputTokens.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenCustomModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-semibold text-white shadow-lg shadow-cyan-950 transition active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Model</span>
          </button>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-slate-800/60">
        {/* Provider Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {providers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProviderFilter(p)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                providerFilter === p
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:bg-slate-850'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-xs transition ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-white font-medium border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Matrix Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px] tracking-wider">
              <th className="py-3 px-3">Model</th>
              <th className="py-3 px-3">Provider</th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-cyan-300 transition"
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
                className="py-3 px-3 cursor-pointer hover:text-cyan-300 transition"
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
                className="py-3 px-3 cursor-pointer hover:text-cyan-300 transition"
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
              <th className="py-3 px-3">Single Call (In + Out)</th>
              <th
                className="py-3 px-3 text-right cursor-pointer hover:text-cyan-300 transition"
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
          <tbody className="divide-y divide-slate-800/50">
            {sortedBreakdowns.map((b) => {
              const isSelected = selectedModel.id === b.model.id;
              return (
                <tr
                  key={b.model.id}
                  onClick={() => onSelectModel(b.model)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/30 hover:bg-cyan-950/40'
                      : 'hover:bg-slate-850/50'
                  }`}
                >
                  {/* Model Name & Badges */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-sm ${
                              isSelected ? 'text-cyan-300 font-bold' : 'text-slate-100'
                            }`}
                          >
                            {b.model.name}
                          </span>
                          {b.isCheapest && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 uppercase tracking-wider shadow-sm">
                              <TrendingDown className="w-3 h-3" />
                              Best Value
                            </span>
                          )}
                          {b.model.isCustom && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-[10px] text-purple-300">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {b.model.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Provider */}
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                      {b.model.provider}
                    </span>
                  </td>

                  {/* Context Window */}
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    <div className="flex flex-col">
                      <span>{formatTokenCount(b.model.contextWindow)}</span>
                      {b.isExceeded ? (
                        <span className="text-[10px] text-rose-400 font-semibold">Exceeded!</span>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          {b.contextUsagePercent.toFixed(1)}% used
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Input Cost per 1M */}
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    ${b.model.inputCostPerMillion.toFixed(2)}
                  </td>

                  {/* Output Cost per 1M */}
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    ${b.model.outputCostPerMillion.toFixed(2)}
                  </td>

                  {/* Single Call Breakdown */}
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                    <div>
                      In: <span className="text-slate-300">{formatCurrency(b.inputCost)}</span>
                    </div>
                    <div>
                      Out: <span className="text-slate-300">{formatCurrency(b.outputCost)}</span>
                    </div>
                  </td>

                  {/* Total Single Call Cost */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-mono font-bold text-sm ${
                            b.isCheapest ? 'text-emerald-300' : 'text-slate-100'
                          }`}
                        >
                          {formatCurrency(b.totalCost)}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Active Model
                          </span>
                        )}
                      </div>

                      {b.model.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(b.model.id, e)}
                          title="Delete custom model"
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition ml-1"
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
        <div className="py-12 text-center text-slate-500 text-xs">
          No models found matching the selected filters.
        </div>
      )}

      {/* Footnote on Pricing Accuracy */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Click any row to select as the benchmark context window model.</span>
        </div>
        <span>Official standard API tiers without batch discounts</span>
      </div>
    </div>
  );
}

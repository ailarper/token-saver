'use client';

import React from 'react';
import { ModelConfig } from '@/types/model';
import { formatTokenCount } from '@/lib/calculator';
import { AlertTriangle, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

interface ContextGaugeProps {
  selectedModel: ModelConfig;
  allModels: ModelConfig[];
  onSelectModel: (model: ModelConfig) => void;
  inputTokens: number;
  outputTokens: number;
}

export function ContextGauge({
  selectedModel,
  allModels,
  onSelectModel,
  inputTokens,
  outputTokens,
}: ContextGaugeProps) {
  const maxContext = selectedModel.contextWindow;
  const inputPercentage = maxContext > 0 ? (inputTokens / maxContext) * 100 : 0;
  const outputPercentage = maxContext > 0 ? (outputTokens / maxContext) * 100 : 0;

  const remainingTokens = Math.max(0, maxContext - inputTokens - outputTokens);
  const isInputExceeded = inputTokens > maxContext;
  const isTotalExceeded = inputTokens + outputTokens > maxContext;

  // Status calculation
  let statusColor = 'text-emerald-400';
  let barGradient = 'from-emerald-500 to-teal-400';
  let glowColor = 'shadow-[0_0_15px_rgba(16,185,129,0.25)]';
  let statusBadge = {
    label: 'Safe Headroom',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300',
  };

  if (isInputExceeded || isTotalExceeded || inputPercentage >= 80) {
    statusColor = 'text-rose-400';
    barGradient = 'from-rose-500 to-red-600';
    glowColor = 'shadow-[0_0_15px_rgba(244,63,94,0.35)]';
    statusBadge = {
      label: isTotalExceeded ? 'Exceeds Context Window' : 'Truncation Danger (>80%)',
      icon: ShieldAlert,
      badgeClass: 'bg-rose-950/60 border-rose-500/30 text-rose-300',
    };
  } else if (inputPercentage >= 50) {
    statusColor = 'text-amber-400';
    barGradient = 'from-amber-500 to-yellow-500';
    glowColor = 'shadow-[0_0_15px_rgba(245,158,11,0.25)]';
    statusBadge = {
      label: 'Warning (50% - 80%)',
      icon: AlertTriangle,
      badgeClass: 'bg-amber-950/60 border-amber-500/30 text-amber-300',
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-5 shadow-xl transition-all">
      {/* Header with Model Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 text-cyan-400 shadow-inner">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Active Context Benchmark
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                {selectedModel.provider}
              </span>
            </div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              {selectedModel.name}
              <span className="text-xs font-normal text-slate-400 font-mono">
                ({formatTokenCount(maxContext)} max context)
              </span>
            </h3>
          </div>
        </div>

        {/* Quick Model Dropdown & Status */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={selectedModel.id}
            onChange={(e) => {
              const target = allModels.find((m) => m.id === e.target.value);
              if (target) onSelectModel(target);
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {allModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.provider}) - {formatTokenCount(m.contextWindow)}
              </option>
            ))}
          </select>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadge.badgeClass}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{statusBadge.label}</span>
          </div>
        </div>
      </div>

      {/* Progress Gauge Bar */}
      <div className="mt-5 space-y-2">
        <div className="flex justify-between items-baseline text-xs font-mono">
          <span className="text-slate-400">
            Utilization:{' '}
            <strong className={`font-semibold ${statusColor}`}>
              {inputPercentage.toFixed(1)}%
            </strong>{' '}
            (Prompt) + <span className="text-slate-300">{outputPercentage.toFixed(1)}% (Output)</span>
          </span>
          <span className="text-slate-400">
            Total Cap:{' '}
            <strong className="text-white">{formatTokenCount(maxContext)} tokens</strong>
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-4 w-full rounded-full bg-slate-950 border border-slate-800 p-0.5 overflow-hidden flex relative shadow-inner">
          {/* Input tokens segment */}
          <div
            style={{ width: `${Math.min(100, inputPercentage)}%` }}
            className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-300 ${glowColor}`}
          />
          {/* Output tokens projected segment */}
          <div
            style={{ width: `${Math.min(100 - Math.min(100, inputPercentage), outputPercentage)}%` }}
            className="h-full bg-cyan-600/70 opacity-80 border-l border-slate-900 transition-all duration-300"
            title={`Projected Output: ${outputTokens.toLocaleString()} tokens`}
          />

          {/* 50% & 80% guide notches */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-700/60 pointer-events-none" />
          <div className="absolute left-[80%] top-0 bottom-0 w-[1px] bg-rose-500/40 pointer-events-none" />
        </div>

        {/* Legend & Remaining Headroom */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Prompt ({inputTokens.toLocaleString()} tokens)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 inline-block" />
              Estimated Output ({outputTokens.toLocaleString()} tokens)
            </span>
          </div>

          <div className="font-mono text-xs">
            <span className="text-slate-400">Remaining Headroom: </span>
            <span
              className={`font-semibold ${
                remainingTokens === 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {remainingTokens.toLocaleString()} tokens
            </span>
          </div>
        </div>
      </div>

      {/* Overflow warning banner if exceeded */}
      {isInputExceeded && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-start gap-3 text-rose-200 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-100">
              Context Window Truncation Guaranteed!
            </p>
            <p className="text-rose-300/90 mt-0.5">
              Your prompt has {inputTokens.toLocaleString()} tokens, exceeding {selectedModel.name}&apos;s limit of {maxContext.toLocaleString()} tokens. 
              The provider will reject the request or truncate critical instructions. Consider switching to Gemini 2.0 Flash (1M) or Gemini 1.5 Pro (2M).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

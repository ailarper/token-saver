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
  let glowColor = 'shadow-[0_0_12px_rgba(16,185,129,0.3)]';
  let statusBadge = {
    label: 'Headroom Safe',
    icon: CheckCircle2,
    badgeClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  if (isInputExceeded || isTotalExceeded || inputPercentage >= 80) {
    statusColor = 'text-rose-400';
    barGradient = 'from-rose-500 to-red-600';
    glowColor = 'shadow-[0_0_12px_rgba(244,63,94,0.35)]';
    statusBadge = {
      label: isTotalExceeded ? 'Exceeds Window' : 'Danger (>80%)',
      icon: ShieldAlert,
      badgeClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    };
  } else if (inputPercentage >= 50) {
    statusColor = 'text-amber-400';
    barGradient = 'from-amber-500 to-yellow-500';
    glowColor = 'shadow-[0_0_12px_rgba(245,158,11,0.25)]';
    statusBadge = {
      label: 'Warning (50-80%)',
      icon: AlertTriangle,
      badgeClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md p-5 shadow-xl transition-all">
      {/* Header with Model Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-800/60 border border-white/[0.08] text-violet-400 shadow-inner">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                Context Benchmark
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                {selectedModel.provider}
              </span>
              {selectedModel.benchmarkScore !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  AA {selectedModel.benchmarkScore}
                </span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mt-0.5">
              {selectedModel.name}
              <span className="text-xs font-normal text-zinc-500 font-mono tabular-nums">
                ({formatTokenCount(maxContext)} max)
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
            className="bg-black/40 border border-white/[0.08] text-zinc-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          >
            {allModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.provider}) - {formatTokenCount(m.contextWindow)}
              </option>
            ))}
          </select>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-medium ${statusBadge.badgeClass}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{statusBadge.label}</span>
          </div>
        </div>
      </div>

      {/* Progress Gauge Bar */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-baseline text-xs font-mono">
          <span className="text-zinc-400">
            Utilization:{' '}
            <strong className={`font-semibold tabular-nums ${statusColor}`}>
              {inputPercentage.toFixed(1)}%
            </strong>{' '}
            <span className="text-zinc-500">(Prompt)</span> +{' '}
            <span className="text-zinc-400 tabular-nums">{outputPercentage.toFixed(1)}% (Output)</span>
          </span>
          <span className="text-zinc-400">
            Cap: <strong className="text-zinc-100 tabular-nums">{formatTokenCount(maxContext)} tokens</strong>
          </span>
        </div>

        {/* Multi-segment Progress Bar with Precision Guides */}
        <div className="h-3.5 w-full rounded-full bg-black/60 border border-white/[0.06] p-0.5 overflow-hidden flex relative shadow-inner">
          {/* Input tokens segment */}
          <div
            style={{ width: `${Math.min(100, inputPercentage)}%` }}
            className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-300 ${glowColor}`}
          />
          {/* Output tokens projected segment */}
          <div
            style={{ width: `${Math.min(100 - Math.min(100, inputPercentage), outputPercentage)}%` }}
            className="h-full bg-violet-600/70 opacity-80 border-l border-black/40 transition-all duration-300"
            title={`Projected Output: ${outputTokens.toLocaleString()} tokens`}
          />

          {/* 50% & 80% tick notch markers */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 pointer-events-none" />
          <div className="absolute left-[80%] top-0 bottom-0 w-[1px] bg-rose-500/40 pointer-events-none" />
        </div>

        {/* Legend & Remaining Headroom */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex items-center gap-4 text-zinc-400 text-[11px] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Prompt (<span className="tabular-nums">{inputTokens.toLocaleString()}</span>)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
              Output (<span className="tabular-nums">{outputTokens.toLocaleString()}</span>)
            </span>
          </div>

          <div className="font-mono text-xs">
            <span className="text-zinc-500">Remaining Headroom: </span>
            <span
              className={`font-semibold tabular-nums ${
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
        <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-200">
              Context Limit Exceeded
            </p>
            <p className="text-rose-300/80 mt-0.5 font-mono text-[11px]">
              Prompt uses <span className="tabular-nums">{inputTokens.toLocaleString()}</span> tokens, exceeding {selectedModel.name}&apos;s limit of <span className="tabular-nums">{maxContext.toLocaleString()}</span> tokens.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { ModelConfig } from '@/types/model';
import { DEFAULT_MODELS } from '@/data/defaultModels';
import { PROMPT_PRESETS } from '@/data/presets';
import { useCustomModels, useIsMounted } from '@/lib/storage';
import { calculateTokenStats } from '@/lib/tokenizer';
import { Navbar } from '@/components/Navbar';
import { InputStudio } from '@/components/InputStudio';
import { ContextGauge } from '@/components/ContextGauge';
import { CostMatrix } from '@/components/CostMatrix';
import { VolumeCalculator } from '@/components/VolumeCalculator';
import { CustomModelModal } from '@/components/CustomModelModal';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/ads/AdSlot';
import {
  Zap,
  ShieldCheck,
  TrendingDown,
  Layers,
  Cpu,
  BarChart3,
  Terminal,
} from 'lucide-react';

export default function Home() {
  const [promptText, setPromptText] = useState<string>(
    PROMPT_PRESETS[0]?.content || ''
  );
  const [selectedModelId, setSelectedModelId] = useState<string>(
    () => DEFAULT_MODELS[0]?.id || 'claude-opus-5-5-max'
  );
  const [outputTokens, setOutputTokens] = useState<number>(500);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Sync custom models from localStorage without cascading renders
  const customModels = useCustomModels();
  const isMounted = useIsMounted();

  // Combine default models and custom models
  const allModels: ModelConfig[] = useMemo(() => {
    return [...DEFAULT_MODELS, ...customModels];
  }, [customModels]);

  // Active selected model
  const selectedModel: ModelConfig = useMemo(() => {
    const found = allModels.find((m) => m.id === selectedModelId);
    return found || allModels[0] || DEFAULT_MODELS[0];
  }, [allModels, selectedModelId]);

  // Calculate live token stats
  const stats = useMemo(() => {
    return calculateTokenStats(promptText, selectedModel);
  }, [promptText, selectedModel]);

  const handleSelectModel = (model: ModelConfig) => {
    setSelectedModelId(model.id);
  };

  const handleModelSaved = (savedModel: ModelConfig) => {
    setSelectedModelId(savedModel.id);
  };

  const handleModelDeleted = () => {
    if (!DEFAULT_MODELS.some((m) => m.id === selectedModelId)) {
      setSelectedModelId(DEFAULT_MODELS[0].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 bg-radial-glow">
      {/* Top Navbar */}
      <Navbar
        totalModels={allModels.length}
        customModelsCount={customModels.length}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section - Linear/Raycast Atmospheric Style */}
        <div className="text-center space-y-3.5 pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/60 border border-white/[0.08] text-xs text-zinc-400 font-mono shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-zinc-300 font-medium">BPE Token Engine</span>
            <span className="text-zinc-600">•</span>
            <span>Artificial Analysis Validated Models</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100 max-w-3xl mx-auto leading-tight">
            AI Token Counter, Context Window &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-zinc-200">
              API Cost Planner
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed font-mono">
            High-precision client-side BPE tokenizer, context window headroom visualizer, 
            and multi-model single-call & monthly volume forecaster.
          </p>

          {/* Key Value Micro-Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% In-Browser</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              <span>js-tiktoken (o200k/cl100k)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>LocalStorage Persistence</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Whitespace Reducer</span>
            </div>
          </div>
        </div>

        {/* Top Leaderboard Spot */}
        <section aria-label="Partner Spotlight" className="w-full">
          <AdSlot slotType="leaderboard" id="top-ad-banner" />
        </section>

        {/* Studio & Context Window Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-violet-400" />
              <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
                Prompt Studio & Headroom Analyzer
              </h2>
            </div>
            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
              Zero network latency • In-memory BPE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Input Studio (8 cols on desktop) */}
            <div className="lg:col-span-8 flex flex-col">
              <InputStudio
                promptText={promptText}
                onPromptChange={setPromptText}
                stats={stats}
                selectedModel={selectedModel}
              />
            </div>

            {/* Context Gauge & Quick Spec (4 cols on desktop) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <ContextGauge
                selectedModel={selectedModel}
                allModels={allModels}
                onSelectModel={handleSelectModel}
                inputTokens={stats.tokens}
                outputTokens={outputTokens}
              />

              {/* Sidebar Dev Sponsor Slot */}
              <AdSlot slotType="sidebar" id="sidebar-sponsor-slot" />
            </div>
          </div>
        </section>

        {/* Multi-Model Comparison & Cost Matrix */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-400" />
            <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
              Model Comparison & Single-Call Pricing
            </h2>
          </div>

          <CostMatrix
            allModels={allModels}
            selectedModel={selectedModel}
            onSelectModel={handleSelectModel}
            inputTokens={stats.tokens}
            outputTokens={outputTokens}
            onOutputTokensChange={setOutputTokens}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
            onModelDeleted={handleModelDeleted}
          />
        </section>

        {/* Monthly Scale & Volume Forecaster */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
              Monthly Scale & Production Volume Forecaster
            </h2>
          </div>

          <VolumeCalculator
            allModels={allModels}
            promptTokens={stats.tokens}
          />
        </section>

        {/* Engineering Reference & FAQ */}
        <section className="space-y-3 pt-2">
          <FaqSection />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Add Custom Model Modal */}
      {isMounted && (
        <CustomModelModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onModelSaved={handleModelSaved}
        />
      )}
    </div>
  );
}

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
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o');
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
    <div className="min-h-screen flex flex-col bg-[#070b12] text-slate-100">
      {/* Top Navbar */}
      <Navbar
        totalModels={allModels.length}
        customModelsCount={customModels.length}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 pt-2 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-cyan-300 font-medium">TokenSaver AI Engine</span>
            <span className="text-slate-600">•</span>
            <span>Real-time BPE Tokenizer & Multi-Model Cost Matrix</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            AI Token Counter, Context Window &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              API Cost Planner
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Calculate exact prompt tokens with Byte Pair Encoding, gauge context window headroom, 
            and dynamically compare per-call & monthly production expenses across 11+ foundation models.
          </p>

          {/* Key Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>js-tiktoken (o200k & cl100k)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>LocalStorage Custom Models</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Whitespace Token Reducer</span>
            </div>
          </div>
        </div>

        {/* Top Viewability Ad Slot (728x90) */}
        <section aria-label="Partner Spotlight" className="w-full">
          <AdSlot slotType="leaderboard" id="top-ad-banner" />
        </section>

        {/* Studio & Context Window Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Prompt Studio & Headroom Analyzer
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Instant feedback • No network latency
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
            <div className="lg:col-span-4 flex flex-col gap-6">
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
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
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
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Monthly Scale & Production Volume Forecaster
            </h2>
          </div>

          <VolumeCalculator
            allModels={allModels}
            promptTokens={stats.tokens}
          />
        </section>

        {/* SEO FAQ Section */}
        <section className="space-y-4 pt-4">
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

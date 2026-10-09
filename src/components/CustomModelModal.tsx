'use client';

import React, { useState, useEffect } from 'react';
import { ModelConfig, Provider, ModelCategory } from '@/types/model';
import { saveCustomModel } from '@/lib/storage';
import { X, Plus, Sparkles, Check } from 'lucide-react';

interface CustomModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModelSaved: (model: ModelConfig) => void;
}

const TEMPLATES = [
  {
    name: 'Llama 3.3 70B (Together AI)',
    provider: 'Custom' as Provider,
    contextWindow: 131072,
    inputCostPerMillion: 0.88,
    outputCostPerMillion: 0.88,
    category: 'Flagship' as ModelCategory,
    badge: 'Open Weights',
  },
  {
    name: 'Qwen 2.5 72B (Groq)',
    provider: 'Custom' as Provider,
    contextWindow: 131072,
    inputCostPerMillion: 0.59,
    outputCostPerMillion: 0.79,
    category: 'Fast / Budget' as ModelCategory,
    badge: 'Ultra Fast',
  },
  {
    name: 'Mistral Large 2 (Mistral AI)',
    provider: 'Custom' as Provider,
    contextWindow: 128000,
    inputCostPerMillion: 2.00,
    outputCostPerMillion: 6.00,
    category: 'Flagship' as ModelCategory,
    badge: 'Multilingual',
  },
];

export function CustomModelModal({ isOpen, onClose, onModelSaved }: CustomModelModalProps) {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState<string>('Custom');
  const [contextWindow, setContextWindow] = useState<string>('128000');
  const [inputCost, setInputCost] = useState<string>('1.00');
  const [outputCost, setOutputCost] = useState<string>('3.00');
  const [category, setCategory] = useState<ModelCategory>('Flagship');
  const [badge, setBadge] = useState<string>('Custom');
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setName(tmpl.name);
    setProvider(tmpl.provider);
    setContextWindow(tmpl.contextWindow.toString());
    setInputCost(tmpl.inputCostPerMillion.toString());
    setOutputCost(tmpl.outputCostPerMillion.toString());
    setCategory(tmpl.category);
    setBadge(tmpl.badge);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a descriptive model name.');
      return;
    }

    const parsedContext = parseInt(contextWindow, 10);
    const parsedInput = parseFloat(inputCost);
    const parsedOutput = parseFloat(outputCost);

    if (isNaN(parsedContext) || parsedContext <= 0) {
      setError('Context window must be a positive integer.');
      return;
    }
    if (isNaN(parsedInput) || parsedInput < 0) {
      setError('Input cost must be a non-negative number.');
      return;
    }
    if (isNaN(parsedOutput) || parsedOutput < 0) {
      setError('Output cost must be a non-negative number.');
      return;
    }

    const newModel: ModelConfig = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      provider: (provider.trim() || 'Custom') as Provider,
      contextWindow: parsedContext,
      inputCostPerMillion: parsedInput,
      outputCostPerMillion: parsedOutput,
      category,
      badge: badge.trim() || 'Custom',
      isCustom: true,
      description: `User-defined model (${provider.trim() || 'Custom'}) configured with $${parsedInput}/1M input and $${parsedOutput}/1M output.`,
      tokenizerFamily: 'generic',
    };

    saveCustomModel(newModel);
    onModelSaved(newModel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-xl border border-white/[0.1] bg-[#0c0c0e] p-5 shadow-2xl relative text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-950/60 border border-violet-500/30 text-violet-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Add Custom Model</h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                Persisted to local browser storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Template Chips */}
        <div className="my-3.5">
          <div className="text-[11px] font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>Quick Start Templates:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-850/80 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-300 hover:text-white transition"
              >
                + {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs font-mono text-rose-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Model Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Llama-3.3-70B"
                required
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Provider Name
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Together AI, Groq"
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ModelCategory)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-xs font-mono text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              >
                <option value="Fast / Budget">Fast / Budget</option>
                <option value="Flagship">Flagship</option>
                <option value="Reasoning">Reasoning</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Context Window *
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={contextWindow}
                onChange={(e) => setContextWindow(e.target.value)}
                placeholder="128000"
                required
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-xs font-mono tabular-nums text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Input Price ($ / 1M) *
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-zinc-500 text-xs font-mono">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={inputCost}
                  onChange={(e) => setInputCost(e.target.value)}
                  placeholder="0.50"
                  required
                  className="w-full pl-6 pr-2.5 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-xs font-mono tabular-nums text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Output Price ($ / 1M) *
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-zinc-500 text-xs font-mono">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={outputCost}
                  onChange={(e) => setOutputCost(e.target.value)}
                  placeholder="1.50"
                  required
                  className="w-full pl-6 pr-2.5 py-1.5 rounded-lg bg-black/50 border border-white/[0.08] text-xs font-mono tabular-nums text-zinc-100 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-mono font-medium text-white shadow-sm transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Model</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

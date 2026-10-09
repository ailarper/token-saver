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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add Custom Model</h3>
              <p className="text-xs text-slate-400">
                Saved instantly to your browser&apos;s LocalStorage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Template Chips */}
        <div className="my-4">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pre-fill from Popular Open-Source Models:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-xs text-slate-300 hover:text-white transition"
              >
                + {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Model Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Llama-3.3-70B-Instruct"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Provider Name
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Together AI, Groq, Fireworks"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ModelCategory)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Fast / Budget">Fast / Budget</option>
                <option value="Flagship">Flagship</option>
                <option value="Reasoning">Reasoning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Context Window (tokens) *
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={contextWindow}
                onChange={(e) => setContextWindow(e.target.value)}
                placeholder="128000"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Input Price ($ / 1M tokens) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={inputCost}
                  onChange={(e) => setInputCost(e.target.value)}
                  placeholder="0.50"
                  required
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Output Price ($ / 1M tokens) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={outputCost}
                  onChange={(e) => setOutputCost(e.target.value)}
                  placeholder="1.50"
                  required
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white shadow-lg shadow-cyan-900/40 transition"
            >
              <Check className="w-4 h-4" />
              <span>Save Model</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

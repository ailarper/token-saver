'use client';

import React, { useState, useRef } from 'react';
import { TokenStats, ModelConfig } from '@/types/model';
import { PROMPT_PRESETS } from '@/data/presets';
import { trimWhitespaceOptimize } from '@/lib/tokenizer';
import {
  Clipboard,
  Trash2,
  Scissors,
  FileCode2,
  Copy,
  Clock,
  Type,
  FileText,
  Binary,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface InputStudioProps {
  promptText: string;
  onPromptChange: (text: string) => void;
  stats: TokenStats;
  selectedModel: ModelConfig;
}

export function InputStudio({
  promptText,
  onPromptChange,
  stats,
  selectedModel,
}: InputStudioProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [trimmedNotice, setTrimmedNotice] = useState<{
    tokensSaved: number;
    percentSaved: number;
  } | null>(null);
  const [previousText, setPreviousText] = useState<string | null>(null);

  // Handle Clipboard Paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onPromptChange(text);
      }
    } catch (err) {
      console.warn('Clipboard read error or permission denied:', err);
    }
  };

  // Handle Copy Prompt
  const handleCopy = async () => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write error:', err);
    }
  };

  // Handle Clear with Undo
  const handleClear = () => {
    if (!promptText) return;
    setPreviousText(promptText);
    onPromptChange('');
    setTrimmedNotice(null);
  };

  const handleUndoClear = () => {
    if (previousText !== null) {
      onPromptChange(previousText);
      setPreviousText(null);
    }
  };

  // Handle Whitespace Trim
  const handleTrimWhitespace = () => {
    if (!promptText) return;
    const result = trimWhitespaceOptimize(promptText, selectedModel);
    setPreviousText(promptText);
    onPromptChange(result.cleanedText);
    setTrimmedNotice({
      tokensSaved: result.tokensSaved,
      percentSaved: result.percentSaved,
    });
    setTimeout(() => {
      setTrimmedNotice(null);
    }, 4500);
  };

  // Handle Preset Selection
  const handlePresetSelect = (presetId: string) => {
    const preset = PROMPT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setPreviousText(promptText);
      onPromptChange(preset.content);
      setTrimmedNotice(null);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
      {/* Top Action & Toolbar Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <FileCode2 className="w-4 h-4 text-cyan-400" />
            <span>Prompt Input Studio</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono">
            100% Client-Side
          </span>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Selector */}
          <div className="relative">
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  handlePresetSelect(e.target.value);
                  e.target.value = '';
                }
              }}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="" disabled>
                ⚡ Load Sample Preset...
              </option>
              {PROMPT_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {/* Paste */}
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 transition active:scale-95"
            title="Paste text from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5 text-slate-400" />
            <span>Paste</span>
          </button>

          {/* Trim Whitespace */}
          <button
            type="button"
            onClick={handleTrimWhitespace}
            disabled={!promptText}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-xs font-medium text-cyan-300 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clean redundant spaces and newlines to immediately save tokens"
          >
            <Scissors className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trim Whitespace</span>
          </button>

          {/* Copy Prompt */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!promptText}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-xs font-medium text-slate-200 transition active:scale-95 disabled:opacity-40"
            title="Copy current prompt text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Clear or Undo */}
          {previousText && !promptText ? (
            <button
              type="button"
              onClick={handleUndoClear}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-xs font-medium text-amber-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Undo Clear</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClear}
              disabled={!promptText}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-xs font-medium text-rose-300 transition active:scale-95 disabled:opacity-40"
              title="Clear prompt text"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Trim Notice Banner */}
      {trimmedNotice && (
        <div className="px-4 py-2 bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Whitespace optimized! Saved{' '}
              <strong>{trimmedNotice.tokensSaved.toLocaleString()} tokens</strong>{' '}
              ({trimmedNotice.percentSaved}% reduction).
            </span>
          </div>
          {previousText && (
            <button
              onClick={() => onPromptChange(previousText)}
              className="text-emerald-400 hover:text-emerald-200 underline text-xs"
            >
              Undo
            </button>
          )}
        </div>
      )}

      {/* Main Monospace Textarea */}
      <div className="relative flex-1 min-h-[260px] sm:min-h-[320px]">
        <textarea
          ref={textareaRef}
          value={promptText}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Paste or type your LLM prompt, system instructions, RAG context, or code payload here... Tokens calculate in real-time 100% on your device."
          className="w-full h-full min-h-[260px] sm:min-h-[320px] p-4 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-cyan-500/50 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
          spellCheck={false}
        />
      </div>

      {/* Live Metrics Bar */}
      <div className="px-4 py-3 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-6 text-xs font-mono">
          {/* Estimated Tokens */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <Binary className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Tokens
              </div>
              <div className="text-sm font-bold text-cyan-300">
                {stats.tokens.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Words */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Words
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {stats.words.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Characters */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              <Type className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Characters
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {stats.characters.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Reading Time */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Reading Time
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {stats.readingTimeMinutes < 1
                  ? `${Math.round(stats.readingTimeMinutes * 60)}s`
                  : `${stats.readingTimeMinutes.toFixed(1)}m`}
              </div>
            </div>
          </div>

          {/* Char per Token Ratio */}
          <div className="hidden md:flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
              <span className="text-xs font-bold font-mono">c/t</span>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                Ratio
              </div>
              <div className="text-sm font-semibold text-slate-300">
                {stats.charPerToken} c/tok
              </div>
            </div>
          </div>
        </div>

        {/* Lines summary */}
        <div className="text-xs text-slate-500 font-mono">
          {stats.lines.toLocaleString()} lines
        </div>
      </div>
    </div>
  );
}

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

  // Calculate line numbers for editor gutter
  const lineCount = Math.max(1, promptText.split(/\r\n|\r|\n/).length);
  const lineNumbers = Array.from({ length: Math.min(lineCount, 100) }, (_, i) => i + 1);

  return (
    <div className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col transition-all">
      {/* Top Floating Utility Pills Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-black/40 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
            <FileCode2 className="w-3.5 h-3.5 text-violet-400" />
            <span className="tracking-tight">Input Studio</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
            Local Buffer
          </span>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Preset Selector Pill */}
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                handlePresetSelect(e.target.value);
                e.target.value = '';
              }
            }}
            className="bg-zinc-850/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500/50 cursor-pointer transition"
          >
            <option value="" disabled>
              ⚡ Presets...
            </option>
            {PROMPT_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>

          {/* Paste */}
          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition active:scale-95"
            title="Paste text from clipboard"
          >
            <Clipboard className="w-3 h-3 text-zinc-400" />
            <span>Paste</span>
          </button>

          {/* Trim Whitespace */}
          <button
            type="button"
            onClick={handleTrimWhitespace}
            disabled={!promptText}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 text-xs font-mono text-violet-300 hover:text-violet-200 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clean redundant spaces and newlines to immediately save tokens"
          >
            <Scissors className="w-3 h-3 text-violet-400" />
            <span>Trim</span>
          </button>

          {/* Copy Prompt */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!promptText}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-700/60 border border-white/[0.08] text-xs font-mono text-zinc-300 hover:text-white transition active:scale-95 disabled:opacity-40"
            title="Copy current prompt text"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Clear or Undo */}
          {previousText && !promptText ? (
            <button
              type="button"
              onClick={handleUndoClear}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-xs font-mono text-amber-300 transition"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Undo</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClear}
              disabled={!promptText}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/20 text-xs font-mono text-rose-300 hover:text-rose-200 transition active:scale-95 disabled:opacity-40"
              title="Clear prompt text"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Trim Notice Banner */}
      {trimmedNotice && (
        <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Optimized: Saved{' '}
              <strong className="text-emerald-300 tabular-nums">{trimmedNotice.tokensSaved.toLocaleString()} tokens</strong>{' '}
              (-{trimmedNotice.percentSaved}%).
            </span>
          </div>
          {previousText && (
            <button
              onClick={() => onPromptChange(previousText)}
              className="text-emerald-400 hover:text-emerald-200 underline text-xs font-mono"
            >
              Undo
            </button>
          )}
        </div>
      )}

      {/* Code Editor Container with Gutter */}
      <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] flex bg-[#0c0c0e]">
        {/* Subtle Line Numbers Gutter */}
        <div className="hidden sm:block w-11 py-4 pr-3 text-right font-mono text-xs text-zinc-600 select-none bg-black/20 border-r border-white/[0.04]">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-relaxed tabular-nums">
              {num}
            </div>
          ))}
          {lineCount > 100 && <div className="text-zinc-700">...</div>}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={promptText}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Paste or type system prompt, RAG chunks, or code payload here... Tokens calculate locally in real-time."
          className="flex-1 w-full min-h-[260px] sm:min-h-[320px] p-4 bg-transparent text-zinc-200 placeholder:text-zinc-600 font-mono text-xs sm:text-sm leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-violet-500/30 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
          spellCheck={false}
        />
      </div>

      {/* Live Metrics Bar with strict tabular-nums */}
      <div className="px-4 py-2.5 bg-black/60 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-6 text-xs font-mono">
          {/* Estimated Tokens */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-violet-950/60 border border-violet-500/30 text-violet-400">
              <Binary className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Tokens
              </div>
              <div className="text-xs sm:text-sm font-semibold text-violet-300 font-mono tabular-nums">
                {stats.tokens.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Words */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-zinc-800/60 border border-white/[0.06] text-zinc-400">
              <FileText className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Words
              </div>
              <div className="text-xs sm:text-sm font-medium text-zinc-200 font-mono tabular-nums">
                {stats.words.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Characters */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-zinc-800/60 border border-white/[0.06] text-zinc-400">
              <Type className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Chars
              </div>
              <div className="text-xs sm:text-sm font-medium text-zinc-200 font-mono tabular-nums">
                {stats.characters.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Reading Time */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-zinc-800/60 border border-white/[0.06] text-zinc-400">
              <Clock className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Read Time
              </div>
              <div className="text-xs sm:text-sm font-medium text-zinc-300 font-mono tabular-nums">
                {stats.readingTimeMinutes < 1
                  ? `${Math.round(stats.readingTimeMinutes * 60)}s`
                  : `${stats.readingTimeMinutes.toFixed(1)}m`}
              </div>
            </div>
          </div>

          {/* Char per Token Ratio */}
          <div className="hidden md:flex items-center gap-2">
            <div className="p-1 rounded bg-zinc-800/60 border border-white/[0.06] text-zinc-400">
              <span className="text-[10px] font-bold font-mono">c/t</span>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Density
              </div>
              <div className="text-xs sm:text-sm font-medium text-zinc-300 font-mono tabular-nums">
                {stats.charPerToken} c/tok
              </div>
            </div>
          </div>
        </div>

        {/* Lines summary */}
        <div className="text-xs text-zinc-500 font-mono tabular-nums">
          {stats.lines.toLocaleString()} lines
        </div>
      </div>
    </div>
  );
}

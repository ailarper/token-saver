'use client';

import React from 'react';
import { ShieldCheck, Terminal, Layers } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

interface NavbarProps {
  totalModels: number;
  customModelsCount: number;
  onOpenCustomModal: () => void;
}

export function Navbar({ totalModels, customModelsCount, onOpenCustomModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-b from-violet-500 to-indigo-600 p-[1px] shadow-sm flex items-center justify-center">
            <div className="h-full w-full bg-[#09090b] rounded-[7px] flex items-center justify-center text-violet-400">
              <Terminal className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-zinc-100">
              Token<span className="text-violet-400">Saver</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              v1.1
            </span>
          </div>
        </div>

        {/* Center: Privacy Guarantee Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/60 border border-emerald-500/20 text-emerald-400 text-xs shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] font-medium tracking-tight">100% Client-Side • Local Execution</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCustomModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition"
          >
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-mono tabular-nums">{totalModels} Models</span>
            {customModelsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-violet-950/60 text-violet-300 text-[10px] border border-violet-500/30 font-mono tabular-nums">
                +{customModelsCount}
              </span>
            )}
          </button>

          <a
            href="https://github.com/ailarper/token-saver.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition shadow-sm"
          >
            <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

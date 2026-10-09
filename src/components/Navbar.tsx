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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-950/50 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                Token<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Saver</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                v1.0
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">
              AI Token Counter & API Cost Planner
            </span>
          </div>
        </div>

        {/* Center: Privacy Guarantee Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] font-medium">100% Client-Side • Zero Data Sent</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCustomModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{totalModels} Models</span>
            {customModelsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 text-[10px] border border-purple-500/30 font-mono">
                +{customModelsCount} custom
              </span>
            )}
          </button>

          <a
            href="https://github.com/ailarper/token-saver.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm"
          >
            <GithubIcon className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

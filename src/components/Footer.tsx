'use client';

import React from 'react';
import { Terminal, Lock } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80 text-xs">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white text-sm">TokenSaver</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              High-performance, client-side AI token counter, context window visualizer, and multi-model cost forecaster. Built specifically for AI infrastructure engineers, LLM app developers, and financial planners.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] pt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-knowledge client execution. Prompts never leave your device.</span>
            </div>
          </div>

          {/* Model Providers */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Supported Ecosystem
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>OpenAI (GPT-4o, o1, o3-mini)</li>
              <li>Anthropic (Claude 3.7 & 3.5 Sonnet)</li>
              <li>Google (Gemini 2.0 Flash, 1.5 Pro)</li>
              <li>DeepSeek (DeepSeek-R1, V3)</li>
              <li>Local & Custom Models (LocalStorage)</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Built With
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Next.js App Router
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                TypeScript Strict
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                js-tiktoken (BPE)
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Tailwind CSS
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                Lucide Icons
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>© 2025 TokenSaver. Open-source developer utility.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ailarper/token-saver.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition flex items-center gap-1"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

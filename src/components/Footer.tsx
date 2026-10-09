'use client';

import React from 'react';
import { Terminal, Lock } from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#09090b] text-zinc-500 py-10 px-4 sm:px-6 lg:px-8 mt-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/[0.06] text-xs">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-md bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Terminal className="w-3 h-3" />
              </div>
              <span className="font-semibold text-zinc-200 text-xs tracking-tight">TokenSaver</span>
            </div>
            <p className="text-zinc-500 leading-relaxed max-w-md text-xs font-mono">
              High-precision, client-side AI token counter, context headroom visualizer, and API cost planner. Built for AI infrastructure engineers and platform teams.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] pt-0.5">
              <Lock className="w-3 h-3" />
              <span>Zero telemetry. Prompts never leave your browser buffer.</span>
            </div>
          </div>

          {/* Model Providers */}
          <div>
            <h4 className="font-mono text-zinc-400 text-[11px] uppercase tracking-wider mb-2.5">
              Evaluated Providers
            </h4>
            <ul className="space-y-1 text-zinc-500 font-mono text-xs">
              <li>Anthropic (Claude Opus & Sonnet 5.5)</li>
              <li>OpenAI (GPT-6 Astra)</li>
              <li>Google DeepMind (Gemini 4 Argon)</li>
              <li>xAI, Xiaomi, Alibaba, Zhipu, Moonshot</li>
              <li>DeepSeek (V4.1 Flash) & LocalStorage</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-mono text-zinc-400 text-[11px] uppercase tracking-wider mb-2.5">
              Core Stack
            </h4>
            <div className="flex flex-wrap gap-1 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-zinc-850 border border-white/[0.06] text-zinc-400">
                Next.js 16
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-850 border border-white/[0.06] text-zinc-400">
                TypeScript
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-850 border border-white/[0.06] text-zinc-400">
                js-tiktoken (BPE)
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-850 border border-white/[0.06] text-zinc-400">
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-500">
          <div>
            <span>© 2026 TokenSaver. High-precision developer utility.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ailarper/token-saver.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 transition flex items-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

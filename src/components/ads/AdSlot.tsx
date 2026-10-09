'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export type AdSlotType = 'leaderboard' | 'sidebar' | 'inline';

interface AdSlotProps {
  slotType: AdSlotType;
  id?: string;
  className?: string;
}

interface SponsorContent {
  brand: string;
  tagline: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  accentColor: string;
}

const SPONSORS: SponsorContent[] = [
  {
    brand: 'Neon Serverless Postgres',
    tagline: 'Instant Branching for AI Workflows',
    description: 'Serverless Postgres built for agentic memory & vector embeddings with pgvector.',
    ctaText: 'Start Free on Neon',
    ctaUrl: 'https://neon.tech',
    accentColor: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
  },
  {
    brand: 'Together AI Inference',
    tagline: 'Fastest DeepSeek-R1 & Llama 3.3 API',
    description: 'Ultra-low latency open-source model inference with dedicated endpoints.',
    ctaText: 'Deploy in 60s',
    ctaUrl: 'https://together.ai',
    accentColor: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
  },
  {
    brand: 'Pinecone Vector DB',
    tagline: 'RAG Knowledge at Enterprise Scale',
    description: 'Zero-maintenance serverless vector index with sub-50ms search latency.',
    ctaText: 'Build RAG Free',
    ctaUrl: 'https://pinecone.io',
    accentColor: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
  },
];

export function AdSlot({ slotType, id = 'ad-slot-default', className = '' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sponsorIndex, setSponsorIndex] = useState(() => {
    return Math.abs(id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % SPONSORS.length;
  });
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // IntersectionObserver checking >= 50% viewability
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      },
      {
        threshold: [0.5],
      }
    );

    observer.observe(element);

    // Quiet 45-second refresh cycle: only cycles if >= 50% visible and document tab is active
    const interval = setInterval(() => {
      if (isVisibleRef.current && typeof document !== 'undefined' && !document.hidden) {
        setSponsorIndex((prev) => (prev + 1) % SPONSORS.length);
      }
    }, 45000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const sponsor = SPONSORS[sponsorIndex] || SPONSORS[0];

  if (slotType === 'leaderboard') {
    return (
      <div
        ref={containerRef}
        id={id}
        className={`w-full max-w-[728px] mx-auto min-h-[90px] relative overflow-hidden rounded-xl border bg-slate-900/60 backdrop-blur-md p-3 transition-all duration-500 hover:border-slate-700/80 ${sponsor.accentColor} ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 h-full">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Partner Spotlight
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-medium text-slate-300">{sponsor.brand}</span>
              </div>
              <p className="text-sm font-semibold text-slate-100 line-clamp-1">
                {sponsor.tagline}
              </p>
              <p className="text-xs text-slate-400 hidden sm:block line-clamp-1">
                {sponsor.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={sponsor.ctaUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-600/60 text-xs font-semibold text-white shadow-sm transition"
            >
              <span>{sponsor.ctaText}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar / Inline Box format (300x250 or responsive)
  return (
    <div
      ref={containerRef}
      id={id}
      className={`w-full min-h-[220px] rounded-xl border bg-slate-900/70 backdrop-blur-md p-4 flex flex-col justify-between transition-all duration-500 hover:border-slate-700/80 ${sponsor.accentColor} ${className}`}
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>DEV SPONSOR</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
            Promoted
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded bg-slate-800 border border-slate-700 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">{sponsor.brand}</h4>
        </div>

        <p className="text-xs font-medium text-slate-200 mb-1.5">{sponsor.tagline}</p>
        <p className="text-xs text-slate-400 leading-relaxed">{sponsor.description}</p>
      </div>

      <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">High throughput AI infra</span>
        <a
          href={sponsor.ctaUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600/60 text-xs font-semibold text-white shadow-sm transition"
        >
          <span>{sponsor.ctaText}</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </div>
  );
}

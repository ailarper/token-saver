'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Terminal, ShieldCheck, Zap } from 'lucide-react';

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
}

const SPONSORS: SponsorContent[] = [
  {
    brand: 'Neon Serverless Postgres',
    tagline: 'Instant Branching for AI Workflows',
    description: 'Serverless Postgres built for agentic memory & vector embeddings with pgvector.',
    ctaText: 'Explore Neon',
    ctaUrl: 'https://neon.tech',
  },
  {
    brand: 'Together AI Inference',
    tagline: 'Dedicated Fast Inference Endpoints',
    description: 'Ultra-low latency open-weights model inference with dedicated enterprise endpoints.',
    ctaText: 'View Endpoints',
    ctaUrl: 'https://together.ai',
  },
  {
    brand: 'Pinecone Vector DB',
    tagline: 'Vector Search at Enterprise Scale',
    description: 'Zero-maintenance serverless vector index with sub-50ms search latency.',
    ctaText: 'Build Index',
    ctaUrl: 'https://pinecone.io',
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
        className={`w-full max-w-[728px] mx-auto min-h-[72px] relative overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md p-3 transition-all hover:border-white/[0.12] ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 h-full">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-zinc-800/80 border border-white/[0.08] flex items-center justify-center text-violet-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  Infra Partner
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs font-medium text-zinc-200">{sponsor.brand}</span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-1">
                {sponsor.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={sponsor.ctaUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/[0.08] text-xs font-mono text-zinc-200 hover:text-white transition"
            >
              <span>{sponsor.ctaText}</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar / Inline Box format (Secondary Tool Panel style)
  return (
    <div
      ref={containerRef}
      id={id}
      className={`w-full rounded-xl border border-white/[0.08] bg-zinc-900/40 backdrop-blur-md p-4 flex flex-col justify-between transition-all hover:border-white/[0.12] ${className}`}
    >
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            <span>DEV SPONSOR</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
            Spotlight
          </span>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1 rounded bg-zinc-800/80 border border-white/[0.08] text-violet-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-semibold text-zinc-100 tracking-tight">{sponsor.brand}</h4>
        </div>

        <p className="text-xs font-medium text-zinc-300 mb-1">{sponsor.tagline}</p>
        <p className="text-xs text-zinc-500 leading-relaxed">{sponsor.description}</p>
      </div>

      <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] text-zinc-500 font-mono">Verified ecosystem tool</span>
        <a
          href={sponsor.ctaUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/[0.08] text-xs font-mono text-zinc-200 hover:text-white transition"
        >
          <span>{sponsor.ctaText}</span>
          <ExternalLink className="w-3 h-3 text-zinc-400" />
        </a>
      </div>
    </div>
  );
}

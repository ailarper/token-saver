# TokenSaver — AI Token Counter, Context Window & API Cost Planner

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Client--Side-10B981)](#privacy--security-guarantee)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **TokenSaver** is an ultra-fast, production-ready, 100% client-side web application built for AI engineers, LLM product teams, and infrastructure specialists. Calculate real-time Byte Pair Encoding (BPE) tokens, visualize context window headroom limits, compare pricing across 11+ foundation models, simulate enterprise monthly volume forecasts, and save custom models directly in your browser.

---

## ⚡ Key Highlights

- **100% Client-Side Privacy:** No prompt data, tokens, or telemetry ever leave your browser. Built entirely on local WebAssembly and JavaScript tokenizers.
- **Accurate BPE Tokenization:** Native `js-tiktoken` support (`o200k_base` and `cl100k_base`) with model-calibrated heuristics for Claude, Gemini, and DeepSeek tokenizers.
- **Context Window Utilization Gauge:** Real-time visual progress bar displaying safe headroom (<50%), warning zones (50–80%), and truncation alerts (>80%) with exact remaining token counters.
- **Dynamic Multi-Model Cost Matrix:** Live single-call pricing breakdown (Prompt In + Completion Out) across OpenAI, Anthropic, Google, and DeepSeek, with automatic "Best Value" highlight badges.
- **Custom Model Management:** Create, configure, and persist your own models (e.g. self-hosted vLLM, Ollama, Together AI, Groq) directly in browser `localStorage`.
- **Monthly Scale & Volume Forecaster:** Interactive sliders for Daily API Calls (10 to 100,000) and Average Output Tokens (100 to 4,000) computing Daily, Monthly, and Annual cloud bills.
- **Whitespace Reducer & Token Optimizer:** Instantly trims redundant spaces, excess line breaks, and trailing characters, calculating exact token count reduction and cost savings.
- **Viewability-Based Ad Slots:** IntersectionObserver-gated developer sponsorship placement with quiet 45-second refresh interval only when actively visible.
- **Programmatic SEO & Schema:** Dynamic `robots.ts`, `sitemap.ts`, OpenGraph metadata, and structured JSON-LD for `WebApplication` and `FAQPage`.

---

## 🤖 Supported Default Models

| Provider | Model | Context Window | Input / 1M | Output / 1M | Category | AA Index |
|---|---|---:|---:|---:|---|---:|
| **Anthropic** | Claude Opus 5.5 (Max, default fallback) | 1,000,000 | $4.00 | $20.00 | Flagship | 58 |
| **Anthropic** | Claude Sonnet 5.5 (Max, default fallback) | 1,000,000 | $2.00 | $10.00 | Flagship | 56 |
| **OpenAI** | GPT-6 Astra (Max) | 1,000,000 | $10.00 | $50.00 | Flagship | 53 |
| **Google** | Gemini 4 Argon (High) | 1,000,000 | $2.00 | $10.00 | Flagship | 53 |
| **xAI** | Grok 4.7 (Xhigh) | 500,000 | $2.00 | $6.00 | Flagship | 46 |
| **Xiaomi** | MiMo-V2.6-Pro (reasoning) | 1,000,000 | $0.43 | $0.87 | Reasoning | 46 |
| **Alibaba** | Qwen3.8 Max (0902) | 984,000 | $2.00 | $6.00 | Reasoning | 45 |
| **Zhipu** | GLM-5.3 (Max) | 1,000,000 | $1.40 | $4.40 | Reasoning | 45 |
| **Moonshot** | Kimi K3 (Max) | 1,049,000 | $3.00 | $15.00 | Reasoning | 44 |
| **DeepSeek** | DeepSeek V4.1 Flash (Max) | 1,000,000 | $0.30 | $1.20 | Reasoning | 39 |
| **Custom** | *User Defined* | Custom | Custom | Custom | User Choice | — |

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript 5.x (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Tokenizer:** `js-tiktoken` (o200k_base, cl100k_base) + multi-lingual heuristic fallbacks
- **Icons:** `lucide-react`
- **State & Storage:** React 19 `useSyncExternalStore` + Browser `localStorage`

```
src/
├── app/
│   ├── layout.tsx         # Global layout, fonts, SEO, JSON-LD schema
│   ├── page.tsx           # Master reactive dashboard
│   ├── robots.ts          # Programmatic SEO robots.txt
│   └── sitemap.ts         # Programmatic sitemap.xml
├── components/
│   ├── InputStudio.tsx    # Monospace editor, metrics, actions & presets
│   ├── ContextGauge.tsx   # Context utilization progress bar & alerts
│   ├── CostMatrix.tsx     # Filterable pricing table & single-call math
│   ├── VolumeCalculator.tsx# Daily/Monthly/Annual volume sliders
│   ├── CustomModelModal.tsx# Modal dialog for localStorage models
│   ├── FaqSection.tsx     # Developer FAQ accordion
│   ├── Navbar.tsx         # Sticky header with client-side status
│   ├── Footer.tsx         # Footer with ecosystem breakdown
│   ├── ads/
│   │   └── AdSlot.tsx     # IntersectionObserver viewability sponsor slots
│   └── icons/
│       └── GithubIcon.tsx # Clean SVG GitHub mark
├── data/
│   ├── defaultModels.ts   # Canonical model pricing & context limits
│   └── presets.ts         # Realistic developer prompt templates
├── lib/
│   ├── calculator.ts      # Financial & token volume calculation engine
│   ├── storage.ts         # React 19 sync store for localStorage models
│   └── tokenizer.ts       # js-tiktoken BPE runner & whitespace optimizer
└── types/
    └── model.ts           # Strict TypeScript contracts & interfaces
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.18 (Node 20+ or 24+ recommended)
- npm, pnpm, or yarn

### Installation
```bash
git clone https://github.com/ailarper/token-saver.git
cd token-saver
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

---

## 🔒 Privacy & Security Guarantee

TokenSaver is built on a **Zero-Cloud-Telemetry** principle. 
- Prompt text never touches any server.
- All token counting algorithms run locally inside the client browser.
- Custom models and configurations are saved exclusively to the client's `localStorage`.
- Ideal for analyzing sensitive enterprise source code, confidential system instructions, and proprietary customer conversations.

---

## 📄 License

MIT License. Open-source and free to use for personal and commercial projects.

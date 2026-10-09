# Cutting-edge AI models on the Artificial Analysis leaderboard

**Research snapshot:** 2026-10-09. Prices are USD per 1 million tokens and use the representative first-party/API configuration shown by Artificial Analysis where available. Scores are the **Artificial Analysis Intelligence Index** snapshot, not a universal model-quality score. Artificial Analysis defines the index as a composite of ten evaluations spanning mathematics, science, coding, knowledge work, automation, and long-context reasoning. [1] [2]

## Standardized comparison

| Exact Model Name & Version | Provider / Company | Context Window | API Input Price ($/1M tokens) | API Output Price ($/1M tokens) | Model Category | Benchmark Quality Score (Artificial Analysis index) |
|---|---|---:|---:|---:|---|---:|
| Claude Opus 5.5 (Max, default fallback) | Anthropic | 1M tokens | $4.00 | $20.00 | Flagship | 58 |
| Claude Sonnet 5.5 (Max, default fallback) | Anthropic | 1M tokens | $2.00 | $10.00 | Flagship | 56 |
| GPT-6 Astra (Max) | OpenAI | 1M tokens | $10.00 | $50.00 | Flagship | 53 |
| Gemini 4 Argon (High) | Google / Google DeepMind | 1M tokens | $2.00 | $10.00 | Flagship | 53 |
| Grok 4.7 (Xhigh) | xAI / SpaceXAI | 500k tokens | $2.00 | $6.00 | Flagship | 46 |
| MiMo-V2.6-Pro (reasoning) | Xiaomi | 1M tokens | $0.43 | $0.87 | Reasoning | 46 |
| Qwen3.8 Max (0902) | Alibaba / Qwen | 984k tokens (about 1M) | $2.00 | $6.00 | Reasoning | 45 |
| GLM-5.3 (Max) | Z AI / Zhipu | 1M tokens | $1.40 | $4.40 | Reasoning | 45 |
| Kimi K3 (Max) | Moonshot AI / Kimi | 1.049M tokens (about 1M) | $3.00 | $15.00 | Reasoning | 44 |
| DeepSeek V4.1 Flash (Max) | DeepSeek | 1M tokens | $0.30 | $1.20 | Reasoning | 39 |

## Technical notes

- **Claude Opus 5.5.** Anthropic’s top Claude 5.5 release is a long-context reasoning flagship with adaptive thinking. Anthropic lists base API pricing at $4 input and $20 output per million tokens; cached reads and fast mode are separate prices. Artificial Analysis ranks the max/default-fallback configuration first with an Intelligence Index score of 58. [1] [3] [4]

- **Claude Sonnet 5.5.** Sonnet 5.5 is the faster, lower-cost member of Anthropic’s 5.5 family, while still appearing immediately behind Opus on the leaderboard. The official model page lists a 1M-token context, 128k maximum output, and $2/$10 input/output pricing. [1] [3]

- **GPT-6 Astra.** Astra is OpenAI’s high-end work and agent model, with reasoning, computer-use, coding, and multimodal input capabilities. Artificial Analysis lists the max configuration at 1M context, $10/$50 pricing, and score 53. OpenAI’s launch material reports the same base token pricing and API availability. [5] [6]

- **Gemini 4 Argon.** Argon is Google’s frontier reasoning model, initially rolled out through a trusted-cyber-defender program. Google describes a 1M-token output ceiling and introductory $2/$10 pricing, while Artificial Analysis records a 1M context window and the high-effort configuration at score 53. Google says the post-introductory price is expected to become $4/$20. [7] [8]

- **Grok 4.7.** The representative Artificial Analysis entry is the Xhigh reasoning configuration. It has a smaller 500k context than the 1M-token leaders, with $2/$6 base API pricing and a score of 46. xAI’s launch page confirms the same token prices and describes a faster variant at twice the price. [9] [10]

- **MiMo-V2.6-Pro.** Xiaomi’s open-weights reasoning model is one of the strongest open models on the leaderboard. Artificial Analysis reports 1M context, $0.43/$0.87 pricing, score 46, and a 1T-total-parameter MoE architecture with 42B active parameters. “MiMo” without a version is therefore standardized here to the current named Pro release. [11]

- **Qwen3.8 Max (0902).** Alibaba’s current Qwen Max entry is explicitly listed in Alibaba Cloud Model Studio as `qwen3.8-max`; the Artificial Analysis comparison identifies the evaluated release as `Qwen3.8 Max (0902)`. It is a reasoning model with 984k context, $2/$6 pricing, and score 45. [12] [13]

- **GLM-5.3 (Max).** Artificial Analysis identifies this as Z AI/Zhipu’s open-weights reasoning model. The Max configuration has a 1M context, $1.40/$4.40 pricing, and score 45. The same comparison reports 753B total and 40B active parameters. [14]

- **Kimi K3 (Max).** Kimi K3 is Moonshot AI’s open-weights reasoning flagship. The Max configuration has about 1.049M context and score 44. Artificial Analysis uses $3/$15 for the representative API configuration; Moonshot’s official price table lists the native K3 API in CNY at ¥20 input-cache-miss and ¥100 output per million tokens, with a separate ¥2 cache-hit rate, so real USD cost depends on exchange rate and cache usage. [14] [15]

- **DeepSeek V4.1 Flash (Max).** This is the fast, open-weights reasoning member of the DeepSeek V4.1 family. Artificial Analysis reports 1M context, $0.30/$1.20 pricing, score 39, and 552B total / 16B active parameters. DeepSeek’s API documentation says legacy V4 Flash names are routed to V4.1 Flash and billed at the Flash price, which is why the exact “V4.1 Flash” variant is used rather than the broader “DeepSeek V4.1” label. [16] [17]

## Interpretation and caveats

Artificial Analysis shows multiple rows for some models because effort level, fallback behavior, reasoning configuration, and provider can materially change both score and cost. This report uses the leaderboard’s most representative high/max row for each requested family rather than mixing low-effort and high-effort rows. The score is an index value as displayed by Artificial Analysis; it should not be interpreted as a percentage or as a direct probability of correctness.

Prices are base token prices, not blended task costs. Cached input, cache writes, batch discounts, enterprise rate cards, regional pricing, and third-party routing can change the effective price. Artificial Analysis itself reports blended task costs separately and defines context as the maximum combined input-plus-output token budget. [1] [2]

The leaderboard snapshot contains additional frontier entries beyond the requested list, including GPT-6.1 Sol, GPT-6 Luna, Claude Fable 5.1, and other variants. They are not added as rows here because the requested scope centered on the named next-generation families.

## References

[1]: https://artificialanalysis.ai/leaderboards/models "Artificial Analysis LLM Leaderboard"
[2]: https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index "Artificial Analysis Intelligence Index v4.3.2"
[3]: https://platform.claude.com/docs/en/models/sonnet-5-5/overview "Claude Sonnet 5.5 Platform Documentation"
[4]: https://www.anthropic.com/claude-opus-5-5 "Introducing Claude Opus 5.5"
[5]: https://artificialanalysis.ai/models/gpt-6-astra "GPT-6 Astra Artificial Analysis Model Analysis"
[6]: https://openai.com/index/gpt-6-astra-next-generation-work/ "GPT-6 Astra: The next generation in intelligence for work"
[7]: https://artificialanalysis.ai/models/gemini-4-argon "Gemini 4 Argon Artificial Analysis Model Analysis"
[8]: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/ "Gemini 4 Argon: our next era of frontier intelligence"
[9]: https://artificialanalysis.ai/models/grok-4-7 "Grok 4.7 Artificial Analysis Model Analysis"
[10]: https://x.ai/news/grok-4-7 "Introducing Grok 4.7"
[11]: https://artificialanalysis.ai/models/mimo-v2-6-pro "MiMo-V2.6-Pro Artificial Analysis Model Analysis"
[12]: https://www.alibabacloud.com/help/en/model-studio/models "Alibaba Cloud Model Studio Recommended Models"
[13]: https://artificialanalysis.ai/models/comparisons/qwen3-8-max-vs-kimi-k3-low "Qwen3.8 Max (0902) vs. Kimi K3 Artificial Analysis Comparison"
[14]: https://artificialanalysis.ai/models/comparisons/glm-5-3-vs-kimi-k3 "GLM-5.3 (Max) vs. Kimi K3 (Max) Artificial Analysis Comparison"
[15]: https://platform.moonshot.cn/docs/pricing/chat "Kimi API Model Inference Pricing"
[16]: https://artificialanalysis.ai/models/deepseek-v4-1-flash "DeepSeek V4.1 Flash Artificial Analysis Model Analysis"
[17]: https://api-docs.deepseek.com/quick_start/pricing "DeepSeek API Quick Start and Pricing"

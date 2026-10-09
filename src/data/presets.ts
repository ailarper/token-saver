export interface PromptPreset {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'system-prompt',
    name: 'Production System Prompt',
    description: 'Autonomous Coding Agent Instructions with XML blocks and tools',
    content: `<system_instructions>
You are an expert AI software engineer operating in an enterprise monorepo.
Your objective is to review pull requests, identify architectural anti-patterns, and provide strictly typed solutions.

<guidelines>
- Always prefer pure functions and immutability over mutable class state.
- Ensure all public API surfaces include complete JSDoc annotations with parameter types.
- Strict null-checking must be enforced across all imported dependencies.
- Never write credentials, raw tokens, or secrets into source files or logs.
- When refactoring legacy code, preserve complete backward compatibility.
</guidelines>

<output_contract>
Respond strictly with valid JSON conforming to the following structure:
{
  "summary": "Brief executive summary of the review findings",
  "criticalIssues": [
    {
      "severity": "CRITICAL" | "MAJOR" | "MINOR",
      "file": "path/to/target.ts",
      "lineRange": [10, 25],
      "description": "Detailed explanation of failure mode",
      "recommendedDiff": "Unified diff patch string"
    }
  ],
  "performanceScore": 94,
  "mergeApproved": true
}
</output_contract>
</system_instructions>`,
  },
  {
    id: 'rag-chunk',
    name: 'RAG Document Chunk',
    description: 'Technical knowledge base chunk with markdown tables and code',
    content: `## Distributed Consensus & Raft Protocol Architecture

In distributed computing systems, the Raft algorithm is designed to manage replicated logs across an odd number of server nodes (typically 3, 5, or 7). Raft decomposes consensus into three independent sub-problems:

1. **Leader Election:**
   - A leader must be chosen when starting or when an existing leader experiences heart-beat failure.
   - Nodes transition between three states: *Follower*, *Candidate*, and *Leader*.
   - Randomized election timers (between 150ms and 300ms) prevent split-vote scenarios where candidate split occurs.

2. **Log Replication:**
   - The leader accepts log entries from clients and replicates them across all follower nodes via AppendEntries RPCs.
   - An entry is deemed committed once it is replicated on a quorum (majority) of servers:
     \`\`\`math
     quorum = floor(N / 2) + 1
     \`\`\`

| State Variable | Persisted on Disk | Description |
|---|---|---|
| currentTerm | Yes | Latest term server has observed (starts at 0) |
| votedFor | Yes | Candidate ID that received vote in current term |
| log[] | Yes | Each entry contains command for state machine, term |
| commitIndex | No | Index of highest log entry known to be committed |
| lastApplied | No | Index of highest log entry applied to state machine |

Reference Source: Ongaro & Ousterhout, "In Search of an Understandable Consensus Algorithm" (USENIX ATC '14).`,
  },
  {
    id: 'json-schema',
    name: 'Structured JSON Schema',
    description: 'OpenAPI 3.1 schema definition with nested properties & validations',
    content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ModelInferencePayload",
  "type": "object",
  "required": ["model", "messages", "max_tokens", "temperature"],
  "properties": {
    "model": {
      "type": "string",
      "enum": [
        "gpt-4o",
        "gpt-4o-mini",
        "o1",
        "o3-mini",
        "claude-3-7-sonnet",
        "claude-3-5-sonnet",
        "gemini-2-flash",
        "deepseek-r1"
      ],
      "description": "Identifier of the target foundation model"
    },
    "messages": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["role", "content"],
        "properties": {
          "role": {
            "type": "string",
            "enum": ["system", "user", "assistant", "tool"]
          },
          "content": {
            "type": "string",
            "minLength": 1
          },
          "tool_call_id": {
            "type": "string"
          }
        }
      }
    },
    "temperature": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 2.0,
      "default": 0.7
    },
    "max_tokens": {
      "type": "integer",
      "minimum": 1,
      "maximum": 128000
    },
    "stream": {
      "type": "boolean",
      "default": false
    }
  }
}`,
  },
  {
    id: 'multi-turn-chat',
    name: 'Multi-Turn Chat History',
    description: 'Simulated customer support and technical debug dialogue',
    content: `[User]
Our microservice running on AWS ECS Fargate is throwing 504 Gateway Timeout errors during high-traffic load spikes (around 2,000 req/sec). Here is our current configuration:
- Application Load Balancer timeout: 60 seconds
- Task memory: 2048 MB, Task CPU: 1024 (1 vCPU)
- Node.js 20 event loop latency spikes up to 4500ms
What are the primary bottleneck vectors we need to investigate first?

[Assistant]
Based on your metrics, the critical anomaly is **Node.js event loop latency spiking to 4500ms** on a single vCPU (1024 units). This indicates CPU starvation blocking the single-threaded event loop, preventing request headers and sockets from being served before the ALB timeout fires.

Here are the highest-impact remediation steps:
1. **Vertical / Horizontal Task Sizing**: 1 vCPU is too constrained for 2,000 req/sec unless clustered across at least 15–20 tasks. Run Node cluster mode across multiple vCPUs or scale min ECS tasks from 2 to 24.
2. **Synchronous Cryptographic or JSON Operations**: Profile with \`clinic.js doctor\` to verify whether oversized JSON payload parsing (\`JSON.parse\`) or synchronous crypto/JWT verification is blocking the loop.
3. **Database Connection Pool Exhaustion**: Check whether PostgreSQL/Redis connection pools are waiting on socket acquires. If pool size is capped at 10, pending promises queue up and stall throughput.

[User]
We just inspected our APM and saw heavy \`JSON.parse\` calls on a 15MB cache payload from Redis every 30 seconds. How should we stream or optimize this?`,
  },
  {
    id: 'code-refactor',
    name: 'Code Refactoring Request',
    description: 'Full TypeScript React component with state management and optimizations',
    content: `import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface MetricItem {
  timestamp: number;
  tokensProcessed: number;
  latencyMs: number;
  costUsd: number;
}

export function LiveAnalyticsDashboard({ endpointId }: { endpointId: string }) {
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [isLive, setIsLive] = useState<boolean>(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(async () => {
      try {
        const response = await fetch(\`/api/telemetry/\${endpointId}\`);
        if (!response.ok) throw new Error('Telemetry network failure');
        const data: MetricItem = await response.json();
        setMetrics((prev) => [...prev.slice(-99), data]);
      } catch (err) {
        console.error('Failed to poll telemetry:', err);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endpointId, isLive]);

  const summary = useMemo(() => {
    if (metrics.length === 0) return { totalTokens: 0, avgLatency: 0, totalCost: 0 };
    const totalTokens = metrics.reduce((acc, m) => acc + m.tokensProcessed, 0);
    const avgLatency = metrics.reduce((acc, m) => acc + m.latencyMs, 0) / metrics.length;
    const totalCost = metrics.reduce((acc, m) => acc + m.costUsd, 0);
    return { totalTokens, avgLatency: Math.round(avgLatency), totalCost };
  }, [metrics]);

  const handleReset = useCallback(() => {
    setMetrics([]);
  }, []);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-semibold text-white">Endpoint Telemetry</h2>
        <div className="flex gap-2">
          <button onClick={() => setIsLive((v) => !v)} className="px-3 py-1 rounded bg-slate-800 text-sm">
            {isLive ? 'Pause Stream' : 'Resume'}
          </button>
          <button onClick={handleReset} className="px-3 py-1 rounded bg-rose-900/40 text-rose-300 text-sm">
            Clear
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 font-mono text-sm">
        <div>Tokens: {summary.totalTokens.toLocaleString()}</div>
        <div>Avg Latency: {summary.avgLatency}ms</div>
        <div>Total Cost: \${summary.totalCost.toFixed(4)}</div>
      </div>
    </div>
  );
}`,
  },
];

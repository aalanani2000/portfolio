# How This Portfolio Works

This portfolio is itself a working RAG system (كيف يعمل المعرض) — the same architecture Abdulrahman builds for clients, applied to his own site.

## Architecture

Visitor → Next.js frontend (App Router, TypeScript, Tailwind, Framer Motion) → /api/chat route → retrieval over a local knowledge base → DeepSeek chat model (deepseek-chat via OpenAI-compatible API) → streamed grounded answer with sources.

## Retrieval pipeline

Markdown knowledge documents (CV facts, project documentation, experience, skills) are chunked by section at build time by scripts/build-kb. Each chunk gets an L2-normalized TF-IDF vector over a fixed vocabulary stored in src/kb/kb.json (sparse index-value pairs). At runtime the query is tokenized (Unicode-aware, Arabic-normalized), expanded with an Arabic↔English synonym map, vectorized in the same term space, and ranked by cosine similarity — retrieval runs fully in-memory on the server, no external vector database, mirroring the pattern used in his AL ROUF Task 3 service.

## Grounding rules

The assistant retrieves before answering; answers only from retrieved context; cites chunk titles as sources; explicitly refuses when information is unavailable; answers in the language of the question (Arabic or English); adapts depth to persona mode (Recruiter / Engineer / Student).

## Operations

DeepSeek API key kept server-side only (DEEPSEEK_API_KEY). Per-IP rate limiting protects cost. Streaming responses via NDJSON tokens.

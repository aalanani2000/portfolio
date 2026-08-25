# Abdulrahman Alanani — AI Engineer Portfolio

An interactive, bilingual (EN/AR) portfolio that behaves like a live AI system: boot sequence, telemetry spine, knowledge-graph skills map, 3D drone mission control, and a real RAG-powered assistant that answers questions about Abdulrahman from a grounded knowledge base.

> From model to production. From software to the physical world.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Framer Motion** (LazyMotion) + **React Three Fiber** (3D drone)
- **RAG assistant**: build-time TF-IDF index (`src/kb/kb.json`) + in-memory cosine retrieval + **DeepSeek** `deepseek-chat` streaming via `/api/chat`
- Full **EN ⇄ AR** i18n with automatic RTL, pre-hydration locale restore

## Getting started

```bash
npm install
cp .env.example .env   # add DEEPSEEK_API_KEY (server-side only)
npm run dev            # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Rebuilding the RAG knowledge base

Edit markdown sources in `src/kb/documents/*.md`, then:

```bash
node scripts/build-kb.ts
```

This re-chunks every document by section and regenerates the sparse TF-IDF vectors in `src/kb/kb.json` (committed, so no build-time services are needed).

## Deployment (Vercel)

1. Push to GitHub, import the repo in Vercel.
2. Add environment variable `DEEPSEEK_API_KEY`.
3. Deploy — everything else (fonts, KB index) is bundled at build time.

## Project structure

```
src/
├── app/            # App Router: page, layout, /api/chat
├── components/     # Hero, SkillsMap, ProjectsLab, DroneSection (+ drone/ 3D),
│                   # HowIThink, BuildWithMe, Journey, PortfolioArchitecture,
│                   # Contact, chat/, SignalSpine, VisitorModal …
├── content/data.ts # Bilingual entities: skills graph, pipelines, journey
├── i18n/           # en.ts / ar.ts dictionaries + LanguageProvider (RTL)
├── kb/             # documents/ (RAG sources) + kb.json (generated index)
└── lib/            # retrieval, useChat, tokenize, sound, visitor, use3d
scripts/build-kb.ts # KB chunker + indexer
```

## Notes

- The chatbot retrieves before answering, cites `[S1]…` sources, refuses when information is missing, and replies in the user's language (Arabic or English).
- Motion respects `prefers-reduced-motion`; the 3D drone falls back to a 2D schematic on low-power devices.
- Drone project is closed-source (university property) — all facts sourced from the official project report.

---

Designed & engineered by Abdulrahman Alanani · [LinkedIn](https://linkedin.com/in/abdulrahman-alanani) · [GitHub](https://github.com/aalanani2000)

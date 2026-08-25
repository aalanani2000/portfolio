# Project: AL ROUF AI Integration Platform

Repository: github.com/aalanani2000/al-rouf-ai-integration-assessment
Flagship project. End-to-end AI integration assessment for AL ROUF LED Lighting Technology Co. Three runnable subsystems, all Dockerized. Role: system architecture, API development, AI integration, workflow automation, testing, system integration (منصة تكامل ذكاء اصطناعي).

## Task 1: RFQ to CRM Automation

n8n workflow: webhook receives RFQ documents → OpenAI model extracts intent and structured fields → validation and merge with schema rules → CRM record persisted (survives restarts via Docker volumes) → bilingual English/Arabic client reply drafted → internal sales alert written. Tech: n8n, OpenAI API, Python concepts, REST webhooks, Docker.

## Task 2: Quotation Microservice

FastAPI service for product catalog lookup, quotation creation, quote retrieval by ID, bulk-discount pricing, SQLite persistence, Pydantic input validation at the boundary, clean route/logic separation, automated pytest suite (~12 tests), interactive OpenAPI docs at /docs, packaged as Docker image. Clear errors for unknown SKUs and invalid quantities.

## Task 3: Bilingual RAG Knowledge Service

FastAPI bilingual knowledge service over English and Arabic markdown documents (product specs, warranty policy, shipping terms): chunking → embeddings (OpenAI) cached locally → cosine-similarity retrieval → confidence gate that refuses out-of-scope questions BEFORE generation → grounded answer only from retrieved context with enforced source citations. Reduces hallucination risk by design (رفض الأسئلة خارج النطاق قبل التوليد).

## Engineering quality

Secrets via .env only; Pydantic rejects malformed input; threshold-based refusal logic; file-based persistence with Docker volumes; business logic separated from HTTP handlers.

import { NextRequest } from "next/server";
import { retrieve, type RetrievedChunk } from "@/lib/retrieval";

export const runtime = "nodejs";

const RATE_WINDOW_MS = 3 * 60 * 1000;
const RATE_MAX = 20;
const hits = new Map<string, { n: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { n: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.n += 1;
  return entry.n > RATE_MAX;
}

type Persona = "recruiter" | "engineer" | "student";

const PERSONA_RULES: Record<Persona, string> = {
  recruiter:
    "AUDIENCE: Recruiter. Be concise and outcome-focused. Lead with what Abdulrahman built and the measurable impact (numbers). Keep answers under ~150 words unless asked for more. End with a subtle pointer to relevant proof (project, metric, or contact) when useful.",
  engineer:
    "AUDIENCE: Engineer. Go technical: architecture, data flow, stack choices, tradeoffs, failure modes, testing strategy. Use precise terminology. Code-level detail is welcome when grounded in context. Keep structure tight.",
  student:
    "AUDIENCE: Student/learner. Explain clearly with simple analogies where helpful. Show how concepts connect to Abdulrahman's real projects so they can imitate the learning path. Encouraging tone.",
};

function buildSystemPrompt(persona: Persona, contexts: RetrievedChunk[]): string {
  const ctx = contexts
    .map((c, i) => `[S${i + 1}] (${c.title} — source:${c.source})\n${c.text}`)
    .join("\n\n---\n\n");

  return [
    "You are \"Abdulrahman AI\", the official portfolio assistant on Abdulrahman Alanani's portfolio website.",
    "You speak ABOUT Abdulrahman in third person — you are his portfolio assistant, not Abdulrahman himself.",
    "You never invent facts about him. Only use the CONTEXT below to answer.",
    "If the context does not contain the answer, say plainly that this information is not in the portfolio knowledge base and suggest contacting him directly. Never guess, never fabricate metrics.",
    `LANGUAGE: Reply in the SAME language as the user's last message (Arabic or English). If the user writes Arabic, reply fully in Arabic.`,
    "CITATIONS: When you state a fact from context, append its marker like [S1], [S2] after the sentence.",
    "STYLE: Professional, warm, confident. No emojis except the persona label. Markdown allowed (short paragraphs, bullets).",
    PERSONA_RULES[persona],
    "",
    "=== RETRIEVED CONTEXT ===",
    ctx,
    "=== END CONTEXT ===",
  ].join("\n");
}

type IncomingMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "local";

  if (rateLimited(ip)) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429 },
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "no_key" }, { status: 503 });
  }

  let body: { messages?: IncomingMessage[]; persona?: Persona };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-8);

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const persona: Persona =
    body.persona === "engineer" || body.persona === "student"
      ? body.persona
      : "recruiter";

  const question = history[history.length - 1].content;
  const contexts = retrieve(question, 5);
  const systemPrompt = buildSystemPrompt(persona, contexts);

  const sources = contexts.map((c, i) => ({
    key: `S${i + 1}`,
    title: c.title,
    score: Number(c.score.toFixed(3)),
  }));

  let upstreamBody: ReadableStream<Uint8Array> | null = null;
  let upstreamError: "no_credits" | "upstream_error" = "upstream_error";

  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          ...history.map((m) => ({ role: m.role, content: m.content })),
        ],
        temperature: 0.4,
        max_tokens: 800,
        stream: true,
      }),
    });

    if (res.ok && res.body) {
      upstreamBody = res.body;
    } else {
      try {
        await res.text();
      } catch {
        /* ignore */
      }
      if (res.status === 402) upstreamError = "no_credits";
    }
  } catch {
    upstreamError = "upstream_error";
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

      send({ t: "s", v: sources });

      if (!upstreamBody) {
        send({ t: "e", v: upstreamError });
        controller.close();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      const reader = upstreamBody.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const token: string | undefined = json?.choices?.[0]?.delta?.content;
              if (token) send({ t: "a", v: token });
            } catch {
              /* partial json line — ignore */
            }
          }
        }
        send({ t: "d" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

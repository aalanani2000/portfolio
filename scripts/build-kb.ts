import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tokenize } from "../src/lib/tokenize.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, "../src/kb/documents");
const OUT_FILE = join(__dirname, "../src/kb/kb.json");

type Chunk = {
  id: string;
  source: string;
  title: string;
  text: string;
  vector: [number, number][];
};

function chunkDocument(content: string): { title: string; text: string }[] {
  const sections = content.split(/\n(?=## )/g);
  const chunks: { title: string; text: string }[] = [];
  for (const section of sections) {
    const trimmed = section.trim();
    if (trimmed.length < 40) continue;
    const firstLine = trimmed.split("\n")[0].replace(/^#+\s*/, "");
    chunks.push({ title: firstLine, text: trimmed });
  }
  return chunks;
}

const docs = readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));
const allChunks: { id: string; source: string; title: string; text: string }[] = [];

for (const doc of docs) {
  const source = doc.replace(/\.md$/, "");
  const content = readFileSync(join(DOCS_DIR, doc), "utf8");
  const docTitle =
    content.split("\n").find((l) => l.startsWith("# "))?.replace(/^#\s*/, "") ??
    source;
  chunkDocument(content).forEach((c, i) => {
    const withDocTitle =
      c.title === docTitle
        ? c.text
        : `${docTitle}\n${docTitle}\n${c.text}`;
    allChunks.push({
      id: `${source}:${i}`,
      source,
      title: `${source.replace(/-/g, " ")} · ${c.title}`,
      text: withDocTitle,
    });
  });
}

const df = new Map<string, number>();
const chunkTokens = allChunks.map((c) => {
  const tokens = tokenize(`${c.title} ${c.text}`);
  const set = new Set(tokens);
  for (const t of set) df.set(t, (df.get(t) ?? 0) + 1);
  return tokens;
});

const N = allChunks.length;
const vocab = [...df.keys()].sort();
const vocabIdx = new Map(vocab.map((t, i) => [t, i]));
const idf = vocab.map((t) => Math.log((N + 1) / ((df.get(t) ?? 0) + 0.5)) + 1);

const chunks: Chunk[] = allChunks.map((c, ci) => {
  const tf = new Map<string, number>();
  for (const t of chunkTokens[ci]) tf.set(t, (tf.get(t) ?? 0) + 1);

  const pairs: [number, number][] = [];
  let norm = 0;
  for (const [term, count] of tf) {
    const idx = vocabIdx.get(term)!;
    const w = count * idf[idx];
    if (w > 0.01) {
      pairs.push([idx, w]);
      norm += w * w;
    }
  }
  norm = Math.sqrt(norm) || 1;
  return {
    id: c.id,
    source: c.source,
    title: c.title,
    text: c.text,
    vector: pairs
      .map(([idx, w]) => [idx, Number((w / norm).toFixed(4))] as [number, number])
      .sort((a, b) => a[0] - b[0]),
  };
});

const output = {
  builtAt: new Date().toISOString(),
  docCount: docs.length,
  chunkCount: N,
  vocabSize: vocab.length,
  vocab,
  idf: idf.map((v) => Number(v.toFixed(4))),
  chunks: chunks.map(({ vector, ...rest }) => ({ ...rest, vector })),
};

writeFileSync(OUT_FILE, JSON.stringify(output));

console.log(
  `KB built: ${output.docCount} docs → ${output.chunkCount} chunks, vocab=${output.vocabSize}, file=${(JSON.stringify(output).length / 1024).toFixed(1)}KB`,
);

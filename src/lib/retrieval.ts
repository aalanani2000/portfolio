import kbData from "@/kb/kb.json";
import { tokenize } from "./tokenize";

type SparsePair = [number, number];

type KBFile = {
  builtAt: string;
  docCount: number;
  chunkCount: number;
  vocabSize: number;
  vocab: string[];
  idf: number[];
  chunks: {
    id: string;
    source: string;
    title: string;
    text: string;
    vector: SparsePair[];
  }[];
};

const kb = kbData as unknown as KBFile;

export type RetrievedChunk = {
  id: string;
  source: string;
  title: string;
  text: string;
  score: number;
};

const vocabIndex = new Map<string, number>(kb.vocab.map((t, i) => [t, i]));

function queryVector(tokens: string[]): Map<number, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);

  const vec = new Map<number, number>();
  let norm = 0;
  for (const [term, count] of tf) {
    const idx = vocabIndex.get(term);
    if (idx === undefined) continue;
    const w = count * kb.idf[idx];
    vec.set(idx, w);
    norm += w * w;
  }
  norm = Math.sqrt(norm) || 1;
  for (const [idx, w] of vec) vec.set(idx, w / norm);
  return vec;
}

export function retrieve(query: string, k = 5): RetrievedChunk[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const qv = queryVector(tokens);
  if (qv.size === 0) return [];

  const scored = kb.chunks.map((chunk) => {
    let dot = 0;
    for (const [idx, w] of chunk.vector) {
      const qw = qv.get(idx);
      if (qw !== undefined) dot += qw * w;
    }
    return { id: chunk.id, source: chunk.source, title: chunk.title, text: chunk.text, score: dot };
  });

  scored.sort((a, b) => b.score - a.score);

  const MIN_SCORE = 0.06;
  const top = scored.filter((c) => c.score >= MIN_SCORE).slice(0, k);
  return top.length > 0 ? top : scored.slice(0, 2);
}

export function kbStats() {
  return {
    builtAt: kb.builtAt,
    docCount: kb.docCount,
    chunkCount: kb.chunkCount,
    vocabSize: kb.vocabSize,
  };
}

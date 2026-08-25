export const AR_DIACRITICS = /[\u064B-\u065F\u0670\u0640]/g;

const EN_STOPWORDS = new Set([
  "the","a","an","and","or","of","in","on","at","to","for","with","by","from","as",
  "is","are","was","were","be","been","being","it","its","this","that","these","those",
  "he","his","him","she","her","they","them","their","we","our","you","your","i","me","my",
  "what","which","who","whom","when","where","why","how","does","do","did","can","could",
  "will","would","should","has","have","had","not","no","but","if","then","than","so","about",
  "into","over","under","between","more","most","other","some","such","only","also",
]);

const AR_STOPWORDS = new Set([
  "في","من","على","عن","الى","إلى","مع","هذا","هذه","ذلك","التي","الذي","ما","لا","هل",
  "قد","كان","كانت","يكون","ان","أن","إن","او","أو","ثم","كما","بين","عند","بعد","قبل",
  "كل","بعض","غير","حيث","لكن","التى","هو","هي","هم","انا","أنا","انت","أنت",
]);

const SYNONYMS: Record<string, string[]> = {
  drone: ["uav", "quadcopter", "flight"],
  uav: ["drone"],
  quadcopter: ["drone"],
  cv: ["vision", "computer"],
  yolo: ["yolov8", "detection"],
  yolov8: ["yolo", "detection"],
  llm: ["llms", "language", "model"],
  llms: ["llm", "language", "model"],
  rag: ["retrieval", "augmented", "generation"],
  chatbot: ["assistant", "chat"],
  automation: ["automate", "n8n", "workflow"],
  workflow: ["automation", "n8n"],
  fastapi: ["api", "python", "microservice"],
  api: ["fastapi", "rest"],
  docker: ["container", "containerized"],
  fire: ["extinguishing", "detection"],
  extinguishing: ["fire", "afo", "suppression"],
  suppression: ["fire", "extinguishing"],

  "ذكاء": ["ai", "artificial"],
  "اصطناعي": ["ai", "artificial"],
  "الاصطناعي": ["ai", "artificial"],
  "درون": ["drone", "uav"],
  "طائرة": ["drone", "uav"],
  "طيران": ["drone", "flight"],
  "حرائق": ["fire", "detection"],
  "الحريق": ["fire"],
  "حريق": ["fire"],
  "إطفاء": ["extinguishing", "fire"],
  "الاطفاء": ["extinguishing", "fire"],
  "رؤية": ["vision", "computer"],
  "الحاسوبية": ["computer", "vision"],
  "نماذج": ["llm", "model", "language"],
  "اللغوية": ["llm", "language", "model"],
  "لغوية": ["llm", "language", "model"],
  "استرجاع": ["retrieval", "rag"],
  "تعلم": ["learning", "machine"],
  "الالة": ["machine", "learning"],
  "الآلة": ["machine", "learning"],
  "آلة": ["machine", "learning"],
  "عميق": ["deep", "learning"],
  "التعلم": ["learning", "machine"],
  "مشاريع": ["project", "projects"],
  "مشروع": ["project"],
  "المشاريع": ["project", "projects"],
  "مهارات": ["skills", "skill"],
  "خبرة": ["experience"],
  "الخبرة": ["experience"],
  "خبرته": ["experience"],
  "شهادات": ["certification", "certifications"],
  "تعليم": ["education", "degree"],
  "دراسته": ["education", "degree"],
  "اتصال": ["contact", "email"],
  "تواصل": ["contact", "email"],
  "ايميل": ["email", "contact"],
  "بريد": ["email", "contact"],
  "اعمال": ["projects", "work"],
  "أعمال": ["projects", "work"],
  "وظائف": ["roles", "jobs", "opportunities"],
  "ادوار": ["roles", "jobs"],
  "الأدوار": ["roles", "jobs"],
};

export function normalizeToken(token: string): string {
  return token
    .toLowerCase()
    .replace(AR_DIACRITICS, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

export function tokenize(text: string): string[] {
  const raw = text.match(/[\p{L}\p{N}]+/gu) ?? [];
  const out: string[] = [];
  for (const t of raw) {
    const norm = normalizeToken(t);
    if (norm.length < 2) continue;
    if (EN_STOPWORDS.has(norm) || AR_STOPWORDS.has(norm)) continue;
    out.push(norm);
    const syn = SYNONYMS[norm];
    if (syn) out.push(...syn);
  }
  return out;
}

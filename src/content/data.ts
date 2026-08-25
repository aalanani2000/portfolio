import type { L } from "@/i18n";

export type ProjectId = "alrouf" | "drone" | "llm-journey" | "ml-internship";

export const LINKS = {
  github: "https://github.com/aalanani2000",
  linkedin: "https://linkedin.com/in/abdulrahman-alanani",
  email: "aalanani.2000@gmail.com",
  repos: {
    alrouf: "https://github.com/aalanani2000/al-rouf-ai-integration-assessment",
    drone: "",
    llmJourney: "https://github.com/aalanani2000/llm-engineering-journey",
    mlInternship: "https://github.com/aalanani2000/ml-internship-project",
  },
};

export type PipelineNode = {
  id: string;
  label: L;
  detail: L;
  tech?: string;
};

export type Pipeline = {
  id: string;
  nodes: PipelineNode[];
};

export const ALROUF_PIPELINES: Pipeline[] = [
  {
    id: "t1",
    nodes: [
      {
        id: "intake",
        label: { en: "RFQ Webhook", ar: "استقبال RFQ" },
        detail: {
          en: "Inbound RFQ documents arrive through an n8n webhook endpoint, triggering the automation on every submission.",
          ar: "تصل مستندات طلبات التسعير عبر نقطة Webhook في n8n، ما يشغّل الأتمتة مع كل طلب جديد.",
        },
        tech: "n8n",
      },
      {
        id: "extract",
        label: { en: "AI Extraction", ar: "استخراج ذكي" },
        detail: {
          en: "An OpenAI model reads the RFQ and extracts intent plus structured fields — client, products, quantities, urgency.",
          ar: "يقرأ نموذج OpenAI الطلب ويستخرج الغرض والحقول المنظمة — العميل والمنتجات والكميات ودرجة الاستعجال.",
        },
        tech: "OpenAI",
      },
      {
        id: "validate",
        label: { en: "Validate & Merge", ar: "تحقق ودمج" },
        detail: {
          en: "AI-derived fields are merged with deterministic schema rules; malformed or missing data is rejected before persistence.",
          ar: "تُدمج الحقول المستخرجة مع قواعد مخطط صارمة؛ تُرفض البيانات الناقصة أو غير السليمة قبل الحفظ.",
        },
      },
      {
        id: "crm",
        label: { en: "CRM Record", ar: "سجل CRM" },
        detail: {
          en: "A structured record is persisted to the CRM store, surviving container restarts via Docker volumes.",
          ar: "يُحفظ سجل منظّم في مخزن CRM، ويبقى بعد إعادة تشغيل الحاويات عبر Docker Volumes.",
        },
      },
      {
        id: "reply",
        label: { en: "Bilingual Reply", ar: "رد ثنائي اللغة" },
        detail: {
          en: "Professional client responses are drafted in both English and Arabic, ready for review or direct send.",
          ar: "تُصاغ ردود احترافية للعميل بالعربية والإنجليزية، جاهزة للمراجعة أو الإرسال المباشر.",
        },
        tech: "OpenAI",
      },
      {
        id: "alert",
        label: { en: "Internal Alert", ar: "تنبيه داخلي" },
        detail: {
          en: "A sales alert is written so the team can follow up on urgent RFQs without watching the pipeline manually.",
          ar: "يُكتب تنبيه للمبيعات ليتمكن الفريق من متابعة الطلبات العاجلة دون مراقبة يدوية.",
        },
      },
    ],
  },
  {
    id: "t2",
    nodes: [
      {
        id: "request",
        label: { en: "Client Request", ar: "طلب العميل" },
        detail: {
          en: "REST calls hit the quotation endpoints — create quote, retrieve quote, catalog lookup.",
          ar: "تصل استدعاءات REST إلى نقاط نهاية الاقتباسات — إنشاء عرض، واسترجاعه، واستعلام الكتالوج.",
        },
      },
      {
        id: "api",
        label: { en: "FastAPI Layer", ar: "طبقة FastAPI" },
        detail: {
          en: "Pydantic schemas reject malformed input at the boundary; routes stay thin while business logic lives in dedicated modules.",
          ar: "ترفض مخططات Pydantic المدخلات غير السليمة عند الحدود؛ تبقى المسارات رقيقة بينما يعمل منطق الأعمال في وحدات مخصصة.",
        },
        tech: "FastAPI",
      },
      {
        id: "pricing",
        label: { en: "Pricing Engine", ar: "محرك التسعير" },
        detail: {
          en: "Product catalog lookup with bulk-discount calculation, returning clear errors for unknown SKUs or invalid quantities.",
          ar: "استعلام كتالوج المنتجات مع حساب خصومات الكميات، ويعيد أخطاء واضحة للرموز غير المعروفة أو الكميات غير الصالحة.",
        },
      },
      {
        id: "db",
        label: { en: "SQLite Store", ar: "مخزن SQLite" },
        detail: {
          en: "Quotes persist to SQLite; any stored quotation is retrievable by ID at any time.",
          ar: "تُحفظ عروض الأسعار في SQLite؛ يمكن استرجاع أي عرض محفوظ بمعرّفه في أي وقت.",
        },
        tech: "SQLite",
      },
      {
        id: "qa",
        label: { en: "Tests & Docs", ar: "اختبارات وتوثيق" },
        detail: {
          en: "Automated pytest suite covering catalog, quoting, and error paths, plus interactive OpenAPI documentation at /docs — packaged as a Docker image.",
          ar: "حزمة اختبارات pytest آلية تغطي الكتالوج والتسعير ومسارات الأخطاء، مع توثيق OpenAPI تفاعلي على المسار ‎/docs — معبأة كصورة Docker.",
        },
        tech: "pytest · Docker",
      },
    ],
  },
  {
    id: "t3",
    nodes: [
      {
        id: "docs",
        label: { en: "Documents EN/AR", ar: "مستندات عربي/إنجليزي" },
        detail: {
          en: "Markdown knowledge sources in both English and Arabic feed the service — product specs, warranty policy, shipping terms.",
          ar: "تغذي الخدمة مصادر معرفية بصيغة Markdown بالعربية والإنجليزية — مواصفات المنتجات وسياسة الضمان وشروط الشحن.",
        },
      },
      {
        id: "chunk",
        label: { en: "Chunking", ar: "التقطيع" },
        detail: {
          en: "Documents are split into retrievable passages sized for semantic search rather than raw file dumps.",
          ar: "تُقسَّم المستندات إلى مقاطع قابلة للاسترجاع بمقاسات مناسبة للبحث الدلالي بدلاً من الملفات الخام.",
        },
      },
      {
        id: "embed",
        label: { en: "Embeddings", ar: "التضمين" },
        detail: {
          en: "Passages are vectorized with OpenAI embeddings and cached locally, keeping repeated queries fast and cheap.",
          ar: "تُحوَّل المقاطعة إلى متجهات بتضمينات OpenAI وتُخزَّن مؤقتاً محلياً، ما يجعل الاستعلامات المتكررة أسرع وأرخص.",
        },
        tech: "OpenAI",
      },
      {
        id: "retrieve",
        label: { en: "Semantic Retrieval", ar: "استرجاع دلالي" },
        detail: {
          en: "Cosine similarity surfaces the most relevant passages for each question across both languages.",
          ar: "يكشف تشابه جيب التمام المقاطع الأكثر صلة بكل سؤال عبر اللغتين.",
        },
      },
      {
        id: "gate",
        label: { en: "Confidence Gate", ar: "بوابة الثقة" },
        detail: {
          en: "If retrieval confidence falls below threshold, the service refuses to answer — no generation without grounding.",
          ar: "إذا انخفضت ثقة الاسترجاع عن الحد المحدد، ترفض الخدمة الإجابة — لا توليد بدون سند.",
        },
      },
      {
        id: "answer",
        label: { en: "Cited Answer", ar: "إجابة موثقة" },
        detail: {
          en: "The LLM answers strictly from retrieved context with source citations attached to every claim.",
          ar: "يجيب النموذج اللغوي حصراً من السياق المسترجَع مع إلزام الاستشهاد بالمصدر لكل معلومة.",
        },
        tech: "LLM",
      },
    ],
  },
];

export const DRONE_PIPELINE: Pipeline = {
  id: "drone-chain",
  nodes: [
    {
      id: "cam",
      label: { en: "Camera Feed", ar: "البث المرئي" },
      detail: {
        en: "Onboard camera captures live video during autonomous flight over target areas.",
        ar: "تلتقط الكاميرا المدمجة بثاً مرئياً مباشراً أثناء الطيران الذاتي فوق المناطق المستهدفة.",
      },
    },
    {
      id: "yolo",
      label: { en: "YOLOv8 Inference", ar: "استدلال YOLOv8" },
      detail: {
        en: "A custom-trained YOLOv8 model runs real-time fire detection on the Raspberry Pi, trained on a prepared fire dataset (~754 validation images).",
        ar: "يعمل نموذج YOLOv8 مدرَّب خصيصاً على كشف الحرائق في الزمن الحقيقي داخل Raspberry Pi، بعد التدريب على مجموعة بيانات معدَّة (~754 صورة تحقق).",
      },
      tech: "YOLOv8 · OpenCV",
    },
    {
      id: "event",
      label: { en: "Detection Event", ar: "حدث الكشف" },
      detail: {
        en: "Confirmed detections trigger alerts with bounding boxes streamed to the ground station.",
        ar: "تطلق عمليات الكشف المؤكدة تنبيهات مع إرسال صناديق الإحاطة إلى المحطة الأرضية.",
      },
    },
    {
      id: "rpi",
      label: { en: "Pi Orchestration", ar: "تنسيق Raspberry Pi" },
      detail: {
        en: "The Raspberry Pi 3 coordinates vision inference, serial communication, and mission logic as the onboard compute hub.",
        ar: "ينسّق Raspberry Pi 3 بين الاستدلال البصري والتواصل التسلسلي ومنطق المهمة بوصفه مركز الحوسبة على متن الطائرة.",
      },
    },
    {
      id: "apm",
      label: { en: "Flight Control", ar: "تحكم الطيران" },
      detail: {
        en: "The APM 2.8 flight controller executes navigation while Mission Planner monitors telemetry from the ground; a PS4 controller provides manual override via Pygame.",
        ar: "تنفذ وحدة APM 2.8 الملاحة بينما تراقب Mission Planner بيانات القياس من الأرض؛ وتتيح يد PS4 تجاوزاً يدوياً عبر Pygame.",
      },
    },
    {
      id: "drop",
      label: { en: "Payload Release", ar: "إسقاط الحمولة" },
      detail: {
        en: "On confirmed detection, the system directs an APM-controlled maneuver to release the AFO fire-extinguishing ball over the fire site — non-toxic ABC dry powder disperses within seconds of flame contact.",
        ar: "عند تأكيد الكشف، يوجّه النظام مناورة موجّهة عبر وحدة APM لإسقاط كرة إطفاء AFO فوق موقع الحريق — يتطاير مسحوق ABC غير السام خلال ثوانٍ من ملامسة اللهب.",
      },
      tech: "AFO Ball",
    },
  ],
};

export const DRONE_METRICS = [
  { key: "map50", value: "≈ 0.824" },
  { key: "precision", value: "≈ 0.83" },
  { key: "images", value: "~754" },
  { key: "grade", value: "A+" },
] as const;

export const DRONE_HARDWARE: L[] = [
  { en: "Raspberry Pi 3 — onboard compute hub", ar: "Raspberry Pi 3 — مركز الحوسبة على المتن" },
  { en: "APM 2.8 · ArduCopter autopilot", ar: "APM 2.8 · طيار آلي ArduCopter" },
  { en: "4× 2200kV brushless motors + PWM ESCs", ar: "4 محركات Brushless بقوة 2200kV مع منظومات PWM ESC" },
  { en: "LiPo battery · power distribution · voltage regulator", ar: "بطارية LiPo · توزيع قدرة · منظم جهد" },
  { en: "Aluminum frame · Raspberry Pi camera", ar: "هيكل ألمنيوم · كاميرا Raspberry Pi" },
];

export const DRONE_SOFTWARE: L[] = [
  { en: "Python · YOLOv8 · OpenCV", ar: "Python · YOLOv8 · OpenCV" },
  { en: "Mission Planner — motor/ESC/compass calibration & ground station", ar: "Mission Planner — معايرة المحركات وESC والبوصلة، ومحطة أرضية" },
  { en: "Pygame + pySerial — PS4 control link to APM 2.8", ar: "Pygame + pySerial — ربط تحكم PS4 بوحدة APM 2.8" },
  { en: "Real-time detection alerts with bounding boxes", ar: "تنبيهات كشف فورية مع صناديق إحاطة" },
];

export const ML_METRICS = [
  { label: { en: "House price R²", ar: "R² لأسعار المساكن" }, value: "0.66" },
  { label: { en: "Sentiment accuracy", ar: "دقة تصنيف المشاعر" }, value: "0.80" },
  { label: { en: "Churn accuracy", ar: "دقة توقع التسرب" }, value: "0.95" },
  { label: { en: "Churn ROC AUC", ar: "ROC AUC للتسرب" }, value: "0.886" },
] as const;

export const EXPERIENCE_REFS: Record<
  string,
  { title: L; org: L; period: L; points: L[] }
> = {
  monitoring: {
    title: {
      en: "AI/ML Systems Support Engineer",
      ar: "مهندس دعم أنظمة AI/ML",
    },
    org: { en: "Problem Solver Org. / Future of Egypt", ar: "Problem Solver Org. / Future of Egypt" },
    period: { en: "Dec 2024 – Dec 2025 · Cairo", ar: "ديسمبر 2024 – ديسمبر 2025 · القاهرة" },
    points: [
      {
        en: "Built and deployed an anomaly detection model for IT infrastructure monitoring, contributing to ~15% downtime reduction.",
        ar: "بنى ونشر نموذج كشف شذوذ لمراقبة البنية التحتية لتقنية المعلومات، مساهماً في خفض زمن التعطل بنحو 15٪.",
      },
      {
        en: "Automated diagnostics and troubleshooting workflows in Python, improving incident resolution speed by ~20%.",
        ar: "أتمت عمليات التشخيص وحل المشكلات باستخدام Python، محسناً سرعة حل الحوادث بنحو 20٪.",
      },
      {
        en: "Maintained ~95% first-contact resolution across 200+ supported incidents per month.",
        ar: "حافظ على نسبة حل من أول اتصال بنحو 95٪ عبر أكثر من 200 حادثة شهرياً.",
      },
    ],
  },
};

export type HubId = "aiml" | "genai" | "backend" | "auto" | "robotics";

export const HUBS: { id: HubId; label: L }[] = [
  { id: "aiml", label: { en: "AI / ML", ar: "ذكاء اصطناعي / تعلم آلة" } },
  { id: "genai", label: { en: "Generative AI", ar: "ذكاء توليدي" } },
  { id: "backend", label: { en: "Engineering", ar: "هندسة البرمجيات" } },
  { id: "auto", label: { en: "Automation", ar: "أتمتة" } },
  { id: "robotics", label: { en: "Robotics & Edge", ar: "روبوتات والحافة" } },
];

export type Evidence =
  | { kind: "project"; id: ProjectId }
  | { kind: "experience"; id: keyof typeof EXPERIENCE_REFS };

export type Skill = {
  id: string;
  hub: HubId;
  label: L;
  evidence: Evidence[];
};

export const SKILLS: Skill[] = [
  { id: "ml", hub: "aiml", label: { en: "Machine Learning", ar: "تعلم الآلة" }, evidence: [{ kind: "project", id: "ml-internship" }, { kind: "experience", id: "monitoring" }] },
  { id: "dl", hub: "aiml", label: { en: "Deep Learning", ar: "التعلم العميق" }, evidence: [{ kind: "project", id: "ml-internship" }] },
  { id: "cv", hub: "aiml", label: { en: "Computer Vision", ar: "الرؤية الحاسوبية" }, evidence: [{ kind: "project", id: "drone" }] },
  { id: "yolo", hub: "aiml", label: { en: "YOLOv8", ar: "YOLOv8" }, evidence: [{ kind: "project", id: "drone" }] },
  { id: "anomaly", hub: "aiml", label: { en: "Anomaly Detection", ar: "كشف الشذوذ" }, evidence: [{ kind: "experience", id: "monitoring" }] },

  { id: "llms", hub: "genai", label: { en: "LLMs", ar: "النماذج اللغوية" }, evidence: [{ kind: "project", id: "llm-journey" }] },
  { id: "rag", hub: "genai", label: { en: "RAG", ar: "RAG" }, evidence: [{ kind: "project", id: "alrouf" }] },
  { id: "openai", hub: "genai", label: { en: "OpenAI APIs", ar: "واجهات OpenAI" }, evidence: [{ kind: "project", id: "alrouf" }, { kind: "project", id: "llm-journey" }] },
  { id: "ollama", hub: "genai", label: { en: "Ollama · Local LLMs", ar: "نماذج محلية Ollama" }, evidence: [{ kind: "project", id: "llm-journey" }] },
  { id: "prompt", hub: "genai", label: { en: "Prompt Engineering", ar: "هندسة الموجّهات" }, evidence: [{ kind: "project", id: "llm-journey" }] },
  { id: "embeddings", hub: "genai", label: { en: "Embeddings", ar: "التضمينات" }, evidence: [{ kind: "project", id: "alrouf" }] },

  { id: "python", hub: "backend", label: { en: "Python", ar: "Python" }, evidence: [{ kind: "project", id: "alrouf" }, { kind: "project", id: "drone" }, { kind: "project", id: "llm-journey" }, { kind: "project", id: "ml-internship" }] },
  { id: "fastapi", hub: "backend", label: { en: "FastAPI", ar: "FastAPI" }, evidence: [{ kind: "project", id: "alrouf" }] },
  { id: "rest", hub: "backend", label: { en: "REST APIs", ar: "واجهات REST" }, evidence: [{ kind: "project", id: "alrouf" }] },
  { id: "sql", hub: "backend", label: { en: "SQLite · SQL", ar: "SQLite · SQL" }, evidence: [{ kind: "project", id: "alrouf" }] },
  { id: "docker", hub: "backend", label: { en: "Docker", ar: "Docker" }, evidence: [{ kind: "project", id: "alrouf" }] },

  { id: "n8n", hub: "auto", label: { en: "n8n", ar: "n8n" }, evidence: [{ kind: "project", id: "alrouf" }] },
  { id: "webhooks", hub: "auto", label: { en: "Webhooks", ar: "Webhooks" }, evidence: [{ kind: "project", id: "alrouf" }] },
  { id: "workflows", hub: "auto", label: { en: "AI Workflows", ar: "مسارات ذكية" }, evidence: [{ kind: "project", id: "alrouf" }] },
  { id: "integrations", hub: "auto", label: { en: "System Integration", ar: "تكامل الأنظمة" }, evidence: [{ kind: "project", id: "alrouf" }, { kind: "experience", id: "monitoring" }] },

  { id: "rpi", hub: "robotics", label: { en: "Raspberry Pi", ar: "Raspberry Pi" }, evidence: [{ kind: "project", id: "drone" }] },
  { id: "flight", hub: "robotics", label: { en: "Flight Systems", ar: "أنظمة الطيران" }, evidence: [{ kind: "project", id: "drone" }] },
  { id: "edge", hub: "robotics", label: { en: "Edge AI", ar: "ذكاء الحافة" }, evidence: [{ kind: "project", id: "drone" }] },
  { id: "hardware", hub: "robotics", label: { en: "Embedded Hardware", ar: "عتاد مدمج" }, evidence: [{ kind: "project", id: "drone" }] },
];

export type ThinkStage = {
  id: string;
  label: L;
  detail: L;
  example: L;
};

export const THINK_STAGES: ThinkStage[] = [
  {
    id: "detect",
    label: { en: "Problem Detected", ar: "اكتشاف المشكلة" },
    detail: {
      en: "Spot the signal in noise — define what actually broke before touching anything.",
      ar: "التقاط الإشارة من بين الضجيج — تحديد ما انكسر فعلاً قبل لمس أي شيء.",
    },
    example: {
      en: "200+ monthly IT incidents hid recurring failure patterns no one had quantified.",
      ar: "أكثر من 200 حادثة شهرية أخفيت أنماط أعطال متكررة لم يحدها أحد.",
    },
  },
  {
    id: "understand",
    label: { en: "Understand the System", ar: "فهم النظام" },
    detail: {
      en: "Map data flows, dependencies, and constraints before forming opinions.",
      ar: "رسم مسارات البيانات والاعتماديات والقيود قبل تكوين الآراء.",
    },
    example: {
      en: "Mapped the monitoring stack end-to-end before designing the anomaly model's inputs.",
      ar: "رسم منظومة المراقبة كاملة قبل تصميم مدخلات نموذج كشف الشذوذ.",
    },
  },
  {
    id: "decompose",
    label: { en: "Break Down the Problem", ar: "تفكيك المشكلة" },
    detail: {
      en: "Split the vague into testable pieces; each piece gets an owner metric.",
      ar: "تقسيم الغامض إلى أجزاء قابلة للاختبار؛ لكل جزء مؤشر قياس خاص به.",
    },
    example: {
      en: "Drone project split into dataset / vision / flight / integration tracks that could fail independently.",
      ar: "قُسّم مشروع الدرون إلى مسارات: بيانات، ورؤية، وطيران، وتكامل — يمكن أن يفشل كل منها باستقلالية.",
    },
  },
  {
    id: "research",
    label: { en: "Research & Experiment", ar: "بحث وتجريب" },
    detail: {
      en: "Read what exists, then run small cheap experiments to kill wrong assumptions fast.",
      ar: "قراءة الموجود، ثم تجارب صغيرة رخيصة لإسكات الافتراضات الخاطئة بسرعة.",
    },
    example: {
      en: "Compared detection approaches before committing to YOLOv8 for onboard inference limits.",
      ar: "مقارنة مقاربات الكشف قبل اختيار YOLOv8 نظراً لحدود الاستدلال على المتن.",
    },
  },
  {
    id: "prototype",
    label: { en: "Build Prototype", ar: "بناء النموذج الأولي" },
    detail: {
      en: "Ugly-but-running beats beautiful-but-theoretical. Wire the full path first, polish later.",
      ar: "القبيح العامل يتفوق على الجميل النظري. أوصِل المسار كاملاً أولاً ثم اقلح.",
    },
    example: {
      en: "First drone prototype flew with a stub detector before the real YOLOv8 existed.",
      ar: "طار أول نموذج أولي للدرون بكاشف مؤقت قبل جاهزية YOLOv8 الفعلي.",
    },
  },
  {
    id: "measure",
    label: { en: "Test & Measure", ar: "اختبار وقياس" },
    detail: {
      en: "Numbers or it didn't happen. Define metrics before training/building, not after.",
      ar: "بلا أرقام فلم يحدث شيء. حدد المقاييس قبل البناء لا بعده.",
    },
    example: {
      en: "mAP@50 ≈ 0.824 on ~754 validation images; R²/ROC AUC per internship task.",
      ar: "mAP@50 ≈ 0.824 على ~754 صورة تحقق؛ وR²/ROC AUC لكل مهمة تدريب.",
    },
  },
  {
    id: "iterate",
    label: { en: "Iterate", ar: "التكرار" },
    detail: {
      en: "Let measured gaps drive the next change — not taste, not hype.",
      ar: "دع الفجوات المقاسة تقود التغيير التالي — لا الذوق ولا الصيج.",
    },
    example: {
      en: "Retrained after class-imbalance analysis showed weak minority recall.",
      ar: "أعيد التدريب بعد أن أظهر تحليل اختلال التوازن ضعفاً في استرجاع الطبقة الأقلية.",
    },
  },
  {
    id: "ship",
    label: { en: "Deploy", ar: "النشر" },
    detail: {
      en: "A finished system is one running somewhere real — containerized, monitored, documented.",
      ar: "النظام المكتمل هو ما يعمل في مكان حقيقي — معباً، ومراقَب، وموثّق.",
    },
    example: {
      en: "AL ROUF subsystems shipped as Docker services with tests and OpenAPI docs.",
      ar: "سلّمت أنظمة AL ROUF خدمات Docker مع اختبارات وتوثيق OpenAPI.",
    },
  },
];

export type JourneyEntry = {
  period: string;
  title: L;
  desc: L;
  tags: string[];
};

export type Cert = { name: L; issuer: L; ongoing?: boolean };

export const CERTS: Cert[] = [
  {
    name: { en: "LLMOps Specialization", ar: "تخصص LLMOps" },
    issuer: { en: "DeepLearning.AI", ar: "DeepLearning.AI" },
  },
  {
    name: { en: "LLM Engineering — Full Stack AI Applications", ar: "هندسة النماذج اللغوية — تطبيقات ذكاء اصطناعي متكاملة" },
    issuer: { en: "Ongoing program", ar: "برنامج مستمر" },
    ongoing: true,
  },
  {
    name: { en: "OCI 2025 AI Foundations Associate", ar: "OCI 2025 AI Foundations Associate" },
    issuer: { en: "Oracle", ar: "Oracle" },
  },
  {
    name: { en: "Machine Learning Foundations", ar: "أساسيات تعلم الآلة" },
    issuer: { en: "AWS Educate", ar: "AWS Educate" },
  },
  {
    name: { en: "Introducing Generative AI with AWS", ar: "مقدمة في الذكاء التوليدي مع AWS" },
    issuer: { en: "Udacity", ar: "Udacity" },
  },
  {
    name: { en: "Artificial Intelligence Diploma", ar: "دبلوم الذكاء الاصطناعي" },
    issuer: { en: "ITI Cairo", ar: "ITI القاهرة" },
  },
];

export const JOURNEY: JourneyEntry[] = [
  {
    period: "2018 – 2024",
    title: { en: "Computer & Systems Engineering", ar: "هندسة الحاسبات والأنظمة" },
    desc: {
      en: "B.Eng. at Badr University in Cairo — software, embedded systems, and the foundations of intelligent systems.",
      ar: "بكالوريوس هندسة بجامعة بدر بالقاهرة — برمجيات وأنظمة مدمجة وأساسات الأنظمة الذكية.",
    },
    tags: ["B.Eng.", "Embedded", "Systems"],
  },
  {
    period: "2024",
    title: { en: "Fire Detection Drone — Grade A+", ar: "درون كشف الحرائق — تقدير A+" },
    desc: {
      en: "Led CV + flight integration for a six-person graduation project: YOLOv8 onboard a Raspberry Pi, mAP@50 ≈ 0.824.",
      ar: "قيادة مساري الرؤية وتكامل الطيران بمشروع تخرج من ستة أعضاء: YOLOv8 على Raspberry Pi بدقة mAP@50 ≈ 0.824.",
    },
    tags: ["YOLOv8", "Raspberry Pi", "APM 2.8"],
  },
  {
    period: "Dec 2024 – Dec 2025",
    title: { en: "AI/ML Systems Support Engineer", ar: "مهندس دعم أنظمة AI/ML" },
    desc: {
      en: "Problem Solver Org. / Future of Egypt — anomaly detection for IT infrastructure (~15% downtime cut), automated diagnostics (~20% faster resolution), 95% FCR across 200+ incidents/month.",
      ar: "Problem Solver Org. / Future of Egypt — كشف شذوذ للبنية التحتية (خفض تعطل ~15٪)، وأتمتة تشخيص (تسريع حل ~20٪)، وحل من أول اتصال بنسبة 95٪ عبر أكثر من 200 حادثة شهرياً.",
    },
    tags: ["Anomaly Detection", "Python", "Automation"],
  },
  {
    period: "2025",
    title: { en: "AL ROUF AI Integration Platform", ar: "منصة تكامل AL ROUF الذكية" },
    desc: {
      en: "Three production-style subsystems delivered: RFQ→CRM automation, quotation microservice, bilingual RAG with refusal logic.",
      ar: "تسليم ثلاثة أنظمة فرعية إنتاجية: أتمتة RFQ→CRM، وخدمة اقتباسات مصغرة، وRAG ثنائي اللغة مع منطق رفض.",
    },
    tags: ["n8n", "FastAPI", "RAG", "Docker"],
  },
];

export type BuildGoal =
  | "chatbot"
  | "rag"
  | "vision"
  | "automation"
  | "app"
  | "fullstack"
  | "backend"
  | "dataml";

export const BUILD_PIPELINES: Partial<Record<BuildGoal, Pipeline>> = {
  chatbot: {
    id: "bp-chatbot",
    nodes: [
      { id: "q", label: { en: "User Query", ar: "سؤال المستخدم" }, detail: { en: "Capture intent and context from the user's message.", ar: "التقاط الغرض والسياق من رسالة المستخدم." } },
      { id: "prompt", label: { en: "System Prompt Design", ar: "تصميم موجّه النظام" }, detail: { en: "Persona, tone, guardrails and output format defined server-side.", ar: "الشخصية والنبرة والحواجز وصيغة المخرجات تُعرَّف من جهة الخادم." }, tech: "Prompt Eng." },
      { id: "llm", label: { en: "LLM Backend", ar: "خلفية LLM" }, detail: { en: "Cloud API or local Ollama depending on cost, privacy and latency needs.", ar: "واجهة سحابية أو Ollama محلي بحسب متطلبات التكلفة والخصوصية والزمن." }, tech: "DeepSeek · Ollama" },
      { id: "stream", label: { en: "Streaming UX", ar: "تجربة بث مباشر" }, detail: { en: "Token-level streaming to the UI so answers feel instant.", ar: "بث على مستوى الرموز إلى الواجهة لتُحسّ الإجابات فورية." } },
      { id: "guard", label: { en: "Guardrails & Memory", ar: "حواجز وذاكرة" }, detail: { en: "Rate limiting, refusal rules, and conversation history bounds.", ar: "تحديد معدل، وقواعد رفض، وحدود لسجل المحادثة." } },
    ],
  },
  rag: {
    id: "bp-rag",
    nodes: [
      { id: "docs", label: { en: "Documents", ar: "المستندات" }, detail: { en: "Ingest domain knowledge in any language (AR/EN).", ar: "استيعاب المعرفة التخصصية بأي لغة (عربي/إنجليزي)." } },
      { id: "chunk", label: { en: "Chunking", ar: "التقطيع" }, detail: { en: "Section-aware splitting sized for semantic retrieval.", ar: "تقطيع واعٍ بالعناوين بمقاسات تناسب الاسترجاع الدلالي." } },
      { id: "embed", label: { en: "Embeddings + Index", ar: "تضمين وفهرسة" }, detail: { en: "Vectorize once, cache, keep retrieval fully in-memory when scale allows.", ar: "تمثيل متجهي مرة واحدة مع تخزين مؤقت، واسترجاع داخل الذاكرة عندما يسمح الحجم." }, tech: "TF-IDF · Embeddings" },
      { id: "retrieve", label: { en: "Retrieve", ar: "الاسترجاع" }, detail: { en: "Cosine similarity top-k with synonym-aware query expansion.", ar: "أعلى k بتشابه جيب التمام مع توسيع استعلام بالمرادفات." } },
      { id: "gate", label: { en: "Confidence Gate", ar: "بوابة الثقة" }, detail: { en: "Refuse out-of-scope questions before generation ever runs.", ar: "رفض الأسئلة خارج النطاق قبل أي توليد." } },
      { id: "answer", label: { en: "Cited Answer", ar: "إجابة موثقة" }, detail: { en: "Grounded response with [S1]-style source citations attached.", ar: "إجابة مبنية على السياق مع استشهادات مصادر بصيغة [S1]." }, tech: "LLM" },
    ],
  },
  vision: {
    id: "bp-vision",
    nodes: [
      { id: "feed", label: { en: "Camera Feed", ar: "بث الكاميرا" }, detail: { en: "Frames from static cameras, drones, or edge devices.", ar: "إطارات من كاميرات ثابتة أو طائرات أو أجهزة حافة." } },
      { id: "prep", label: { en: "Preprocessing", ar: "معالجة تمهيدية" }, detail: { en: "Resize, normalize, augment — consistent with training pipeline.", ar: "تحجيم وتطبيع وإغناء — بما يتسق مع خط التدريب." }, tech: "OpenCV" },
      { id: "model", label: { en: "Trained Detector", ar: "كاشف مدرَّب" }, detail: { en: "Custom-trained object detector validated on held-out data.", ar: "كاشف كائنات مدرَّب خصيصاً ومتحقق منه على بيانات مستقلة." }, tech: "YOLOv8" },
      { id: "edge", label: { en: "Edge Inference", ar: "استدلال الحافة" }, detail: { en: "Real-time inference on-device (Raspberry Pi class) where latency matters.", ar: "استدلال فوري على الجهاز (فئة Raspberry Pi) حين يكون الزمن حرجاً." } },
      { id: "act", label: { en: "Alerts & Actions", ar: "تنبيهات وأفعال" }, detail: { en: "Bounding-box alerts, telemetry, downstream automation hooks.", ar: "تنبيهات بصناديق إحاطة وقياسات ونقاط ربط للأتمتة اللاحقة." } },
    ],
  },
  automation: {
    id: "bp-auto",
    nodes: [
      { id: "trigger", label: { en: "Trigger", ar: "المُطلِق" }, detail: { en: "Webhook, email, form submission, schedule — events start the flow.", ar: "Webhook أو بريد أو نموذج أو جدولة — الأحداث تبدأ المسار." }, tech: "n8n" },
      { id: "parse", label: { en: "Parse & Validate", ar: "تحليل وتحقق" }, detail: { en: "Schema checks before anything touches downstream systems.", ar: "فحوص مخطط قبل أن يلامس أي شيء الأنظمة اللاحقة." } },
      { id: "ai", label: { en: "AI Extraction", ar: "استخراج ذكي" }, detail: { en: "LLMs turn unstructured text into structured fields.", ar: "تحويل النماذج اللغوية النص غير المنظم إلى حقول منظمة." }, tech: "OpenAI" },
      { id: "system", label: { en: "System Update", ar: "تحديث النظام" }, detail: { en: "Write to CRM/ERP/storage with durable persistence.", ar: "كتابة إلى CRM/ERP/التخزين بحفظ دائم." } },
      { id: "notify", label: { en: "Notifications", ar: "الإشعارات" }, detail: { en: "Bilingual drafts and internal alerts close the loop.", ar: "مسودات ثنائية اللغة وتنبيهات داخلية تُغلق الحلقة." } },
    ],
  },
  app: {
    id: "bp-app",
    nodes: [
      { id: "define", label: { en: "Define", ar: "التعريف" }, detail: { en: "One measurable job-to-be-done; scope ruthlessly.", ar: "مهمة واحدة قابلة للقياس؛ نطاق صارم." } },
      { id: "backend", label: { en: "FastAPI Core", ar: "نواة FastAPI" }, detail: { en: "Typed routes, Pydantic validation, SQL persistence, tests.", ar: "مسارات مكتوبة الأنواع وتحقق Pydantic وحفظ SQL واختبارات." }, tech: "FastAPI · SQLite" },
      { id: "ailayer", label: { en: "AI Layer", ar: "طبقة الذكاء" }, detail: { en: "LLM/RAG features behind clean interfaces, keys server-side only.", ar: "خصائص LLM/RAG خلف واجهات نظيفة، والمفاتيح في الخادم فقط." } },
      { id: "frontend", label: { en: "Streaming Frontend", ar: "واجهة بث" }, detail: { en: "Next.js + TypeScript UI with realtime token streams.", ar: "واجهة Next.js + TypeScript مع بث رموز لحظي." }, tech: "Next.js" },
      { id: "ship", label: { en: "Tested & Deployed", ar: "مختبر ومنشور" }, detail: { en: "pytest suite, Docker packaging, CI-ready structure.", ar: "حزمة pytest وتعبئة Docker وبنية جاهزة للتكامل المستمر." }, tech: "pytest · Docker" },
    ],
  },
};

BUILD_PIPELINES.fullstack = {
  id: "bp-fullstack",
  nodes: [
    { id: "spec", label: { en: "Spec & Schema", ar: "المواصفات والمخطط" }, detail: { en: "Feature scope, data model, and API contract defined before code.", ar: "نطاق الميزة ونموذج البيانات وعقد الـ API تُعرَّف قبل الكود." } },
    { id: "db", label: { en: "Database Layer", ar: "طبقة قاعدة البيانات" }, detail: { en: "Typed schema, migrations, and seed data (SQL/SQLite/Postgres).", ar: "مخطط مكتوب الأنواع مع ترحيلات وبيانات أولية (SQL/SQLite/Postgres)." }, tech: "SQL" },
    { id: "api", label: { en: "API Layer", ar: "طبقة الـ API" }, detail: { en: "Validated routes with clean separation of business logic.", ar: "مسارات متحقق منها بفصل نظيف لمنطق الأعمال." }, tech: "Next.js · FastAPI" },
    { id: "ui", label: { en: "Frontend", ar: "الواجهة" }, detail: { en: "Server components by default, client islands where interaction lives.", ar: "مكونات خادمية افتراضياً وجزر تفاعلية حيث تلزم." }, tech: "React · Tailwind" },
    { id: "qa", label: { en: "Tests & Deploy", ar: "اختبار ونشر" }, detail: { en: "Automated tests, type safety gate, then ship.", ar: "اختبارات آلية وبوابة سلامة أنواع ثم النشر." }, tech: "pytest · CI" },
  ],
};

BUILD_PIPELINES.backend = {
  id: "bp-backend",
  nodes: [
    { id: "contract", label: { en: "API Contract", ar: "عقد الـ API" }, detail: { en: "OpenAPI-first design: resources, errors, and versioning decided upfront.", ar: "تصميم OpenAPI أولاً: الموارد والأخطاء والنسخ تُحدد مسبقاً." }, tech: "OpenAPI" },
    { id: "routes", label: { en: "Route Handlers", ar: "معالجات المسارات" }, detail: { en: "Thin validated endpoints over isolated service modules.", ar: "نقاط نهاية رقيقة متحقق منها فوق وحدات خدمات معزولة." }, tech: "FastAPI" },
    { id: "domain", label: { en: "Domain Logic", ar: "منطق الأعمال" }, detail: { en: "Pure, testable functions for pricing, rules, and workflows.", ar: "دوال نقية قابلة للاختبار للتسعير والقواعد والمسارات." } },
    { id: "persist", label: { en: "Persistence", ar: "الحفظ" }, detail: { en: "SQL storage with migrations and safe error mapping.", ar: "تخزين SQL مع ترحيلات وربط آمن للأخطاء." }, tech: "SQLite · Postgres" },
    { id: "verify", label: { en: "Test Suite", ar: "حزمة الاختبارات" }, detail: { en: "pytest coverage for happy paths and failure modes, Dockerized.", ar: "تغطية pytest للمسارات السليمة وأنماط الفشل، مع تعبئة Docker." }, tech: "pytest · Docker" },
  ],
};

BUILD_PIPELINES.dataml = {
  id: "bp-dataml",
  nodes: [
    { id: "collect", label: { en: "Collect", ar: "الجمع" }, detail: { en: "Source identification, ingestion scripts, and raw-data versioning.", ar: "تحديد المصادر وسكربتات الاستيعاب ونسخ البيانات الخام." } },
    { id: "clean", label: { en: "Clean & Explore", ar: "تنظيف واستكشاف" }, detail: { en: "EDA notebooks, missing-value strategy, distribution checks.", ar: "دفاتر استكشاف واستراتيجية للقيم المفقودة وفحوص التوزيع." }, tech: "pandas" },
    { id: "features", label: { en: "Features", ar: "الخصائص" }, detail: { en: "Encoding, scaling, and leakage-safe splits.", ar: "ترميز وتطبيع وتقسيمات خالية من التسرب." }, tech: "scikit-learn" },
    { id: "train", label: { en: "Train & Evaluate", ar: "تدريب وتقييم" }, detail: { en: "Baseline first, then iterate against held-out metrics (R2, F1, AUC).", ar: "خط أساس أولاً ثم تكرار مقابل مقاييس محجوزة (R2، F1، AUC)." }, tech: "scikit-learn" },
    { id: "serve", label: { en: "Persist & Serve", ar: "الحفظ والخدمة" }, detail: { en: "Serialized artifacts (.pkl/joblib) loadable by an API or batch job.", ar: "نماذج محفوظة (.pkl/joblib) قابلة للتحميل من واجهة أو مهمة دفعية." }, tech: "joblib" },
  ],
};

export function getPipeline(goal: BuildGoal): Pipeline {
  return BUILD_PIPELINES[goal] as Pipeline;
}
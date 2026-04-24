"use strict";

const path = require("path");
const pptxgen = require("pptxgenjs");

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
  pres.title = "Small Language Models";

  // ── Palette ──────────────────────────────────────────────────────────────
  const DARK     = "0D1B2A";
  const LIGHT_BG = "EEF2F7";
  const CYAN     = "00B4D8";
  const CYAN_DK  = "0077B6";
  const WHITE    = "FFFFFF";
  const DARK_TXT = "1A1A2E";
  const MUTED    = "64748B";

  const F_HEAD = "Calibri";
  const F_BODY = "Calibri";

  // Fresh shadow object per call — PptxGenJS mutates in place
  const mkShadow = () => ({
    type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.12,
  });

  // ── SLIDE 1: Title ────────────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: DARK };

    // Full-height left cyan accent bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.18, h: 5.625,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    // Top-right corner L-bracket decoration
    s.addShape(pres.shapes.RECTANGLE, {
      x: 8.3, y: 0, w: 1.7, h: 0.08,
      fill: { color: CYAN }, line: { color: CYAN },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 9.92, y: 0, w: 0.08, h: 1.6,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    // Main title
    s.addText("SMALL LANGUAGE\nMODELS", {
      x: 0.5, y: 0.9, w: 9.1, h: 2.1,
      fontFace: F_HEAD, fontSize: 54, bold: true, color: WHITE,
      align: "left", valign: "middle", charSpacing: 2,
    });

    // Subtitle
    s.addText("The Future of Agentic & Enterprise AI", {
      x: 0.5, y: 3.05, w: 9.1, h: 0.48,
      fontFace: F_BODY, fontSize: 18, color: CYAN,
      align: "left", valign: "middle",
    });

    // Horizontal divider
    s.addShape(pres.shapes.LINE, {
      x: 0.5, y: 3.6, w: 9.1, h: 0,
      line: { color: CYAN_DK, width: 1 },
    });

    // Agenda pills
    const agenda = ["Motivation", "Performance", "Cost & Efficiency", "Privacy", "Agentic AI", "Use Cases", "Why Now?"];
    const pillW = 1.15;
    const pillH = 0.28;
    const pillGap = 0.13;
    const totalPillW = agenda.length * pillW + (agenda.length - 1) * pillGap;
    let pillX = (10 - totalPillW) / 2;
    const pillY = 3.9;

    for (const item of agenda) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: pillX, y: pillY, w: pillW, h: pillH,
        fill: { color: CYAN_DK }, line: { color: CYAN, width: 1 },
        rectRadius: 0.06,
      });
      s.addText(item, {
        x: pillX, y: pillY, w: pillW, h: pillH,
        fontFace: F_BODY, fontSize: 9, bold: true, color: WHITE,
        align: "center", valign: "middle", margin: 0,
      });
      pillX += pillW + pillGap;
    }

    // Source citation
    s.addText("Source: NVIDIA — \"Small Language Models are the Future of Agentic AI\"", {
      x: 0.5, y: 5.25, w: 9.1, h: 0.28,
      fontFace: F_BODY, fontSize: 8, color: MUTED, italic: true,
      align: "left",
    });
  }

  // ── SLIDE 2: The Case for SLMs ────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: LIGHT_BG };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.12,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    s.addText("The Case for SLMs: Right-Sized Intelligence", {
      x: 0.4, y: 0.22, w: 9.2, h: 0.62,
      fontFace: F_HEAD, fontSize: 26, bold: true, color: DARK_TXT,
      align: "left", valign: "middle",
    });

    // Left column — 3 key points
    const points = [
      {
        head: "LLMs are Overkill for Structured Tasks",
        body: "General-purpose models bring massive overhead to workflows with clearly defined steps — slow, expensive, and often imprecise.",
      },
      {
        head: "SLMs: Purpose-Built & Efficient",
        body: "Smaller models trained on focused domains consistently outperform LLMs on narrow, well-scoped tasks.",
      },
      {
        head: "The Paper's Core Thesis",
        body: "NVIDIA's research argues SLMs are the future of agentic AI — delivering competitive accuracy at a fraction of the cost.",
      },
    ];

    let yy = 1.05;
    for (const pt of points) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.4, y: yy, w: 0.07, h: 0.92,
        fill: { color: CYAN }, line: { color: CYAN },
      });
      s.addText(pt.head, {
        x: 0.62, y: yy, w: 4.2, h: 0.32,
        fontFace: F_HEAD, fontSize: 13, bold: true, color: DARK_TXT,
        align: "left", valign: "top", margin: 0,
      });
      s.addText(pt.body, {
        x: 0.62, y: yy + 0.34, w: 4.2, h: 0.56,
        fontFace: F_BODY, fontSize: 11, color: MUTED,
        align: "left", valign: "top", margin: 0,
      });
      yy += 1.1;
    }

    // Right column — LLM vs SLM visual
    // LLM box (tall)
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.5, y: 0.85, w: 1.9, h: 3.0,
      fill: { color: "FFECEC" }, line: { color: "E53935", width: 2 },
      shadow: mkShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.5, y: 0.85, w: 1.9, h: 0.5,
      fill: { color: "E53935" }, line: { color: "E53935" },
    });
    s.addText("LLM", {
      x: 5.5, y: 0.85, w: 1.9, h: 0.5,
      fontFace: F_HEAD, fontSize: 16, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText([
      { text: "70–175B Parameters", options: { breakLine: true } },
      { text: "High Cost", options: { breakLine: true } },
      { text: "High Latency", options: { breakLine: true } },
      { text: "Generalist", options: { breakLine: true } },
      { text: "Cloud-Only", options: {} },
    ], {
      x: 5.5, y: 1.42, w: 1.9, h: 2.3,
      fontFace: F_BODY, fontSize: 11, color: "C62828",
      align: "center", valign: "top", paraSpaceAfter: 4,
    });

    // VS
    s.addText("VS", {
      x: 7.45, y: 1.9, w: 0.5, h: 0.7,
      fontFace: F_HEAD, fontSize: 16, bold: true, color: MUTED,
      align: "center", valign: "middle",
    });

    // SLM box (shorter — visually represents smaller model)
    s.addShape(pres.shapes.RECTANGLE, {
      x: 8.0, y: 1.45, w: 1.6, h: 2.1,
      fill: { color: "E0F7FA" }, line: { color: CYAN, width: 2 },
      shadow: mkShadow(),
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 8.0, y: 1.45, w: 1.6, h: 0.45,
      fill: { color: CYAN_DK }, line: { color: CYAN_DK },
    });
    s.addText("SLM", {
      x: 8.0, y: 1.45, w: 1.6, h: 0.45,
      fontFace: F_HEAD, fontSize: 16, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText([
      { text: "1–8B Parameters", options: { breakLine: true } },
      { text: "Low Cost", options: { breakLine: true } },
      { text: "Fast", options: { breakLine: true } },
      { text: "Purpose-Built", options: { breakLine: true } },
      { text: "On-Premise", options: {} },
    ], {
      x: 8.0, y: 1.95, w: 1.6, h: 1.6,
      fontFace: F_BODY, fontSize: 11, color: CYAN_DK,
      align: "center", valign: "top", paraSpaceAfter: 4,
    });

    // Caption
    s.addText("Right-sized AI for right-sized problems", {
      x: 5.2, y: 4.2, w: 4.6, h: 0.35,
      fontFace: F_BODY, fontSize: 11, color: MUTED, italic: true,
      align: "center",
    });
  }

  // ── SLIDE 3: Performance ─────────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: LIGHT_BG };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.12,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    s.addText("Performance: Small Doesn't Mean Weak", {
      x: 0.4, y: 0.22, w: 9.2, h: 0.6,
      fontFace: F_HEAD, fontSize: 26, bold: true, color: DARK_TXT,
      align: "left", valign: "middle",
    });

    s.addText("Real-world benchmarks from NVIDIA's research on Small Language Models", {
      x: 0.4, y: 0.84, w: 9.2, h: 0.28,
      fontFace: F_BODY, fontSize: 12, color: MUTED,
      align: "left",
    });

    const cards = [
      {
        model: "NVIDIA Hymba-1.5B",
        stat: "3.5×",
        statLabel: "Token Throughput",
        detail: "Mamba-attention hybrid. Outperforms 13B models on instruction following — at just 1.5B parameters.",
        color: "0077B6",
        bg: "E3F2FD",
      },
      {
        model: "DeepSeek-R1-Distill-Qwen-7B",
        stat: "GPT-4o",
        statLabel: "Outperformed",
        detail: "Beats Claude-3.5-Sonnet and GPT-4o on commonsense reasoning benchmarks. 7B parameters.",
        color: "00897B",
        bg: "E0F2F1",
      },
      {
        model: "DeepMind RETRO-7.5B",
        stat: "25×",
        statLabel: "Fewer Parameters",
        detail: "Matches GPT-3 (175B) on language modeling via retrieval augmentation. Just 7.5B parameters.",
        color: "6A1B9A",
        bg: "F3E5F5",
      },
      {
        model: "Salesforce xLAM-2-8B",
        stat: "#1",
        statLabel: "Tool Calling",
        detail: "State-of-the-art on agentic tool calling at 8B parameters. Surpasses GPT-4o and Claude.",
        color: "C62828",
        bg: "FFEBEE",
      },
    ];

    const cardW = 4.5;
    const cardH = 1.9;
    const gapX = 0.4;
    const gapY = 0.22;
    const startX = 0.4;
    const startY = 1.22;

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);

      // Card background
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cardW, h: cardH,
        fill: { color: c.bg }, line: { color: c.color, width: 1.5 },
        shadow: mkShadow(),
      });
      // Left accent bar
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: 0.08, h: cardH,
        fill: { color: c.color }, line: { color: c.color },
      });
      // Model name
      s.addText(c.model, {
        x: x + 0.18, y: y + 0.1, w: cardW - 0.28, h: 0.3,
        fontFace: F_HEAD, fontSize: 11, bold: true, color: c.color,
        align: "left", valign: "middle", margin: 0,
      });
      // Stat number (hero)
      s.addText(c.stat, {
        x: x + 0.18, y: y + 0.43, w: 1.3, h: 0.58,
        fontFace: F_HEAD, fontSize: 34, bold: true, color: c.color,
        align: "left", valign: "middle", margin: 0,
      });
      // Stat label
      s.addText(c.statLabel, {
        x: x + 0.18, y: y + 1.02, w: 1.4, h: 0.28,
        fontFace: F_BODY, fontSize: 9, color: MUTED,
        align: "left", valign: "middle", margin: 0,
      });
      // Detail text
      s.addText(c.detail, {
        x: x + 1.62, y: y + 0.43, w: cardW - 1.82, h: 1.35,
        fontFace: F_BODY, fontSize: 10.5, color: DARK_TXT,
        align: "left", valign: "top", margin: 0,
      });
    }
  }

  // ── SLIDE 4: Cost & Efficiency ────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: DARK };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.12,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    s.addText("Cost & Efficiency: The Economics of SLMs", {
      x: 0.4, y: 0.22, w: 9.2, h: 0.6,
      fontFace: F_HEAD, fontSize: 26, bold: true, color: WHITE,
      align: "left", valign: "middle",
    });

    // Hero stat block (left)
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: 1.0, w: 3.9, h: 3.5,
      fill: { color: CYAN_DK, transparency: 82 },
      line: { color: CYAN, width: 1 },
    });

    s.addText("10–30×", {
      x: 0.4, y: 1.15, w: 3.9, h: 1.5,
      fontFace: F_HEAD, fontSize: 68, bold: true, color: CYAN,
      align: "center", valign: "middle",
    });
    s.addText("Cheaper than 70–175B LLMs", {
      x: 0.4, y: 2.75, w: 3.9, h: 0.48,
      fontFace: F_BODY, fontSize: 14, bold: true, color: WHITE,
      align: "center", valign: "middle",
    });
    s.addText("in latency, energy consumption & FLOPs", {
      x: 0.4, y: 3.26, w: 3.9, h: 0.35,
      fontFace: F_BODY, fontSize: 11, color: MUTED, italic: true,
      align: "center",
    });

    // Right column — 3 efficiency points
    const pts = [
      {
        head: "Real-Time Inference at Scale",
        body: "NVIDIA Dynamo provides high-throughput, low-latency SLM inference for both cloud and edge. Real-time agentic responses become economically viable.",
      },
      {
        head: "Fine-Tuning in Hours, Not Weeks",
        body: "LoRA and DoRA fine-tuning requires only a few GPU-hours — add, fix, or specialize model behavior overnight.",
      },
      {
        head: "Simpler Infrastructure",
        body: "No multi-GPU parallelization required. Less maintenance overhead, lower operational costs, and easier deployment.",
      },
    ];

    let yy = 1.0;
    for (const pt of pts) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 4.65, y: yy, w: 5.0, h: 1.08,
        fill: { color: WHITE, transparency: 88 },
        line: { color: CYAN_DK, width: 1 },
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: 4.65, y: yy, w: 0.07, h: 1.08,
        fill: { color: CYAN }, line: { color: CYAN },
      });
      s.addText(pt.head, {
        x: 4.82, y: yy + 0.08, w: 4.7, h: 0.32,
        fontFace: F_HEAD, fontSize: 12, bold: true, color: CYAN,
        align: "left", valign: "middle", margin: 0,
      });
      s.addText(pt.body, {
        x: 4.82, y: yy + 0.42, w: 4.7, h: 0.58,
        fontFace: F_BODY, fontSize: 10, color: WHITE,
        align: "left", valign: "top", margin: 0,
      });
      yy += 1.18;
    }

    s.addText("Source: NVIDIA — Small Language Models are the Future of Agentic AI", {
      x: 0.4, y: 5.28, w: 9.2, h: 0.25,
      fontFace: F_BODY, fontSize: 8, color: MUTED, italic: true,
      align: "left",
    });
  }

  // ── SLIDE 5: Privacy & Enterprise Control ─────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: LIGHT_BG };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.12,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    s.addText("Privacy & Enterprise Control", {
      x: 0.4, y: 0.22, w: 7.0, h: 0.62,
      fontFace: F_HEAD, fontSize: 26, bold: true, color: DARK_TXT,
      align: "left", valign: "middle",
    });
    s.addText("Your data never leaves your walls", {
      x: 0.4, y: 0.86, w: 6.5, h: 0.3,
      fontFace: F_BODY, fontSize: 13, color: CYAN_DK, italic: true,
      align: "left",
    });

    // Lock visual (right side)
    s.addShape(pres.shapes.OVAL, {
      x: 7.6, y: 0.75, w: 2.0, h: 2.0,
      fill: { color: CYAN, transparency: 88 },
      line: { color: CYAN, width: 2 },
    });
    s.addText("LOCK", {
      x: 7.6, y: 0.75, w: 2.0, h: 2.0,
      fontFace: F_HEAD, fontSize: 13, bold: true, color: CYAN_DK,
      align: "center", valign: "middle",
    });
    // Inner circle
    s.addShape(pres.shapes.OVAL, {
      x: 7.85, y: 1.0, w: 1.5, h: 1.5,
      fill: { color: CYAN_DK, transparency: 75 },
      line: { color: CYAN_DK, width: 1.5 },
    });
    s.addText("100%\nInternal", {
      x: 7.85, y: 1.0, w: 1.5, h: 1.5,
      fontFace: F_HEAD, fontSize: 12, bold: true, color: CYAN_DK,
      align: "center", valign: "middle",
    });

    // 4 privacy points
    const privPts = [
      {
        head: "On-Premise & Air-Gapped Deployment",
        body: "Run entirely within your own infrastructure. No cloud dependency, no external API calls. NVIDIA ChatRTX demonstrates real-time, offline SLM inference on consumer-grade hardware.",
      },
      {
        head: "Zero Data Exposure",
        body: "Proprietary data, customer records, and sensitive documents never leave the enterprise boundary. No third-party ever processes your information.",
      },
      {
        head: "Compliance-Ready by Design",
        body: "Meets GDPR, HIPAA, and internal data governance requirements by architecture — not configuration.",
      },
      {
        head: "Fine-Tune on Confidential Data Safely",
        body: "Train domain-specific models on proprietary datasets entirely in-house. Retain full IP ownership.",
      },
    ];

    let yy = 1.25;
    for (const pt of privPts) {
      s.addShape(pres.shapes.OVAL, {
        x: 0.4, y: yy + 0.1, w: 0.2, h: 0.2,
        fill: { color: CYAN }, line: { color: CYAN },
      });
      s.addText(pt.head, {
        x: 0.75, y: yy, w: 6.6, h: 0.3,
        fontFace: F_HEAD, fontSize: 13, bold: true, color: DARK_TXT,
        align: "left", valign: "middle", margin: 0,
      });
      s.addText(pt.body, {
        x: 0.75, y: yy + 0.32, w: 6.6, h: 0.5,
        fontFace: F_BODY, fontSize: 11, color: MUTED,
        align: "left", valign: "top", margin: 0,
      });
      yy += 0.96;
    }
  }

  // ── SLIDE 6: Agentic Applications ────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: DARK };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.12,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    s.addText("Agentic Applications", {
      x: 0.4, y: 0.2, w: 9.2, h: 0.58,
      fontFace: F_HEAD, fontSize: 28, bold: true, color: WHITE,
      align: "left", valign: "middle",
    });
    s.addText("SLMs as specialized agents in multi-step pipelines — each scoped, fast, and controllable", {
      x: 0.4, y: 0.8, w: 9.2, h: 0.3,
      fontFace: F_BODY, fontSize: 12, color: CYAN, italic: true,
      align: "left",
    });

    // Pipeline visualization
    const steps = [
      { label: "Ingest\n& Parse",    sub: "Document Intake" },
      { label: "Classify",           sub: "Intent / Type"   },
      { label: "Summarize",          sub: "Extract Info"    },
      { label: "Route",              sub: "Decision Logic"  },
      { label: "Act",                sub: "API / Workflow"  },
    ];

    const boxW   = 1.38;
    const boxH   = 0.9;
    const arrW   = 0.38;
    const boxY   = 1.55;
    const totalW = steps.length * boxW + (steps.length - 1) * arrW;
    let bx       = (10 - totalW) / 2;

    for (let i = 0; i < steps.length; i++) {
      const st = steps[i];

      // Step number circle above box
      s.addShape(pres.shapes.OVAL, {
        x: bx + boxW / 2 - 0.16, y: boxY - 0.38, w: 0.32, h: 0.32,
        fill: { color: CYAN }, line: { color: CYAN },
      });
      s.addText(String(i + 1), {
        x: bx + boxW / 2 - 0.16, y: boxY - 0.38, w: 0.32, h: 0.32,
        fontFace: F_HEAD, fontSize: 9, bold: true, color: DARK,
        align: "center", valign: "middle", margin: 0,
      });

      // Box
      s.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: boxY, w: boxW, h: boxH,
        fill: { color: CYAN_DK }, line: { color: CYAN, width: 1.5 },
        shadow: mkShadow(),
      });
      s.addText(st.label, {
        x: bx, y: boxY + 0.06, w: boxW, h: 0.55,
        fontFace: F_HEAD, fontSize: 11, bold: true, color: WHITE,
        align: "center", valign: "middle",
      });
      s.addText(st.sub, {
        x: bx, y: boxY + 0.64, w: boxW, h: 0.22,
        fontFace: F_BODY, fontSize: 8, color: CYAN,
        align: "center", valign: "middle",
      });

      // Arrow to next
      if (i < steps.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: bx + boxW, y: boxY + boxH / 2, w: arrW, h: 0,
          line: { color: CYAN, width: 2 },
        });
      }

      bx += boxW + arrW;
    }

    // 3 key point cards below
    const agPts = [
      {
        head: "Cheaper Orchestration",
        body: "Each agent is a small, fast model — not a costly frontier LLM call per step.",
      },
      {
        head: "Predictable Behavior",
        body: "Scoped agents hallucinate less. Narrow inputs yield controlled, auditable outputs.",
      },
      {
        head: "Proven on Agentic Tasks",
        body: "Salesforce xLAM-2-8B achieves SOTA tool-calling at 8B, surpassing GPT-4o and Claude.",
      },
    ];

    const ptW = 2.85;
    const ptH = 1.42;
    const ptGap = 0.28;
    const ptTotalW = 3 * ptW + 2 * ptGap;
    let ptX = (10 - ptTotalW) / 2;
    const ptY = 2.72;

    for (const pt of agPts) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: ptX, y: ptY, w: ptW, h: ptH,
        fill: { color: WHITE, transparency: 88 },
        line: { color: CYAN_DK, width: 1 },
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x: ptX, y: ptY, w: ptW, h: 0.06,
        fill: { color: CYAN }, line: { color: CYAN },
      });
      s.addText(pt.head, {
        x: ptX + 0.15, y: ptY + 0.14, w: ptW - 0.3, h: 0.36,
        fontFace: F_HEAD, fontSize: 12, bold: true, color: CYAN,
        align: "left", valign: "middle", margin: 0,
      });
      s.addText(pt.body, {
        x: ptX + 0.15, y: ptY + 0.52, w: ptW - 0.3, h: 0.82,
        fontFace: F_BODY, fontSize: 11, color: WHITE,
        align: "left", valign: "top", margin: 0,
      });
      ptX += ptW + ptGap;
    }

    // Tagline
    s.addText("\"Each agent stays in its lane — scoped, specialized, and sovereign.\"", {
      x: 0.5, y: 4.32, w: 9.0, h: 0.38,
      fontFace: F_BODY, fontSize: 12, color: MUTED, italic: true,
      align: "center",
    });
  }

  // ── SLIDE 7: Document Intelligence ───────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: LIGHT_BG };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.12,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    s.addText("Use Cases: Document Intelligence", {
      x: 0.4, y: 0.22, w: 9.2, h: 0.62,
      fontFace: F_HEAD, fontSize: 26, bold: true, color: DARK_TXT,
      align: "left", valign: "middle",
    });

    const cards = [
      {
        title: "Document Summarization",
        badge: "DOC",
        color: CYAN_DK,
        bg: "E3F2FD",
        points: [
          "Condense lengthy contracts, reports, and research papers",
          "Structured output: key findings, decisions, action items",
          "Domain fine-tuned: legal, medical, financial use cases",
          "Runs fully on-premise — sensitive documents stay internal",
        ],
        tagline: "Faster decisions. Less reading time.",
      },
      {
        title: "Offline OCR Solutions",
        badge: "OCR",
        color: "5E35B1",
        bg: "EDE7F6",
        points: [
          "Extract structured text from scanned documents and images",
          "Fully air-gapped — no internet or cloud connectivity required",
          "Powered by NVIDIA's edge inference stack (ChatRTX)",
          "Ideal for regulated industries and remote field environments",
        ],
        tagline: "Edge-ready. No connectivity needed.",
      },
    ];

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const x = 0.4 + i * 4.9;
      const cW = 4.6;
      const cH = 4.35;
      const y = 1.0;

      // Card
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cW, h: cH,
        fill: { color: c.bg }, line: { color: c.color, width: 1.5 },
        shadow: mkShadow(),
      });
      // Header bar
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cW, h: 0.58,
        fill: { color: c.color }, line: { color: c.color },
      });
      // Badge pill
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: x + 0.18, y: y + 0.12, w: 0.55, h: 0.28,
        fill: { color: WHITE, transparency: 30 }, line: { color: WHITE, width: 1 },
        rectRadius: 0.04,
      });
      s.addText(c.badge, {
        x: x + 0.18, y: y + 0.12, w: 0.55, h: 0.28,
        fontFace: F_HEAD, fontSize: 9, bold: true, color: WHITE,
        align: "center", valign: "middle", margin: 0,
      });
      // Title
      s.addText(c.title, {
        x: x + 0.82, y: y + 0.1, w: cW - 1.0, h: 0.42,
        fontFace: F_HEAD, fontSize: 14, bold: true, color: WHITE,
        align: "left", valign: "middle", margin: 0,
      });
      // Bullets
      const bulletItems = c.points.map((p, idx) => ({
        text: p,
        options: { bullet: true, breakLine: idx < c.points.length - 1 },
      }));
      s.addText(bulletItems, {
        x: x + 0.22, y: y + 0.68, w: cW - 0.44, h: 2.88,
        fontFace: F_BODY, fontSize: 12, color: DARK_TXT,
        align: "left", valign: "top", paraSpaceAfter: 5,
      });
      // Tagline bar
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: y + cH - 0.56, w: cW, h: 0.56,
        fill: { color: c.color, transparency: 18 }, line: { color: c.color },
      });
      s.addText(c.tagline, {
        x: x + 0.18, y: y + cH - 0.56, w: cW - 0.36, h: 0.56,
        fontFace: F_BODY, fontSize: 12, bold: true, italic: true, color: c.color,
        align: "center", valign: "middle", margin: 0,
      });
    }
  }

  // ── SLIDE 8: Understanding & Recommendations ──────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: LIGHT_BG };

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.12,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    s.addText("Use Cases: Understanding & Recommendations", {
      x: 0.4, y: 0.22, w: 9.2, h: 0.62,
      fontFace: F_HEAD, fontSize: 24, bold: true, color: DARK_TXT,
      align: "left", valign: "middle",
    });

    const cards = [
      {
        title: "Intent & Sentiment Classification",
        badge: "NLP",
        color: "00897B",
        bg: "E0F2F1",
        points: [
          "Identify user intent in customer service and chatbot pipelines",
          "Real-time sentiment classification: positive, negative, neutral",
          "Low latency — sub-millisecond inference for high-volume streams",
          "Fine-tunable on domain-specific language and terminology",
        ],
        tagline: "Understand your users. Instantly.",
      },
      {
        title: "Recommendation Systems",
        badge: "REC",
        color: "E65100",
        bg: "FFF3E0",
        points: [
          "Personalized product, content, and service recommendations",
          "Runs on structured signals — no LLM overhead required",
          "Fast, low-cost inference for millions of daily requests",
          "Fully private — user data never leaves your infrastructure",
        ],
        tagline: "Relevant. Fast. Private.",
      },
    ];

    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      const x = 0.4 + i * 4.9;
      const cW = 4.6;
      const cH = 4.35;
      const y = 1.0;

      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cW, h: cH,
        fill: { color: c.bg }, line: { color: c.color, width: 1.5 },
        shadow: mkShadow(),
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y, w: cW, h: 0.58,
        fill: { color: c.color }, line: { color: c.color },
      });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: x + 0.18, y: y + 0.12, w: 0.55, h: 0.28,
        fill: { color: WHITE, transparency: 30 }, line: { color: WHITE, width: 1 },
        rectRadius: 0.04,
      });
      s.addText(c.badge, {
        x: x + 0.18, y: y + 0.12, w: 0.55, h: 0.28,
        fontFace: F_HEAD, fontSize: 9, bold: true, color: WHITE,
        align: "center", valign: "middle", margin: 0,
      });
      s.addText(c.title, {
        x: x + 0.82, y: y + 0.1, w: cW - 1.0, h: 0.42,
        fontFace: F_HEAD, fontSize: 13, bold: true, color: WHITE,
        align: "left", valign: "middle", margin: 0,
      });
      const bulletItems = c.points.map((p, idx) => ({
        text: p,
        options: { bullet: true, breakLine: idx < c.points.length - 1 },
      }));
      s.addText(bulletItems, {
        x: x + 0.22, y: y + 0.68, w: cW - 0.44, h: 2.88,
        fontFace: F_BODY, fontSize: 12, color: DARK_TXT,
        align: "left", valign: "top", paraSpaceAfter: 5,
      });
      s.addShape(pres.shapes.RECTANGLE, {
        x, y: y + cH - 0.56, w: cW, h: 0.56,
        fill: { color: c.color, transparency: 18 }, line: { color: c.color },
      });
      s.addText(c.tagline, {
        x: x + 0.18, y: y + cH - 0.56, w: cW - 0.36, h: 0.56,
        fontFace: F_BODY, fontSize: 12, bold: true, italic: true, color: c.color,
        align: "center", valign: "middle", margin: 0,
      });
    }
  }

  // ── SLIDE 9: Why SLMs, Why Now? ───────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: DARK };

    // Bottom cyan bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0, y: 5.5, w: 10, h: 0.125,
      fill: { color: CYAN }, line: { color: CYAN },
    });

    s.addText("Why SLMs. Why Now.", {
      x: 0.4, y: 0.28, w: 9.2, h: 0.72,
      fontFace: F_HEAD, fontSize: 32, bold: true, color: WHITE,
      align: "left", valign: "middle", charSpacing: 1,
    });

    s.addShape(pres.shapes.LINE, {
      x: 0.4, y: 1.06, w: 9.2, h: 0,
      line: { color: CYAN, width: 1 },
    });

    const reasons = [
      {
        num: "01",
        head: "Ecosystem Maturity",
        body: "NVIDIA Dynamo and ChatRTX make SLM deployment — cloud or edge — production-ready today.",
      },
      {
        num: "02",
        head: "Proven Performance",
        body: "SLMs at 7–8B parameters already beat frontier LLMs on tool calling, reasoning, and instruction following.",
      },
      {
        num: "03",
        head: "Data Sovereignty",
        body: "On-premise deployment means full control — no third-party risk, no compliance compromise.",
      },
      {
        num: "04",
        head: "Economics at Scale",
        body: "10–30× cost reduction per inference makes AI viable across high-volume, real-time workflows.",
      },
    ];

    const rW = 2.05;
    const rGap = 0.35;
    let rx = 0.4;
    const ry = 1.2;

    for (let i = 0; i < reasons.length; i++) {
      const r = reasons[i];
      s.addText(r.num, {
        x: rx, y: ry, w: rW, h: 0.52,
        fontFace: F_HEAD, fontSize: 28, bold: true, color: CYAN,
        align: "left", valign: "middle",
      });
      s.addText(r.head, {
        x: rx, y: ry + 0.54, w: rW, h: 0.38,
        fontFace: F_HEAD, fontSize: 12, bold: true, color: WHITE,
        align: "left", valign: "middle",
      });
      s.addText(r.body, {
        x: rx, y: ry + 0.94, w: rW, h: 1.15,
        fontFace: F_BODY, fontSize: 10.5, color: MUTED,
        align: "left", valign: "top",
      });
      // Vertical divider between columns
      if (i < reasons.length - 1) {
        s.addShape(pres.shapes.LINE, {
          x: rx + rW + rGap / 2, y: ry, w: 0, h: 1.85,
          line: { color: CYAN_DK, width: 1 },
        });
      }
      rx += rW + rGap;
    }

    // Closing statement box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: 3.55, w: 9.2, h: 0.88,
      fill: { color: CYAN_DK, transparency: 78 },
      line: { color: CYAN, width: 1 },
    });
    s.addText(
      "The question is no longer whether SLMs can perform — it's whether you can afford not to use them.",
      {
        x: 0.6, y: 3.55, w: 8.8, h: 0.88,
        fontFace: F_BODY, fontSize: 13, color: WHITE, italic: true,
        align: "center", valign: "middle",
      }
    );
  }

  await pres.writeFile({ fileName: path.join(__dirname, "small_language_models.pptx") });
  console.log("Presentation written to small_language_models.pptx");
}

buildPresentation().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

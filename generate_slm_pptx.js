const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'The Rise of Small Language Models';

// ── Color Palette ──────────────────────────────────────────
const DARK     = "1C1C1E";   // near-black (Claude dark mode)
const WHITE    = "FFFFFF";
const CORAL    = "D97757";   // Claude brand accent
const OFFWHITE = "FAF9F7";   // warm off-white
const CARD_BG  = "FFFFFF";
const BORDER   = "E8E4DF";
const BODY     = "4A4A4A";

// ═══════════════════════════════════════════════════════════
//  SLIDE 1 — Title
// ═══════════════════════════════════════════════════════════
let s1 = pres.addSlide();
s1.background = { color: DARK };

// Left accent bar
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.2, h: 5.625,
  fill: { color: CORAL }, line: { color: CORAL }
});

// Subtle coral glow (bottom-left decorative oval)
s1.addShape(pres.shapes.OVAL, {
  x: -1.5, y: 2.8, w: 5.5, h: 5.5,
  fill: { color: CORAL, transparency: 88 },
  line: { color: CORAL, transparency: 88 }
});

// Main title — "The Rise of\nSmall Language Models"
s1.addText([
  { text: "The Rise of", options: { breakLine: true } },
  { text: "Small Language Models" }
], {
  x: 0.55, y: 1.1, w: 8.8, h: 2.1,
  fontFace: "Georgia",
  fontSize: 46,
  bold: true,
  color: WHITE,
  align: "left",
  margin: 0
});

// Subtitle
s1.addText("Why Smaller is the Smarter Choice", {
  x: 0.55, y: 3.35, w: 8.5, h: 0.55,
  fontFace: "Calibri",
  fontSize: 22,
  color: CORAL,
  align: "left",
  margin: 0
});

// Bottom separator line
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0.55, y: 4.88, w: 1.6, h: 0.035,
  fill: { color: CORAL }, line: { color: CORAL }
});

// Footer caption
s1.addText("Small Language Models  ·  AI Research", {
  x: 0.55, y: 4.97, w: 8, h: 0.36,
  fontFace: "Calibri",
  fontSize: 11,
  color: "717171",
  align: "left",
  margin: 0
});

// ═══════════════════════════════════════════════════════════
//  SLIDE 2 — Content
// ═══════════════════════════════════════════════════════════
let s2 = pres.addSlide();
s2.background = { color: OFFWHITE };

// Top accent bar
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.07,
  fill: { color: CORAL }, line: { color: CORAL }
});

// Slide title
s2.addText("Why We Need Small Language Models", {
  x: 0.45, y: 0.2, w: 9.1, h: 0.65,
  fontFace: "Georgia",
  fontSize: 30,
  bold: true,
  color: DARK,
  align: "left",
  margin: 0
});

// ── Six feature cards in a 2×3 grid ───────────────────────
const features = [
  {
    title: "Resource Efficiency",
    desc:  "Low compute, memory, and energy requirements — runs where large models simply cannot."
  },
  {
    title: "Edge Deployment",
    desc:  "Operates on-device without cloud dependency, ensuring offline reliability and speed."
  },
  {
    title: "Privacy & Security",
    desc:  "On-device inference keeps sensitive data fully local — no data ever leaves the device."
  },
  {
    title: "Cost-Effectiveness",
    desc:  "Dramatically cheaper to train, fine-tune, and serve at scale compared to large LLMs."
  },
  {
    title: "Accessibility",
    desc:  "Democratizes AI for smaller organizations, startups, and individual developers alike."
  },
  {
    title: "Domain Specialization",
    desc:  "Focused models consistently outperform large generalists on domain-specific tasks."
  }
];

const colX  = [0.35, 5.2];
const cardW = 4.45;
const cardH = 1.2;
const rowY  = [1.05, 2.5, 3.95];

features.forEach((f, i) => {
  const cx = colX[i % 2];
  const cy = rowY[Math.floor(i / 2)];

  // Card body (white with subtle border + shadow)
  s2.addShape(pres.shapes.RECTANGLE, {
    x: cx, y: cy, w: cardW, h: cardH,
    fill: { color: CARD_BG },
    line: { color: BORDER, width: 0.8 },
    shadow: { type: "outer", color: "000000", blur: 10, offset: 3, angle: 135, opacity: 0.07 }
  });

  // Left coral accent bar
  s2.addShape(pres.shapes.RECTANGLE, {
    x: cx, y: cy, w: 0.065, h: cardH,
    fill: { color: CORAL }, line: { color: CORAL }
  });

  // Card heading
  s2.addText(f.title, {
    x: cx + 0.2, y: cy + 0.1, w: cardW - 0.28, h: 0.34,
    fontFace: "Calibri",
    fontSize: 14,
    bold: true,
    color: DARK,
    align: "left",
    margin: 0
  });

  // Card body text
  s2.addText(f.desc, {
    x: cx + 0.2, y: cy + 0.44, w: cardW - 0.28, h: 0.68,
    fontFace: "Georgia",
    fontSize: 11.5,
    color: BODY,
    align: "left",
    margin: 0
  });
});

pres.writeFile({ fileName: "/home/issmt/IAE-SLMS/small_language_models.pptx" });
console.log("Done — saved to /home/issmt/IAE-SLMS/small_language_models.pptx");

# IAE-SLMS — Small Language Models: Applications, Fine-Tuning & Deployment

Research repository of the SLMS team. Five task-specific studies on adapting sub-10B parameter language models with parameter-efficient fine-tuning (LoRA / QLoRA via Unsloth) on consumer hardware.

## Scope

| # | Task | Base model(s) | Method |
|---|---|---|---|
| 1 | Multilingual sentiment + language classification | Gemma-3 270M, Qwen-3 0.5B | LoRA, structured JSON output |
| 2 | Chain-of-thought reasoning | Llama-3.2 | Supervised fine-tune on CoT traces |
| 3 | Length-controlled news summarization | Mistral-7B-Instruct-v0.2 | QLoRA + SFT on CNN/DailyMail |
| 4 | Roman Urdu conversational AI | Llama-3.1-8B, Qwen2.5-3B, Mistral-7B | QLoRA on Roman Urdu Alpaca QA Mix |
| 5 | Retrieval-Augmented Generation | fine-tuned SLM + vector store | Encoder → retriever → SLM generator |

All training uses 4-bit NF4 quantization, LoRA rank 16 / alpha 32, AdamW 8-bit, cosine schedule, bfloat16, on free-tier Colab GPUs.

## Repository Layout

```
IAE-SLMS/
├── language_sentiment_detection/   Task 1 — Gemma-3 & Qwen notebooks, 120K multilingual dataset, report
├── chain_of_thought/               Task 2 — Llama 3.2 CoT fine-tuning notebook
├── Text Summarization/             Task 3 — Mistral-7B summarization notebooks, report
├── roman_urdu_slm/                 Task 4 — Llama/Qwen/Mistral notebooks, Alpaca QA dataset, report
├── rag/                            Task 5 — RAG pipeline notebook, report
├── paper_outline.md                Full paper outline (methods, results, references)
├── small_language_models.pptx      Summary presentation
├── generate_slm_deck.js            PPTX deck generator (pptxgenjs)
└── generate_slm_pptx.js            Alt. PPTX generator script
```

## Task Highlights

**1. Sentiment / language classification.** Curated 120K balanced samples across English, Arabic, Urdu, Roman Urdu (30K each). Gemma-3 270M reached 72.4% three-class accuracy; Qwen-3 0.5B performed joint language-ID + sentiment with 68–99% JSON validity. Main confound: Urdu ↔ Roman Urdu script similarity.

**2. Chain-of-thought induction.** Llama-3.2 fine-tuned on `{question, steps, final_answer}` traces to study whether reasoning can be learned (not emerged) in small models.

**3. Length-controlled summarization.** Mistral-7B on CNN/DailyMail (~1K train / 200 val) with explicit N-sentence instructions. Finding: length control is learned in epoch 1; factual faithfulness only improves by epoch 3. ROUGE–BERTScore divergence used as a hallucination diagnostic.

**4. Roman Urdu chatbot.** QLoRA on Llama-3.1-8B using the Redgerd Roman Urdu Alpaca QA mix. 500 steps, 6–8 GB GPU, ~74% memory reduction vs. full FT, ~50–100 ms/token inference. Deployed on HuggingFace Hub with a Gradio demo.

**5. RAG.** Four-stage pipeline (encoder → vector store → retriever → SLM). Evaluated with `ragas`: Context Precision **1.00**, Answer Relevancy **0.73**, Faithfulness **0.38** — retrieval is reliable; grounding is the bottleneck for small generators.

## Deployment

- **CPU** — `llama.cpp` with GGUF quantized weights (Q4_K_M / Q5_K_M / Q8_0) for laptops and air-gapped use.
- **GPU** — `vLLM` with PagedAttention and continuous batching for server-side, multi-user inference.

## Running the Notebooks

Each task is a self-contained Jupyter / Colab notebook. Typical flow:

```bash
pip install unsloth transformers peft accelerate bitsandbytes datasets evaluate ragas
```

Open the relevant `.ipynb` in Colab (T4 / A100), mount the dataset from the sibling `Dataset/` or `Datasets/` folder, and run top-to-bottom. Reports (`*-SLMS.pdf`) in each directory document methodology and results.

## Deck Generation

The root `generate_slm_deck.js` / `generate_slm_pptx.js` scripts build `small_language_models.pptx` via `pptxgenjs`:

```bash
npm install
node generate_slm_deck.js
```

## Reports

- `language_sentiment_detection/sentiment_models_report-SLMS.pdf`
- `Text Summarization/Text_Summarization_Report-SLMS.pdf`
- `roman_urdu_slm/Roman_Urdu_Report-SLMS.pdf`
- `rag/rag_report-SLMS.pdf`
- `paper_outline.md` — unified technical-report draft

## Key References

LoRA (Hu et al. 2021) · QLoRA (Dettmers et al. 2023) · CoT (Wei et al. 2022) · RAG (Lewis et al. 2020) · BERTScore (Zhang et al. 2020) · PagedAttention / vLLM (Kwon et al. 2023) · Mistral 7B · Gemma 3 · Llama 3.1 · Qwen 2.5.

<p align="center">
  <h1 align="center">IAE-SLMS</h1>
  <p align="center">
    <strong>Making AI Accessible: High-Performance Language Models That Run Anywhere</strong>
  </p>
  <p align="center">
    <em>Five research studies demonstrating that sub-10B parameter models, fine-tuned with parameter-efficient methods on consumer GPUs, can match or approach frontier model performance on production NLP tasks — at 10-30x lower cost.</em>
  </p>
  <p align="center">
    <a href="#research-highlights">Highlights</a> &middot;
    <a href="#performance-summary">Performance</a> &middot;
    <a href="#applications--impact">Impact</a> &middot;
    <a href="#quickstart">Quickstart</a> &middot;
    <a href="#infrastructure--scalability">Deployment</a> &middot;
    <a href="#roadmap">Roadmap</a> &middot;
    <a href="#citation">Citation</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/python-3.10+-blue?logo=python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/PyTorch-2.0+-ee4c2c?logo=pytorch&logoColor=white" alt="PyTorch">
    <img src="https://img.shields.io/badge/HuggingFace-Transformers-yellow?logo=huggingface&logoColor=white" alt="HuggingFace">
    <img src="https://img.shields.io/badge/Fine--Tuning-LoRA%20%2F%20QLoRA-green" alt="LoRA">
    <img src="https://img.shields.io/badge/Quantization-4--bit%20NF4-purple" alt="Quantization">
    <img src="https://img.shields.io/badge/Platform-Google%20Colab-orange?logo=googlecolab&logoColor=white" alt="Colab">
    <img src="https://img.shields.io/badge/Deployment-CPU%20%2B%20GPU-red" alt="Deployment">
    <img src="https://img.shields.io/badge/License-MIT-brightgreen" alt="License">
  </p>
</p>

---

## Research Highlights

| Metric | Result |
|---|---|
| **74% GPU memory reduction** | QLoRA fine-tuning runs on 6-8 GB GPUs — free-tier Colab hardware that costs $0 |
| **120,000-sample multilingual dataset** | Curated balanced corpus across 4 languages (English, Arabic, Urdu, Roman Urdu) for sentiment analysis |
| **Perfect retrieval precision (1.00)** | RAG pipeline achieves flawless document retrieval, proving small encoders are production-viable |
| **First Roman Urdu chatbot** | Deployed conversational AI for a 70M+ speaker language with no prior NLP baselines |

This research establishes that **small language models (270M–8B parameters)**, when fine-tuned with LoRA/QLoRA via Unsloth, deliver task-specific performance competitive with models 10-25x their size — while running on hardware accessible to any organization worldwide.

---

## Performance Summary

| # | Task | Model | Parameters | Key Metric | Result | Hardware |
|---|---|---|---|---|---|---|
| 1 | Multilingual Sentiment Classification | Gemma-3 | 270M | 3-class accuracy | **72.4%** | Colab T4 (free) |
| 1 | Joint Language + Sentiment | Qwen-2.5 | 0.5B | JSON validity | **68–99%** | Colab T4 (free) |
| 2 | Chain-of-Thought Reasoning | Llama 3.2 | — | CoT induction | Reasoning learned, not emergent | Colab T4 (free) |
| 3 | Length-Controlled Summarization | Mistral 7B | 7B | Length compliance | Epoch 1; faithfulness by Epoch 3 | Colab T4 (free) |
| 4 | Roman Urdu Conversational AI | Llama 3.1 | 8B | Inference latency | **50–100 ms/token** | Colab T4 (free) |
| 5 | RAG Pipeline | SLM + Vector Store | — | Context Precision | **1.00** | Colab T4 (free) |

> Every experiment in this repository runs end-to-end on **free-tier Google Colab** (T4/A100). No paid compute required to reproduce any result.

Full benchmark details: [BENCHMARKS.md](BENCHMARKS.md)

---

## Applications & Impact

### Enterprise & Industry

- **Customer Intelligence** — Real-time multilingual sentiment analysis across English, Arabic, and Urdu markets. A 270M-parameter model replaces cloud API calls for millions of daily classifications at near-zero marginal cost.
- **Document Processing** — Length-controlled summarization for legal, financial, and compliance documents. On-premise deployment ensures sensitive content never leaves organizational boundaries.
- **Conversational AI for Underserved Markets** — The first fine-tuned chatbot for Roman Urdu (70M+ speakers across Pakistan and the diaspora), enabling customer service automation in a language with no existing commercial NLP products.

### Technical Contributions

- **Retrieval-Augmented Generation** — Production-ready RAG pipeline with perfect retrieval precision, demonstrating that small encoders paired with small generators can serve knowledge-intensive applications without frontier model costs.
- **Reasoning at the Edge** — Chain-of-thought fine-tuning proves that structured reasoning is a learnable behavior, not an emergent property exclusive to 100B+ parameter models — opening the door to on-device reasoning for mobile and embedded applications.
- **Hallucination Diagnostics** — Novel use of ROUGE–BERTScore divergence as an automated hallucination detection signal, applicable to any summarization or generation pipeline.

---

## Research Tasks

| # | Task | Directory | Base Model(s) | Method |
|---|---|---|---|---|
| 1 | [Multilingual Sentiment & Language Classification](multilingual_sentiment/) | `multilingual_sentiment/` | Gemma-3 270M, Qwen-2.5 0.5B | LoRA, structured JSON output |
| 2 | [Chain-of-Thought Reasoning](chain_of_thought/) | `chain_of_thought/` | Llama 3.2 | Supervised CoT fine-tuning |
| 3 | [Length-Controlled Summarization](text_summarization/) | `text_summarization/` | Mistral 7B Instruct v0.2 | QLoRA + SFT on CNN/DailyMail |
| 4 | [Roman Urdu Conversational AI](roman_urdu/) | `roman_urdu/` | Llama 3.1-8B, Qwen 2.5-3B, Mistral 7B | QLoRA on Roman Urdu Alpaca QA |
| 5 | [Retrieval-Augmented Generation](retrieval_augmented_generation/) | `retrieval_augmented_generation/` | Fine-tuned SLM + vector store | Encoder → Retriever → Generator |

---

## Quickstart

### Reproduce All Experiments (Python)

```bash
git clone https://github.com/m-jafri/IAE-SLMS.git
cd IAE-SLMS
pip install -r requirements.txt
```

Open any `.ipynb` notebook in **Google Colab** (T4 / A100 runtime), mount the sibling dataset folder, and run top-to-bottom. Every notebook is self-contained — no external configuration required.

---

## Shared Training Configuration

All five tasks use a unified parameter-efficient fine-tuning setup, ensuring reproducibility and fair comparison:

| Hyperparameter | Value | Rationale |
|---|---|---|
| Fine-Tuning Method | QLoRA / LoRA | 74% memory reduction vs. full fine-tuning |
| Quantization | 4-bit NF4 | Optimal quality-efficiency trade-off for consumer GPUs |
| Optimizer | AdamW (8-bit) | Memory-efficient with stable convergence |
| LR Scheduler | Cosine Annealing | Smooth decay prevents catastrophic forgetting |
| Precision | bfloat16 / FP16 | Hardware-dependent; bfloat16 preferred on A100 |
| LoRA Rank | 16 | Sufficient capacity for task-specific adaptation |
| LoRA Alpha | 32 | 2x rank scaling for stable gradient flow |
| Learning Rate | 1e-5 | Conservative; prevents overfitting on small datasets |
| Batch Size | 8 | Fits within 6-8 GB GPU memory |
| Gradient Accumulation | 2 steps | Effective batch size 16 without additional memory |

---

## Infrastructure & Scalability

### Development & Research — Google Colab (Free Tier)

All experiments run on free-tier Colab GPUs (NVIDIA T4 16GB / A100 40GB). Training completes in 2-3 hours per task. Zero infrastructure cost for researchers and students.

### Production: CPU Deployment — llama.cpp

GGUF quantized models (Q4_K_M / Q5_K_M / Q8_0) for latency-sensitive, air-gapped, or edge environments.

```bash
./llama-cli -m model.gguf -p "Your prompt here" -n 256
```

- Runs on any x86/ARM CPU — no GPU required
- Ideal for laptops, on-premise servers, and embedded systems
- Sub-second inference for classification and short-generation tasks

### Production: GPU Deployment — vLLM

PagedAttention with continuous batching for high-throughput, multi-user inference.

```bash
vllm serve ./model --dtype float16 --max-model-len 4096
```

- Efficient KV-cache management for concurrent requests
- Linear throughput scaling with GPU count
- Production-grade API server out of the box

### Scaling Path

| Stage | Hardware | Cost | Throughput |
|---|---|---|---|
| Research | Colab T4 (free) | $0 | Single-user |
| Pilot | Single A100 (cloud) | ~$2/hr | 50-100 req/sec |
| Production | Multi-GPU vLLM cluster | ~$0.001/request | 1,000+ req/sec |

---

## Project Structure

```
IAE-SLMS/
│
├── multilingual_sentiment/    Task 1 — Multilingual sentiment (120K dataset)
│   ├── colabs/                      Gemma-3 & Qwen-2.5 notebooks
│   ├── datasets/                    multilingual_sentiment.csv
│   └── multilingual_sentiment_report.pdf
│
├── chain_of_thought/                Task 2 — CoT reasoning induction
│   └── llama3.2_chain_of_thought_finetuning.ipynb
│
├── text_summarization/              Task 3 — Length-controlled summarization
│   ├── mistral7b_text_summarization_initial.ipynb
│   ├── mistral7b_text_summarization_final.ipynb
│   └── text_summarization_report.pdf
│
├── roman_urdu/                  Task 4 — Roman Urdu chatbot
│   ├── colabs/                      Llama/Qwen/Mistral notebooks
│   ├── datasets/                    Roman Urdu Alpaca QA Mix
│   └── roman_urdu_language_models_report.pdf
│
├── retrieval_augmented_generation/   Task 5 — RAG pipeline
│   ├── rag_pipeline.ipynb
│   └── retrieval_augmented_generation_report.pdf
│
├── paper_outline.md                 IEEE-style technical paper outline
├── RESEARCH_SUMMARY.md              Executive summary for stakeholders
├── BENCHMARKS.md                    Comprehensive performance benchmarks
├── requirements.txt                 Python dependencies
├── CONTRIBUTING.md                  Contribution guidelines
├── CITATION.cff                     Academic citation metadata
└── LICENSE                          MIT License
```

---

## Reports & Publications

| Document | Description |
|---|---|
| [RESEARCH_SUMMARY.md](RESEARCH_SUMMARY.md) | Executive summary for investors and stakeholders |
| [BENCHMARKS.md](BENCHMARKS.md) | Complete performance benchmarks across all tasks |
| [paper_outline.md](paper_outline.md) | IEEE-style technical paper outline |
| [Sentiment Report](multilingual_sentiment/multilingual_sentiment_report.pdf) | Task 1 — Sentiment classification report |
| [Summarization Report](text_summarization/text_summarization_report.pdf) | Task 3 — Summarization report |
| [Roman Urdu Report](roman_urdu/roman_urdu_language_models_report.pdf) | Task 4 — Roman Urdu chatbot report |
| [RAG Report](retrieval_augmented_generation/retrieval_augmented_generation_report.pdf) | Task 5 — RAG pipeline report |

---

## Roadmap

| Phase | Timeline | Deliverables |
|---|---|---|
| **Multilingual Expansion** | Q2 2025 | Extend sentiment classification to Hindi, Bengali, Turkish, and Bahasa — covering 2B+ speakers |
| **Model Compression** | Q3 2025 | Sub-1B distilled models optimized for mobile (Android/iOS) and embedded (Raspberry Pi, Jetson Nano) deployment |
| **Production API** | Q3 2025 | RESTful inference API with authentication, rate limiting, and monitoring — deployable on-premise or cloud |
| **Faithfulness Training** | Q4 2025 | Attribution-aware fine-tuning and RLHF to raise RAG faithfulness from 0.38 to 0.80+ |
| **Formal Evaluation Suite** | Q4 2025 | Standardized benchmarks for Roman Urdu NLP — open-sourced to catalyze research in underserved languages |
| **Enterprise Pilot** | Q1 2026 | Partner deployment with 2-3 organizations for customer service, document processing, or compliance workflows |

---

## Key References

- Hu et al. (2021) — *LoRA: Low-Rank Adaptation of Large Language Models.* arXiv:2106.09685
- Dettmers et al. (2023) — *QLoRA: Efficient Finetuning of Quantized LLMs.* arXiv:2305.14314
- Wei et al. (2022) — *Chain-of-Thought Prompting Elicits Reasoning in LLMs.* NeurIPS
- Lewis et al. (2020) — *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.* NeurIPS
- Zhang et al. (2020) — *BERTScore: Evaluating Text Generation with BERT.* ICLR
- Kwon et al. (2023) — *Efficient Memory Management for LLM Serving with PagedAttention.* SOSP
- Jiang et al. (2023) — *Mistral 7B.* arXiv:2310.06825
- Google DeepMind (2024) — *Gemma 3 Technical Report*
- Meta AI (2024) — *Llama 3.1 Technical Report*
- Alibaba (2024) — *Qwen 2.5 Technical Report*

---

## Team

**IAE SLMS Research Team**

| Contributor | Primary Task |
|---|---|
| Rafia Shaikh | Roman Urdu — Llama 3.1-8B |
| Sana Khalid | Roman Urdu — Mistral 7B |
| M. Fareed | Roman Urdu — Qwen 2.5-3B |
| Team Members | Sentiment, CoT, Summarization, RAG |

---

## Citation

If you use this research, datasets, or any part of this repository, please cite:

```bibtex
@misc{iae-slms-2025,
  title     = {IAE-SLMS: Small Language Models — Applications, Fine-Tuning and Deployment},
  author    = {IAE SLMS Team},
  year      = {2025},
  publisher = {GitHub},
  url       = {https://github.com/m-jafri/IAE-SLMS},
  note      = {Research repository: five studies on parameter-efficient fine-tuning of sub-10B models}
}
```

Machine-readable citation: [CITATION.cff](CITATION.cff)

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <em>Built with the conviction that powerful AI should be accessible to everyone — not just those who can afford frontier-scale compute.</em>
</p>

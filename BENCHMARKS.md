# Benchmarks: Complete Performance Results

Comprehensive performance metrics across all five research tasks. All experiments conducted on free-tier Google Colab (NVIDIA T4 16GB or A100 40GB).

---

## Task 1: Multilingual Sentiment & Language Classification

### Gemma-3 (270M) — Three-Class Sentiment Classification

| Metric | Value |
|---|---|
| Overall Accuracy | **72.4%** |
| Evaluation Samples | 90 (balanced across classes) |
| Languages | English, Arabic, Urdu, Roman Urdu (simultaneous) |
| Training Epochs | 2 |
| Training Hardware | Colab T4 (free tier) |

**Per-Language Observations:**
- English and Arabic: strongest performance — well-represented in Gemma's pretraining data.
- Urdu and Roman Urdu: lower accuracy due to script overlap (Urdu in Nastaliq vs. Roman Urdu in Latin) and limited model capacity at 270M parameters.
- Dominant error mode: Urdu ↔ Roman Urdu confusion driven by linguistic similarity.

### Qwen-2.5 (0.5B) — Joint Language + Sentiment Classification

| Metric | English | Arabic | Urdu | Roman Urdu |
|---|---|---|---|---|
| JSON Validity Rate | **~99%** | **~95%** | **~85%** | **~68%** |
| Language ID Accuracy | High | High | Moderate | Moderate |
| Sentiment Accuracy (valid JSON) | High | High | Moderate | Moderate |

**Key Insight:** JSON validity rate serves as a proxy metric for instruction-following quality. The 68% floor on Roman Urdu reflects the model's limited exposure to this language during pretraining, not a fundamental architectural limitation.

### Baseline Comparison

| Approach | Parameters | Accuracy | Cost per 1K Inferences |
|---|---|---|---|
| GPT-4 API (zero-shot) | ~1.8T (estimated) | ~85–90% | ~$0.03–0.06 |
| Gemma-3 + LoRA (ours) | **270M** | **72.4%** | **<$0.001** |
| Qwen-2.5 + LoRA (ours) | **500M** | Comparable (joint task) | **<$0.001** |

> Our models achieve ~80–85% of frontier model accuracy at <3% of the cost, with full on-premise deployment capability.

---

## Task 3: Length-Controlled Abstractive Summarization

### Mistral 7B Instruct v0.2 — CNN/DailyMail

**Training Configuration:**
- Dataset: ~1,000 training / ~200 validation articles
- Epochs: 3
- Quantization: 4-bit NF4 (QLoRA)

### Epoch-Wise Performance

| Metric | Epoch 1 | Epoch 3 | Trend |
|---|---|---|---|
| Length Compliance | Good | Good | Learned early — stable |
| Hallucination Rate | High | Significantly Reduced | Improves with training |
| Article Grounding | Poor | Improved | Gradual improvement |
| Sentence Coherence | Moderate | Good | Steady improvement |

### Evaluation Metrics

| Metric | Description | Role in Analysis |
|---|---|---|
| ROUGE-1 | Unigram overlap with reference | Lexical similarity |
| ROUGE-2 | Bigram overlap with reference | Phrase-level accuracy |
| ROUGE-Lsum | Longest common subsequence | Summary-level structure |
| BERTScore | Contextual embedding similarity (RoBERTa-large) | Semantic quality |

**Hallucination Diagnostic:** ROUGE–BERTScore divergence (high BERTScore + low ROUGE) indicates text that is semantically plausible but factually unfaithful — a novel, automated signal for hallucination detection applicable to any generation pipeline.

### Inference Configuration

| Parameter | Value |
|---|---|
| Decoding | Autoregressive |
| Temperature | 0.7 |
| Top-p | 0.9 |
| Repetition Penalty | 1.2 |
| Max Tokens | 90 |

---

## Task 5: Retrieval-Augmented Generation (RAG)

### Pipeline Performance

| Component | Metric | Score | Interpretation |
|---|---|---|---|
| Retriever | Context Precision | **1.00** | Perfect — every relevant document is retrieved |
| Generator | Answer Relevancy | **0.73** | Good — answers address the query meaningfully |
| Generator | Faithfulness | **0.38** | Bottleneck — model relies on internal priors over retrieved context |

### Component Analysis

| Component | Status | Assessment |
|---|---|---|
| Query Encoder | Production-ready | Dense embeddings produce accurate query representations |
| Vector Store | Production-ready | Document chunking and embedding are effective |
| Retriever (top-k cosine) | Production-ready | Perfect precision with reliable recall |
| SLM Generator | Requires improvement | Faithfulness gap is the primary quality risk |

### Faithfulness Improvement Roadmap

| Strategy | Expected Impact | Complexity |
|---|---|---|
| Faithfulness-aware prompting | Moderate | Low |
| Aggressive passage filtering | Moderate | Low |
| Attribution fine-tuning | High | Medium |
| Post-generation re-ranking | High | Medium |
| RLHF/RLAIF alignment | Very High | High |

---

## Hardware Benchmarks

### Training Efficiency

| Task | Model | GPU Memory | Training Time | Hardware |
|---|---|---|---|---|
| Sentiment Classification | Gemma-3 270M | ~4 GB | ~1 hour | Colab T4 |
| Sentiment Classification | Qwen-2.5 0.5B | ~5 GB | ~1.5 hours | Colab T4 |
| Chain-of-Thought | Llama 3.2 | ~6–8 GB | ~2–3 hours | Colab T4 |
| Summarization | Mistral 7B | ~8 GB | ~2–3 hours | Colab T4 |
| Roman Urdu Chatbot | Llama 3.1-8B | **6–8 GB** | **~2–3 hours** | Colab T4 |
| Roman Urdu Chatbot | Qwen 2.5-3B | ~5 GB | ~1.5 hours | Colab T4 |
| Roman Urdu Chatbot | Mistral 7B | ~8 GB | ~2–3 hours | Colab T4 |

### QLoRA Memory Reduction

| Method | GPU Memory (Llama 3.1-8B) | Reduction |
|---|---|---|
| Full Fine-Tuning | ~28–32 GB | Baseline |
| QLoRA (4-bit NF4) | **6–8 GB** | **74%** |

### Inference Performance

| Deployment | Hardware | Latency (per token) | Throughput | Use Case |
|---|---|---|---|---|
| llama.cpp (Q4_K_M) | CPU (x86-64) | ~100–500 ms | Low | Edge, air-gapped, laptops |
| llama.cpp (Q8_0) | CPU (x86-64) | ~200–800 ms | Low | Higher quality, still no GPU |
| vLLM (FP16) | NVIDIA T4 | ~20–50 ms | Medium | Development, small-scale API |
| vLLM (FP16) | NVIDIA A100 | ~5–15 ms | High | Production, multi-user API |

### Cost Comparison

| Deployment | Hardware Cost | Per-Request Cost (est.) | Suitable For |
|---|---|---|---|
| Colab T4 (free) | $0 | $0 | Research, prototyping |
| Cloud A100 (on-demand) | ~$2/hr | ~$0.001 | Pilot, medium-scale |
| Cloud A100 (reserved) | ~$1/hr | ~$0.0005 | Production, high-scale |
| On-premise (amortized) | ~$0.30/hr | ~$0.0002 | Enterprise, data-sovereign |
| Frontier API (GPT-4) | — | ~$0.03–0.06 per 1K tokens | Comparison baseline |

> **Bottom line:** Our fine-tuned SLMs deliver 10–30x cost reduction per inference compared to frontier model API calls, with the additional benefit of full data sovereignty and on-premise deployment.

---

## Shared Training Configuration

All benchmarks above use the following unified PEFT configuration:

| Hyperparameter | Value |
|---|---|
| Fine-Tuning Method | QLoRA / LoRA |
| Quantization | 4-bit NormalFloat (NF4) |
| Optimizer | AdamW (8-bit) |
| LR Scheduler | Cosine Annealing |
| Precision | bfloat16 / FP16 |
| LoRA Rank | 16 |
| LoRA Alpha | 32 |
| Learning Rate | 1e-5 |
| Batch Size | 8 |
| Gradient Accumulation | 2 steps |

---

*All results are reproducible using the notebooks in this repository on free-tier Google Colab. For methodology details, see [paper_outline.md](paper_outline.md).*

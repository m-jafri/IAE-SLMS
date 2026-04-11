# Paper Outline: Small Language Models — Applications, Fine-Tuning, and Deployment

**Working Title:** *Practical Applications of Small Language Models: Fine-Tuning, Reasoning, and Deployment Under Resource Constraints*

**Venue type:** Technical report / conference paper (IEEE / ACL style)

---

## Abstract

One paragraph covering:
- Motivation: SLMs as viable alternatives to large models in resource-constrained environments
- Scope: five tasks — multilingual sentiment/language classification, chain-of-thought reasoning, text summarization, low-resource conversational AI (Roman Urdu), and retrieval-augmented generation
- Methods: parameter-efficient fine-tuning (LoRA/QLoRA) via Unsloth across multiple model families (Gemma, Qwen, Mistral, Llama)
- Key findings: PEFT enables competitive task performance on consumer hardware; deployment via llama.cpp (CPU) and vLLM (GPU); quantization strategies analysed
- One sentence on broader impact

---

## 1. Introduction

### 1.1 Motivation
- Gap between large frontier models and practical deployability
- Cost, latency, and hardware barriers of LLMs
- Case for SLMs: models under 10B parameters for domain-specific tasks

### 1.2 Research Scope
- Overview of the five tasks studied (list and briefly describe each)
- Unified theme: PEFT-based adaptation of SLMs on accessible hardware

### 1.3 Contributions
Bullet list of concrete contributions:
- Curated 120K-sample multilingual sentiment dataset (English, Arabic, Urdu, Roman Urdu)
- Fine-tuned and evaluated Gemma-3 (270M) for multilingual sentiment classification
- Fine-tuned Qwen-3 (0.5B) for joint language identification + sentiment classification
- Demonstrated chain-of-thought induction in SLMs
- Length-controlled abstractive news summarization with Mistral-7B; hallucination analysis across training epochs
- Fine-tuned Llama-3.1-8B for Roman Urdu conversational AI — a low-resource language setting
- Implemented and evaluated a RAG pipeline on top of fine-tuned SLMs
- Benchmarked CPU inference (llama.cpp) vs. GPU inference (vLLM) with quantization analysis

### 1.4 Paper Organization
Brief roadmap of sections

---

## 2. Background and Related Work

### 2.1 Small Language Models
- Definition and scope (sub-10B parameter models)
- Model families referenced: Gemma, Qwen, Mistral, Llama; their architecture highlights
- Trade-offs vs. large models: capability vs. efficiency

### 2.2 Parameter-Efficient Fine-Tuning
- Full fine-tuning limitations at scale
- LoRA (Low-Rank Adaptation): rank decomposition, adapter injection into attention layers
- QLoRA: 4-bit NormalFloat (NF4) quantization + LoRA; memory reduction (~74% vs. full FT)
- Unsloth framework: optimised PEFT training with reduced memory and faster throughput
- Key hyperparameter considerations: rank, alpha, learning rate, scheduler

### 2.3 Multilingual NLP and Low-Resource Languages
- Challenges of multilingual sentiment analysis
- Roman Urdu as a low-resource language: no standard script, limited pretrained support
- Prior work on Urdu/Roman Urdu NLP

### 2.4 Chain-of-Thought Reasoning in Small Models
- CoT prompting origins (Wei et al., 2022)
- Challenges of inducing reasoning in sub-1B models
- Fine-tuning vs. prompting for CoT

### 2.5 Abstractive Summarization with Instruction-Tuned Models
- Summarization as a conditional generation task
- Length control as an instruction-following objective
- Hallucination in summarization; ROUGE vs. BERTScore as complementary metrics

### 2.6 Retrieval-Augmented Generation
- RAG motivation: augmenting parametric knowledge with retrieved context
- Standard pipeline: encoder → vector store → retriever → generator
- Faithfulness vs. relevance distinction; known limitations with small generators

### 2.7 Model Deployment at the Edge
- Quantization schemes: INT4, INT8, NF4
- llama.cpp: CPU inference via GGUF quantized models
- vLLM: GPU inference with continuous batching and PagedAttention
- Trade-offs: throughput, latency, memory footprint

---

## 3. Common Experimental Infrastructure

### 3.1 Hardware and Platform
- Google Colab (free-tier GPU: T4/A100 depending on availability)
- CPU experiments via llama.cpp on standard x86 hardware

### 3.2 Fine-Tuning Framework
- Unsloth for PEFT training
- HuggingFace Transformers + PEFT library
- HuggingFace Hub for model hosting

### 3.3 Standard Training Configuration
Table of shared hyperparameters used across tasks:

| Hyperparameter | Value |
|---|---|
| Fine-tuning method | QLoRA / LoRA |
| Quantization | 4-bit NF4 |
| Optimizer | AdamW (8-bit) |
| LR Scheduler | Cosine Annealing |
| Precision | bfloat16 / FP16 |
| LoRA Rank | 16 |
| LoRA Alpha | 32 |
| Learning Rate | 1e-5 |
| Batch Size | 8 |
| Gradient Accumulation | 2 steps |

### 3.4 Evaluation Infrastructure
- Jupyter notebooks as reproducible experiment pipelines
- Metric libraries used: `evaluate` (ROUGE, BERTScore), `ragas` (RAG metrics)
- Experiment logging: Weights & Biases / MLflow

---

## 4. Task I: Multilingual Sentiment and Language Classification

### 4.1 Task Definition
- Sentiment classification: positive / negative / neutral
- Joint task: language identification + sentiment in a single forward pass
- Output format: structured JSON for reliable parsing

### 4.2 Dataset Construction
- Four languages: English (en), Arabic (ar), Urdu (ur), Roman Urdu (roman_ur)
- 30,000 balanced samples per language → 120,000 total
- Dataset schema: `{text, label, lang}`
- Class balance verification (figure: distribution chart)
- Data sourcing and curation methodology

### 4.3 Model 1 — Gemma-3 (270M): Sentiment Classification
- Model selection rationale: smallest viable generative model for structured output
- PEFT adaptation with LoRA on all four languages simultaneously
- Output format: `{"sentiment": "positive|negative|neutral"}`
- Training details: 2 epochs, batch 8, cosine scheduler, bf16

#### 4.3.1 Results
- Overall accuracy: 72.4% (90 examples, three-class evaluation)
- Per-class precision / recall / F1 (table from report)
- Confusion matrix analysis
- Observations: strong on English/Arabic; Urdu/Roman Urdu harder due to script overlap and model capacity

### 4.4 Model 2 — Qwen-3 (0.5B Instruct): Joint Language + Sentiment Classification
- Multi-task learning motivation: single model, two outputs
- Output format: `{"language": "en|ar|ur|roman_ur", "sentiment": "positive|negative|neutral"}`
- Training configuration (same PEFT setup, 2 epochs)

#### 4.4.1 Results
- JSON validity rate by language (bar chart)
- Language identification accuracy per language (bar chart)
- Sentiment accuracy comparison: all responses vs. valid JSON only
- Key finding: confusion between Urdu and Roman Urdu scripts
- JSON format compliance: generally high (68–99% by language)

### 4.5 Analysis and Discussion
- Impact of model size on multilingual capacity
- JSON-structured output as a reliability mechanism
- Urdu/Roman Urdu confusion: linguistic similarity as a confound
- PEFT effectiveness: successful convergence within 2 epochs on constrained hardware

---

## 5. Task II: Chain-of-Thought Induction in Small Language Models

### 5.1 Motivation
- Reasoning capability as a key frontier for SLMs
- Distinction between emergent CoT in large models vs. trained CoT in small models

### 5.2 Methodology
- Dataset construction / selection for CoT fine-tuning
  - Format: `{question, chain_of_thought_steps, final_answer}`
- Model(s) used and rationale
- Fine-tuning approach: supervised on CoT traces

### 5.3 Prompt Engineering for Reasoning
- System prompt design to elicit step-by-step responses
- Instruction templates used
- Zero-shot vs. few-shot vs. fine-tuned comparison

### 5.4 Results and Analysis
- Qualitative examples of reasoning chains generated
- Correctness of final answers vs. quality of intermediate steps
- Failure modes: short-circuiting to answer without reasoning, hallucinated steps
- Observations on minimum model scale for coherent CoT

### 5.5 Discussion
- CoT as a learnable behaviour vs. emergent property
- Data requirements for reliable reasoning induction
- Implications for instruction tuning pipelines

---

## 6. Task III: Length-Controlled Abstractive News Summarization

### 6.1 Task Definition
- Input: news article; output: abstractive summary of exactly N sentences (N ∈ {2, 3, 5})
- Instruction template design: explicit length conditioning in system prompt

### 6.2 Model and Dataset
- Base model: `mistralai/Mistral-7B-Instruct-v0.2` (decoder-only transformer)
- Dataset: CNN/DailyMail v3.0.0
  - Training: ~1,000 articles; Validation: ~200 articles
- Quantization: 4-bit NF4; computation precision: FP16

### 6.3 Fine-Tuning Configuration
- Supervised Fine-Tuning (SFT) with LoRA adapters on attention projection layers
- Epochs: 3; optimizer: AdamW 8-bit; gradient accumulation

### 6.4 Inference Configuration
- Autoregressive decoding; temperature 0.7; top-p 0.9; repetition penalty 1.2; max tokens 90
- Discussion of stochastic decoding and its effect on hallucination risk

### 6.5 Evaluation Metrics
- Lexical: ROUGE-1, ROUGE-2, ROUGE-Lsum
- Semantic: BERTScore (RoBERTa-large)
- Limitation: BERTScore insensitivity to factual hallucinations

### 6.6 Results: Epoch-Wise Behavioral Analysis

#### 6.6.1 Epoch 1 — Undertrained Model
- High hallucination rate: fabricated entities, prices, off-topic events
- Good sentence-count adherence despite poor faithfulness
- Interpretation: model relies on pretrained world priors over article content

#### 6.6.2 Epoch 3 — Partially Adapted Model
- Significant hallucination reduction
- Improved article-specific grounding
- Better sentence coherence

### 6.7 Key Findings
- **Length control vs. faithfulness trade-off**: length control is a surface-level behaviour learned early; factual faithfulness requires deeper adaptation
- Training duration more impactful on hallucination reduction than dataset size alone
- ROUGE–BERTScore divergence as a diagnostic for hallucination

### 6.8 Discussion
- Data efficiency under compute constraints
- Implications for production summarization pipelines
- Recommended mitigation: more epochs, faithfulness-aware loss, larger dataset

---

## 7. Task IV: Roman Urdu Conversational AI (Low-Resource SLM)

### 7.1 Problem Statement
- Roman Urdu: informally transliterated Urdu written in Latin script
- No standard orthography; limited pretrained NLP resources
- Target capability: general conversational question answering

### 7.2 Dataset
- Primary: Roman Urdu Alpaca QA Mix (Redgerd, HuggingFace Hub)
  - ~10,000+ instruction-following samples
  - Format: `{input, output, language_tag}`
- Alternatives considered: Roman-Urdu-Parliament (RUP), uQUAD, Awesome Urdu Dataset
- Selection rationale: native Roman script, instruction-following quality, balance

### 7.3 Models Evaluated
Table comparing candidate models:

| Model | Parameters | Rationale |
|---|---|---|
| Meta Llama-3.1-8B-Instruct | 8B | Strong instruction following; multilingual support |
| Qwen2.5-3B-Instruct | 3B | Parameter efficiency; instruction-tuned |
| Mistral-7B-Instruct | 7B | Fast inference; good for edge deployment |

- Primary fine-tuning performed on Llama-3.1-8B

### 7.4 Fine-Tuning Pipeline
- QLoRA (4-bit): LoRA rank 16, alpha 32, lr 1e-5, cosine annealing, bfloat16
- Training: 500 steps, batch size 8, gradient accumulation 2, eval every 50 steps
- GPU memory: 6–8 GB (feasible on free-tier Colab)
- Training time: ~2–3 hours per experiment
- Metrics tracked: training loss, eval loss, GPU memory

### 7.5 Results

#### 7.5.1 Qualitative Analysis
- Proper Roman Urdu generation with contextually appropriate, conversational responses
- Qualitative output examples (screenshots from live demo)

#### 7.5.2 Technical Metrics
| Metric | Value |
|---|---|
| Training memory reduction vs. full FT | 74% (QLoRA advantage) |
| Inference speed | ~50–100ms per token |
| Training GPU memory | 6–8 GB |

### 7.6 Deployment
- Model weights hosted on HuggingFace Hub
- Live Gradio demo deployed (interactive chatbot interface)
- API-accessible inference endpoint

### 7.7 Discussion
- Feasibility of SLM fine-tuning for genuinely low-resource languages
- Challenges: no existing baseline for Roman Urdu chatbots; limited annotated test sets
- Future: quantitative evaluation (BLEU/ROUGE with native speaker references); larger dataset

---

## 8. Task V: Retrieval-Augmented Generation (RAG)

### 8.1 Motivation
- Limitations of parametric-only SLMs: outdated knowledge, hallucination, domain gaps
- RAG as a complementary framework: ground generation in retrieved external documents

### 8.2 System Architecture
Four-component pipeline diagram:
1. **Query Encoder** — dense vector representation of user query (lightweight embedding model)
2. **Document Store** — vector database of chunked, embedded domain documents
3. **Retriever** — top-k retrieval via cosine similarity
4. **Generator (SLM)** — fine-tuned SLM generates grounded response from query + context

### 8.3 Evaluation Methodology
Three RAG-specific metrics (via automated evaluation pipeline):

| Metric | Description |
|---|---|
| Answer Relevancy | How well the generated answer addresses the query |
| Context Precision | Whether retrieved documents are relevant to the query |
| Faithfulness | Whether the answer is strictly grounded in retrieved context |

### 8.4 Results

| Metric | Score |
|---|---|
| Answer Relevancy | 0.73 |
| Context Precision | **1.00** |
| Faithfulness | 0.38 |

### 8.5 Analysis
- **Context Precision = 1.00**: retrieval pipeline is robust; document chunking and embedding effective
- **Answer Relevancy = 0.73**: RAG significantly improves response usefulness over standalone generation
- **Faithfulness = 0.38**: primary bottleneck; SLM relies on internal priors despite accurate retrieval — characteristic of limited-capacity generators

### 8.6 Key Observations and Limitations
- Retrieval component substantially outperforms generation component in reliability
- SLMs require explicit grounding constraints in prompt templates
- Limited model capacity restricts nuanced reasoning over long retrieved passages

### 8.7 Proposed Improvements
- Faithfulness-aware prompt engineering (instruct model to only use retrieved context)
- Answer-context attribution fine-tuning (penalise unsupported statements)
- Aggressive passage filtering (smaller, higher-relevance context windows)
- Post-generation faithfulness re-ranking with a verifier model

---

## 9. Model Deployment: CPU and GPU Inference

### 9.1 Overview
- Motivation: production deployment beyond Colab; edge and server scenarios
- Two deployment targets: CPU (llama.cpp) and GPU (vLLM)

### 9.2 CPU Deployment via llama.cpp
- GGUF format: quantized model weights for CPU-efficient inference
- Quantization levels explored: Q4_K_M, Q5_K_M, Q8_0 (or whichever were tested)
- Benchmark: tokens/second, memory footprint, accuracy degradation vs. FP16 baseline
- Use case: developer laptops, air-gapped environments, embedded systems

### 9.3 GPU Deployment via vLLM
- PagedAttention: efficient KV-cache management enabling high throughput
- Continuous batching: handling multiple concurrent requests
- Benchmark: throughput (tokens/sec), latency (TTFT, ITL), GPU memory utilisation
- Use case: server-side API deployment, multi-user inference

### 9.4 Quantization Analysis
- Quantization schemes: INT4, INT8, NF4 (used during training vs. inference)
- Quality-efficiency trade-off: perplexity / task accuracy vs. memory and speed
- Practical guidance: when to use which quantization level

### 9.5 Comparative Summary
Table: CPU (llama.cpp) vs. GPU (vLLM) across throughput, latency, memory, accuracy, and hardware requirements

---

## 10. Cross-Task Discussion

### 10.1 PEFT as a Unifying Strategy
- Consistent finding across all tasks: QLoRA enables meaningful adaptation with <10 GB GPU memory
- LoRA rank and alpha sensitivity discussion

### 10.2 The Role of Data Quality and Scale
- Summarization (1K samples) vs. Roman Urdu (10K samples) vs. Sentiment (120K samples): correlation between data scale and task reliability
- Data curation investment often more impactful than architecture choice

### 10.3 Structured Output as an Engineering Pattern
- JSON-formatted generation used in sentiment/language classification
- Reliability implications; validity rate as a proxy metric for instruction following

### 10.4 Hallucination Across Tasks
- Characterisation in summarization (fabricated entities)
- Characterisation in RAG (unfaithful generation)
- Common root cause: insufficient alignment between model priors and task-specific grounding

### 10.5 SLMs for Low-Resource Languages
- Roman Urdu as a case study in applying PEFT to languages without pretrained coverage
- Broader implications for regional language NLP

---

## 11. Conclusion

### 11.1 Summary of Accomplishments
- Recap of all five tasks and their outcomes
- Highlight: end-to-end research pipeline from dataset curation → fine-tuning → evaluation → deployment

### 11.2 Key Takeaways
- SLMs are practically viable for diverse NLP tasks under resource constraints
- PEFT (LoRA/QLoRA) is the enabling technique; Unsloth accelerates the training loop
- Faithfulness — in both summarization and RAG — is the hardest property to instil in small models
- CPU deployment (llama.cpp) is viable for low-throughput use cases; GPU deployment (vLLM) preferred for production
- Quantization at 4-bit (NF4/Q4) strikes an effective quality-efficiency balance

### 11.3 Future Work
- Scale datasets and training epochs for summarization and Roman Urdu tasks
- Quantitative human evaluation for Roman Urdu chatbot
- Faithfulness-constrained training (attribution loss, RLHF/RLAIF)
- Multi-task joint fine-tuning across classification, summarization, and QA
- Exploration of sub-1B models (edge deployment on mobile/embedded hardware)
- Formal CoT evaluation benchmarks

---

## 12. References

Key papers to cite (collected from existing reports):

- Hu et al. (2021). *LoRA: Low-Rank Adaptation of Large Language Models.* arXiv:2106.09685
- Dettmers et al. (2023). *QLoRA: Efficient Finetuning of Quantized LLMs.* arXiv:2305.14314
- Wei et al. (2022). *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.* NeurIPS
- Lewis et al. (2020). *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.* NeurIPS
- See et al. (2017). *Get To The Point: Summarization with Pointer-Generator Networks.* ACL
- Zhang et al. (2020). *BERTScore: Evaluating Text Generation with BERT.* ICLR
- Lin (2004). *ROUGE: A Package for Automatic Evaluation of Summaries.* ACL Workshop
- Jiang et al. (2023). *Mistral 7B.* arXiv:2310.06825
- Team et al. (2024). *Gemma 3.* Google DeepMind
- Touvron et al. (2024). *Llama 3.1.* Meta AI
- Qwen Team (2024). *Qwen2.5 Technical Report.* Alibaba Group
- Dettmers et al. (2022). *LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale.*
- Kwon et al. (2023). *Efficient Memory Management for Large Language Model Serving with PagedAttention.* SOSP (vLLM)
- Gerganov (2023). *llama.cpp.* GitHub
- Alif: Advancing Urdu Large Language Models via Multilingual Synthetic Data Distillation. arXiv:2510.03683
- Redgerd. *Roman Urdu Alpaca QA Mix.* HuggingFace Hub
- Hermann et al. (2015). *Teaching Machines to Read and Comprehend.* NeurIPS (CNN/DailyMail dataset)

---

## Appendices (Optional)

### A. Dataset Statistics
- Full breakdown of sentiment dataset by language and class
- Roman Urdu dataset sample distribution

### B. Training Curves
- Loss vs. step plots for each task

### C. Prompt Templates
- Exact instruction templates used for each task (sentiment classification, summarization, Roman Urdu chatbot, RAG)

### D. Qualitative Output Examples
- Side-by-side: base model vs. fine-tuned model for each task
- Roman Urdu chatbot conversation examples
- Summarization epoch 1 vs. epoch 3 comparison

### E. Deployment Benchmarks
- Full latency/throughput tables for llama.cpp and vLLM across model sizes and quantization levels

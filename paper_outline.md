# Practical Applications of Small Language Models: Fine-Tuning, Reasoning, and Deployment Under Resource Constraints

**Venue:** IEEE / ACL Conference Paper (Technical Report)

**Authors:** IAE SLMS Research Team

---

## Abstract

- Motivation: large language models deliver state-of-the-art NLP performance but impose prohibitive costs in compute, latency, energy, and data privacy — creating barriers for resource-constrained organizations and underserved language communities.
- Scope: five task-specific studies on adapting small language models (270M–8B parameters) using parameter-efficient fine-tuning: (1) multilingual sentiment and language classification, (2) chain-of-thought reasoning induction, (3) length-controlled abstractive summarization, (4) low-resource conversational AI for Roman Urdu, and (5) retrieval-augmented generation.
- Methods: LoRA and QLoRA via Unsloth, 4-bit NF4 quantization, applied across four model families (Gemma, Qwen, Mistral, Llama) on free-tier consumer GPUs.
- Key findings: PEFT enables competitive task-specific performance with 74% GPU memory reduction; structured JSON output achieves 68–99% validity for multi-task classification; RAG retrieval reaches perfect precision (1.00) with small encoders; chain-of-thought reasoning is demonstrably learnable, not exclusively emergent; ROUGE–BERTScore divergence serves as an effective hallucination diagnostic.
- Deployment analysis: CPU inference via llama.cpp and GPU inference via vLLM with quantization benchmarks demonstrate viable production paths at 10–30x lower cost than frontier models.

---

## I. Introduction

### I-A. Motivation
- The gap between frontier model capability and practical deployability is widening: GPT-4-class models require multi-GPU clusters, cost $0.03–0.06/1K tokens, and prohibit on-premise deployment for privacy-sensitive domains.
- Small language models (sub-10B parameters) offer a fundamentally different value proposition: domain-specific performance at orders-of-magnitude lower cost, with deployment flexibility from cloud clusters to laptop CPUs.
- The critical open question is not whether SLMs can be fine-tuned, but whether they can deliver production-grade reliability across diverse, real-world NLP tasks.

### I-B. Research Contributions
1. Curated a 120,000-sample balanced multilingual sentiment dataset spanning English, Arabic, Urdu, and Roman Urdu.
2. Demonstrated that a 270M-parameter model (Gemma-3) achieves 72.4% three-class sentiment accuracy across four languages with LoRA fine-tuning.
3. Achieved joint language identification and sentiment classification in a single forward pass using structured JSON output with 68–99% validity (Qwen-2.5 0.5B).
4. Provided empirical evidence that chain-of-thought reasoning can be induced via supervised fine-tuning in small models, establishing CoT as a learnable behavior rather than an exclusively emergent property.
5. Characterized the length-control vs. faithfulness trade-off in abstractive summarization: surface-level instruction compliance is learned within one epoch, while factual grounding requires three or more epochs.
6. Introduced the first fine-tuned conversational AI system for Roman Urdu — a low-resource language with 70M+ speakers and no prior chatbot baselines — achieving fluent generation with 74% memory reduction via QLoRA.
7. Implemented a four-stage RAG pipeline achieving perfect context precision (1.00) with a small encoder, identifying generator faithfulness (0.38) as the primary bottleneck and proposing mitigation strategies.
8. Benchmarked CPU (llama.cpp) and GPU (vLLM) deployment paths with quantization analysis, providing practical deployment guidance for production environments.

### I-C. Paper Organization
- Section II: background and related work. Section III: shared experimental infrastructure. Sections IV–VIII: individual task studies. Section IX: deployment benchmarks. Section X: cross-task discussion. Section XI: conclusion and future work.

---

## II. Background and Related Work

### II-A. Small Language Models
- Definition: language models with fewer than 10 billion parameters, targeting task-specific rather than general-purpose capability.
- Model families: Gemma (Google DeepMind), Qwen (Alibaba), Mistral (Mistral AI), Llama (Meta AI) — architectural highlights, training data, and intended use cases for each.
- Capability-efficiency frontier: characterizing the trade-off between model scale and task-specific performance.

### II-B. Parameter-Efficient Fine-Tuning
- Full fine-tuning: gradient computation over all parameters is memory-prohibitive for models above ~1B on consumer hardware.
- LoRA (Hu et al., 2021): low-rank decomposition of weight update matrices, injected as parallel adapters into attention projection layers.
- QLoRA (Dettmers et al., 2023): 4-bit NormalFloat (NF4) quantization of the frozen base model combined with LoRA adapters in higher precision — achieving 74% memory reduction with minimal quality degradation.
- Unsloth: optimized PEFT training framework providing 2x speedup and 50% memory reduction over standard HuggingFace implementations.
- Hyperparameter sensitivity: effects of rank, alpha, learning rate, and scheduler choice on convergence and final task performance.

### II-C. Multilingual NLP and Low-Resource Languages
- Challenges of multilingual sentiment analysis: label distribution imbalance, cultural context sensitivity, script-specific tokenization.
- Roman Urdu as a uniquely challenging case: informal Latin-script transliteration of Urdu with no standard orthography, limited annotated data, and near-zero pretrained model coverage.
- Prior work on Urdu and Roman Urdu NLP: dataset availability, existing baselines, and the gap this work addresses.

### II-D. Chain-of-Thought Reasoning
- Emergent CoT in large models (Wei et al., 2022): step-by-step reasoning elicited via prompting at sufficient model scale.
- Open question: can CoT be induced via supervised fine-tuning in models below the emergent threshold?
- Related approaches: process supervision, step-wise reward models, reasoning distillation.

### II-E. Abstractive Summarization
- Summarization as conditional text generation with instruction-following constraints.
- Length control as an explicit instruction-following objective — distinct from content quality.
- Hallucination in abstractive summarization: taxonomy (intrinsic vs. extrinsic), detection methods, and the limitations of standard metrics (ROUGE, BERTScore) for identifying unfaithful content.

### II-F. Retrieval-Augmented Generation
- RAG motivation (Lewis et al., 2020): augmenting parametric language models with non-parametric retrieval to reduce hallucination and enable access to dynamic knowledge.
- Standard pipeline: dense encoder → vector store → top-k retrieval → conditioned generation.
- Known limitations with small generators: insufficient context integration capacity, tendency to override retrieved content with parametric priors.

### II-G. Model Deployment and Quantization
- Post-training quantization: INT4, INT8, NF4 — quality-efficiency trade-offs at each level.
- llama.cpp (Gerganov, 2023): GGUF format, CPU-optimized inference, quantization options (Q4_K_M through Q8_0).
- vLLM (Kwon et al., 2023): PagedAttention for efficient KV-cache management, continuous batching for high-throughput multi-user serving.

---

## III. Experimental Infrastructure

### III-A. Hardware and Platform
- Primary: Google Colab free tier (NVIDIA T4 16GB / A100 40GB, subject to availability).
- CPU inference: standard x86-64 hardware via llama.cpp.
- GPU inference: vLLM on NVIDIA GPUs with CUDA 11.8+.

### III-B. Software Stack
- Unsloth for PEFT training (LoRA/QLoRA adapter management).
- HuggingFace Transformers (model loading, tokenization, generation).
- HuggingFace PEFT library (adapter configuration and merging).
- bitsandbytes (4-bit quantization runtime).
- Evaluation: `evaluate` library (ROUGE, BERTScore), `ragas` (RAG-specific metrics).

### III-C. Unified Hyperparameter Configuration
- Table: LoRA rank 16, alpha 32, NF4 quantization, AdamW 8-bit optimizer, cosine annealing, learning rate 1e-5, batch size 8, gradient accumulation 2 steps.
- Rationale for each choice: memory constraints, convergence stability, and prevention of catastrophic forgetting.

---

## IV. Task I: Multilingual Sentiment and Language Classification

### IV-A. Task Definition
- Three-class sentiment classification (positive / negative / neutral) across four languages.
- Joint language identification + sentiment classification as a multi-task learning formulation using structured JSON output.

### IV-B. Dataset Construction
- 120,000 samples: 30,000 per language (English, Arabic, Urdu, Roman Urdu), balanced across sentiment classes.
- Schema: `{text, label, lang}`.
- Curation methodology, source datasets, and quality assurance procedures.

### IV-C. Gemma-3 (270M) — Sentiment Classification
- Model selection rationale: smallest viable generative model capable of structured output.
- Training: 2 epochs, LoRA on attention layers, 4-bit NF4, bfloat16.
- Results: 72.4% overall accuracy (90-sample evaluation). Per-class precision, recall, F1. Confusion matrix analysis.

### IV-D. Qwen-2.5 (0.5B) — Joint Language + Sentiment
- Multi-task output format: `{"language": "...", "sentiment": "..."}`.
- Results: JSON validity 68–99% by language. Language ID accuracy. Sentiment accuracy (all responses vs. valid JSON only).
- Dominant error: Urdu ↔ Roman Urdu confusion driven by linguistic similarity.

### IV-E. Discussion
- Impact of model scale on multilingual capacity.
- JSON-structured output as an engineering reliability mechanism.
- PEFT convergence within 2 epochs on constrained hardware.

---

## V. Task II: Chain-of-Thought Induction

### V-A. Motivation
- Establishing whether structured reasoning is a learnable skill or an exclusively emergent property of scale.

### V-B. Methodology
- Dataset: structured samples with `{question, chain_of_thought_steps, final_answer}`.
- Supervised fine-tuning on explicit reasoning traces.
- System prompt design for step-by-step elicitation.

### V-C. Results
- Qualitative analysis: coherent reasoning chains on arithmetic, logic, and simple multi-step problems.
- Failure modes: answer short-circuiting, hallucinated intermediate steps, degradation on multi-hop reasoning.
- Comparison: zero-shot vs. few-shot vs. fine-tuned CoT quality.

### V-D. Discussion
- Evidence supporting CoT as a learnable behavior — not exclusively emergent.
- Data quality requirements for reliable reasoning induction.
- Implications for instruction-tuning pipelines and on-device reasoning.

---

## VI. Task III: Length-Controlled Abstractive Summarization

### VI-A. Task Definition
- Input: news article. Output: abstractive summary of exactly N sentences (N ∈ {2, 3, 5}).
- Explicit length conditioning embedded in the instruction template.

### VI-B. Model and Dataset
- Base model: Mistral-7B-Instruct-v0.2 (decoder-only transformer).
- Dataset: CNN/DailyMail v3.0.0 (~1,000 training, ~200 validation articles).
- Inference: temperature 0.7, top-p 0.9, repetition penalty 1.2.

### VI-C. Epoch-Wise Behavioral Analysis
- Epoch 1: high hallucination rate (fabricated entities, off-topic content), but correct sentence-count adherence — demonstrating that length control is a surface behavior learned early.
- Epoch 3: significant hallucination reduction, improved article-specific grounding, better sentence coherence.

### VI-D. Key Findings
- Length control vs. faithfulness trade-off: surface-level instruction compliance is learned in epoch 1; factual faithfulness requires extended training.
- Training duration is more impactful than dataset size for hallucination reduction.
- ROUGE–BERTScore divergence as a hallucination diagnostic: high BERTScore with low ROUGE indicates semantically plausible but factually unfaithful text.

---

## VII. Task IV: Roman Urdu Conversational AI

### VII-A. Problem Statement
- Roman Urdu: informally transliterated Urdu in Latin script, used by 70M+ speakers, with no standard orthography and no existing chatbot baselines.

### VII-B. Models and Dataset
- Three candidate models: Llama 3.1-8B (primary), Qwen 2.5-3B, Mistral 7B.
- Dataset: Redgerd Roman Urdu Alpaca QA Mix (~10,000+ instruction-following samples).
- Training: QLoRA, 500 steps, 6–8 GB GPU memory.

### VII-C. Results
- Fluent Roman Urdu generation with contextually appropriate conversational responses.
- 74% GPU memory reduction via QLoRA. Inference: 50–100 ms/token.
- Training time: 2–3 hours per experiment on free-tier Colab.

### VII-D. Deployment
- HuggingFace Hub model hosting. Live Gradio demo. API-accessible inference endpoint.

---

## VIII. Task V: Retrieval-Augmented Generation

### VIII-A. Architecture
- Four-stage pipeline: query encoder → vector store → retriever → SLM generator.

### VIII-B. Evaluation
- Metrics (via `ragas`): Context Precision **1.00**, Answer Relevancy **0.73**, Faithfulness **0.38**.

### VIII-C. Analysis
- Retrieval component is highly reliable (perfect precision).
- Generator faithfulness is the primary bottleneck — SLM relies on internal priors despite accurate retrieval.
- Proposed mitigations: faithfulness-aware prompting, attribution fine-tuning, aggressive passage filtering, post-generation re-ranking.

---

## IX. Model Deployment Benchmarks

### IX-A. CPU Deployment — llama.cpp
- GGUF quantization: Q4_K_M, Q5_K_M, Q8_0.
- Benchmarks: tokens/second, memory footprint, accuracy degradation vs. FP16.
- Use cases: laptops, air-gapped environments, embedded systems.

### IX-B. GPU Deployment — vLLM
- PagedAttention: efficient KV-cache management.
- Continuous batching: concurrent multi-user request handling.
- Benchmarks: throughput (tokens/sec), latency (TTFT, ITL), GPU memory utilization.

### IX-C. Quantization Analysis
- Quality-efficiency trade-off across INT4, INT8, and NF4.
- Practical guidance: when to use each quantization level based on task sensitivity and hardware constraints.

---

## X. Cross-Task Discussion

### X-A. PEFT as a Unifying Strategy
- Consistent finding: QLoRA enables meaningful task adaptation with <10 GB GPU memory across all five tasks.
- LoRA rank and alpha sensitivity analysis.

### X-B. Data Quality vs. Scale
- Summarization (1K samples) vs. Roman Urdu (10K) vs. Sentiment (120K): correlation between data scale and task reliability.
- Data curation investment is often more impactful than architecture selection.

### X-C. Structured Output as an Engineering Pattern
- JSON-formatted generation in classification tasks: validity rate as a proxy for instruction-following quality.
- Implications for production API design.

### X-D. Hallucination Across Tasks
- Summarization: fabricated entities and events.
- RAG: unfaithful generation despite accurate retrieval.
- Common root cause: insufficient alignment between parametric priors and task-specific grounding.

### X-E. SLMs for Low-Resource Languages
- Roman Urdu as a case study for applying PEFT to languages without pretrained coverage.
- Broader implications for regional language NLP across South Asia, Africa, and Southeast Asia.

---

## XI. Conclusion

### XI-A. Summary
- Five tasks, four model families, one unified methodology: parameter-efficient fine-tuning makes small language models viable for diverse, production-grade NLP tasks on consumer hardware.
- End-to-end pipeline demonstrated: dataset curation → fine-tuning → evaluation → deployment.

### XI-B. Key Takeaways
1. SLMs are practically viable for structured NLP tasks under resource constraints.
2. PEFT (LoRA/QLoRA) is the enabling technique; Unsloth accelerates the training loop.
3. Faithfulness — in both summarization and RAG — is the hardest property to instill in small models.
4. CPU deployment (llama.cpp) is viable for low-throughput use cases; GPU deployment (vLLM) is preferred for production.
5. 4-bit NF4 quantization strikes an effective quality-efficiency balance across all tasks tested.

### XI-C. Future Work
- Scale datasets and training epochs for summarization and Roman Urdu tasks.
- Quantitative human evaluation for Roman Urdu chatbot (BLEU/ROUGE with native speaker references).
- Faithfulness-constrained training: attribution loss, RLHF/RLAIF.
- Multi-task joint fine-tuning across classification, summarization, and QA.
- Sub-1B model exploration for mobile and embedded deployment.
- Formal CoT evaluation benchmarks.
- Multilingual expansion: Hindi, Bengali, Turkish, Bahasa.

---

## References

1. Hu, E. J., et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models. *arXiv:2106.09685*.
2. Dettmers, T., et al. (2023). QLoRA: Efficient Finetuning of Quantized Language Models. *arXiv:2305.14314*.
3. Wei, J., et al. (2022). Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. *NeurIPS*.
4. Lewis, P., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *NeurIPS*.
5. See, A., et al. (2017). Get To The Point: Summarization with Pointer-Generator Networks. *ACL*.
6. Zhang, T., et al. (2020). BERTScore: Evaluating Text Generation with BERT. *ICLR*.
7. Lin, C.-Y. (2004). ROUGE: A Package for Automatic Evaluation of Summaries. *ACL Workshop*.
8. Jiang, A. Q., et al. (2023). Mistral 7B. *arXiv:2310.06825*.
9. Google DeepMind (2024). Gemma 3 Technical Report.
10. Meta AI (2024). Llama 3.1 Technical Report.
11. Qwen Team (2024). Qwen 2.5 Technical Report. Alibaba Group.
12. Dettmers, T., et al. (2022). LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale.
13. Kwon, W., et al. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention. *SOSP*.
14. Gerganov, G. (2023). llama.cpp. GitHub.
15. Redgerd. Roman Urdu Alpaca QA Mix. HuggingFace Hub.
16. Hermann, K. M., et al. (2015). Teaching Machines to Read and Comprehend. *NeurIPS*.

---

## Appendices

### A. Dataset Statistics
- Sentiment dataset: full breakdown by language and class.
- Roman Urdu dataset: sample distribution and quality statistics.

### B. Training Curves
- Loss vs. step plots for each task.

### C. Prompt Templates
- Exact instruction templates for sentiment classification, summarization, Roman Urdu chatbot, and RAG.

### D. Qualitative Output Examples
- Base model vs. fine-tuned model for each task.
- Summarization epoch 1 vs. epoch 3 comparison.
- Roman Urdu chatbot conversation examples.

### E. Deployment Benchmarks
- Full latency/throughput tables for llama.cpp and vLLM across model sizes and quantization levels.

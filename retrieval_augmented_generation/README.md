# Task 5: Retrieval-Augmented Generation (RAG)

Implementing and evaluating a four-stage RAG pipeline that pairs a fine-tuned small language model with a vector-based retrieval system to ground generation in external documents.

## Why This Matters

Every organization sits on proprietary knowledge — internal wikis, policy documents, product manuals, research archives — that frontier LLMs cannot access and should not receive via cloud APIs. Retrieval-Augmented Generation solves both problems: it grounds AI responses in an organization's own documents while keeping all data on-premise. This work demonstrates that the **retrieval half of the pipeline is already production-ready** with small models (perfect 1.00 context precision), meaning organizations can deploy reliable document search today. The identified faithfulness gap (0.38) in the generation half provides a clear, bounded engineering problem — not a research dead-end — with concrete mitigation strategies that map directly to product improvement milestones.

## Objective

SLMs have limited parametric knowledge and are prone to hallucination on knowledge-intensive queries. This task augments a fine-tuned SLM with a retrieval component so that generated answers are grounded in relevant, retrieved documents rather than relying solely on the model's internal priors.

## Architecture

```
User Query
    │
    ▼
┌──────────────┐
│ Query Encoder │  ← Dense embedding of the input query
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Vector Store  │  ← Chunked & embedded domain documents
└──────┬───────┘
       │  top-k cosine similarity
       ▼
┌──────────────┐
│  Retriever    │  ← Selects most relevant passages
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ SLM Generator │  ← Fine-tuned model generates answer from query + context
└──────────────┘
```

## How to Run

1. Open `rag_pipeline.ipynb` in Google Colab with a T4 or A100 GPU runtime.

2. Install dependencies:
   ```bash
   pip install unsloth transformers peft accelerate bitsandbytes datasets ragas
   ```

3. Run all cells top-to-bottom. The notebook covers:
   - Document loading and chunking
   - Embedding and vector store creation
   - Retriever configuration
   - SLM generator integration
   - Evaluation with `ragas` metrics

## Notebook

| File | Description |
|---|---|
| `rag_pipeline.ipynb` | End-to-end RAG pipeline: document ingestion, retrieval, generation, and evaluation |

## Evaluation Metrics

Evaluated using the `ragas` framework with three standard RAG metrics:

| Metric | Score | Interpretation |
|---|---|---|
| Context Precision | **1.00** | Retrieval is highly accurate — relevant documents are consistently retrieved |
| Answer Relevancy | **0.73** | Generated answers address the query well, with room for improvement |
| Faithfulness | **0.38** | Primary bottleneck — the SLM often relies on internal priors instead of strictly grounding in retrieved context |

## Key Findings

- **Retrieval is reliable**: The encoder + vector store pipeline achieves perfect context precision, confirming that document chunking and embedding are effective.
- **Generation is the bottleneck**: Low faithfulness (0.38) indicates the SLM generates plausible but unsupported statements — a known limitation of small generators.
- **Proposed improvements**: Faithfulness-aware prompting, answer-context attribution fine-tuning, aggressive passage filtering, and post-generation re-ranking with a verifier model.

## Future Work

- **Faithfulness-constrained fine-tuning**: Train with attribution-aware objectives (e.g., NLI-based faithfulness loss) to raise the faithfulness score from 0.38 toward the 0.80+ threshold required for enterprise deployment.
- **Hybrid retrieval**: Combine dense vector retrieval with sparse BM25 scoring to improve recall on keyword-heavy queries (e.g., product codes, policy numbers) where purely semantic retrieval underperforms.
- **Multi-document reasoning**: Extend the pipeline to synthesize answers across 5–10 retrieved passages rather than conditioning on a single top-k result, enabling more complete answers to complex questions.

## Report

| File | Description |
|---|---|
| `retrieval_augmented_generation_report.pdf` | Full methodology, architecture diagrams, evaluation results, and analysis |

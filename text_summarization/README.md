# Task 3: Length-Controlled Abstractive News Summarization

Fine-tuning Mistral 7B Instruct v0.2 with QLoRA via Unsloth for length-controlled abstractive summarization on the CNN/DailyMail dataset, with epoch-wise analysis of hallucination behavior.

## Why This Matters

Every enterprise generates more documents than its people can read. Legal teams review contracts, analysts digest earnings reports, compliance officers process regulatory filings — and the volume grows faster than headcount. Automated summarization with **precise length control** (e.g., "give me exactly 3 sentences") is directly deployable for executive briefings, report digests, and compliance summaries. Critically, this work reveals that hallucination risk follows a predictable pattern across training epochs — and introduces ROUGE–BERTScore divergence as an automated hallucination detection signal. This diagnostic is immediately applicable to any production summarization pipeline as a quality gate, reducing the risk of factually unfaithful AI-generated content reaching end users.

## Objective

Generate abstractive summaries of news articles with **explicit length control** (N sentences, where N is 2, 3, or 5). This task studies:
1. How quickly instruction-following behavior (length control) is learned.
2. How training duration affects factual faithfulness.
3. The divergence between lexical metrics (ROUGE) and semantic metrics (BERTScore) as a hallucination diagnostic.

## Model

| Property | Value |
|---|---|
| Base Model | mistralai/Mistral-7B-Instruct-v0.2 |
| Architecture | Decoder-only Transformer |
| Fine-Tuning | QLoRA (4-bit NF4) via Unsloth |
| LoRA Rank / Alpha | 16 / 32 |
| Optimizer | AdamW 8-bit |
| Epochs | 3 |
| Precision | FP16 |
| Batch Size | 8 |
| Gradient Accumulation | 2 steps |

### Inference Configuration

| Parameter | Value |
|---|---|
| Decoding | Autoregressive |
| Temperature | 0.7 |
| Top-p | 0.9 |
| Repetition Penalty | 1.2 |
| Max Tokens | 90 |

## Dataset

**CNN/DailyMail v3.0.0** (HuggingFace Datasets)

| Split | Samples |
|---|---|
| Training | ~1,000 articles |
| Validation | ~200 articles |

Instruction template embeds explicit length conditioning: *"Summarize the following article in exactly N sentences."*

## How to Run

1. Open the desired notebook in Google Colab with a T4 or A100 GPU runtime.

2. Install dependencies:
   ```bash
   pip install unsloth transformers peft accelerate bitsandbytes datasets evaluate rouge_score bert_score
   ```

3. Run all cells top-to-bottom. The notebooks handle dataset loading from HuggingFace, model setup, training, and evaluation.

## Notebooks

| File | Description |
|---|---|
| `mistral7b_text_summarization_initial.ipynb` | Initial experiment — baseline training and early-epoch evaluation |
| `mistral7b_text_summarization_final.ipynb` | Final experiment — full 3-epoch training with comprehensive evaluation |

## Evaluation Metrics

| Type | Metric | Description |
|---|---|---|
| Lexical | ROUGE-1, ROUGE-2, ROUGE-Lsum | N-gram overlap with reference summaries |
| Semantic | BERTScore (RoBERTa-large) | Contextual embedding similarity |

## Results: Epoch-Wise Behavioral Analysis

### Epoch 1 — Undertrained Model
- High hallucination rate: fabricated entities, prices, off-topic events
- **Good sentence-count adherence** despite poor faithfulness
- Interpretation: the model learns length control as a surface-level pattern early, but relies on pretrained world priors rather than article content

### Epoch 3 — Partially Adapted Model
- Significant hallucination reduction
- Improved article-specific grounding
- Better sentence coherence and factual alignment

## Key Findings

- **Length control vs. faithfulness trade-off**: Length control is a surface behavior learned in epoch 1; factual faithfulness requires deeper adaptation over more epochs.
- **Training duration matters more than dataset size** for hallucination reduction in this setting.
- **ROUGE-BERTScore divergence** serves as a useful diagnostic for hallucination — high BERTScore with low ROUGE can indicate semantically plausible but factually unfaithful text.

## Future Work

- **Larger training set**: Scale from 1K to 10K+ CNN/DailyMail articles to study the interaction between dataset size and hallucination reduction across epochs.
- **Faithfulness-aware training**: Integrate factual consistency losses (e.g., NLI-based or entity-overlap penalties) into the SFT objective to directly optimize for grounding, not just fluency.
- **Domain transfer**: Evaluate the fine-tuned model on legal, medical, and financial documents to assess cross-domain summarization quality without additional task-specific training.

## Reports

| File | Description |
|---|---|
| `text_summarization_report.pdf` | Full methodology, epoch-wise results, and hallucination analysis |
| `text_summarization_report.docx` | Word version of the report |

# Task 4: Roman Urdu Conversational AI

Fine-tuning Llama 3.1-8B, Qwen 2.5-3B, and Mistral 7B for conversational question answering in Roman Urdu — an informally transliterated, low-resource language with no standard orthography.

## Why This Matters

Over **70 million people** communicate in Roman Urdu daily — across Pakistan, the global Pakistani diaspora, and South Asian online communities. Yet no commercial AI chatbot, virtual assistant, or customer service automation product supports this language. Roman Urdu is written informally in Latin script with no standardized spelling, making it invisible to conventional NLP systems built on formal Urdu (Nastaliq script) or English. This work delivers the **first fine-tuned conversational AI for Roman Urdu**, demonstrating that a single afternoon of QLoRA training on free hardware can unlock an entirely unserved market. For telecom providers, e-commerce platforms, and fintech companies operating in Pakistan, this represents immediate customer service automation capability for a user base that has been excluded from the AI revolution.

## Objective

Build a conversational AI chatbot that can understand and respond fluently in Roman Urdu. This is a challenging low-resource NLP task because:
- Roman Urdu has **no standardized script** — spelling varies widely across speakers.
- **Limited pretrained coverage** in existing language models.
- **No existing baselines** for Roman Urdu chatbot evaluation.

## Models

| Model | Parameters | Role |
|---|---|---|
| Meta Llama 3.1-8B Instruct | 8B | Primary model — strong instruction following, multilingual support |
| Qwen 2.5-3B Instruct | 3B | Parameter-efficient alternative |
| Mistral 7B Instruct | 7B | Fast inference, good for edge deployment |

### Training Configuration

| Hyperparameter | Value |
|---|---|
| Fine-Tuning | QLoRA (4-bit NF4) via Unsloth |
| LoRA Rank / Alpha | 16 / 32 |
| Optimizer | AdamW 8-bit |
| LR Schedule | Cosine Annealing |
| Precision | bfloat16 |
| Training Steps | 500 |
| Batch Size | 8 |
| Gradient Accumulation | 2 steps |
| Eval Frequency | Every 50 steps |

## Dataset

**Source**: Redgerd Roman Urdu Alpaca QA Mix (HuggingFace Hub)

| File | Records | Description |
|---|---|---|
| `datasets/Redgerdroman-urdu-alpaca-qa-mix/roman_urdu_alpaca_qa_full.jsonl` | ~10,000+ | Roman Urdu instruction-following QA pairs |
| `datasets/Redgerdroman-urdu-alpaca-qa-mix/combined_roman_urdu_english.jsonl` | ~10,000+ | Combined Roman Urdu + English samples |

Format: `{input, output, language_tag}` — native Roman script, instruction-following style.

## How to Run

1. Open the desired notebook in Google Colab with a T4 or A100 GPU runtime.

2. Install dependencies:
   ```bash
   pip install unsloth transformers peft accelerate bitsandbytes datasets gradio
   ```

3. Upload the dataset files from `datasets/` to Colab or mount from Google Drive.

4. Run all cells top-to-bottom. Each notebook handles model loading, QLoRA setup, training, and inference.

## Notebooks

| File | Model | Author |
|---|---|---|
| `colabs/llama3.1_8b_roman_urdu_rafia_shaikh.ipynb` | Llama 3.1-8B | Rafia Shaikh |
| `colabs/mistral_7b_roman_urdu_sanakhalid.ipynb` | Mistral 7B | Sana Khalid |
| `colabs/qwen2.5_3b_roman_urdu_mfareed.ipynb` | Qwen 2.5-3B | M. Fareed |
| `notebook.ipynb` | General experimentation | — |

## Results

### Technical Metrics

| Metric | Value |
|---|---|
| GPU Memory (Training) | 6–8 GB |
| Memory Reduction vs Full FT | ~74% (QLoRA advantage) |
| Inference Speed | ~50–100 ms/token |
| Training Time | ~2–3 hours per experiment |

### Qualitative Results

- The fine-tuned Llama 3.1-8B generates **fluent, contextually appropriate Roman Urdu** responses.
- Conversational tone matches the training data's informal style.
- Model handles code-switching (Roman Urdu / English mix) naturally.

### Deployment

- Model weights hosted on **HuggingFace Hub**.
- Live **Gradio demo** deployed as an interactive chatbot interface.
- API-accessible inference endpoint available.

## Key Findings

- QLoRA makes SLM fine-tuning for low-resource languages feasible on free-tier Colab (6–8 GB GPU).
- 500 training steps are sufficient for basic conversational ability, though more data and steps would improve factual accuracy.
- The lack of standardized evaluation benchmarks for Roman Urdu remains a challenge — future work should include quantitative metrics (BLEU/ROUGE) with native speaker references.

## Future Work

- **Quantitative evaluation**: Establish BLEU, ROUGE, and human evaluation benchmarks with native Roman Urdu speakers to move beyond qualitative assessment and produce reproducible, comparable metrics.
- **Larger and cleaner dataset**: Expand from ~10K to 50K+ instruction-following samples with native speaker quality review, covering a broader range of conversational topics, formal requests, and domain-specific queries.
- **Orthographic normalization**: Develop a preprocessing module that maps common spelling variations (e.g., "kaise" / "kaisay" / "kese") to canonical forms, improving both training data quality and inference consistency.

## Report

| File | Description |
|---|---|
| `roman_urdu_language_models_report.pdf` | Full methodology, training curves, qualitative examples, and deployment details |

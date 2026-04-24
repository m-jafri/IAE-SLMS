# Task 1: Multilingual Sentiment & Language Classification

Fine-tuning Gemma-3 (270M) and Qwen-2.5 (0.5B) for multilingual sentiment classification and joint language identification across English, Arabic, Urdu, and Roman Urdu.

## Why This Matters

Multilingual sentiment analysis is foundational to customer intelligence, brand monitoring, and market research across global markets. English-centric solutions leave hundreds of millions of Arabic, Urdu, and Roman Urdu speakers underserved. This work demonstrates that a model with just **270 million parameters** — small enough to run on a smartphone — can classify sentiment across four languages simultaneously, enabling real-time customer feedback analysis for organizations operating in South Asian and Middle Eastern markets at near-zero inference cost. The structured JSON output approach further establishes a production-reliable pattern for deploying generative classifiers in enterprise pipelines where parsing consistency is critical.

## Objective

Build small, efficient classifiers that can:
1. **Classify sentiment** (positive / negative / neutral) across four languages.
2. **Jointly identify language and sentiment** in a single forward pass using structured JSON output.

## Models

| Model | Parameters | Task | Output Format |
|---|---|---|---|
| Gemma-3 270M | 270M | Sentiment classification | `{"sentiment": "positive\|negative\|neutral"}` |
| Qwen-2.5 0.5B Instruct | 500M | Joint language + sentiment | `{"language": "en\|ar\|ur\|roman_ur", "sentiment": "..."}` |

### Training Configuration

| Hyperparameter | Value |
|---|---|
| Fine-Tuning | LoRA via Unsloth |
| Quantization | 4-bit NF4 |
| LoRA Rank / Alpha | 16 / 32 |
| Optimizer | AdamW 8-bit |
| LR Schedule | Cosine Annealing |
| Epochs | 2 |
| Batch Size | 8 |
| Precision | bfloat16 |

## Dataset

**File**: `datasets/multilingual_sentiment.csv` (13.2 MB, ~120,000 samples)

| Language | Samples | Script |
|---|---|---|
| English (en) | 30,000 | Latin |
| Arabic (ar) | 30,000 | Arabic |
| Urdu (ur) | 30,000 | Nastaliq / Arabic |
| Roman Urdu (roman_ur) | 30,000 | Latin (informal transliteration) |

Schema: `text, label, lang` — balanced across three sentiment classes per language.

## How to Run

1. Open the desired notebook in Google Colab with a T4 or A100 GPU runtime.

2. Install dependencies:
   ```bash
   pip install unsloth transformers peft accelerate bitsandbytes datasets
   ```

3. Upload `datasets/multilingual_sentiment.csv` to Colab or mount it from Google Drive.

4. Run all cells top-to-bottom.

## Notebooks

| File | Description |
|---|---|
| `colabs/gemma3_sentiment_finetuning.ipynb` | Gemma-3 270M fine-tuning for three-class sentiment classification |
| `colabs/qwen2.5_sentiment_finetuning.ipynb` | Qwen-2.5 0.5B fine-tuning for joint language ID + sentiment classification |

## Results

### Gemma-3 270M — Sentiment Classification

- **Overall accuracy**: 72.4% (90-sample three-class evaluation)
- Strong performance on English and Arabic
- Urdu and Roman Urdu are harder due to script overlap and limited model capacity at 270M parameters

### Qwen-2.5 0.5B — Joint Language + Sentiment

- **JSON validity rate**: 68–99% depending on language
- Successfully performs both language identification and sentiment classification in a single pass
- **Main confound**: Urdu vs. Roman Urdu confusion due to linguistic similarity despite different scripts

## Key Findings

- Structured JSON output serves as a reliability mechanism — validity rate is a proxy for instruction-following quality.
- PEFT enables successful convergence within 2 epochs on free-tier Colab hardware.
- Urdu/Roman Urdu confusion is the dominant error mode, driven by linguistic similarity rather than model failure.

## Future Work

- **Language expansion**: Extend to Hindi, Bengali, Turkish, and Bahasa to cover 2B+ speakers across South Asia, the Middle East, and Southeast Asia.
- **Aspect-based sentiment**: Move beyond document-level sentiment to fine-grained aspect-level classification (e.g., "The camera is great but battery life is poor").
- **Urdu/Roman Urdu disambiguation**: Develop a dedicated script-detection module or contrastive training objective to resolve the dominant Urdu ↔ Roman Urdu confusion error mode.

## Report

| File | Description |
|---|---|
| `multilingual_sentiment_report.pdf` | Full methodology, per-class metrics, confusion matrices, and analysis |

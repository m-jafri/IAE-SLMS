# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IAE-SLMS is a research repository containing five studies on parameter-efficient fine-tuning of small language models (270M–8B params) using LoRA/QLoRA. All experiments run on free-tier Google Colab (T4/A100). The codebase is primarily Jupyter notebooks (Python) with two Node.js scripts for presentation generation.

## Commands

### Python (experiments)
```bash
pip install -r requirements.txt
```
Notebooks are designed for Google Colab, not local execution. Open `.ipynb` files in Colab, select T4/A100 runtime, and run top-to-bottom. Each notebook is self-contained with its own `!pip install` cells.

### Node.js (presentation generation)
```bash
npm install
npm run generate          # runs generate_slm_deck.js → small_language_models.pptx
npm run generate:alt      # runs generate_slm_pptx.js (alternate theme)
```

There are no test suites or linters configured.

## Architecture

### Research Tasks (5 independent studies)

Each task is a self-contained directory with notebooks, datasets, and a PDF report:

| Dir | Task | Base Models |
|---|---|---|
| `multilingual_sentiment/` | Multilingual sentiment classification (120K samples, 4 languages) | Gemma-3 270M, Qwen-2.5 0.5B |
| `chain_of_thought/` | Chain-of-thought reasoning induction | Llama 3.2 |
| `text_summarization/` | Length-controlled summarization (CNN/DailyMail) | Mistral 7B Instruct v0.2 |
| `roman_urdu/` | Roman Urdu conversational AI | Llama 3.1-8B, Qwen 2.5-3B, Mistral 7B |
| `rag/` | Retrieval-augmented generation pipeline | SLM + vector store |

### Shared Training Config

All tasks use: QLoRA/LoRA fine-tuning, 4-bit NF4 quantization, AdamW 8-bit optimizer, cosine annealing LR scheduler, LoRA rank 16 / alpha 32, LR 1e-5, batch size 8, gradient accumulation 2. Fine-tuning is done via Unsloth.

### Presentation Generators

Two Node.js scripts (`generate_slm_deck.js`, `generate_slm_pptx.js`) use `pptxgenjs` to programmatically build PowerPoint decks summarizing the research. They differ only in visual theme (cyan vs coral accent).

### Datasets

Stored within task directories:
- `multilingual_sentiment/datasets/multilingual_sentiment.csv` — 120K multilingual sentiment samples
- `roman_urdu/datasets/` — Roman Urdu Alpaca QA mix (JSONL)
- Other tasks load datasets from HuggingFace within notebooks

## Conventions

- Notebooks named `{model}_{task}_{author}.ipynb` when multiple contributors work on same task
- Multi-contributor tasks use `colabs/` subdirectories
- Reports named `{task_name}_report.pdf` in task root
- Datasets stored in `datasets/` subdirectories (lowercase)
- Datasets under 50MB committed directly; larger ones hosted externally with download links
- Clear notebook outputs before committing unless outputs are essential for review
- Pin library versions in notebook `!pip install` cells
- PR process: squash-merge after approval; test notebooks in clean Colab session before submitting

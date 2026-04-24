# Contributing to IAE-SLMS

Thank you for your interest in contributing to the IAE Small Language Models research project. This document outlines the guidelines for contributing notebooks, datasets, reports, and code.

## How to Contribute

1. **Fork** the repository and create a feature branch from `main`.
2. Make your changes following the guidelines below.
3. Test all notebooks top-to-bottom in a clean Colab environment before submitting.
4. Open a **Pull Request** with a clear description of what you changed and why.

## Notebook Guidelines

- Each task lives in its own directory (e.g., `chain_of_thought/`, `rag/`).
- Place notebooks inside a `colabs/` subdirectory when multiple contributors work on the same task.
- Name notebooks descriptively: `{model}_{task}_{author}.ipynb` (e.g., `mistral_7b_roman_urdu_sanakhalid.ipynb`).
- Every notebook must be **self-contained** — a reader should be able to run it top-to-bottom on Google Colab (free-tier T4 or A100) without external setup.
- Include a markdown cell at the top with: task description, model used, dataset reference, and expected runtime.
- Clear all cell outputs before committing to keep file sizes manageable, unless the outputs are essential for review (e.g., training curves, evaluation tables).
- Pin library versions in `!pip install` cells to ensure reproducibility (e.g., `transformers==4.41.0`).

## Dataset Guidelines

- Store datasets in a `datasets/` subdirectory within the relevant task folder.
- For files **under 50 MB**, commit them directly to the repository.
- For files **over 50 MB**, host them externally (HuggingFace Datasets, Google Drive) and add a download link in the task README.
- Always document the dataset schema, source, size, and any preprocessing steps in the task README.
- Never commit datasets containing personally identifiable information (PII).

## Report Format

- Each task should have a PDF report named `{task_name}_report.pdf`.
- Reports should cover: motivation, methodology, training configuration, results (tables and figures), analysis, and references.
- Place reports in the root of the task directory alongside the notebooks.

## Pull Request Process

1. Ensure your branch is up to date with `main`.
2. Verify all notebooks execute without errors in a clean Colab session.
3. Update the task README if you added or changed notebooks, datasets, or results.
4. Fill in the PR template:
   - **What** — brief summary of the change.
   - **Why** — motivation or issue being addressed.
   - **How to test** — steps to verify your changes (e.g., "Run notebook X on Colab T4").
5. Request a review from at least one team member.
6. Squash-merge after approval to keep the commit history clean.

## Code Style

- **Python notebooks**: follow PEP 8 where practical; use descriptive variable names.
- **JavaScript** (`generate_slm_deck.js`): use `"use strict"`, `const`/`let`, and consistent formatting.
- Keep dependencies minimal — only add packages that are actively used.

## Questions?

Open a GitHub issue or reach out to the team leads.

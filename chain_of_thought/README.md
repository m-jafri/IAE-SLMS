# Task 2: Chain-of-Thought Reasoning with Llama 3.2

Fine-tuning Llama 3.2 to produce explicit chain-of-thought (CoT) reasoning traces, investigating whether step-by-step reasoning can be **learned** (not just prompted) in small language models.

## Why This Matters

Explainability is becoming a regulatory requirement. The EU AI Act, FDA guidelines for clinical decision support, and financial auditing standards increasingly demand that AI systems show their reasoning — not just their conclusions. Today, step-by-step reasoning is primarily associated with frontier models (100B+ parameters), making it inaccessible for on-premise and edge deployment. This work provides empirical evidence that chain-of-thought reasoning can be **taught** to small models through supervised fine-tuning, opening the door to auditable, explainable AI on devices as small as a laptop or embedded system — without dependence on cloud APIs or frontier-scale compute.

## Objective

Large language models exhibit emergent CoT reasoning when prompted with "think step by step." This task explores whether supervised fine-tuning on reasoning traces can **induce** the same behavior in smaller models — making reasoning a trained capability rather than an emergent property.

## Model

| Property | Value |
|---|---|
| Base Model | Meta Llama 3.2 |
| Fine-Tuning | QLoRA (4-bit NF4) via Unsloth |
| LoRA Rank / Alpha | 16 / 32 |
| Optimizer | AdamW 8-bit |
| LR Schedule | Cosine Annealing |
| Precision | bfloat16 |

## Dataset

Training samples follow the structured format:

```json
{
  "question": "What is 15% of 80?",
  "chain_of_thought_steps": [
    "Convert 15% to a decimal: 0.15",
    "Multiply 0.15 by 80",
    "0.15 × 80 = 12"
  ],
  "final_answer": "12"
}
```

Each sample contains a question, explicit intermediate reasoning steps, and the final answer.

## How to Run

1. Open the notebook in Google Colab with a T4 or A100 GPU runtime.

2. Install dependencies (the notebook handles this, or manually):
   ```bash
   pip install unsloth transformers peft accelerate bitsandbytes datasets
   ```

3. Run all cells top-to-bottom. The notebook handles:
   - Loading and quantizing the base model
   - Applying LoRA adapters
   - Training on CoT traces
   - Generating and evaluating reasoning outputs

## Notebook

| File | Description |
|---|---|
| `llama3.2_chain_of_thought_finetuning.ipynb` | Full pipeline: data prep, QLoRA fine-tuning, inference, and qualitative evaluation |

## Results

- The fine-tuned model generates multi-step reasoning chains before producing a final answer.
- **Successes**: Coherent step-by-step traces on arithmetic and simple logical reasoning tasks.
- **Failure modes**: Short-circuiting (jumping directly to the answer), hallucinated intermediate steps, and breakdown on multi-hop reasoning.
- **Key finding**: CoT can be induced via supervised fine-tuning in small models, but reliability depends heavily on training data quality and diversity.

## Future Work

- **Formal CoT benchmarks**: Evaluate on GSM8K, ARC, and StrategyQA to produce quantitative accuracy metrics comparable to published reasoning baselines.
- **Process supervision**: Implement step-level reward models that verify each intermediate reasoning step, not just the final answer — improving reliability on multi-hop problems.
- **Reasoning distillation**: Distill CoT traces from larger models (70B+) into sub-3B student models to study the minimum scale at which reliable reasoning can be sustained.

## Report

Refer to `paper_outline.md` (Section V) in the repository root for the full methodology and analysis.

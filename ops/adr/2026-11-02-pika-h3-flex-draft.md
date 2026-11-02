# Pika H3 Flex guide draft

- Date: 2026-11-02
- Status: Draft

## Context

Pika released Pika H3 Flex on 2026-10-29: two LoRA adapters (FL2VA and Ref2VA) for MiniMax H3. Besides step distillation from 50 to 6 steps, Pika applied SFT and reward learning (ReFL and DPO), so the output differs from MiniMax H3 itself, not only in speed. ComfyUI needs a different sampling setup (6 steps, `lcm`, `ManualSigmas`, LoRA strength 1.0).

## Decision

Add a Japanese `basic-workflows/pika-h3-flex` article as its own page rather than a section of `minimax-h3`.

The page follows the same structure as `minimax-h3` and repeats the full setup, including model downloads, so it can be read on its own. The LoRA download is shown separately from the base model files.

Use the same text encoder as `minimax-h3` (`qwen3vl_32b_minimax_h3_int8_convrot`), not the `nvfp4_awq` file used by the Comfy templates.

Place `Pika H3 Flex` in the Japanese navigation as a child of `MiniMax H3` under Video Workflows.

Add English and Simplified Chinese localizations only after the owner's request.

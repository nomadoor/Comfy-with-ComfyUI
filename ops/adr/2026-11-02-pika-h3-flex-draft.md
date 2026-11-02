# Pika H3 Flex guide

- Date: 2026-11-02
- Status: Accepted

## Context

Pika released Pika H3 Flex on 2026-10-29: two LoRA adapters (FL2VA and Ref2VA) for MiniMax H3. Besides step distillation from 50 to 6 steps, Pika applied SFT on its own dataset and reward learning (ReFL and DPO), so the output differs from MiniMax H3 itself, not only in speed. ComfyUI needs a different sampling setup (6 steps, `lcm`, `ManualSigmas`, LoRA strength 1.0).

## Decision

Add a `basic-workflows/pika-h3-flex` article as its own page rather than a section of `minimax-h3`.

The page follows the structure of `minimax-h3` and repeats the full setup, including model downloads, so it can be run on its own. The LoRA download is shown separately from the base model files. Prompt writing and node explanations are not repeated; the page links to `minimax-h3` for them.

Use the `qwen3vl_32b_minimax_h3_nvfp4_awq` text encoder, as the Comfy templates do, instead of the `int8_convrot` file used by `minimax-h3`.

Place `Pika H3 Flex` in the navigation as a child of `MiniMax H3` under Video Workflows.

English and Simplified Chinese pages were added at the owner's request on 2026-11-03, together with their nav entries.

At the owner's request, the home page's featured video models list Pika H3 Flex next to MiniMax H3.

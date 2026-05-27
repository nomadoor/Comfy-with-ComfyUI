# ADR: Add ComfyUI Manager Page

- Date: 2026-05-26
- Status: Accepted

## Context

ComfyUI Manager is currently mentioned from setup and custom node pages, but it is not only a custom node installer.
It also relates to command line arguments such as `--enable-manager` and, depending on the UI mode, update-related operations.

## Decision

Add a dedicated `begin-with/comfyui-manager` page under:

`はじめてのComfyUI` -> `カスタマイズ` -> after `コマンドライン引数`

The page should explain ComfyUI Manager as a management tool before readers move on to updates, model placement, and custom nodes.

## Consequences

- The JA/EN/ZH navigation gains `ComfyUI Manager` after the command line arguments page.
- `カスタムノード` can link to this page instead of explaining Manager installation inline.

---
layout: page.njk
lang: ja
section: notes
slug: sd15-sdxl-asset-compatibility
navId: sd15-sdxl-asset-compatibility
title: "Stable Diffusion 1.5 の LoRA / ControlNet は SDXL で使えない？"
created: 2025-12-13
updated: 2026-03-02
tags: ["concept", "sd15", "sdxl"]
summary: "モデルごとの互換性と、SD1.5用アセットをSDXLで使えない理由"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Stable Diffusion 1.5 の LoRA / ControlNet は SDXL で使えない？

結論から言えば、**使えません**。  
これは SD1.5 と SDXL に限らず、**モデルごとの互換性はほぼない**と考えていいです。

例えるならコンセントのようなものです。  
- SD1.5 は日本のコンセント（Aタイプ）
- SDXL はアメリカのコンセント（Bタイプ）

その国の家電(LoRA / ControlNet)は、その国でしか使えません。
機能は似ていても、接続部分の形状が違うので物理的に装着できないのです。

---

## なぜ互換性がないのか

技術的な理由をざっくりまとめると次のとおりです。

- **前提としているモデルが違う**  
  - SD1.5 と SDXL では、UNet の構造・チャネル数・latent 解像度などが異なるため、
    「どの層にどんな差分を足すか」という LoRA / ControlNet の前提が一致しません。

- **テキストエンコーダも違う**  
  - SD1.5 は CLIP、SDXL は別構成のテキストエンコーダを使っており、
    「この単語をこう動かす」という学習結果も、そのまま別モデルには通用しません。


アダプタはそのモデル専用という認識で問題ありません。

- SD1.5 用 LoRA / ControlNet → **SD1.5 系モデル専用**
- SDXL 用 LoRA / ControlNet → **SDXL 系モデル専用**
- Flux 用 LoRA / ControlNet → **Flux 系モデル専用**

---

## 実際にエラーが出るのか？

![](https://gyazo.com/3d13852e4d5921d17dd6e6c1835bfafa){gyazo=image}

SD1.5 の ControlNet ワークフローに SDXL 用の ControlNet モデルを繋いでみると、上記のようなエラーが表示されます：

```
y is None, did you try using a controlnet for SDXL on SD1?
```

このように、システム側でも互換性がないことを検出し、エラーを返します。
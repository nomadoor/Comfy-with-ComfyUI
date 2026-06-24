---
layout: page.njk
lang: ja
section: basic-workflows
slug: krea-2
navId: krea-2
title: "Krea 2"
created: 2026-06-24
updated: 2026-06-24
summary: "Krea 2 Turboでの画像生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/6ce8c9a2f7042a08efbbcdefc8ab6673.png"
tags: []
---

## Krea 2とは？

[Krea 2 Open-Source](https://www.krea.ai/krea-2-open-source) は、Krea による open weight の画像生成モデルです。

Krea が以前作っていた [FLUX.1 Krea](https://www.krea.ai/blog/flux-krea-open-source-release) もそうでしたが、アーキテクチャとして特別な部分は無いものの、データセットを丁寧に作り、AIらしさが出ない美しい画像を生成できるよう、こだわりを持って作成されています。

2 種類のモデルが公開されていますが、通常の画像生成では Turbo を使用します。

- **Krea 2 Raw**
  - 蒸留されていないベースモデルです。主に LoRA 学習やファインチューニング向けです。
- **Krea 2 Turbo**  
  - 8 steps で生成できる蒸留モデル。

> Krea の Web / API 版には **Krea 2 Medium** や **Krea 2 Large** もありますが、open weight として公開されているのは **Raw** と **Turbo** のみです。

---

## モデルのダウンロード

- diffusion_models
  - [krea2_turbo_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Krea-2/blob/main/diffusion_models/krea2_turbo_fp8_scaled.safetensors) (13.1 GB)
- text_encoders
  - [qwen3vl_4b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Krea-2/blob/main/text_encoders/qwen3vl_4b_fp8_scaled.safetensors) (5.24 GB)
- vae
  - [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Krea-2/blob/main/vae/qwen_image_vae.safetensors) (254 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── krea2_turbo_fp8_scaled.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_4b_fp8_scaled.safetensors
    └── 📂vae/
        └── qwen_image_vae.safetensors
```

---

## text2image

![](https://gyazo.com/31bce8c4982ff74992c599268d13374d){gyazo=image}

[](/workflows/basic-workflows/krea-2/Krea_2_turbo_text2image.json)

Krea 2 Turbo は 8 steps 生成用のモデルです。

- `steps` : 8
- `cfg` : 1.0
- 推奨解像度 : 1K 〜 2K

---

## 公式スタイル LoRA

Krea 2 の大きな売りのひとつに、Style references や Moodboards といったスタイル制御がありますが、現時点では OSS として公開されていません。

代わりに公式からいくつかスタイル LoRA が公開されているので、試してみましょう。

- [Krea 2 LoRAs](https://huggingface.co/collections/krea/krea-2-loras)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── *.safetensors
```

LoRA ごとに推奨 trigger word と強度があるので、各モデルカードを確認してください。

### text2image (with LoRA)

![](https://gyazo.com/7a2ec126a289cfa04dd8cb609b6d04e3){gyazo=image}

[](/workflows/basic-workflows/krea-2/Krea_2_turbo_text2image_darkbrush.json)

- ここでは、[Krea-2-LoRA-darkbrush](https://huggingface.co/krea/Krea-2-LoRA-darkbrush) を使用しています。
- トリガーワードは `monochrome ink wash style` 。

コミュニティから多くの LoRA が出るのが楽しみですね。

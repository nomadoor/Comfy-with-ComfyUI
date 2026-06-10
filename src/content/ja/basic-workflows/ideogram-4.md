---
layout: page.njk
lang: ja
section: basic-workflows
slug: ideogram-4
navId: ideogram-4
title: "Ideogram 4.0"
created: 2026-06-10
updated: 2026-06-10
summary: "Ideogram 4.0での画像生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/cb9116562b7693e120aa63eafef11769.png"
tags: []
---

## Ideogram 4.0とは？

[Ideogram 4.0](https://ideogram.ai/models/4.0/) は、9.3B の DiT 系モデルです。

最大の特徴は、JSON 形式のキャプションを使うことで、画像内の要素をかなり細かく指定できる点です。

似たようなアプローチで [FIBO](https://github.com/Bria-AI/FIBO) というモデルがありましたが、Ideogram 4.0 は BBOX による座標指定や色指定に強く、ポスター、ロゴ、UI、パッケージのような、DTP 寄りのデザインタスクに向いています。

コントロール性能と引き換えに、既定の形式でプロンプトを書かなければ本来の性能が出ないので、手軽なモデルではないかもしれませんね。

---

## モデルのダウンロード

- diffusion_models
  - [ideogram4_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_fp8_scaled.safetensors) (9.28 GB)
  - [ideogram4_nvfp4_mixed.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_nvfp4_mixed.safetensors) (5.49 GB)
  - [ideogram4_unconditional_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_unconditional_fp8_scaled.safetensors) (9.28 GB)
  - [ideogram4_unconditional_nvfp4_mixed.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/diffusion_models/ideogram4_unconditional_nvfp4_mixed.safetensors) (5.49 GB)
- text_encoders
  - [qwen3vl_8b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/text_encoders/qwen3vl_8b_fp8_scaled.safetensors) (10.6 GB)
- vae
  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/Ideogram-4/blob/main/vae/flux2-vae.safetensors) (336 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── ideogram4_fp8_scaled.safetensors
    │   ├── ideogram4_nvfp4_mixed.safetensors
    │   ├── ideogram4_unconditional_fp8_scaled.safetensors
    │   └── ideogram4_unconditional_nvfp4_mixed.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_8b_fp8_scaled.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

詳細はあとで説明しますが、2 つの Diffusion model を読み込む仕組みのため、かなり重いです。

ComfyUI は内部でやりくりしてくれるので、VRAM が足りなくても、まったく生成できないわけではありませんが、非常に時間がかかります。

軽くするために `nvfp4` を使う選択肢もありますが、品質は落ちます。

`unconditional` 側は品質への影響が少ないので、通常側は `fp8`、`unconditional` 側は `nvfp4` を使うのが良いかもしれません。

---

## プロンプト

単なる自然文でも生成はできますが、既定の JSON schema に従わないと、まともにクオリティが出ません。

基本形はこのようになっています。

```json
{
  "high_level_description": "画像全体の1〜2文の説明。",
  "style_description": {
    "aesthetics": "雰囲気、審美性。",
    "lighting": "ライティング。",
    "medium": "illustration / photograph / graphic_design など。",
    "art_style": "非写真の場合の画風。",
    "color_palette": ["#FFFFFF", "#000000"]
  },
  "compositional_deconstruction": {
    "background": "背景・環境の説明。",
    "elements": [
      {
        "type": "obj",
        "bbox": [100, 200, 800, 700],
        "desc": "物体・人物・要素の説明。",
        "color_palette": ["#FFFFFF", "#000000"]
      },
      {
        "type": "text",
        "bbox": [820, 200, 920, 800],
        "text": "HELLO",
        "desc": "文字の見た目の説明。",
        "color_palette": ["#000000"]
      }
    ]
  }
}
```

全体の説明、スタイル、背景、各要素の説明、と構成自体はシンプルですが、こんなものを毎回手で書いてはいられません。

特に座標指定は面倒です。画像のどのあたりに、どの要素を置くのかを BBOX で指定する必要があるため、それを頭で想像するのはほぼ無理です。

そこで、いくつかプロンプトを作成するための方法を紹介します。

### LLM に任せる

一番楽なのは、公式の[プロンプトガイド](https://github.com/ideogram-oss/ideogram4/blob/main/docs/prompting.md) と、作りたい画像の説明を LLM に渡して、JSON キャプションに変換してもらう方法です。

参考画像だったり、自分が書いたラフを渡して作ってもらってもいいですね。

ComfyUI 上で動かせるレベルのローカルモデルでは性能が足りないので、大人しく ChatGPT や Gemini などに頼った方が良いでしょう。

![](https://gyazo.com/b314abc36bec096b81fb3231a2687064){gyazo=image}

- [サンプルチャット with ChatGPT](https://chatgpt.com/share/6a28f7cc-e934-8320-86d6-f790a5274389)

### 専用プロンプトビルダーを使う

専用のプロンプトビルダーを使って、視覚的にプロンプトを作る手もあります。

例えば [ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes) の `Ideogram 4 Prompt Builder KJ` ノードはよく使われているものの一つです。

![](https://gyazo.com/a1c3a269983b478c1f605e2f0a5c6e4f){gyazo=image}

- 生成する画像のサイズを設定し、背景やスタイルといったものを入力していきます。
- region 欄でドラッグすると、BBOX を作ることができ、そこに描かせたいもののプロンプト、及びカラーコードを設定します。

---

## text2image

![](https://gyazo.com/c9a2cf1717e87cd1ba28c5d236a02b4d){gyazo=image}

[](/workflows/basic-workflows/ideogram-4/Ideogram_4.0_text2image.json)

{% mediaRow img="https://gyazo.com/c0d5e9131313e7c3c5255b4f54d55dbb {gyazo=image}", width=33, align="left" %}
**Load Diffusion Model**

Ideogram 4.0 では、少し特殊な CFG のために diffusion model を 2 つ読み込みます。

- 通常の [CFG](/ja/ai-capabilities/cfg/) では、プロンプトありの結果と、プロンプトなしの結果を比べることで、プロンプト方向へ生成を寄せます。
- 一方で Ideogram 4.0 では、unconditional 側に単なる空プロンプトを使うのではなく、テキスト条件を持たない側のモデルを使います。
- なにが違うんだという感じもしますが、より positive prompt を繊細に扱うための工夫といった感じでしょうか。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/26ef78ed5bf868ab5ca9a62b643640ff {gyazo=image}", width=33, align="left" %}
**CFG**

昔からある細かいテクニックですが、サンプリングの前半と後半で CFG の値を変えます。

- この workflow では、前半が CFG 7、後半は CFG 3
- 高い CFG を最初から最後までかけ続けるより、途中で弱めたほうが安定するんですね。
- そのために使用するのが `CFG Override` ノードです。
- 指定したステップ範囲だけ CFG の値を上書きします。
- この workflow では、全体の 70% 以降は cfg が 3 になります。

{% endmediaRow %}

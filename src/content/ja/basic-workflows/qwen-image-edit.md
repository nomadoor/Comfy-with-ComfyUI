---

layout: page.njk
lang: ja
section: basic-workflows
slug: qwen-image-edit
navId: qwen-image-edit
title: "Qwen-Image-Edit"
created: 2025-12-11
updated: 2026-03-02
summary: "Qwen-Image-Editで指示ベース画像編集を行う"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/14e608fdb6033e436570157da4645e34.png"
tags: ["instruction-based-image-editing","collage-refine"]
---

## Qwen-Image-Editとは？

[Qwen-Image-Edit](https://github.com/QwenLM/Qwen-Image) は、[Qwen-Image](/ja/basic-workflows/qwen-image/) をベースにした [指示ベース画像編集モデル](/ja/ai-capabilities/instruction-based-image-editing/) です。

ざっくりいうと、**Flux.1 Kontext の Qwen-Image 版** という認識でよいと思います。

Flux.1 Kontext は VAE ベースの編集のみでしたが、Qwen-Image-Edit は MLLM を使って実際に参照画像を「見る」ことができるため、そのぶん柔軟な編集ができます。

その後しばらくして、マルチリファレンスに対応した **Qwen-Image-Edit-2509** というモデルが発表されました。

これまでは「1枚の画像を編集する」だけでしたが、Qwen-Image-Edit-2509 では

* 「画像1 の人物の服装を、画像2 のものに変更して」
* 「画像1 と 画像2 が同じステージに立っている画像を生成して」

といったことができるようになります。

> 学習方法が異なるため、必ずしも 2509 が無印版の上位互換というわけではありませんが、迷ったときは 2509 を使っておけばよいでしょう。

---

## Qwen-Image-Edit（無印）

何ができるかについては [公式 GitHub](https://github.com/QwenLM/Qwen-Image#showcase-of-qwen-image-edit-2509)、または [Flux.1 Kontext / できること](/ja/basic-workflows/flux-1-kontext/#できること) も参考になると思います。


### モデルのダウンロード

* diffusion_models

  * [qwen_image_edit_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_fp8_e4m3fn.safetensors)
* text_encoders

  * [qwen_2.5_vl_7b_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/text_encoders/qwen_2.5_vl_7b_fp8_scaled.safetensors)
* vae

  * [qwen_image_vae.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/blob/main/split_files/vae/qwen_image_vae.safetensors)
* gguf（任意）

  * [QuantStack/Qwen-Image-Edit-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/tree/main)

    * Q4_K_M 以上のモデルを選んでください。これ未満だと一気に性能が落ちます。
    * cf. [Qwen-Image-Edit GGUFモデル比較](https://scrapbox.io/work4ai/Qwen-Image-Edit_GGUF%E3%83%A2%E3%83%87%E3%83%AB%E6%AF%94%E8%BC%83)
  * [unsloth/Qwen2.5-VL-7B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen2.5-VL-7B-Instruct-GGUF/tree/main)
  * [Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf](https://huggingface.co/QuantStack/Qwen-Image-Edit-GGUF/blob/main/mmproj/Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf)

    * gguf を使う場合は、この mmproj ファイルが必須です。

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_fp8_e4m3fn.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_2.5_vl_7b_fp8_scaled.safetensors
    │   ├── Qwen2.5-VL-7B-Instruct.gguf                ← gguf を使う場合のみ
    │   └── Qwen2.5-VL-7B-Instruct-mmproj-BF16.gguf    ← gguf を使う場合のみ
    ├── 📂vae/
    │   └── qwen_image_vae.safetensors
    └── 📂unet/
        └── qwen-image-edit.gguf                       ← gguf を使う場合のみ
```

### workflow

![](https://gyazo.com/79b84b74171ddd5c9cfdb57bccc69f13){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit.json)


🟩 `TextEncodeQwenImageEdit` ノードの挙動について、少しだけ補足しておきます。

内部では、ざっくり次のような処理をしています。

* 1. 入力画像を 1M ピクセル程度になるようにリサイズ
* 2. その画像から latent を生成
* 3. テキスト＋画像をまとめて Qwen2.5-VL に渡す

画像のリサイズ処理が自動で入るため、**生成する画像サイズ を 1M ピクセルから大きく外すと、意図しない結果になる可能性があります。**

そのため、この workflow ではあらかじめ画像サイズの下処理をしています。

* `ImageScaleToTotalPixels` ノードで 1M ピクセルにリサイズ
* `Resize Image v2` ノードで、解像度が 8 の倍数になるようにクロップ

> Qwen-Image-Edit は、どう工夫しても「入力画像と編集後画像をピクセルパーフェクトに一致させる」ことはできません。  
> いくつか回避策は提案されていますが、そもそもモデルの設計がそういう用途向きではない、という前提は押さえておいたほうがよいです。

---

## Qwen-Image-Edit-2509

Qwen-Image-Edit-2509 は、無印版を拡張したバージョンです。
最大の違いは、**参照画像を複数枚入力できる** ことです。

### モデルのダウンロード

* diffusion_models

  * [qwen_image_edit_2509_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_2509_fp8_e4m3fn.safetensors)
* gguf（任意）

  * [QuantStack/Qwen-Image-Edit-2509-GGUF](https://huggingface.co/QuantStack/Qwen-Image-Edit-2509-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_2509_fp8_e4m3fn.safetensors
    └── 📂unet/
        └── qwen-image-edit-2509.gguf      ← gguf を使う場合のみ
```

### workflow（1枚）

![](https://gyazo.com/456e6aec210ae38313aa25f83ce236df){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2509.json)

- 基本的な流れは無印版と同じですが、`TextEncodeQwenImageEdit`ノード を `TextEncodeQwenImageEditPlus` ノードに置き換えます。

### workflow（複数枚）

![](https://gyazo.com/e33abcb42d03c53f3171a8fb12d7eca0){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2509_multi-ref.json)

- 🟩 画像をきちんと見ているので、ある程度アバウトな指示でも動きますが、「image1 の〇〇」「image2 の〇〇」のように、どの画像かを明示的に指定することもできます。

これまでは、入力画像と編集後画像をなるべく同じサイズに仕上げたかったため、先にリサイズ処理を行い、それを latent_image に入力していました。

一方で「参照画像をヒントに新しい画像を生成したいだけ」のケースでは、text2image のように EmptySD3LatentImage ノードを使っても問題ありません。

---

## Qwen-Image-Edit-2511

Qwen-Image-Edit-2511 は、2509を改良した新モデルです。

無印から2509のときほど大幅な変化はないですが、キャラクターの一貫性が向上したり、Relighting LoRAなど人気のあるLoRAモデルが統合されたりと着実な改良がされています。

### モデルのダウンロード

* diffusion_models

  * [qwen_image_edit_2511_fp8mixed.safetensors](https://huggingface.co/Comfy-Org/Qwen-Image-Edit_ComfyUI/blob/main/split_files/diffusion_models/qwen_image_edit_2511_fp8mixed.safetensors)

* gguf（任意）

  * [unsloth/Qwen-Image-Edit-2511-GGUF](https://huggingface.co/unsloth/Qwen-Image-Edit-2511-GGUF/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── qwen_image_edit_2511_fp8mixed.safetensors
    └── 📂unet/
        └── qwen-image-edit-2511-XXXX.gguf      ← gguf を使う場合のみ
```

### workflow

![](https://gyazo.com/6d45ea40c1194384fb75c383c43a116b){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2511.json)

2509とまったく同じworkflowで動きます。

---


## Lightning

**Qwen-Image-Edit-Lightning** は、Qwen-Image-Edit を 4 / 8 steps で回せるように蒸留した LoRA セットです。

ほとんど劣化なしでステップ数を大幅に減らせるため、多くの workflow で採用されています。

### モデルのダウンロード

* loras

  * [Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Edit-2509/Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors)
  * [Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Lightning/blob/main/Qwen-Image-Edit-2509/Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors)
  - [Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors](https://huggingface.co/lightx2v/Qwen-Image-Edit-2511-Lightning/blob/main/Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── Qwen-Image-Edit-2509-Lightning-4steps-V1.0-bf16.safetensors
        ├── Qwen-Image-Edit-2509-Lightning-8steps-V1.0-bf16.safetensors
        └── Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors
```

### Qwen-Image-Edit-2509

![](https://gyazo.com/c91a20239e3cb536dfc931a30562f19f){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit_lightning_8steps.json)

* `LoraLoaderModelOnly` ノードで Lightning LoRA を読み込みます。
* `KSampler` の `steps` を 4 または 8、`CFG` を 1.0 に設定します。

### Qwen-Image-Edit-2511

![](https://gyazo.com/cc8cbe2a940d686092555896d4b3f067){gyazo=image}

[](/workflows/basic-workflows/qwen-image-edit/Qwen-Image-Edit-2511_lightning_4steps.json)

* `LoraLoaderModelOnly` ノードで Lightning LoRA を読み込みます。
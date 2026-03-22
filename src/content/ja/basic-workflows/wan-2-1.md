---
layout: page.njk
lang: ja
section: basic-workflows
slug: wan-2-1
navId: wan-2-1
title: "Wan2.1"
summary: "Wan2.1でtext2video・image2video・FLF2Vを扱う基本workflow"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/f952fb311ffdb409a173641f61dd3b67.png"
tags: []
---

## Wan2.1とは？

**Wan2.1** は、アリババが開発したオープンソースの動画生成モデルです。

オープンソース界隈で、本格的に動画生成が行われるようになった火付け役ともいえる、印象的なモデルです。

text2video、image2video、FLF2V の 3 つのモードに対応しています。  
また、1 フレームだけ生成することで、画像生成モデルとしても使用できます。

細かい話にはなりますが、これは「動画生成が画像生成を内包している」というわけではなく、**最初から画像生成もできるように設計された動画生成モデル**です。

1.3B と 14B の 2 つのモデルサイズが用意されていますが、1.3B はさすがに性能が足りずほとんど使われていないため、ここでは 14B のみ使っていきます。

---

## 推奨設定

- 推奨解像度
  - 480p（854×480）〜 720p（1280×720）
- 最大フレーム数
  - 81 フレーム
- FPS
  - 16fps 付近で出力されることが多い

16fps だとスローモーションのような動画になることが多いので、24fps で保存したり、コマ落としで調整したりしてください。

---

## モデルのダウンロード

- diffusion models
  - [wan2.1_t2v_14B_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_t2v_14B_fp8_e4m3fn.safetensors)
  - [wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors)
  - [wan2.1_flf2v_720p_14B_fp8_e4m3fn.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/diffusion_models/wan2.1_flf2v_720p_14B_fp8_e4m3fn.safetensors)
- text encoder
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- VAE
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)
- gguf (任意)
  - [Wan2.1-T2V-14B-gguf](https://huggingface.co/city96/Wan2.1-T2V-14B-gguf/tree/main)
  - [Wan2.1-I2V-14B-720P-gguf](https://huggingface.co/city96/Wan2.1-I2V-14B-720P-gguf/tree/main)
  - [Wan2.1-FLF2V-14B-720P-gguf](https://huggingface.co/city96/Wan2.1-FLF2V-14B-720P-gguf/tree/main)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── wan2.1_t2v_14B_fp8_e4m3fn.safetensors
    │   ├── wan2.1_i2v_720p_14B_fp8_e4m3fn.safetensors
    │   └── wan2.1_flf2v_720p_14B_fp8_e4m3fn.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂unet/
    │   ├── wan2.1-t2v-14b-XXXX.gguf          ← gguf を使う場合のみ
    │   ├── wan2.1-i2v-14b-720p-XXXX.gguf     ← gguf を使う場合のみ
    │   └── wan2.1-flf2v-14b-720p-XXXX.gguf   ← gguf を使う場合のみ
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

> fp16 / bf16 版を使いたい場合は、上の fp8 のファイル名を読み替えてください。基本的な配置パスは同じです。

---

## text2video

Wan2.1 の基本となる text2video の workflow です。

![](https://gyazo.com/58d4a88ecb1e1e2887c830c371236b40){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_text2video_14B.json)

- 🟦 `ModelSamplingSD3` ノードの `Shift` は、動きの大きさに効くパラメータです。

  - 上げるほどカメラワークや被写体の変化が大きくなりますが、大きすぎれば崩れる原因になります。ひとまず `8` のままで問題ないでしょう。
  - cf. [Wan2.1 parameter sweep](https://replicate.com/blog/wan-21-parameter-sweep#what-is-shift)

---

### 品質が上がるかもしれない技術

体感できるほどではないですが、ほぼノーデメリットで品質を上げる技術がコアノードとして実装されているので、使っておきましょう。

![](https://gyazo.com/02c625103e8076b8a1f14046839e1ff9){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_text2video_14B_imp.json)

- 🟦 **UNetTemporalAttentionMultiply**

  - フレーム間の一貫性を補強し、チラつきを抑制します。
- 🟦 **CFG-Zero**

  - サンプリング序盤の CFG を弱めることで、過剰な補正による破綻を防ぎます。

---

## image2video

画像を与えると、その画像から続きを生成します。

![](https://gyazo.com/2cbaf276cd5e4f6751826c34efb6c743){gyazo=image}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_image2video_14B.json)

- 🟩 適度にリサイズした画像を `CLIP Vision Encode` と `WanImageToVideo` の両方に入力します。

---

## FLF2V（First–Last Frame to Video）

2 枚の画像を与えて、その間が自然に埋まるように動画を生成します。

![](https://gyazo.com/44220286b8ce6e0e70db622132527c02){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_FLF2V_14B.json)

- 🟩 2 枚の画像をバッチにして `WanFirstLastFrameToVideo` ノードに入力します。

---

## Self Forcing（高速生成）

本来はリアルタイム動画生成のための技術ですが、ComfyUI では単なる数ステップ生成による高速化手法として使います。

### モデルのダウンロード

- loras

  - [Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-T2V-14B-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)
  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
        └── Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
```

### workflow

![](https://gyazo.com/6e4854ea69598ba4b9c3d8bc259f4b57){gyazo=loop}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_text2video_14B_Self-Forcing.json)

- `LoraLoaderModelOnly` ノードで LoRA を読み込みます。
- `KSampler` の `steps` を 4 ～ 8、`CFG` を 1.0 に設定します。

> Self Forcing は「とにかく高速に回したいとき」の選択肢です。  
> 許容できないほどではないですが、劣化は大きいです。

---

## 画像生成

text2video の workflow で、**1 フレームで動画生成**するだけです。

![](https://gyazo.com/edf26ea1ef891b721579af1dc5aa6bd1){gyazo=image}

[](/workflows/basic-workflows/wan-2-1/Wan2.1_text2image_14B.json)

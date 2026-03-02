---
layout: page.njk
lang: ja
section: basic-workflows
slug: wan-animate
navId: wan-animate
title: "Wan-Animate"
summary: "Wan-Animateで人物・キャラへのモーション転送を行う"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["human-motion-transfer","talking-head"]
---

## Wan-Animateとは？

[Wan-Animate](https://humanaigc.github.io/wan-animate/) は、人・キャラへのモーション転送に特化した **Wan2.1-14B-I2V ベース** のモデルです。

> ![](https://gyazo.com/20a7f10f302751293cda0e0ed353d25a){gyazo=image}

- 入力した画像を、参照動画の人物の動きに合わせて動かす **Animation モード**
- 入力した動画の人物を、参照画像の人物に置き換える **Replacement モード**

2 パターンの生成モードがありますが、Replacement モードは Animation モードに「背景になじむような処理」を追加したもの、と考えると分かりやすいと思います。

Wan2.1 ベースのため 77 フレームまでしか生成できませんが、[Wan2.1 VACE](/ja/basic-workflows/wan-2-1-vace/) の Extension と同じように、最後の数フレームを抽出してその続きを生成する処理を繰り返すことで、実質的に長尺の動画を扱うこともできます。

---

## 必要なカスタムノード

事前処理として顔検出やポーズ推定を行います。次のカスタムノードがあると非常に便利です。

- [ComfyUI-WanAnimatePreprocess](https://github.com/kijai/ComfyUI-WanAnimatePreprocess)
  - YOLO による顔検出
  - ViTPose によるポーズ（棒人間）抽出
- [ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)
  - SAM2 を使った人物マスクの生成（Replacement モードで使用）

---

## モデルのダウンロード

Wan-Animate 本体と、Wan2.1 系で共通のモデルを揃えます。

- diffusion_models
  - [Wan2_2-Animate-14B_fp8_e4m3fn_scaled_KJ.safetensors](https://huggingface.co/Kijai/WanVideo_comfy_fp8_scaled/blob/main/Wan22Animate/Wan2_2-Animate-14B_fp8_e4m3fn_scaled_KJ.safetensors)
- loras
  - [WanAnimate_relight_lora_fp16.safetensors](https://huggingface.co/Kijai/WanVideo_comfy/blob/main/LoRAs/Wan22_relight/WanAnimate_relight_lora_fp16.safetensors)
- clip_vision
  - [clip_vision_h.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/clip_vision/clip_vision_h.safetensors)
- text_encoders
  - [umt5_xxl_fp8_e4m3fn_scaled.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors)
- vae
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)
- gguf（任意）
  - [Wan2.2-Animate-14B-GGUF](https://huggingface.co/QuantStack/Wan2.2-Animate-14B-GGUF/tree/main)

配置例です。

```text
📂ComfyUI/
└── 📂models/
    ├── 📂clip_vision/
    │   └── clip_vision_h.safetensors
    ├── 📂diffusion_models/
    │   └── Wan2_2-Animate-14B_fp8_e4m3fn_scaled_KJ.safetensors
    ├── 📂loras/
    │   └── WanAnimate_relight_lora_fp16.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
    ├── 📂unet/
    │   └── Wan2.2-Animate-14B-XXXX.gguf      ← gguf を使う場合のみ
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

---

## Animationモード

入力した静止画を、参照動画の人物の動きに合わせて動かすモードです。

かなり巨大なのでドキドキしますが、ベースは [Wan2.1 image2video](/ja/basic-workflows/wan-2-1/#image2video) の形そのままです。臆せず進めていきましょう。

![](https://gyazo.com/d25335c059e8117f9e617de4ffffefca){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Animation.json)

{% mediaRow img="https://gyazo.com/77b9c908b9e96505678ccaa0bde8055b{gyazo=image}", width=33, align="left" %}

**1. Wan-Animate モデルを読み込む**

- `Load Diffusion Model` で `Wan2_2-Animate` を読み込みます。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/1516ab2c0949d0df3261a26e46815d08{gyazo=image}", width=33, align="left" %}

**2. 生成解像度を決める**

- 入力画像に合わせて `Scale Image to Total Pixels` で総ピクセル数を調整します。
- PC のスペックに合わせて値を変えてください。
- 最後に解像度を **16 の倍数にクロップ** します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/c76608836777ce6a604372c2d9cc9c43{gyazo=image}", width=33, align="left" %}

**3. WanAnimateToVideo ノードに追加情報を入力する**

- `reference_image`
  動かしたい静止画。
- `face_video`
  参照動画から顔部分をクロップした動画。
  `Pose and Face Detection` が自動で YOLO による顔検出 → クロップを行います。
- `pose_video`
  参照動画から ViTPose で棒人間（キーポイント）を生成した動画。
  ドライビング動画と動かしたい画像では骨格や位置が違うため、retarget 処理で調整されます。

{% endmediaRow %}

**生成例**

![reference_image](https://gyazo.com/9f0e0e20d750b2e207b01adc56858202){gyazo=image} ![pose_video(処理前)](https://gyazo.com/d7f66b4153473136c37e48c7066709a1){gyazo=loop} ![output](https://gyazo.com/86ed4c6aa64af79325ce18359a4021bc){gyazo=loop}

---

## Replacementモード

入力した動画の人物を、参照画像の人物に置き換えるモードです。

Animation モードに、人物を inpainting するためのマスクと、背景になじませるためのリライト処理を追加したものになります。

![](https://gyazo.com/ab3d36d1e2ddfd5d7e452778dbab411c){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Replacement.json)

{% mediaRow img="https://gyazo.com/a26743871782e80338ed0d920ef6b786{gyazo=image}", width=33, align="left" %}

**1. リライト LoRA の追加**

- 入れ替えた人物を背景に溶け込ませるためのリライト LoRA を追加します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/bc59ff33c803effd0e772879857e8a3a{gyazo=image}", width=33, align="left" %}

**2. 参照画像の padding**

- 今回基準になるのは動画なので、動画の解像度に合わせて参照画像を padding します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a6c53693b87e1cebda390d6b7dca306a{gyazo=image}", width=33, align="left" %}

**3. 人物マスク生成**

- `Pose and Face Detection` が取得した人物座標を SAM2.1 に渡してマスクを生成します。
- マスクをやや大きめに膨張させ、`Blockify` ノードでドット絵のようなカクカクしたマスクに変換して `character_mask` にします。
  これをしないとなぜか生成された動画の輪郭に細い縁が残ります。
- `ImageCompositeMasked` でマスクした部分を黒で塗りつぶした動画を `background_video` として使います。

{% endmediaRow %}

**生成例**

![background-pose_video](https://gyazo.com/f14909bbf4415e5477b67870379c6719){gyazo=loop} ![reference_image](https://gyazo.com/59dda8074526ca42245b1220bbb4420f){gyazo=image} ![output](https://gyazo.com/280c5916091919526db60ea0625d441a){gyazo=loop}

---

## 6ステップ推論（Lightx2v LoRA）

蒸留 LoRA を使って、サンプリングステップを 4〜6 steps まで減らすことができます。

text2video で使うと劣化が気になりましたが、Wan-Animate では 0 から動画を作るわけではないため、あまり気になりません。積極的に活用していきたいところです。

### モデルのダウンロード

- loras

  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
```

### Animationモード（高速版）

![](https://gyazo.com/c8ff6a05cd057198146cd2cffb16d733){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Animation_lightx2v.json)

{% mediaRow img="https://gyazo.com/3808ae94efd870f0ff0ce1d77595ea36{gyazo=image}", width=33, align="left" %}

**LoRA の適用**

- 🟪 `LoraLoaderModelOnly` で Lightx2v LoRA を読み込みます。
- KSampler の設定

  - `steps` … 4〜6
  - `cfg` … 1.0

{% endmediaRow %}

**比較**

![20steps](https://gyazo.com/86ed4c6aa64af79325ce18359a4021bc){gyazo=loop} ![6steps](https://gyazo.com/67326f2a1a4d803ab4c6a40799aef8a7){gyazo=loop}

### Replacementモード（高速版）

![](https://gyazo.com/6e70b69630dea6bcf813917d8eb2c18a){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Replacement_lightx2v.json)

---

## 長尺動画のために処理を繰り返す

Wan-Animate のベースは Wan2.1 I2V と同様で、**1 回の推論で生成できるのは 77 フレーム** が上限です。
これを超える長尺動画を作る場合は、「最後の数フレームを引き継ぎながら何回も生成を繰り返す」構成にします。

ComfyUI ではループ処理ができないため、ほぼ同じ workflow を後ろへ後ろへ直列につなぐ形になります。

ここは正直スマートな処理とはいえず、Kijai さんの [ComfyUI-WanVideoWrapper](https://github.com/kijai/ComfyUI-WanVideoWrapper) での実装に一歩譲る部分です。

### Animationモード（リピート）

![](https://gyazo.com/a489fad9b07fb1f1745d556fa130c731){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Animation_lightx2v_repeat.json)

ぱっと見は莫大な workflow に見えますが、これまでのものと違う点は次の 2 点だけです。

![](https://gyazo.com/5db9830b2a2db2dd24ad1543906f49da){gyazo=image}

- `video_frame_offset`

  - 1 回目で 77 フレーム生成した場合、2 回目では `face_video` や `pose_video` を 78 フレーム目以降から使う必要があります。
  - `video_frame_offset` にオフセットフレーム数を入れると、`face_video` / `pose_video` の参照開始位置を自動でずらしてくれます。
- `continue_motion_max_frames`

  - のりしろとなるフレーム数を設定します。
  - 例えば `length` を 77、`continue_motion_max_frames` を 5 にすると、前回の最後の 5 フレームを使い、残り 72 フレームを新しく生成します。

このグループを繰り返しつないでいけば、理論上はいくらでも長い動画を作ることができます。
ただしコピー機と同じで、少しずつ誤差は蓄積されていきます。

### Replacementモード（リピート）

![](https://gyazo.com/5efe20ed9671e3eb4960fd5ddc70cb46){gyazo=image}

[](/workflows/basic-workflows/wan-animate/Wan2.2-Animate_Replacement_lightx2v_repeat.json)

---
layout: page.njk
lang: ja
section: basic-workflows
slug: ltx-2-5
navId: ltx-2-5
title: "LTX 2.5"
created: 2026-09-01
updated: 2026-10-05
summary: "LTX 2.5で動画と音声を生成する"
seoTitle: "ComfyUIでLTX 2.5を使う：動画と音声を同時に生成"
seoDescription: "LightricksのLTX 2.5をComfyUIで使う方法。推奨設定とモデル、Multi-shotやDuration Predictor、text2video、image2video、FLF2V、IC-LoRAを、読みやすく整理したworkflow付きで解説します。"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/ltx-2-5/legacy_gyazo_f0a0582dba74a4ef6e731142136b5c59.mp4"
tags: []
---

## LTX 2.5とは？

`LTX 2.5` は、`LTX-2`、`LTX 2.3` と続いてきた Lightricks の動画生成モデルの新しいバージョンです。

基本的な仕組みは [LTX 2.3](/ja/basic-workflows/ltx-2-3/) と同じですが、単純に出力が綺麗になっただけでなく、いくつか大きな改善が施されています。

- **Multi-shot**
  - 1 回の生成の中で複数のショットを作れるように
- **Gemma 4 Text Encoder**
  - Text Encoder が Gemma 3 から Gemma 4 に変更
- **Diffusion Decoder**
  - VAE Decode の代わりに、拡散モデルを使って latent から映像を復元します
  - 考え方としては [PiD](/ja/basic-workflows/pixeldit-pid/#pid) に近いですね

他にもいくつかの改善点がありますが、ComfyUI で使うなら、ひとまずこれだけ分かっていれば OK です。

---

## 推奨設定値

- 解像度
  - 32 の倍数である必要があります
- FPS
  - 決まった値に固定されていません
  - 既定値は 24 FPS です
- フレーム数
  - `8n + 1` である必要があります
- 動画最大長
  - 481 frames
  - 24 FPS なら約 20 秒です

---

## モデルのダウンロード

> [!WARNING]
> LTX 2.5 のモデルは、認証しないとダウンロードできません。Hugging Face のアカウントでログインし、[LTX-2.5 のページ](https://huggingface.co/Lightricks/LTX-2.5) で `Agree and Access` をクリックしてください。
>
> ![](/media/basic-workflows/ltx-2-5/ltx_2_5_huggingface_agree_and_access.png){media=image}
>
> 後半で使う IC-LoRA も、それぞれのページで同じように同意が必要です。

- diffusion_models
  - [ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/diffusion_models/ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors) (21.5 GB)
- latent_upscale_models
  - [ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors) (1 GB)
- text_encoders
  - [gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/text_encoders/gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors) (15.4 GB)
- vae
  - [ltx-2.5-video-vae-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/vae/ltx-2.5-video-vae-bf16.safetensors) (1.47 GB)
  - [ltx-2.5-audio-vae-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/vae/ltx-2.5-audio-vae-bf16.safetensors) (365 MB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   └── ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors
    ├── 📂text_encoders/
    │   └── gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors
    └── 📂vae/
        ├── ltx-2.5-video-vae-bf16.safetensors
        └── ltx-2.5-audio-vae-bf16.safetensors
```

---

## text2video

![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_text2video.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="255s", tags=["1MP"], samplers=[{ name: "1st", speed: "1.70 s/it" }, { name: "2nd", speed: "12.77 s/it" }] %}

LTX-2 と同じく、まず目標の半分の解像度で作り、そのあと 2 倍にアップスケールする 2 段階の workflow です。

{% mediaRow img="/media/basic-workflows/ltx-2-5/legacy_gyazo_d353cf476e7c8be513f7bc1e55cef365.png", width=40, align="left" %}
**解像度設定**

あとから 2 倍にするため、目標解像度の半分の値を `EmptyLTXVLatentVideo` に入力します。

この値も 32 の倍数にする必要があるため、目標の幅・高さは 64 の倍数にしてください。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_frame.png", width=40, align="left" %}
**フレーム数の設定**

この workflow では、作りたい動画の秒数（sec）と FPS を入力すると、適切な `8n + 1` のフレーム数に丸められます。

{% endmediaRow %}

{% outputs %}
![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_output.mp4){media=loop}
{% endoutputs %}

### Multi-shot

Seedance 2 などから一般的になってきましたが、1 回の生成で複数のショットを作ることができます。

![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_multishot.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_text2video_multishot.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="256s", tags=["1MP"], samplers=[{ speed: "12.69 s/it" }] %}

特別な書き方は必要なく、自然文で「ここにカットが入り……」と書けば認識してくれます。

気楽に書ける反面、Multi-shot として認識してくれないこともあります。うまくいかないときは、気長に何度か試してみてください。

{% outputs %}
![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_multishot_output.mp4){media=loop}
{% endoutputs %}

### Duration Predictor

動画の長さは基本的に手動で設定しますが、このプロンプトなら何秒がちょうどよいのか……というのは意外と悩ましいものです。

LTX 2.5 には、プロンプトの内容から、それを表現するために必要な動画の長さを自動で推定する機能があります。

**モデルのダウンロード**

- model_patches
  - [ltx-2.5-duration-head-bf16.safetensors](https://huggingface.co/Lightricks/LTX-2.5/blob/main/model_patches/ltx-2.5-duration-head-bf16.safetensors) (3.84 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂model_patches/
        └── ltx-2.5-duration-head-bf16.safetensors
```

![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_duration_predictor.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_text2video_duration_predictor.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="221s", tags=["1MP"], samplers=[{ speed: "5.66 s/it" }] %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/legacy_gyazo_4567c3906de961a9c90bc01cef27db5d.png", width=40, align="left" %}
**LTXV Duration Predictor**

プロンプトから予測されたフレーム数が出力されるので、通常の text2video workflow の `length` へつなぎます。

あくまで予測なので、思っていたより短くなったり、長くなったりすることもあります。それでも、動画の長さを自動で予測してくれるのは面白い機能ですね。

{% endmediaRow %}

{% outputs %}
![](/media/basic-workflows/ltx-2-5/ltx_2_5_text2video_duration_predictor_output.mp4){media=loop}
{% endoutputs %}

## image2video

![](/media/basic-workflows/ltx-2-5/ltx_2_5_image2video.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_image2video.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="254s", tags=["1MP"], samplers=[{ speed: "12.82 s/it" }] %}

[LTX 2 の image2video](/ja/basic-workflows/ltx-2/#image2video) と同じです。`LTXVImgToVideoInplace` で 1 フレーム目に入力画像を差し込みます。

> [!NOTE]
> 以前は、いろいろな理由から `LTXV Preprocess` で入力画像をわざと劣化させていましたが、LTX 2.5 では、少なくとも私が使った限りでは必要なさそうなので外しています。

{% outputs %}
![input](/media/basic-workflows/ltx-2-5/ltx_2_5_image2video_input.webp){media=image} ![output](/media/basic-workflows/ltx-2-5/ltx_2_5_image2video_output.mp4){media=loop}
{% endoutputs %}

---

## Generative Interpolation / FLF2V

任意の数の画像を渡し、その間を滑らかに埋めてもらう workflow です。

動画の最初と最後だけを指定すれば、いわゆる **FLF2V** というものになります。

![](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="334s", tags=["1MP"], samplers=[{ speed: "16.08 s/it" }] %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/legacy_gyazo_2e39b3e006fcb35d96b87d649ded0146.png", width=40, align="left" %}
**LTXV Add Guide**

`frame_idx` に画像を入れる位置を指定します。

- `0`：最初のフレーム
- `-1`：最後のフレーム

ノードを増やし、直列につなげれば、Generative Interpolation になります。

> [!NOTE]
> 画像にはよりますが、フレーム補間ではなく、トランジションのようになってしまうことがあります。<br>
> 中間に差し込む `LTXVAddGuide` の `strength` は、0.3〜0.4 くらいまで小さくしたほうが良いかもしれません。

{% endmediaRow %}

{% outputs %}
![input1](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation_input1.webp){media=image} ![input2](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation_input2.webp){media=image} ![input3](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation_input3.webp){media=image} ![output](/media/basic-workflows/ltx-2-5/ltx_2_5_generative_interpolation_output.mp4){media=loop}
{% endoutputs %}

---

## IC-LoRA

LTX における ControlNet や、動画編集 LoRA のような役割を持つのが IC-LoRA です。

LTX 2.5 は LTX 2.3 用 IC-LoRA の多くと互換性があり、そのまま使えます。

### Union Control

一般的な ControlNet と同様、線画や深度マップ、ポーズ動画で生成動画を制御できます。

**モデルのダウンロード**

- loras
  - [ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/blob/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors) (654 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors
```

![](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_union_control_pose.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_union_control_pose.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="404s", tags=["1MP"], samplers=[{ name: "1st", speed: "2.37 s/it" }, { name: "2nd", speed: "8.56 s/it" }] %}

IC-LoRA の詳しい解説は [LTX 2/IC-LoRA (Pose)](/ja/basic-workflows/ltx-2/#ic-lora-pose) で行っているので、興味があれば見てみてください。

{% outputs %}
![input/pose](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_union_control_pose_input.mp4){media=loop} ![output](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_union_control_pose_output.mp4){media=loop}
{% endoutputs %}

### Clean Plate

Lightricks 公式から、LTX 2.5 でできる VFX 処理として、[愉快な IC-LoRA](https://huggingface.co/collections/Lightricks/ltx-25-creative-lab) がたくさん出ています。

昼を夜にしたり、水浸しにしたりと色々なものがありますが、今回は動画内の特定のものを消す **Clean Plate** を使ってみましょう。

**モデルのダウンロード**

- loras
  - [ltx-2.5-22b-ic-lora-clean-plate-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Clean-Plate) (327 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.5-22b-ic-lora-clean-plate-1.0.safetensors
```

![](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_clean_plate.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_clean_plate.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="433s", tags=["1MP"], samplers=[{ speed: "27.37 s/it" }] %}

プロンプトの書き方に少し注意が必要です。

画像編集のように「〇〇を消して」と書くのではなく、〇〇が消えたあとの景色を、普通の文章として書きます。消したいものがはっきりしているときは、`no bicycle anywhere in the frame` のように、それが無いことも書き添えると効きやすくなります。

> [!NOTE]
> 画面の端にあるものや、一部が隠れているものは綺麗に消えやすい一方、画面の真ん中を大きく占めるものは苦手なようです。消したあとの背景の手がかりが、映像の中にほとんど残らないからでしょうね。

{% outputs %}
![input](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_clean_plate_input.mp4){media=loop} ![output](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_clean_plate_output.mp4){media=loop}
{% endoutputs %}

基本的には、この workflow で他の IC-LoRA も動かせます。ただ、専用の workflow が必要なものもいくつかあるので、以下で見ていきます。

### Alpha Gen

動画の中から前景を切り抜くことができます。

ただし、背景が透過された動画がそのまま出てくるわけではないので、少し後処理をしてあげる必要があります。

**モデルのダウンロード**

- loras
  - [ltx-2.5-22b-ic-lora-alpha-gen-0.9.safetensors](https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Alpha-Gen) (1.31 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.5-22b-ic-lora-alpha-gen-0.9.safetensors
```

![](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="369s", tags=["1MP"], samplers=[{ speed: "25.78 s/it" }] %}

プロンプトは使いません。空のままにしておきます。

出力されるのは、白黒のマスク動画です。

ComfyUI では透過動画は作れないので、ここではグリーンバックの動画にしてみましょう。

{% mediaRow img="/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen_image_composite_masked.png" %}
**グリーンバックに合成する**

- 白黒の動画を `ImageToMask` でマスクにする
- `InvertMask` で反転する
- `ImageCompositeMasked` で、緑一色の `EmptyImage` を背景部分に合成する

{% endmediaRow %}

> [!NOTE]
> 145 frames より長い動画では、元の映像がマスクに混ざり始めるようです。workflow では 145 frames で切っています。

{% outputs %}
![input](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen_input.mp4){media=loop} ![mask](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen_output_mask.mp4){media=loop} ![green back](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_alpha_gen_output_gb.mp4){media=loop}
{% endoutputs %}

### Refine Details

任意の動画を、細部を描き込みながら、4K のような高解像度にアップスケールします。

計算量を抑えるためにタイルに分けて処理するので、カスタムノードが必要です。

**カスタムノード**

- [Lightricks/ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo)

**モデルのダウンロード**

- loras
  - [ltx-2.5-22b-ic-lora-refine-details-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Refine-Details) (1.31 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        └── ltx-2.5-22b-ic-lora-refine-details-1.0.safetensors
```

![](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details.png){media=image}

{% workflow "/workflows/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details.json", level=3, gpu="RTX 4070 Ti 12GB", ram="DDR5 64GB", time="533s", tags=["4MP"] %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details_resize.png" %}
**先に動画をリサイズする**

先に、動画を大きなサイズ（この workflow では約 4 MP）へ引き伸ばしておきます。

Refine Details がやるのは、引き伸ばされてぼやけた動画を、綺麗に描き込み直す作業ということですね。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details_tiled_fusion_sampler.png" %}
**Tiled Fusion Sampler**

`LTXVTiledFusionSampler` が、動画をタイル状に分割してサンプリングしてくれます。

設定は特に変更する必要はありません。

{% endmediaRow %}

プロンプトには、写っているものではなく、`sharp photographic detail` や `natural film grain` のような、画質についての言葉を書きます。タイルごとにプロンプト全体が渡されるので、人物などを書くと、その人がいないタイルにまで描き込まれてしまいます。

{% outputs %}
![input](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details_input.mp4){media=loop} ![output](/media/basic-workflows/ltx-2-5/ltx_2_5_ic_lora_refine_details_output.mp4){media=loop}
{% endoutputs %}

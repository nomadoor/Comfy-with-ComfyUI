---
layout: page.njk
lang: ja
section: basic-workflows
slug: minimax-h3
navId: minimax-h3
title: "MiniMax H3"
created: 2026-09-14
summary: "MiniMax H3で映像と音声を生成する"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/minimax-h3/minimax_h3_hero.mp4"
tags: []
---

## MiniMax H3とは？

[MiniMax H3](https://github.com/MiniMax-AI/MiniMax-H3) は、MiniMax が公開した動画生成モデルです。

テキスト、画像、動画、音声をすべてを一つの Transformer で扱うというシンプルなアーキテクチャで、ローカル動画生成 AI の中では、一つ飛び抜けた性能と柔軟性を実現しています。

ベースは同じですが、役割ごとにモデルは 2 種類に分かれています。

- **FL2VA**
  - text2video、image2video、First / Last Frame to Video に使用
- **Ref2VA**
  - 画像・動画・音声を参照し、人物、動き、カメラ、絵柄、声などを組み合わせて生成

---

## 推奨設定値

- 解像度
  - 768p、約 1MP
  - 幅と高さは 32 の倍数にします
- FPS
  - 24 FPS
- フレーム数
  - `17n + 5`
- 動画の長さ
  - 5〜15 秒

---

## モデルのダウンロード

- diffusion_models
  - [minimax_h3_fl2va_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/diffusion_models/minimax_h3_fl2va_pruned_int8_convrot.safetensors) (21 GB)
  - [minimax_h3_ref2va_pruned_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/diffusion_models/minimax_h3_ref2va_pruned_int8_convrot.safetensors) (21 GB)
- text_encoders
  - [qwen3vl_32b_minimax_h3_int8_convrot.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/text_encoders/qwen3vl_32b_minimax_h3_int8_convrot.safetensors) (27.1 GB)
- vae
  - [minimax_h3_audio_vae_fp32.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/vae/minimax_h3_audio_vae_fp32.safetensors) (605 MB)
  - [minimax_h3_video_vae_fp16.safetensors](https://huggingface.co/Comfy-Org/MiniMax-H3/blob/main/vae/minimax_h3_video_vae_fp16.safetensors) (5.21 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── minimax_h3_fl2va_pruned_int8_convrot.safetensors
    │   └── minimax_h3_ref2va_pruned_int8_convrot.safetensors
    ├── 📂text_encoders/
    │   └── qwen3vl_32b_minimax_h3_int8_convrot.safetensors
    └── 📂vae/
        ├── minimax_h3_audio_vae_fp32.safetensors
        └── minimax_h3_video_vae_fp16.safetensors
```

---

## プロンプト

自然文でも動きますが、性能を引き出すには、推奨されたプロンプトの書き方をする必要があります。

人間が書くには複雑すぎるので、MiniMax 公式のプロンプトガイドを ChatGPT や Claude に渡して、プロンプトを作ってもらってください。

- [MiniMax H3 Skills](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills)
- [Video Prompt Writing Guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md)
  - T2VA、I2VA、FL2VA、L2VA 向け
- [Full-Reference Prompt Guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md)
  - Ref2VA 向け

ただ、作ってもらったプロンプトがあっているかどうか確認するために、基本的なところだけ説明しようと思います。

### FL2VA

T2VA / I2VA / FL2VA / L2VA では、映像と音声を 3 つに分けて書きます。

```text
integrated_multimodal_description:
[Shot 1] 映像、人物の動作、カメラ、台詞、効果音を書く。

overall_soundscape:
環境音や物理音を書く。

non_diegetic_music:
BGMを書く。なければ N/A。
```

ワンカットにしたい場合は、カットしないことを本文中で明示します。

```text
[Shot 1] Single continuous shot, one take, no cuts. ...
```

複数のショットを作る場合は、最初のショットには時刻を書かず、2 ショット目以降にカットする時刻を書きます。

```text
[Shot 1] 最初のショットを書く。
[Shot 2] At 00:02.000, the camera cuts to ...
[Shot 3] At 00:04.000, the shot changes to ...
```

### Ref2VA

Ref2VA では、専用の 6 項目に分けて書きます。

```text
subject_definitions:
参照する人物・物体・映像・音声を定義する。

summary:
何を作るかを簡潔に書く。

retention_analysis:
参照素材の何を維持・転送するかを書く。

detailed_description:
映像、動作、カメラ、台詞、効果音を書く。

overall_soundscape:
環境音や物理音を書く。

non_diegetic_music:
BGMを書く。なければ N/A。
```

接続した素材は、`<Picture 1>`、`<Video 1>`、`<Audio 1>` のようなタグで指定し、それぞれの何を使うのかを書きます。

写真の中の人物など、素材内の一部分だけを使いたい場合は、`<Subject 1>` のように定義します。

```text
<Subject 1> is the woman in <Picture 1>.
```

台詞は `<d>` タグで囲み、`[Japanese]` のように言語も指定します。

```text
<Subject 1> (S1) says: <d>[Japanese] こんにちは。</d>
```

---

## 軽量化・高速化について

MiniMax H3 はクオリティが高い一方、非常に重いモデルでもあります。

そのため、VRAM の使用量を減らしたり、生成速度を上げたりする技術が数多く開発されています。どれも素晴らしい技術ですが、大なり小なり品質は落ちます。

どれを使うかは、得られるメリットとデメリットのバランスを見極めて決めることになりますが、それが非常に難しいため、このページでは `Comfy Kitchen Attention`（CK Attention）だけを使い、その他の最適化は使わずに workflow を組んでいます。

詳しい情報は以下にまとめています。

- [MiniMax H3のモデル選択・高速化・軽量化・省計算](https://scrapbox.io/work4ai/MiniMax_H3%E3%81%AE%E3%83%A2%E3%83%87%E3%83%AB%E9%81%B8%E6%8A%9E%E3%83%BB%E9%AB%98%E9%80%9F%E5%8C%96%E3%83%BB%E8%BB%BD%E9%87%8F%E5%8C%96%E3%83%BB%E7%9C%81%E8%A8%88%E7%AE%97)

ある程度技術が落ち着いたら、別途、記事としてまとめようと思います。

---

## text2video / T2VA

使用モデル：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_t2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_t2va.json)

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_t2va_resolution_length.png", width=40, align="left" %}
**解像度・動画長さ設定**

推奨の解像度は約 1 MP ですが、計算コストもかなり高くなります。最初は 0.3 MP など、小さなサイズで試したほうがよいかもしれません。

作りたい動画の長さ（sec）を入力すると、フレーム数を適切な `17n + 5` に丸めてくれます。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_t2va_cfg.png", width=40, align="left" %}
**CFG**

H3 はすでに CFG 蒸留されたモデルです。そのため、CFG は `1.0` にします。

{% endmediaRow %}

**出力例**

![](/media/basic-workflows/minimax-h3/minimax_h3_t2va_output.mp4){media=player}

---

## image2video / I2VA

使用モデル：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_i2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_i2va.json)

`MiniMax H3 Image to Video` にプロンプトと最初の画像を入力します。

**出力例**

![input](/media/basic-workflows/minimax-h3/minimax_h3_i2va_input.png){media=image} ![output](/media/basic-workflows/minimax-h3/minimax_h3_i2va_output.mp4){media=loop}

---

## First / Last Frame to Video

使用モデル：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_flf2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_flf2va.json)

I2VA と基本的にまったく同じです。`last_frame` にも画像を入力します。

**出力例**

![first](/media/basic-workflows/minimax-h3/minimax_h3_flf2va_first_frame.png){media=image} ![last](/media/basic-workflows/minimax-h3/minimax_h3_flf2va_last_frame.png){media=image} ![output](/media/basic-workflows/minimax-h3/minimax_h3_flf2va_output.mp4){media=loop}

### Generative Interpolation

使用モデル：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_generative_interpolation.json)

指定したフレームに画像を差し込み、その間をつないでもらいます。

`Add Guide for MiniMax H3` ノードを使用します。

**出力例**

![input1](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_input_1.png){media=image} ![input2](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_input_2.png){media=image} ![input3](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_input_3.png){media=image} ![output](/media/basic-workflows/minimax-h3/minimax_h3_generative_interpolation_output.mp4){media=loop}

---

## Audio-driven Video Generation

使用モデル：`fl2va`

![](/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va.json)

`Add Guide for MiniMax H3` は音声も入力できます。

画像と音声を入力し、画像の人物がその音声に合わせて動く動画を生成してみましょう。

**出力例**

![input](/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va_input.png){media=image} ![output](/media/basic-workflows/minimax-h3/minimax_h3_audio_driven_i2va_output.mp4){media=player}

---

## Reference Generation

使用モデル：`ref2va`

ここからが MiniMax H3 の本懐。面白いところです。

H3 は動画を生成するための参考資料として、好きな「画像」「動画」「音声」を、特に気にすることなくいくつも放り込めます。

あとは「1 番の画像を、1 番の音声でしゃべらせて」のように指示するだけで、生成する動画をコントロールできます。すごい。

![](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_reference_generation.json)

今回は、すべて画像を参照として使って動画を作ります。

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_prompt.png", width=40, align="left" %}
**プロンプト**

`fl2va` モデルとはプロンプトの書き方が異なります。

[上のプロンプト / Ref2VA](#ref2va) を参考に書いてください。

> ややこしいことに、ノード上では `ref_image_0` のように 0 から始まりますが、H3 のプロンプトでは `<Picture 1>` のように 1 から始めます。

{% endmediaRow %}

**出力例**

![](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output.mp4){media=player}


### 🤔 Ref2VA は FL2VA と比べると単純な出力の質が落ちる

これは [MiniMax 公式も認めている](https://www.reddit.com/r/StableDiffusion/comments/1vh9rtw/comment/p29qqaa/) ことですが、Ref2VA モデルは FL2VA モデルと比べて、単純にクオリティが下がります。

正当に解決されるのを待ちたいですが、いくつか裏技があります。

実は、この 2 つのモデルはアーキテクチャがほとんど同じなので、FL2VA モデルでも Reference Generation がある程度できたりします。

![ref2va](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output.mp4){media=loop} ![fl2va](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output_fl2va.mp4){media=loop} ![Hybrid](/media/basic-workflows/minimax-h3/minimax_h3_reference_generation_output_hybrid.mp4){media=loop}

綺麗になりました。とはいえ、さすがに Ref2VA のほうが柔軟性はありますね。

そこで、2 つのモデルを上手いこと混ぜた Hybrid model というものも有志から出ているので、一応ご紹介します。Ref2VA の性能に我慢できなくなったら使ってみてください。

- [Minimax-H3-fl2va-ref2va-hybrid-models](https://huggingface.co/smhfacct/Minimax-H3-fl2va-ref2va-hybrid-models/tree/main)
  - どれくらい Ref2VA に寄せているかの違いで、複数のモデルがあります
  - `b20-49` か `b25-49` を使ってみてください。

---

## Video Editing

使用モデル：`ref2va`

`ref2va` のもう一つの代表的な使い方が、指示ベースの動画編集です。

FLUX.2 [klein] や Nano Banana のような画像編集の動画版ですね。

![](/media/basic-workflows/minimax-h3/minimax_h3_video_editing.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_video_editing.json)

workflow は基本的に Reference Generation と同じです。

動画を参照として入力し、その動画に対して「人を消して」「絵柄を変えて」などと指示するプロンプトを書くだけです。

**出力例**

![Ref image](/media/basic-workflows/minimax-h3/minimax_h3_video_editing_ref.png){media=image} ![input video](/media/basic-workflows/minimax-h3/minimax_h3_video_editing_input.mp4){media=loop} ![output](/media/basic-workflows/minimax-h3/minimax_h3_video_editing_output.mp4){media=loop}

---

## 空間 Inpainting

使用モデル：`どちらでも可`

昔ながらの(?)マスクを用意し、そこだけ描き直させる inpainting も H3 では可能です。

ただし、こんなことをしなくても、Video Editing で「〇〇を△△に変えて」と言えば済むので、あまり使う場面はないかもしれません……。

![](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting.json)

今回は `ref2va` モデルを使って、動画内の犬を参照画像のぬいぐるみに変えてみます。

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_segmentation.png", width=40, align="left" %}
**セグメンテーション**

SAM 3.1 で犬をマスクし、少し余裕をもたせるためにマスクを大きくします。

- [SAM 3.1](/ja/data-utilities/sam3/) については、別のページで解説しています。

{% endmediaRow %}

**出力例**

![input](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_input.mp4){media=loop} ![mask](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_mask.mp4){media=loop} ![output](/media/basic-workflows/minimax-h3/minimax_h3_spatial_inpainting_output.mp4){media=loop}

---

## Hires.fix

これまでは最初から 1.0 MP で生成していました。品質はよいのですが、一回ごとにかなり時間がかかってしまいます。

そこで、1 段目は 0.25 MP で生成し、良さそうなら二倍にアップスケールして仕上げる、という方法があります。いわゆる [Hires.fix](/ja/basic-workflows/sd15-hires-fix/) です。

> 同じプロンプトでも、0.25 MP で生成する場合と 1.0 MP で生成する場合では、モデルが表現できるものに差があります。
>
> 時間に余裕があるなら、最初から推奨の 1.0 MP で生成するのがおすすめです。

### 必要なカスタムノードとモデル

- [xmarre/Comfyui_Minimax_h3_latent_Upscaler-Plus](https://github.com/xmarre/Comfyui_Minimax_h3_latent_Upscaler-Plus)
  - フォーク元が ComfyUI Manager に登録されていないため、Manager からインストールできるこちらを使います
- latent_upscale_models
  - [minimax_h3_latent_upscaler_3d_bf16.safetensors](https://huggingface.co/LBH-123-AI/Minimax_h3_latent_Upscaler/blob/main/minimax_h3_latent_upscaler_3d_bf16.safetensors) (691 MB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂latent_upscale_models/
        └── minimax_h3_latent_upscaler_3d_bf16.safetensors
```

### text2video / T2VA

![](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va.json)

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_first_stage_resolution.png", width=40, align="left" %}
**1 段目の解像度**

最終的に作りたい動画の幅と高さを、それぞれ半分にした値を最初の `Empty Latent` に入力します。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_latent_upscale.png", width=40, align="left" %}
**latent のアップスケール**

ピクセル画像へデコードせず、**latent のまま** 幅と高さを 2 倍にアップスケールします。

latent を単純に拡大すると大きく劣化するため、専用のモデルを使います。

また、H3 は動画と音声の latent がひとつになっています。アップスケールするのは動画だけなので、一度分離し、アップスケールしたあとで再びひとつに戻します。

{% endmediaRow %}


**出力例**

![0.25 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_output_0_25mp.mp4){media=loop} ![1.0 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_t2va_output_1_0mp.mp4){media=loop}

### image2video / I2VA

![](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va.png){media=image}

[](/workflows/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va.json)

I2VA や Ref2VA では、Conditioning 側にも解像度を入力します。

1 段目は 0.25 MP、2 段目は幅と高さをそれぞれ 2 倍にした 1.0 MP に設定する必要があるので、workflow が少し複雑になってしまいますね……。

**出力例**

![0.25 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va_output_0_25mp.mp4){media=loop} ![1.0 MP](/media/basic-workflows/minimax-h3/minimax_h3_hiresfix_i2va_output_1_0mp.mp4){media=loop}

## 参考

- [MiniMax H3](https://github.com/MiniMax-AI/MiniMax-H3)
- [ComfyUI MiniMax H3 Video Generation Guide](https://docs.comfy.org/tutorials/video/minimax/minimax-h3)

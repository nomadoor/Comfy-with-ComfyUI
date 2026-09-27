---
layout: page.njk
lang: ja
section: basic-workflows
slug: ltx-2-3
navId: ltx-2-3
title: "LTX 2.3"
created: 2026-03-22
updated: 2026-04-13
summary: "LTX 2.3: text2video / image2video / audio2video"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "/media/basic-workflows/ltx-2-3/legacy_gyazo_f3f8635fb9056670204fe9bdac577b39.mp4"
tags: []
---

## LTX 2.3とは？

`LTX 2.3` は、Lightricks の動画生成モデル `LTX-2` の改良版です。

基本的な考え方やノード構成は [LTX-2](/ja/basic-workflows/ltx-2/) と同じです。  
そのため、このページでは **LTX-2 から何が変わるか** だけ見ていきます。

---

## 推奨設定値

- 解像度
  - 最終出力として 1.5M ピクセル前後
  - ※32の倍数である必要があります
- FPS
  - 24 / 25 / 48 / 50
- フレーム数
  - 65 / 97 / 121 / 161 / 257
  - `8n + 1` である必要があります

---

## モデルのダウンロード

- checkpoints
  - [ltx-2.3-22b-dev-fp8.safetensors](https://huggingface.co/Lightricks/LTX-2.3-fp8/blob/main/ltx-2.3-22b-dev-fp8.safetensors) (29.1 GB)
- latent_upscale_models
  - [ltx-2.3-spatial-upscaler-x2-1.1.safetensors](https://huggingface.co/Lightricks/LTX-2.3/blob/main/ltx-2.3-spatial-upscaler-x2-1.1.safetensors) (996 MB)
- loras
  - [ltx-2.3-22b-distilled-lora-384.safetensors](https://huggingface.co/Lightricks/LTX-2.3/blob/main/ltx-2.3-22b-distilled-lora-384.safetensors) (7.61 GB)
- text_encoders
  - [gemma_3_12B_it_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/ltx-2/blob/main/split_files/text_encoders/gemma_3_12B_it_fp8_scaled.safetensors) (13.2 GB)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── ltx-2.3-22b-dev-fp8.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2.3-spatial-upscaler-x2-1.1.safetensors
    ├── 📂loras/
    │   └── ltx-2.3-22b-distilled-lora-384.safetensors
    └── 📂text_encoders/
        └── gemma_3_12B_it_fp8_scaled.safetensors
```

---

## 基本的な処理の流れ

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_7ace8e776133d570e2d42b1a27435189.png){media=image}

アーキテクチャは [LTX-2](/ja/basic-workflows/ltx-2/) と同じなので、workflow もそのまま流用できます。  
ただし、そのままではあまり良い結果が出ません。

そこで、このページでは、コミュニティが見つけた **[3stage workflow](https://www.reddit.com/r/StableDiffusion/comments/1rn3fjv/for_ltx2_use_triple_stage_sampling/)** を紹介します。

もともと LTX-2 は、一度低解像度で生成したものを Hires.fix して 1.5MP にする 2stage での生成をしていました。  
2.3 ではさらに 1 段増やし、非常に小さな解像度で生成したものを 2 倍 Hires.fix、さらにそれをもう 2 倍 Hires.fix します。

公式に推奨されている方法ではありませんが、明確に結果が良いのでこちらを採用しています。

> 全て `distilled-lora` を適用した 8 ステップ生成です。

---

## プロンプトについて

LTX-2 と同様に、プロンプトの質はそのまま生成動画の質に繋がります。  
[公式のプロンプトガイド](https://x.com/ltx_model/status/2029927683539325332)を参考にしながら、定量的で情報量のあるプロンプトを書くのがおすすめです。

LLM に手伝ってもらうのも有効です。参考リンクと作りたい内容を渡して、整えてもらいましょう。

> ComfyUI には、コアで LLM を動かす [TextGenerate ノード](/ja/basic-workflows/llm-mllm/#textgenerate-ノード) があります。  
> 多くの LTX-2 workflow ではこれでプロンプトを整えていますが、あくまでプロンプトを修正するだけのノードなので、このページの workflow では使っていません。  
> 個人的には ChatGPT や Gemini で別に作る方が気楽だと思います。

---

## text2video

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_7477c07351d62edda93ae50270bbbaf5.png){media=image}

[](/workflows/basic-workflows/ltx-2-3/ltx_2_3_text2video_distilled_3stage.json)


{% mediaRow img="/media/basic-workflows/ltx-2-3/legacy_gyazo_6e9e9474d28ef76af5053fb0be5e6290.png {media=image}", width=40, align="left" %}

**動画解像度・長さ・FPSの設定**

生成したい動画と音声のパラメータをここで決めます。

- EmptyLTXVLatentVideo / LTXV Empty Latent Audio に、解像度・フレーム数・FPS を入力します。
- 🚨LTX-2 のときと異なる部分
  - 2倍を二回、つまり最終的には縦横4倍の解像度になるため、それを加味して 0.1MP 程度の値を設定します

{% endmediaRow %}

**出力例**

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_2cd2d6eb51760a4928ba476bf2c0878b.mp4){media=loop}

---

## image2video

![](https://gyazo.com/0bb56ddc29aa5c644460f5eb6a2c7443){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/ltx_2_3_image2video_distilled_3stage.json)

**出力例**

![入力](/media/basic-workflows/ltx-2-3/legacy_gyazo_bf4c40372ce923fb53f2867c33c27bc6.png){media=image} ![出力](/media/basic-workflows/ltx-2-3/legacy_gyazo_cb1a91ed174f29d4441ae1332590f3a0.mp4){media=loop}

---

## audio2video

![](https://gyazo.com/0d62ef375ff30b08ea96c40b5105c94c){gyazo=image}

[](/workflows/basic-workflows/ltx-2-3/ltx_2_3_audio2video_distilled_3stage.json)

**出力例**

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_4e0ce0ea62fc7138ffe7ea1892ec21b8.mp4){media=player}

---

## audio-image2video

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_443cbbeacab7a63e85641c0b209ab5da.png){media=image}

[](/workflows/basic-workflows/ltx-2-3/ltx_2_3_audio_image2video_distilled_3stage.json)

**出力例**

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_dc3fb2e0b92432ca2651ca121aea7205.png){media=image} ![](/media/basic-workflows/ltx-2-3/legacy_gyazo_69ebdac3cc6a3badd9452f0cbb345167.mp4){media=player}

---

## Generative Interpolation

FLF2V や FMLF2V とも呼ばれますが、途中のフレームに画像を差し込み、それを目印に動画を生成する仕組みです。

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_f0cdfd8e0d5f0106e0d6fc98fdcb9aee.png){media=image}

[](/workflows/basic-workflows/ltx-2-3/ltx_2_3_generative_interpolation_distilled_1stage.json)

`image2video` の延長にも見えますが、仕組みとしては別物です。  
`image2video` は最初の 1 枚を参照画像に差し替え、残りのフレームを生成します。  
それに対してこちらは、途中のフレームごとに参照画像をガイドとして横に置いて生成させます。

{% mediaRow img="/media/basic-workflows/ltx-2-3/legacy_gyazo_e115e860b7b68f36f27937d9e630501d.png {media=image}", width=40, align="left" %}

**1. 画像のリサイズ**

参照画像を適切なサイズ（1.5 MP）にリサイズします。
- 二枚目以降も一枚目と同じサイズにリサイズする必要があります。
- `Resize Image/Mask` ノードにある `match size` モードを使うと簡単です。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2-3/legacy_gyazo_9cd44b6e0a04e7a63cb0f8de0ed01475.png {media=image}", width=40, align="left" %}

**2. LTXVAddGuide**

ここで参照画像をガイドとして差し込みます。

- `frame_idx` に、差し込みたいフレーム位置と画像を入力します。
  - `0`: 最初のフレーム
  - `-1`: 最後のフレーム
- この workflow では参照フレームを 3 つにしていますが、直列につないでいけばいくらでも増やせます
  - 逆に 1 枚だけなら `image2video` のように使えますし、最初と最後だけ差し込めば FLF2V になります。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/13c859c89782a23e4d001be63cde0057 {gyazo=image}", width=40, align="left" %}

**3. LTXVCropGuides**

LTX-2 のガイド機構では、そのまま出力すると生成した動画にガイド画像が混ざってしまいます。  
そのため、`LTXVCropGuides` ノードでガイド部分を除去します。

詳しい挙動はこちらで確認してください。
- [LTX-2 IC-LoRA (Pose)](/ja/basic-workflows/ltx-2/#ic-lora-pose)

{% endmediaRow %}

**出力例**

![入力](/media/basic-workflows/ltx-2-3/legacy_gyazo_513a407f54159c8e3cae9a32fe888702.mp4){media=loop} ![出力](/media/basic-workflows/ltx-2-3/legacy_gyazo_fad61f020fb0ed54bd23c59782bff81d.mp4){media=loop}

---

## IC-LoRA

`LTX-2.3` でも、`LTX-2` と同様に IC-LoRA 系の拡張を使うことができます。  
いくつか種類がありますが、ここでは分かりやすい二種だけ紹介します。

- Union
  - ポーズや深度マップ、エッジを条件に動画を生成します
- Outpaint
  - 入力動画の黒い部分を自然に埋めます

### モデルのダウンロード

- [ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors](https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/blob/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors) (654 MB)
- [ltx-2.3-22b-ic-lora-outpaint.safetensors](https://huggingface.co/oumoumad/LTX-2.3-22b-IC-LoRA-Outpaint/blob/main/ltx-2.3-22b-ic-lora-outpaint.safetensors) (1.31 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors
        └── ltx-2.3-22b-ic-lora-outpaint.safetensors
```

### IC-LoRA Union (Pose)

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_9432f1cad25a54328ed912bc85af4a2d.png){media=image}

[](/workflows/basic-workflows/ltx-2-3/ltx_2_3_ic_lora_pose_distilled_2stage.json)

- 🚨IC-LoRA のときは **3 stage ではなく 2 stage** の workflow を使います
- IC-LoRA Union では、制御動画に「生成動画の半分の解像度」を使う、という少し特殊な方法を使います
  - そのため 3 stage にすると、制御画像の解像度はさらに小さくなり、100px 前後まで落ちます
  - そこまで小さくなると、制御画像として必要な情報を保ちにくくなります
  - そのため、IC-LoRA では 2 stage で止める方が安定します

**出力例**

![入力](/media/basic-workflows/ltx-2-3/legacy_gyazo_9aea1871cc24b0c98931d55bebb1c19c.mp4){media=loop} ![出力](/media/basic-workflows/ltx-2-3/legacy_gyazo_25f44e7a08247ae96a2ebcc3cb901d56.mp4){media=loop}


### IC-LoRA Outpaint

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_b43880620c819f250e61f6df0e494a7c.png){media=image}

[](/workflows/basic-workflows/ltx-2-3/ltx_2_3_ic_lora_outpaint_distilled_1stage.json)

入力動画の黒い部分を自然に埋める workflow です。  
元の動画をなるべく崩したくないため、低解像度から順に拡大していく 3stage ではなく、1stage にしています。

{% mediaRow img="/media/basic-workflows/ltx-2-3/legacy_gyazo_80624e8617d2df1c92f929249c681752.png {media=image}", width=40, align="left" %}
**LoRAモデルの読み込み**

`IC-LoRA-Outpaint` の LoRA を読み込みます。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2-3/legacy_gyazo_404ebbcfd601d31b927e97573327e398.png {media=image}", width=40, align="left" %}
**黒でPadding**

広げたい範囲を、黒で Padding して追加します。  
特別なマスクを作る必要はなく、黒で埋まっていれば大丈夫です。
- まだ試していませんが、inpainting 的な使い方もできるかもしれません

{% endmediaRow %}

**出力例**

![入力](/media/basic-workflows/ltx-2-3/legacy_gyazo_676f9b4dfb10ea6bc80b25b46d3b63ef.mp4){media=loop} ![出力](/media/basic-workflows/ltx-2-3/legacy_gyazo_2776655edfe4896da1697755084b5e57.mp4){media=loop}

---

## ID-LoRA

参照画像 1 枚 + 短い参照音声 + テキストプロンプトから、その人がその場面でその内容を喋っている talking head 動画を生成します。

ボイスクローンで作った音声をあとから `audio-image2video` に流し込むのとは違い、ID-LoRA は音声と動画を同時に生成します。  
そのため、口の動きや声の雰囲気も含めて、より一体感のある映像になりやすいです。


### モデルのダウンロード

- [LTX-2.3-ID-LoRA-CelebVHQ-3K.safetensors](https://huggingface.co/AviadDahan/LTX-2.3-ID-LoRA-CelebVHQ-3K/blob/main/lora_weights.safetensors) (1.16 GB)
- [LTX-2.3-ID-LoRA-TalkVid-3K.safetensors](https://huggingface.co/AviadDahan/LTX-2.3-ID-LoRA-TalkVid-3K/blob/main/lora_weights.safetensors) (1.16 GB)
> 配布ファイル名はどちらも `lora_weights.safetensors` です。  
> 分かりにくいので、それぞれ `LTX-2.3-ID-LoRA-CelebVHQ-3K.safetensors` / `LTX-2.3-ID-LoRA-TalkVid-3K.safetensors` にリネームしておくと扱いやすいです。

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── LTX-2.3-ID-LoRA-CelebVHQ-3K.safetensors
        └── LTX-2.3-ID-LoRA-TalkVid-3K.safetensors
```

### workflow

![](/media/basic-workflows/ltx-2-3/legacy_gyazo_cd8a2899358fbac24b90eebe9b10a823.png){media=image}

[](/workflows/basic-workflows/ltx-2-3/ltx_2_3_id_lora_distilled_3stage.json)


全体のベースは [image2video](#image2video) です。  
そこに、ID-LoRA 用の LoRA と参照音声条件を追加します。

{% mediaRow img="/media/basic-workflows/ltx-2-3/legacy_gyazo_cb84a0967e26e916925aaa4cfeb6d782.png {media=image}", width=40, align="left" %}

**ID-LoRA モデル**

ID-LoRAを読み込みます。

- LTX-2.3-ID-LoRA-CelebVHQ-3K
- LTX-2.3-ID-LoRA-TalkVid-3K

二種類ありますが、データセットが違うだけで仕組みとしては同じものです。  
さほど違いはありませんが、両方使ってみて相性の良い方を見つけてみてください。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2-3/legacy_gyazo_3a653c109b828ad561e428c09b8eb91f.png {media=image}", width=40, align="left" %}

**LTXV Reference Audio (ID-LoRA)**

ID-LoRAと参照音声をつなぎます。

- 参照音声には、5秒程度にトリムしたものを使います。
- あくまで参照するだけなので、生成する動画の長さとは関係ありません。

{% endmediaRow %}

{% mediaRow img="/media/basic-workflows/ltx-2-3/legacy_gyazo_c987355bbbd29dfdc866dee769937957.png {media=image}", width=40, align="left" %}

**プロンプト**

プロンプト形式は決まっているので、これに従って書きます。
- cf. [ID-LoRA/📝 Prompt Format](https://github.com/ID-LoRA/ID-LoRA/tree/main?tab=readme-ov-file#-prompt-format)

```text
[VISUAL]: 場面描写および登場人物の見た目
[SPEECH]: 登場人物のセリフ
[SOUNDS]: 演者のしゃべり方 + 環境音/周囲の音
```

- ナレーションのように声だけ乗る形にならないよう、人物が実際に喋っていることも `[VISUAL]` に書いておくと安定しやすいです

{% endmediaRow %}


**出力例**

![input](/media/basic-workflows/ltx-2-3/legacy_gyazo_7d7fa9dc9a9f4fa1a08e25aff1285fd7.jpg){media=image} ![ref_audio](/media/basic-workflows/ltx-2-3/legacy_gyazo_921d5546567ae28fc9616803f0dcccb9.mp4){media=player}  ![output](/media/basic-workflows/ltx-2-3/legacy_gyazo_f179f159e0f3cf6fb05cf259b2828425.mp4){media=player}

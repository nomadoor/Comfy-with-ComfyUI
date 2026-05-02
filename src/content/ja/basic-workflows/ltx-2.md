---
layout: page.njk
lang: ja
section: basic-workflows
slug: ltx-2
navId: ltx-2
title: "LTX-2"
created: 2026-01-10
updated: 2026-04-13
summary: "LTX-2でtext2video / image2video / audio2videoを扱う"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/2a89cce32669413fb7f5b3fe4ca22960.mp4"
tags: []
---

## LTX-2とは？

**[LTX-2](https://website.ltx.video/blog/introducing-ltx-2)** は、Lightricks が公開している、音声と動画を同時に生成できる拡散モデルです。

> 現在は、後継モデルとして [LTX-2.3](/ja/basic-workflows/ltx-2-3/) が登場しています。  
> アーキテクチャは同じなので、こちらで仕組みを学びつつ、実際に生成するなら新しいモデルを使うのがおすすめです。

---

## 推奨設定値

- 解像度
  - 640×640（1:1）
  - 768×512（3:2）
  - 704×512（4:3）
  - ※後処理で2倍にアップスケールするので、実際の出力は1280×1280になります
  - ※32の倍数である必要があります
- FPS
  - 24 / 25 / 30
- フレーム
  - 最大：257 frames（25fpsで約10秒）
  - 推奨：121–161（品質とメモリのバランス）
  - ※8n+1 になる必要があります

---

## モデルのダウンロード

- checkpoints（VAE同梱）

  - [ltx-2-19b-dev-fp8.safetensors](https://huggingface.co/Lightricks/LTX-2/blob/main/ltx-2-19b-dev-fp8.safetensors)
- latent_upscale_models

  - [ltx-2-spatial-upscaler-x2-1.0.safetensors](https://huggingface.co/Lightricks/LTX-2/blob/main/ltx-2-spatial-upscaler-x2-1.0.safetensors)
- loras

  - [ltx-2-19b-distilled-lora-384.safetensors](https://huggingface.co/Lightricks/LTX-2/blob/main/ltx-2-19b-distilled-lora-384.safetensors)
- text_encoders

  - [gemma_3_12B_it_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/ltx-2/blob/main/split_files/text_encoders/gemma_3_12B_it_fp8_scaled.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── ltx-2-19b-dev-fp8.safetensors
    ├── 📂latent_upscale_models/
    │   └── ltx-2-spatial-upscaler-x2-1.0.safetensors
    ├── 📂loras/
    │   └── ltx-2-19b-distilled-lora-384.safetensors
    └── 📂text_encoders/
        └── gemma_3_12B_it_fp8_scaled.safetensors
```

---

## 基本的な処理の流れ

![](https://gyazo.com/1884b40ee25bafb8476dd4df1256b026){gyazo=image}

Wan などに比べるとノード数が多いため複雑に感じるかもしれませんが、やっていることはこれだけです。

- 1. text2video + audio
  - まずベースとなる動画（音声も）を生成します。
- 2. Hires.fix（2段階目）
  - できた動画を 2 倍にアップスケールし、video2video でもう一度回してリファインします。
  - これをパスして直接デコードすることも出来ますが、品質的に、Hires.fixするのをオススメします。
- 3. デコード
  - 動画と音声を別々にデコードして出力します。

---

## text2video

![](https://gyazo.com/d9fa680727fd75aca39c94a865682c5a){gyazo=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/LTX-2_text2video_V2.json",
  "/workflows/basic-workflows/ltx-2/LTX-2_text2video.json"
%}

上で説明した基本的な処理に沿ってworkflowを組んでいきます。
- **1, 2, 3** が 1段目
- **4, 5** が Hires.fix
- **6** が デコード です

{% mediaRow img="https://gyazo.com/bf2e2fa5389b9bf397478a238d969be2 {gyazo=image}", width=40, align="left" %}


**1. 動画解像度・長さ・FPSの設定**

生成したい動画と音声のパラメータをここで決めます。

- `EmptyLTXVLatentVideo` / `LTXV Empty Latent Audio` に、解像度・フレーム数・FPS を入力します。
- [推奨設定値](/ja/basic-workflows/ltx-2/#推奨設定値) に従って設定してください。
- 🚨後処理で解像度を 2 倍にします。
  - つまり、ここに設定する解像度は、作りたい動画の **半分** の値にしてください。

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/e058d717d9255db19e0bb0c186950e42 {gyazo=image}", width=40, align="left" %}

**2. プロンプト**

LTXシリーズの特徴ですが、プロンプトは多少こだわらないと大した動画が作れません。

- とはいってもLLMの力を借りるほど細かいフォーマットが決まっているわけではありません。
- 小説を書くように、生成したい動画を記述してみてください。
- cf. [Prompting Guide for LTX-2](https://docs.ltx.video/open-source-model/usage-guides/prompting-guide)

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5b532a5acaab4738cccbb92c423ad3ec {gyazo=image}", width=40, align="left" %}

**3. サンプリング（1段目）**

見慣れた `KSampler` ではないので少し複雑に見えますが、基本は「ステップ数と CFG を決めてサンプリングする」だけです。

- この workflow では、20 steps / CFG 4.0 で 1段目を回しています。
- `LTXVScheduler` という専用スケジューラーを使っています。
  - 動きとしては`linear_quadratic`に似たものですが、あまり気にしなくて大丈夫です。
- LTX-2 は動画と音声を同時に扱うため、🟫`LTXVConcatAVLatent`で、動画 latent と音声 latent を 1 本にまとめます。

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/216eebb358b46faffd4f2a6062128352 {gyazo=image}", width=40, align="left" %}

**4. latent のアップスケール（x2）**

動画latentの解像度を二倍にアップスケールします。

- 専用のモデル (`ltx-2-spatial-upscaler-x2`)を使用します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/22271134a0909e979030ac2ce6e037ed {gyazo=image}", width=40, align="left" %}

**5. サンプリング（2段目 / video2video）**

アップスケール後の latent を 短いステップでリファインします。

- こちらでは4~8ステップで生成できるようになる `distilled-lora`を使用します。
  - 他のモデルでいうところの Lightning / Turbo のようなものだと考えてください。
  - この workflow では **3 steps** で回しています。
  - これに合わせて、CFGは `1.0` に変更します。
- `Manual Sigma` を使っているため少し分かりにくいですが、`Simple` 相当で考えるなら `denoise = 0.47` 前後に近い挙動です。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/801da41aa50410fb70b55eab18a8ab83 {gyazo=image}", width=40, align="left" %}

**6. デコード**

最後に、動画と音声をそれぞれデコードして書き出します。

- latent を動画用 / 音声用に分け、適切なVAEでデコードします。
- (VRAMに余裕が無いためTiled VAEを使っています。)

{% endmediaRow %}


## text2video 8ステップ

上ではHires.fixでのみ `distilled-lora` を使いましたが、1段目にも適用し、8ステップで高速に生成してみましょう。

![](https://gyazo.com/e9e4851525adda6c3aab20a9acb09582){gyazo=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/LTX-2_text2video_distilled_V2.json",
  "/workflows/basic-workflows/ltx-2/LTX-2_text2video_distilled.json"
%}

`distilled-lora`を適用するため、サンプリング設定をいくつか変更します。

- CFG : `1.0`
- scheduler : `Simple`
- steps : `8`


## 20ステップ / 8ステップ distilled-lora比較

![20ステップ](https://gyazo.com/d7457da890a04a168e0f82655c9a6392){gyazo=player} ![8ステップ(distilled-lora)](https://gyazo.com/1e20bd8fd074213736b0a7a2e3766be1){gyazo=player}

> 私が試した限りでは、distilled-lora を適用したほうが安定して生成できます。  
> そのため、速度アップを兼ねて以降のworkflowは全て **１段目からdistilled-loraを適用** していきます。

---

## image2video

### single-frame I2V

![](https://gyazo.com/a16d62da150521a5b0c96dc32bbea33b){gyazo=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/LTX-2_image2video_distilled_V2.json",
  "/workflows/basic-workflows/ltx-2/LTX-2_image2video_distilled.json"
%}

基本は「1フレーム目を入力画像で固定して、残りを生成」です。

例えば 121フレームの動画を作るなら、ざっくりこういう流れになります。

```text
(1) 121 frames の枠を作る（8n+1）
    [ 🌫️ 🌫️ 🌫️ 🌫️ 🌫️ ... 🌫️ ]

(2) 1フレーム目だけ入力画像で上書き
    [ 🖼️ 🌫️ 🌫️ 🌫️ 🌫️ ... 🌫️ ]

(3) 残りの120フレームを生成
    [ 🖼️ ✨ ✨ ✨ ✨ ... ✨ ]
```
🖼️ を起点に、後ろのフレーム（✨）が埋まっていくイメージです。

{% mediaRow img="https://gyazo.com/981d0f06afef7364fcbe2c10bc1428c1 {gyazo=image}", width=40, align="left" %}

**1. 入力画像のリサイズ（2系統作る）**

- まず、最終出力したい解像度に合わせた フル解像度版 を作ります。
  - 任意のサイズにリサイズ (ここでは1MP)。
  - 幅・高さは 64 の倍数にします。
    - 1段目は 1/2 解像度で回すため、半分にしても 32 の倍数になるように 64 の倍数にします。
- つぎに、1段目（半解像度）用に、上の画像を 縦横 1/2 にした版も作ります。
  - `EmptyLTXVLatentVideo` には、この 半解像度側の width/height を入力します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/4198b2a54986678bbcf735dda9c8cb79 {gyazo=image}", width=40, align="left" %}

**2. 画像の下処理**

LTX-Videoからの特徴ですが、動画は静止画と違い、少し圧縮されて劣化しているため、綺麗すぎる画像を使うと、全く動かない動画が生成されることがあります。
- これを回避するため、`LTXVPreprocess` でわざと動画の圧縮っぽく劣化させます。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/90c0a4dc550eb34a03a1a7ab100f866d {gyazo=image}", width=40, align="left" %}

**3. LTXVImgToVideoInplace（1段目の差し込み）**

ここが image2video の本体です。

- 1段目（半解像度）の video latent に対して、1フレーム目を画像で差し込みます。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2a0c109b88debb478cf1d66f4a0b2f57 {gyazo=image}", width=40, align="left" %}

**4. アップスケール側（2段目）にも同じことをする**

2段目も同様に画像を差し込みます。

- 必ずspatialノードの **あと** にこのノードを接続してください。
- strengthは `1.0` にします。
  - これを小さくすると、差し込んだ画像自体も image2image されるような挙動になります。
  - 全体として馴染ませたいときはそれでも良いですが、　入力画像と1フレーム目を完全一致させたいなら `1.0` にします。


{% endmediaRow %}


**出力例**

![入力](https://gyazo.com/9e1e51a809c8838bb01c1258925c4e0e){gyazo=image} ![出力](https://gyazo.com/cdd2bcb62649ec744892c1615eae01d9){gyazo=player}

> 既知の問題として、ほとんど画面が動かなかったり、ズームアウトするだけの動画になることがあります。  
> 適切なプロンプトを使うことで多少マシになりますが、これを対策するための LoRA が登場したので紹介します。
>
> link + workflow : [LTX-2 Image2Video Adapter LoRa](https://scrapbox.io/work4ai/LTX-2_Image2Video_Adapter_LoRa)


---

### multi-frame I2V

先ほどの image2video workflow は、入力として **1枚の画像** だけでなく **画像バッチ（=動画）** も渡せます。  
これを応用すると、任意の動画の末尾を「のりしろ」にして、その先を延長する workflow が作れます。

![](https://gyazo.com/777521712af9329c1f8612710f00584a){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_Extension_distilled.json)

入力された動画の末尾数フレームを取得し、その続きを生成する、ということをします。

```text
(1) 入力動画（=画像バッチ）
    [ 🖼️ 🖼️ 🖼️ 🖼️  ... 🖼️ 🖼️ 🖼️ ]

(2) 末尾から N frames を取る（N = 8n+1）
    [ 🖼️ 🖼️ 🖼️ 🖼️... 🖼️ 🖼️ 🖼️ ]
                      └─── N ───┘

(3) 121 frames の枠を作り、先頭に N frames を上書きして入れる
    [ 🖼️ 🖼️ 🖼️ 🌫️ 🌫️ 🌫️ ... 🌫️ ]
      └── N ──┘     

(4) 残り（121 - N frames）を生成して続きを作る
    [ 🖼️ 🖼️ 🖼️ ✨ ✨ ✨ ... ✨ ]

(5) 先頭の N frames を削除（元動画末尾と重複するため）
    [ ✨ ✨ ✨ ... ✨ ]
    
(6) 元の動画 + 続きを結合
    [ 🖼️ 🖼️ 🖼️ ... 🖼️] + [ ✨ ✨ ✨ ... ✨ ]
```

{% mediaRow img="https://gyazo.com/5b0892af938467f9abf134e6dba73e87 {gyazo=image}", width=40, align="left" %}

**1. 末尾の画像バッチ取得**

入力動画の末尾から、のりしろとなる画像バッチを取得します。
- `Get Image or Mask Range From Batch` の `num_frames` に任意の枚数を入力します（8n+1 の縛りあり）。
- N を増やすほど元動画の動きや雰囲気を引き継ぎやすくなります。
- ただし、生成する区間は 121 - N frames になるので、N を増やすほど「続き」は短くなります。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/c87f00b6590f5b3b4b983dc204c99476 {gyazo=image}", width=40, align="left" %}

**2. 生成した動画と元の動画を結合**

生成結果には、先頭に「のりしろ（元動画末尾 N frames）」が含まれていますが、この部分は元動画と重複するので、結合前に削除します。
- 生成した動画の先頭 N frames を削除（この例では 25 frames）
- 元の動画の末尾に結合

{% endmediaRow %}

**出力例**

![入力](https://gyazo.com/4c2fdd21e0ff8bac1c572dc130753018){gyazo=loop} ![出力](https://gyazo.com/1bce09367191f5fc19297331b43bdbb1){gyazo=loop}


---

## audio2video

LTX-2 は「動画＋音声」を同時に扱うモデルなので、音声を入力として渡して 音に引っ張られた動画 を作る構成もできます。

![](https://gyazo.com/be5aaa842432ee760228eeed24a3636f){gyazo=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/LTX-2_audio2video_distilled_V2.json",
  "/workflows/basic-workflows/ltx-2/LTX-2_audio2video_distilled.json"
%}

- `Trim Audio Duration` で音声を適当な長さにトリミング
- 音声をエンコードして、`LTXVConcatAVLatent` に接続します。
- 二段目の `LTXVConcatAVLatent` にも接続します。
- 出力動画には、入力音声をそのまま使います（生成音声は使いません）。

> 🚨音声の長さが生成する動画の長さより **短い** 場合、音声条件が効きません。音と無関係な動画が生成されます。  
> 無音でもいいので生成する動画の長さより余計に長くしておく必要があります。

ここに `Set Latent Noise Mask` を使うworkflowも見かけますが、あってもなくても同じ結果になります。


**出力例**

![](https://gyazo.com/a4290b4a15307547b106f83ced77ae44){gyazo=player}

---

## audio-image2video

上２つを組み合わせることも出来ます。  
顔画像に喋っている音声を組み合わせれば、talking headのようなことも出来ます。やってみましょう。

![](https://gyazo.com/853b6d4b375b6ea1ef45f7697b71d369){gyazo=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/LTX-2_audio-image2video_distilled_V2.json",
  "/workflows/basic-workflows/ltx-2/LTX-2_audio-image2video_distilled.json"
%}

- audio2video / image2video この 2 つのworkflowを組み合わせるだけです。

**出力例**

![入力](https://gyazo.com/7bf65ca84f1583d324c0debeee85b616){gyazo=image} ![出力](https://gyazo.com/8cb2045b833bb0507d048bf9965cbf63){gyazo=player}

> 実はあまりセリフに動画が追従しなかったため、プロンプトにセリフを入れています。もっと良いworkflowがあるかもしれません。

---

## video2audio

audio2video の逆で、動画を入力して それに合う音（効果音や環境音） を生成することもできます。

> このタスクは安定しません。おそらく改良が必要です。

![](https://gyazo.com/62df52a54b4bfcf67f53429d6343d666){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_video2audio_distilled.json)


**出力例**

※音が大きいので注意してください。

![](https://gyazo.com/79db38d1a4e4f16317613bbb85cd37f7){gyazo=player}

---

## Temporal inpainting

時間方向の inpainting（＝動画の一部だけ作り直す）です。VACE Extensionのようなものですね。

![](https://gyazo.com/4f55cbb7932cdefc0d879c2c432ed224){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_temporal-inpainting_distilled.json)

基本は video2video です。  
動画のうち「作り直したい時間範囲」だけをマスクし、その区間だけを再生成してもらいます。

```text
(1) 入力動画（= 既存の video latent）
    [ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ 🖼️ ]

(2) 作り直したい区間を指定（start_time ~ end_time）
    例: 2.0s ~ 4.0s
    [ 🖼️ 🖼️ | 🖼️ 🖼️ 🖼️ | 🖼️ 🖼️ 🖼️ ]
             ^           ^
         start_time   end_time

(3) 指定区間だけマスクを立てる
    [   0    0 |  1   1   1 |  0   0   0  ]
               └─── Mask ───┘

(4) マスク区間だけ再生成
    [ 🖼️ 🖼️ | ✨ ✨ ✨ | 🖼️ 🖼️ 🖼️ ]
             └─ inpaint ─┘
```

> 仕組み上、二段階 workflow（低解像度 → Hires.fix）を組みにくいため、最初から 1.5MP で生成しています。

{% mediaRow img="https://gyazo.com/b8efdb1050318602e40897d0d181c77c {gyazo=image}", width=40, align="left" %}

**1. LTXVAudioVideoMask**

inpainting したい時間範囲を指定します。

- `video_fps`：基本的には入力動画と同じ fps にします
- `video_start_time` : inpainting 開始（秒）
- `video_end_time` : inpainting 終了（秒）
-  `audio_start_time` / `audio_end_time`：基本は video と同じにしますが、ずらすことで「音は保ったまま映像だけ編集」「映像は保ったまま音だけ編集」もできます
{% endmediaRow %}

**延長もできる**

`end_time` を 入力動画の長さより後ろに指定すると、はみ出した部分は新規生成され、結果として動画が延長されます。
例：入力が「2秒」なら
- 2.0s → 5.0s を作り直す（= 2秒以降を新規生成して延長する）
- `start_time = 2.0` / `end_time = 5.0`


**出力例**

![入力](https://gyazo.com/c460984d015f16a93523a37f70ff730a){gyazo=player} ![出力](https://gyazo.com/2ba5e11ee85ff39b50e44a3700cf8aa6){gyazo=player}


---

## IC-LoRA

IC-LoRA は、ポーズや深度マップ、エッジなどの 制御信号から動画を作ります。

### モデルのダウンロード

- loras
  - [ltx-2-19b-ic-lora-canny-control.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Canny-Control/blob/main/ltx-2-19b-ic-lora-canny-control.safetensors)
  - [ltx-2-19b-ic-lora-depth-control.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Depth-Control/blob/main/ltx-2-19b-ic-lora-depth-control.safetensors)
  - [ltx-2-19b-ic-lora-detailer.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Detailer/blob/main/ltx-2-19b-ic-lora-detailer.safetensors)
  - [ltx-2-19b-ic-lora-pose-control.safetensors](https://huggingface.co/Lightricks/LTX-2-19b-IC-LoRA-Pose-Control/blob/main/ltx-2-19b-ic-lora-pose-control.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── ltx-2-19b-ic-lora-canny-control.safetensors
        ├── ltx-2-19b-ic-lora-depth-control.safetensors
        ├── ltx-2-19b-ic-lora-detailer.safetensors
        └── ltx-2-19b-ic-lora-pose-control.safetensors
```

### IC-LoRA (Pose)


text2video の workflow をベースに、ControlNet のような制御用の動画入力を追加します。

![](https://gyazo.com/d520faa02e72245494eedeea79ebef20){gyazo=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Pose)_distilled_V2.json",
  "/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Pose)_distilled.json"
%}

{% mediaRow img="https://gyazo.com/5efc334e9408a80a1328d0dceeadb892 {gyazo=image}", width=40, align="left" %}

**1. 制御動画のリサイズ**

生成する動画と同じ比率・解像度に揃えます。

- 任意のサイズにリサイズ (ここでは1.5MP)。
- 幅・高さは 64 の倍数にします。
- `EmptyLTXVLatentVideo` に、 縦横 1/2 にした画像の width/height を入力します。


{% endmediaRow %}

{% mediaRow img="https://gyazo.com/95c6efb7ad89b70494e4db25c2b98121 {gyazo=image}", width=40, align="left" %}

**2. ポーズ画像の生成**

動画から棒人間の画像を作ります。

- OpenPose や DWPose でポーズを抽出

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2d140f1d0b0c6fa0fba818e535c04082 {gyazo=image}", width=40, align="left" %}

**3. LTXVAddGuide**

制御信号（ポーズ動画）を conditioning に入れます。

- `LTXVAddGuide` に、先ほど作ったポーズ動画を入力します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9049aa36e2220ea94aa0b1bd6f541c37 {gyazo=image}", width=40, align="left" %}

**4. IC-LoRAの適用**

IC-LoRA (今回はPose) を適用してサンプリングします。

- IC-LoRA は `strength = 1.0` を前提に設計されています。
- この workflow では 1段目のサンプリングだけ IC-LoRA を適用しています。
  - 2段目はリファインに専念させたほうがキレイな動画になります。

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/c30823a0376a9ff24e83b555cc55796f {gyazo=image}", width=40, align="left" %}

**5. LTXVCropGuides**

1段目が終わったあと、一度デコードしてみると分かりやすいんですが、生成した動画に先程作ったポーズ動画が混ざっています。

- 後半に注目 : [LTXVCropGuides前.mp4](https://gyazo.com/8c92e2b45a7d3f3ee98f6a3d0a3cc14b)

これがまさにIC-LoRAの仕組みですが、出力には不要なものなので、2段目に入る前に削除します。

- `LTXVCropGuides`は、latent / conditioning から 制御画像 を取り除くためのノードです。

{% endmediaRow %}

> ポーズ画像・IC-LoRAを、Canny / Depth へ変更すれば同じように使えます。  
> 注意点として、基本1種類の使用が推奨されています。(Pose と Depth を同時に適用したりするのは非推奨です。)


**出力例**

![入力](https://gyazo.com/a999fcd3eca5bcd0a3e89714be6d8074){gyazo=loop} ![出力](https://gyazo.com/35e6cc779d6d126973a46cac63c7dec9){gyazo=loop}

---

### IC-LoRA (Pose) + image2video
複数IC-LoRAを重ねることは出来ませんが、image2videoやaudio2videoと組み合わせることはできます。

![](https://gyazo.com/a65682de39d9ea5c9fe6003cdf27e892){gyazo=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Pose)_image2video_distilled_V2.json",
  "/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Pose)_image2video_distilled.json"
%}


やっていることは、上の IC-LoRA (Pose) と image2video を合体させただけです。

- 注意点として、`LTXVAddGuide` は `LTXVImgToVideoInplace` の **あと** に接続します。
  - 逆だと制御が効きません。
- これはあくまで image2video であり、VACE のような **reference2video ではありません**。
  - 入力画像は「1フレーム目として固定される画像」なので、ポーズ動画の1フレーム目と大きくズレると期待通りの動画になりません。
  - 事前に ControlNet や Qwen-Image-Edit などで「ポーズ1フレーム目に寄せた画像」を作りましょう。

**出力例**

![入力](https://gyazo.com/aed000bfabc8665e0fadb350ca72500b){gyazo=loop} ![出力](https://gyazo.com/0ec1dbf4cf746b021443ca341b6c019a){gyazo=loop}

---

### IC-LoRA (Detailer)

IC-LoRA (Detailer)は、低解像度の動画のディテールや質感を修復します。

**カスタムノードのインストール**

- [ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo)

- コアノードだけでも動かすこと自体はできますが、大きな解像度・長時間動画を扱うためにはカスタムノードが必要です。

![](https://gyazo.com/a366728b300f253233432d1c12239f8d){gyazo=image}

{% workflowPicker
  "!/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Detailer)_V2.json",
  "/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Detailer).json"
%}

基本は IC-LoRA(Detailer) を適用した video2video です。

- 🟦 先に、入力動画を 最終的に欲しいサイズ にリサイズします。
- `SamplerCustomAdvanced` の代わりに `🅛🅣🅧 LTXV Looping Sampler` を使います。
  - これは[Ultimate SD upscale](/ja/basic-workflows/ultimate-sd-upscale/)のように時間・空間をタイルに分けて処理するため、VRAM 節約をすることができます。
  - この workflow では 時間方向だけ タイリングしています。
- 蒸留LoRAを使っていませんが、3 ステップで生成します。

**出力例**

![入力](https://gyazo.com/aa14f25d1ad8e274a8de629f4666b1bd){gyazo=loop} ![出力](https://gyazo.com/ceb4d9d0ba0eec0b5379b63ec307460a){gyazo=loop}

---

## 参考

- [プロンプトガイド](https://ltx.io/model/model-blog/prompting-guide-for-ltx-2)
- [LTX-2公式Doc](https://docs.ltx.video/open-source-model/getting-started/overview)
- [Lightricks/ComfyUI-LTXVideo/example_workflows](https://github.com/Lightricks/ComfyUI-LTXVideo/tree/master/example_workflows)
- [Comfy.Org blog](https://blog.comfy.org/p/ltx-2-open-source-audio-video-ai)

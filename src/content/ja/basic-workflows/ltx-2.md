---
layout: page.njk
lang: ja
section: basic-workflows
slug: ltx-2
navId: ltx-2
title: "LTX-2"
summary: "LTX-2でtext2video / image2video / audio2videoを扱う"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/2a89cce32669413fb7f5b3fe4ca22960.mp4"
tags: []
---

## LTX-2とは？

**LTX-2** は、Lightricks が公開している 音声＋動画を同時に生成できる拡散モデルです。

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

  - [gemma_3_12B_it.safetensors](https://huggingface.co/Comfy-Org/ltx-2/blob/main/split_files/text_encoders/gemma_3_12B_it.safetensors)

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
        └── gemma_3_12B_it.safetensors
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

![](https://gyazo.com/b6df8e98ae7d7337f2f32a65a10661d3){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_text2video.json)

{% mediaRow img="https://gyazo.com/129febfcdbfc077bf36db4a6aa33fb19 {gyazo=image}", width=50, align="left" %}

**1. 動画解像度・長さ・FPSの設定**

生成したい動画と音声のパラメータをここで決めます。

- `EmptyLTXVLatentVideo` / `LTXV Empty Latent Audio` に、解像度・フレーム数・FPS を入力します。
- [推奨設定値](/ja/basic-workflows/ltx-2/#推奨設定値) に従って設定してください。
- 🚨後処理で解像度を 2 倍にします。
  - つまり、ここに設定する解像度は、作りたい動画の **半分** の値にしてください。

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/e058d717d9255db19e0bb0c186950e42 {gyazo=image}", width=50, align="left" %}

**2. プロンプト**

LTXシリーズの特徴ですが、プロンプトは多少こだわらないと大した動画が作れません。

- とはいってもLLMの力を借りるほど細かいフォーマットが決まっているわけではありません。
- 小説を書くように、生成したい動画を記述してみてください。
- cf. [Prompting Guide for LTX-2](https://docs.ltx.video/open-source-model/usage-guides/prompting-guide)

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/1385ab23c63b68656e24650d11f5f5a9 {gyazo=image}", width=50, align="left" %}

**3. サンプリング（1段目）**

見慣れた `KSampler` ではないので少し複雑に見えますが、基本は「ステップ数と CFG を決めてサンプリングする」だけです。

- この workflow では、20 steps / CFG 4.0 で 1段目を回しています。
- `LTXVScheduler` という専用スケジューラーを使っています。
  - 動きとしては`linear_quadratic`に似たものですが、あまり気にしなくて大丈夫です。
- LTX-2 は動画と音声を同時に扱うため、🟫`LTXVConcatAVLatent`で、動画 latent と音声 latent を 1 本にまとめます。

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/353e095a574e974a64cff4593f8bf907 {gyazo=image}", width=50, align="left" %}

**4. latent のアップスケール（x2）**

動画latentの解像度を二倍にアップスケールします。

- 専用のモデル (`ltx-2-spatial-upscaler-x2`)を使用します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5625337c055851450dd6dc0357891631 {gyazo=image}", width=50, align="left" %}

**5. サンプリング（2段目 / video2video）**

アップスケール後の latent を 短いステップでリファインします。

- こちらでは4~8ステップで生成できるようになる `distilled-lora`を使用します。
  - 他のモデルでいうところの Lightning / Turbo のようなものだと考えてください。
  - この workflow では **3 steps** で回しています。
  - これに合わせて、CFGは `1.0` に変更します。
- `Manual Sigma` を使っているため少し分かりにくいですが、`Simple` 相当で考えるなら `denoise = 0.47` 前後に近い挙動です。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/801da41aa50410fb70b55eab18a8ab83 {gyazo=image}", width=50, align="left" %}

**6. デコード**

最後に、動画と音声をそれぞれデコードして書き出します。

- latent を動画用 / 音声用に分け、適切なVAEでデコードします。
- (VRAMに余裕が無いためTiled VAEを使っています。)

{% endmediaRow %}



## text2video 8ステップ

上ではHires.fixでのみ `Distilled LoRA` を使いましたが、1段目にも適用し、8ステップで高速に生成してみましょう。

![](https://gyazo.com/aa18f5b7bb97ae164002fdef187f5790){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_text2video_distilled.json)

`distilled-lora`を適用するため、サンプリング設定をいくつか変更します。

- CFG : `1.0`
- scheduler : `Simple`
- steps : `8`

### 20ステップ / 8ステップ Distilled LoRA比較

![20ステップ](https://gyazo.com/decf4a825d56382d22b6c3a0fe549a64){gyazo=player} ![8ステップ(Distilled LoRA)](https://gyazo.com/05affbce361f48b4249a22b639a05e65){gyazo=player}

> 私が試した限りでは、distilled LoRA を適用したほうが安定して生成できます。  
> そのため、速度アップを兼ねて以降のworkflowは全て１段目からdistilled loraを適用していきます。

---

## image2video

![](https://gyazo.com/3ceb9e3b3fdbdf7e2187e709fe8022d7){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_image2video_distilled.json)


基本は「1フレーム目を入力画像で固定して、残りを生成」です。  
LTX-2 は 2段階（半解像度→x2アップスケール）なので、入力画像もそれに合わせて扱います。


{% mediaRow img="https://gyazo.com/e30bb042c1ba2960ecdf369bd8263fe5 {gyazo=image}", width=50, align="left" %}

**1. 入力画像のリサイズ（2系統作る）**

- まず、最終出力したい解像度に合わせた フル解像度版 を作ります。
  - 任意のサイズにリサイズ (ここでは1MP)。
  - 幅・高さは 32 の倍数にします。
- つぎに、1段目（半解像度）用に、上の画像を 縦横 1/2 にした版も作ります。
  - `EmptyLTXVLatentVideo` には、この 半解像度側の width/height を入力します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ee5118476eb8c7d581339c94943bd6f2 {gyazo=image}", width=50, align="left" %}

**2. 画像の下処理**

LTX-Videoからの特徴ですが、動画は静止画と違い、少し圧縮されて劣化しているため、綺麗すぎる画像を使うと、全く動かない動画が生成されることがあります。
- これを回避するため、`LTXVPreprocess` でわざと動画の圧縮っぽく劣化させます。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/90c0a4dc550eb34a03a1a7ab100f866d {gyazo=image}", width=50, align="left" %}

**3. LTXVImgToVideoInplace（1段目の差し込み）**

ここが image2video の本体です。

- 1段目（半解像度）の video latent に対して、1フレーム目を画像で差し込みます。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/0be31e6d4769cbdfdb1b13100bb14cfe {gyazo=image}", width=50, align="left" %}

**4. アップスケール側（2段目）にも同じことをする**

2段目も同様に画像を差し込みます。

- 必ずspatialノードの **あと** にこのノードを接続してください。
- strengthは `1.0` にします。
  - これを小さくすると、差し込んだ画像自体も image2image されるような挙動になります。
  - 全体として馴染ませたいときはそれでも良いですが、　入力画像と1フレーム目を完全一致させたいなら `1.0` にします。


{% endmediaRow %}


**出力例**

![入力](https://gyazo.com/9e1e51a809c8838bb01c1258925c4e0e){gyazo=image} ![出力](https://gyazo.com/f1878afbef8827ba5d6d70aee609c0e0){gyazo=player}

---

## audio2video

LTX-2 は「動画＋音声」を同時に扱うモデルなので、音声を入力として渡して 音に引っ張られた動画 を作る構成もできます。

![](https://gyazo.com/5f4301951dfc2a62f0feaec21aed425c){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_audio2video_distilled.json)

- `Trim Audio Duration` で音声を適当な長さにトリミング
- 音声をエンコードして、`LTXVConcatAVLatent` に接続します。
- 二段目の `LTXVConcatAVLatent` にも接続します。
- 入力音声をそのまま使います（生成音声は使いません）。

> 🚨音声の長さが生成する動画の長さより **短い** 場合、音声条件が効きません。音と無関係な動画が生成されます。  
> 無音でもいいので生成する動画の長さより余計に長くしておく必要があります。

ここに `Set Latent Noise Mask` を使うworkflowも見かけますが、あってもなくても同じ結果になります。


**出力例**

![](https://gyazo.com/69fdf6a78c1534e1b69bd0aa44677903){gyazo=player}

---

## audio-image2video

上２つを組み合わせることも出来ます。  
顔画像に喋っている音声を組み合わせれば、talking headのようなことも出来ます。やってみましょう。

![](https://gyazo.com/c07d99d56bef862ed590ea351e2d9b22){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_audio-image2video_distilled.json)

- audio2video / image2video この 2 つのworkflowを組み合わせるだけです。

**出力例**

![入力](https://gyazo.com/7bf65ca84f1583d324c0debeee85b616){gyazo=image} ![出力](https://gyazo.com/f614c8645cac991c9b9dd918baa8fd5c){gyazo=player}


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


text2videoをベースに制御動画を追加します。

![](https://gyazo.com/e87ed3c369e8e0ed2473bffac25ec966){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Pose)_distilled.json)

{% mediaRow img="https://gyazo.com/72c9389b8f7a9e2070b7b3eb407d8bbf {gyazo=image}", width=50, align="left" %}

**1. 制御動画のリサイズ**

生成する動画と同じ比率・解像度に揃えます。

- 任意のサイズにリサイズ (ここでは1MP)。
- 幅・高さは 32 の倍数にします。
- `EmptyLTXVLatentVideo` に、 縦横 1/2 にした画像の width/height を入力します。


{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2c5faecd7ec8b06281d445f3c8f643b4 {gyazo=image}", width=50, align="left" %}

**2. ポーズ画像の生成**

動画から棒人間の画像を作ります。

- OpenPose や DWPose でポーズを抽出

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2d140f1d0b0c6fa0fba818e535c04082 {gyazo=image}", width=50, align="left" %}

**3. LTXVAddGuide**

制御信号（ポーズ動画）を conditioning に入れます。

- `LTXVAddGuide` に、先ほど作ったポーズ動画を入力します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/9049aa36e2220ea94aa0b1bd6f541c37 {gyazo=image}", width=50, align="left" %}

**4. IC-LoRAの適用**

IC-LoRA (今回はPose) を適用してサンプリングします。

- IC-LoRA は `strength = 1.0` を前提に設計されています。
- この workflow では 1段目のサンプリングだけ IC-LoRA を適用しています。
  - 2段目はリファインに専念させたほうがキレイな動画になります。

{% endmediaRow %}


{% mediaRow img="https://gyazo.com/c30823a0376a9ff24e83b555cc55796f {gyazo=image}", width=50, align="left" %}

**5. LTXVCropGuides**

1段目が終わったあと、一度デコードしてみると分かりやすいんですが、生成した動画に先程作ったポーズ動画が混ざっています。

- 後半に注目 : [LTXVCropGuides前.mp4](https://gyazo.com/8c92e2b45a7d3f3ee98f6a3d0a3cc14b)

これがまさにIC-LoRAの仕組みですが、出力には不要なものなので、2段目に入る前に削除します。

- `LTXVCropGuides`は、latent / conditioning から 制御画像 を取り除くためのノードです。

{% endmediaRow %}

> ポーズ画像・IC-LoRAを、Canny / Depth へ変更すれば同じように使えます。  
> 注意点として、基本1種類の使用が推奨されています。(Pose と Depth を同時に適用したりするのは非推奨です。)


**出力例**

![](https://gyazo.com/ba07959b5807a8d7254255a30697f34b){gyazo=loop}

---

### IC-LoRA (Pose) + image2video
複数IC-LoRAを重ねることは出来ませんが、image2videoやaudio2videoと組み合わせることはできます。

![](https://gyazo.com/641c1ae330f7f684103aabe121d5edd1){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Pose)_image2video_distilled.json)

やっていることは、上の IC-LoRA (Pose) と image2video を合体させただけです。

- 注意点として、`LTXVAddGuide` は `LTXVImgToVideoInplace` の **あと** に接続します。
  - 逆だと制御が効きません。
- これはあくまで image2video であり、VACE のような **reference2video ではありません**。
  - 入力画像は「1フレーム目として固定される画像」なので、ポーズ動画の1フレーム目と大きくズレると期待通りの動画になりません。
  - 事前に ControlNet や Qwen-Image-Edit などで「ポーズ1フレーム目に寄せた画像」を作りましょう。

**出力例**

![](https://gyazo.com/f580b5e68fc33f5f34787fadcc01d36c){gyazo=loop}

---

### IC-LoRA (Detailer)

IC-LoRA (Detailer)は、低解像度の動画のディテールや質感を修復します。

**カスタムノードのインストール**

- [ComfyUI-LTXVideo](https://github.com/Lightricks/ComfyUI-LTXVideo)

- コアノードだけでも動かすこと自体はできますが、大きな解像度・長時間動画を扱うためにはカスタムノードが必要です。

![](https://gyazo.com/bfae276aad1df7f61c4ce1bf3a22d30f){gyazo=image}

[](/workflows/basic-workflows/ltx-2/LTX-2_IC-LoRA(Detailer).json)

基本は IC-LoRA(Detailer) を適用した video2video です。

- 🟦 先に、入力動画を 最終的に欲しいサイズ にリサイズします。
- `SamplerCustomAdvanced` の代わりに `🅛🅣🅧 LTXV Looping Sampler` を使います。
  - これは[Ultimate SD upscale](/ja/basic-workflows/ultimate-sd-upscale/)のように時間・空間をタイルに分けて処理するため、VRAM 節約をすることができます。
  - この workflow では 時間方向だけ タイリングしています。
- 蒸留LoRAを使っていませんが、3 ステップで生成します。

**出力例**

![入力](https://gyazo.com/aa14f25d1ad8e274a8de629f4666b1bd){gyazo=loop} ![出力](https://gyazo.com/98d208dc9e7c629fff9b060b1aa7bf76){gyazo=loop}

---

## 参考

- [プロンプトガイド](https://ltx.io/model/model-blog/prompting-guide-for-ltx-2)
- [LTX-2公式Doc](https://docs.ltx.video/open-source-model/getting-started/overview)
- [Lightricks/ComfyUI-LTXVideo/example_workflows](https://github.com/Lightricks/ComfyUI-LTXVideo/tree/master/example_workflows)
- [Comfy.Org blog](https://blog.comfy.org/p/ltx-2-open-source-audio-video-ai)


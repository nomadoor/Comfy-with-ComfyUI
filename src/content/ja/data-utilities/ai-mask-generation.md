---
layout: page.njk
lang: ja
section: data-utilities
slug: ai-mask-generation
navId: ai-mask-generation
title: "AIを使ったマスク生成"
summary: "マッティング、セグメンテーション、物体検出について"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/499c4756e1b2adb1424f9cab9829806b.png"
---

## AIを使ったマスク生成

inpaintingなどでマスクを作る場面は多いですが、毎回手書きをしたり、マスク画像を用意するのは大変です。なにより自動化できません。

そこで様々なAIを活用してマスクを自動生成してみましょう。

- **物体検出 (Detection)**
  - テキストなどの指示に従い、画像の中の物体を **バウンディングボックス (Bounding Box)** で検出します。
- **マッティング (Matting)**
  - **手前の景色** と **背後の景色** をグラデーションのあるマスク（Alpha Matte）で区切ります（ComfyUIではバイナリマスクになることも多いです）。
- **セグメンテーション (Segmentation)**
  - **「物体の形」** を白と黒のマスク（バイナリマスク）で抽出します。

---

## 必要なカスタムノード

これらを行う技術は多くの種類があり、それに従いカスタムノードも様々なものがあるのですが、ひとまず以下のものがあれば事足ります。

- **[1038lab/ComfyUI-RMBG](https://github.com/1038lab/ComfyUI-RMBG)**
  - マッティングからセグメンテーションまで、多くの技術に対応しており、使い勝手もよいです。
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
- **[ltdrdata/ComfyUI-Impact-Subpack](https://github.com/ltdrdata/ComfyUI-Impact-Subpack)**
  - Detailerという作業をするためのもので、単純にマスク生成として使うにはクセがあります。
- **[kijai/ComfyUI-Florence2](https://github.com/kijai/ComfyUI-Florence2)**
  - Florence2というMLLMを動かします。
- **[kijai/ComfyUI-segment-anything-2](https://github.com/kijai/ComfyUI-segment-anything-2)**
  - SAM 2というセグメンテーションモデルを動かすもので、Florence2とセットで使います。

---

## 物体検出 (Detection)

![](https://gyazo.com/1a10dcd7dcf8f72eee275a3d8484f882){gyazo=image}

その名の通り、画像内にある特定の物体の位置を特定することができ、BBOXと呼ばれる四角い範囲を出力します。

正確性・汎用性・速度、それぞれに特徴のある様々な技術が存在します。

### YOLO系

リアルタイムに物体を検出することを目的としている、超高速な検出技術です。

基本的には、検出したい物体の種類に対して一つのモデル（顔専用、手専用など）を作るため、モデルがなければ自分で作る必要がありますし、複数の種類を検出したい場合には不向きです。

![](https://gyazo.com/e8b4e05d42db0b613aee4467a8dca633){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Simple_Detector_(SEGS)-YOLO_face.json)

高速処理が必要な場合（顔検出など、特定の対象が決まっている場合）に適しています。

- **モデルの入手方法**: `ComfyUI Manager` → `Install Models` → YOLOで検索すると顔以外にも色々なYOLOモデルを見つけることができます。
- リンクは貼りませんが、CivitaiでAdetailerと探すとNSFWに特化したモデルも見つけることができます。

### Grounding DINO

テキストで指定した物体を検出し、BBOXを出力します。

YOLOとは違い、「white dog」「red car」など任意のテキストで物体を指定できるため使い勝手が良く、同時に複数の物体を検出することもできます。

Grounding DINO単体で動かすノードが無いため、下でセグメンテーションと組み合わせたworkflowを紹介します。

### Florence-2

Florence-2 は、画像を文章として理解できる 視覚言語モデルです。

キャプション生成など様々なことができますが、その中の一つに物体検出があります。

![](https://gyazo.com/eac97524bcdcb395cdd5172c3694da41){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2Run.json)

- **モデル**: あまり大きな違いは感じませんが、色々と試してみてください。モデルは自動でダウンロードされます。
- **プロンプト**: 検出したい物体を説明します。
- **task**: caption_to_phrase_grounding
- **output_mask_select**: 検出したものがいくつかある場合、どの出力を使うか選択します（空白の場合は全て出力されます）。

複雑な文章表現で対象を指定したい場合や、LLMの理解力を活用したい場合に適しています（ただし速度は遅いです）。

---

## マッティング (Matting)

「背景除去」という名前で提供されているサービスや機能の中身は基本的にこれと同じものです。

オブジェクトを指定することなどは出来ませんし、「背景」が一体どこのことを指すのか？はAIに委ねられているため、シンプルに背景除去したい場合や、前景と背景の境界がはっきりしている場合に使うのがいいでしょう。

### BiRefNet

おそらく最も使われているモデルです。速度・性能ともに申し分ないため、とりあえずこれを使えばよいでしょう。

![](https://gyazo.com/5ce4bac5b8c8dc13fbbb0468c44bf752){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/BiRefNet_Remove_Background_(RMBG).json)


- `Background` を `Alpha` にすると、アルファチャンネルが付加された透過画像が出力されます。
- **注意**: このときの出力は **RGBA** であるため、image2image等で使う場合、エラーが発生する可能性があります（[マスクとアルファチャンネル](/ja/data-utilities/mask-alpha/) 参照）。

アニメ画像が得意な ToonOut など、用途によって派生モデルがいくつかあります。色々試してみてください。

---

## セグメンテーション (Segmentation)

### SAM (Segment Anything Model)

現在最も有名なセグメンテーションモデルです。

「物の形」を熟知しており、写真内の車などをポイントやボックスで指定すると、その輪郭を正確に見つけてマスクにしてくれます。

![](https://gyazo.com/ae3a00df59eb97f8612b700ff90aac3b){gyazo=image}

これはポイントを押して、指定したオブジェクトをセグメンテーションする機能ですが、基本的には物体検出と組み合わせることが多いでしょう。

- 1. 画像系ノードを右クリック → `Open in SAM Detector`
- 2. 抽出したい物体を左クリックでポチポチと指定（除外したい範囲は右クリック）
- 3. `Detect` を押すとマスクが生成されます

> SAMは現在は開発が続けられており、初期/SAM 2/SAM 2.1/SAM3 があります。
>
> 最新版である SAM 3 は、ポイントやBBOXでの指示のみならず、テキスト指示にも対応しています。以下で改めて紹介しますが、正直、静止画のAIマスク生成はSAM 3だけで十分です。

### 服装・人体部位セグメンテーション

「上半身」「スカート」「顔」「髪」といった特定部位のセグメンテーションを行います。

![](https://gyazo.com/3221f2c1bfc5b2a0f4db328c820f5235){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Clothing_Segmentation_(RMBG).json)

- セグメンテーションしたいカテゴリを選択します。

着せ替え等のタスクで以前はよく使っていたのですが、現在は物体検出 + セグメンテーションのほうが汎用性が高く性能が良いかもしれません。


---

## 組み合わせる

物体検出とセグメンテーション、マッティングを組み合わせることで、より高精度なマスク生成が可能になります。

### YOLO × SAM

![](https://gyazo.com/2c1fb7ed9c7fcc6242e48b9e6e405c27){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/YOLO_face-SAM.json)

高速な顔検出（YOLO）とSAM(初期) の組み合わせです。

### Grounding DINO × SAM

![](https://gyazo.com/c7b4ed29a8dae26fb9c666b137091ab4){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Grounding_DINO_HQ-SAM.json)

Grounding DINO と SAMの改良版である HQ-SAM の組み合わせです。

テキストで対象を指定しつつ、高精度なマスクを生成出来るので、最も使われる組み合わせの一つです。

### Florence2 × SAM2

![](https://gyazo.com/677607c761c38defde753681398d6e1f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/Florence2_SAM2.1.json)

Florence2 と SAM2.1 の組み合わせです。

人や動物といった分かりやすい対象ならなんでも良いのですが、「サングラスをかけた男性」「木の下に寝転んだ猫」など複雑な条件で指定したいときは、このようなLLMベースのモデルが力を発揮します。

### SAM 3

![](https://gyazo.com/5ab4819ba05efd277c18ae27046f7f58){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/SAM3_Segmentation_(RMBG).json)

SAMの最新版で、テキスト指示にも対応しており、物体検出とセグメンテーションを一度に実行できます。

精度も性能も速度も優れているので、とりあえずこれを使いましょう(´ε｀ )

さらに複雑なことをしたい場合は、[Ltamann/ComfyUI-TBG-SAM3](https://github.com/Ltamann/ComfyUI-TBG-SAM3?tab=readme-ov-file) などのカスタムノードも試してみてください。

### SAM 3 × BiRefNet

![](https://gyazo.com/82c4c2d947a3ea9c98b46e05a05d542f){gyazo=image}

[](/workflows/data-utilities/ai-mask-generation/SAM3_BiRefNet.json)

セグメンテーションはそもそもオブジェクトを区別するものであり、精細な切り抜きに使うものではありません。

対して、マッティングは髪の毛のような微細なものや、ガラスのような半透明なものも扱えます。

これらを組み合わせることでお互いの能力をかけ合わせることができます。
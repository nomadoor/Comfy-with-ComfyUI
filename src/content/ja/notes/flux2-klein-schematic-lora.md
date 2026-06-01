---
layout: page.njk
lang: ja
section: notes
slug: flux2-klein-schematic-lora
navId: flux2-klein-schematic-lora
title: "FLUX.2 [klein] Schematic LoRA"
created: 2026-05-30
updated: 2026-06-01
noteTags: ["project", "flux-2-klein", "lora"]
summary: "FLUX.2 [klein] に CV タスク風の RGB 出力を学習させる"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/a0dc0970df98429dcf703e3ed095f6fa.png"
---

## 概要

![](https://gyazo.com/2bd9f7b01d61bea0658ba82a750f227e){gyazo=image}

画像生成モデルの事前知識を活用して、CV タスクに応用する研究はいくつもあります。代表的なものでいえば、[Marigold](https://arxiv.org/abs/2312.02145)、[Lotus-2](https://huggingface.co/papers/2512.01030)、[SDPose](https://tsliang.top/SDPose/) などです。

これらは事前学習済みの画像生成モデルを利用しているとはいえ、最終的にはそれぞれのタスク専用に設計されています。

しかし、指示ベース画像編集モデルが一般的になった現在、画像から深度推定やセグメンテーションを行うタスクを、大きな意味で **画像編集** として扱ってしまえば良いのではないか？という研究が発表されました。それが Google DeepMind の [Vision Banana](https://vision-banana.github.io/) です。

これにインスピレーションを受け、同じ方向のことが FLUX.2 [klein] でもできないか？と考えたのが今回の実験の動機です。

結果として SOTA 性能を出せたとは言えませんが、簡単な LoRA 学習だけでも、ローカルモデルで Vision Banana に近い方向の挙動を試せることを示せればと思います。

---

## タスク設定

Vision Banana では、主に depth / normal / segmentation が扱われています。

今回はそれとまったく同じタスク構成にはせず、ComfyUI / 画像生成コミュニティでなじみのある、いわゆる ControlNet Preprocessor 的な出力を中心に選出しました。

個人的にこれらのタスクを `image2schematic` と呼び、今回作成した LoRA にはすべて `schematic` という文字を含めています。

| task | output |
|---|---|
| relative depth | near = white / far = black |
| normal map | RGB normal map |
| pose body | OpenPose 風 body skeleton |
| pose full | body + hands + face |
| binary segmentation | visible region mask |
| amodal segmentation | occluded parts を含む mask |

### amodal segmentation

![](https://gyazo.com/a0cf18a91c6349d3d3002fe98453b723){gyazo=image}

この中で、amodal segmentation というタスクには聞き覚えのない方がいるかもしれません。

- 通常の segmentation は、対象の **見えている領域** だけをマスクします。
- amodal segmentation は、遮蔽物で隠れている部分も含め、対象全体の形を推定してマスクします。

たとえば鹿の手前を枝が遮っている場合、通常の segmentation では枝の後ろに隠れた部分は出力されません。  
一方で amodal segmentation では、枝で隠れた部分も含め、鹿全体をマスクとして出力します。

見えない部分を推定する必要があるため、これは単なる分類というより、生成に近いタスクです。  
逆にいえば、画像生成モデルが力を発揮しやすいタスクでもあるため、今回チャレンジしてみました。


### タスク別 LoRA 学習

当初はすべてのタスクをひとつの LoRA として学習させる予定でしたが、内部でタスクが混ざってしまい、プロンプトだけではうまく切り替えられませんでした。

そのため、今回は 1タスク 1LoRA の構成にしています。

---

## データセット

| task | positive | negative | total |
|---|---:|---:|---:|
| depth | 300 | 0 | 300 |
| normal | 300 | 0 | 300 |
| pose body | 300 | 30 | 330 |
| pose full | 300 | 30 | 330 |
| binary segmentation | 300 | 30 | 330 |
| amodal segmentation | 300 | 30 | 330 |


### Depth / Normal

Open Images から画像を取得し、Lotus-2 で teacher を作成。

- depth
  - relative depth
  - near = white
  - far = black
- normal
  - RGB normal map

depth と normal は同じ入力画像セットを使っています。


### Pose

人物画像を Open Images から取得し、DWPose で teacher を作成。

- pose body
- pose full

候補画像は目視レビューし、群衆や出力が明らかに崩れているものは除外しています。


### Amodal Segmentation

amodal segmentation は、対象物の見えている部分だけでなく、隠れている部分も含めて mask を作るタスクです。

既存データセット、およびこれを直接生成する teacher が手元になかったため、画像生成と画像編集を組み合わせて作成しました。

作成手順:

1. 明確な subject と、それを自然に隠す occluder が含まれる occlusion scene のプロンプトを GPT-5.5 で作成
2. Z-Image-Turbo で source image を生成
3. GPT-5.5 が source image を確認
4. FLUX.2 [klein] 9B image edit で occluder を除去
5. 除去後画像から target object を SAM 3.1 で segmentation
6. source image と complete-object mask をペア化
7. 目視によるレビュー
8. BiRefNet、および手動でのリファイン

mask は SAM 3.1 だけでは不安定だったため、ほとんどすべてを BiRefNet と手作業で修正しています。

本筋ではないですが、LLM に画像生成プロンプトを大量生成させると、

- 同じような対象物
- 同じような occluder
- 同じような構図

に寄ります。そのため、Open Images のランダム画像を inspiration として見せ、scene variation を増やしています。


### Binary Segmentation

amodal segmentation 用の source image を流用。

入力画像上で実際に見えている target object の領域を SAM 3.1 で segmentation し、手動でリファインしています。


### Negative Samples

pose / segmentation ともに、入力画像に対象が存在しない場合のハルシネーションが問題になります。

例えば、入力画像に猫がいないにもかかわらず `generate mask of the cat` のような指示を与えると、モデルが適当に猫の形のマスクを作ってしまうことがあります。

これに対処するため、all-black target の negative pair を一部追加しました。

- segmentation
  - 画像に存在しない target を指定した場合、all-black mask を返す
  - 例: cond 画像にキリンしか写っていない状態で、`cat` の amodal mask を要求する
- pose
  - 人物が写っていない入力画像では、all-black pose image を返す

ただし、今回の規模では明確な改善は確認できませんでした。特に pose では、むしろ学習を不安定にした可能性があります。

---

## 学習

[AI-Toolkit](https://github.com/ostris/ai-toolkit) で学習。

| item | value |
|---|---|
| base model | `black-forest-labs/FLUX.2-klein-base-9B` |
| architecture | `flux2_klein_9b` |
| LoRA rank | linear 32 / conv 16 |
| optimizer | `adamw8bit` |
| lr | `5e-5` |
| dtype | `bf16` |
| quantization | transformer / text encoder: `qfloat8` |
| batch size | 4 |
| text encoder | frozen |
| caption dropout | 0.05 |
| EMA | enabled |

解像度は、計算量を抑えるため基本的に 768 bucket を使用。

pose full のみ、顔や手の細部が重要になるため、768 / 1024 bucket を含めて学習しています。

100 step ごとに checkpoint を保存。  
ComfyUI で実際に動かして、良さそうな step を選びます。すべての LoRA で 2000〜2500 step ほどで収束しています。

---

## workflow

以下は、ComfyUI で使用するための workflow です。

注意として、FLUX.2 [klein] Base で学習した LoRA は、FLUX.2 [klein] Distilled モデルでは上手く動きません。Base モデルを使うか、Distilled と Base の差分 LoRA（[Klein 4B/9B Base to Turbo Lora](https://civitai.com/models/2324315/klein-4b9b-base-to-turbo-lora?modelVersionId=2617121)）を使用してください。

### モデルのダウンロード

ベースは [FLUX.2 [klein]](/ja/basic-workflows/flux-2-klein/) です。

- LoRA
  - [flux2-klein-schematic-relative-depth-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-relative-depth-lora.safetensors)
  - [flux2-klein-schematic-surface-normal-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-surface-normal-lora.safetensors)
  - [flux2-klein-schematic-body-pose-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-body-pose-lora.safetensors)
  - [flux2-klein-schematic-full-pose-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-full-pose-lora.safetensors)
  - [flux2-klein-schematic-binary-segmentation-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-binary-segmentation-lora.safetensors)
  - [flux2-klein-schematic-amodal-segmentation-lora.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-schematic-lora/blob/main/loras/flux2-klein-schematic-amodal-segmentation-lora.safetensors)

```text
📂ComfyUI/
└── 📂models/
    └── 📂loras/
        ├── flux2-klein-schematic-relative-depth-lora.safetensors
        ├── flux2-klein-schematic-surface-normal-lora.safetensors
        ├── flux2-klein-schematic-body-pose-lora.safetensors
        ├── flux2-klein-schematic-full-pose-lora.safetensors
        ├── flux2-klein-schematic-binary-segmentation-lora.safetensors
        └── flux2-klein-schematic-amodal-segmentation-lora.safetensors
```

### image edit Base

![](https://gyazo.com/596669219726f35c5106037b4fce9e38){gyazo=image}

[](/workflows/notes/flux2-klein-schematic-lora/Flux.2-klein-base-9b_image-edit.json)

---

## 実践テスト

### relative depth

```text
Generate a relative depth map of the input image.
```

| input | Depth Anything V2 | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/668960b4d9147ef1260a01957f93ce9a){gyazo=image} | ![](https://gyazo.com/20a4dcedf04be910c3dbf0830a34cd02){gyazo=image} | ![](https://gyazo.com/8d011d8f92dfaea759907a6430493d63){gyazo=image} |
| ![](https://gyazo.com/206992247684d3cc8540037dffe4b088){gyazo=image} | ![](https://gyazo.com/1b39fbf77eb003a1aa38ce800728eb58){gyazo=image} | ![](https://gyazo.com/6e27345a2ecf071e40671ca000fd84f9){gyazo=image} |
| ![](https://gyazo.com/0ec98b233b467a27a1ac497d2ccf02f9){gyazo=image} | ![](https://gyazo.com/7b1501385098f7cc43354a257739a069){gyazo=image} | ![](https://gyazo.com/ef6402a1b2562118d88f6c471e00bbc0){gyazo=image} |

### normal map

```text
Generate a surface normal map of the input image.
```

| input | Lotus-2 | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/b3a1684aefa305aacdc41d92ea4c3485){gyazo=image} | ![](https://gyazo.com/a75bc8fdb2794f16d264f8da33dcd7cc){gyazo=image} | ![](https://gyazo.com/a1def11da46b031feabe3f0e6b3f50a2){gyazo=image} |
| ![](https://gyazo.com/225d29e4318a97b1bfc378091cd06b0e){gyazo=image} | ![](https://gyazo.com/8cc65f987cd5dc9f277efbb242bc6a11){gyazo=image} | ![](https://gyazo.com/595aff620129e00f348fe4ebed8425c7){gyazo=image} |
| ![](https://gyazo.com/a3566d450ba6209c256f8c55293a428c){gyazo=image} | ![](https://gyazo.com/c2aa1322ad6e17b2b900762ac63f1ba8){gyazo=image} | ![](https://gyazo.com/9f1ea3ff029395ab2d6121c059a3bc3a){gyazo=image} |

### pose body

```text
Generate a body pose map of all visible people in the input image.
```

| input | DWPose | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/c3e372e31e394aec307a20fbb9b5fb73){gyazo=image} | ![](https://gyazo.com/5aa247ce618c608d195328483bd5f336){gyazo=image} | ![](https://gyazo.com/d503b1b89f9361c12d110e95dba909f0){gyazo=image} |
| ![](https://gyazo.com/9ee77ec890a84129011b3ef339576171){gyazo=image} | ![](https://gyazo.com/a4a31c41ec507aa59eb0430b0eb05fc3){gyazo=image} | ![](https://gyazo.com/b06ce32e1e60019e84844b5c885f0022){gyazo=image} |
| ![](https://gyazo.com/bd3bb102f39717b6bbfdae0cc68e96b5){gyazo=image} | ![](https://gyazo.com/5f949073e42723d6bef17932c8aa6139){gyazo=image} | ![](https://gyazo.com/5fcc24d235f0360e1284f32cf30fa9ff){gyazo=image} |

### pose full

```text
Generate a full pose map of all visible people in the input image.
```

| input | DWPose | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/c3e372e31e394aec307a20fbb9b5fb73){gyazo=image} | ![](https://gyazo.com/cd1c92e205f413cc144b2ec534a398d3){gyazo=image} | ![](https://gyazo.com/aec346f0e8592e8f946f8c2993491955){gyazo=image} |
| ![](https://gyazo.com/9ee77ec890a84129011b3ef339576171){gyazo=image} | ![](https://gyazo.com/90e9d09c619cbea9c8e788e7b4643616){gyazo=image} | ![](https://gyazo.com/ce5459cca85c4ec415e402d6ecf9da8f){gyazo=image} |
| ![](https://gyazo.com/bd3bb102f39717b6bbfdae0cc68e96b5){gyazo=image} | ![](https://gyazo.com/5f949073e42723d6bef17932c8aa6139){gyazo=image} | ![](https://gyazo.com/db7abedc5ea7431d831076ce4f58353c){gyazo=image} |

### binary segmentation

```text
Generate a binary segmentation mask of the stretcher in the input image.
Generate a binary segmentation mask of the tuna sushi in the input image.
Generate a binary segmentation mask of all jars in the input image.
```

| input | SAM 3.1 | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/38dd24bd0eec756210f300aa6bc22dbd){gyazo=image} | ![](https://gyazo.com/78f513b8690050f8085995e79a2bf16a){gyazo=image} | ![](https://gyazo.com/8a1faf3881821b454265ab60f7d97af0){gyazo=image} |
| ![](https://gyazo.com/ff1760a3c6943a2e4e666ec61e1b6eab){gyazo=image} | ![](https://gyazo.com/1abbfc37a68d8335a7f66b9bed7561c3){gyazo=image} | ![](https://gyazo.com/f2ecfb80e270561e7685dfa227855c84){gyazo=image} |
| ![](https://gyazo.com/5cc009a2cf9ed0da1a2ba74c12e1ec8c){gyazo=image} | ![](https://gyazo.com/a355a426888bd07b48efdf8ee3b6f7d7){gyazo=image} | ![](https://gyazo.com/61c49e77830d9ea82039b839cb18b38e){gyazo=image} |

### amodal segmentation

```text
Generate an amodal segmentation mask of the woman in the input image.
Generate an amodal segmentation mask of the bench in the input image.
Generate an amodal segmentation mask of the steam locomotive in the input image.
```

| input | SAM 3.1 visible mask | FLUX.2 [klein] LoRA |
|---|---|---|
| ![](https://gyazo.com/6b4da57f9c240ace62c66fe6c49c49f6){gyazo=image} | ![](https://gyazo.com/ab3b4dbd6acadbe89e038d121ba011c7){gyazo=image} | ![](https://gyazo.com/79f8e50117e8bbab8dcdfee43b5d75e3){gyazo=image} |
| ![](https://gyazo.com/3882219095ebaa6a3c148be2cd6c8cbc){gyazo=image} | ![](https://gyazo.com/34b8014d2efe1557b06403772c5c009d){gyazo=image} | ![](https://gyazo.com/fc9840c4f47858a7d52351694494c6c0){gyazo=image} |
| ![](https://gyazo.com/4a50a286d8870c218e6c792138983ff1){gyazo=image} | ![](https://gyazo.com/95c93284e620212e59cbf261b29f21eb){gyazo=image} | ![](https://gyazo.com/4a3159526479a1ac84b9ce1bc99262d7){gyazo=image} |

---

## 限界と課題

### Depth/Normal

teacher には Lotus-2 を使いましたが、Lotus-2 由来のノイズもそのまま学習してしまいます。

この手のタスクではよく行われるように、3D モデルを使った合成データも検討するべきでした。

余談ですが、Lotus-2 の前に DSINE で作った target 画像でも学習しました。DSINE は Lotus-2 に比べるとかなりのっぺりした Normal map を作成します。その結果、LoRA の出力も同じようにのっぺりしたものになりました。

teacher の質がそのまま LoRA の出力に出るため、データセット品質の重要性を改めて感じます。

### pose

そもそもの問題として、pose は今回のタスクの中ではもっとも RGB 画像での表現に向いていません。

OpenPose 風の画像として出力できても、そこから keypoint へ戻すのは簡単ではなく、実用上の扱いも難しくなります。また、色やボーン数が厳密に決まっているため、少しのブレでもかなり目立ちます。

それでも簡単に学習できるタスクだと思っていましたが、想像以上に崩れました。動物画像や非人物画像でのハルシネーションも防げていません。

### segmentation

テキストエンコーダである Qwen3 8B のプロンプト理解力に期待していましたが、期待ほどのコントロール性能は得られませんでした。

「〇〇の人物を削除して」のような指示には従える一方で、LoRA を適用して「〇〇の人物をセグメンテーションして」と指示すると、失敗したり、別の人物をセグメンテーションしたりします。

そのため、単純なプロンプト理解力だけの問題というより、データセットから segmentation タスクそのものをうまく理解できていない可能性があります。

細部の切り抜き精度についても、本当は matting に近い滑らかな境界を期待していましたが、現状は SAM 3.1 程度の粗さに留まっています。

### 全体

全体として、データセットの枚数が足りていません。

今回、amodal segmentation のデータセット作成が非常に重く、それに合わせて全タスクをおおむね 300 枚で揃えました。  
ただ、原因をきちんと切り分けるには、各タスク 2000〜3000 枚程度は必要だったように思います。

改善点が多く残っていますが、予算と時間を使いすぎてしまったため、ここで一度断念します。  
チャンスがあれば、より大きいデータセットで再度試したいですね。

---

## おわりに

品質はさておき、小規模な LoRA 学習だけでも、FLUX.2 [klein] に CV タスク風の RGB 出力をある程度学習させることはできました。

ただし、本質的に重要なのは「CV タスクができたかどうか」ではなく、**何を画像編集として扱うか** によって、画像編集モデルの使い道がまだかなり広がるという点です。

画像編集と聞くと、絵柄変換やオブジェクト除去がすぐに思い浮かびます。  
しかし、今回のような CV タスク風の出力や、独自の中間表現を作らせることも、広い意味では画像編集として扱えます。

絵を描くだけだった画像生成モデルが、少しずつ汎用的な視覚モデルに近づいていくように見えるのは、楽しいですね。

---

## 参考

- [Marigold: Repurposing Diffusion-Based Image Generators for Monocular Depth Estimation](https://arxiv.org/abs/2312.02145)
- [Lotus: Diffusion-based Visual Foundation Model for High-quality Dense Prediction](https://huggingface.co/papers/2409.18124)
- [Lotus-2: Advancing Geometric Dense Prediction with Powerful Image Generative Model](https://huggingface.co/papers/2512.01030)
- [Vision Banana: Image Generators are Generalist Vision Learners](https://arxiv.org/abs/2604.20329)
- [Vision Banana Project Page](https://vision-banana.github.io/)

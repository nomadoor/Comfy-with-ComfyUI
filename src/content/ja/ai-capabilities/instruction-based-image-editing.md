---
layout: page.njk
lang: ja
section: ai-capabilities
slug: instruction-based-image-editing
navId: instruction-based-image-editing
title: 指示ベース画像編集
summary: テキストで指示するだけで、さまざまな画像編集タスクをこなすモデル群
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
  image: ''
---
## 指示ベース画像編集とは？

画像とテキストの指示（必要なら参照画像も）を入力すると、その指示に従って画像を編集してくれるモデルを、このサイトでは **指示ベース画像編集モデル** と呼びます。  

以前は、

- 絵柄変換 → LoRA や IP-Adapter
- オブジェクト除去・置き換え → inpainting
- 着せ替え → 専用モデル

といった具合に、タスクごとに別々の技術や workflow を組む必要がありました。

指示ベース画像編集モデルは、こうしたタスクを **「全部テキスト指示でまとめて扱う」** 方向に進化させたものです。  
現在 SOTA である nano banana も、このカテゴリに入ります。

---

## 発展の歴史

指示ベース画像編集がどのように発展してきたか、大まかに流れを押さえておきましょう。

### InstructPix2Pix ― 指示で編集する発想の出発点

2023 年に発表された **InstructPix2Pix** により、「指示ベース画像編集」という道が開かれました。

![](https://gyazo.com/09fac2eec2d2fba279e9f4f185522964){gyazo=image} ![](https://gyazo.com/afbd89b61246690907e2bfde3bb0b8fa){gyazo=image}  
> Turn the car red

このモデルは「画像」と「それに対する編集指示テキスト」をペアで学習し、ユーザーの書いた指示に従って画像を編集することを目指したモデルです。

### DiT と In-Context 系

あとから発見されたことですが、Flux などの DiT 系モデルは、もともと **複数枚にわたって一貫性のある画像を作る能力** を持っていました。

この性質を編集に応用する枠組みが、**IC-LoRA / ACE++** です。

![](https://gyazo.com/4d84f2e35f1c7fe99a322d8ee3eaec43){gyazo=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/ACE_Plus_portrait_face-swap.json)

- 画像キャンバスの左側に「参照画像」を置く
- 右側をマスクして生成させる
- テキスト指示と組み合わせて「左側を見ながら右側を編集」させる

といった、いわゆる **横並べテクニック** を使うことで、特別なアダプタを介さずとも「参照画像の特徴を保持したまま編集できる」ことが示されました。

### 画像編集モデルの登場

その後、text2image モデルの派生として、**FLUX.1 Kontext**、**Qwen-Image-Edit**、**OmniGen** といった「画像編集」専用のモデルが登場し、「画像編集」が text2image とは別の一カテゴリとして扱われるようになってきました。

![](https://gyazo.com/5a7d5ddf5327f52ccc01acb5aae79a4a){gyazo=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/Flux.1_Kontext.json)

共通しているのは、入力画像の内容を理解し、テキスト指示に応じて「どこをどの程度変えるか」を調整する、といった編集タスクを、ひとつのモデルで（そこそこ）汎用に扱おうとしている点です。

### マルチリファレンス時代

初期の指示ベース画像編集は、「画像 1 枚」＋「テキスト指示」→ 編集結果という 1 入力画像前提でした。

**Qwen-Image-Edit-2509** や **Flux.2** 以降は、複数の参照画像を同時に扱う流れが強くなっています。

![](https://gyazo.com/16e9c96c73b02e72fd416d489b44de13){gyazo=image}

[](/workflows/ai-capabilities/instruction-based-image-editing/Qwen-Image-Edit-2509_object-swap.json)

- 画像 A：人物（Subject）
- 画像 B：服（着せ替え用）
- 画像 C：背景やスタイル

のように、複数リファレンスを「混ぜながら」編集できるようになり、Subject 転送、ID 転送、着せ替え、スタイル・ライティングの移植といったタスクと、指示ベース編集がかなり重なり始めています。

### 動画モデルベースの編集

もうひとつの流れとして、動画生成モデルを編集に転用する系統があります。**FramePack の 1 フレーム推論** や **ChronoEdit** などが代表的です。

考え方としては、動画モデルはそもそも「複数フレームの一貫性」を扱えるため、編集前と編集後を「短い動画」と見なしてしまえば、大きな変化も自然につなげられる、というものです。

![](https://gyazo.com/dbf2c60d457434bccb4428108bb31164){gyazo=image}
> この考え自体は古くからあり、私も AnimateDiff が主流だった時代に、いろんな表情をするキャラのアニメーションを作成し、キャラ差分を作る、といったことをしていました。

一貫性が強すぎて大きな変化をさせることが難しかったり、画像編集としては 1 枚しかいらないのに、動画として何十フレームも出力してしまうなど、まだ問題も多いですが、今後注目すべき技術だと思います。

---

## 指示ベース画像編集でできること

指示ベース画像編集モデルで扱えるタスクはかなり多いですが、このサイトでは個別のページで詳細を扱うので、ここではざっと名前だけを整理しておきます。

### 絵柄変換

画風やテイストを変えたり、「油絵風」「アニメ調に」などの変換を行います。

![](https://gyazo.com/9cb22fffbc3c4252d73d8126b551112c){gyazo=image} ![](https://gyazo.com/e1525d66b933d4a87fc5d4ee612ee7f0){gyazo=image}

### オブジェクト入れ替え

「このカップをマグカップに」「車をバイクに」などの差し替えを行います。

![](https://gyazo.com/53f14e6d461b52d124d1f269ebf9663e){gyazo=image} ![](https://gyazo.com/01ad4af4f435f48394b2a7a1af4bbd20){gyazo=image}

### オブジェクト除去

通行人や看板、ゴミなど「不要なもの」を消すタスクです。

![](https://gyazo.com/a573409de28653a2cf68d6d86bf3e17c){gyazo=image} ![](https://gyazo.com/b8d68c03b7ca8f9e7baece3700323ea9){gyazo=image}

### 背景変更

室内→海辺、昼→夜など、背景だけを変える編集です。

![](https://gyazo.com/e19dc759345f54e3115ca7518c5af7e7){gyazo=image} ![](https://gyazo.com/937a2c1d9fe5f071582c984fccf6063e){gyazo=image}

### テキスト編集

看板やパッケージの文字を変える、タイポグラフィを入れ替えるなどを行います。

![](https://gyazo.com/ac1594d861c1357dad7ed73d229ffef2){gyazo=image} ![](https://gyazo.com/c91c136c690e7a82c1f964b1659d370b){gyazo=image}

### カメラアングルの変更

「少し引きで」「ローアングルで」「横から見た構図で」など、構図寄りの変更を行います。

![](https://gyazo.com/eaea9d1804747fc905f3289ed6492d91){gyazo=image} ![](https://gyazo.com/ba1a72c2649068502251de53d04e1483){gyazo=image}

### 着せ替え

人物やキャラの服装を変えるタスクです。

![](https://gyazo.com/6c347851817bca776c29adb85120ad90){gyazo=image} ![](https://gyazo.com/8ab258d34095ebfe4c44f4df38daf7c0){gyazo=image}

### ControlNet 的生成

ControlNetは棒人間や深度マップといった条件 + テキストで画像生成するものでしたが、これは一種の「指示ベース画像編集」とみなせます。  
現在の指示ベース画像編集モデルは基本的なControlNet的画像生成を行えるように学習されています。

![](https://gyazo.com/25e1001b36c95236106af1cfb293444d){gyazo=image} ![](https://gyazo.com/cce6069cd28da9b8ea71dc546cc6e0c4){gyazo=image}

### 雑コラのリファイン

コラージュ画像（雑コラ）を作り、それを自然に見えるように「編集させる」タスクです。

![](https://gyazo.com/5771f27e35298b919e3f216847214e6f){gyazo=image}

- 自分で位置・大きさを決めてオブジェクトを貼り付ける
- その上で「自然な写真にして」「一枚絵として違和感がないように」と指示する

といった形で、直感的なレイアウト指定と指示ベース編集を組み合わせることができます。  
詳しくは「[雑コラのリファイン](/ja/ai-capabilities/collage-refine/)」のページで扱います。

### 落書きでの指示

「矢印の方向に顔も向かせて」「この赤丸の場所にバスを置いて」など、ラフな描き込みとテキストを組み合わせて指示を行います。  

![](https://gyazo.com/378ec283b1acabfe3bc9af5fc02b013f){gyazo=image} ![](https://gyazo.com/3275c49767be7cf8487af00a41a9cc52){gyazo=image}

指示ベース画像編集の弱点は、テキストだけでは具体的な位置や変化量を表現しづらいことです。  
プロデューサーがデザイナーにペンで指示をするように、AI に対しても「ペンで指示できる」ようになれば理想的です。

オープンソースモデルでこれを十分に行えるものはまだ多くありませんが、完成すれば理想的な AI との協業 UI/UX になるでしょう。

## LoRA を作りやすい

学習環境を整えてくれているコミュニティのおかげで、比較的簡単に編集用 LoRA を作ることができます。

自分のイラストの絵柄に変換させるようなLoRAなら、編集前画像と編集後画像のペアを10枚ほど用意すれば、ある程度のクオリティのLoRAができます。

「雑コラのリファイン」なんかはまさにそうですが、なにを「画像編集」とみなすか？は実のところかなり自由度の高い問いです。  
まだ見つかっていない革新的な編集があるかもしれません。ぜひチャレンジしてみてください！

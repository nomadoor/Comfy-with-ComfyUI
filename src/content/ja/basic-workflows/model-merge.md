---
layout: page.njk
lang: ja
section: basic-workflows
slug: model-merge
navId: model-merge
title: "モデルのマージと差分LoRA"
summary: "チェックポイントやLoRAをマージして新しいモデルや差分LoRAを作る方法"
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
 image: "https://i.gyazo.com/60a8e4bd6e8b13d321cab6372e363baa.png"
tags: []
---

## モデルのマージとは？

新しいチェックポイントモデルを用意する方法は、おおざっぱに次の3つに分けられます。

- 0から学習する
- 既存モデルを追加学習する（ファインチューニング / LoRA など）
- **既存モデル同士を混ぜる (マージ)**

上2つは専門知識やデータセットの準備が大変ですが、3つ目の「マージ」は、ComfyUI 上で簡単に行うことが出来ます。

---

## チェックポイントを 50:50 で混ぜる

まずはシンプルに2つのモデルを半々に混ぜてみましょう。

![](https://gyazo.com/152fa7235f2878021cd924594b2d2bf1){gyazo=image}

[](/workflows/basic-workflows/model-merge/ModelMergeSimple_0.5.json)

この workflow では、`ModelMergeSimple` ノードを使って 2 つのチェックポイントを 1:1 でマージしています。

- 🟩 `ModelMergeSimple` は 2 つの `MODEL` 入力を受け取り、指定した比率で重みを線形補間した新しいモデルを出力します。
  - `ratio=0.5` のとき、「モデルAとモデルBを半分ずつ混ぜたもの」と考えてよいです。
- 出力された `MODEL` をそのまま `KSampler` に繋げれば、中間モデルを簡単に試せます。
  - 雑にアニメ系とリアル系を混ぜただけですが、2.5次元のような表現が出来ているのには驚かされますね。

![](https://gyazo.com/89e876767a48d9acd6c6bb684e6b2495){gyazo=image}

[](/workflows/basic-workflows/model-merge/50-50-save.json)

- マージ結果が気に入ったら、`CheckpointSave` ノードにつないでチェックポイントとして保存します。(上のworkflowではバイパスしています。)
  - 保存先はデフォルトでは `ComfyUI/output/checkpoints/`（Windows ポータブル版の標準設定）です。

---

## モデルマージの弱点

2つのモデルを混ぜても、パラメータの数自体は「モデル一つ分」のままです。
何か新しい力を足している一方で、その分だけ元の得意分野の表現力は削られている、と考えることもできます。

キャラを描くのが得意なモデルと、風景を描くのが得意なモデルを半分ずつ混ぜると、キャラも背景もどっちつかずなモデルが出来ることになります。

これではあまり役に立たなさそうですね…
なにか良い方法はないでしょうか？

---

## 階層マージ

Stable Diffusion の「ノイズから画像を復元する本体」は U 字の形をしたネットワーク「U-Net」というものです。
これは階段状になっているのですが、いくつかの研究から、層毎に役割が違うらしいということが分かっています。(cf. [P+](https://prompt-plus.github.io/))

- 浅い層 … テクスチャ・色・細かいパターン寄り
- 深い層 … 形・構図・レイアウト寄り

ということは、モデルBの色味だけ欲しいときは、浅い層のみをモデル B 寄りにマージすれば良さそうです。
これが階層マージの仕組みです。

![](https://gyazo.com/380e98b86fa2205099cf6f231fc32ac8){gyazo=image}

[](/workflows/basic-workflows/model-merge/ModelMergeBlocks_out_0.5.json)

ComfyUI の標準ノード `ModelMergeBlocks` は、U-Net 全体を大まかに **IN / MID / OUT の3ブロック**に分けて比率を指定できます。

- `IN` … 入力側のブロック（比較的浅い層）
- `MID` … 真ん中のボトルネック付近
- `OUT` … 出力側のブロック（比較的深い層）

実際にはUNetは何十階層もあり、コミュニティの研究により、どの層が何に影響しそうか？というのは大体分かってきています。

ComfyUIには、`ModelMergeSD1`/`ModelMergeSDXL`といった、一層ずつ比率を調整できるノードもあります。が、これを使いこなすのは職人芸でしょう……

---

## LoRA のマージ

LoRA は「元のモデルにあとから足せる差分パッチ」のようなものなので、チェックポイント同士と同じく、LoRA 同士も足し合わせてマージできます。

それ以前に、LoRA を 1 個読み込んでいるだけでも、裏側では「ベースのチェックポイントに LoRA の差分を足し込んで、その場で合成モデルを作っている」ような挙動になっています。

つまり、checkpoint に LoRA を適用している時点で、我々はすでに広い意味での“マージっぽいこと”をずっとやっていたわけですね (*ﾟ∀ﾟ)

---

## 差分LoRA

ここまでの話は「モデル同士を混ぜて新しいチェックポイントを作る」方向でしたが、逆に**チェックポイントから「差分だけ」を LoRA として抜き出す**という発想もあります。

- ベースモデル `Base`（例：`v1-5-pruned`）
- カスタムチェックポイント `Base+X`（例：特定キャラや絵柄を学習済みのモデル）

このとき、`Base+X` はざっくり「ベース + 追加スタイルX」とみなせます。
ここから「X の部分だけ」を取り出して LoRA にしてしまう、というのが **差分LoRA** です。

- 1. `Base+X - Base = X (← LoRAにする差分)`
- 2. その差分を LoRA 形式に圧縮する

### workflow

![](https://gyazo.com/0b5930d9de58a61acd5bf63da5927634){gyazo=image}

[](/workflows/basic-workflows/model-merge/ModelMergeSubtract_Save-LoRA.json)

- 🟩 `ModelMergeSubtract`ノードの差分を取りたいモデルを入力します。
  - `model1 - model2` です。
- 🟨 上では使っていませんでしたが、テキストエンコーダの差分を取る`CLIPMergeSubtract`ノードというのもあります。
  - テキストエンコーダはかなりシビアなので悪化する可能性もあります。
- `Extract and Save Lora`ノードでLoRAとして保存します。
  - `rank`は大きければ大きいほど忠実に差分を保存しますが、その分モデルサイズは大きくなります。
  - 目安としては、スタイル差分なら 8〜32 あたり、かなり違うモデルからガッツリ差分を取りたいときは 64 以上、といった使い分けが多い印象です。
  - 抽出されたLoRAモデルは、`\ComfyUI\output\loras`に保存されています。

### 差分LoRAのテスト
![](https://gyazo.com/c499e4f0a683dc0ddd573312f6897dc8){gyazo=image}

[](/workflows/basic-workflows/model-merge/SD1.5_text2image_with_LoRA.json)

- 今回は差分が大きかったので、LoRAを適用しただけで完璧に再現できるわけではないですが、SD1.5ながら、それっぽい画像を生成できるようになっていますね。

---

## 参考リンク

- [ComfyUI Wiki/モデルマージングの例](https://comfyui-wiki.com/ja/workflows/model-merging)
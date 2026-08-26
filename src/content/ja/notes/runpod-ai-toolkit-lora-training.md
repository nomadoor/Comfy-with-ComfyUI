---
layout: page.njk
lang: ja
section: notes
slug: runpod-ai-toolkit-lora-training
navId: runpod-ai-toolkit-lora-training
title: "RunPod で AI Toolkit を動かす"
created: 2026-05-03
updated: 2026-08-26
noteTags: ["guide", "training", "runpod", "ai-toolkit", "lora"]
summary: "RunPod 上で AI Toolkit を起動し、LoRA 学習を実行するための流れ"
permalink: "/{{ lang }}/notes/{{ slug }}/"
---

## RunPod とは

[RunPod](https://www.runpod.io/) は、クラウド GPU の処理能力を短時間だけ借りられるサービスです。

同じようなサービスはいくつかありますが、価格と使いやすさのバランスが最も良いように思います。

モデルの学習は、ただ画像生成する場合に比べて、高い処理能力と VRAM が必要な上、数十分から数時間単位で GPU を動かし続けることになります。

簡単な LoRA を作るだけなら数百円でできるため、気軽に使ってみてください。

今回は、RunPod で AI Toolkit を起動し、作成した LoRA をダウンロードするまでの流れを紹介します。

> モデルごとの細かい学習設定やデータセットの作り方に関しては、それぞれ別記事で扱おうと思います。

---

## 全体の流れ

1. RunPod のアカウント作成・クレジットの購入
2. Pod を作る
3. AI Toolkit の画面を開く
4. Dataset をアップロードする
5. Job を作る
6. 学習を実行する
7. LoRA ファイルを回収する
8. Pod を止める

---

## 1. RunPod のアカウント作成・クレジットの購入

### アカウントを作る

![](https://gyazo.com/fa937b8adfc9a1e28e406645ada9b52b){gyazo=image}

[RunPod](https://www.runpod.io/) にアクセスし、`Sign Up` からアカウントを作成します。

### クレジットを購入する

RunPod は、先にクレジットを購入して使う形です。

LoRA の学習を試すだけなら、10ドルほどで十分です。

![](https://gyazo.com/f683db8baf406ed1aa79e5d348f1e406){gyazo=image}

- 右上の `+` ボタンをクリック
- $150以下にしたいときは `Other` を選択
- 金額を入力して `Go to Checkout` に進む

> 使う必要はないですが、私の紹介リンクです。ここから登録して 10 ドル以上のクレジットを買うと、少し追加でもらえます。
>
> [RunPod の紹介リンク](https://runpod.io?ref=ke9q7kqp)

---

## 2. Pod を作る

### Pod とは？

RunPod にはいくつかの機能がありますが、今回は **Pod** だけ分かれば大丈夫です。

Pod は、クラウド上にある、カスタムできるレンタル PC のようなものです。

どの GPU を使うか、どれくらいの容量を確保するかを選んで借りる、という形です。

今回は、AI Toolkit が使える Pod を作り、ブラウザから AI Toolkit の画面を開いて LoRA を学習します。

### Template を選ぶ

サイドバーから `Pods` を開き、`Deploy` をクリックします。

![](https://gyazo.com/c39356c905c1a2bf89d0fcf83451712d){gyazo=loop}

- `Search templates` で `AI Toolkit` を検索
- [AI Toolkit - ostris - ui - official](https://console.runpod.io/hub/template/ai-toolkit-ostris-ui-official?id=0fqzfjy6f3) を選択
  - AI Toolkit の作者である Ostris 氏が作ったテンプレートです。
  - 同名のテンプレートが数多く出てくるので気をつけてください。

Template を選んだら、`Set overrides` から設定を少しだけ変更します。

- `Environment Variables` を開く
- `AI_TOOLKIT_AUTH` の値を、自分だけが分かるパスワードに変更

> ここで設定した値は、AI Toolkit を開くときに使います。デフォルトのままだと、誰でも `password` で開けてしまうので、別の値を使いましょう。

### GPU を選ぶ

`Compute` の欄には、多くの GPU が並んでいます。

どれを選べばよいか迷ってしまいますが、まず見るべきなのは **VRAM** です。

VRAM が足りないと、学習中に `Out of Memory` が出て処理できません。

基本的には高い GPU のほうが学習も速くなりますが、料金が二倍でも、二倍速いわけではありません。おサイフと残り時間と相談ですね。

私がよく使うのは、RTX A5000 と A40 です。

| GPU | VRAM | メモ |
| --- | --- | --- |
| **RTX A5000** | 24GB | 安く使えるのが良いところです。ただし、台数が少なく、時間によっては空いていないことがあります。 |
| **A40** | 48GB | 48GB の VRAM を比較的安く使えます。24GB では足りないときはこちらを使います。 |

### Deploy Pod

あとは `Deploy Pod` をクリックすると、Pod が作成されます。

> この時点でクレジットの消費が始まります。データセットの準備などは前もって済ませておきましょう。

---

## 3. AI Toolkit の画面を開く

Pod が作られるまでしばらく時間がかかります。待ちましょう。

![](https://gyazo.com/952faa4188776b9cc626a5c2009422b3){gyazo=image}

Pod が準備できると、`🟢Ready` の表示になり、AI Toolkit を開くためのリンクが表示されます。

`HTTP Service` をクリックすれば、AI Toolkit が表示されるはずです。

![](https://gyazo.com/696fa9e2aa3260c51214fd4fc7c3af1a){gyazo=image}

パスワードが求められたら、先ほど `AI_TOOLKIT_AUTH` に設定した値を入力します。

ここからは大まかにですが、AI Toolkit でのモデル学習の流れを見ていきます。

---

## 4. Dataset をアップロードする

![](https://gyazo.com/d57274c9ba07002e7ee02b1b72a80499){gyazo=image}

学習に使う画像と caption file を AI Toolkit にアップロードします。

- `Dataset` タブを開く
- 右上の `New Dataset` をクリックする
- dataset の名前を付ける
- 画像と `.txt` ファイルをドラッグアンドドロップする

画像と、それに対応する caption file が読み込まれていれば OK です。

---

## 5. Job を作る

AI Toolkit では、Job と呼ばれる学習設定を作ってから、それを起動する、という流れで学習します。

ComfyUI でいう workflow のようなものですね。

![](https://gyazo.com/c8029171b590fcb71fc68188a2f5c8be){gyazo=image}

ここで、base model、学習率、先ほど読み込んだ dataset などを設定します。

設定が完了したら、右上の `Create Job` をクリック

学習前であれば、何度でも設定し直せます。

---

## 6. 学習を実行する

Job ができたら、学習を実行します。

![](https://gyazo.com/b06e6a6734de8d0dba21687c56604812){gyazo=image}

- 右上の実行ボタン（`▶`）をクリック

エラーが出ず、Progress bar が進んでいれば、基本的には上手く動いています。

学習は途中で停止して、再開することもできます。

停止したあとにパラメータを書き換え、再度実行することもできますが、パラメータによっては壊れるので、よく分からないうちは、0 からやり直したほうがよいでしょう。

---

## 7. LoRA ファイルを回収する

設定にもよりますが、AI Toolkit は学習中に定期的に LoRA を出力してくれます。

上手く学習できているかは、実際に ComfyUI などで生成してみるしかありません。Loss Graph は、正直あまり参考にならないのです。

![](https://gyazo.com/89e7eea124ea56af4a34bba8af083057){gyazo=image}

- `Checkpoints` の欄に出力された LoRA が並びます
- ダウンロードボタンをクリックして保存する

基本はこれで以上です。

> Pod を削除すると、アップロードした dataset や作成された LoRA も削除されます。必要なファイルは、忘れずにダウンロードしておきましょう。  
> 設定がすべて書かれた config file も、見返すために保存しておくとよいです。

---

## 8. Pod を止める

RunPod は起動している間、作業していなくても料金がかかります。

もったいないので、忘れずに止めましょう。

![](https://gyazo.com/f60fe312a59e9fe6624490c8004da78e){gyazo=image}

- RunPod の画面に戻る
- 動かしている Pod を開く
- `Stop` で Pod を止める
- 必要なファイルをすべて回収できていることを確認

`Stop` しただけでは、GPU の課金は止まりますが、Volume disk の storage 料金は残ります。

もう AI Toolkit を閉じてよければ、完全にシャットダウンする `Terminate` を行います。

![](https://gyazo.com/7142f88c43aa0b4b0281b6c6a1c064ad){gyazo=image}

- `Terminate` で Pod を削除する

---

## 具体的なモデルの学習

ここでは主に、RunPod から AI Toolkit を起動するまでの部分を解説しました。

具体的に AI Toolkit でモデルを学習する流れに関しては、以下の記事を参考にしてください。

- [AI Toolkit で SDXL（Illustrious）LoRA を学習する](/ja/notes/ai-toolkit-sdxl-lora-training/)

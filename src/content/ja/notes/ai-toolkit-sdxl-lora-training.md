---
layout: page.njk
lang: ja
section: notes
slug: ai-toolkit-sdxl-lora-training
navId: ai-toolkit-sdxl-lora-training
title: "AI Toolkit で SDXL（Illustrious）LoRA を学習する"
created: 2026-05-02
updated: 2026-05-02
noteTags: ["project", "lora", "sdxl", "ai-toolkit"]
summary: "AI Toolkit を使って、Illustrious 系 SDXL モデル向けのキャラ LoRA を学習する流れ"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/b0d3bb95931f32192df7619f612a202e.png"
---

## AI Toolkit で SDXL（Illustrious）LoRA を学習する

[AI Toolkit](https://github.com/ostris/ai-toolkit) を使って、SDXL 系モデル用の LoRA を学習します。

ここでは [WAI-illustrious-SDXL v16.0](https://civitai.com/models/827184/wai-illustrious-sdxl) を使いますが、SDXL 系モデルであれば同様の手順で学習できます。

また、今回は **キャラ LoRA** を作りますが、服装や絵柄 LoRA であっても基本の流れは同じです。

---

## データセットを準備する

LoRA 学習では、なによりもデータセットの質が重要です。丁寧に処理していきましょう。

### 1. 画像を集める

学習したい対象が分かりやすく写っている画像を集めます。

- 枚数よりも品質が重要です。なるべく高解像度な画像を集めてください
  - 今回は15枚で学習しますが、これより少なくても学習は可能です。

モデルは複数の画像の中から **共通する概念** を学習します。

できれば、同じ構図ばかりではなく、ポーズ・角度・背景にバラエティがあると良いですね。

### 2. 画像を軽く整える

対象が小さすぎるときや、他に目立ちすぎるものがあったり、別のキャラが混じっていたりする画像は、軽くトリミングします。

ただし、対象だけを厳密に切り抜きすぎる必要はありません。

背景や別衣装などが少し混じっているほうが、「何がキャラクター本体で、何が状況なのか」を理解させられます。

### 3. キャプションを作る

画像1枚ごとに、同じファイル名のテキストファイルを作ります。

```text
images/
├── 0001.png
├── 0001.txt
├── 0002.png
├── 0002.txt
├── ...
├── 0020.png
└── 0020.txt
```

テキストファイルには、その画像を説明する文章 (**キャプション**) を書きます。

キャプションの書き方は主に **自然文** と **タグ形式** の2つがありますが、SDXL では基本的に単語をカンマ（`,`）区切りで並べるタグ形式で書きます。

### 4. キャプションの書き方

ミャクミャクさんの例を見ながら、キャプションの書き方を見ていきましょう。

![ミャクミャクさん](https://gyazo.com/0b39351c0a14cdf1e768d4cc64b9ac0c){gyazo=image}

画像を見てみると、様々な要素がありますね。

- パソコン
- 椅子
- たくさんの目
- 青い体
- 絵柄（今回は写真）
- ...

キャプションには、これらを全部は書きません。  
この中で書くのは **キャラそのものを定義する語以外** です。

モデルはその画像の中に共通していて、**テキストで説明されていないもの** を LoRA 側に寄せて学びます。

例えば上の画像に単にキャプションを書くと以下のようになります。

```text
mascot, sitting, indoors, office, desk, laptop, office chair, lanyard, id card, multiple eyes, smile, blue body, red appendages, plush, photo
```

ここからキャラ LoRA のために整理し、今回で言えばミャクミャクさんに関するものを消すと以下のようになります。

```text
sitting, indoors, office, desk, laptop, office chair, photo
```

最後に、このキャラを呼び出すためのトリガーワード（今回は `myakumyaku-san`）を先頭につけて、キャプションは完成です。

- トリガーワードに特別な決まりはありません。
- ただし、一般的すぎると別の概念と混ざることがあるため、固有名詞にしておくと良いでしょう

```text
myakumyaku-san, sitting, indoors, office, desk, laptop, office chair, photo
```

### 4.5 MLLM でキャプションを作る

最近の MLLM は性能が非常に良いので、キャプション作成を丸々任せてしまってもよいでしょう。

1. 画像を渡し、SDXL/Illustrious 系のキャプションを書かせる
2. キャラ本体を定義する語だけ消してもらう
3. 先頭にトリガーワードを入れる

[こちら](https://chatgpt.com/share/69c4c369-b4d4-83ab-95c4-ebf9ca5e6823)は ChatGPT でキャプションを作った例ですが、十分なクオリティです。

---

## AI Toolkit を起動する

Windows で試すなら、[AI-Toolkit-Easy-Install](https://github.com/Tavris1/AI-Toolkit-Easy-Install) を使うと楽です。

1. リポジトリからインストーラーをダウンロードする
2. 解凍する
3. `AI-Toolkit-Easy-Install.bat` を実行する
4. インストール後、`Start-AI-Toolkit.bat` で起動する

Runpod で学習を行う場合は、こちらで解説しています。

- [WIP]

---

## Dataset を読み込む

AI Toolkit を起動したら、まず Dataset を読み込みます。

![](https://gyazo.com/8e7d24641bb2491bca6ad449bddcaa69){gyazo=image}

1. `Dataset` タブを開く
2. 右上の `New Dataset` をクリックする
3. 適当な名前でフォルダを作成
4. `Add Images` から、画像とテキストをフォルダごと追加する

画像と、それに対応するキャプションが正しく読み込まれていれば OK です。

---

## Job を作る

AI Toolkit では、Job と呼ばれる学習設定を作ってから、それを起動する、という流れで学習します。

ComfyUI でいう workflow のようなものですね。

![](https://gyazo.com/b4ef7a58d34d67eb34963f61d1bc50c3){gyazo=image}

`+ New Job` を開き、各項目を設定します。

ひとまず、以下のパラメータを使ってみてください。

| 項目 | 値 |
| --- | --- |
| Model architecture | `SDXL` |
| Name or Path | `path\to\wai16.safetensors` |
| Linear Rank | `16` |
| Conv Rank | `8` |
| Save Every | `100` |
| Max Step Saves to Keep | `30` |
| Batch Size | `2` |
| Gradient Accumulation | `2` |
| Steps | `3000` |
| Learning Rate | `0.00007` |
| Resolutions | `512`, `768` |
| Disable Sampling | `on` |

各パラメータについて、少しだけ詳しく説明します。

### JOB

- **Training Name**
  - 好きな名前を付けます。
  - あとから見返すので、モデル名・対象・日付などが分かる名前にしておくと楽です。

- **Trigger Word**
  - キャプションを作ったときに、トリガーワードを入れていない場合は、ここに書くとまとめて挿入してくれます。
  - 最初から各 `.txt` に書いている場合は、空欄のままで構いません。

### MODEL

- **Model architecture**
  - 学習するモデルのアーキテクチャを指定します。
  - 今回は `SDXL` です。

- **Name or Path**
  - ベースにするモデルのパスを指定します。
  - 今回は [WAI-illustrious-SDXL](https://civitai.com/models/827184/wai-illustrious-sdxl) を想定しているので、ダウンロードし、その `.safetensors` への絶対パスを入力します。
  - 例: `path\to\wai16.safetensors`

### TARGET

ここは、LoRA モデルのサイズを決める項目です。

Rank を大きくすれば、より多くの情報を LoRA に入れられます。  
ただし、大きければ必ず良いわけではなく、余計なものまで覚えやすくなります。

キャラ LoRA なら、`16/8` くらいの小さめの Rank で十分です。

### SAVE

上手く LoRA が学習できているかというのは、実際に生成してみるしかありません。

そのため、学習している過程で定期的に LoRA を保存し、取り出します。

- **Save Every**
  - 何 step ごとに LoRA を保存するかを決めます。
  - 短めにしておくと、あとから良かった step を選びやすくなります。

- **Max Step Saves to Keep**
  - 保存しておく LoRA の数です。

たとえば 100 step ごとに保存して 3000 step まで学習すると、100 step、200 step、300 step……というように細かく LoRA が保存されます。

`Max Step Saves to Keep` が小さいと、古いものから捨てられてしまうので、ストレージに余裕があるなら大きな値を入れておきましょう。

### TRAINING

ここは、学習量と学習の進み方を決める項目です。

- **Batch Size / Gradient Accumulation**
  - Batch Size は、同時に何枚の画像を見ながら学習するか、という値です。
    - 1枚ずつ見るより、何枚か同時に見たほうが、共通点を見つけやすい気がしますよね。
    - LoRA 学習でも同じです。キャラ LoRA であれば実質バッチ `2` 〜 `4` を選ぶことが私は多いです。
  - Batch Size を上げると VRAM の使用量も増えます。
    - Gradient Accumulation はそのようなときに便利なもので、VRAM の使用量をあまり増やさずに実質的な Batch Size を上げることができます。
    - `Batch Size × Gradient Accumulation` が実質的なバッチ量です。

- **Steps**
  - 必要な step 数は、実際に学習してみないと分かりません。
  - あとから増やせるので、まずは 3000 くらいにしておきます。

- **Learning Rate**
  - 一般的には `0.00005` 〜 `0.0001` くらいから試します。
  - 値が大きいほど早く収束し、小さいほどゆっくり進みます。
  - ただし、ゆっくりなら必ず良いというものでもないので、最終的には出力結果を見ながら判断します。

余談ですが、`0.0001` を `1e-4` と表記することもあります。  
`1 × 10の -4乗` という意味ですね。

### DATASETS

- **Target Dataset**
  - 先ほど作った Dataset を選びます。

- **Resolutions**
  - どの解像度で画像を見せるかを決めます。内部で自動的にリサイズされます。
  - 高解像度の画像が多いなら大きい解像度も有利ですが、そのぶん学習時間は伸びます。
  - キャラ LoRA であれば、`512` と `768` だけでも十分です。

### SAMPLE

- **Disable Sampling**
  - AI Toolkit には学習中にサンプルを生成してくれる機能がありますが使いません。
  - ここで生成される画像と、ComfyUI で生成したときの画像は、同じシード値でも基本違います。
  - 基本的に ComfyUI で生成することが多いのであれば、実際に ComfyUI で LoRA を読み込んで生成したものを参考にしたほうが良いでしょう。


> 設定が終わったら、右上の `Create Job` をクリックします。

---

## 学習を開始する

Job を作っただけでは、まだ学習は始まりません。

Job 画面の右上にある `▶` ボタンを押すと学習が始まります。

---

## 学習結果を確認する

LoRA がちゃんと学習できているかは、実際に生成して確認するしかない…というのが持論です。

定期的に出力される LoRA をダウンロードして ComfyUI で生成してみましょう。

### LoRA をダウンロードする

![](https://gyazo.com/d3f7c198f0ffd434876eee7522f5387d){gyazo=image}

Job 画面右側の `Checkpoints` に、保存された LoRA が並びます。  
ダウンロードボタンから取得できます。

### どんなプロンプトで試すか

まずはトリガーワードを使った簡単なプロンプトを使って、キャラが出るか確認しましょう。

```text
myakumyaku-san, standing, simple background
```

キャラが出ればひとまず安心ですが、それだけでは良い LoRA とはいえません。

良い LoRA の条件は、**学習させようと思った概念だけを学習できている** ことです。

背景も一緒に学習してしまっていたり、学習データにあるポーズしか生成できない場合は、LoRA として十分な柔軟性があるとはいえません。

そのため次のように、学習画像にはないプロンプトを作って生成テストを行う必要があります。

- 違うポーズ
- 違う衣装
- 違う背景
- 違う構図
- 少し違う絵柄

学習画像に近い条件でだけ綺麗に出て、少し変えると崩れる場合は、まだ学習が足りていないか、そもそもうまくいっていない可能性があります。

データセットを見直したり、学習率を見直したりしましょう。

### ComfyUI でまとめて確認する

複数プロンプトをまとめて試すなら、`Create List` ノードを使うと便利です。

![](https://gyazo.com/88aed03eb70c3ada096a5e388c3cc245){gyazo=image}

[](/workflows/notes/ai-toolkit-sdxl-lora-training/SDXL_list.json)

- プロンプトを複数用意
- `Create List` に繋ぎ、それを `CLIP Text Encode` ノードに繋ぐ
- LoRA 以外の生成パラメータ（CFG、シード値など）は固定
- step 違いの LoRA を差し替えながら比較する

LoRA Strength は `0.8` 程度で上手く生成できるようにするのが一般的です。

---

## どこで止めるか

長く学習させれば必ず良くなるわけではありません。

やりすぎると過学習という状態になり、柔軟性がなくなってしまいます。

いろいろなプロンプトで生成してみて、ちょうど良い step を探しましょう。

弱くする分には LoRA Strength で調整できるため、ちょっと行き過ぎたかな？くらいで大丈夫です。

---

## Step ごとの生成例

今回のミャクミャクさん LoRA の生成例です。

今回でいえば 2700 step くらいが良さそうですね。

![800step](https://gyazo.com/c8739cbbb75ff09453c092c7e2612308){gyazo=image} ![1300step](https://gyazo.com/715f92faeca1d427be017153631582a8){gyazo=image} ![1800step](https://gyazo.com/266b39d5c9e8ec1d383e66af75ba2253){gyazo=image}

![2400step](https://gyazo.com/040467bfb8701ff106ecc1fe01545f75){gyazo=image} ![😎 2700step](https://gyazo.com/b0d3bb95931f32192df7619f612a202e){gyazo=image} ![3000step](https://gyazo.com/a0a4b53f690cc515e08103225f336adb){gyazo=image}

![3300step](https://gyazo.com/a90b8f3b293e75939c7dcfb26334ecd3){gyazo=image} ![3600step](https://gyazo.com/cf10d44f3c466e847754ed6dbe7f7bcc){gyazo=image} ![4000step](https://gyazo.com/708b9f6cc164cd85b65d35c56f0ceeb8){gyazo=image}

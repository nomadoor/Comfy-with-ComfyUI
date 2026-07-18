---
layout: page.njk
lang: ja
section: notes
slug: kura-krea2-lora-training
navId: kura-krea2-lora-training
title: "Kura で Krea 2 の LoRA を学習する"
created: 2026-07-13
updated: 2026-07-14
noteTags: ["project", "lora", "krea-2", "kura"]
summary: "Kura と AI エージェントを使って、Krea 2 のキャラクター LoRA を学習・比較する流れ"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/bd00a496f18c5ecb9925dd7f790ffc7d.png"
---

## Kura とは？

LoRA の学習は、どんなベースモデルやタスクであっても、データセットを作り、学習率や rank といったパラメータを決め、学習ソフトに投げる。基本的には、それだけです。

こう聞くとシンプルですが、大きく二つ、難しくしているものがあります。

- **学習ソフトごとに使い方が違う**
  - AI Toolkit、Musubi Tuner など、モデルによって使う学習ソフトが変わる
  - セットアップ、設定の書き方、実行方法、weight の保存場所もそれぞれ違う
- **最適なパラメータがわからない**
  - モデルやタスクによって、必要な画像枚数、学習率、rank、step 数が変わる
  - GPU に収まらない場合、どの設定を削るか考える必要がある

この二つを解決するため、AI エージェントに使わせる前提で作ったのが [Kura](https://github.com/nomadoor/Kura) です。

Kura は、大きく 3 つの要素で構成されています。

- 環境を作り、学習から weight の回収までを確実に行う **CLI**
- 過去の実験を記録する **ファイル**
- 過去の実験やモデルの知識をもとに、AI がパラメータを考えるための **Skill**

今の AI エージェントなら、ゼロから環境を作り、学習まで進めることもできるでしょう。ただ、それを毎回やるのはトークンの無駄ですし、なにより過去の実験を蓄積していく仕組みがありません。

LoRA 学習のためのショートカットを用意し、人間がデータセットとパラメータの調整に集中できるようにするためのハーネスが Kura なのです。

それでは、さっそく Krea 2 をベースに、キャラクター LoRA を作ってみましょう。

---

## データセットを準備する

### 画像を集める

LoRA 学習では、パラメータよりなによりデータセットの質がものをいいます。

学習したい対象が分かりやすく写っている画像を集めましょう。できれば、同じ構図ばかりではなく、ポーズ・角度・背景にバラエティがあると良いですね。

今回はオリジナルキャラクターの LoRA を作りますが、手元にあるのは自分で描いた数枚だけです。

![画像編集モデルでバリエーションを増やす](https://gyazo.com/2159c09bf30ffc9230b93e72a9b933f9){gyazo=image}

そんなときは、Nano Banana や ChatGPT Images 2.0 でバリエーションを増やしても良いでしょう。

実写の人物では品質が下がるかもしれませんが、特徴が分かりやすいキャラクターであれば、十分有効な方法です。

### キャプションを作る

キャプションとは、その画像に何が写っているのかを説明する文章です。

何をキャプションに書くかは、学習させたい内容によって変わります。細かく書いておけば良い、というわけではありません。

Viviさんの例を見ながら、**キャラクター LoRA** でのキャプションの書き方を見ていきましょう。

![ソファでくつろぐViviさん](https://gyazo.com/d74af5465c466791239a29516fa341c4){gyazo=image}

この画像には、様々な要素が含まれています。

- キャラクター固有の髪型・顔・衣装
- ポーズ
- 背景、家具
- イラストの絵柄

キャラクター LoRA の場合、キャラクター本体を説明する要素はキャプションから外し、それ以外の要素を書きます。

まず、画像に写っている要素をすべて書き出すと、以下のようになります。

```text
1girl, solo, reclining, couch, holding mug, pink hair, gradient hair, headphones, sweater, scarf, orange pants, purple boots, indoors, living room, pillow, blanket, floor lamp, window, cityscape, coffee table, books, potted plant
```

ここから Viviさんの髪型・顔・衣装など、キャラクター本体を説明する語を **消します**。

```text
reclining, couch, indoors, living room, pillow, blanket, floor lamp, window, cityscape, coffee table, books, potted plant
```

最後に、このキャラクターを呼び出すためのトリガーワード（今回は `Vivi`）を先頭につければ、キャプションは完成です。

```text
Vivi, reclining, couch, indoors, living room, pillow, blanket, floor lamp, window, cityscape, coffee table, books, potted plant
```

この一連の作業を AI に任せることもできます。以下は、ChatGPT にキャプションの作成を依頼した例です。

→ [ChatGPT で LoRA 学習用タグ作成](https://chatgpt.com/share/6a54dbe5-6bec-83e9-ae15-f6bb02972c59)

> 今回はキャラクター LoRA なので、キャラクター本体を説明する語を消しました。服装 LoRA なら服装、スタイル LoRA なら絵柄を説明する語を消します。

キャプションは、画像と同じ名前のテキストファイルに保存します。ファイル名は連番でなくても構いません。

```text
📂images/
├── 0001.png
├── 0001.txt
├── 0002.png
├── 0002.txt
├── ...
├── 0020.png
└── 0020.txt
```

---

## Kura をセットアップする

### 必要なもの

- **最初に必要**
  - [Git](https://git-scm.com/)
  - [uv](https://docs.astral.sh/uv/getting-started/installation/)
  - Codex、Claude Code などの AI エージェント
- **ローカルで学習する場合**
  - NVIDIA GPU
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **クラウドで学習する場合**
  - [RunPod](https://www.runpod.io/) アカウント

> WSL2 でローカル学習する場合は、Docker Desktop の `Settings → Resources → WSL Integration` を開き、Kura を動かす WSL ディストリビューション（例：`Ubuntu`）を有効にしてください。

### Kura をインストールする

1. `uv` をまだ入れていない場合は、先にインストールします。

    macOS / Linux：

    ```sh
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

    Windows PowerShell：

    ```powershell
    irm https://astral.sh/uv/install.ps1 | iex
    ```

2. ターミナルを開き、Kura を `git clone` します。

    ```sh
    git clone https://github.com/nomadoor/Kura.git
    cd Kura
    ```

3. Kura の初期セットアップをします。

    ```sh
    uv sync
    uv run kura init
    ```

    `kura init` を実行すると、`datasets/`、`runs/`、`workflows/`、`promptsets/`、`cache/`、`workspace.yaml` などが作られます。

### 必要な場合のみ環境変数を設定する

RunPod を使う場合や、Hugging Face で承認が必要なモデル（例：FLUX.2 [klein] 9B）を使う場合のみ設定します。

1. `.env.example` をコピーし、`.env.local` を作成します。

    ```sh
    cp .env.example .env.local
    ```

2. `.env.local` を開き、必要な値だけ入力します。

    ```text
    RUNPOD_API_KEY=<RunPodのAPI key>
    HF_TOKEN=<Hugging Faceのtoken>
    ```

- `RUNPOD_API_KEY`：RunPod で学習・生成する場合に使用します。[RunPod の Settings で API key を作成](https://docs.runpod.io/get-started/api-keys)してください。
- `HF_TOKEN`：Hugging Face で承認が必要なモデルを使う場合に使用します。[Hugging Face の Access Tokens](https://huggingface.co/settings/tokens)から取得できます。Krea 2 の学習では必要ありません。

`.env.local` は Kura のコマンドを実行すると自動で読み込まれます。

### AI エージェントを Kura から開く

Kura のフォルダを、AI エージェントの作業フォルダとして開きます。

- **Kura のフォルダに移動してから開く**

  ```sh
  cd path/to/Kura
  codex
  ```

- **別の場所から開く**

  `-C` で Kura のパスを指定します。

  ```sh
  codex -C /path/to/Kura
  ```

---

## AI と一緒に LoRA を学習する

ここからは、AI さんにも頑張ってもらいましょう。

### データセットを配置する

作成したデータセットは、Kura の `datasets/` 以下へ置きます。

```text
📂Kura/
└── 📂datasets/
    └── 📂character-lora/
        └── 📂images/
            ├── 001.png
            ├── 001.txt
            ├── 002.png
            ├── 002.txt
            └── ...
```

Kura では、このほかに `dataset.yaml` と `items.jsonl` を使ってデータセットの内容を記録します。この二つは AI が画像とキャプションを確認して作るため、自分で書く必要はありません。

### 作りたい LoRA を伝える

Kura を開いている AI エージェントへ、作りたい LoRA の詳細を伝えてください。

```text
datasets/character-lora の画像を使って、Krea 2 のキャラクター LoRA を作って。
```

![Codex](https://gyazo.com/c0869c902e2ae71682a0b8433c693fbf){gyazo=image}

Kura には、データセットの確認やパラメータ決めに使う Skill が用意されています。最初から細かいパラメータを指定する必要はありません。

もちろん、詳しい方は「`rank 16`、`learning rate 5e-5` を使って」と伝えてもいいですし、RunPod を使いたい場合は「RunPod で学習して」といえば OK です。

GUI と違い、必要な条件は会話しながら調整できます。

### 計画を確認して開始する

AI エージェントは、実際に学習を始める前に Kura で `plan` を作って見せてくれます。

<!-- TODO: 実際の run の plan 画面を追加 -->

`plan` には、次のような内容が表示されます。分かる範囲で確認してください。

- **学習内容**
  - 使用するモデルと学習 backend
  - データセットの枚数と解像度
  - LoRA の rank、learning rate、batch size
  - 学習 step 数と LoRA の保存間隔
- **実行環境**
  - ローカルまたは RunPod
  - 使用する GPU
  - モデルのダウンロード量と必要なストレージ
  - 保存される LoRA の数やディスク容量などの警告

変更したい点があれば、「step 数を 2000 にしてください」のように伝えます。修正された `plan` をもう一度確認しましょう。

問題なければ **「学習を始めて」** と伝えてください。学習がスタートします。

### Kura Monitor で様子を見る

Kura Monitor は、学習の進捗や過去の run を確認するための監視ツールです。

Monitor は状態を見るための画面です。ここから学習を開始したり、設定を書き換えたりすることはできません。

> 学習しているターミナルとは、別のターミナルから開いてください。

```sh
cd path/to/Kura
uv run kura monitor
```

![kura monitor](https://gyazo.com/200c43a33b1a88c82d555d2bf2d3ed55){gyazo=image}

ひとつの run を詳しく見たい場合は、`watch` コマンドを使います。

```sh
uv run kura run watch <run-id>
```

![watch](https://gyazo.com/19b89285e83c62b08e1ba1ee80579c03){gyazo=image}

Monitor 内のリンクを左クリックすると、エクスプローラーが開きます。保存済みの LoRA は、学習中でも run の `outputs/` に順次追加されます。

```text
📂Kura/
└── 📂runs/
    └── 📂<run-id>/
        └── 📂outputs/
            └── *.safetensors
```

RunPod を使った場合は、学習が終わり、すべての出力を回収したあとに Pod も自動で停止します。

---

## ComfyUI で生成結果を確認する

良い LoRA ができたかどうかは、実際に生成してみるまで分かりません。Kura から ComfyUI を使って、作った LoRA を試してみましょう。

### ComfyUI を準備する

ローカルの ComfyUI を使う場合は、通常どおり起動し、`http://127.0.0.1:8188` でアクセスできるようにしておいてください。

初回のみ、ComfyUI の `models/loras` フォルダの場所を聞かれることがあります。Kura は生成するときだけ LoRA を一時的に置き、終わったら片付けます。

ローカルに ComfyUI がない場合は、RunPod 上で ComfyUI を起動して生成することもできます。

### LoRA を使って生成する

準備ができたら、AI に生成を依頼します。

```text
さっき学習した LoRA を適用して、ComfyUI で画像を 1 枚生成して。
```

![Vivi 1000steps](https://gyazo.com/5bffd9971f963f76bd0dc68ce4add3d0){gyazo=image}

基本的に、AI は workflow を **ゼロからは作りません**。

`Kura/workflows/samples/` には、主要なモデルの API 形式の workflow が用意されています。AI はその中から適したものを選び、学習した LoRA を差し込んで使います。

対応する workflow がない場合や、別の workflow を使いたい場合は、ComfyUI の **API 形式** で書き出した workflow を `Kura/workflows/` に置いてください。

### 比較画像を作ってもらう

良いキャラクター LoRA には、キャラクターの再現度だけでなく、プロンプトに合わせてポーズ・構図・背景などを変えられる **柔軟性** も必要です。

学習が足りなければ、キャラクターが似ません。反対に学習を進めすぎると、データセットの構図や背景まで覚えてしまい、プロンプトが効きにくくなります。これが過学習です。

ちょうど良いラインを探すには、各 step の LoRA を複数のプロンプトで生成し、結果を並べて見比べるのが確実ですね。

```text
学習したキャラクター LoRA を確認したい。
3 つのプロンプトを使い、保存されている各 step の LoRA で生成し、それらを並べたレビュー画像も作って。
```

![Comparison](https://gyazo.com/a9b23a29fc76faf1d66da47962b41373){gyazo=image}

この例では、1000 step くらいが良さそうですね。

---

## 実験した知識が残る

これで学習は一通り終わりですが、Kura の真価が発揮されるのはこれからです。

使ったデータセットやパラメータ、失敗した設定、出力された LoRA は、すべてファイルとして残ります。次の学習では AI がこれらを読むため、回数を重ねるほど、その環境や作りたい LoRA に合った設定を提案しやすくなります。

ただ、ファイルが残るだけでは、どの結果が良かったのかまでは分かりません。比較が終わったら、「1000 step が良かった」「顔は似たが、ポーズが変わりにくい」といった感想も AI に伝えてください。評価は比較用 run の `notes.md` に残り、次の実験を考える材料になります。

Kura に最初から入っているデフォルト値も、絶対的な正解ではありません。現時点では、作者の経験をもとに、ひとまず使いやすいと思う値を設定しています。

よければ、皆さんが試した成功例や失敗例も、[Kura の Issues](https://github.com/nomadoor/Kura/issues) で共有してください。実験結果が集まれば、Kura に含まれる Skill やデフォルト値へ反映していきます。適当に使ってもクオリティの高い学習ができる。そんなものを目指していきます。

---

## トラブルシューティング

### DNS lookup などのネットワークエラーが出る

Kura は、モデルのダウンロードや RunPod の操作でネットワークを使います。Codex CLI にネットワーク権限がない場合は、Codex のユーザー設定に以下を追加してから起動し直してください。

```toml
[sandbox_workspace_write]
network_access = true
```

Claude Code などを使う場合も、ネットワークへのアクセスをそのエージェント側の設定で許可してください。

### ComfyUI の LoRA フォルダへアクセスできない

ローカルの ComfyUI で生成するときは、AI エージェントから ComfyUI のフォルダへ一時的に LoRA を配置できる必要があります。

Codex CLI では、起動時に ComfyUI の `models/loras` フォルダを追加してください。

```sh
codex -C /path/to/Kura --add-dir /path/to/ComfyUI/models/loras
```

Claude Code などを使う場合も、ComfyUI フォルダへのアクセスをそのエージェント側の設定で許可してください。

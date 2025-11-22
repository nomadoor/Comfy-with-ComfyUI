---
layout: page.njk
lang: ja
slug: downloading-and-placing-models
navId: downloading-and-placing-models
title: "モデルのダウンロードと配置"
summary: "モデルのダウンロードと配置について"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## モデルの配布場所

モデル(重みといったりもしますが)の配布場所は基本的に以下の2箇所です。この2つの使い方さえ覚えれば困ることはないでしょう。

### [Huggingface](https://huggingface.co/models)
- 生成AIにおけるGitHubのようなもので、主に研究者がモデルを公開しています。

### [Civitai](https://civitai.com/)
- コミュニティーがファインチューニングしたモデルを共有する場所として最も古く、最も人気のある場所の一つです。
- Huggingfaceは画像生成モデル以外の、様々な種類のモデルがありますが、Civitaiは画像生成モデルのためのサイトであるため、フィルタ機能などモデルが探しやすい機能があったりします。(ちょっとごちゃごちゃしすぎていますがね…)
- また、かなりNSFWなモデルが多いです。それが長所であるとともに大きな弱点でもあり、近頃様々な方面から締め付けが厳しくなっています。

---

## HuggingFaceからダウンロードする

Stable Diffusion 1.5をダウンロードしてみましょう。

![](https://gyazo.com/b274b58909cf22061a2506ab7b43bf61){gyazo=loop}

- 1.  まず、[Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive) ページを開きます。
- 2.  `Files and versions` タブをクリックし、ファイル一覧から目的のモデルファイル（例: `.safetensors` や `.ckpt`）を見つけます。
- 3.  ダウンロード方法は以下の3通りです。
    * **直接ダウンロード:**  
        - ファイル名の横にある **↓（ダウンロードアイコン）** をクリックします。
    * **詳細ページからダウンロード:**  
        - ファイル名をクリックして詳細ページを開き、そこで表示される `↓ download` ボタンをクリックします。
    * **直リンクを利用:**  
        - ファイル詳細ページで `Copy download link` をクリックすると、ダウンロード用URLがコピーされます。
        - このURLを `wget` などで利用できます。
            ```bash
            wget https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly.safetensors
            ```


---

## Civitaiからダウンロードする

Stable Diffusion 1.5のファインチューニングモデルとして一斉を風靡したepiCRealismをダウンロードしてみましょう。

![](https://i.gyazo.com/7bcde1665657f544a1191c760248dd80.png){gyazo=image}

- 1.  まず、[epiCRealism](https://civitai.com/models/25694/epicrealism)のページを開きます。
- 2.  画面右側にある青い **Download** ボタンをクリックします。
- 3.  ダウンロードが始まります。

※ ログインしないとダウンロードできないモデル（NSFWなど）もあります。

---

## モデルの置き場所

ダウンロードしたモデルファイルは、種類によって置く場所が決まっています。

画像生成の仕組みがわからないと中々難しいと思いますが、このサイトではモデルのダウンロードリンクとその配置場所を全て記載しているのでご安心を。ちょっとずつ感覚を掴んでいきましょう。

```text
📂ComfyUI
└── 📂models
    ├── 📂checkpoints       # ckptモデル
    ├── 📂loras             # LoRA
    ├── 📂vae               # VAE
    ...
```

ComfyUIを起動したあとに、フォルダにモデルを置いてもComfyUIは認識してくれません。

ファイルを配置した後は、キーボードの `r` キーを押すか、`ComfyUIアイコン` → `Edit` → `Refresh Node Definitions` を押すとComfyUIに読み込まれます。

---

## モデルの整理術

モデルが増えてくると、「これは何がベースのモデルだったか？」「あのモデルはどこに行った？」といった問題が出てきます。
フォルダ分けをして整理整頓しましょう。

### フォルダ分け

適切なフォルダ（`checkpoints` や `loras` など）の中であれば、さらにサブフォルダを作成して整理しても問題ありません。
ComfyUIはサブフォルダ内のモデルも自動的に認識します。

例えば、`checkpoints` フォルダを以下のように整理した場合：

```text
📂models/checkpoints/
├── 📂SD1.5
│   └── v1-5-pruned.ckpt
├── 📂SDXL
│   └── sd_xl_base_1.0.safetensors
```

ComfyUIの `Load Checkpoint` ノードなどでは、ファイル名が `SD1.5\v1-5-pruned.ckpt` のように、フォルダ名付きで表示されるようになります。
これにより、モデルの種類や用途ごとに分類して管理しやすくなります。

### カスタムノードで更に便利に

**[rgthree-comfy](https://github.com/rgthree/rgthree-comfy)** というカスタムノードを導入すると、
フォルダ分けした構造をメニュー上で階層的に表示してくれます。

![](https://i.gyazo.com/dccf958c1d05e68e94bcb6bdd680e43c.png){gyazo=image}

`ComfyUIアイコン` → `⚙Settings` →　`rgthree-comfy settings` → `Auto Nest Subdirectories in Menus ✅️`

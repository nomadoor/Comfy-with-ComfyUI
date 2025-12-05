---
layout: page.njk
lang: ja
slug: sd15-text2image
navId: sd15-text2image
title: "text2image"
summary: "Stable Diffusion 1.5でのtext2image"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  gradient:
  image: ""
---

## text2imageとは？

テキストプロンプトを入力して、画像を生成します。

より本質的にいえば、**テキストプロンプトという条件** で拡散モデルを制御します。

これから作るworkflow全ての基礎となるものです。ゆっくり見ていきましょう。

---

## 画像生成AIの仕組み

本当に簡単にですが、こちらで解説しています。  
全く画像生成AIの仕組みを知らない方は、軽く目を通してみてください。パラメータの意味が少し分かるようになると思います。

- [拡散モデル](/ja/ai-capabilities/diffusion-models/)
- [Conditioning](/ja/ai-capabilities/conditioning/)
- [CFG](/ja/ai-capabilities/cfg/)
- [Sampling](/ja/ai-capabilities/sampling/)
- [Latent Diffusion ModelとVAE](/ja/ai-capabilities/latent-diffusion-vae/)


---

## モデルのダウンロード

全ての始まりである、Stable Diffusion 1.5 を使い、解説していきます。

- [Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂checkpoints/
              └── v1-5-pruned-emaonly-fp16.safetensors
    ```

---

## workflow

![](https://gyazo.com/54e06d8a5bec841c5ba566a758140175){gyazo=image}

[](/workflows/basic-workflows/sd15-text2image/SD1.5_text2image.json)

---

## 各ノードについて

{% mediaRow img="https://gyazo.com/c9e67fd1fd3382708102f366bdf63855 {gyazo=image}", width=33, align="left" %}
### Load Checkpoint ノード

古い形式の Checkpoint モデルを読み込みます。
- Checkpointは **拡散モデル / テキストエンコーダ / VAE** が一つのパッケージにまとめられたものです。
- 初期はこの形式で配布されることが多かったのですが、現在は別々に配布されることがほとんどです。
- そのため、Load Diffusion Model / Load CLIP / Load VAE など、別々のノードを使うことになります。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2321a6cfbee1f95261c5bf857068f4b7 {gyazo=image}", width=33, align="left" %}
### Empty Latent Image ノード

画像生成の「出発点」となる、空の潜在画像(latent)を作ります。
- 作成したい画像のサイズを指定します。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ba121f352d6252f885c2855cd99ad2f5 {gyazo=image}", width=33, align="left" %}
### CLIP Text Encode ノード

テキストプロンプトを、モデルが理解できるConditioningに変換します。
- 生成したいものを「positive プロンプト」、避けたいものを「negative プロンプト」として、別々のノードで用意します。
- ただ、このノード自体に`positive` / `negative`の概念があるわけではありません。
- 次のKSamplerの`positive`スロットに入力すればpositiveとして、`negative`スロットに入力すればnegativeとして扱われます。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/5404e0e4a52dade391da4cb125b8512e {gyazo=image}", width=33, align="left" %}
### KSampler ノード

Sampling（ノイズ除去）を行う、画像生成の中核となるノードです。

- 上記のノード（Model / Positive / Negative / Latent）をすべて接続して使います。
- `seed` : ノイズの形を決める値。同じ設定なら同じ画像を再現できます。
- `control_after_generate` : 画像生成ごとに seed をどう変化させるかを決めます。`fixed` はそのまま、`randomize` は毎回ランダム。
- `steps` : ノイズを消すステップ数です。ほとんどのモデルでは`20`あれば十分です。
- `cfg` : プロンプトの効き具合を決めます。
- `sampler_name` : どのサンプリングアルゴリズムを使うかを選びます。基本`Euler`で良いです。
- `scheduler` : 各ステップでノイズをどの順番・強さで減らしていくかの種類です。
- `denoise` : 詳しくは[KSamplerAdvanced]で解説します。text2image では `1.0` にします。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/73b18040b915d0c1159a79cabbb8d065 {gyazo=image}", width=33, align="left" %}

### VAE Decode ノード

latentをピクセル画像に変換します。

{% endmediaRow %}


---

## 初心者がコケそうな疑問

当然のように扱われていますが、よく考えれば画像生成特有で不思議なもの、というのはいくつかあります。それらについて別ページで簡単に解説しています。

  - [同じパラメータを使ってもStable Diffusion web UIとComfyUIで同じ画像は生成できない]()
  - [512px × 512pxで生成するのはなぜ？]()
  - [8の倍数の解像度しか生成できないのはなぜ？]()
  - [Seed値"1234"と"1235"は全く別物]()

---

## プロンプトの書き方

Stable Diffuision 1.5 / SDXLで使われている、テキストエンコーダの**CLIP** は、お世辞にも性能が良いものではありません。そのため、望んだ画像を生成するために、プロンプトエンジニアリングや呪文と言われるようなテクニックがありました。

### タグ列挙

CLIPは文章を**読める**わけでは無いので、文章としてプロンプトを書いてもあまり意味はありません。
```
1girl, solo, upper body, looking at viewer, smile, outdoors, sunset
```
そのため、このように単なる**タグ列挙**という形でプロンプトを書くことが多かったです。

また、アニメ系モデルは、Danbooruというサイトの画像・その画像を整理するためのタグをそのまま使っていました。それゆえ、Danbooruで使われてるタグを調べてそのまま使う、ということをしていましたね。

### 品質呪文

```
(best quality, masterpiece, ultra detailed, 8k, HDR, sharp focus, highly detailed)
```

このように、**品質を高めそうな**ワードをひたすら最初に書く、ということをしていました。  
今思うと意味があるんだかわかりませんが、どのワードがどれくらい効いているかわからなかったので、ひたすら書いていったのです。

### Negative Prompt

```
bad anatomy, extra fingers, extra limbs, blurry, lowres, jpeg artifacts, ...
```

先ほどとは逆に、品質を下げそうなワードをネガティブプロンプトにひたすら書いていました。これらもどれほど効果があったのやら……

### 注目度記法

プロンプトの各ワードに`(red:1.05)` / `(blue:0.9)`のように数値を設定することで、そのワードの重要度を変更できます。

CLIPは、前にあるテキストをより重視するため、後半に書いたテキストはほぼ無視されます。また、そもそもワードによって良く効くもの、あまり効かないもの
があります。

それを手動で調整するために、この注目度記法を使用します。

> ただし、これがうまくいくのはあくまでCLIPがその言葉を理解しているときです。  
> 知らないであろう言葉に`(Ghoti:999)`などとつけても意味はありません。

![](https://gyazo.com/e13bd76787711c8392334243177e60f3){gyazo=loop}

- 注目度を変えたいワードにカーソルを起き、`Ctrl + 矢印↑/↓`をすると、0.05ずつ調整できます。


---

## VAEを変更する

Stable Diffusion1.5のVAEは、正直あまり性能がよくありません。ファインチューニングモデルを使うと、変な色の画像が生成されることもあります。

その後、改良されたVAEが発表されました。他にも色々なVAEが発表されていますが、Stable Diffusion 1.5のVAEは、これを使えば問題が出ることはほぼありません。

### VAEのダウンロード

- [vae-ft-mse-840000-ema-pruned.safetensors](https://huggingface.co/stabilityai/sd-vae-ft-mse-original/blob/main/vae-ft-mse-840000-ema-pruned.safetensors)
-  ```text
    📂ComfyUI/
      └── 📂models/
          └── 📂vae/
              └── vae-ft-mse-840000-ema-pruned.safetensors
    ```

### workflow

![](https://gyazo.com/6a576a6c23a647c646df9945137e3272){gyazo=image}

[](/workflows/basic-workflows/sd15-text2image/SD1.5_text2image_vae-ft-mse-840000.json)

- 🟥`Load VAE`ノードを追加し、先程ダウンロードしたVAEを選択。
  -  VAE Decodeに繋ぎます。

> 今後のworkflowはこれをベースにします。
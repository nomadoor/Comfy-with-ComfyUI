---
layout: page.njk
lang: ja
slug: ksampler-advanced
navId: ksampler-advanced
title: "KSampler (Advanced)ノード"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: ""
---

## KSampler (Advanced)とは？

![](https://gyazo.com/6f12a584833996a7a4800a13bb59cc23){gyazo=image}

`KSampler (Advanced)`ノードは、無印`KSampler`ノードの上位互換です。
パラメータは`denoise`が消えて以下の四つが増えています。
  - `add_noise`
  - `start_at_step`
  - `end_at_step`
  - `return_with_leftsover_noise`

ComfyUIの中でも、最も面白い機能の一つだと思っているので、ゆっくり見ていきましょう。

---

## 拡散モデルとSamplingの復習

![](https://gyazo.com/bf9d6d2e5b528f0b82f9d13e3c18c5fa){gyazo=image}

[拡散モデル](/ja/ai-capabilities/diffusion-models/)というのは、完全なノイズから、徐々にノイズを取り除いていくことで画像を生成する仕組みでした。

上の画像ならば、0ステップ目に満量のノイズを追加し、20ステップ目には全てのノイズが取り除かれ、画像が完成します。

---

## パラメータ

### `start_at_step` と `end_at_step`

KSampler (Advanced)では、`start_at_step` と `end_at_step` を設定することで、どこからサンプリングを開始し、どこまでサンプリングを進めるかを制御できます。

![](https://gyazo.com/e73ba8cf96fd09b8c5335844858a6c86){gyazo=image}

例えば、`start_at_step`を**4** / `end_at_step`を**11**と設定したとき、画像の白い部分しかサンプリングを行いません。

### `add_noise`

何度も繰り返しになりますが、拡散モデルはノイズ画像を作り、ノイズを徐々に取り除いていく仕組みです。

では、そのノイズはどこから来るのでしょう？  
そうです、ノイズを追加するのもKSamplerが行っています。

KSampler (Advanced)では、`add_noise`パラメータでノイズを追加するかしないかを選択できます。

![](https://gyazo.com/64cca8d8e53b01d4315b4aec434dd5ec){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-add_noise.json)

🟫仮に`add_noise`をdisableに設定してサンプリングを行うと、ノイズのない画像からノイズを除去し続けるため何も生成されません。

---

## サンプリングを分割する

中間のステップしかサンプリングしなかったり、ノイズを追加しなかったり、一体どこで役に立つのでしょうか？

このKSampler (Advanced)だからこそ出来ることとして、一つのサンプリングを2つ以上のKSamplerに分割する、というものがあります。

![](https://gyazo.com/814b1585c344ea2651ffe3bf16b95a0d){gyazo=image}

図のように、前半 0 ~ 10stepは🟪Ksample (Advanced)、11~20stepは🟨KSampler (Advanced)で行ってみましょう。

![](https://gyazo.com/d57cb22d3d85f90010815d19d45bb638){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-divide.json)

2つに分割しても生成される画像が全く同じであるのがわかると思います。
パラメータが少しややこしいので、丁寧に見ていきます。

{% mediaRow img="https://gyazo.com/05f6a71f5fe47d5c2257bce31a015d2b{gyazo=image}", width=33, align="left" %}
**🟪KSampler (Advanced)**
- `add_noise` : `enable`
- `start_at_step` : `0`
- `end_at_step` : `10`
- `return_with_leftover_noise` : `enable`
  - ノイズを残したままlatentを返します。
{% endmediaRow %}

{% mediaRow img="https://gyazo.com/172843d68f88326455f5d66176286de0 {gyazo=image}", width=33, align="left" %}
**🟨KSampler (Advanced)**
- `add_noise` : `disable`
  - ノイズが残ったlatentが渡されるので、ここでノイズは追加しません。
- `start_at_step` : `10`
  - 🟪の`end_at_step`と同じにします。
- `end_at_step` : `20`
  - 全体のstep数より大きな値にした場合、内部的には`steps`と同じになっています。
- `return_with_leftover_noise` : `disable`
{% endmediaRow %}

分割することに意味はなさそうですが、これが面白いのです。

---

## KSampler (Advanced)だからできること

### プロンプトの切り替え

最初は"A"のプロンプトを使い、サンプリングの途中から"B"のプロンプトに切り替える、といったことが出来ます。

![](https://gyazo.com/6fd6725df9ce2fd370f7561927bafd4e){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-Prompt_Editing.json)

このworkflowでは、最初の10stepを`赤いりんご`、残りを`赤いうさぎ`というプロンプトで生成しています。

![](https://gyazo.com/b9db108769cb804df9df3fe8212e7707){gyazo=loop}

もっとわかりやすくするために、切り替えステップを1ずつ変えたときの生成画像を動画にしてみました。  
100%りんごだったものが、徐々にうさぎになっていきます。

> Stable Diffusion web UIユーザーであれば、[Prompt Editing](https://scrapbox.io/work4ai/Prompt_Editing)を思い出すかもしれません。実際、似たようなものです。  
> その中で1stepsごとにプロンプトを切り替えるというものがありましたが、ComfyUIでは、残念ながらカスタムノードがなければ出来ません。  
> KSampler (Advanced)を20個並べれば出来ますが、まぁ…やりませんね……

### モデル(LoRA)の切り替え

同じように、途中からモデルやLoRAを切り替えることもできます。

![](https://gyazo.com/f85b62fe88508687bf562fd162fcc569){gyazo=image}

[](/workflows/basic-workflows/ksampler-advanced/SD1.5_KSampler_(Advanced)-LoRA.json)

ノードが増えて少しややこしくなってきましたね。  
ただ、よく見るとtext2imageのworkflowが2つ並んでおり、途中で切り替えているだけです。

最初の6stepを**LoRAなし**で、残りを**LoRAあり**で生成しています。

![](https://gyazo.com/ca0b90aaa5297a515c7bfe8f94e55684){gyazo=image}


これはドット絵にするLoRAですが、LoRAは"ドット絵にする"という概念以外にも、学習素材にした絵の記憶も持ってしまっています。

そのため、LoRAなしで生成した時の画像がそのままドット絵になるわけではありません。  
LoRAを使わなかったときと全step適用したときを見比べてみると、ドット絵スタイルになっただけでなく、りんごの形まで変わってしまっています。

**拡散モデルは、序盤のステップで形を作り、後半で細部を描いていきます。**  
形を作る最初のstepはLoRAをかけず、後半だけにLoRAをかけることで、モデル本来の能力を生かしつつLoRAによる絵柄変換ができるのです。

---

## image2image

途中からノイズを追加する、というのはそのままimage2imageの仕組みつながります。  
それでは、このままimage2imageの仕組みを見てみましょう。

→ [image2image](/ja/basic-workflows/sd15-image2image/)
---
layout: page.njk
lang: ja
section: notes
slug: seed-neighbor
navId: seed-neighbor
title: "seed1234 と 1235 は全く別物"
created: 2026-02-11
updated: 2026-03-02
noteTags: ["faq", "seed"]
summary: "シードは「近い数字＝近い結果」にならない"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/9cc7e9a5752b2a65f4e8a76972b9b366.png"
---

## seed1234 と 1235 は全く別物

シードを変更すれば出力される画像も変わる、というのは経験があると思います。

![](https://gyazo.com/69110725afae49631e11fff491cf6596){gyazo=image}

では `seed=1234` で生成したあとに、`seed=1235` でもう一度生成してみましょう。  
数値が近いので、似たような画像が生成される……と思いきや、まったく違う画像になります。

なぜでしょうか？

---

## ノイズと生成画像の関係

拡散モデルは、ノイズから始めて、少しずつノイズを取り除くことで画像を作ります。  
(詳しくは[拡散モデル](/ja/ai-capabilities/diffusion-models/)のページで)

つまり、最初のノイズが違えば、最終的な画像も当然違ってきます。

---

## ノイズとシード値の関係

text2image では、最初にノイズを作る必要があります。  
このノイズを作るときに、乱数（ランダムな数字列）が使われています。

seedは、その乱数の出し方を決める番号です。

### seedは「乱数を初期化する番号」

コンピュータは「完全な乱数」を作っているわけではなく、擬似乱数生成器（PRNG）で“それっぽい乱数列”を作ります。

「seedが近いなら乱数列も近いのでは？」と思うかもしれません。しかし、そうはなりません。

- `1234` と `1235` は人間には「1違いで近い数字」ですが
- PRNGにとっては「別の初期化入力」で、生成される乱数列は基本的に無関係です

例えるなら、辞書の「1234ページ」と「1235ページ」は隣ですが、載っている単語が似ている保証はない、という感じです。

---

## では似た画像を作るには？

シード値の近さと出力の近さに関係がないことは分かりました。  
では seed=1234 で素敵な画像が作れたとして、似たような画像を作るにはどうしたらいいでしょうか？

### 1. image2imageを使う

最もシンプルな方法ですね。

生成した画像を入力として、弱めの `denoise` を使えば少し変化した画像が作れます。

### 2. ノイズを混ぜる（blend）

考え方は単純です。

![](https://gyazo.com/313224ede32c9b07ac81fad2c1bc3a71){gyazo=image}

1. `seed_A` でノイズAを作る
2. `seed_B` でノイズBを作る
3. AをベースとしてBを少しだけ混ぜる

`seed_B` の値を変えたり、混ぜる量を調整することで、少し変化した画像が作れます。

### 3. ノイズを足す（injection）

もう一つは、ベースの latent に対して、少量のノイズ latent を足す方法です。

![](https://gyazo.com/3330b48b010177e127ceb014a3da882f){gyazo=image}

1. `seed_A` でノイズAを作る
2. 別の乱数で作った小さなノイズを、係数 `0.01` などで足す

ノイズを注入するため、全体のノイズ量は増えていきます。

多少増えたくらいでは問題ありませんが、`strength` を `1.0` や `2.0` にすると、サンプラーがデノイズしきれず、ただのノイズ画像が出力されやすくなります。

## workflow

通常の workflow では、ノイズの生成と注入は `KSampler` が内部で行います。
ただ今回のテクニックでは、`KSampler` に入れる前にノイズ（latent）を作り、そこに操作を加えます。

ComfyUIとしては少しイレギュラーなので、シンプルに image2image でいいかもしれませんね。

### ノイズを混ぜる（blend）

![](https://gyazo.com/eee2f089f7ecf7f9b6541cf2f570266a){gyazo=image}

[](/workflows/notes/seed-neighbor/Latent_Blend.json)

- 🟩`Generate Noise` + `KSampler (Advanced)` (`add_noise=disable`) という設定をすることで、ノイズを外部で作れるようにします。
- 🟪こちらの`Generate Noise` では、混ぜたい別のノイズ（latent）を生成します。
- 🟨`Latent Blend`ノードで、2つの latent を混ぜます。
  - `blend_factor=1.0` で samples1 のみ、`blend_factor=0.0` で samples2 のみになります。

### ノイズを足す（injection）

![](https://gyazo.com/a5162437aa43b07806a802d301a5df9d){gyazo=image}

[](/workflows/notes/seed-neighbor/Inject_Noise_To_Latent.json)

- 🟨`Inject Noise To Latent`の`strength`を少しずつ上げていくことで、ベース latent に2つ目のノイズを追加していきます。
  - `mix_randn_amount`を上げると更に別のノイズが追加されますが、ここでは `0` にしておきます。

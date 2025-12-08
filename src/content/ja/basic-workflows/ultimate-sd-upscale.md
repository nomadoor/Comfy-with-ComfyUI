---

layout: page.njk
lang: ja
section: basic-workflows
slug: ultimate-sd-upscale
navId: ultimate-sd-upscale
title: "Ultimate SD upscale"
summary: "TileとControlNetを使った超高解像度アップスケール"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
   image: ""
tags: ["upscale-restoration", "controlnet"]
---------------------------------------

## Ultimate SD upscaleとは？

![](https://gyazo.com/d3b6f13de466be0cb0a17f2565d6f9e3){gyazo=image}

Stable Diffusionで大きな画像を生成できない理由として、大きな画像で学習されていないという理由がありましたが、もう一つシンプルな原因として、計算コストの問題がありました。

4K や 8K といった超高解像度の画像を、1枚そのまま生成しようとすると VRAM と計算時間の面でかなり厳しい。

そこで一気に作るのではなく、画像を分割してそれぞれをHires.fixしようという考え方が生まれました。
- 1. 画像を拡大する
- 2. タイル状に分割する
- 3. 各タイルを個別に image2image
- 4. 最後にタイルをつなぎ合わせる

名前としては **Ultimate SD upscale** が有名ですが、本当に大事なのは **Tile（タイル分割）** という考え方です。 

---

## カスタムノード

- [shiimizu/ComfyUI-TiledDiffusion](https://github.com/shiimizu/ComfyUI-TiledDiffusion)

[ssitu/ComfyUI_UltimateSDUpscale](https://github.com/ssitu/ComfyUI_UltimateSDUpscale)という名のまさにUltimate SD upscaleのノードもあるのですが、今回は原理を追っていきたいので、上の単純なノードを使います。

---

## Tileの弱点 : 境界線

まずは、Tile の基本的な挙動を見ておきます。
ここでは Tiled Diffusion のノードを例に説明しますが、考え方さえ押さえればノードは何でもかまいません。

![](https://gyazo.com/6ff5e63c42367c9ef8ffd8e2a89a61c5){gyazo=image} ![](https://gyazo.com/daf241e640303e9bdbebdbdb06ae4afa){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/Tiled_Diffusion_overlap0.json)

* 🟨 入力画像を 1024 × 1024 px にリサイズ
* 🟩 タイルサイズを 512 × 512 px に設定

この設定だと、左下の子犬の画像はきれいに 4 分割され、
それぞれのタイルが独立した image2image として処理されます。

見て分かるように、タイルの境界線がはっきり見えてしまい画面全体としてのまとまりが弱いです。  
これが Tile の **1つ目の弱点** です。

---

## overlapで境界線をなじませる

境界線が気になるなら、タイルを少し重ねて配置すればよい、という発想があります。
これが `tile_overlap` です。

![](https://gyazo.com/d6bf859530ae65b7b09ca8a2b2e3006b){gyazo=image} ![](https://gyazo.com/fec3f15e6e4ff7110d3f5ff110f0faa2){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/Tiled_Diffusion_overlap256.json)

- 🟩 `tile_overlap` を 256px に
- タイルをきれいに並べるのではなく、**わざと半分くらい重ねて** 並べるイメージです。
  - ![](https://gyazo.com/5f5d51e77955a55c8df142e45d8d12f5){gyazo=image}

重なった部分は、隣り合うタイル同士が情報を共有するクッションのように働くため、
サンプリングを進めるうちに境界がなじみ、タイルの継ぎ目が目立ちにくくなります。

ただし、overlap を増やすほど、同じ領域を何度もサンプリングすることになるため、生成にかかる時間は増えます。

---

## Tileのもうひとつの弱点：プロンプト

Tile にはもうひとつ、大きな弱点があります。  
**すべてのタイルで同じプロンプトを使う** ため、思ってもいない場所に余計なものが生成されてしまうのです。

![](https://gyazo.com/b180b2b157a72b030b099dcb6f7c046f){gyazo=image}

先程のworkflowで、`tile_overlap = 0` / `denoise = 1` のように設定し、
プロンプトに `一匹の犬` とだけ書いて生成してみましょう。  
すると画像のように、一つの画像の中に何匹もの犬が現れてしまいます。

左上、右上、左下、右下それぞれのタイルで一匹の犬を生成しようとするため、全体としては四匹の犬が描かれることになるんですね。これが Tile の **2つ目の弱点** です。

---

## タイルごとにプロンプトを変える案

理屈だけで言えば、**タイルごとに別々のプロンプトを書く** 方法が考えられます。

* 左上タイル：`犬の右耳, 右目`
* 右上タイル：`犬の左耳, 左目`
* 左下タイル：`犬の前足`
* 右下タイル：`犬の後ろ足`

こうすれば、どのタイルも「自分は耳だけを担当すればいい」と理解してくれるはずです。

しかし、実際にはほとんど使われません。

タイルの数だけプロンプトを書くのは現実的ではありませんし、なにより Stable Diffusion は「犬の顔の右上 4 分の 1だけ」といったプロンプトを理解して描き分けることができません。


---

## ControlNet Tileで構造を固定する

ここで出てくるのが **ControlNet Tile** です。

ControlNet Tile は、入力画像の **構造をかなり強く保持したまま** 新しい画像を生成する ControlNet です。

画素をそのままコピーするわけではありませんが、**大まかな形**、**オブジェクトの位置関係** を保ったまま、テクスチャやディテールを塗り直すような挙動をします。

![](https://gyazo.com/a0d8adb6b4cbd35562588238db87f71e){gyazo=image} ![](https://gyazo.com/1bf02bf5900f379735c6a29a7aa1935e){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/TiledDiffusion_ControlNet_Tile.json)

このworkflowでは、あえて`tile_overlap = 0`、`denoise = 1`という、もっとも Tile の弱点が出やすい設定にしています。

それでも、ControlNet Tile を通すことで **元画像の構図をかなりの程度保ったまま** アップスケールできているのが分かるはずです。

---

## overlap × ControlNet Tileで仕上げる

ここまでの要素を組み合わせると、実用的な Tile アップスケールの形が見えてきます。

![](https://gyazo.com/763660c52564a7af2f5dce9eaa81e20f){gyazo=image} ![](https://gyazo.com/3e4bf6018a4e4500f3bbd14151ce56e7){gyazo=image}

[](/workflows/basic-workflows/ultimate-sd-upscale/Tiled_Diffusion_overlap_ContolNet_Tile.json)

- 🟩 overlap 256px
- 🟦 Controlnet strength 0.6

大分自然な仕上がりになりましたね。

---

## まとめ：Ultimate SD upscaleの考え方

Ultimate SD upscale の本質は、次の三本柱です。

- 1. **Tile（タイル分割）**
   大きな画像をそのまま扱うのではなく、タイルに分割して image2image することで、
   VRAM と計算時間の負荷を抑えながら超解像を狙う。

- 2. **overlap（タイルの重なり）**
   タイル同士を少し重ねて配置し、サンプリングの過程で境界をなじませることで、
   継ぎ目を目立たせないようにする。

- 3. **ControlNet Tile（構造の固定）**
   入力画像の構造を強く保持したままタイルアップスケールすることで、
   「犬の中の犬」問題や、全体がバラバラになる問題を抑える。

実際の Ultimate SD upscale 系ノードやプリセットは、この考え方をひとつのノードにパッケージしたものにすぎません。

ちなみにですが、動画生成にも同じような考えが応用できて、今度はフレームを分割するようになります。
100フレームの動画を20フレームずつにして、5フレーム分overlapするといった感じですね。
詳しくはここでは扱いませんが、計算コストを下げるために細かく分割する点は全く同じです。
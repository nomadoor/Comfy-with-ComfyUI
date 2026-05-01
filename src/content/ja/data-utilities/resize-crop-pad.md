---
layout: page.njk
lang: ja
section: data-utilities
slug: resize-crop-pad
navId: resize-crop-pad
title: "リサイズ・クロップ・パディング"
created: 2025-11-25
updated: 2026-03-02
summary: "画像のリサイズ、クロップ、パディングについて"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/02cf6bd2a573dc15dff4799c94b15a0d.png"
---

## 画像のリサイズとクロップ

画像のサイズを大きくしたり正方形にクロップ（切り抜き）したり…という単純なタスクですが、画像生成においてはとても重要な作業です。

- **モデルの適正解像度**: モデルには「最も性能を発揮できる解像度」があります。
- **VRAMの節約**: うっかり4Kの画像を読み込んで処理すると、一瞬で「Out of memory」になります。
- **素材の統一**: 画像合成などで、複数の素材サイズを揃える必要があります。

出番の多い作業なので、それぞれのノードの違いをしっかり理解しましょう。

---

## 画像情報の取得

### Get Image Size ノード

画像の幅(width)と高さ(height)、バッチサイズ（枚数）を数値として出力します。

![](https://gyazo.com/ffb5c8bfea06d5ce1b15183cc70dc973){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Get_Image_Size.json)

---

## リサイズ

### Resize Image/Mask ノード

いくつものリサイズ方法を切り替えて使えるノードです。  
基本的には、これ一つで必要な処理をだいたい網羅できます。（ちなみにマスクもリサイズできます）

{% mediaRow img="https://gyazo.com/afa66ff808e05a40e363761184c668c1 {gyazo=image}", width=45, align="left" %}

**scale by multiplier**

縦横を「倍率」で拡大・縮小します。

たとえば `0.5` なら縦横が半分、`2.0` なら縦横が2倍です。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-by-multiplier.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/4fc6f32dc60859a38a2cf3a125aa82bf {gyazo=image}", width=45, align="left" %}

**scale dimensions**

指定した幅・高さの解像度に強制的に変更します。

- `crop`
  - `disabled` : アスペクト比が違う場合は歪みます。
  - `center` : 中心を維持してはみ出た部分をクロップ（切り捨て）します。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-dimensions.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/bdc737b190e9e45ebc6a55a1b155414e {gyazo=image}", width=45, align="left" %}

**scale longer/shorter dimension**

長辺（longer）または短辺（shorter）だけを指定し、アスペクト比を保ったままリサイズします。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-longer-dimension.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/adcd25f46b34298cea4a37a046b221bf {gyazo=image}", width=45, align="left" %}

**scale width/height**

幅または高さのどちらか一方だけを指定し、アスペクト比を保ったままリサイズします。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-width.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/13116851f0f749d7f4f5e350fb474f5e {gyazo=image}", width=45, align="left" %}

**scale total pixels**

指定した **総ピクセル数（画素数）** になるように、アスペクト比を保ったままリサイズします。

`1024 * 1024 = 1.00MP`として計算されます。

| 目標サイズ | 総ピクセル数 | 設定値 |
| :--- | :--- | :--- |
| **512 × 512** | 262,144 | **0.25** |
| **768 × 768** | 589,824 | **0.56** |
| **1024 × 1024** | 1,048,576 | **1.00** |
| **1536 × 1536** | 2,359,296 | **2.25** |

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-total-pixels.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e4398957f8190305364c6b9c12948c3c {gyazo=image}", width=45, align="left" %}

**match size**

参照画像と同じサイズになるようにリサイズします。

以前は参照画像のサイズを取得して、それを別ノードへ渡す必要がありましたが、これで一つにまとまります。

- `match`: 基準にしたい画像を接続
- `crop`
  - `disabled` : アスペクト比が違う場合は歪みます。
  - `center`: 中心を維持してはみ出た部分をクロップ（切り捨て）します。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_match-size.json)
{% endmediaFooter %}

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/28d95c2ef2e320c18761852f60f2a508 {gyazo=image}", width=45, align="left" %}

**scale to multiple**

縦横を N の倍数 になるようにリサイズします。

詳しくは [8の倍数の解像度しか生成できないのはなぜ？](/ja/notes/why-multiple-of-8/) で解説しますが、拡散モデルは VAEの都合で、特定の倍数になっていない解像度をそのまま扱えません。

基本的にはどこかのノードで自動調整されることも多いのですが、指定解像度でないとエラーが出るケースや、入力と出力でピクセルを「完全一致」させたいケースで使うことがあります。

{% mediaFooter %}
[](/workflows/data-utilities/resize-crop-pad/Resize_ImageMask_scale-to-multiple.json)
{% endmediaFooter %}

{% endmediaRow %}


### ImageScaleToMaxDimension ノード

画像の**長辺**が設定したサイズになるように、アスペクト比を保ったままリサイズします。  
（例：縦長の画像でも横長の画像でも、長い方が1024pxになるようにする）

![](https://i.gyazo.com/42ffc7b0534face3e58fc7946b243ce0.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageScaleToMaxDimension.json)


---

## パディング

パディングとは、画像の周囲に余白（黒帯など）を追加して、サイズを調整する処理のことです。  
ノードによっては、この余白部分をマスクとして出力できるため、Outpaintingを行う際の下準備として使われます。

### ResizeAndPadImage ノード

指定した解像度に合わせてリサイズし、足りない部分をパディングで埋めます。

![](https://gyazo.com/633441a119959e98e0dca5cb765a53d8){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ResizeAndPadImage.json)

> このノードはパディング部分をマスクとして出力できないため、ほとんど使う場面はありません。

### Pad Image for Outpainting ノード

画像の上下左右に、指定したピクセル数だけ余白を追加します。

![](https://gyazo.com/c6200467aad1b43edbc09b2ec4f3f2b0){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Pad_Image_for_Outpainting.json)


余白部分がマスクとして出力されます。

- **feathering**: 余白と画像の境界をぼかします。マスクにしか影響しません。

---

## クロップその他の編集操作

### ImageCrop ノード

x, y座標と幅・高さを指定して、画像の一部分を矩形で切り抜きます。

![](https://i.gyazo.com/1c996b2fa8f7213f05c524b16468181e.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageCrop.json)


### ImageRotate ノード

画像を90度 / 180度 / 270度 回転させます。

![](https://gyazo.com/8de36981f39e9c39ec1b6c4aa3f9a7ff){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageRotate.json)


### ImageFlip ノード

画像を水平 / 垂直方向に反転させます。

![](https://gyazo.com/e0661734e160f918d9fc9080dda91240){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageFlip.json)


---

## Resize Image v2 ノード

これは **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)** に含まれるノードです。

上記のリサイズ・クロップ・パディングが一つにまとめられたようなノードです。

| パラメータ名 | 説明 |
| :--- | :--- |
| **width / height** | 目標とする幅と高さ（0なら変更なし） |
| **upscale_method** | リサイズ時の補間方法（nearest, bilinearなど） |
| **keep_proportion** | stretch, pad, crop, etc. |
| **pad_color** | パディング時の色（RGB） |
| **crop_position** | center, top, bottom, left, right |
| **divisible_by** | この値の倍数の解像度にリサイズされます（例：32, 64） |

> 以前は、縦横を N の倍数 になるようにリサイズする用途で多用していましたが、現在はコアノードで対応できるため、あまり使用していません。


---

## 少し応用

これまでのノードを組み合わせて、少し複雑な画像加工をしてみましょう。

### 画像を半分にクロップ

![](https://gyazo.com/02cf6bd2a573dc15dff4799c94b15a0d){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Crop_to_half_size.json)

- 画像のサイズを取得
- `Simple math` ノードで幅の半分の長さを計算
- `ImageCrop` ノードに計算した幅を入力し、半分にクロップ

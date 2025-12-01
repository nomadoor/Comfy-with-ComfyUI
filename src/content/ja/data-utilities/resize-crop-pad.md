---
layout: page.njk
lang: ja
section: data-utilities
slug: resize-crop-pad
navId: resize-crop-pad
title: "リサイズ・クロップ・パディング"
summary: "画像のリサイズ、クロップ、パディングについて"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 画像のリサイズとクロップ

画像のサイズを大きくしたり正方形にクロップ（切り抜き）したり…という単純なタスクですが、画像生成においてはとても重要な作業です。

- **モデルの適正解像度**: モデルには「最も性能を発揮できる解像度」があります。
- **VRAMの節約**: うっかり4Kの画像を読み込んで処理すると、一瞬で「Out of memory」になります。
- **素材の統一**: 画像合成などで、複数の素材サイズを揃える必要があります。

出番の多い作業なので、それぞれのノードの違いをしっかり理解しましょう。

---

## リサイズ

### Upscale Image ノード

指定した幅・高さの解像度に強制的に変更します。

![](https://gyazo.com/c34faedbc24e22f65ac65462b9684f52){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Upscale_Image.json)

- **アスペクト比**: 元画像と異なる比率を指定すると、画像が歪みます。
- **crop**: `center` に設定すると、歪ませる代わりに中心を維持してはみ出た部分をクロップ（切り捨て）します。

### Upscale Image By ノード

「1.5倍」「0.5倍」のように、倍率でサイズを指定します。アスペクト比は維持されます。
![](https://i.gyazo.com/adcb853e458db1583e11fbcb4a8b0f87.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Upscale_Image_By.json)

### ImageScaleToMaxDimension ノード

画像の**長辺**が設定したサイズになるように、アスペクト比を保ったままリサイズします。
（例：縦長の画像でも横長の画像でも、長い方が1024pxになるようにする）

![](https://i.gyazo.com/42ffc7b0534face3e58fc7946b243ce0.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ImageScaleToMaxDimension.json)

### Scale Image to Total Pixels ノード

指定した **総ピクセル数（画素数）** になるように、アスペクト比を保ったままリサイズします。

![](https://i.gyazo.com/e195b70965fc2e7dbf0511527516e527.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Scale_Image_to_Total_Pixels.json)

**すこし重要な処理です**

画像生成モデルは、特定の解像度と様々なアスペクト比の画像で学習されています。モデルが最高の性能を発揮するためには、学習時と同じようなサイズ（総ピクセル数）で画像を生成することが重要です。

このノードを使用すると、元の構図を維持したまま、総ピクセル数を指定して画像を調整できます。便利！

**よく使う値（メガピクセル）**

| 目標サイズ | 総ピクセル数 | 設定値 (megapixels) |
| :--- | :--- | :--- |
| **512 × 512** | 262,144 | **0.25** |
| **768 × 768** | 589,824 | **0.56** |
| **1024 × 1024** | 1,048,576 | **1.00** (SDXL推奨) |
| **1536 × 1536** | 2,359,296 | **2.25** |

---

## パディング

パディングとは、画像の周囲に余白（黒帯など）を追加して、サイズを調整する処理のことです。

ノードによっては、この余白部分をマスクとして出力できるため、Outpaintingを行う際の下準備として使われます。

### ResizeAndPadImage ノード

指定した解像度に合わせてリサイズし、足りない部分をパディングで埋めます。

![](https://gyazo.com/633441a119959e98e0dca5cb765a53d8){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/ResizeAndPadImage.json)

このノードはパディング部分をマスクとして出力できないため、ほとんど使う場面はないかもしれません。

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

それ以外に重要な処理として、画像を**Nの倍数の解像度にリサイズ**することができます。

| パラメータ名 | 説明 |
| :--- | :--- |
| **width / height** | 目標とする幅と高さ（0なら変更なし） |
| **upscale_method** | リサイズ時の補間方法（nearest, bilinearなど） |
| **keep_proportion** | stretch, pad, crop, etc. |
| **pad_color** | パディング時の色（RGB） |
| **crop_position** | center, top, bottom, left, right |
| **divisible_by** | この値の倍数の解像度にリサイズされます（例：32, 64） |

![](https://gyazo.com/35159d157a239f57c67b03484bd2cfa9){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Crop_to_multiple_of_32.json)

画像を32の倍数の解像度にリサイズするだけの設定です。

- `divisible_by`: この値の倍数の解像度にリサイズされます
- 単にこの操作だけしたい場合は、他のパラメータは0にします。

**なぜこの操作が重要なのか?**

というと、VAEというものに関わってきます。詳しくは[8の倍数の解像度しか生成できないのはなぜ？]()で解説しますが、ともかく、生成AIは微妙な解像度の画像を生成することが出来ません。

基本的に、ComfyUIは内部で自動でクロップするため、このノードを使う必要は無いのですが、指定解像度でないとエラーが出たり、入力した画像と出力した画像のピクセルを完璧に合わせたいときなどに使用することがあります。

---

## 画像情報の取得

### Get Image Size ノード

画像の幅(width)と高さ(height)、バッチサイズ（枚数）を数値として出力します。

![](https://i.gyazo.com/961e83cbf29cbf1f1ab583de4a9e1a00.png){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Get_Image_Size.json)

- 取得したサイズを `Upscale Image` に繋げば、別の画像を「全く同じサイズ」にすることができます。
  - 非常によく使う処理です。

---

## 少し応用

これまでのノードを組み合わせて、少し複雑な画像加工をしてみましょう

### 画像を半分にクロップ

![](https://gyazo.com/02cf6bd2a573dc15dff4799c94b15a0d){gyazo=image}

[](/workflows/data-utilities/resize-crop-pad/Crop_to_half_size.json)

- 画像のサイズを取得
- `Simple math` ノードで幅の半分の長さを計算
- `ImageCrop` ノードに計算した幅を入力し、半分にクロップ
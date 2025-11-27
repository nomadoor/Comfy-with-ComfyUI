---
layout: page.njk
lang: ja
section: data-utilities
slug: color-adjustments
navId: color-adjustments
title: "色調補正・エフェクト"
summary: "画像の明るさ調整やブラー、エフェクトについて"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/e1ecb574e0c11da63b0c6f8cee7a9f87.png"
---

## 色調補正・エフェクト

画像を明るくしたりコントラストを上げたり、グローをかけてカッコよくしたりと、デザイナーや絵描きさんにはおなじみの工程ですね。

画像生成においては、AIにとって使いやすい画像にするための「下処理」としてこれらの機能を使うことがあります。

画像処理に関するカスタムノードは多くあり、もっと高度な処理もできるのですが、正直、慣れ親しんだペイントツールを使ったほうが楽だと感じる場面は多いです。

**全てをComfyUIでやる必要はありません。**

---

## 基本的な加工

### Invert image ノード

![](https://gyazo.com/79ea23575a35a9e8957853294e4f4e7e){gyazo=image}

[](/workflows/data-utilities/color-adjustments/Invert_Image.json)

RGB値を反転したネガ画像を生成します。

### Image Sharpen ノード

![](https://gyazo.com/0296ddc8958f0b0ee358afbdd449424b){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageSharpen.json)

輪郭をくっきりさせます。

### Image Blur ノード

![](https://gyazo.com/b3ae153b9b69063b83e3fb1eeb9bd335){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageBlur.json)

画像をぼかします。

### Image Quantize ノード

![](https://gyazo.com/08652b0b1815b616f8e644ed9067c56a){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageQuantize.json)

色数を減らします（ポスタリゼーション）。

### ImageAddNoise ノード

![](https://gyazo.com/e57bf28e9d62134222cce8daaab0079e){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageAddNoise.json)

画像にノイズを追加します。

少しニッチなのですが、image2imageを行う際、あえてノイズを乗せることで低denoise設定でもディテールを増やすテクニックがあります。

cf. [ピクセル画像にノイズを追加して、低denoiseでのimage2imageのディテールを増やす](https://scrapbox.io/work4ai/%E3%83%94%E3%82%AF%E3%82%BB%E3%83%AB%E7%94%BB%E5%83%8F%E3%81%AB%E3%83%8E%E3%82%A4%E3%82%BA%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%97%E3%81%A6%E3%80%81%E4%BD%8Edenoise%E3%81%A7%E3%81%AEimage2image%E3%81%AE%E3%83%87%E3%82%A3%E3%83%86%E3%83%BC%E3%83%AB%E3%82%92%E5%A2%97%E3%82%84%E3%81%99)

---

## モルフォロジー変換

![](https://gyazo.com/db828b756ce851d763f9589b267f6002){gyazo=image}

[](/workflows/data-utilities/color-adjustments/ImageMorphology.json)

聞き慣れない言葉かもしれませんが、主に白黒のマスク画像に対して処理を行うものです。
「線を太らせる（膨張）」「ノイズを除去する（収縮）」といった処理が可能です。

cf. [OpenCV-Python/モルフォロジー変換](https://labs.eecs.tottori-u.ac.jp/sd/Member/oyamada/OpenCV/html/py_tutorials/py_imgproc/py_morphological_ops/py_morphological_ops.html#id5)

---

## 本格的な色調補正（カスタムノード）

Photoshopで行うような、より実用的な画像編集機能を追加するカスタムノードは星の数ほどあります。
その中でも、基本的な機能が網羅されており、かつシンプルで使いやすいものを紹介します。

### ComfyUI-Image-Effects

- **[orion4d/ComfyUI-Image-Effects](https://github.com/orion4d/ComfyUI-Image-Effects)**

![](https://i.gyazo.com/e1ecb574e0c11da63b0c6f8cee7a9f87.png){gyazo=image}

色相・彩度・明度の調整（HSV調整）や、トーンカーブのような調整、各種フィルターなど、人間が調整したいと思う機能の多くが含まれています。
詳しい機能一覧はリポジトリのドキュメントを確認してください。
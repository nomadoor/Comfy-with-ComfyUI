---
layout: page.njk
lang: ja
section: basic-workflows
slug: liveportrait
navId: liveportrait
title: "LivePortrait"
summary: "LivePortraitで1枚の顔写真から表情や首振りをコントロールする"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/0df8e012722c39159be1762a9a38ea99.png"
tags: ["talking-head"]
---

## LivePortraitとは？

[LivePortrait](https://liveportrait.github.io/) は、1枚の顔写真を、別の動画やパラメータに合わせて動かすための**キーポイントベースの Talking Head モデル**です。

写真の中の顔に打ったキーポイントを手がかりに、Photoshop の「ゆがみツール」を AI が 1 秒間に何十回も自動で実行しているようなイメージで変形させています。

参照動画と同じ表情・首振りをさせたり、顔のパーツごと（目・口・首の向きなど）に微調整することも出来ます。  
最近の動画生成モデルを使ったものほどの「何でもあり感」はないものの、**拡散モデルではないぶん非常に軽く、ほぼリアルタイムで動かせる**のが大きな特徴です。

インスタレーションに使ってもいいですし、「まぶたを少し閉じる」「顔を少し下に向かせる」といった、生成した画像の微調整に使うのもかなり便利です。

---

## カスタムノード

- [PowerHouseMan/ComfyUI-AdvancedLivePortrait](https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait)

---

## image2image

入力した人物画像の顔の向き・表情を変化させます。  
大きく 2 つのコントロール方法があります。

- パラメータで表情を調整する
- 参照画像と同じ表情にする

### パラメータで表情を調整する

![](https://gyazo.com/f3793dcde8d6e286a67c3dd41b732da5){gyazo=loop}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2i.json)

- 色々なパラメータがありますが、触ってみるのが早いですね。
- この動画のように、`▷ Run (On Change)` を使うと便利です。

### 参照画像から編集する

![](https://gyazo.com/0df8e012722c39159be1762a9a38ea99){gyazo=image}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2i_ref.json)

- 先ほどの workflow に `sample_image` を加えるだけです。
- `sample_parts` から、どの部位を参照画像に追従させるか選べます。
  - `OnlyExpression` … 表情のみ
  - `OnlyRotation` … 顔の向きのみ
  - `OnlyMouth` … 口のみ
  - `OnlyEyes` … 目のみ
  - `All` … 全て

参照画像の表情（向き）にさせたうえで、パラメータを使って微調整することもできます。

---

## image2video

画像内の人物を、パラメータや参照動画に従って動かします。

### motion_link

`Expression Editor (PHM)` でいくつもの表情を作り、その表情を次へ次へ変化させていくことで動画を作ることが出来ます。

![](https://gyazo.com/adf677e141945fd7d957acb2e26c02ec){gyazo=loop}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2v_motion.json)

- 🟨 `Advanced Live Portrait (PHM)` ノード
  - `animate_without_vid` を `true` に
  - その下のコマンド欄に、どの表情にどれだけかけて変化させるかを設定します。

コマンド欄のフォーマットは次のようなイメージです。

```text
表情のインデックス = その表情に「変化していくフレーム数」:「その表情のまま待つフレーム数」
````

例えば、次のように書いた場合を考えてみます。

```text
1 = 1:0
2 = 15:0
3 = 20:10
```

* `1 = 1:0`

  * 変化フレーム 1、待ちフレーム 0
  * この表情から始まり、すぐに次の表情へ変化します。
* `2 = 15:0`

  * 15 フレームかけて 1 の表情からこの表情へ変化し、すぐに次の表情へ移ります。
* `3 = 20:10`

  * 20 フレームかけて 2 の表情からこの表情へ変化し、そのあと 10 フレーム保持します。

この場合、合計 46 フレームの動画が出来ます。

### 参照動画から転送する

上では少しトリッキーなことをしましたが、実際にはこちらの使い方のほうがメインになると思います。

![](https://gyazo.com/c893e38c12859f8f20ff1e0fca545788){gyazo=image}

[](/workflows/basic-workflows/liveportrait/LivePortrait_i2v_ref.json)

* 🟨 `driving_images` に参照動画を入力するだけです。

参照動画側の表情・首振りを、そのまま入力画像に転送してくれます。
もちろん、上の `motion_link` と組み合わせて使うことも出来ます。

---

## video2video

動画の中の人物の表情を参照動画に合わせます。

![](https://gyazo.com/1a0205956e78b32045372f207582566d){gyazo=loop}

[](/workflows/basic-workflows/liveportrait/LivePortrait_v2v_ref.json)

- 🟨 `src_images`、 `driving_images` の両方を動画にするだけです。
* ベース動画のカメラワークや背景はそのままに、人物の表情・口パクだけを差し替えることが出来ます。

---
layout: page.njk
lang: ja
section: notes
slug: comfyui-video-stabilizer
navId: comfyui-video-stabilizer
title: "ComfyUI Video Stabilizer"
created: 2026-07-03
updated: 2026-07-03
noteTags: ["project", "custom-nodes"]
summary: "ComfyUIで動画の手ブレ補正、手ブレ復元、人工的な手ブレ追加を行うカスタムノード"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## ComfyUI Video Stabilizer

[ComfyUI Video Stabilizer](https://github.com/nomadoor/ComfyUI-Video-Stabilizer) は、ComfyUI 上で動画の手ブレ補正を行うための custom node です。

主に以下の3つの機能があります。

- 動画の手ブレを補正する
- 手ブレ補正した動画から、元の手ブレを復元する
- 人工的な手ブレを加える

---

## インストール

[nomadoor/ComfyUI-Video-Stabilizer](https://github.com/nomadoor/ComfyUI-Video-Stabilizer)

- `ComfyUI Manager` からインストールしてください。

---

## 手ブレ補正

手ブレ補正には、`Video Stabilizer Classic` または `Video Stabilizer Flow` を使います。

機能としては全く同じで、処理方法が違います。

Flow の方が少し重いですが、性能は大分良いので、基本的には Flow をオススメします。

![](https://gyazo.com/779732831dc0e69b5eae8519d4599d24){gyazo=image}

[](/workflows/notes/comfyui-video-stabilizer/Video_Stabilizer_Flow.json)


### パラメータ

`Video Stabilizer Classic` と `Video Stabilizer Flow` のパラメータは共通です。

| Parameter | 説明 |
| --- | --- |
| `frame_rate` | 入力動画の FPS。時間方向の smoothing の基準になります。 |
| <span style="white-space: nowrap;">🎞️ <code>framing_mode</code></span> | 手ブレ補正で生じる画面端の欠けをどう扱うか。動画で差が分かりやすい重要パラメータです。 |
| `transform_mode` | カメラの動きをどの変換として推定するか。 |
| <span style="white-space: nowrap;">🔒 <code>camera_lock</code></span> | 三脚で撮ったような、かなり固定された映像に寄せます。|
| `strength` | 推定したカメラの動きをどれくらい取り除くか。`0.0` はほぼ元の動きのまま、`1.0` は強く補正します。 |
| `smooth` | カメラの動きをどれくらいなめらかにするか。値を上げるほど急な揺れが抑えられます。 |
| `keep_fov` | `framing_mode` が `crop` のときだけ有効。画角をどれくらい維持するかを指定します。`1.0` はズーム少なめ、`0.0` は画角を犠牲にして余白を消します。 |
| `padding_color` | padding が出る部分の色。後段で inpaint / outpaint する場合は `padding_mask` を使うので、色そのものはあまり重要ではありません。 |

### 🎞️ framing_mode

![元動画](https://gyazo.com/32044ef9e564ad2228cdae872e9a35ed){gyazo=loop} ![crop](https://gyazo.com/f901016b9fd5d2ecc40db8430ae8ffef){gyazo=loop} ![crop_and_pad](https://gyazo.com/b7f5e7145c066ab0b94b20a401b79690){gyazo=loop} ![expand](https://gyazo.com/971541da6bcc4659360cc72b2c008d8c){gyazo=loop}

- `crop`
  - 余白が見えないように、映像を少しズーム / クロップします。
  - 揺れが大きいほど画角が狭くなります。
- `crop_and_pad`
  - なるべく元の画角を保持し、足りない部分を padding で埋めます。
  - padding 部分は `padding_mask` として出力されます。
- `expand`
  - 全くクロップせず、必要な分だけキャンバスを広げます。

一般的な編集ソフトでは `crop` に近い処理しか使いませんが、動画生成モデルを使うと padding 部分をマスクとして outpainting する、といった面白い使い方ができます。

### 🔒 camera_lock

`camera_lock` を有効にすると、完璧ではありませんが、三脚で撮ったような固定カメラ寄りの動画に調整します。

通常の手ブレ補正は、カメラの動きを「なめらかにする」だけですが、`camera_lock` は、カメラの動きをできるだけ止めにいきます。

---

## 手ブレを復元する

動画編集では、手ブレを消してから処理したほうが安定することがありますが、そのままだと最初の臨場感が消えます。

`Video Stabilizer Motion Apply` を使うと、一度 Video Stabilizer で消した手ブレを、逆に適用して復元することができます。

![](https://gyazo.com/cf0408a1b507b5ecd0699c2e16ff539d){gyazo=image}

[](/workflows/notes/comfyui-video-stabilizer/Video_Stabilizer_to_Motion_Apply.json)

> `crop` や `crop_and_pad` で補正した場合、すでに切り落とした画素は戻せません。復元まで考える場合は、最初の手ブレ補正で `expand` を使うのがおすすめです。

---

## 人工的に手ブレを加える

AI で生成した動画…に限りませんが、カメラワークが滑らかすぎると少し CG 感が出ます。

そこで、あえて手ブレを加えることで、臨場感や生々しさを演出できます。

![](https://gyazo.com/695ab8d32156327393d57ac9432a1e62){gyazo=image}

[](/workflows/notes/comfyui-video-stabilizer/Video_Stabilizer_Shake.json)

`Video Stabilizer Shake Generator` で人工的なカメラ揺れを作り、これを `Video Stabilizer Motion Apply` に渡すことで、動画を揺らします。

### パラメータ

| Parameter | 説明 |
| --- | --- |
| `frame_rate` | 入力動画の FPS。動画側から FPS が渡っていない場合の fallback として使われます。 |
| `style` | 揺れの種類。 |
| `amount` | 揺れの強さ。少しだけ自然さを足したい場合は低めで十分です。上げすぎると普通に酔いやすい映像になります。 |
| `speed` | 揺れの速さ。ゆっくりした手持ち感にしたい場合は下げ、細かく忙しい揺れにしたい場合は上げます。 |
| `seed` | 揺れの乱数 seed。同じ設定でも `seed` を変えると揺れ方が変わります。 |

### style

![tripod](https://gyazo.com/e11213660ec6a4473adf422011c54eb1){gyazo=loop}  ![handheld](https://gyazo.com/1febc33e4083bc2f4ff0cf30ea6c8f28){gyazo=loop} ![walking](https://gyazo.com/f08efa57fb62658e2745509a5881462f){gyazo=loop} ![action](https://gyazo.com/112121eaed2dacbba58626dcd1ba110d){gyazo=loop} ![vibration](https://gyazo.com/437717f27d6f65bd5b6d15321b7b547d){gyazo=loop}

- `tripod`: ほぼ固定カメラに近い、ごく弱い揺れを足します。
- `handheld`: 手持ちカメラ風の自然な揺れを足します。
- `walking`: 歩きながら撮ったような上下・左右の揺れを足します。
- `action`: 強めで荒い動きを足します。
- `vibration`: 細かい振動を足します。

> `Video Stabilizer Shake Generator Manual` というノードもあります。
> こちらは preset ではなく、内部パラメータで細かく動きを調整することができます。

### Motion Blur

`Video Stabilizer Motion Apply` では、モーションブラーを追加することもできます。

少し追加してあげると、より実際のカメラ映像に近い雰囲気になりますね。

![元動画](https://gyazo.com/430ba048b450cebcc13829b3ac6151c8){gyazo=loop}  ![Blur: 0](https://gyazo.com/3cc5171d2839d110d07748395ddbf32f){gyazo=loop} ![Blur: 1.00](https://gyazo.com/a5a106e029af738b5642e1c0aff3c57c){gyazo=loop}

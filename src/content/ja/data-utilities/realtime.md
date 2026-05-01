---
layout: page.njk
lang: ja
section: data-utilities
slug: realtime
navId: realtime
title: "リアルタイム処理"
summary: "リアルタイム風の処理と、Instant/Change の使いどころ"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## ComfyUI はリアルタイム処理に向いていない

まず前提として、ComfyUI は **リアルタイム処理に向いていません**。  
すべての処理がひとつの workflow として実行され、1 回の処理が終わるまで次の動作に進めないためです。

ただし、処理が終わった直後に次の処理を自動的に流し込むことで、  
“リアルタイム風に見せる” ことはできます。

---

## Run(Instant) / Run(Change)

ComfyUI の入力ノードには、次の 2 つの実行モードがあります。

### Run (Instant)

![](https://gyazo.com/ba99c003cb82d4e8f2a483eab84e9f03){gyazo=loop}

- いったん実行が始まると、**処理が終わるたびに同じ workflow が自動で再実行されます**
- 止めたい場合は、他のモードに切り替えてください（そのままでは止まりません）

### Run (On Change)

![](https://gyazo.com/59133ed0ac3bcc4d02f0a34cc8bf9320){gyazo=loop}

- スライダーなどの値が変わったときだけ実行
- マウスを動かすたびに自動で処理がキューに入る


---

## リアルタイム image2image / video2video について

理論上、フレームごとに image2image / video2video をかけていけば「リアルタイム動画加工」に近い体験を作ることはできます。  
しかし、生成 AI の推論にはどうしても時間がかかるため、**実際の意味でのリアルタイム処理は非常に困難**です。


最新の研究でその実現の日は近づいてきていますが、まだしばらくは地道な最適化が必要になります。

- 解像度を下げる  
- 軽量モデルに切り替える  
- 動画専用の高速化技術 を使う（別ページで解説）

> 「リアルタイム image2image」は、**高速化技術ありきの特殊なワークフロー** になります。

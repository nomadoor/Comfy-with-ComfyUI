---

layout: page.njk
lang: ja
section: ai-capabilities
slug: human-motion-transfer
navId: human-motion-transfer
title: Human Motion Transfer
summary: 別の動画の動きをキャラクターに移す技術
permalink: /{{ lang }}/{{ section }}/{{ slug }}/
hero:
image:
------

## Human Motion Transferとは？

Human Motion Transfer は、1枚の人物画像（またはキャラ画像）に、**別の動画の全身モーションを移し替える**技術です。

ダンス動画やウォーキング動画の「動きだけ」を借りてきて、自分のキャラクターに演じてもらう、といった使い方が多いと思います。

[talking head](/ja/ai-capabilities/talking-head/) が主に「顔〜上半身」を対象に、表情や口の動きを細かく合わせるのに対し、Human Motion Transfer は **全身のポーズ** を中心に扱います。

---

## Animate Anyone以降の流れ

[BDMM](https://github.com/rocketappslab/BDMM?tab=readme-ov-file) など、以前からモーションを転送する研究は存在していましたが、画像生成AIコミュニティでこのタスクを広く知らしめたのは **[Animate Anyone](https://humanaigc.github.io/animate-anyone/)** でしょう。

1枚の人物画像と、別の人物のダンス動画などを入力にし、「そのキャラが同じ動きをするフルボディ動画」を生成するコンセプトで、多くのデモ動画が出回りました。

ただし Animate Anyone 自体はオープンソースではなかったため、実際に触れるモデルとしては、Stable Video Diffusion をベースに再現を試みた **MimicMotion** といったモデルが登場します。

![](https://gyazo.com/1e1bb54d4617ed57e696502727b80092){gyazo=loop}

[](/workflows/ai-capabilities/human-motion-transfer/MimicMotion.json)

---

## DiT世代とWan-Animate

DiTベースの動画生成モデルの登場によって、Human Motion Transfer も順当に進化しています。

### Wan2.1 VACE

Wan2.1 には、VACE と呼ばれる仕組みがあります。

VACE は、動画生成において `ControlNet`、`reference2video`、`inpainting` をまとめて扱えるフレームワークです。
`ControlNet Pose` と reference2video 的な操作を組み合わせることで、Human Motion Transfer に近いことができます。

専用の Human Motion Transfer モデルというよりは、「Wan2.1 を土台に、ポーズと参照動画を使って動きをコントロールするための土台」として使われます。

### Wan-Animate

よりモーション転送に特化したモデルが、[Wan-Animate](https://humanaigc.github.io/wan-animate/) です。

![](https://gyazo.com/9f0e0e20d750b2e207b01adc56858202){gyazo=image} ![](https://gyazo.com/d7f66b4153473136c37e48c7066709a1){gyazo=loop} ![](https://gyazo.com/86ed4c6aa64af79325ce18359a4021bc){gyazo=loop}

> Wan-Animate

キャラクター画像と、動きを持ったドライバー動画を入力にして、フルボディのモーションを転送することができます。

全身のポーズだけでなく、「顔のアップ動画」をドライバーとして使うこともできるため、**talking head 的な使い方と、Human Motion Transfer 的な使い方の両方をカバーできる**のが特徴です。

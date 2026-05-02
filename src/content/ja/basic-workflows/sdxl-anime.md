---
layout: page.njk
lang: ja
section: basic-workflows
slug: sdxl-anime
navId: sdxl-anime
title: "アニメ系 SDXL モデル"
created: 2025-12-09
updated: 2026-03-02
summary: "SDXLベースのアニメ系モデルのざっくり整理"
permalink: "/{{ lang }}/basic-workflows/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/6ee98c633b487214c13c32a9af7d64cb.png"
tags: []
---

## アニメ系 SDXL モデルとは？

Flux や Qwen-Image など新しいモデルが増えてきましたが、**アニメ系**に限って言えば SDXL ベースのモデルはいまも現役です。

より正確にいうと、SDXL 以降に登場したモデルはサイズが大きく、フルファインチューニングするケースがかなり減りました。

実写や CG ではベースモデルそのものの性能が十分になりましたが、アニメ系に強いベースモデルはいまだ決定版がなく、SDXLに頼らざるを得ないという状況です。

> 正直にいえば、私はアニメ系モデルにあまり詳しくありません。  
> ここに挙げられているものが代表だとは思いますが、時間があれば調べ直すつもりです。  
>
> アニメ系モデルは尖ったファインチューニングをされることが多く、パラメータも独特です。  
> 実際に使うときは、必ずモデル制作者の説明をよく読んでください。

このページでは、代表的なアニメ系 SDXL モデルとして、次の 5 系統だけを簡単に紹介します。

- **Animagine XL**
- **Illustrious XL**
- **Pony Diffusion V6 XL**
- **Anything XL**
- **WAI-illustrious**

---

## Animagine XL 系

Animagine XL は、アニメ系ファインチューニングモデルとしては最初期に登場したモデルです。  
比較的最近まで継続的なアップデートが続けられており、新しい知識を持った汎用的なモデルです。

### モデル

- [Linaqruf/animagine-xl](https://huggingface.co/Linaqruf/animagine-xl)
- [cagliostrolab/animagine-xl-4.0](https://huggingface.co/cagliostrolab/animagine-xl-4.0) (最新)

### workflow

![](https://gyazo.com/770f77d075432d57c742780aea2c9ce1){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/animagine-xl-4.0-opt.json)

---

## Illustrious XL 系

Illustrious XL は、[OnomaAI](https://www.illustrious-xl.ai/)が開発しているモデルです。  
他のモデルと明確に違うのは企業が開発している点でしょうか。  
一時は、次の Pony Diffusion V6 XL と並んで、アニメ系の二大巨頭だった記憶があります。

### モデル

- [OnomaAIResearch/Illustrious-XL-v2.0](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v2.0)

### workflow

![](https://gyazo.com/6cdc06d70882c9e1aecb272e980f1c2f){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/Illustrious-XL-v2.0.json)

---

## Pony Diffusion V6 XL

Pony Diffusion V6 XL は、名前の通りマイリトルポニーを生成するために作られたコミュニティ発のモデルです。  
日本アニメというよりファンタジー系・獣人・ケモノ系などに強いです。

### モデル

- [Pony Diffusion V6 XL](https://civitai.com/models/257749)

### workflow

![](https://gyazo.com/d1ffe73486004ff4986b887fe671e04e){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/ponyDiffusionV6XL_v6StartWithThisOne.json)

---

## Anything XL

Anything XL（万象熔炉）は、いくつかの有名なアニメ系 SDXL モデル（Animagine や Pony など）のマージモデルです。

### モデル

- [万象熔炉 | Anything XL](https://civitai.com/models/9409/or-anything-xl)

### workflow

![](https://gyazo.com/68b9972f6b29c83589bf50b92c3b5f76){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/AnythingXL_xl.json)

---

## WAI-illustrious 系

WAI-illustrious は、Illustrious XL をベースにした派生モデルの一つで、現在でもよく名前が挙がる人気系列です。  
2025 年時点でも v15 などのバージョンアップが続いており、ここで挙げられているものの中では比較的新しいモデルです。

### モデル

- [WAI-illustrious-SDXL](https://civitai.com/models/827184/wai-illustrious-sdxl) (V15.0)

### workflow

![](https://gyazo.com/da7b629edb4f3ca7e8c3eb24b10dc6ec){gyazo=image}

[](/workflows/basic-workflows/sdxl-anime/waiIllustriousSDXL_v150.json)

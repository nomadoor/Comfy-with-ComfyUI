---
layout: page.njk
lang: ja
section: ai-capabilities
slug: virtual-try-on
navId: virtual-try-on
title: "着せ替え"
summary: "服だけを別のデザイン・バリエーションに差し替えるタスク"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 着せ替えとは？

ID転送が「人に特化したSubject転送」だとしたら、着せ替えは **「服に特化したSubject転送」** と言ってよいでしょう。

**バーチャル試着（Virtual try-on / VTON）** とも呼ばれます。

特に商品画像として使う場合には、

- 模様やディテールが変わらないこと
- 体型やポーズに自然にフィットしていること

といった**一貫性**が重要になります。

---

## LoRA

なんでもですが、もっとも確実で柔軟性のある方法は、服のLoRAを作ってしまうことです。

inpaintingと組み合わせれば、特定の人物の服を着せ替えすることができます。

---

## catvton-flux

VTON系タスク（服の着せ替え）に特化したモデルはいくつもありますが、代表例として**catvton-flux**を挙げておきます。

基本的な考え方はIC-LoRA / ACE++と同じで、**横並べレイアウト**を使います。

![](https://gyazo.com/e06c4fb2aca261c0d37b792bea9dcc80){gyazo=image}

[](/workflows/ai-capabilities/virtual-try-on/catvton-flux-LoRA.json)

- **左側**：人物画像
- **右側**：着せたい服の画像 + マスク

モデルは両方を見ながら、「左の人物が右の服を着た画像」を生成します。

---

## 指示ベース画像編集（横並べ）

マルチリファレンスに対応していない[指示ベース画像編集](/ja/ai-capabilities/instruction-based-image-editing/)モデルは、本来「画像Aの要素を画像Bに持っていく」といったことはできません。

ただし、IC-LoRA / ACE++のときと同様に**横並べテクニック** とこのために学習したLoRAを使えば、近いことができます。


![](https://gyazo.com/30a82ecdd7a8cff9483a162decf7c31d){gyazo=image}

[](/workflows/ai-capabilities/virtual-try-on/Flux_Kontext_LoRA_v0.2.json.json)

- [nomadoor/crossimage-tryon-fluxkontext](https://huggingface.co/nomadoor/crossimage-tryon-fluxkontext)
- **左側**：人物画像
- **右側**：着せたい服の画像 + マスク

モデルは両方を見ながら、「左の人物が右の服を着た画像」を生成します。


> 自慢がしたかったため私が作ったLoRAを参考に出しましたが、その1日後に遥かに性能の高いQwen-Image-Edit用LoRAが発表されました☹️  
> [Clothes Try On (Clothing Transfer) - Qwen Edit](https://civitai.com/models/1940532?modelVersionId=2196278)

指示ベース画像編集を使うことの最大のメリットは **マスクが不要** になることです。

たとえば、ミニスカートの人物にジーパンを着せたい場合、通常のVTONではミニスカート部分だけでなく、ジーパンになる脚の部分も含めてマスクにしないといけません。  
この2つを合わせた領域のマスクを自動生成することは非常に難しいのです。

それに対して、指示ベース画像編集はマスクが不要なため、そうした面倒なことを気にせず着せ替えができます。

---

## 指示ベース画像編集（マルチリファレンス）

マルチリファレンスに対応した指示ベース画像編集モデルなら、もう簡単です。

着せ替えたい人物と服装をそれぞれ別スロットに渡し、「この人物に、この服を着せて」といった指示を与えるだけで、着せ替えをすることができます。
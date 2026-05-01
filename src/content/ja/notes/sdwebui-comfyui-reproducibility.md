---
layout: page.njk
lang: ja
section: notes
slug: sdwebui-comfyui-reproducibility
navId: sdwebui-comfyui-reproducibility
title: "Stable Diffusion web UI と ComfyUI で同じ画像は生成できない？"
created: 2025-12-13
updated: 2026-03-02
noteTags: ["concept", "reproducibility"]
summary: "同じモデル・同じシードでも画像が一致しない理由"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: ""
---

## Stable Diffusion web UI と ComfyUI で同じ画像は生成できない？

結論から言うと、**完全に同じ画像を出すのはほぼ不可能**です。

特に大きな要因となっているのが次の 2 つです。

- ノイズの生成方法が違う
- プロンプトの重み付けの計算方法が違う

---

## 1. ノイズの生成方法が違う

拡散モデルはノイズから画像を作り出す技術です。
つまりノイズの形（模様）が違えば、当然生成される画像も違ってきます。

このノイズ生成はかなりシビアで、**どこでノイズを作るか** が違うだけでも、同じシード値から別の模様になってしまいます。

- **ComfyUI**
  - ノイズを **CPU 側**で生成する
  - 異なる GPU や環境でも「同じシードなら同じノイズ」が出やすい設計

- **Stable Diffusion web UI**
  - ノイズを **GPU 側**で生成する

この違いのせいで、**同じシード値でも最初に使われるノイズのパターンがまったく別物**になります。
初期ノイズが違えば、拡散の過程をたどっても最終的な画像は一致しません。

---

## 2. プロンプトの重み付けの計算方法が違う

カッコやコロンで書く **「重み」** の扱いも、両者で挙動が違います。

- **ComfyUI**
  - `(masterpiece:1.2)` と書いたら **そのまま 1.2** として扱う
  - 複数ワードを書いても、基本的に **正規化しない**

- **Stable Diffusion web UI**
  - 複数の重みをまとめて **正規化（ならす）** する
  - ある単語の重みを上げると、他の単語の重みはまんべんなく下がる

公式 FAQ の例では、次のようになります。

**入力プロンプト**  
> `(masterpiece:1.2) (best:1.3) (quality:1.4) girl`

**Stable Diffusion web UI では、正規化される**  
> `(masterpiece:0.98) (best:1.06) (quality:1.14) (girl:0.81)`

**ComfyUI では正規化されない**  
> `masterpiece = 1.2 / best = 1.3 / quality = 1.4 / girl = 1.0` のまま

その結果、同じテキスト・同じ数値を打っても、**テキストエンコーダに渡される「実際の重み」が違う**ため、同じ絵にならないのです。

---

## では「完全に同じ画像」を出す方法は？

カスタムノードなどで Stable Diffusion web UI と同じ重み付けロジックを真似るアプローチはありますが、ノイズ生成の違いなどが残るため、**完全一致を狙うのはかなり難しい**です。

個人的には、2 つのツールは設計思想の違う「別物」だと割り切るほうが良いと思います。

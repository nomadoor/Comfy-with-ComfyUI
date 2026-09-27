---
layout: page.njk
lang: ja
section: data-utilities
slug: list
navId: list
title: "List"
created: 2025-11-26
updated: 2026-09-27
summary: "複数データを使った連続処理の考え方"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## List (リスト) とは？

List（リスト）は、複数のデータを「ひとまとめ」にして扱うための仕組みです。  
Queue が「同じ workflow を何回も実行する」のに対し、List は **1 回の実行で、複数の入力を順番に処理させる** イメージです。

- **Queue**
  - 同じ workflow を、外側から何度も回す
- **List**
  - 複数の入力を、内側で順番にさばく

「Run を何度も押すか」「1 回の Run で複数入力を流し込むか」の違い、と考えると分かりやすいです。

---

## List を作る・取り出す

### Create List ノード

手動で List を組み立てるためのノードです。  
任意の型（画像 / テキスト / 数値など）をまとめて 1 本の List にします。

![](/media/data-utilities/list/create_list.mp4){media=loop}

[](/workflows/data-utilities/list/create_list.json)

- ノードを接続するとスロットが増えるため、好きな数だけ追加できます。

### Get Item From List ノード

List から、好きな番号のアイテムを 1 件取り出せます。

![](/media/data-utilities/list/get_item_from_list.png){media=image}

[](/workflows/data-utilities/list/get_item_from_list.json)

- `index`：取り出したい位置（0, 1, 2…）

---

## 複数の List があるときの挙動

![](/media/data-utilities/list/legacy_gyazo_c001c197c385e9cdc2bdab3bc74f69c4.png){media=image}

[](/workflows/data-utilities/list/image2image_2list_3list.json)

例えばimage2imageで以下のような状況を考えましょう：

- 画像の List：3 枚  
- プロンプトの List：2 個  

このとき、「3 × 2 = 6 枚できそう」と思うかもしれませんが、実際の挙動は **“足並みを揃えて進む”** 形になります。

- 1 番目の画像 × 1 番目のプロンプト
- 2 番目の画像 × 2 番目のプロンプト
- 3 番目の画像 × **2 番目のプロンプトが再利用される**

つまり3枚の画像しか生成されません。

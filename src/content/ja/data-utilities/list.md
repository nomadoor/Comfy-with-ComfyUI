---
layout: page.njk
lang: ja
section: data-utilities
slug: list
navId: list
title: "List (リスト)"
summary: "複数データを使った連続処理の考え方"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## List とは？

List（リスト）は、複数のデータを「ひとまとめ」にして扱うための仕組みです。

Queue が「同じ workflow を何回も実行する」のに対し、List は **1 回の実行で、複数の入力を順番に処理させる** イメージです。

- **Queue**
  - 同じ workflow を、外側から何度も回す
- **List**
  - 複数の入力を、内側で順番にさばく

「Run を何度も押すか」「1 回の Run で複数入力を流し込むか」の違い、と考えると分かりやすいです。

---

## 必要なカスタムノード

ComfyUI の標準ノードだけでは List を作れないため、 カスタムノードを導入します。

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)
- [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)
- [godmt/ComfyUI-List-Utils](https://github.com/godmt/ComfyUI-List-Utils)

---

## List を作る

### Make List (Any) ノード

手動で List を組み立てるためのノードです。  
任意の型（画像 / テキスト / 数値など）をまとめて 1 本の List にします。

![](https://gyazo.com/b6433f5c097164a60a762e4cc24f442f){gyazo=image}

[](/workflows/data-utilities/list/Make_List_(Any).json)

- ノードを接続するとスロットが増えるため、好きな数だけ追加できます。
- 一度接続すると「そのデータ型で固定」されます。
  - 他のデータ型に切り替える場合は、Fix node (recreate) でリセットするか、新しくノードを置いてください


### Load Image List From Dir (Inspire) ノード

フォルダ内の画像をまとめて読み込み、`IMAGE` の List を作ります。

![](https://gyazo.com/4003d1d985e5153aab3cfe4f68c7d979){gyazo=image}

[](/workflows/data-utilities/list/Load_Image_List_From_Dir_(Inspire).json)

- `directory`: 読み込むフォルダのパスを入力
- `load_always`：フォルダの中身が変わったときに、毎回読み直すかどうか
  - load_always を disabled のまま使うと、ComfyUI は「前回と同じパスなら中身は同じ」とみなし、フォルダ内の変更（画像を追加・削除など）があっても読み直しません。
  - 画像を差し替えて再実行したい場合は、`load_always` を `enabled` に設定してください。

### Split String

1 つの長い `STRING` を、区切り文字で分割して List に変換します。  

![](https://gyazo.com/ec2466a80a39f2d4a1c79526167b5293){gyazo=image}

[](/workflows/data-utilities/list/Split_String.json)

- `delimiter`：区切り文字（`,` はプロンプトで多用するため避けたほうが無難かもしれません）
- `splitlines`：改行ごとに区切る
- `strip` : 前後の空白を削除

---

## Listから取り出す

### Select Nth Item (Any list) ノード

List から、指定した位置の要素を 1 件だけ取り出します。

![](https://gyazo.com/f1d3281970effbc7a2fc8a782f1a21ab){gyazo=image}

[](/workflows/data-utilities/list/Select_Nth_Item_(Any_list).json)

- `index`：抽出したい位置（0, 1, 2…）

---

## 複数の List があるときの挙動

![](https://gyazo.com/c001c197c385e9cdc2bdab3bc74f69c4){gyazo=image}

[](/workflows/data-utilities/list/image2image_2list-3list.json)

例えばimage2imageで以下のような状況を考えましょう：

- 画像の List：3 枚  
- プロンプトの List：2 個  

このとき、「3 × 2 = 6 枚できそう」と思うかもしれませんが、  
実際の挙動は **“足並みを揃えて進む”** 形になります。

- 1 番目の画像 × 1 番目のプロンプト
- 2 番目の画像 × 2 番目のプロンプト
- 3 番目の画像 × **2 番目のプロンプトが再利用される**

つまり3枚の画像しか生成されません。

---

## List と Batch の相互変換

このページでは詳細には踏み込みませんが、List と Batch は以下のような違いがあります。

- List  
  - 「複数の入力を順番に扱う」ためのまとまり  
- Batch  
  - モデル内部で「一度にまとめて」計算するためのまとまり

そのため、以下のような変換ノードが用意されています。

![](https://gyazo.com/6fdd90e230164e561c26cb73a80cc832){gyazo=image}

[](/workflows/data-utilities/list/List_To_Batch_To_List.json)

- `List To Batch` ノード
  - List の要素を Batch に変換し、一度に処理する
- `Batch To List` ノード
  - Batch を List に変換し、あとから 1 件ずつ扱えるようにする


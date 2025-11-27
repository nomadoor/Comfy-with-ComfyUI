---
layout: page.njk
lang: ja
section: data-utilities
slug: batch-video
navId: batch-video
title: "Batch と動画"
summary: "複数画像・動画フレームをまとめて扱う仕組み"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## Batch (バッチ) とは？

Batch（バッチ）は、複数の画像を **まとめて同時に処理する** ための仕組みです。  
List が「1 枚ずつ順番に処理する」のに対し、Batch は **1 回の実行で複数枚を一度に通す** という違いがあります。

Queue / List / Batch の関係は次のようになります。

- **Queue**  
  - 同じ workflow を外側から順番に実行する
- **List**  
  - 複数の入力を 1 枚ずつ順番に処理する（逐次処理）
- **Batch**  
  - 複数枚をひとまとめにして処理する（並列処理）

---

## 動画は Batch

動画は連番画像の集合から構成されているため、  
ComfyUI では **動画 = IMAGE の Batch** として扱われます。

そのため、通常の Batch 操作ノードは動画にもそのまま使えますし、  
逆に動画用ノードは、一般的な Batch の操作とほぼ同じ感覚で利用できます。  
動画と Batch を区別して考える必要はありません。

---

## Batch に入る画像は同じサイズである必要がある

Batch に入る画像は、**すべて同じサイズ** である必要があります。  
幅・高さが一致しない場合は、1 枚目を基準にして後続の画像が自動でクロップされます。

![](https://gyazo.com/8e42e9262108b5d6065a330d16863352){gyazo=image}

[](/workflows/data-utilities/batch-video/Diff_List-Batch.json)

> 上: List  
> 下: Batch  
> 形を揃える必要があるため、Batch では後ろの画像が切り詰められています。

---

## 並列処理の負荷（OOM の注意）

Batch は複数枚を同時に処理するため、必要なメモリ量もそのぶん増えます。  
例えば、1 分の動画をそのまま image2image に流すと、VRAM が足りず **OOM（メモリ不足）** になりやすくなります。

こういった場合は、**Batch → List に変換** して 1 枚ずつ処理するのが安全です。

---

## 必要なカスタムノード

基本的なものはコアノードとして用意されていますが、動画まで扱おうとすると少し厳しいです。

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)
- [ltdrdata/ComfyUI-Inspire-Pack](https://github.com/ltdrdata/ComfyUI-Inspire-Pack)
- [kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)
- [Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

---

## Batch を作る

### Batch Images ノード

2 つの `IMAGE` をまとめて Batch にします。

![](https://gyazo.com/aca8d944c0efb06dd3c36ff7f3060b15){gyazo=image}

[](/workflows/data-utilities/batch-video/Batch_Images.json)

- ノードを増やしていけば何枚でも Batch にできますが、3 枚以上では下のノードを使うほうが実用的です。

### Make Image Batch ノード

![](https://gyazo.com/221f5ed72be92b9215f9d0eaff753669){gyazo=image}

[](/workflows/data-utilities/batch-video/Make_Image_Batch.json)

- 接続先が増えるたびにスロットが追加され、好きな枚数をまとめられます。
- 一度接続するとそのデータ型で固定されます。  
  他のデータ型に変えたい場合は Fix node (recreate) を使うか、新しいノードを置いてください。

### Load Image Batch From Dir (Inspire) / Load Images (Path) ノード

フォルダ内の画像をまとめて Batch にします。

![](https://gyazo.com/fca9d0847d5c6a45aafa63c923b0e0d8){gyazo=image}

[](/workflows/data-utilities/batch-video/Load_Image_Batch_From_Dir-Load_Image_(Path).json)

- Inspire ノードはソートが可能  
- VHS ノードは「N 枚ごとに出力」など追加機能あり

---

## Batch を操作する

### Reverse Image Batch ノード

Batch の順番を逆向きにします。  
動画の逆再生などに使えます。

![](https://gyazo.com/433f02c632e722abfe3174cd7eb23837){gyazo=image}

[](/workflows/data-utilities/batch-video/Reverse_Image_Batch.json)

### RepeatImageBatch ノード

Batch 全体を指定回数繰り返します。

### ImageBatchRepeatInterleaving ノード

各フレームを指定数だけ繰り返します。

![](https://gyazo.com/1384e9cff563f76a7b15fbd0f70f1aa5){gyazo=image}

[](/workflows/data-utilities/batch-video/RepeatImageBatch-ImageBatchRepeatInterleaving.json)

> 上: RepeatImageBatch  
> 下: ImageBatchRepeatInterleaving

---

## Batch から取り出す

### ImageFromBatch ノード

Batch から任意の位置の画像を取り出します。

![](https://gyazo.com/6e48d34613f09e7dddfe3f40187f0de0){gyazo=image}

[](/workflows/data-utilities/batch-video/ImageFromBatch.json)

- `batch_index`: 取り出す位置（0 始まり）
- `length`: Batch の枚数

### Get Image or Mask Range From Batch ノード

一定範囲の画像（またはマスク）をまとめて取り出します。

### Select Every Nth Image ノード（Video Helper Suite）

N 枚飛ばしでフレームを取得します。

![](https://gyazo.com/f5b845e89342f120cc994b999e390e11){gyazo=image}

[](/workflows/data-utilities/batch-video/Select_Every_Nth_Image.json)

- `select_every_nth`: 取り出す間隔  
- `skip_first_images`: 先頭の枚数を飛ばす

---

## Batch ↔ List の変換

動画や Batch を読み込んだあと、1 枚ずつ処理したい場合は List に変換します。

### Image Batch to Image List ノード

![](https://gyazo.com/1b63fa52915e6e923b0802907066d81c){gyazo=image}

[](/workflows/data-utilities/batch-video/Image_Batch_to_Image_List.json)

逆に List を Batch にまとめるノードもあります。

- `Image List to Image Batch` ノード

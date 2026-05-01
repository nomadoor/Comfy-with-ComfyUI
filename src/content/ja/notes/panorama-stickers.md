---
layout: page.njk
lang: ja
slug: panorama-stickers
section: notes
navId: panorama-stickers
title: "ComfyUI Panorama Stickers"
created: 2026-03-02
updated: 2026-03-22
tags: ["experiment", "erp", "lora", "flux"]
summary: "ERP上に参照画像を貼り、残りをoutpaintで埋めるための専用UI"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/0732762b1efdf916b6a5836a9078e90e.png"
---

## ComfyUI Panorama Stickers

![](https://gyazo.com/748e50cd59976f45acabd7cf39d45bc6){gyazo=player}

参照画像から360度パノラマ画像を作る **FLUX.2 Klein 4B/9B 360 ERP Outpaint LoRA** 専用のUIです。

このLoRAの基本アプローチは outpainting です。  
パノラマを長方形に展開した画像を **ERP**（equirectangular panorama）と呼びますが、空のERPに任意の画像を貼り、残りの部分をoutpaintすればパノラマ画像が作れる、という発想ですね。

ただし、長方形に画像を貼っただけではERPとして自然に見えません。  
ERPはパノラマを展開したものなので、場所によって歪み方が変わります。また、ERPを見ながら「完成後のパノラマ」を想像してcontrol画像を作るのは、UXとしてイケてません。

このカスタムノードは、

- **パノラマの中に入り**
- **実際に景色を見ている感覚のまま参照画像を配置し**
- **その結果をERPとして出力する**

という流れで、control画像作りを楽にするためのUIです。  
出力ERPをそのまま FLUX.2 Klein に編集してもらうことで、パノラマ画像が完成します。

---

## ノード構成

このカスタムノードは、4つのノードで構成されています。

- `Panorama Stickers`：ERPキャンバスに画像を配置する
- `Panorama Cutout`：パノラマ内の任意視点を切り出す（撮影する）
- `Panorama Preview`：ノード上でプレビューする
- `Panorama Seam Prep`：左右端の継ぎ目を整える

---

## インストール

[nomadoor/ComfyUI-Panorama-Stickers](https://github.com/nomadoor/ComfyUI-Panorama-Stickers/tree/main)

- `ComfyUI Manager` からインストールしてください。

---

## キャンバスの基本操作

レガシー/Node2.0の両方で安定した動作をさせるため、基本的には専用のモーダルUIから操作する設計にしています。

> `Panorama Preview` だけはノード上でもプレビューできますが、操作はモーダルUIを前提にしています。

{% mediaRow img="https://gyazo.com/fc789c1056b38005c59d1e5be6c3095d{gyazo=loop}", width=60, align="left" %}

**モーダルUIを開く**

- `Open Stickers Editor`（Cutout / Preview も同様）ボタンをクリック

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/18d7795a35504cf58fe4813ed364a00e{gyazo=loop}", width=60, align="left" %}

**視点移動 / ズーム**

- 左ドラッグ / 中ドラッグで視点移動
- マウスホイールでFOV変更（ズームイン・アウト）

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/02163c2018590f8b022623f9e711878d{gyazo=loop}", width=60, align="left" %}

**右下ボタン**

- 視点初期化
- ガイド線表示切替

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ec0a8aaafab38c71dd23bdb075f224d5{gyazo=loop}", width=60, align="left" %}

**描画方法切り替え**

- 左上トグルで `Panorama` / `ERP（展開）` を切り替え

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/0873609554f60abe700f435144d23936{gyazo=loop}", width=60, align="left" %}

**ドラッグ方向**

- Inspector の `UI Setting` → `Inverted` で反転

{% endmediaRow %}


## Panorama Stickers

ERPキャンバスに参照画像を置いていくためのEditorです。

{% mediaRow img="https://gyazo.com/217f50a8bb037ca6c10ce55cd230bf8d{gyazo=loop}", width=60, align="left" %}

**画像の追加**

- `+ Image` ボタン、またはドラッグ&ドロップで追加
- 追加直後は視点の中心付近に配置されます

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e9907e0255952679f448d7796dd9d719{gyazo=loop}", width=60, align="left" %}

**画像の移動・拡大・回転**

- 画像ドラッグで移動
- 画像を選択するとハンドルが出るため、各ドットを掴んで変形できます
  - `Shift`を押しながら回転で45度ずつ回転します
- Inspectorのスライダーでも調整できます

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/e7ca94b114093b218c82a333761021a3{gyazo=loop}", width=60, align="left" %}

**重なり順 / 複製**

- 画像を選択すると、画像下にUIが表示されます
- ボタンで最前面・最背面へ移動できます
- 複製ボタンで同じ画像を追加できます

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/6080f7006f8dfdfcd1e15fd30a394e50{gyazo=loop}", width=60, align="left" %}

**画像の削除**

- 画像下の削除ボタン or `Delete` キー
- キャンバス下部の `Clear all` ボタンからは全削除もできます

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ba80aed93898c33f2f2588f7245723eb{gyazo=loop}", width=60, align="left" %}

**Inspectorから画像選択**

- Inspectorの `Image` から画像を選ぶと、その画像が中心に来るように視点が移動します

{% endmediaRow %}


## Panorama Cutout

パノラマの中に入り、カメラで撮影するように任意視点を切り出すEditorです。

{% mediaRow img="https://gyazo.com/e7e7075770cd2693e94334bf09743fac{gyazo=loop}", width=60, align="left" %}

**フレームの追加**

- 下部の `+ Add frame` で追加します
- 右上にプレビューが表示されます

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/033ef3fd91b9bb4cc283906ae53b7269{gyazo=loop}", width=60, align="left" %}

**フレームの移動・拡大・回転**

- 基本は `Panorama Stickers` と同じです
- 辺をドラッグすることで、縦横比も変えられます

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/da133d6d6fc2c17e7f4a59f716b92fec{gyazo=loop}", width=60, align="left" %}

**既定のアスペクト比へ変更**

- フレーム選択時のUIから `1:1` や `3:2` などを選べます
- 横の `Rotate 90°` で縦横を切り替えられます

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a6d69406f8888c84cbbdcbd42a184107{gyazo=loop}", width=60, align="left" %}

**フレーム位置へ視点移動**

- 下部UIの `📷` ボタンで、フレーム位置に視点が移動します

{% endmediaRow %}


## Panorama Preview

ノード上でプレビューを見られるノードです。モーダルUIは他と共通ですが、機能を絞っています。

{% mediaRow img="https://gyazo.com/fe09e529eea57ebf960f97b0d7720514{gyazo=loop}", width=60, align="left" %}

**ノード上プレビュー**

- 基本的にはモーダルUIと同じようにドラッグ、マウスホイルで操作することができます。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/c98e12d762e11fb8922ffa3991912d6b{gyazo=image}", width=60, align="left" %}

**全画面表示**

- 右下ボタンで全画面表示にできます
- `Esc` で解除します

{% endmediaRow %}


## Panorama Seam Prep

どんなに上手く学習しても、パノラマ画像の左右端（シーム）の完全一致は難しいです。  
このノードは、境目が画像の中心になるように画像をずらし、境目をinpaintingで後処理するときに使用します。

![](https://gyazo.com/09deac88400d8e8d1f9301eda07c7b13){gyazo=image}

[](/workflows/notes/panorama-stickers/PanoramaSeamPrep.json)

- `seam_width_px` : マスクの幅を指定します
- `seam_center_offset_px` : 境界を中心からずらします
- `mask_blur_px` : マスクの両端をぼかします
  - inpaintingした結果を元の画像に合成するときに使用します

---

## workflow

実際にLoRAを使って、参照画像からERPパノラマを作ってみます。

> 既知の問題ですが、DistilledモデルではLoRAがほとんど効きません。対策を探していますが、現状は base model 前提で使ってください。

### モデルのダウンロード

- diffusion_models

  - [flux-2-klein-base-9b-fp8.safetensors](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-9b-fp8/blob/main/flux-2-klein-base-9b-fp8.safetensors)
  - [flux-2-klein-base-4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/diffusion_models/flux-2-klein-base-4b.safetensors)

- loras

  - [flux-2-klein-9B-360-erp-outpaint-lora_V1.safetensors](https://huggingface.co/nomadoor/flux-2-klein-9B-360-erp-outpaint-lora/blob/main/flux-2-klein-9B-360-erp-outpaint-lora_V1.safetensors)
  - [flux-2-klein-4B-360-erp-outpaint-lora_V1.safetensors](https://huggingface.co/nomadoor/flux-2-klein-4B-360-erp-outpaint-lora/blob/main/flux-2-klein-4B-360-erp-outpaint-lora_V1.safetensors)

- text_encoders

  - [qwen_3_8b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/text_encoders/qwen_3_8b.safetensors)
  - [qwen_3_4b.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-4b/blob/main/split_files/text_encoders/qwen_3_4b.safetensors)

- vae

  - [flux2-vae.safetensors](https://huggingface.co/Comfy-Org/vae-text-encorder-for-flux-klein-9b/blob/main/split_files/vae/flux2-vae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂diffusion_models/
    │   ├── flux-2-klein-base-9b-fp8.safetensors
    │   └── flux-2-klein-base-4b.safetensors
    ├── 📂loras/
    │   ├── flux-2-klein-9B-360-erp-outpaint-lora_V1.safetensors
    │   └── flux-2-klein-4B-360-erp-outpaint-lora_V1.safetensors
    ├── 📂text_encoders/
    │   ├── qwen_3_8b.safetensors
    │   └── qwen_3_4b.safetensors
    └── 📂vae/
        └── flux2-vae.safetensors
```

### flux-2-klein-9B-360-erp-outpaint

![](https://gyazo.com/fc52e8eca49723f6ca9fd426abadc636){gyazo=image}
[](/workflows/notes/panorama-stickers/flux-2-klein-9B-360-erp-outpaint.json)

- `Panorama Stickers` で参照画像を配置してERPを作ります
- プロンプトは「トリガーワード + α」でOKです

```text
Fill the green spaces according to the image. Outpaint as a seamless 360 equirectangular panorama (2:1). Keep the horizon level. Match left and right edges.
```

> 生成されるのはERP（2:1）画像です。そのままだと見づらいので、`Panorama Preview` や `Panorama Cutout` で確認・撮影してください。

### flux-2-klein-4B-360-erp-outpaint

![](https://gyazo.com/fa6b005b1c0389c38728310e5b7a3085){gyazo=image}
[](/workflows/notes/panorama-stickers/flux-2-klein-4B-360-erp-outpaint.json)

---
layout: page.njk
lang: ja
slug: saving-and-loading-workflows
navId: saving-and-loading-workflows
title: "workflowの保存・読み込み"
summary: "workflowの保存・読み込みについて"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 公式テンプレートを開く

- サイドバーの `Templates` アイコンをクリックし、好きなものを選択

![](https://gyazo.com/a33cb7c6384321e684d9b9fd6eb1817c){gyazo=loop}

---

## workflowの保存（ブラウザ内）

作成したworkflowをComfyUI内に保存します。

- 1. ヘッダーの `Workflow` をクリックし、`Save` または `Save as` を選択
- 2. 好きな名前を付けて `Confirm`（または `Enter` キー）

保存したworkflowは、左サイドバーのフォルダアイコン 📂（または `W` キー）から呼び出せます。

![](https://gyazo.com/b9970219294a79c53a651585baa179b4){gyazo=loop}

---

## workflowの書き出し（ファイルとして保存）

workflowを `.json` ファイルとして書き出し、共有やバックアップに使います。

### JSONファイルとして書き出し

- 1. ヘッダーの `Workflow` をクリックし、`Export` を選択
- 2. 好きな名前を付けて `Confirm`（または `Enter` キー）
- 3. 保存先を選択して保存

![](https://gyazo.com/e13e29d51a26ea2a29ec87cc872bf522){gyazo=loop}

### 生成画像に埋め込んで保存

ComfyUIの標準的な画像保存ノード（`Save Image` など）で生成された画像には、自動的にworkflowのメタデータ（設定情報）が埋め込まれています。この画像を読み込むだけで、生成時のworkflowを再現できます。


### スクリーンショットとして保存

**[ComfyUI-Custom-Scripts](https://github.com/pythongosssss/ComfyUI-Custom-Scripts)** などのカスタムノードを導入すると、workflow全体のスクリーンショットを撮影し、そこにメタデータを埋め込んで保存することができます。

![](https://gyazo.com/a66d20bf36c02fa63c6cd5ab957fe4db){gyazo=loop}


---

## workflowの読み込み

### 保存したworkflowの読み込み

ComfyUI内に保存したworkflowを開きます。

- 1. 左サイドバーのフォルダアイコン 📂（または `W` キー）をクリック
- 2. リストから開きたいworkflowをクリック

![](https://gyazo.com/7c2149e7af5d6f78a30c9c03ff671356){gyazo=loop}

### 外部ファイル（JSON / 画像）の読み込み

PCにある `.json` ファイルや、メタデータ付きの画像を読み込みます。

**方法A: メニューから**
- 1. ヘッダーの `Workflow` をクリックし、`Open` を選択（または `Ctrl + O`）
- 2. ファイルを選択して開く

**方法B: ドラッグ&ドロップ**
- `.json` ファイル、またはメタデータ埋め込み画像を、ComfyUIのキャンバス上にドラッグ&ドロップ

![](https://gyazo.com/bbd3e9f3833a08a9af16bc3625c4747a){gyazo=loop}


### テキストから読み込み

JSON形式のテキストデータをコピーしている場合、ComfyUI上でペースト（`Ctrl + V`）するだけでも読み込めます。

![](https://gyazo.com/2df1b87e2f4771e3ea2f718b55357435){gyazo=loop}

### 😎このサイトのworkflowを読み込む

このサイトで公開しているworkflowには、コピーボタンとダウンロードボタンを用意しています。
コピーボタンをクリックし、そのままキャンバス上で `Ctrl + V` すればworkflowを読み込めるのでぜひ活用してみてください。

[](/workflows/begin-with/saving-and-loading-workflows/Stable_Diffusion_1.5.json)

![](https://gyazo.com/13c0019ad1e471bcf89cdb4b17bc7d9c){gyazo=loop}
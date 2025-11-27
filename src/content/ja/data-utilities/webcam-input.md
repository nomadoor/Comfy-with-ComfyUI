---
layout: page.njk
lang: ja
section: data-utilities
slug: webcam-input
navId: webcam-input
title: "Webカメラ"
summary: "WebカメラやOBSの映像をComfyUIに取り込む方法"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/5c2f4a37547aa854b5dcc8d264ff962b.png"
---
## Webカメラ入力

ComfyUIは、PCに接続されたカメラ映像を画像として取り込むことができます。

### Webcam Captureノード

![](https://gyazo.com/2a7ab2f8dc9179e6c02d15e74dedcea3){gyazo=image}

- 1.  `Webcam Capture` ノードを追加
- 2. ブラウザからカメラの利用許可を求められた場合は、許可してください。
- 3.  `▷ Run` を実行すると、その瞬間のカメラ映像が画像として出力されます

---

## OBSを使ってPC画面を読み込む

配信ソフトとして有名な **[OBS Studio](https://obsproject.com/ja/download)** の **仮想カメラ** 機能を使用すると、デスクトップ画面や特定のウィンドウをWebカメラの映像としてComfyUIに送ることができます。

ComfyUIというかOBSの機能ですが、便利なので紹介します。

### 1. OBSの設定

OBSをインストールし、取り込みたい画面を設定します。

- **ソース設定（ウィンドウキャプチャ）**
  - ソースの `+` から `ウィンドウキャプチャ` を選択し、特定のソフト（例：ペイント）を指定します。
  - ![](https://i.gyazo.com/3ae7154d9a7d58b54a5e331858a119ad.png){gyazo=loop}
  - **キャプチャ方法**: 画面が真っ暗な場合、`Windows 10 (1903以降)` に変更すると映ることがあります（Affinityなどの描画系ソフトでよく起こります）。
  - **カーソル**: お好みで「カーソルをキャプチャする」のチェックを外してください。

- **キャンバスサイズ**
  - 必須ではありませんが、`設定` → `映像` から、ComfyUIで生成する解像度に合わせておくとアスペクト比の管理が楽になります。

### 2. 仮想カメラの開始

OBS右下の `コントロール` にある **仮想カメラ開始** をクリックします。
これでOBSの画面がWebカメラとして認識されるようになります。


### 3. ComfyUIでの読み込み

ComfyUIに戻り、`Webcam Capture` ノードの設定を変更します。

- 1.  カメラ選択プルダウンから **`OBS Virtual Camera`** を選択
    - ※表示されない場合は、ComfyUIをリロード(`F5`)してください。
- 2.  実行すると、OBSの画面が画像として取り込まれます。

### リアルタイム実行 (Auto Queue)

![](https://gyazo.com/6b57f5d40d4c55b13d82bf6737a24e5a){gyazo=loop}

静止画として1枚撮るだけなら通常の実行で良いですが、お絵描きをリアルタイムでAI変換したい場合などは、`▷ Rum` メニューの **`Run (Instant)`** を使用します。

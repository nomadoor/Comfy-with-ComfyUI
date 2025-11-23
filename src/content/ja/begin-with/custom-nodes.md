---
layout: page.njk
lang: ja
slug: custom-nodes
navId: custom-nodes
title: "カスタムノード"
summary: "カスタムノードについて"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## カスタムノードとは

デフォルトにはない機能を追加するプラグインのようなものです。
AIモデルの拡張、処理の効率化、UIの改善など、ComfyUIの可能性を大きく広げます。

## カスタムノードのリスク

便利ですが、**入れすぎるとトラブルの原因になります。**
基本的にはデフォルトノードで構成し、必要最低限に留めることを推奨します。

- **競合**: ノード同士の相性が悪くエラーが出る
- **更新停止**: 作者が更新を辞めてしまい、新しいComfyUIで動かなくなる
- **セキュリティ**: 悪意のあるコードが含まれている可能性（ゼロではありません）

## カスタムノードのインストール

基本的には **ComfyUI Manager** からインストールします。

### ComfyUI Managerを使う（推奨）

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

1. メニューの `Manager` をクリック
2. `Custom Nodes Manager` をクリック
3. 検索バーにノード名を入力して検索
4. `Install` をクリック（バージョンは通常 `latest` でOK）
5. `Restart` をクリックしてComfyUIを再起動

### 手動でインストールする

Managerにない場合や、開発中の最新版を使いたい場合に行います。

1. ターミナルで `ComfyUI/custom_nodes` フォルダに移動
2. `git clone` コマンドでリポジトリをダウンロード
    ```powershell
    cd ComfyUI/custom_nodes
    git clone https://github.com/username/repository-name.git
    ```
3. 必要に応じてライブラリをインストール
    ```powershell
    # venv
    cd path/to/ComfyUI
    venv/Scripts/activate
    cd custom_nodes/カスタムノード
    pip install -r requirements.txt

    # portable版
    cd path/to/ComfyUI/custom_nodes/カスタムノード
    ../../../python_embeded/python.exe -s -m pip install -r requirements.txt
    ```
4. ComfyUIを再起動

## 推奨カスタムノード

基本はデフォルトノードで組みますが、以下のノードは利便性が高いため導入を推奨します。

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**
  - 多くのユーティリティー機能、動画生成の補助
- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
  - バッチ処理、リスト操作、Detailer
- **[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)**
  - 動画の読み込み・書き出し

### あると便利なノード

- **[rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**
  - 比較スライダー、フォルダのネスト表示、高度な計算
- **[crystian/ComfyUI-Crystools](https://github.com/crystian/ComfyUI-Crystools)**
  - リソースモニター

## ComfyUIネイティブ vs Wrapper

カスタムノードには大きく分けて2つのタイプがあります。

### 1. ComfyUIネイティブ

ComfyUIの仕組みに合わせて設計されたノードです。

- **メリット**: ComfyUIの最適化（メモリ管理など）の恩恵を受けられる

ComfyUIの強みである「低スペックでも動く」特徴を活かせます。

### 2. Wrapper（ラッパー）

外部のコードをComfyUI上で動くように包んだだけのノードです。

- **デメリット**: 最適化が進んでいないことが多い（重い、エラーが出やすい）
- **背景**: 研究用コードなどを手軽に動かすために作られることが多い

最新技術を試すには必須ですが、あくまで試験運用として使うのが無難です。

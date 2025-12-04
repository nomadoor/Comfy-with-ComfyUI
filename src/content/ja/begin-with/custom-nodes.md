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

他のソフトウェアでは「MOD」や「プラグイン」と呼ばれたりしますが、デフォルトにはない機能を追加するプラグインのようなものです。

デフォルトでは使えないAIモデルに対応させたり、複雑な処理を一つのノードにまとめたり、はたまたデザインをかっこよくしたり、とComfyUIを強力なものにしている機能の一つです。

## カスタムノードのリスク

とても便利ですが、**入れれば入れるだけトラブルに合う確率は上がっていく** ということは覚えておくべきでしょう。

- ノード同士の相性が悪くエラーが出る
- 作者が更新を辞めてしまい、新しいComfyUIで動かなくなる
- 悪意のあるコードが含まれている可能性（ゼロではありません）

もちろん、カスタムノードを入れなければ使えない技術は多くあるので適宜導入していきますが、**「少なければ少ないほうが良い」** ということは忘れないでください。


## カスタムノードのインストール

基本的には **ComfyUI Manager** からインストールします。

### ComfyUI Managerを使う（推奨）

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

- 0. ComfyUI Managerのインストール
  - ComfyUI Managerがまだインストールされていない場合は、[セットアップ - ComfyUI Manager の導入](/ja/begin-with/setup/#3-comfyui-manager-の導入)を参考にインストールしてください。
- 1. メニューの `Manager` をクリック
- 2. `Custom Nodes Manager` をクリック
- 3. 検索バーにノード名を入力して検索
- 4. `Install` をクリック（バージョンは通常 `latest` でOK）
- 5. `Restart` をクリックしてComfyUIを再起動

### 手動でインストールする

Managerにない場合や、開発中の最新版を使いたい場合に行います。

- 1. ターミナルで `ComfyUI/custom_nodes` フォルダに移動
- 2. `git clone` コマンドでリポジトリをダウンロード
    ```powershell
    cd ComfyUI/custom_nodes
    git clone https://github.com/username/repository-name.git
    ```
- 3. 必要に応じてライブラリをインストール
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
- 4. ComfyUIを再起動

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

あまり覚えておく必要はないですが、カスタムノードには大きく分けて2つのタイプがあります。

### 1. ComfyUIネイティブ

[ComfyUIとは？](/ja/begin-with/what-is-comfyui/)でも少し話しましたが、ComfyUIの真価は、AIモデルを家庭用PCでも快適に動かせるようにする**最適化**にあります。

このコア機能を活かしたカスタムノードはComfyUIネイティブと呼ばれ、ComfyUIの強みを活かせます。

### 2. Wrapper（ラッパー）

外部のコードをComfyUI上で動くように包んだ(ラップした)ノードです。

- **デメリット**: 最適化が進んでいないことが多い（重い、エラーが出やすい）
- **背景**: 研究用コードなどをそのままComfyUI上で動かすために作られることが多い

もちろん、ラッパーでしか使えない技術も多くありますし、その多くが独自に最適化処理をしています。開発者には深く感謝をしながらも、あくまでテスト運用として使うのが良いでしょう。

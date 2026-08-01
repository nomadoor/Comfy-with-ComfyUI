---
layout: page.njk
lang: ja
section: begin-with
slug: custom-nodes
navId: custom-nodes
title: "カスタムノード"
created: 2025-11-20
updated: 2026-08-01
summary: "カスタムノードについて"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## カスタムノードとは

他のソフトウェアでは「MOD」や「プラグイン」と呼ばれたりしますが、デフォルトにはない機能を追加するプラグインのようなものです。

デフォルトでは使えないAIモデルに対応させたり、複雑な処理を一つのノードにまとめたり、はたまたデザインをかっこよくしたり、とComfyUIを強力なものにしている機能の一つです。

---

## カスタムノードのリスク

とても便利ですが、**入れれば入れるだけトラブルに合う確率は上がっていく** ということは覚えておくべきでしょう。

- ノード同士の相性が悪くエラーが出る
- 作者が更新を辞めてしまい、新しいComfyUIで動かなくなる
- 悪意のあるコードが含まれている可能性（ゼロではありません）

もちろん、カスタムノードを入れなければ使えない技術は多くあるので適宜導入していきますが、**「少なければ少ないほうが良い」** ということは忘れないでください。

---

## カスタムノードのインストール

基本的には **ComfyUI Manager** からインストールします。

### ComfyUI Managerを使う（推奨）

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

1. ComfyUI Managerのインストール
   - ComfyUI Managerがまだインストールされていない場合は、[ComfyUI Manager](/ja/begin-with/comfyui-manager/)を参考にインストールしてください。
2. メニューの `Manager` をクリック
3. `Custom Nodes Manager` をクリック
4. 検索バーにノード名を入力して検索
5. `Install` をクリック（バージョンは通常 `latest` でOK）
6. `Restart` をクリックしてComfyUIを再起動

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

---

## とりあえず入れておいて欲しいカスタムノード

基本はデフォルトノードで組みますが、どうしても普段使いで足りないものがあるため、以下のノードは入れておいてください。

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**
  - 多くのユーティリティー機能、動画生成の補助
- **[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)**
  - 動画の読み込み・書き出し

### あると便利なノード

- **[rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**
  - 比較スライダー、フォルダのネスト表示、高度な計算
- **[crystian/ComfyUI-Crystools](https://github.com/crystian/ComfyUI-Crystools)**
  - CPU、RAM、GPU、VRAMなどをリアルタイムで表示するリソースモニター

---

## ComfyUIネイティブ vs Wrapper

あまり覚えておく必要はないですが、カスタムノードには大きく分けて2つのタイプがあります。

### 1. ComfyUIネイティブ

[ComfyUIとは？](/ja/begin-with/what-is-comfyui/)でも少し話しましたが、ComfyUIの真価は、AIモデルを家庭用PCでも快適に動かせるようにする**最適化**にあります。

このコア機能を活かしたカスタムノードはComfyUIネイティブと呼ばれ、ComfyUIの強みを活かせます。

### 2. Wrapper（ラッパー）

外部のコードをComfyUI上で動くように **包んだ(ラップした)** ノードです。

研究用コードなどをそのままComfyUI上で動かすために作られることが多いです。  
最適化が進んでいないことが多く、重かったり、エラーが出やすかったりと、安定しない傾向にあります。

もちろん、ラッパーでしか使えない技術も多くありますし、多く実装では独自に最適化処理をしています。開発者には深く感謝をしながらも、あくまでテスト運用として使うのが良いでしょう。

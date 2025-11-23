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

他のソフトウェアでは、プラグインやMODと呼ばれたりもしますが、デフォルトにはない機能を追加することが出来る機能であり、ComfyUIを強力なものにしている機能の一つです。

デフォルトのComfyUIでは動かすことの出来ないAIモデルを動かしたり、多くのノードが必要な処理を一つのノードにまとめたり、はたまたComfyUIをかっこいいデザインにしたりと、無限の可能性をもたらします。

---

## カスタムノードのリスク

カスタムノードは便利ですが、**入れれば入れるだけトラブルに合う確率も高くなります。**
逆に言えば、デフォルトノードだけで組めばほとんどトラブルに会うことはありません。

*   **競合**: ノード同士の相性が悪く、エラーが出る
*   **更新停止**: 作者が更新を辞めてしまい、新しいComfyUIで動かなくなる
*   **セキュリティ**: 悪意のあるコードが含まれている可能性がゼロではありません

もちろん、カスタムノードを入れなければ使えない技術は多くあるので適宜導入していきますが、**「少なければ少ないほうが良い」** ということは忘れないでください。

---

## カスタムノードのインストール

基本的に **ComfyUI Manager** からインストールすればOKです。
新しいカスタムノードは見つからないかもしれませんが、しばらく待てば出てくるはずです。ゆるりといきましょう。

### ComfyUI Managerを使う（推奨）

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

- 0. ComfyUI Managerのインストール
  - ComfyUI Managerがまだインストールされていない場合は、[セットアップ - ComfyUI Manager の導入](/ja/begin-with/setup/#3-comfyui-manager-の導入)を参考にインストールしてください。
- 1.  メニューの `Manager` ボタンをクリック。
- 2.  `Custom Nodes Manager` をクリック。
- 3.  検索バーにノード名を入力してカスタムノードを探します。
- 4.  `Install` ボタンを押してカスタムノードをインストールします。
  - バージョン選択肢がある場合、特にこだわりが無ければ`latest`を選んでください。
- 5.  ダウンロードが終わると再起動を促されます。`Restart`ボタンを押してComfyUIを再起動してください。

### 手動でインストールする

ComfyUI Managerに無い場合や、開発中の最新版を使いたい場合は手動でインストールします。基本的にはリポジトリのREAD MEに従ってください。

- 1.  ターミナルで `ComfyUI/custom_nodes` フォルダに移動します。
- 2.  `git clone` コマンドでリポジトリをダウンロードします。
    ```powershell
    cd ComfyUI/custom_nodes
    git clone https://github.com/username/repository-name.git
    ```
- 3. 必要に応じてライブラリをインストールします
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
- 4.  ComfyUIを再起動します。

---

## とりあえず入れておいて欲しいカスタムノード

基本的にはデフォルトノードだけで組みますが、どうしても足りない機能があるため、以下のカスタムノードは入れておいてください。

- **[kijai/ComfyUI-KJNodes](https://github.com/kijai/ComfyUI-KJNodes)**
  - 多くのユーティリティー機能、動画生成の補助

- **[ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)**
  - バッチ処理、リスト操作、Detailer

- **[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)**
  - 動画の読み込み・書き出し

## 入れなくても良いけれど便利なカスタムノード

- **[rgthree/rgthree-comfy](https://github.com/rgthree/rgthree-comfy)**
  - 比較スライダー、フォルダのネスト表示、高度な計算

- **[crystian/ComfyUI-Crystools](https://github.com/crystian/ComfyUI-Crystools)**
  - リソースモニター

---

## ComfyUIネイティブ vs Wrapper

あまり気にしなくてもいいですが、カスタムノードには大きく分けて2つのタイプがあります。

### 1. ComfyUIネイティブ
AIエンジンとしてのComfyUIを上手に活用し、拡張しているタイプです。

*   **メリット**: ComfyUIの最適化（メモリ管理など）の恩恵を受けられる

[ComfyUIとは](/ja/begin-with/what-is-comfyui/)のページでも書きましたが、ComfyUIの真価は「非力なPCでもAIモデルを動かせる」点にあります。この力を受け継いでいるのがネイティブなノードです。

### 2. Wrapper（ラッパー）
公開された外部のコードを、ただComfyUI上で動くように包んだ（ラップした）だけのタイプです。

*   **デメリット**: 最適化が進んでいないことが多い（重い、エラーが出やすい）
*   **背景**: 研究用のコードなどはComfyUIの仕組みに合わせるのが難しいため、こうならざるを得ない

もちろん、Wrapperでしか使えない最新技術もたくさんあります。独自の最適化を施してくれている開発者には感謝しつつ、あくまで試験運用として使いましょう。

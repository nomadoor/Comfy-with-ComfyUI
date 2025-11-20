---
layout: page.njk
lang: ja
slug: setup
navId: setup
title: "セットアップ"
summary: "セットアップについて"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUIのセットアップ

ComfyUIをローカル環境で動かす方法はいくつか用意されています。

* **ポータブル版（推奨）**
* デスクトップ版（インストーラー形式）
* 手動インストール版（venv + Git / 上級者向け）

ポータブル版は柔軟性もありながら安定しており、誰がセットアップしても似た環境を作り出せるため、このサイトでは基本的にポータブル版を使用していることを想定して解説を書いていきます。

加えて、**ComfyUI Manager**の導入もここで行いましょう。

これはカスタムノードのインストールなど、ComfyUIの管理を簡単にしてくれるツールです。

---

## ポータブル版によるセットアップ

ポータブル版は、Python、PyTorch、CUDA環境がすべて同梱されており、展開するだけで動作します。

### 1. ダウンロード

ComfyUIの [GitHubリリースページ](https://github.com/comfyanonymous/ComfyUI/releases) にアクセスし、GPUに合ったファイルを選択してください。

| GPUの種類 | ファイル名 (例) | 備考 |
| :--- | :--- | :--- |
| **NVIDIA GPU** | `ComfyUI_windows_portable_nvidia.7z` | 通常は無印を選びます。古いGPUの場合はCUDAバージョン違い(`cu126`など)を検討。 |
| AMD GPU | `ComfyUI_windows_portable_amd.7z` | AMDユーザー向け。 |


### 2. 展開と起動

- 1.  ダウンロードした `7zファイル`を右クリックし、`すべて展開`で展開します。
  - {% gyazoVideoLoop "https://gyazo.com/776dafe2320c41526e6292f52edbe07d" %}
  - [推奨スペックのストレージ](/ja/begin-with/recommended-specs/#ストレージ)でも説明しましたが、SSDに配置することをオススメします。
- 2.  展開されたフォルダ内にある、`run_nvidia_gpu.bat` をダブルクリックで起動します。
- 3.  初回起動時は環境設定に時間がかかります。ブラウザが自動で開けば成功です。

### 3. ComfyUI Manager の導入

- 1. Gitのインストール
  - [Git for Windows](https://gitforwindows.org/) からインストーラーをダウンロードし、インストールしてください。
  - 設定はすべてデフォルトのままで構いません（Nextを連打でOK）。

- 2. インストール場所を開く
  - ComfyUIフォルダの中にある `custom_nodes` フォルダを開きます。
  - ```text
    📂ComfyUI_windows_portable/
    └── 📂ComfyUI/
          └── 📂custom_nodes/
    ```

- 3. ターミナルを開く
  - フォルダのアドレスバー（パスが表示されている場所）に `cmd` と入力して Enter キーを押します。
  - 黒い画面（コマンドプロンプト）が立ち上がります。

- 4. コマンドを実行
  - 以下のコマンドをコピーして、黒い画面に貼り付け（右クリック）、Enter キーを押します。
  - ```powershell
    git clone https://github.com/ltdrdata/ComfyUI-Manager.git
    ```

これで `custom_nodes` フォルダの中に `ComfyUI-Manager` というフォルダが作成されれば成功です。
ComfyUIを再起動すると、メニューに「Manager」ボタンが追加されます。

---

## デスクトップ版

Windows向けのインストーラー形式です。ComfyUI Managerがすでに導入されていたりと安定した動作を提供しますが、その分少し制限が多いです。

### ダウンロード

- 1.  ComfyUI Desktopの [GitHubページ](https://github.com/Comfy-Org/desktop) から `ComfyUI Setup.exe` をダウンロードします。
- 2.  実行し、インストール先やGPU設定を選択します。

---

## 手動インストール (Windows, Linux)

標準的な `git clone` と `pip` を使用したインストール方法です。

### Pythonのバージョンについて
* **Python 3.13** が推奨されています。
* カスタムノードの依存関係で問題が発生する場合は、**3.12** を試してください。

### 1. インストール

まず、リポジトリをクローンし、仮想環境を作成して有効化します。

```powershell
# リポジトリをクローン
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# 仮想環境を作成・有効化 (Windows)
python -m venv venv
venv\Scripts\activate

# (Linux/macOSの場合)
# python -m venv venv
# . venv/bin/activate
```

### 2. PyTorchのインストール (NVIDIA)

安定版 (Stable):
```bash
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130
```

Nightly (パフォーマンス向上の可能性あり):
```bash
pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu130
```

### 3. 依存関係のインストール

ComfyUIフォルダ内で以下を実行します。

```bash
pip install -r requirements.txt
```

### 4. ComfyUI Manager の導入

手動インストールの場合も、Managerは必須です。

```bash
cd custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager.git
cd ..
```

---

## イージーインストーラーについて

PinokioやStability Matrix等のイージーインストーラーは、確かに便利であり、複雑な機能を簡単に導入することができます。

しかしながら、間に絡む要素が増えるだけトラブルは増えるもので… 問題が置きたとき何が要因かを突き止めるのが難しくなり、結局初心者の手に負えない場面が出てきます。

ポータブル版を始め、ComfyUIの導入はそれほど難しくないため、シンプルに公式が提供する手段だけで行うことをお勧めします。

---

### 参考文献
* [ComfyUI - Installing](https://github.com/comfyanonymous/ComfyUI#installing)
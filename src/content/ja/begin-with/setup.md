---
layout: page.njk
lang: ja
section: begin-with
slug: setup
navId: setup
title: "セットアップ"
created: 2025-11-20
updated: 2026-05-25
summary: "セットアップについて"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## ComfyUIのセットアップ

ComfyUIをローカル環境で動かす方法はいくつか用意されています。

* **[ポータブル版（推奨）](#ポータブル版によるセットアップ)**
* [デスクトップ版（インストーラー形式）](#デスクトップ版)
* [手動インストール版（venv + Git / 上級者向け）](#手動インストール-windows-linux)

ポータブル版は柔軟性もありながら安定しており、誰がセットアップしても似た環境を作り出せるため、このサイトでは基本的にポータブル版を使用していることを想定して解説を書いていきます。

加えて、**ComfyUI Manager**の導入もここで行いましょう。

カスタムノードのインストールなど、ComfyUIの管理を簡単にしてくれるツールです。

---

## ポータブル版によるセットアップ

ポータブル版は、Python、PyTorch、CUDA環境がすべて同梱されており、展開するだけで動作します。

### 1. ダウンロード

ComfyUIの [GitHubリリースページ](https://github.com/comfyanonymous/ComfyUI/releases) にアクセスし、GPUに合ったファイルを選択してください。

| GPUの種類 | ファイル名 (例) | 備考 |
| :--- | :--- | :--- |
| **NVIDIA GPU** | `ComfyUI_windows_portable_nvidia.7z` | ドライバが十分新しい環境では、まず無印を選んでください。起動に失敗する場合は、GPUドライバの更新、もしくは下記の**旧ドライバ向け版**を使用します。|
| NVIDIA GPU (安定/古めの環境) | `cu126`/`cu128` | ドライバを更新したくない場合、または無印版が起動直後に終了してしまう場合に使用します。|
| AMD GPU | `ComfyUI_windows_portable_amd.7z` | AMDユーザー向け。 |


### 2. 展開と起動

1. ダウンロードした `7zファイル`を右クリックし、`すべて展開`で展開します。
   - ![](https://gyazo.com/776dafe2320c41526e6292f52edbe07d){gyazo=loop}
   - [推奨スペックのストレージ](/ja/begin-with/recommended-specs/#ストレージ)でも説明しましたが、SSDに配置することをオススメします。
2. 展開されたフォルダ内にある、`run_nvidia_gpu.bat` をダブルクリックで起動します。
3. 初回起動時は環境設定に時間がかかります。ブラウザが自動で開けば成功です。

### 3. ComfyUI Manager の導入

1. `ComfyUI_windows_portable` フォルダを開き、フォルダ内を右クリックして、`ターミナルで開く`

2. 出てきた画面に以下を入力して `Enter`
   ```powershell
   .\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt
   ```
   これでManagerに必要なライブラリがインストールされます。

   ただし、これだけでは画面にManagerは出てこないので、起動用の `.bat` ファイルにコマンドライン引数を追加します。

3. `run_nvidia_gpu.bat` を右クリックして `編集`

4. `main.py` を実行している行の末尾に、`--enable-manager` を追加します。

   ```powershell
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager
   ```

5. 古い ComfyUI Manager を使いたい場合は、`--enable-manager-legacy-ui` も追加します。

   ```powershell
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager --enable-manager-legacy-ui
   ```

---

## デスクトップ版

Windows向けのインストーラー形式です。ComfyUI Managerがすでに導入されていたりと安定した動作を提供しますが、その分少し制限が多いです。

### ダウンロード

1. ComfyUI Desktopの [GitHubページ](https://github.com/Comfy-Org/desktop) から `ComfyUI Setup.exe` をダウンロードします。
2. 実行し、インストール先やGPU設定を選択します。

> ComfyUI Managerはデフォルトで搭載されています。

---

## 手動インストール (Windows, Linux)

標準的な `git clone` と `pip` を使用したインストール方法です。

### Pythonのバージョンについて
* **Python 3.13** が推奨されています。
* カスタムノードの依存関係で問題が発生する場合は、**3.12** を試してみてください。

### 1. インストール

1. リポジトリをクローンし、ComfyUIフォルダに移動します。

   ```powershell
   git clone https://github.com/comfyanonymous/ComfyUI.git
   cd ComfyUI
   ```

2. 仮想環境を作成して有効化します。

   Windowsの場合:

   ```powershell
   python -m venv venv
   venv\Scripts\activate
   ```

   Linux/macOSの場合:

   ```bash
   python -m venv venv
   . venv/bin/activate
   ```

### 2. PyTorchのインストール (NVIDIA)

1. 通常は安定版 (Stable) をインストールします。

   ```bash
   pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130
   ```

2. Nightly版を使いたい場合は、以下を実行します。

   パフォーマンスが向上する可能性はありますが、通常は安定版で構いません。

   ```bash
   pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu130
   ```

### 3. 依存関係のインストール

1. 依存関係をインストールします。

   ```bash
   pip install -r requirements.txt
   ```

### 4. ComfyUI Manager の導入

1. ComfyUI Manager に必要なライブラリをインストールします。

   ```bash
   pip install -r manager_requirements.txt
   ```

2. これだけでは画面にManagerが出てこないので、ComfyUIを起動するときに `--enable-manager` を追加します。

   ```bash
   python main.py --enable-manager
   ```

3. 古い ComfyUI Manager を使いたい場合は、`--enable-manager-legacy-ui` も追加してください。

   ```bash
   python main.py --enable-manager --enable-manager-legacy-ui
   ```

---

## イージーインストーラーについて

Pinokio や Stability Matrix 等のイージーインストーラーは、確かに便利であり、複雑な機能を簡単に導入することができます。

しかしながら、間に絡む要素が増えるだけトラブルは増えるもので… 問題が置きたとき何が要因かを突き止めるのが難しくなり、結局初心者の手に負えない場面が出てきます。

ポータブル版を始め、ComfyUIの導入はそれほど難しくないため、シンプルに公式が提供する手段だけで行うことをお勧めします。

---

### 参考文献
* [ComfyUI-Manager のインストール](https://docs.comfy.org/ja/manager/install)

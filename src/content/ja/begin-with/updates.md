---
layout: page.njk
lang: ja
section: begin-with
slug: updates
navId: updates
title: "アップデート"
summary: ""
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 安定版 (Stable) と開発版 (Nightly)

アップデートを行う際、どちらのバージョンを適用するかを選択できます。

| バージョン | 特徴 | 推奨されるケース |
| :--- | :--- | :--- |
| **安定版 (Stable)** | 目立つバグが修正された、動作保証のある確定版です。正式な公式発表があるものは通常こちらを指します。 | 安定性を最優先したい場合。 |
| **開発版 (Nightly)** | 新しく実装された機能や修正がすべて含まれる最新版です。動作確認は不完全なため、不具合が出る可能性があります。 | 新機能や最新モデルへの対応をすぐに試したい場合。 |

> **注意:** 「最新版にアップデートしたのに、この機能/モデルが使えない」という場合、**安定版**を選択している可能性があります。最新機能はまず**開発版**に入ります。

---

## Portable版

Windowsのポータブル版は、用意された `.bat` ファイルを実行するだけで簡単にアップデートが可能です。

以下の階層にある `.bat` ファイルを実行するとアップデートが始まります。 実行中は止まっているように見えても動いていることが多いので、**`Done!`** と表示されるまで待ちましょう。

```bat
📂ComfyUI_windows_portable/
└── 📂update/
    ├── update_comfyui.bat
    ├── update_comfyui_stable.bat
    └── update_comfyui_and_python_dependencies.bat
```

* **`update_comfyui.bat`**
    * 開発版にアップデートされます。
* **`update_comfyui_stable.bat`**
    * 安定版にアップデートされます。
* **`update_comfyui_and_python_dependencies.bat` ⚠️**
    * 開発版にアップデートされたあと、PyTorch（Pythonのコアライブラリ）のアップデートが入ります。
    * PyTorchのアップデートは、**カスタムノードが動かなくなる可能性が非常に高い**ため、現状問題が出ていないのなら使わないほうが良いです。

---

## 手動インストール版

### 開発版へのアップデート

以下のコマンドを実行すると、最新の開発版へアップデートされます。

**Windows**

```powershell
# 1. 仮想環境を有効化
.\venv\Scripts\activate

# 2. GitでComfyUI本体を更新
git pull --ff-only

# 3. 必要なPythonライブラリを更新
pip install -r requirements.txt
```

**Mac / Linux**

```bash
# 1. 仮想環境を有効化
source venv/bin/activate

# 2. GitでComfyUI本体を更新
git pull --ff-only

# 3. 必要なPythonライブラリを更新
pip install -r requirements.txt
```


### 安定版への切り替え 
現在のGitのHEADを最新の安定版のタグに切り替える複雑な操作が必要です。通常、手動インストール版で安定版を使う場合は、最初からStableブランチをCloneするか、Managerを使う方が簡単です。

---

## ComfyUI Manager

もしComfyUI Managerをインストールしているなら、UI上からアップデートを行うことができます。 

![ComfyUI_Manager_Updates](https://i.gyazo.com/33cab8c113457ee1a54035612bea9c11.png){gyazo=image}

- 1.  更新したいバージョン（**Nightly Version** または **Stable Version**）を選択
- 2.  **`Update ComfyUI`** ボタンをクリック

> **注意:** `Update All` はComfyUI本体ではなく、**インストールされているすべてのカスタムノード**をアップデートするボタンです。

---

## デスクトップ版

自動でアップデートされます。

原則安定版しか使えないので、最新の機能が使いたい場合はPortable版などを使いましょう。

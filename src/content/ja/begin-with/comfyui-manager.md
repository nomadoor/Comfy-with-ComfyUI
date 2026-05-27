---
layout: page.njk
lang: ja
section: begin-with
slug: comfyui-manager
navId: comfyui-manager
title: "ComfyUI Manager"
created: 2026-05-26
updated: 2026-05-27
summary: "ComfyUI Managerについて"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/76b47ed5d45cf694b436022589464255.png"
---

## ComfyUI Managerとは

ComfyUI Manager は、ltdrdata氏が開発した、カスタムノードのインストールやアップデートなどを一元管理するためのツールです。

多くの環境で当たり前のように導入されていたため、実質的にはデフォルト機能のような存在でしたが、ComfyUI が Comfy.Org による開発に移行するにあたり、現在は Manager も公式機能として取り込まれています。

---

## 新旧Manager

![](https://gyazo.com/a0b09641bae0c8b02187e6c6b7bb9c5a){gyazo=image}

ややこしいことに、現在の ComfyUI Manager には **新しい Manager** と **従来(レガシー)の Manager** の二種類が存在します。

新しい Manager には美しい UI が用意され、純粋にカスタムノードの管理に特化したものになりました。
その一方で、レガシー版に存在した ComfyUI 自体の再起動やアップデート、モデルのダウンロードといった便利な機能は廃止されています。

Comfy.Org の意図を汲み取れば新しい Manager を勧めるべきですが、レガシー版を使い続けている方も多いでしょう。

---

## インストールと有効化

> インストールしただけでは、Manager は表示されません。  
> コマンドライン引数を追加して、起動する必要があります。

### デスクトップ版の場合

ComfyUI Desktop を使っている場合、ComfyUI Manager は最初から含まれています。

追加のインストール作業は不要です。

### ポータブル版の場合

1. `ComfyUI_windows_portable` フォルダを開きます。
2. フォルダ内を右クリックして、`ターミナルで開く` を選択。
3. 以下を実行。

   ```powershell
   .\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt
   ```

   これで ComfyUI Manager に必要なライブラリが入ります。

4. `run_nvidia_gpu.bat` を右クリックし、`編集`。
5. `main.py` を実行している行の末尾に、`--enable-manager` を追加。

   ```powershell
   .\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager
   ```

これで、起動時に ComfyUI Manager が有効になります。

### 手動インストール版の場合

手動インストール版では、仮想環境を有効化した状態で、ComfyUI フォルダ内から作業します。

1. 仮想環境を有効化。

   Windowsの場合:

   ```powershell
   venv\Scripts\activate
   ```

   Linux/macOSの場合:

   ```bash
   . venv/bin/activate
   ```

2. ComfyUI Manager に必要なライブラリをインストールします。

   ```bash
   pip install -r manager_requirements.txt
   ```

3. ComfyUI を起動するときに `--enable-manager` を追加します。

   ```bash
   python main.py --enable-manager
   ```

### ComfyUI Manager を開く

![](https://gyazo.com/ff8b7cdae4aba2a086a9cfebe8019023){gyazo=image}

インストールと有効化ができていれば、右上に `Extensions` ボタンが表示されます。

これをクリックして Manager 画面を開いてください。

---

## レガシーUIで起動する

古い ComfyUI Manager を使いたい場合は、`--enable-manager` に加えて `--enable-manager-legacy-ui` も指定します。

ポータブル版の場合:

```powershell
.\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager --enable-manager-legacy-ui
```

手動インストール版の場合:

```bash
python main.py --enable-manager --enable-manager-legacy-ui
```

新しい Manager UI だけで足りるなら、まずは `--enable-manager` だけで構いません。
更新やモデル管理など、レガシー版に残っている機能を使いたい場合は、必要に応じてレガシーUIを有効にしてください。

---

## カスタムノードを入れる

### 現行UI

![](https://gyazo.com/85ac7d6fb86580c06f252938e153a152){gyazo=loop}

1. 検索バーにノード名を入力して検索
2. `Install` をクリック
3. `Apply Changes` をクリック、もしくは手動で ComfyUI を再起動

### レガシーUI

![](https://gyazo.com/c0d8901537b65da709f9ba9d6e1a0055){gyazo=loop}

1. `Custom Nodes Manager` をクリック
2. 検索バーにノード名を入力して検索
3. `Install` をクリック（バージョンは通常 `latest` でOK）
4. `Restart` をクリック、もしくは手動で ComfyUI を再起動

---

## カスタムノードのアップデート

### 現行UI

![](https://gyazo.com/3f8316ae71333f2214173e9987346153){gyazo=image}

`Updates Available` のタブに移動

アップデートできるノードがあれば、ここに表示されます。

- 右上の `Update` ボタンで一括アップデート
- 対象を選択し、サイドバーの `Update` から個別にアップデート

### レガシーUI

![](https://gyazo.com/3eeb7b5df0d8567f0fdc37ec8c73fff1){gyazo=image}

1. `Custom Nodes Manager` をクリック
2. Filter を `Installed` にして、インストールされているものだけ表示
3. アップデートしたいカスタムノードの `Try Update` をクリック

---

### 参考文献

* [ComfyUI-Manager のインストール](https://docs.comfy.org/ja/manager/install)

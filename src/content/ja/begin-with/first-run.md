---
layout: page.njk
lang: ja
slug: first-run
navId: first-run
title: "起動して生成"
summary: "起動して生成について"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

細かいことは置いておいて、とりあえず画像を生成してみましょう。

## 起動

![](https://i.gyazo.com/bb40c87b9142498ca6bbbdc0b568a2e3.png){gyazo=image}

- **ポータブル版**
  - インストールしたフォルダにある `run_nvidia_gpu.bat` をダブルクリックします。
- **デスクトップ版**
  - デスクトップのショートカットまたはスタートメニューから起動します。
- **手動インストール**
  - 以下のコマンドを実行します。
    ```powershell
    cd "path\to\comfyui"
    venv\Scripts\activate
    python main.py
    ```

しばらくするとブラウザでComfyUIの画面が開きます。
※ 画面が開かない場合は、ブラウザのアドレスバーに `http://127.0.0.1:8188` と入力してみてください。

## テンプレートからworkflowを選択

![](https://i.gyazo.com/7ffdc91e29dc41127e4101360ceff732.png){gyazo=image}

- おそらくテンプレート画面が開いています。（開いていない場合は、左サイドバーの `Templates` を選択してください。）
- まずは、**`Getting Started`** → **`Image Generation`** を選択してください。
- `Missing Models` というエラーが表示されます。
  - これはworkflowを動かすためのモデルが不足していることを示していますが、一度無視して `✕` を押して閉じてください。

## モデルのダウンロード

このworkflowは、**Stable Diffusion 1.5** というモデルを動かすためのものです。
現在の最新モデルに比べれば性能は控えめ…というか正直使い物にならないんですが、根本的な仕組みは変わっていません。

画像生成AIの始祖とも言えるこのモデルで、基本的な画像生成を学んでいきましょう。

1.  **モデルをダウンロード**
  - [v1-5-pruned-emaonly-fp16.safetensors (直リンク)](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/resolve/main/v1-5-pruned-emaonly-fp16.safetensors)
  - 上のリンクをクリックするとダウンロードが始まります。
  - これを、以下のフォルダに保存してください。
  ```text
  📂ComfyUI/
    └── 📂models/
        └── 📂checkpoints/
            └── v1-5-pruned-emaonly-fp16.safetensors
  ```

2.  **リフレッシュ**
  - モデルを配置しただけでは、ComfyUIはモデルを認識してくれません。
  - キーボードの `r` キーを押すか、`ComfyUIアイコン` → `Edit` → `Refresh Node Definitions` を押すと認識されます。

## 生成

![](https://gyazo.com/57af4e96b7f6b2280aeed28afe3bb121){gyazo=loop}

- 画面上部の **`▷ Run`** ボタンを押せば生成が始まります。
- `Save Image` ノードに画像が表示されていれば成功です。
- `Save Image` ノードはその名の通り、入力された画像を保存するノードです。生成された画像は、以下のフォルダに保存されています。
```text
📂ComfyUI/
  └── 📂output/
      ├── SD1.5_00001_.png
      ...
```

プロンプト（`CLIP Text Encode` ノードの文字）を変えてみたり、`seed` の数値を変えてみたりして遊んでみてください。

## よくあるトラブル

### モデルが見つからない（Load Checkpointが赤い）
- **症状**
  - `Load Checkpoint` というノードが赤く囲まれ、エラーが表示される。
  - `Value not in list: ckpt_name: 'v1-5-pruned.ckpt' not in []`
- **原因**
  - 指定されたモデルファイルが `models/checkpoints/` フォルダに入っていない。
  - ファイル名が変更されている。
- **対処**
  - フォルダの場所が合っているか確認してください（`models/checkpoints` です）。
  - ファイル名が変わっても問題はありませんが、その場合は、モデルを選択し直してください。



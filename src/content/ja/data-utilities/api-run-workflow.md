---
layout: page.njk
lang: ja
section: data-utilities
slug: api-run-workflow
navId: api-run-workflow
title: "APIでworkflowを実行してみる"
summary: "実行依頼→完了確認→出力取得、の最小手順"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## 基本的にやっていること

API経由で、ComfyUIのworkflowを「外から」実行してみます。

やることはシンプルで、**API形式JSON（= prompt）を `http://127.0.0.1:8188/prompt` にPOSTする** だけです。

これでComfyUIサーバは「そのworkflowを実行して」と命令を受け取り、キューに積んで実行し、`prompt_id`（実行ID）を返します。

> 少しややこしいのですが、ここで出てくる「prompt」はテキストプロンプトではなく、**ワークフロー全体（実行グラフ）** のことです。  
> テキストはその一部で、たとえば `CLIPTextEncode` の `inputs.text` などが該当します。

今回は、Pythonから実行してみましょう。

--- 

## ComfyUIを起動しておく

APIは「ComfyUIを起動しなくてよくなる仕組み」ではありません。  
Pythonは、起動中のComfyUIサーバに対して命令を送ります。

- ComfyUIを起動しておきます
- ブラウザで `http://127.0.0.1:8188` を開ける状態にします

---

## API用のworkflowを用意する

### 今回使うworkflow（SD1.5 text2image）

ひとまず、最もシンプルなStable Diffusion 1.5のtext2imageを使います。

![](https://gyazo.com/897f66c308b3b98440f641ee3d33d50e){gyazo=image}

[](/workflows/basic-workflows/sd15-text2image/SD1.5_text2image_vae-ft-mse-840000.json)

**モデルのダウンロード**
- checkpoints
  - [v1-5-pruned-emaonly-fp16.safetensors](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors)
- vae
  - [vae-ft-mse-840000-ema-pruned.safetensors](https://huggingface.co/stabilityai/sd-vae-ft-mse-original/blob/main/vae-ft-mse-840000-ema-pruned.safetensors)

```text
📂ComfyUI/
  └── 📂models/
      ├── 📂checkpoints/
      │   └── v1-5-pruned-emaonly-fp16.safetensors
      └── 📂vae/
          └── vae-ft-mse-840000-ema-pruned.safetensors
```

### API用のworkflowを取得

- 1. ComfyUIのノードUIで、上のworkflowを開く
- 2. メニューから `File` → **Export (API)** を選ぶ
- 3. わかりやすい名前で保存（例：SD1.5_text2image_API.json）

**サンプル**

[](/workflows/data-utilities/api-run-workflow/SD1.5_text2image_API.json)

### 通常のworkflow JSONとの違い

通常のJSONは「UIで編集・共有しやすい情報」も含んでいます。  
APIのworkflow は、そのような余分な情報を削ぎ落とし、サーバに渡して実行するのに都合が良い形になっています。

---

## まず動かす

### Python環境準備

仮想環境を作り、HTTP通信用に `requests` を入れます。

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
# source venv/bin/activate

pip install requests
```

### run_min.py

`SD1.5_text2image_API.json` を読み込み、`/prompt` に投げるだけの最小コードです。  
ノードUIで `▷Run` を押すのと、基本的には同じです。

```python
import json
import requests

BASE = "http://127.0.0.1:8188"

prompt = json.load(open("SD1.5_text2image_API.json", encoding="utf-8"))

res = requests.post(f"{BASE}/prompt", json={"prompt": prompt}).json()
print(res)  # {"prompt_id": "...", "number": ..., "node_errors": {...}}
```

ファイル配置

```text
your_project/
  ├── run_min.py
  └── SD1.5_text2image_API.json
```


### 実行する

ターミナルで `run_min.py` を実行します。

```powershell
cd path/to/your_project
venv/Scripts/activate
python run_min.py
```

実行できたか確認してみましょう。

- Python側で `{"prompt_id": "...", ...}` が返ってくる（これが実行IDです。）
- ComfyUI側のターミナルに実行ログが出る
- `ComfyUI/output/` に画像ファイルが増える
  * ノードUIで実行するときと同じ場所に保存されているはずです

ここまでできれば、API経由で実行できています。

---

## CLIからプロンプトを変える

API用JSONを直接編集しても、もちろんパラメータは変更できます。  
ただし、元ファイルを汚さずに連続実行したいなら **Pythonで差し替える** ほうが扱いやすいです。

### どこを書き換えるのか（今回のJSONの場合）

今回は「プロンプトだけ」を変更します。

- Positive prompt：ノード `6` の `inputs.text` 

### 注：ノードIDは固定ではない

このページの例では `6` を使いますが、これは **この配布JSONの中でそうなっているだけ**です。  
自分のworkflowでやる場合は、JSONを開いて以下を探すのが確実です。

e.g. `SD1.5_text2image_API.json`
```json
  "6": { //これがID
    "inputs": {
      "text": "beautiful scenery nature glass bottle landscape, , purple galaxy bottle,",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
```

### `run.py`（プロンプト入力）

```python
import json
import requests

BASE = "http://127.0.0.1:8188"
prompt = json.load(open("SD1.5_text2image_API.json", encoding="utf-8"))

pos = input("positive prompt: ").strip()

# このページの配布JSON前提：6=positive
if pos:
    prompt["6"]["inputs"]["text"] = pos

res = requests.post(f"{BASE}/prompt", json={"prompt": prompt}).json()
print(res)
print("done (check ComfyUI/output)")
```

### 実行する

先ほどと同様に実行します。

```bash
cd path/to/your_project
venv/Scripts/activate
python run.py
```

今回は途中でパラメータの入力を求められます。

```bash
positive prompt: 好きなプロンプトを入力
```

そのプロンプトで画像が `ComfyUI/output/` に保存されていればOKです。

---

## 雰囲気が掴めたら、あとは作るだけ

今回は「実行する」だけのAPIしか使っていませんが、APIには他にも色々あります。

- 進捗をリアルタイムに受け取る（WebSocket）
- キューの制御（停止・割り込みなど）
- 画像アップロード（i2iの入力に渡す）
- ノードの入力仕様の取得（workflow編集を自動化する足がかり）

このページでは「外からworkflowを実行できる」雰囲気さえ掴めれば十分です。

あとはvibe codingでも何でも、欲しいものを実際に作ってみてください！
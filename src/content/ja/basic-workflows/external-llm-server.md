---
layout: page.njk
lang: ja
section: basic-workflows
slug: external-llm-server
navId: external-llm-server
title: "外部LLMサーバ連携"
summary: "ComfyUIの外でLLMを動かし連携する"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/da95a615f374717f19b3447244ad647a.png"
---

## 外部LLMサーバ連携

ComfyUI自体は「画像・動画などの生成ワークフローをつなぐエンジン」で、LLMを動かす機能は基本的に持っていません。

そこで、LLMは別の推論エンジン（サーバ）に任せ、ComfyUI側は「リクエストを投げて結果を受け取る窓口」だけを担当します。

### なぜ処理を分離するのか？

ComfyUI上だけで完結するカスタムノードも存在しますが、LLMの環境は依存関係が重く、組み合わせによってはComfyUIが起動しなくなることがあります。
分離しておけば、ComfyUIの環境を汚しません。

また、LLMのために開発されているもののほうが最新モデルへの対応が早く、安定もしています。
もし強力なPCを複数持っているなら、別PCに処理を投げる構成にも移行できます。

---

## 連携する方法

連携方法はいくつかありますが、現状もっとも扱いやすいのが OpenAI API互換です。

“OpenAI” と付いていますが、チャット系LLMに投げるHTTP APIの共通フォーマットとして広く使われています。  
Ollamaもこの[互換API](https://docs.ollama.com/api/openai-compatibility)を提供しているため、ComfyUI側は OpenAI互換ノードを使うのが手っ取り早いでしょう。

---
## Ollama の導入

![](https://gyazo.com/a01ee125967ce857275bc883a5c3a1dd){gyazo=image}

今回は、シンプルで使いやすいオープンソースの推論エンジン **[Ollama](https://ollama.com/)** を使用します。

### インストール

[公式サイト](https://ollama.com/download)からインストーラーをダウンロードし、実行してください。

インストール後、Ollama は常駐して動作します。タスクトレイにアイコンが出ていれば準備完了です。

### モデルのダウンロード

使いたいモデルを探しましょう。[Ollama Search](https://ollama.com/search) で対応しているモデルを検索できます。

今回は画像入力もできて、軽量ながら性能の良い、`qwen3-vl:8b` を使います。

ターミナルを開き、使いたいモデルを指定して実行します。

```bash
ollama run qwen3-vl:8b
```

その他、ローカルとして使いやすいモデル:

- **gemma3** : Google開発です。Qwen3 VLと似た用途で使えます
- **gpt-oss:20b** : OpenAIのオープンウェイトモデルです。テキストのみの処理ですが、非常に強力ですね
- **◯◯-Abliterated** : オープンウェイトといえど基本的には(NSFWのみならず)検閲が入っています。このアライメントを除去したモデルはこのような名前がついています
  - [UGI Leaderboard](https://huggingface.co/spaces/DontPlanToEnd/UGI-Leaderboard)では様々なモデルを見つけられます

---

## ComfyUIから動かす

ComfyUIから Ollama へアクセスするためのカスタムノードを導入します。

### カスタムノード

OpenAI API互換で投げられるノードを使います。どれでも良いのですが、ここではもっともシンプルなものを使いましょう。

- **[comfyui-openai-api](https://github.com/hekmon/comfyui-openai-api)**


### 最小チャット

![](https://gyazo.com/767f4fd9d6adf6727fc075fac1d14479){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat.json)

- `base_url` : `http://localhost:11434/v1` （Ollamaのデフォルトアドレスです）
- `api_key` : Ollamaの場合は不要です。
- `model` : 先ほどダウンロードしたモデル名（`qwen3-vl:8b` など）を入力します
- `system_prompt` : 無くても良い

あとはノードの上の入力欄にチャットを書いて `▷Run` してみてください。

### チャットを続ける

このノードは内部に“記憶”を持ちません。  
会話を続けたい場合は、前のノードの History を次のノードの History に接続して、過去ログを毎回いっしょに送ります。

![](https://gyazo.com/274ae7b0dac7a88e4481cd4ca815757f){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat-History.json)

- 🟨前のノードの`History`から次のノードの`History`へつなぐ

### 画像入力

Qwen3 VLのような画像も理解できるMLLMを使っていれば、画像を入力してそれに対して何かを聞くということも出来ます。

![](https://gyazo.com/04578d7535ce9b4c4fb43148ac1ee2bd){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat-multi_images.json)


- `image(s)`に画像を入力
- 🟦複数枚入力したいときは`Batch Images`で連結してから入力します

### プロンプト生成 → 画像生成

せっかくなので、入力した画像からプロンプトを作成してもらい、同じような画像を作ってもらいましょう。

![](https://gyazo.com/214851c957532e34fb705e0d5feeeef9){gyazo=image}

[](/workflows/basic-workflows/external-llm-server/OpenAI_API_Chat-image2prompt.json)

- システムプロンプトで「そのまま使える画像生成のプロンプト」を出力するようにフォーマットを指定しておくと良いでしょう。
- あとは出力を`CLIP Text Encode`につなぐだけです。
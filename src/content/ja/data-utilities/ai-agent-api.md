---
layout: page.njk
lang: ja
section: data-utilities
slug: ai-agent-api
navId: ai-agent-api
title: "ComfyUIをAIエージェントに使わせる"
created: 2026-05-17
updated: 2026-05-17
summary: "ComfyUIをAIエージェントから扱うための考え方"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## ComfyUIは「画面」と「実行エンジン」に分かれている

ComfyUI を AI エージェントに使わせるとき、まず押さえておきたいのは、ComfyUI が **画面** と **実行エンジン** に分かれているという点です。

普段触っているノード画面は、workflow を編集したり、実行ボタンを押したりするためのフロントエンドです。  
実際に画像や動画を生成しているのは、裏側で動いている ComfyUI サーバです。

このあたりの構造は [APIとは？](/ja/data-utilities/api-about/) でも説明していますが、ここでも軽く繰り返しておきます。

- ノード画面：人間が workflow を作るための画面
- ComfyUI サーバ：workflow を受け取って実行するエンジン
- API：外部のプログラムからサーバに命令を送る入口

つまり、AI エージェントに ComfyUI を使わせるというのは、かなり大雑把に言えば **AI から ComfyUI サーバに命令を送れるようにする** という話です。

---

## AIに使わせる方法は2つある

AI エージェントに ComfyUI を使わせる方法は、大きく分けると2つあります。

### 動くworkflowをAPI経由で使わせる

1つ目は、人間があらかじめ動く workflow を作っておき、それを API 経由で AI に実行させる方法です。

この方法では、AI に workflow の中身を全部理解させる必要はありません。  
AI が触るのは、たとえば以下のような一部の入力だけです。

- positive prompt
- negative prompt
- seed
- 入力画像
- 出力サイズ
- モデルや LoRA の選択

人間が「壊れない workflow」を用意し、AI には安全に変更してよいパラメータだけ渡します。  
実用上は、まずこの方法がいちばん扱いやすいです。

### workflowを作るところから任せる

2つ目は、AI に workflow の作成そのものを任せる方法です。

たとえば「Flux で画像編集する workflow を作って」「この画像からマスクを作って合成する workflow を組んで」と頼み、AI がノード構成を考えて JSON を作る、という方向です。

できると面白いのですが、こちらはかなり難しいです。

---

## workflowを作らせるのは難しい

ComfyUI の workflow は、見た目以上に細かい制約のかたまりです。

ノードには入力型があります。  
`MODEL` には `MODEL` を、`CLIP` には `CLIP` を、`LATENT` には `LATENT` をつなぐ必要があります。

さらに、モデルごとの作法もあります。

- SD1.5 と SDXL で必要なノード構成が違う
- Flux 系では `CLIP` / `T5` / `VAE` の扱いが違う
- 動画 workflow はフレーム数や解像度、VRAM の制約が強い
- カスタムノードは環境によって入っていたり入っていなかったりする

AI がそれっぽい workflow JSON を書けたとしても、実際に読み込むとノードが足りなかったり、型が合わなかったり、モデル名が環境と違ったりします。

なので、現時点では「workflow をゼロから作らせる」よりも、**人間が作った workflow を AI に操作させる** ほうが安定します。

これは地味ですが、かなり重要です。  
AI に自由を渡しすぎるより、壊れない道具を渡したほうが、結果的にできることが増えます。

---

## API経由で使わせる方法

API 経由で使わせる場合、考え方はシンプルです。

1. ComfyUI を起動しておく
2. 動く workflow を API 形式で保存する
3. 変更してよいパラメータを決める
4. AI エージェントに、そのパラメータだけ変更させる
5. `/prompt` に投げて実行する

実際に API で workflow を投げる手順は [APIでworkflowを実行してみる](/ja/data-utilities/api-run-workflow/) で扱っています。  
このページでは、AI に渡すときの考え方を中心に整理します。

### ComfyUIを起動しておく

API は「ComfyUI を起動しなくてよくなる仕組み」ではありません。

ローカルで使う場合は、いつものように ComfyUI を起動して、`http://127.0.0.1:8188` を開ける状態にしておきます。

AI エージェントは、このサーバに対して HTTP リクエストを送ります。  
ノード画面の代わりに、AI が外側から `Run` を押すようなイメージです。

### workflowをAPI形式で保存する

次に、AI に使わせたい workflow を API 形式で保存します。

通常の workflow JSON は、ノードの位置やUI用の情報も含んでいます。  
API 形式の JSON は、ComfyUI サーバに「これを実行して」と渡すための形です。

ComfyUI のメニューから `Export (API)` を使うと、API 実行用の JSON を保存できます。

> ここで出てくる API 形式の JSON は、ComfyUI API 上では `prompt` と呼ばれることがあります。  
> テキストプロンプトだけではなく、workflow 全体を指すので少しややこしいですね。

### 変更してよいパラメータを決める

AI に渡す前に、どの値を変更してよいかを人間が決めます。

ここを曖昧にすると、AI は workflow 全体を編集しようとします。  
しかし実用上は、変更できる場所を絞ったほうが安定します。

たとえば text2image なら、最初はこれくらいで十分です。

- positive prompt
- negative prompt
- seed
- width / height
- steps

image2image なら、入力画像や denoise も候補になります。

逆に、最初は触らせないほうがよいものもあります。

- ノードの接続
- `class_type`
- モデルファイル名
- VAE や CLIP の構成
- カスタムノード固有の内部設定

AI に「全部いい感じにして」と頼むのではなく、**この workflow のこの値だけ変えてよい** と渡すのがポイントです。

### AIエージェントに渡す

AI エージェントに渡すものは、たとえば次のようなセットです。

- API 形式の workflow JSON
- 変更してよいパラメータの一覧
- 各パラメータの意味
- 値の範囲
- 実行先の ComfyUI サーバ URL
- 実行後の出力確認方法

AI に渡す説明は、難しくしすぎないほうがよいです。

たとえば、次のような形です。

```text
この workflow は ComfyUI の text2image 用です。

変更してよい値:
- node 6 の inputs.text: positive prompt
- node 7 の inputs.text: negative prompt
- node 3 の inputs.seed: seed

変更してはいけない値:
- class_type
- ノード接続
- モデル名

実行方法:
- 変更後の workflow を {"prompt": workflow} として http://127.0.0.1:8188/prompt に POST する
```

ここまで決めておくと、AI の仕事は「workflow を設計すること」ではなく、「許可された入力を埋めて実行すること」になります。

これなら、通常のエージェントでも比較的扱いやすくなります。

---

## MCPについて

MCP（Model Context Protocol）は、AI エージェントにツールやデータを渡すための共通規格です。

ComfyUI の文脈では、MCP は「AI と ComfyUI API の間に置く道具箱」のように考えると分かりやすいです。

たとえば MCP サーバ側に、次のような tool を用意します。

- `run_text2image`
- `run_image2image`
- `run_upscale`
- `get_comfyui_queue`
- `get_output_image`

AI から見ると、「HTTP の `/prompt` に JSON を POST する」という細かい手順ではなく、`run_text2image` という道具を呼ぶだけになります。

内部では、その tool が API 形式 workflow を読み込み、許可されたパラメータだけ差し替え、ComfyUI の `/prompt` に投げます。

つまり MCP は、ComfyUI の代わりではありません。  
ComfyUI を AI に使わせるための **安全な窓口を作る仕組み** と考えるとよいです。

> ただし、MCP にした瞬間に何でも安全になるわけではありません。  
> どの tool を公開するか、どのパラメータを許可するか、ファイルアクセスをどこまで許すかは、人間がきちんと設計する必要があります。

---

## まとめ

ComfyUI を AI エージェントに使わせるなら、まずは **動く workflow を API 経由で実行させる** 方法から始めるのがおすすめです。

workflow をゼロから作らせるのは面白いですが、ノード型、モデル構成、カスタムノード、環境差分が絡むため、まだ失敗しやすいです。

一方で、API 経由なら人間が作った workflow を土台にできます。

- 人間が workflow を作る
- API 形式で保存する
- AI に変更してよいパラメータだけ渡す
- AI が `/prompt` に投げて実行する

この形にすると、AI に任せる範囲を小さくできます。  
小さく渡すほど壊れにくくなり、壊れにくいほど実用になります。

詳しい API の実行手順は、次に [APIでworkflowを実行してみる](/ja/data-utilities/api-run-workflow/) を読むと流れが掴みやすいです。

## 参考

- [ComfyUI Docs: Routes](https://docs.comfy.org/development/comfyui-server/comms_routes)
- [Model Context Protocol: Server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)

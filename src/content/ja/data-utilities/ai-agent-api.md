---
layout: page.njk
lang: ja
section: data-utilities
slug: ai-agent-api
navId: ai-agent-api
title: "ComfyUIのworkflowをAIエージェントに使わせる"
created: 2026-05-17
updated: 2026-05-17
summary: "動作確認済みのComfyUI workflowを、AIエージェントにAPI経由で使わせる"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## ComfyUIは「画面」と「実行エンジン」に分かれている

![](https://gyazo.com/a04e2d09b534afb1e32900a738f0c3a7){gyazo=image}

前提として知っておきたいのが、ComfyUI が **画面** と **実行エンジン** に分かれているという点です。

普段触っているノード画面は、workflow を編集したり、実行ボタンを押したりするためのフロントエンドですが、実際に画像や動画を生成しているのは、裏側で動いている ComfyUI サーバです。

[APIとは？](/ja/data-utilities/api-about/) でも説明していますが、軽くおさらいします。

- ノード画面：人間が workflow を作るための画面
- ComfyUI サーバ：workflow を受け取って実行するエンジン
- API：外部のプログラムからサーバに命令を送る入口

実行に必要な情報さえ渡せれば、ノード画面というのは必ずしも必要ではないんですね。

---

## AIに使わせる方法は2つある

### 1. 動くworkflowをAPI経由で使わせる

1つ目は、人間があらかじめ動く workflow を作っておき、それを API 経由で AI に実行させる方法です。

これは [APIでworkflowを実行してみる](/ja/data-utilities/api-run-workflow/) で扱っている方法ですね。

ComfyUI 全体を自由に使わせるというより、**ComfyUI で作った一つの機能を道具として AI に渡す** イメージです。

弱点は柔軟性で、ノードを追加したり、ノードの接続順を変えたりするような大きな変更は、この方法では扱えません。

といっても、プロンプトや seed のようなパラメータは API 経由で変更できるので、さまざまなプロンプトや、いろいろなサイズで画像生成させるなんてことは十分可能です。

### 2. workflowを作るところから任せる

2つ目は、AI に workflow そのものを作らせる方法です。

「Flux で画像編集する workflow を作って」「この画像からマスクを作って合成する workflow を組んで」と頼み、AI がノード構成を考えて workflow を組む。

AI と ComfyUI の組み合わせと聞くと、こちらを想像する方も多いかもしれませんが、これはかなり難しいのです。

---

## workflowを作るところから任せるのは難しい

ComfyUI の workflow は JSON なので、プログラミングと同じようにやれば、AI に作らせるのも簡単そうに見えます。

しかし実際には、workflow はその人の ComfyUI 環境にかなり依存します。  
custom node が入っているか、モデルファイルがあるか、ノードの仕様が今も同じか… これらの条件が揃っていないと動きません。

AI の性能以前に、**AI に任せられる範囲の外に、挙動を不安定にする要素が多すぎる** んですね。

もちろん、将来的にはこうした作業もできるようになるかもしれません。  
ただ、少なくとも現時点では、まず人間が動作確認した workflow を使わせる方が現実的です。

---

## API経由で使わせる

API 経由で使わせる場合、考え方はシンプルです。

1. ComfyUI を起動しておく
2. 動く workflow を API 形式で保存する
3. AI エージェントに workflow を渡す
4. その workflow でできる作業を指示する

API 経由でどのように ComfyUI を実行しているかは、[APIでworkflowを実行してみる](/ja/data-utilities/api-run-workflow/) で説明しています。  
ただ、細かい API の書き方は AI さんがやってくれるので、任せてしまって構いません。

### ComfyUIを起動しておく

API は「ComfyUI を起動しなくてよくなる仕組み」ではありません。

ローカルで使う場合は、いつものように ComfyUI を起動して、`http://127.0.0.1:8188` で開ける状態にしておきます。

AI エージェントは、このサーバに対して HTTP リクエストを送ります。  
ノード画面の代わりに、AI が外側から workflow を読み込んで `Run` を押すようなイメージです。

### 動くworkflowをAPI形式で保存する

次に、AI に使わせたい workflow を API 形式で保存します。

通常の workflow JSON は、ノードの位置や UI 用の情報も含んでいます。  
API 形式の JSON は、ComfyUI サーバに「これを実行して」と渡すための形です。

1. ComfyUI のノード UI で、使わせたい workflow を開く
2. メニューから `File` → **Export (API)** を選ぶ
3. わかりやすい名前で保存（例：`SD1.5_text2image_API.json`）

> 当然ながら、その workflow は、自分の環境で実際に動かせるものである必要があります。  
> モデルのダウンロードなどを済ませ、一度動作を確認しましょう。

### AIエージェントにworkflowを渡し、指示する

AI エージェントに渡す、といっても、特別な操作が必要なわけではありません。

API 用 workflow JSON を、AI エージェントが読める場所に置くだけです。

Codex なら、その workflow JSON が入ったフォルダを VS Code で開けばOKです。

たとえば、フォルダの中に次の2つを置いておきます。

- `Z-Image-Turbo_api.json`：画像生成用
- `Flux.2_klein_9b_api.json`：画像編集用

この状態で Codex に、次のように頼みます。

```text
Z-Image-Turbo で公園に立っている男性の画像を作り、
その人物の服装を Flux.2 klein 9B で青いセーターに変更したものを、
output フォルダに保存してください。
```

あとは Codex が workflow を読み、必要なプロンプトや入力画像を差し替え、ComfyUI API に投げてくれます。

![VS Codeの画面](https://gyazo.com/ae044eb02df2f95bd15f00bcd0c44620){gyazo=image}

---

## workflowは小さく分けた方が使わせやすい

私が勝手に言っている概念ですが、[リーダブルノード](/ja/begin-with/readable-nodes/) は、シンプルで読みやすい workflow を組もうという考え方です。

AI に使わせる場合も、基本は同じです。  
workflow は **小さく、シンプルに** 分けておいたほうが扱いやすいように思います。

![](https://i.gyazo.com/2a9c66fa28c01a8bd12b24fdde2a07a4.png){gyazo=image}

たとえば、次の処理をひとつの workflow にまとめたとします。

- 画像生成
- アップスケール
- 顔の修正

この場合、実行すると最初から最後まで処理が走ります。  
最初の画像生成がイマイチでも、アップスケールや修正まで進んでしまいます。

これを小さな workflow に分けるとどうでしょう？

- `text2image` で候補を作る
- 良いものだけ `upscale` に進ませる
- 必要なものだけ `face fix` に渡す
- あとから `upscale` だけ実行する

人間が使う分にはまとめておいた方が楽なこともありますが、AI に使わせれば、workflow 同士の橋渡しは勝手にやってくれます。

それならば、All in one なものよりも、細かく最低限の workflow を用意しておいたほうが柔軟に使ってもらえます。

---

## MCPについて

上でやった方法は、API を使う簡単なプログラミングを AI が書いて実行する、というものですが、AI ネイティブとしては、少し野暮ったい方法でもあります。

そこで、**MCP** という、AI エージェントにツールやデータを渡すための共通規格に変換する方法もあります。

たとえば、以下のような MCP tool を考えてみましょう。

- `run_text2image`
- `run_image2image`
- `run_upscale`
- `get_comfyui_queue`
- `get_output_image`

AI から見ると、「HTTP の `/prompt` に JSON を POST する」という細かい手順ではなく、`run_text2image` という道具を呼ぶだけになります。

たとえばその tool の内部で、API 形式 workflow を読み込み、必要な値を差し替え、ComfyUI の `/prompt` に投げるようにできます。

とはいえ、AI にとって少し扱いやすくなるだけで、できること自体が大きく変わるわけではありません。  
現状では、無理に使う必要はないでしょう。

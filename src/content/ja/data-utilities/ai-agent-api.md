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

ComfyUI を AI エージェントに使わせるとき、前提として知っておきたいのが、ComfyUI が **画面** と **実行エンジン** に分かれているという点です。

普段触っているノード画面は、workflow を編集したり、実行ボタンを押したりするためのフロントエンドです。  
実際に画像や動画を生成しているのは、裏側で動いている ComfyUI サーバです。

[APIとは？](/ja/data-utilities/api-about/) でも説明していますが、軽くおさらいすると以下のようなかんじです。

- ノード画面：人間が workflow を作るための画面
- ComfyUI サーバ：workflow を受け取って実行するエンジン
- API：外部のプログラムからサーバに命令を送る入口

つまり、AI エージェントに ComfyUI を使わせるというのは、かなり大雑把に言えば **AI から ComfyUI サーバに命令を送れるようにする** という話です。

---

## AIに使わせる方法は2つある

AI エージェントに ComfyUI を使わせる方法は、大きく分けると2つあります。

### 動くworkflowをAPI経由で使わせる

1つ目は、人間があらかじめ動く workflow を作っておき、それを API 経由で AI に実行させる方法です。

たとえば、次のような使い方です。

- `Z-Image` で画像生成する workflow を使わせる
- `SAM 3` でセグメンテーションする workflow を使わせる
- 画像編集 workflow に入力画像と指示文を渡して実行させる
- リサイズや色調補正の workflow を、AI の処理手順の一部として使わせる

これは [APIでworkflowを実行してみる](/ja/data-utilities/api-run-workflow/) で扱っている方法に近いです。

ComfyUI 全体を自由に使わせるというより、**ComfyUI で作ったひとつの機能を AI に渡す** という感じです。

プロンプトや seed のようなパラメータは変更できます。  
一方で、ノードを追加したり、ノードの接続順を変えたりするような大きな変更は、この方法では基本的に扱いません。

### workflowを作るところから任せる

2つ目は、AI に workflow の作成そのものを任せる方法です。

たとえば「Flux で画像編集する workflow を作って」「この画像からマスクを作って合成する workflow を組んで」と頼み、AI がノード構成を考えて JSON を作る、という方向です。

AI と ComfyUI の組み合わせと聞くと、こちらを想像する方も多いかもしれません。

ただし、これはかなり難しいです。

---

## workflowを作るところから任せるのは難しい

ComfyUI の workflow は JSON なので、AI に作らせるのも簡単そうに見えます。

しかし実際には、workflow はその人の ComfyUI 環境にかなり依存します。  
custom node が入っているか、モデルファイルがあるか、ノードの仕様が今も同じか、といった条件が揃っていないと動きません。

AI が古い知識や一般的な知識だけで workflow を作っても、自分の環境では動かないことがあります。

この話は重要ですが、この記事では深入りしません。  
ここではまず、**すでに動く workflow を AI に使わせる方法**に絞ります。

---

## この記事で扱うのは、動くworkflowをAPI経由で使わせる方法

ここで扱うのは、**人間があらかじめ作った動作確認済み workflow を、AI エージェントに API 経由で実行させる方法**です。

AI に ComfyUI を自由操作させる話ではなく、人間が作った workflow を AI の道具として渡す話です。

---

## API経由で使わせる方法

API 経由で使わせる場合、考え方はシンプルです。

1. ComfyUI を起動しておく
2. 動く workflow を API 形式で保存する
3. AI エージェントに workflow を渡す
4. その workflow でできる作業を指示する

実際に API で workflow を投げる手順は [APIでworkflowを実行してみる](/ja/data-utilities/api-run-workflow/) で扱っています。  
このページでは、AI に渡すときの考え方を中心に整理します。

### ComfyUIを起動しておく

API は「ComfyUI を起動しなくてよくなる仕組み」ではありません。

ローカルで使う場合は、いつものように ComfyUI を起動して、`http://127.0.0.1:8188` を開ける状態にしておきます。

AI エージェントは、このサーバに対して HTTP リクエストを送ります。  
ノード画面の代わりに、AI が外側から `Run` を押すようなイメージです。

### 動くworkflowをAPI形式で保存する

次に、AI に使わせたい workflow を API 形式で保存します。

通常の workflow JSON は、ノードの位置や UI 用の情報も含んでいます。  
API 形式の JSON は、ComfyUI サーバに「これを実行して」と渡すための形です。

ComfyUI のメニューから `Export (API)` を使うと、API 実行用の JSON を保存できます。

> ここで出てくる API 形式の JSON は、ComfyUI API 上では `prompt` と呼ばれることがあります。  
> テキストプロンプトだけではなく、workflow 全体を指すので少しややこしいですね。

### AIエージェントにworkflowを渡す

AI エージェントに渡すのは、workflow そのものと、その workflow で変更してよい値です。

たとえば text2image の workflow なら、AI に変更させるのは次のような値です。

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
- custom node 固有の内部設定

AI に「全部いい感じにして」と頼むのではなく、**この workflow のこの値だけ変えてよい** と渡すのがポイントです。

たとえば、次のような説明を渡します。

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

### そのworkflowでできる作業を指示する

workflow を渡したら、あとはその workflow でできる範囲の作業を AI に指示します。

分かりやすい例なら、シンプルな text2image workflow を渡し、AI にいろいろなプロンプトを作らせて大量に画像生成させる、といった使い方です。

画像編集 workflow を渡して、入力画像を修正させるのもよいです。

現在の画像編集モデルは、一発でうまくいくとは限りません。  
間違ったものが消えたり、編集意図を誤解したりすることがあります。

そこに AI エージェントを挟むと、一度実行し、出力を確認し、うまくいっていなければ別のプロンプトや seed で再実行する、という流れを作れます。

ComfyUI でできることは、画像生成 AI を動かすだけではありません。  
セグメンテーション、リサイズ、色調補正、マスク処理のような処理もできます。

workflow をゼロから作らせなくても、小さな workflow をいくつか渡し、それを AI エージェントの作業ツールとして使わせることで、かなりいろいろなことができます。

---

## workflowを道具として渡す

この方法では、workflow を「作品」や「画面上のノード構成」としてではなく、**AI が呼び出せる道具**として扱います。

たとえば、次のような道具です。

- `text2image`
- `image_edit`
- `segment_with_sam3`
- `upscale_image`
- `resize_image`
- `make_mask`

AI エージェントは、その道具の中身を毎回理解する必要はありません。  
「この道具にはこういう入力を渡せば、こういう出力が返る」ということだけ分かれば十分です。

これは、普通のプログラムで関数を使う感覚に近いです。

`text2image(prompt, seed)` のような関数があり、その中身では ComfyUI の workflow が動いている、というイメージですね。

---

## workflowは小さく分けた方が使わせやすい

[リーダブルノード](/ja/begin-with/readable-nodes/) は、ざっくり言えば読みやすい workflow を組もうという考え方です。

その中の一つに、**小さく、シンプルに** というものがあります。

workflow が肥大化すると、処理時間が長くなり、エラー率が上がり、読みづらくなります。  
AI に使わせるという観点でも、ひとつひとつの workflow は小さい方が扱いやすいです。

たとえば、画像生成、アップスケール、顔の修正までをひとつにまとめた workflow があるとします。

これがひとつにまとまっている場合、最初から最後まで実行しないと結果が分かりません。  
途中の画像生成が失敗していても、アップスケールや修正まで走ってしまいます。

でも、これが3つの workflow に分かれていたらどうでしょう。

- text2image
- upscale
- face fix

最初の text2image でうまくいったものだけを、次のアップスケールに進ませることができます。  
AI エージェントも、「まず候補を作る」「よいものだけ次の道具に渡す」という判断をしやすくなります。

小さな workflow は、人間にとって読みやすいだけでなく、AI にとっても使いやすい道具になります。

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

ComfyUI を AI エージェントに使わせるなら、まずは **動作確認済みの workflow を API 経由で実行させる** 方法から始めるのがおすすめです。

workflow をゼロから作らせるのは面白いですが、環境依存が強く、別の難しさがあります。

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

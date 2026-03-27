---
layout: page.njk
lang: ja
section: basic-workflows
slug: llm-mllm
navId: llm-mllm
title: "LLM / MLLM"
summary: "ComfyUIでLLMを使うと何ができるか"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

## LLM / MLLM とは？

LLMは、ものすごくざっくり言えばChatGPTのように、文章を読んで文章で返すAIのことです。

MLLMは、そこに画像なども入力できるようになったLLMです。その名の通り「マルチモーダル」LLMということですね。

---

## ComfyUIで何に使う？

ComfyUIでのLLMは、対話を楽しむというより、画像生成モデルへ渡すバトンを作る「裏方」 として使うことが多いです。

- **プロンプトの拡張・翻訳**
  - 人間の雑な指示を、AIが理解しやすい詳細な英語プロンプトへ膨らませる
- **タグ生成・画像キャプション**
  - 画像を見せて、その画像を説明するタグや文章を出力させます
  - 学習用キャプションにしたり、これをプロンプトとして再生成したりもできますね
- **物体検出・セグメンテーション** 
  - MLLMの中にはより専門的なタスクを行えるものもあります
  - 特にMLLMを使った物体検出は、自然文で対象を指定できるため重宝します

---

## ComfyUIで使う4つの方法

ComfyUIは画像生成に特化したエンジンなので、LLMを動かす機能は限定的です。仕組みが全く違いますしね。

そのため、基本的にはコアノード・カスタムノード・外部との連携で使います。


### TextGenerate ノード

画像生成で使っているテキストエンコーダを、LLM/MLLMとして使えるようにしようと、最近コアノードとして追加されたものです。

ComfyUI上のコードだけで無理矢理動かしているため、llama-cppといった専用のエンジンに比べると速度も機能も数段落ちます。

もちろん、コアで動かせるというだけで素晴らしくはありますが、現状はまだおすすめできるものではありません。

![Gemma 3](https://gyazo.com/4e2275270a8f40c8ecdbe2b286addb2e){gyazo=image}

[](/workflows/basic-workflows/llm-mllm/TextGenerate_gemma3.json)


**対応しているモデル**
- Gemma 3
- Qwen3
- Qwen-3.5

### ComfyUIカスタムノード

画像生成モデルと同じように、モデルファイルをダウンロードして自分のPCで動かす方法です。

キャプション生成や物体検出など、特定のタスクに特化した軽量モデルがメインになります。

![Florence2](https://gyazo.com/b364e8bc1ba2799ad953384f4dfe2079){gyazo=image}

**対応している代表的なモデル**
- [JoyCaption](/ja/basic-workflows/joycaption/)
- [Florence-2](/ja/basic-workflows/florence2/)
- Qwen3 VL

### 外部LLMサーバ連携

LLMの推論は Ollama や LM Studio といった「専門のエンジン」に任せて、ComfyUI からは API 経由で叩く方法です。

同じ PC で動かすなら結局 VRAM の取り合いになるのは変わりませんが、**推論環境を ComfyUI の外に切り離せる** のが最大のポイントです。
- ComfyUI 側の依存関係を汚さずに済むので、メンテナンス性が高いです
- 別のPCで動かしてネットワークごしに連携すれば、VRAMの奪い合いも解消できます

→ [外部LLMサーバ連携](/ja/basic-workflows/external-llm-server/)

### 公式の課金APIノード

いわゆるChatGPT や Gemini といったクローズドなサービスを、API経由で呼び出すComfyUI公式ノードです。

![Google_Gemini](https://gyazo.com/0d12a7369948fa19779c0b7ffb487cd0){gyazo=image}

身も蓋もないことを言えば、ローカルモデルより遥かに賢く、そして速い です。
- PC の負荷が完全にゼロ。画像生成を回しながら裏でプロンプトを練らせても、生成速度に一切影響しません
- ただし、当然従量課金が必要なのと、NSFW（成人向け）な内容はガードレールに引っかかって拒否されるため、注意は必要です

→ [APIノード](/ja/basic-workflows/api-nodes/)

---

## 余談：実はすでに使っている？

最近の画像生成モデル(Qwen-Image や Z-image など)では、プロンプトを理解するためのテキストエンコーダとして、中身に Qwen や Gemma といった MLLM そのものを内蔵しています。

テキストプロンプトや参照画像を理解して画像生成・編集につなげるために使っていますが、逆に言えば、そのためにしか使っていない贅沢な状況ともいえます。  
これを直接MLLMとして使えるようにできると、面白いんですけどね…

---
layout: page.njk
lang: ja
slug: settings
navId: settings
title: "設定"
summary: "設定について"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 設定画面の開き方

設定は、画面左上の **ComfyUIロゴ** → **⚙ Settings** で開けます。

用意されているものに限りますが、ComfyUI本体だけでなく、カスタムノードの設定もここから行えます。
基本的には見れば分かるので、自分で色々カスタムしてみてください。

## 個人的なオススメ設定

いくつかオススメの設定を紹介します。

### 言語
`Comfy` → `Locale` → `English`
- 日本語ユーザーの場合、これが日本語になっていると思いますが、このサイトでは`English`を使用します。
- 日本語にしたい気持ちは分かるのですが、使われる語句のほとんどが専門用語なため、下手に日本語にすると余計にわからなくなります。

### バッジ
`Lite Graph` → `Node` → `Node source badge mode` → `Show All`
- そのノードがComfyUIのコアノードなのか、カスタムノードなのかを示すバッジを表示します。
- 他人のworkflowを読み込んだ際、どのカスタムノードを使ったノードなのかを確認することができます。

### Runボタン位置

`▷ Run` ボタン横の `⋮⋮` をドラッグすると、好きな位置に変更できます。

![](https://gyazo.com/1c7183f67866e67e640715cfe42a2a61){gyazo=loop}


### 生成中のプレビュー

ComfyUI Manger → Preview methodを `Auto`/`TAESD`/`latent2RGB`のどれかに設定
- KSamlperノードの内部に、生成される最中のプレビュー画像が表示されるようになります。
- かなりスペースを取ってしまうため私はオフにしていますが、どのように画像が生成されるのか学べる良い機能です。

![](https://gyazo.com/b57c81af6a11466c664303f29b25b4cc){gyazo=loop}
---
layout: page.njk
lang: ja
section: data-utilities
slug: wildcards
navId: wildcards
title: "ワイルドカード"
summary: "Queueごとにpromptの一部をランダムに入れ替える"
permalink: "/{{ lang }}/data-utilities/{{ slug }}/"
hero:
  gradient: ""
---

## ワイルドカードとは？

ワイルドカードは、Queueごとにpromptの一部をランダムに入れ替えて、生成結果にバリエーションを持たせるための機能です。

例えば `photo of {red|yellow|blue} flower` と書くと、`red` / `yellow` / `blue` のどれかが選ばれて実行されます。

一気に大量の絵を出力させるとき、同じプロンプトだと面白くないので、これで絵にバリエーションを持たせましょう！

---

## Queueごとにランダムなプロンプトで画像生成

ComfyUIのテキスト欄（例：`CLIP Text Encode`）は、デフォルトで `{a|b|c}` 形式のワイルドカードに対応しています。

![](https://gyazo.com/06d9e27bd6586911830efcd2c3ff50cc){gyazo=loop}

[](/workflows/data-utilities/wildcards/wildcard_core.json)

- `photo of {red|yellow|blue} flower`

  - `{}` 内の候補から1つが選ばれ、promptに展開されます
  - `photo of red flower` だったり、`photo of blue flower` だったりするわけですね

---

## Impact-Pack

デフォルトで出来るのは最も単純な形のワイルドカードのみです。

ワイルドカードをネストしたり、各単語の出現率を偏らせたり、テキストファイルから候補を読み込んだりしたい場合は、Impact-Packを使うのが定番です。

### カスタムノード

- [ltdrdata/ComfyUI-Impact-Pack](https://github.com/ltdrdata/ComfyUI-Impact-Pack)

### ImpactWildcardProcessor / Encode

![](https://gyazo.com/851ccf19703e3b7b97f779e0cb6ae23f){gyazo=image}

[](/workflows/data-utilities/wildcards/ImpactWildcardProcessor.json)

- 上段にワイルドカードを書きます
- 下段には展開後のテキストが表示されます

`ImpactWildcardEncode` では、これに加えて LoRA をワイルドカードとして切り替えることができます。

### ワイルドカード構文（Impact-Pack）

**dynamic prompts**

`{}` の中に候補を並べる、一番基本の書き方です。

- `{a|b|c}`

  - `|` 区切りで1つ選ばれます
- `{a|{1|2|3}|c}`

  - 入れ子もできます
- `{5::red|4::green|7::blue|black}`

  - `n::` を前に付けると、確率に偏りを付けられます
  - 数字が大きいほど出やすくなります（確率は合計で正規化されます）

**テキストファイルを読み込む**

別で単語リストを用意して、それをワイルドカードとして呼び出すこともできます。

- 1. 配置場所

  - `custom_nodes/ComfyUI-Impact-Pack/custom_wildcards`
- 2. 書き方

  - 例：`color.txt`

    ```text
    red
    blue
    yellow
    ```

- 3. 呼び出す

  - `__color__` のように書くと、テキストファイルから1行をランダムに選びます
  - `__color__ hair` なら、`red hair` / `blue hair` / `yellow hair` のように展開されます
- サブフォルダも使えます

  - `custom_wildcards/obj/color.txt` を置いた場合は `__obj/color__` のように呼び出します

**`$$`（複数選択）**

`$$` は「候補から複数個を選んで、1つの文字列として返す」ための書き方です。

- `{n$$red|blue|yellow}`

  - `red/blue/yellow` から n個 選びます
  - 例：`{2$$red|blue|yellow}` → `red blue` / `blue yellow` のようになります
- `{n1-n2$$red|blue|yellow}`

  - n1〜n2個 の範囲で選びます（個数もランダム）
  - 例：`{1-3$$red|blue|yellow}` → `red` のときもあれば `red blue yellow` になることもあります
- `{2$$ and $$red|blue|yellow}`
  - 区切り文字を指定して連結できます
  - 例：`{2$$ and $$red|blue|yellow}` → `red and yellow` / `blue and red` のようになります

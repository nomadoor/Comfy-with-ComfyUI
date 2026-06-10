---
layout: page.njk
lang: ja
section: basic-workflows
slug: ideogram-4
navId: ideogram-4
title: "Ideogram 4.0"
created: 2026-06-10
updated: 2026-06-10
summary: "Ideogram 4.0での画像生成"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: "https://i.gyazo.com/b282bac27265443a567d4e3e462d71c2.png"
tags: []
---

## Ideogram 4.0とは？

**[Ideogram 4.0](https://ideogram.ai/models/4.0/)** は、Ideogram が公開した open weight の画像生成モデルです。

とくに、文字を含むデザイン、ポスター、ロゴ、DTP 的なレイアウトに強いモデルです。

モデル自体は 9.3B の DiT 系モデルで、既存モデルの fine-tune や蒸留ではなく、最初から学習されています。

テキストエンコーダには **Qwen3-VL-8B-Instruct** が使われています。
最終層だけを見るのではなく、13 個の中間層の hidden states を結合して DiT に渡す構成になっており、文字列そのものだけでなく、構図や意味の理解をかなり強めに使う設計です。

もうひとつ大きいのが、プロンプトです。

普通の自然文プロンプトでも動きますが、Ideogram 4.0 は **構造化 JSON caption** で学習されています。
そのため、自然文でふわっと書くより、文字、色、配置、背景、要素ごとの説明を JSON として書いたほうが本来の性能を出しやすくなります。

---

## モデルのダウンロード

公式の重みは Hugging Face で公開されています。

- [ideogram-ai/ideogram-4-nf4](https://huggingface.co/ideogram-ai/ideogram-4-nf4)
- [ideogram-ai/ideogram-4-fp8](https://huggingface.co/ideogram-ai/ideogram-4-fp8)
- [ideogram-ai/ideogram-4-nf4-diffusers](https://huggingface.co/ideogram-ai/ideogram-4-nf4-diffusers)

Hugging Face の gated model なので、事前にモデルページで利用条件に同意し、Hugging Face の token でログインしておく必要があります。

```bash
hf auth login
```

ComfyUI で使う場合の配置は、使う実装や workflow 側の参照名に合わせます。

---

## JSON prompt

Ideogram 4.0 は、普通のプロンプトではなく **JSON で絵を説明する** ほうが本筋です。

最低限見るところは、この三つです。

- `high_level_description`
  - 画像全体を一文〜二文で説明します。
- `style_description`
  - 写真なのか、イラストなのか、デザインなのか、色、光、画風を指定します。
- `compositional_deconstruction`
  - 背景と、画像内の要素を細かく分けて書きます。

文字を入れたい場合は、`elements` の中に `type: "text"` として書きます。

```json
{
  "type": "text",
  "bbox": [120, 180, 240, 820],
  "text": "COMFY WITH COMFYUI",
  "desc": "Large bold white sans-serif title text centered near the top."
}
```

`bbox` は、画像の中でどこに置くかを指定するための座標です。

`[y_min, x_min, y_max, x_max]` の順で、0〜1000 の正規化座標として書きます。

このへんが Ideogram 4.0 らしいところですね。
普通の画像生成モデルに「左上にロゴ、中央に大きい文字、下に小さい注釈」と言うより、かなり DTP に近い感覚で指定できます。

---

## Magic Prompt

毎回 JSON を手で書くのは面倒なので、公式実装には **Magic Prompt** があります。

自然文プロンプトを LLM で構造化 JSON caption に変換する仕組みです。

公式の `run_inference.py` では、デフォルトで `ideogram-4-v1` の Magic Prompt を使えます。
これは Ideogram の hosted API 側で展開されるため、`IDEOGRAM_API_KEY` が必要です。

```bash
python run_inference.py \
  --prompt "a poster for a small coffee shop opening in Tokyo" \
  --output out.png \
  --quantization "nf4" \
  --magic-prompt-key "$IDEOGRAM_API_KEY"
```

システムプロンプト自体は公開されているため、別の LLM で JSON caption を作ることもできます。
ただし、公式がテストしている経路とは結果が変わる可能性があります。

---

## workflow

Ideogram 4.0 の workflow は、普通の text2image より **プロンプトをどう作るか** が分かりにくいです。

{% mediaRow img="https://gyazo.com/b282bac27265443a567d4e3e462d71c2 {gyazo=image}", width=60, align="left" %}
**全体の流れ**

- 自然文プロンプトをそのまま使うこともできます。
- ただし、本来は JSON caption を作ってからモデルへ渡すほうが向いています。
- ComfyUI 上では、自然文プロンプト、Magic Prompt、JSON caption のどこを触っているのかを分けて見ると理解しやすいです。

{% endmediaRow %}

### 自然文で書く場合

まずは普通に書いて構いません。

ただし、Ideogram 4.0 は JSON caption で学習されているため、自然文だけだと、細かいレイアウト指定や文字配置は弱くなりやすいです。

### JSONで書く場合

文字、色、配置をちゃんと制御したい場合はこちらです。

- `text` に実際に描かせたい文字を書く
- `desc` に書体、サイズ感、位置、周囲との関係を書く
- `bbox` で置き場所を指定する
- `color_palette` で全体や要素ごとの色を寄せる

`bbox` や `color_palette` が専用の制御画像として入っているわけではありません。
あくまで JSON 文字列を Qwen3-VL が読み、それを DiT に渡しています。

そのため、ControlNet のように厳密なレイアウト制御をしているというより、**モデルが読みやすい形式でレイアウトを説明している** と考えたほうが近いです。

---

## Asymmetric CFG

Ideogram 4.0 では、**Asymmetric CFG** という CFG が使われています。

計算式自体は、通常の [CFG](/ja/ai-capabilities/cfg/) と大きく変わりません。

ただし、unconditional 側で空プロンプトを渡すのではなく、テキスト token を除去した状態を使います。
空文字も「空文字という条件」なので、そこをもう少しきれいに分けている、と考えると分かりやすいです。

---

## パラメータ

公式実装には、いくつかの sampler preset があります。

- `V4_QUALITY_48`
  - 48 steps
  - 品質優先
- `V4_DEFAULT_20`
  - 20 steps
  - 標準
- `V4_TURBO_12`
  - 12 steps
  - 速度優先

解像度は、縦横とも 16 の倍数で、256〜2048 の範囲をサポートしています。
アスペクト比は 6:1 まで対応しているので、正方形だけでなく、横長バナーや縦長ポスターにも向いています。

最高品質を狙うなら 2048px と `V4_QUALITY_48` ですが、当然かなり重くなります。
まずは 1024px 前後で挙動を見てから上げるのが無難です。

---

## 注意点

- NSFW prompt はブロックされます。
- 非 JSON の自然文プロンプトでは、Safety filter の false positive が出やすいと公式ドキュメントに書かれています。
- 公開重みの利用条件は、Hugging Face のモデルページで確認してください。
- JSON の key order や hex color の形式は、公式の Prompting Guide に合わせたほうが安定します。

---

## 参考

- [Ideogram 4.0](https://ideogram.ai/models/4.0/)
- [Ideogram 4.0 Technical Details](https://ideogram.ai/blog/ideogram-4.0/)
- [ideogram-oss/ideogram4](https://github.com/ideogram-oss/ideogram4)
- [Prompting Guide](https://github.com/ideogram-oss/ideogram4/blob/main/docs/prompting.md)
- [Inference Reference](https://github.com/ideogram-oss/ideogram4/blob/main/docs/inference.md)
- [Ideogram 4 Hugging Face collection](https://huggingface.co/collections/ideogram-ai/ideogram-4)

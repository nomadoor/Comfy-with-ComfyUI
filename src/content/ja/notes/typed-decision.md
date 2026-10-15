---
layout: page.njk
lang: ja
slug: typed-decision
section: notes
navId: typed-decision
title: "ComfyUI-TypedDecision"
created: 2026-09-30
updated: 2026-10-16
noteTags: ["project", "custom-nodes", "concept"]
summary: "画像や動画、テキストについての問いに、確率つきで答えてもらうノード"
seoTitle: "ComfyUI-TypedDecision：判断だけをするMLLMをComfyUIで使う"
seoDescription: "noul / choice / score の3つの型で、画像や動画、テキストについての問いに確率つきで答えるComfyUIカスタムノード。d3-miniを使った基本のworkflowと、プロンプトから解像度を決める例、データセットの仕分け、動画から人物が映る区間を探す例を紹介します。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/typed-decision/typed_decision_d3_mini_noul.png"
---

## ComfyUI-TypedDecision

マルチモーダル LLM に文章を書かせず、判定だけをさせるタスクを "Typed Decision" と呼んだりします。
Jev が有名ですが、ローカルで同じようなことができるモデルがいくつかあるため、ComfyUI カスタムノードとして実装しました。

答えの形が決まっているため、条件分岐やデータセットの処理に使えるかもしれません。なにより、高速ですしね。

では、Typed Decision で何ができるのか、ComfyUI でどう遊べるのかを見ていきましょう。

---

## インストール

[nomadoor/ComfyUI-TypedDecision](https://github.com/nomadoor/ComfyUI-TypedDecision)

- `ComfyUI Manager` で `TypedDecision` を検索してインストールしてください。

---

## 対応モデル

| モデル | ベース | int8 のサイズ | 画像 | 動画 |
| --- | --- | --- | --- | --- |
| [d3-flash](https://huggingface.co/vllm-sr/d3-flash) | Qwen3.5-9B | 9.88 GB | 何枚でも | ○ |
| [d3-mini](https://huggingface.co/vllm-sr/d3-mini) | Qwen3.5-4B | 5.52 GB | 何枚でも | ○ |
| [d3-nano](https://huggingface.co/vllm-sr/d3-nano) | Qwen3.5-2B | 3.06 GB | 何枚でも | ○ |
| [d3-lite](https://huggingface.co/vllm-sr/d3-lite) | Qwen3.5-0.8B | 1.21 GB | 何枚でも | ○ |
| [Clef-flash](https://huggingface.co/Cloudflare/clef-flash) | Qwen3.5-9B | 12.2 GB | 何枚でも | ○ |
| [imajev-4b](https://huggingface.co/mohit67890/imajev-4b) | Qwen3.5-4B + LoRA | 5.76 GB + 490 MB | 2 枚まで | × |

この記事では、すべて **d3-mini** を使っています。性能がよく、そのうえ軽いのでおすすめです。

---

## モデルのダウンロード

### d3 / Clef-flash

使うものを `text_encoders` に置いてください。

- text_encoders
  - [d3_mini_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_mini_int8_convrot.safetensors) (5.52 GB)
  - [d3_flash_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_flash_int8_convrot.safetensors) (9.88 GB)
  - [d3_nano_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_nano_int8_convrot.safetensors) (3.06 GB)
  - [d3_lite_int8_convrot.safetensors](https://huggingface.co/nomadoor/d3/blob/main/text_encoders/d3_lite_int8_convrot.safetensors) (1.21 GB)
  - [clef_flash_int8_convrot.safetensors](https://huggingface.co/nomadoor/clef/blob/main/text_encoders/clef_flash_int8_convrot.safetensors) (12.2 GB)

```text
📂ComfyUI/
└── 📂models/
    └── 📂text_encoders/
        └── d3_mini_int8_convrot.safetensors
```

### imajev

Qwen3.5-4B に、imajev-4b のファイルを組み合わせて使います。

- text_encoders
  - [qwen3.5_4b_int8_convrot.safetensors](https://huggingface.co/nomadoor/Qwen3.5/blob/main/text_encoders/qwen3.5_4b_int8_convrot.safetensors) (5.76 GB)
- typed_decision
  - [mohit67890/imajev-4b](https://huggingface.co/mohit67890/imajev-4b/tree/main) (以下のファイルで 490 MB)
    - 以下のファイルを `imajev-4b` フォルダに入れます。リポジトリを丸ごとダウンロードしても構いません

```text
📂ComfyUI/
└── 📂models/
    ├── 📂text_encoders/
    │   └── qwen3.5_4b_int8_convrot.safetensors
    └── 📂typed_decision/
        └── 📂imajev-4b/
            ├── adapter_config.json
            ├── adapter_model.safetensors
            ├── calibration-rot4-modality.json
            ├── decision_readout.json
            └── decision_readout.safetensors
```

---

## Load Typed Decision Model

`backbone` でモデルのファイルを、`adapter` でそのモデルの種類を選んでください。

| モデル | `backbone` | `adapter` |
| --- | --- | --- |
| d3 | d3 のファイル | `d3` |
| Clef-flash | Clef-flash のファイル | `clef` |
| imajev | Qwen3.5-4B のファイル | `imajev-4b` |

`adapter` を選ぶと、そのモデルで使える設定が出てきます。

- `debias`（d3・imajev）：選択肢の並び順を変えて判定し、平均します。並び順による偏りが減りますが、そのぶん遅くなります
  - d3 は choice のときだけ、逆の順番でも判定します
  - imajev はすべての mode で、最大 4 通りの並び順を判定します
- `fps`（d3・Clef-flash）：動画を 1 秒に何フレーム読むか（既定は 2）
- `calibration`（imajev）：温度較正をかけます

---

## 3つの mode

問いの形は 3 種類です。どれを選ぶかで、入力欄と答えの型が変わります。質問と選択肢は英語で書いてください。

> [!NOTE]
> 出力ソケットは 3 つの mode で共通ですが、中身の意味は mode ごとに変わります。

### noul (Yes or No)

質問に対して、true か false かを答えます。

![](/media/notes/typed-decision/typed_decision_d3_mini_noul.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_noul.json)

**入力**

- `instructions` に、判定してほしい主張か、yes / no で答えられる質問を書きます
- `criteria_true` / `criteria_false` は任意です。どういうときに yes / no なのかを添えられます

**出力**

- `value` に true の確率
- `label` に `yes` / `no`
- `pass` に `value >= threshold` の結果が `Boolean` で出ます

今回は「画像に人がたくさん写っている」という問いを、true か false で判断させています。

ただし、何人以上で「たくさん」なのかは曖昧ですね。そこで「5 人以上なら yes」「4 人以下なら no」という基準を添えています。

### choice

用意された選択肢から 1 つ選びます。

![](/media/notes/typed-decision/typed_decision_d3_mini_choice.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_choice.json)

**入力**

- `criteria` に選択肢を 1 行ずつ書きます
  - 選択肢名だけでは伝わらないときは、`landscape: scenery with no clear main subject` のように `:` で説明を足せます

**出力**

- `value` に選ばれた選択肢の確率
- `label` に選ばれた選択肢
- `index` に何行目か
  - 選ばれた選択肢が 3 行目なら、0 から数えて `index` は 2 です

### score

用意した評価軸で、N 段階評価ができます。

![](/media/notes/typed-decision/typed_decision_d3_mini_score.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_score.json)

**入力**

- `criteria` に段階を 1 行ずつ、**低いほうから**書きます

**出力**

- `value` に期待値
  - 1 行目を `0` として数えるので、5 段階なら `0.0` 〜 `4.0` の範囲です

ここでは、学習データとして使えるかを 5 段階で評価させています。

`value` は各段階の確率で重みをつけた平均なので、`1.35` のような段階の間の値になります。「poor と acceptable の間だが poor 寄り」といった評価ができるわけですね。

---

## 画像は何枚でも入れられる

d3 と Clef-flash は画像を何枚でも入れられます。複数の画像を見比べる問いも立てられますね。

imajev は 2 枚までで、**1 枚目が参照、2 枚目が判定対象**になります。

![](/media/notes/typed-decision/typed_decision_d3_mini_noul_two_images.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_noul_two_images.json)

「1 枚目と 2 枚目は同じ人物ですか？」と聞けば、同一人物判定として使えます。

---

## 動画も判定できる

d3 と Clef-flash では、`videos` に動画をつなげば、動画についての問いにも答えてくれます。

![](/media/notes/typed-decision/typed_decision_d3_mini_noul_visible.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_d3_mini_noul_visible.json)

Load Typed Decision Model の `fps` で動画全体を読み、全フレームをまとめて一度に判定します。1 分の動画を 2 fps で読むと 120 フレームです。

`fps` が 2 だと 0.5 秒単位でしか見ないので、一瞬しか現れないものは見逃すかもしれません。

---

## state で文脈を渡す

`instructions` が「問い」なら、`state` は **その問いに答えるための文脈** です。画像を見ても分からないことを、テキストで渡しておきます。

たとえば「写真の商品が出品情報どおりの色か」を判定したいとき、何色が正解なの？という情報が質問にはありません。

`state` に出品情報を書いておけば、それと突き合わせてくれます。

- `state`：`The listing says: red suede boat shoes.`
- `instructions`：`The shoes in the photo match the color in the listing.`

> [!TIP]
> `state` は JSON でも書けます。その場合、`instructions` から `listing.color` のように項目名で指せます。

---

## Typed Decision Moment Search

動画の中から、条件が成り立っている区間を探すノードです。「犬が映っている」「この人が映っている」といった、1 フレームを見れば分かる条件に向いています。仕組み上、「右に歩いている」といった動きの向きを判定するようなことはできません。

![](/media/notes/typed-decision/typed_decision_moment_search_d3_mini.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_moment_search_d3_mini.json)

ここでは、参照画像の人物が映っている区間を探し、つなげて 1 本の動画にしています。

**入力**

- `instructions` / `criteria_true` / `criteria_false` / `state` は、Typed Decision の noul と同じです
- `images` に参照画像をつなぐと、その人や物を動画の中から探せます
- `window` は、最初にまとめて判定するフレーム数です（既定は 8。2 fps で読むので 4 秒ぶん）
- `threshold` は、フレームを合格にする確率です

**出力**

- `intervals` に、見つかった区間の開始・終了の秒数などが JSON で出ます
- `videos` に、区間ごとに切り出した動画が出ます
  - 何も見つからなければ、後ろの動画ノードは実行されません

{% outputs %}
![input](/media/notes/typed-decision/typed_decision_moment_search_d3_mini_input_video.mp4){media=loop} ![参照画像](/media/notes/typed-decision/typed_decision_moment_search_d3_mini_input_image.png){media=image} ![output](/media/notes/typed-decision/typed_decision_moment_search_d3_mini_output.mp4){media=loop}
{% endoutputs %}

### 質問の書き方

参照画像を使うときは、**動画について**質問してください。

- 〇 `The video shows the same person as the image.`
- × `The person in the image is visible.`

後者は参照画像そのものにも当てはまってしまうので、全フレームが合格になります。

> [!NOTE]
> 区間はモデルの判断どおりに切られます。画面から半分はみ出した人は、もう「映っていない」とされることもあるので、数えたいものに合わせて質問を書いてください。

---

## 実践

### プロンプトから解像度を決める

上では画像や動画を入力しましたが、テキスト入力だけでも使うことができます。

プロンプトを読ませて、縦長、横長、正方形……どの形で生成させるのが良さそうか判断してもらいましょう。

![](/media/notes/typed-decision/typed_decision_choice_resolution_from_prompt_krea2.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_choice_resolution_from_prompt_krea2.json)

3 つの解像度を [List](/ja/data-utilities/list/) として用意しておき、`choice` の `index` 出力で切り替えます。

1. `state` にプロンプトを入力します
2. `choice` で `portrait` / `landscape` / `square` を選ばせます
   - `index` は `INT` なので、portrait = 0、landscape = 1、square = 2 という対応になります
3. `index` を `Get Item From List` に渡し、幅と高さのリストから選びます
4. 選んだ値をそれぞれ `Empty Latent Image` に入れて生成します

このプロンプトでは `square` が選ばれ、ちゃんと 1024 × 1024 の画像が生成されていますね。

{% outputs %}
![](/media/notes/typed-decision/typed_decision_choice_resolution_from_prompt_krea2_output.png){media=image}
{% endoutputs %}

### データセットの仕分け

速さを活かして、大量の画像を仕分ける、というのは良さそうな使い方ですね。

![](/media/notes/typed-decision/typed_decision_noul_dataset_sort.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul_dataset_sort.json)

フォルダの画像を、条件に合うものと合わないものに振り分けます。

1. `Load Image (from Folder)` でフォルダを List として読み込みます
2. `noul` で「人が写っているか」を判定します
3. `pass` を `If/Else Switch` に渡し、保存先のパスを切り替えます
   - ComfyUI の output フォルダの中の `typed_decision` に、`accepted` と `rejected` のフォルダができているはずです

人物 2 枚、その他 3 枚の入ったフォルダを読ませてみます。

{% outputs %}
![input](/media/notes/typed-decision/typed_decision_noul_dataset_sort_input.png){media=image} ![output (accepted)](/media/notes/typed-decision/typed_decision_noul_dataset_sort_output_accepted.png){media=image} ![output (rejected)](/media/notes/typed-decision/typed_decision_noul_dataset_sort_output_rejected.png){media=image}
{% endoutputs %}

人が写っている画像は `accepted`、写っていない画像は `rejected` に保存されていますね。

---

{% outputs "samples" %}
![noul](/media/notes/typed-decision/typed_decision_noul_input.png){media=image} ![choice](/media/notes/typed-decision/typed_decision_choice_input.png){media=image} ![score](/media/notes/typed-decision/typed_decision_score_input.png){media=image} ![2枚入力 1枚目](/media/notes/typed-decision/typed_decision_noul_two_images_input1.png){media=image} ![2枚入力 2枚目](/media/notes/typed-decision/typed_decision_noul_two_images_input2.png){media=image} ![動画](/media/notes/typed-decision/typed_decision_d3_mini_noul_input.mp4){media=loop}
{% endoutputs %}

---
layout: page.njk
lang: ja
slug: typed-decision
section: notes
navId: typed-decision
title: "ComfyUI-TypedDecision"
created: 2026-09-30
updated: 2026-09-30
noteTags: ["project", "custom-nodes", "concept"]
summary: "画像やテキストについての問いに、確率つきで答えてもらうノード"
seoTitle: "ComfyUI-TypedDecision：判断だけをするMLLMをComfyUIで使う"
seoDescription: "noul / choice / score の3つの型で、画像やテキストについての問いに確率つきで答えるComfyUIカスタムノード。imajev-4bを使った基本のworkflowと、プロンプトから解像度を決める例、データセットの仕分け例を紹介します。"
permalink: "/{{ lang }}/notes/{{ slug }}/"
hero:
  image: "/media/notes/typed-decision/typed_decision_noul.png"
---

## ComfyUI-TypedDecision

Jev を発端に、いま **判断だけをする MLLM** が流行っています。文章を書かせるのではなく、「この画像に人は写っているか」と聞くと `yes` / `no` と、その確からしさを確率で返してくれる。こういうタスクを **typed decision** と呼んだりします。

Jev のローカル代替プロジェクトはいくつかあるのですが、その中の [imajev](https://github.com/mohit67890/imajev) が ComfyUI のコアシステムと非常に相性がよかったので、まずこれをカスタムノードとして実装してみました。

では、typed decision で何ができるのか、ComfyUI でどう遊べるのかを見ていきましょう。

---

## インストール

[nomadoor/ComfyUI-TypedDecision](https://github.com/nomadoor/ComfyUI-TypedDecision)

- `ComfyUI Manager` で `TypedDecision` を検索してインストールしてください。

---

## モデルのダウンロード

- text_encoders
  - [qwen3.5_4b_int8_convrot.safetensors](https://huggingface.co/nomadoor/Qwen3.5/blob/main/text_encoders/qwen3.5_4b_int8_convrot.safetensors) (5.76 GB)
  - もしくはオリジナルの [qwen3.5_4b_bf16.safetensors](https://huggingface.co/Comfy-Org/Qwen3.5/blob/main/text_encoders/qwen3.5_4b_bf16.safetensors) (9.32 GB)
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

## 3つの mode

問いの形は 3 種類です。どれを選ぶかで、入力欄と答えの型が変わります。

> [!NOTE]
> 出力ソケットは 3 つの mode で共通ですが、中身の意味は mode ごとに変わります。


### noul (Yes or No)

質問に対して、true か false かを答えます。

![](/media/notes/typed-decision/typed_decision_noul.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul.json)

**入力**

- `instructions` に、判定してほしい主張か、yes / no で答えられる質問を書きます
- `criteria_true` / `criteria_false` は任意です。どういうときに yes / no なのかを添えられます

**出力**

- `value` に true の確率
  - 判断がつかないぶんは true と false に半分ずつ振られるので、迷ったときは 0.5 付近になります
- `label` に `yes` / `no`
- `pass` に `value >= threshold` かつ判断を保留していない、の結果が `Boolean` で出ます

今回は「画像に人がたくさん写っている」という問いを、true か false で判断させています。

ただし、何人以上で「たくさん」なのかは曖昧ですね。そこで「5 人以上なら yes」「4 人以下なら no」という基準を添えています。

### choice

用意された選択肢から 1 つ選びます。

![](/media/notes/typed-decision/typed_decision_choice.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_choice.json)

**入力**

- `criteria` に選択肢を 1 行ずつ書きます
  - 選択肢名だけでは伝わらないときは、`landscape: scenery with no clear main subject` のように `:` で説明を足せます

**出力**

- `label` に選ばれた選択肢
- `index` に何行目か
  - 選ばれた選択肢が 3 行目なら、0 から数えて `index` は 2 です

### score

用意した評価軸で、N 段階評価ができます。

![](/media/notes/typed-decision/typed_decision_score.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_score.json)

**入力**

- `criteria` に段階を 1 行ずつ、**低いほうから**書きます

**出力**

- `value` に期待値
  - 1 行目を `0` として数えるので、5 段階なら `0.0` 〜 `4.0` の範囲です

ここでは、学習データとして使えるかを 5 段階で評価させています。

`value` は各段階の確率で重みをつけた平均なので、`3.4` のような段階の間の値になります。「good と excellent の間だが good 寄り」といった評価ができるわけですね。

---

## 画像は2枚入れられる

imajev は画像を 2 枚まで入れられます。
**1 枚目が参照、2 枚目が判定対象**です。

> [!WARNING]
> ComfyUI の仕様上、3 枚目以降のソケットも出てきます。ただ imajev は 2 枚までなので、つなぐとエラーになります。

![](/media/notes/typed-decision/typed_decision_noul_two_images.png){media=image}

[](/workflows/notes/typed-decision/typed_decision_noul_two_images.json)

「1 枚目と 2 枚目は同じ人物ですか？」と聞けば、同一人物判定として使えますね。

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

## 実践

### プロンプトから解像度を決める

上では全て画像を入力しましたが、テキスト入力だけでも使うことができます。

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

typed decision の何よりいいところは高速であることです。

その特徴を使って、大量の画像を仕分ける、というのは良さそうな使い方ですね。

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

> [!NOTE]
> `abstained` 出力を使えば、「判断できなかったもの」だけを別に分けることもできます。人間が見るべきものを絞る、という使い方ですね。

---

{% outputs "samples" %}
![noul](/media/notes/typed-decision/typed_decision_noul_input.png){media=image} ![choice](/media/notes/typed-decision/typed_decision_choice_input.png){media=image} ![score](/media/notes/typed-decision/typed_decision_score_input.png){media=image} ![2枚入力 1枚目](/media/notes/typed-decision/typed_decision_noul_two_images_input1.png){media=image} ![2枚入力 2枚目](/media/notes/typed-decision/typed_decision_noul_two_images_input2.png){media=image}
{% endoutputs %}
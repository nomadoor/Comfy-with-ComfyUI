---
layout: page.njk
lang: ja
section: data-utilities
slug: loop
navId: loop
title: "ループ処理"
created: 2026-09-18
updated: 2026-09-22
summary: "Start Loop と End Loop で、workflow の一部を繰り返し実行する"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
---

ComfyUI の workflow は、見た目の複雑さに反して、基本的には一本道です。素材を入れると、加工されて出てくる。それだけです。

ただ、一度加工したものを、もう一度同じように加工したくなることがあります。

同じ workflow を直列につなげていけばできなくはありませんが、あまり美しくはないですね。

そんなときに使えるのが **ループ処理** です。

## 基本のループ処理

### Start Loop と End Loop

ループは `Start Loop` と `End Loop` のペアで作ります。この 2 つに挟まれた部分が、繰り返し実行されます。

![](/media/data-utilities/loop/loop_simple.png){media=image}

[](/workflows/data-utilities/loop/loop_simple.json)

- `num_iterations`：繰り返す回数。この 1 回ぶんの繰り返しを **iteration** と呼ぶ
- `iteration_index`：今が何回目の iteration なのか、という値

この workflow では、`iteration_index` が 0 から始まり、`0 * 10` → `1 * 10` … と進みます。最後に出力されるのは、`3 * 10` の結果だけです。

### accumulate でループ中の結果をまとめて取得する

![](/media/data-utilities/loop/loop_simple_accumulate.png){media=image}

[](/workflows/data-utilities/loop/loop_simple_accumulate.json)

通常、`End Loop` から出てくるのは、最後の iteration の `output_value` だけです。

`accumulate` を有効にすると、途中の iteration の結果も捨てずに、すべてを List としてまとめて出力できます。

### Simple / For / List

`mode` を切り替えると、繰り返し方を変えられます。

- `Simple`：指定した回数だけ繰り返す
- `For`：開始値、終了値、step を指定して繰り返す。`iteration_index` にはその値がそのまま出る
  - `Simple` は、開始 0、step 1 の `For` といえますね
- `List`：List の要素数だけ繰り返す

言葉だと分かりにくいので、`iteration_index` をそのまま出力してみましょう。

![](/media/data-utilities/loop/loop_simple_for_list.png){media=image}

[](/workflows/data-utilities/loop/loop_simple_for_list.json)

- `Simple`（4 回）：0, 1, 2, 3
- `For`（開始 2 / 終了 14 / step 3）：2, 5, 8, 11
- `List`（要素 3 つ）：0, 1, 2

`List` だけ少し気をつける必要があります。`iteration_index` は何周目かを表すだけなので、List に何を入れても 0, 1, 2 … です。

入れたものを使いたければ、`list_item` から取り出します。この例なら 11, 3, 8 ですね。

### 最初と最後だけ処理を変える

ループの最初、もしくは最後だけ挙動を変えたいときは、`is_first` / `is_last` を使います。

`is_first` は最初の iteration、`is_last` は最後の iteration だけ `true` になります。

![](/media/data-utilities/loop/loop_simple_is_last.png){media=image}

[](/workflows/data-utilities/loop/loop_simple_is_last.json)

基本的には、`If/Else Switch` とセットで使うものと思ってよいでしょう。

この workflow では、最後の iteration だけ出力を `12345` に差し替えています。

> `iteration_index` には今が何周目かという値が出ているので、`If/Else Switch` を使えば、最初や最後に限らず好きなタイミングで処理を切り替えられますよ。

### 画像生成を 4 回繰り返してみる

数字ばかり眺めていても面白くないので、画像生成と組み合わせてみましょう。

`iteration_index` を、そのまま seed として使います。

![](/media/data-utilities/loop/loop_krea_2.png){media=image}

[](/workflows/data-utilities/loop/loop_krea_2.json)

`Simple = 4` なので、seed 0 から seed 3 までの 4 枚が出てきます。

ただ、これだけならループを使う必要はあまりありません。List 処理や Queue の繰り返しでも、同じことはできます。

ループの本当の強みは、**前回の結果を次の iteration へ戻せる** ことにあります。

---

## 前の結果を次のループへ渡す

### current_iteration_value と next_iteration_value

ループの中で作ったデータを `next_iteration_value` につなぐと、その値が `Start Loop` へ戻ります。次の iteration では、それを `current_iteration_value` から受け取れます。

ただし、一番最初の iteration には、前の結果がありません。

そこで使うのが `initial_iteration_value` です。名前のとおり、一番最初に使う値を決めておけます。

![](/media/data-utilities/loop/loop_iteration_value.png){media=image}

[](/workflows/data-utilities/loop/loop_iteration_value.json)

最初の値 `5` が 10 倍されて `next_iteration_value` に渡り、次の iteration でまた 10 倍される……という処理が繰り返されます。

> `next_iteration_value` は、値を次へ渡すだけのものです。ループの外へ結果を持ち出したいときは、`output_value` にも忘れずにつないでおきます。

### 複数の値をまとめて回す

色々と組んでいると、2 つ、3 つのデータをまとめて次の iteration へ送りたくなります。これもちゃんとできますよ。

`Create List` でひとまとめにして送り、受け取った側は `Get Item From List` で 1 つずつ取り出して使います。

![](/media/data-utilities/loop/loop_iteration_value_fibonacci.png){media=image}

[](/workflows/data-utilities/loop/loop_iteration_value_fibonacci.json)

フィボナッチ数列を作ってみましょう。前の 2 つの数を足して、次の数にするものですね。

`[0, 1]` から始めて、`a + b` を計算し、次の iteration へは `[b, a + b]` を渡します。

```text
[0, 1] → [1, 1] → [1, 2] → [2, 3] → [3, 5] → …
```

> ここでは `INT` 同士をひとまとめにしていますが、`IMAGE` と `BOOLEAN` のように、型が違っていても大丈夫です。

### Preview などをループ内で実行する

Preview はその名のとおり見るだけなので、以下のようにつなぎたくなります……が、残念ながらエラーになります。

![](/media/data-utilities/loop/loop_krea_2_preview_invalid.png){media=image}

[](/workflows/data-utilities/loop/loop_krea_2_preview_invalid.json)

細かい理由は省きますが、ループ内のノードは、最終的にすべて `End Loop` へたどり着かないといけません。`Preview Image` がぶら下がったままだと、ループとして閉じないわけです。

とはいえ、その場で見たいだけで、出力するつもりはないこともあります。そんなときのために用意されているのが `End Loop` の `termination` です。

![](/media/data-utilities/loop/loop_krea_2_preview_termination.png){media=image}

[](/workflows/data-utilities/loop/loop_krea_2_preview_termination.json)

とりあえずループとして成り立たせるためのゴミ箱、くらいに思ってもらえば大丈夫です。

---

## 少し複雑な処理の例

より実践的な workflow をいくつか組んでみましょう。何か良い使い方が思いつくかもしれません。

### Generate Text を使った柔軟なループ処理

ループ処理というと、同じような処理の繰り返しを思い浮かべてしまいますが、そこに創造性を足す方法があります。MLLM です。

MLLM と画像編集を組み合わせて、AI さんに次々と編集指示を考えてもらいましょう。

![](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5.png){media=image}

[](/workflows/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5.json)

ベースは [FLUX.2 \[klein\]](/ja/basic-workflows/flux-2-klein/) を使った画像編集の workflow です。

ただし、どんな編集をするかは MLLM に考えてもらいます。今回は画像を見て、服装の中から 1 つ選び、別のアイテムに置き換えます。

少しこだわって、MLLM には画像だけでなく、過去に自分が作ったプロンプトの履歴も渡します。これで、同じような指示を繰り返す事故を防げます。

{% mediaRow img="/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_create_list.png", width=40, align="left" %}
**画像とプロンプト履歴を List に**

編集する画像と、プロンプト履歴を List にまとめてループへ渡します。

とはいえ 1 回目に履歴はまだありません。ひとまず `null` という当たり障りのないテキストを入れておきます。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_image_from_list.png", width=40, align="left" %}
**画像を取り出す**

List の中身は `[画像, 履歴]` です。

`Get Item From List` の `index` を `0` にすると画像が取り出せるので、`Generate Text` と FLUX.2 \[klein\] へ渡します。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_prompt_mllm.png", width=40, align="left" %}
**MLLM への指示文を作る**

基本的には「画像の人物を見て、服装を一箇所変えるプロンプトを作れ」という内容を MLLM に送ります。

それに加えて、`Format Text` で、履歴と今が何ターン目なのかを教えます。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_image_and_prompt.png", width=40, align="left" %}
**履歴に足して、また List に**

今回 MLLM が作ったプロンプトを、これまでの履歴の後ろに足します。

それと編集後の画像を、また List にまとめて次の iteration へ送ります。

{% endmediaRow %}

**出力例**

![input](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_input.png){media=image} ![output1](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_output_1.png){media=image} ![output2](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_output_2.png){media=image} ![output3](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_output_3.png){media=image} ![output4](/media/data-utilities/loop/loop_flux_2_klein_9b_qwen3_5_output_4.png){media=image}

### MiniMax H3 で Prompt List を使った連続 I2V

最新の動画生成モデルであっても、5〜15 秒ほどの動画しか作れません。

そこでループ処理の登場です。5 秒の動画でも、12 回繰り返せば 1 分になりますからね！

![](/media/data-utilities/loop/loop_minimax_h3_i2va.png){media=image}

[](/workflows/data-utilities/loop/loop_minimax_h3_i2va.json)

[MiniMax H3](/ja/basic-workflows/minimax-h3/) の I2VA で 5 秒ずつ生成し、それを N 回繰り返します。

`List` モードでプロンプトを 1 つずつ流しつつ、生成した動画の最後のフレームを次の iteration へ渡します。

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_image.png", width=40, align="left" %}
**スタート画像**

最初のフレームに使う画像は、`initial_iteration_value` に入れておきます。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_prompt_list.png", width=40, align="left" %}
**プロンプト（List）**

5 秒の動画を、List の要素数だけ繰り返します。

0〜5 秒、5〜10 秒 … といった具合に、1 本ずつ完結したプロンプトを N 個用意し、List にまとめて `Start Loop` へ入力します。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_last_frame.png", width=40, align="left" %}
**最後のフレームを次へ**

出てきた動画の最後のフレームを、次の iteration の 1 枚目に使います。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_video.png", width=40, align="left" %}
**出力動画**

あとで全部つなげるので `accumulate` を有効にしておきます。

そのままだと次の動画の 1 枚目とダブってしまうため、最後の 1 フレームを捨ててから `output_value` へつなげます。

{% endmediaRow %}

{% mediaRow img="/media/data-utilities/loop/loop_minimax_h3_i2va_video_concatenate.png", width=40, align="left" %}
**Concatenate Video**

4 つのプロンプトから生成された動画が、List でまとめて出てきます。

これを 1 本にするのが `Concatenate Video` です。

`video0` にしかつないでいないので変な感じがしますが、これでつながります。

{% endmediaRow %}

**出力例**

![output](/media/data-utilities/loop/loop_minimax_h3_i2va_output.mp4){media=loop}

正直にいうと、実践で使うにはこの workflow は力不足です。

I2VA が持っている手がかりは、1 フレーム目の画像だけです。ところが最後のフレームには、肝心の人物も背景も写っていないことがあります。実際、出力を見ると女性が途中で別人になっていますね。Ref2VA で女性の画像を渡したほうがよさそうです。

動画同士のつなぎ目も気になりますね。最初の数秒はのりしろとして前の動画のままにして、残りを生成する、いわゆる Extension 的な処理ができればいいんですが、シンプルなノードが見当たらないため少し妥協しています。

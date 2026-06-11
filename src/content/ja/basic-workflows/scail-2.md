---
layout: page.njk
lang: ja
section: basic-workflows
slug: scail-2
navId: scail-2
title: "SCAIL-2"
created: 2026-06-11
updated: 2026-06-11
summary: "SCAIL-2で参照画像の人物に動画の動きを転送する"
permalink: "/{{ lang }}/{{ section }}/{{ slug }}/"
hero:
  image: ""
tags: ["human-motion-transfer","video-generation"]
---

## SCAIL-2とは？

[SCAIL-2](https://teal024.github.io/SCAIL-2/) は、人やキャラクターへのモーション転送に特化した Wan2.1 ベースのモデルです。

[Wan-Animate](/ja/basic-workflows/wan-animate/) や前作の SCAIL-1 と大きく違うのは、棒人間などの中間表現に変換**しない**点です。

ViTPose や OpenPose で棒人間を作り、それを条件として人物を動かす。これまではこれが当然のアイデアだったわけですが、いったん棒人間に変換すると多くの情報が落ちます。

奥行き、接触、複数人の絡まりあい、非人間キャラの動きなどなど…

そこで SCAIL-2 では、参照画像とモーション用動画をほぼそのまま DiT に渡します。

複雑な処理パイプラインを人間がこねるよりも、適切なデータセットを作って AI にタスクを理解してもらったほうが柔軟で使いやすいものができる。これはこれから増えていく考え方でしょうね。

---

## モデルのダウンロード

- checkpoints
  - [sam3.1_multiplex_fp16.safetensors](https://huggingface.co/Comfy-Org/sam3.1/blob/main/checkpoints/sam3.1_multiplex_fp16.safetensors)
- clip_vision
  - [clip_vision_h.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/clip_vision/clip_vision_h.safetensors)
- diffusion_models
  - [wan2.1_14B_SCAIL_2_fp8_scaled.safetensors](https://huggingface.co/Comfy-Org/SCAIL-2/blob/main/diffusion_models/wan2.1_14B_SCAIL_2_fp8_scaled.safetensors)
- loras
  - [Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors](https://huggingface.co/lightx2v/Wan2.1-I2V-14B-480P-StepDistill-CfgDistill-Lightx2v/blob/main/loras/Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors)
- text_encoders
  - [umt5_xxl (fp16 or fp8).safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/tree/main/split_files/text_encoders)
- vae
  - [wan_2.1_vae.safetensors](https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/blob/main/split_files/vae/wan_2.1_vae.safetensors)

```text
📂ComfyUI/
└── 📂models/
    ├── 📂checkpoints/
    │   └── sam3.1_multiplex_fp16.safetensors
    ├── 📂clip_vision/
    │   └── clip_vision_h.safetensors
    ├── 📂diffusion_models/
    │   └── wan2.1_14B_SCAIL_2_fp8_scaled.safetensors
    ├── 📂loras/
    │   └── Wan21_I2V_14B_lightx2v_cfg_step_distill_lora_rank64.safetensors
    ├── 📂text_encoders/
    │   └── umt5_xxl (fp16 or fp8).safetensors
    └── 📂vae/
        └── wan_2.1_vae.safetensors
```

---

## Animation モード

**参照画像** をモーション用動画で動かします。

![](https://gyazo.com/a7c76588147896b9357481a741f1b071){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation.json)

ベースの workflow は [Wan-Animate](/ja/basic-workflows/wan-animate/) と同じですが、かなりシンプルになっているので気楽に見ていきましょう。

{% mediaRow img="https://gyazo.com/0846209526768f5c450c700d1a153dad {gyazo=image}", width=33, align="left" %}
**参照画像・モーション用動画**

参照画像とモーション用動画は、内部でリサイズされるため、同じサイズに揃える必要はありません。

- アスペクト比は近いほうが扱いやすいです。
- 画像と動画のポーズが完全に一致している必要はありません。
- ただし、あまりにも違うと失敗します。
- 参照画像は、モーション用動画の 1 フレーム目に近いものを選んだ方がよいでしょう。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/ce84cc6fe405261d50b5a6a3cfd8bf91 {gyazo=image}", width=33, align="left" %}
**プロンプト**

プロンプトは、生成したい人物や動きそのものを細かく指定するというより、全体の画質や雰囲気を軽く補助するくらいでよいでしょう。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/a632cf95fdb6fb5997e6fff4b71218fb {gyazo=image}", width=33, align="left" %}
**解像度・フレーム数**

生成サイズとフレーム数は `WanSCAILToVideo` に入力します。

- 推奨解像度は 480p（854×480）〜 720p（1280×720）かつ 32 の倍数
- 最大フレーム数は 81
- 今回は、参照画像をリサイズし、そのサイズを生成解像度として使っています。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/74c8fc85eb5026b42cbb8f5d6255ba9b {gyazo=image}", width=33, align="left" %}
**SAM3.1 によるマスク生成**

参照画像とモーション用動画の人物を、[SAM 3 / 3.1](/ja/data-utilities/sam3/) でマスクします。

- inpainting 用の厳密なマスクではなく、人物の対応関係を SCAIL-2 に伝えるための補助なので、多少ズレていても問題ありません。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/2ed39327ee5ef67944b787be81605b08 {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask**

作ったマスクが適切に色付けされます。

- 多人数の場合は少し重要です。詳しくは後述します。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/25a3907c1246d3513e3bb109997579ab {gyazo=image}", width=33, align="left" %}
**6 steps 生成**

SCAIL-2 でも、[Wan2.1 の高速生成](/ja/basic-workflows/wan-2-1/#self-forcing高速生成) 用の Lightx2v LoRA を使えます。

- `cfg` は 1.0
- `steps` は 6

{% endmediaRow %}

**出力例**

![参照画像](https://gyazo.com/ce9827f452cdc3cf7d47de8b12996f28){gyazo=image} ![モーション用動画](https://gyazo.com/f14aef04ac197a4b92680e05c4fbd178){gyazo=loop} ![output](https://gyazo.com/d87b2644f8f71218ebe678736479959e){gyazo=loop}

---

## Replacement モード

**動画内の人物** を **参照画像の人物** に入れ替えます。

![](https://gyazo.com/0996965c611a4b4ad46f3490b27ad1d6){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Replacement.json)

基本的には `Create SCAIL-2 Colored Mask` と `WanSCAILToVideo` の `replacement_mode` を `true` にするだけです。

{% mediaRow img="https://gyazo.com/5862792bc1510147b0cc73b260624a11 {gyazo=image}", width=33, align="left" %}
**解像度**

Replacement は動画のサイズが基準になります。

- この workflow では、動画の 1 フレーム目をリサイズしたもののサイズを取得して設定しています。

{% endmediaRow %}

{% mediaRow img="https://gyazo.com/48e4ebae5076eba223dda97a3853dc67 {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask と WanSCAILToVideo**

`replacement_mode` を `true` にします。

- ちなみに、`Create SCAIL-2 Colored Mask` の出力は pose_video 側の背景が白くなるだけです。

{% endmediaRow %}

**出力例**

![モーション用動画](https://gyazo.com/f14aef04ac197a4b92680e05c4fbd178){gyazo=loop} ![参照画像](https://gyazo.com/ce9827f452cdc3cf7d47de8b12996f28){gyazo=image} ![output](https://gyazo.com/65599272e59ffa6edd7571f1b87db822){gyazo=loop}

---

## Animation モード (複数人)

SCAIL-2 は複数人の動画・画像にも対応しています。

特別な操作は必要ありません。これまでと同様に動画と参照画像を入力するだけです。

![](https://gyazo.com/86b498dff06f09754116fc3cce4d3dbd){gyazo=image}

[](/workflows/basic-workflows/scail-2/SCAIL-2_Animation_multi-char.json)

{% mediaRow img="https://gyazo.com/28c7b669ac66155518bbce22130e623b {gyazo=image}", width=33, align="left" %}
**Create SCAIL-2 Colored Mask**

複数人の場合は、どの人物にどの動きを対応させるかが重要になりますが、SCAIL-2 では色付きマスクを使ってそれを制御します。

- `Create SCAIL-2 Colored Mask` は、SAM3.1 が複数対象をセグメンテーションしたとき、それぞれを順番に違う色に塗っていきます。
- 基本的には、同じ色同士が紐づけられるため、`sort_by` などで色を合わせてください。

> ただし、以下の出力例のように色の対応と動きが合わないことがあります。あくまでひとつの軽い条件であり、単純に構図的に近い方を選ぶこともあります。

{% endmediaRow %}

**出力例**

![参照画像](https://gyazo.com/567acaf722ca9e839ec7cb834c1ed344){gyazo=image} ![モーション用動画](https://gyazo.com/53461ca17746349fbd11e69798460ea6){gyazo=loop} ![output](https://gyazo.com/913ff446dd39fa33f56ba9ed07ce6e16){gyazo=loop}

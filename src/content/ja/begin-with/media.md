---
layout: page.njk
lang: ja
slug: media
navId: media
title: "メディア"
summary: "メディアについて"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 画像

### Load Image ノード

画像をComfyUIに読み込みます。

- `choose file to upload` をクリックしてファイルを選択
- ノードに画像をドラッグ & ドロップ
- クリップボードに画像がある状態で、キャンバス上で `Ctrl + V` を押すと、`Load Image` ノードとして貼り付けられます。

![](https://gyazo.com/9dd4bfe10197dddec18b0e7a1dc94f53){gyazo=loop}

> **Note**
> アップロードされた画像は `ComfyUI\input` フォルダにコピーされ、そこから読み込まれます。**元のファイルが参照されるわけではありません。**
>
> この画像はinputフォルダから削除しない限り消えないため、一度Loadした画像は何度も利用できます。

### Preview Image ノード

生成された画像をその場で確認します。保存はされないため、処理の途中経過や生成結果を一時的に確認したい場合に使用します。

> **Tip**
> 他の画像系ノードでも共通ですが、右クリックから `Save Image` や `Copy Image` で画像を保存・コピーすることが出来ます。
> outputフォルダまで画像を探さなくていいので便利です。

![](https://gyazo.com/9f5a3055bbb8ef271583545155f70371){gyazo=loop}

### Save Image ノード

生成された画像を保存します。

- デフォルトの保存先: `ComfyUI\output`
- ファイル名には連番が自動的に付与されます。(例: `ComfyUI_00001_.png`)

`filename_prefix` に値を入力することで、保存先ディレクトリやファイル名フォーマットを制御できます。

主に利用される書式は以下のとおりです。

| 用途 | 書式例 | 説明 |
|------|--------|------|
| 日付の挿入 | `%date:yyyy-MM-dd%` | 年月日を挿入（例: `2025-11-23`） |
| サブフォルダ作成 | `/` を含める | `/` を含めるとフォルダ階層として扱われる |

```text
%date:yyyy-MM-dd%/cat_project   #例
ComfyUI/output/2025-11-23/cat_project_00001_.png    #出力例
```

- 他にも色々ありますが詳細はこちらで: [ComfyUI 解説 (wiki ではない)/SaveImage](https://comfyui.creamlab.net/nodes/SaveImage)

デフォルトの保存先を変更したい場合は、[コマンドライン引数](/ja/begin-with/command-line-arguments/)で設定します。
```powershell
main.py --output_dir --output-directory [path]
```

### Load Image (from Outputs) ノード

`Save Image` ノードで保存された最新の画像がここに読み込まれます。
疑似ループ処理として使われることがあります。

![](https://gyazo.com/1b344fc1baa844c784d53a9790e6aafb){gyazo=loop}

---

## 動画

### Load Video ノード

ComfyUIでは、多くのノードが動画を **画像の連番** として扱います。

しかし、このノードの出力は `VIDEO` 型なのでそのままでは使えません。`Get Video Components` ノードを通して、動画を画像・音声・fpsに分解する必要があります。

そのため、動画を扱う際は後述する **Video Helper Suite** の使用を推奨します。

![](https://gyazo.com/96531a04d73333953691800babd073b9){gyazo=image}

> **注意:**
> 動画は基本的に圧縮されていますが、ComfyUIで読み込むと画像の連番（非圧縮）として展開されます。
> 4Kの高fps動画などを読み込むと、数秒であってもPCのRAMを使い果たしてクラッシュする可能性があります。
>
> **Video Helper Suite** のノードでは、画像のリサイズや読み込む枚数の指定が可能なため、メモリ管理の観点からも推奨されます。

### Save Video ノード

生成された動画を保存します。

今度は逆に連番画像を`VIDEO`に直さなければならないため、Create Videoノードを使用して画像・音声をまとめます。

![](https://gyazo.com/695faf8fda159e16dc56ef533e28eb8f){gyazo=image}

## 🎥Video Helper Suite

[Kosinkadink/ComfyUI-VideoHelperSuite](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)

動画を扱うための便利なノード群です。
コアノードよりも古くから存在しており、機能が豊富で使いやすいためこちらが使われることも多いです。

![](https://gyazo.com/ebfd8a274dbdecb613f3fa232eb3dbb0){gyazo=image}

### Load Video (Upload/Path) ノード

読み込む際に、FPSを下げたり小さくリサイズしたり出来ます。
現在の動画生成AIで必要な最低限のパラメータで動画を読み込めば、余計な負荷をかけることはありません。

Load Imaeg ノードと同様ドラッグ・アンド・ドロップでも動画を読み込むことが出来ます。

ロードした動画のfpsやフレーム数などは、`Video Info` ノードから取得します。

| パラメータ名 | 説明 |
| --- | --- |
| force_rate | フレームレートを指定（0で無効） |
| custom_width | リサイズする場合の幅（0で無効） |
| custom_height | リサイズする場合の高さ（0で無効） |
| frame_load_cap | 読み込むフレーム数の上限（0で無制限） |
| skip_first_frames | 最初にスキップするフレーム数 |
| select_every_nth | Nフレームごとに1フレーム取得（間引き） |
| format | 出力フォーマット（モデルに応じたプリセットが選択可能） |

### Video Combine ノード

直接、連番画像・音声を入力して動画を作成します。

| パラメータ名 | 説明 |
| --- | --- |
| images | 入力画像（連番） |
| audio | 入力音声 |
| frame_rate | 出力フレームレート |
| loop_count | 入力動画をループして出力 |
| filename_prefix | `Save Image` ノードと同じ |
| format | 出力フォーマット（mp4, gif, webpなど） |
| pingpong | 往復再生（再生後に逆再生を追加） |
| save_output | オフにすると保存されず、プレビューのみ行われます |

---

## 音声

### Load Audio ノード

音声ファイルを読み込みます。

### Preview Audio ノード

音声をその場で確認します。

### Save Audio ノード

音声を保存します。

保存するフォーマットに合わせて以下の3種類が存在します。

- `Save Audio (FLAC)`
- `Save Audio (MP3)`
- `Save Audio (Opus)`

## Webカメラ

![](https://gyazo.com/2a7ab2f8dc9179e6c02d15e74dedcea3){gyazo=image}

Webカメラの入力を画像として取り込むことができます。

詳しくは、[Webカメラ](/ja/data-utilities/webcam-input/)をご覧ください。
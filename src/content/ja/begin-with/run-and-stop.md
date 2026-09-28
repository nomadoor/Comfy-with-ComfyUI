---
layout: page.njk
lang: ja
section: begin-with
slug: run-and-stop
navId: run-and-stop
title: "実行・停止"
created: 2025-11-20
updated: 2026-09-27
summary: "実行・停止について"
seoTitle: "ComfyUIの実行・停止・キューの操作"
seoDescription: "ComfyUIでworkflowを実行・停止する方法。Runの繰り返し回数、自動実行モードの違い、処理の中断と強制終了、キューの確認とクリアの方法をまとめています。"
permalink: "/{{ lang }}/begin-with/{{ slug }}/"
hero:
  gradient: ""
---

## 処理の実行

workflowを実行します。

![](/media/begin-with/run-and-stop/legacy_gyazo_e1be6c3b9c1666f5735bd17261d7714f.mp4){media=loop}

- メニューの `▷ Run`（または `Queue Prompt`）ボタンをクリック

---

## 処理を繰り返す

同じ設定で何回もworkflowを実行します。

![](/media/begin-with/run-and-stop/legacy_gyazo_5831e4d69bd26c7d5a533fb5781a33ad.mp4){media=loop}

- `▷ Run` ボタンの横にある数字を変更

デフォルトでは上限が **100** になっていますが、設定で変更可能です。
- `⚙Settings` → `Queue Button` → `Batch count limit` の値を変更してください。

---

## 自動で処理を繰り返す

「パラメータを変えるたびに自動で生成してほしい」あるいは「放置して無限に生成し続けたい」という場合に使います。

![](/media/begin-with/run-and-stop/legacy_gyazo_c516b3b9fd8b2c506fb1fa91cf385174.mp4){media=loop}

- `▷ Run` ボタン内の `˅` をクリックし、モードを選択し、`▷ Run`をクリック

### モードの違い

- **Run (Instant)**
  - 前の処理が終わったら、即座に次の処理を開始します。
  - **注意**: 生成結果が完全に同じになる場合（Seedが固定されているなど）はスキップされます。

- **Run (On Change)**
  - 基本は待機状態になります。
  - 何かパラメータ（プロンプトや数値など）が変更された瞬間、処理が始まります。

---

## 処理の中断

間違えて実行してしまった場合などは、ここから中断できます。

![](/media/begin-with/run-and-stop/stop.mp4){media=loop}

- **操作**: `▷ Run` ボタンの横にある `❌️` ボタンをクリック

### 強制終了について

KSamplerでのサンプリング中など、PCに高い負荷がかかっている時は、`❌️` を押してもすぐに反応しないことがあります。
どうしても止まらない場合は、**ターミナルを閉じてComfyUI自体を再起動** してください。これが一番確実です。

---

## キューの確認とクリア

予約されている処理（キュー）を確認したり、まとめて削除したりできます。

![](/media/begin-with/run-and-stop/legacy_gyazo_23f7fb0414ad302f23b333ae0add5827.mp4){media=loop}

- **操作**: 左サイドバーのQueueアイコンをクリック（またはキーボードの `Q` キー）で一覧を表示します。
- **個別にキャンセル**: キャンセルしたい処理を右クリックし、`Delete` を選択します。
- **まとめてキャンセル**: `Job Queue` ウィンドウの `Clear queue` をクリックします。

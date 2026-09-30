# ADR: 記事の workflow を RunPod で起動する PoC（Qwen-Image-2.1）(2026-09-30)

## Status
Accepted（PoC。記事側のボタン・案内表示は別途デザイン相談）

## Context
- 記事の workflow を試すには、読者が自分で ComfyUI を用意し、モデルと custom node を揃える必要がある。GPU を持たない読者にはここが一番高い壁になる。
- RunPod ならテンプレートから Pod を作るだけで GPU 環境が手に入る。記事ごとに必要なものを自動で揃えれば、記事から数クリックで workflow を動かせる。
- ただし、必要なモデル・custom node を RunPod 用に手で書き直すと、記事や workflow とすぐにずれる。

## Decision
- **workflow JSON を唯一の正とする。** 必要なモデルは各ノードの `properties.models`（ComfyUI 標準の `{name, url, directory}`）、custom node は `properties.cnr_id` / `properties.ver` から機械的に集める。
  - サイトの workflow の多くは `properties.models` を持っていない（2026-09-30 時点で 408 本中 36 本）。PoC 対象の Qwen-Image-2.1 の 12 本に書き足す。書き足すのは `properties.models` だけで、他の内容には触れない。
  - 値は記事本文の「モデルのダウンロード」リストとローダーのファイル名を照合して埋める。照合できないものは推測で埋めない。
  - `properties.models` はローカルの ComfyUI でも「足りないモデル」ダイアログのダウンロード先として使われるので、読者にも役立つ。
- **Docker image は汎用 1 種類。** モデルファミリ固有の情報は image に入れず、起動時にサイトから取得する「プロファイル」だけが中身を決める。
- **プロファイルはサイトのビルドで生成する。** `runpod/profiles/<id>.yaml`（人間が書く最小限の元ファイル）と workflow JSON から、`/runpod/profiles/<id>.json` を出力してサイトと一緒にデプロイする。image の再ビルドなしで内容が更新される。
  - ID と公開パスは記事の slug に合わせる（PoC は `qwen-image-2-1`、公開 URL は `https://comfyui.nomadoor.net/runpod/profiles/qwen-image-2-1.json`）。
  - 生成処理はリポジトリに合わせて Node（ESM）で書く。
  - ファイルサイズと gated 判定は外部への問い合わせが必要なので、ビルドのたびには行わない。`npm run runpod:refresh` で調べた結果を lock ファイルとしてコミットし、ビルドでは lock と workflow の整合だけを検査する（ビルドを外部ネットワークに依存させないため）。
- **ComfyUI の既定は `latest`。** image は毎日 ComfyUI master の最新でビルドし、起動時は差分更新だけにする。環境変数 `COMFY_REF=verified` で動作確認済みの commit に戻せる。
- **Pod 内の起動処理は Python。** ステータスページ（8188 番、枠線なしの最小限の 1 ページ）でダウンロードの進行と失敗理由を見せ、完了後に ComfyUI を起動する。起動結果は `report.json` に残す。
- image は GitHub Actions でビルドして GHCR に push する。RunPod のテンプレートはオーナーのアカウントで作る。

## Consequences
- workflow を差し替えるときは `properties.models` も保つ必要がある。欠けているとプロファイル生成が警告を出す。
- 記事側の「Run on RunPod」ボタンと GPU・ディスク容量の案内は、Pod が動いてから別途デザインを決める。
- 対象は Qwen-Image-2.1 のみ。他の記事への展開は PoC の結果を見て判断する。

## 未決事項
- custom node の導入経路（Registry API / comfy-cli / git）。Qwen-Image-2.1 はコアノードのみなので PoC では検証できない。
- RunPod のデプロイリンク形式、環境変数を URL で渡せるか、GPU を固定できるか。
- テンプレート作者向けの還元制度の有無。

## Files
- Added: `ops/adr/2026-09-30-runpod-poc.md`, `runpod/`, `scripts/add-workflow-models.mjs`
- Updated: `src/workflows/basic-workflows/qwen-image-2-1/*.json`（`properties.models` の追加のみ）

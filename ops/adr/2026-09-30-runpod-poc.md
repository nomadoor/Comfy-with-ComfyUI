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
- workflow が出どころを持たない custom node（`cnr_id` なしで保存されたノード）だけは、プロファイル元ファイルの `overrides.custom_nodes` に Registry の ID とバージョンを書く。Qwen-Image-2.1 では `PanoramaPreview`（`panorama-stickers`）のみ（ポーズ抽出は当初の `comfyui_controlnet_aux` から本体の SDPose に差し替えた）。
- custom node は Registry の最新版を入れる（オーナー判断）。workflow に保存された `ver` は使わず、固定したいときだけ `overrides.custom_nodes` に `version:` を書く。実際に入ったバージョンは Pod の `report.json` に残す。custom node 側の破壊的変更で記事の workflow が一時的に動かなくなることは許容し、そのときに workflow を直す。
- workflow の最初の MarkdownNote の末尾（`## models` の下）に目立たない `## guide` 節を置き、記事への JA / EN / ZH リンクを並べる（Pod で workflow だけを開いた人が記事に戻れるように）。まず Qwen-Image-2.1 の 12 本で試す。`scripts/add-workflow-guide.mjs` で入れる。
- 入力画像のサンプルはオーナーが用意し、記事の画像と同じメディアとして扱う。原本は `COMFY_MEDIA_ORIGINALS` に `<section>/<slug>/<stem>.png` で置き、`media:sync` が WebP にして R2 に上げる（git には入れない）。workflow の LoadImage は `<stem>.webp` を読む。プロファイル生成が `media.json` から R2 の URL とハッシュを引いて `inputs` に入れ、Pod は起動時にその WebP を `ComfyUI/input/<stem>.webp` に置く。記事に出している画像（出力例の入力など）はそのまま再利用する。
- ページに書かれない入力画像も `media:sync` と `check:media` の対象にするため、プロファイルの workflow の LoadImage から `/media/...` の参照を導く（`profileInputReferences`）。pre-commit フックは `src/workflows/` と `runpod/profiles/` の変更でも動く。
- コアノードかどうかは `runpod/core-nodes.json`（ComfyUI master のソースから抜き出したノード ID の一覧）で判定する。一覧にも `overrides` にもない `cnr_id` なしのノードはエラーにする。
- **Docker image は汎用 1 種類。** モデルファミリ固有の情報は image に入れず、起動時にサイトから取得する「プロファイル」だけが中身を決める。
- **プロファイルはサイトのビルドで生成する。** `runpod/profiles/<id>.yaml`（人間が書く最小限の元ファイル）と workflow JSON から、`/runpod/profiles/<id>.json` を出力してサイトと一緒にデプロイする。image の再ビルドなしで内容が更新される。
  - ID と公開パスは記事の slug に合わせる（PoC は `qwen-image-2-1`、公開 URL は `https://comfyui.nomadoor.net/runpod/profiles/qwen-image-2-1.json`）。
  - 生成処理はリポジトリに合わせて Node（ESM）で書く。
  - ファイルサイズと gated 判定は外部への問い合わせが必要なので、ビルドのたびには行わない。`npm run runpod:refresh` で調べた結果を lock ファイルとしてコミットし、ビルドでは lock と workflow の整合だけを検査する（ビルドを外部ネットワークに依存させないため）。
- **ComfyUI の既定は `latest`。** image は毎日 ComfyUI master の最新でビルドし、起動時は差分更新だけにする。環境変数 `COMFY_REF=verified` で動作確認済みの commit に戻せる。
- **Pod 内の起動処理は Python。** ステータスページ（8188 番、枠線なしの最小限の 1 ページ）でダウンロードの進行と失敗理由を見せ、完了後に ComfyUI を起動する。起動結果は `report.json` に残す。
- モデルは aria2 で 1 ファイルを 16 分割して取り、複数ファイルを同時に取る。2026-10-01 の実測（1.92 GB）で aria2 61 MB/s、hf_xet 53 MB/s。hf_xet は `HF_DOWNLOADER=xet` で選べる。
- ComfyUI の初回表示では、テンプレート選択ダイアログ（`Comfy.TutorialCompleted`）を出さず、プロファイルの workflow を記事の順にすべてタブで開く。小さな ComfyUI 拡張（`runpod/image/extension/`）を起動処理が入れる。
- 切り忘れ対策として、操作も生成もない状態が 30 分続くと Pod を Stop する（Terminate ではない。GPU の課金は止まり、Volume Disk は残る）。止まる 5 分前から画面上部に予告を出す。準備に失敗したまま放置された場合も同じ時間で止める。RunPod が Pod に渡す `RUNPOD_POD_ID` と Pod 用 API キー（`RUNPOD_API_KEY`）で REST API を呼ぶ（本番で要確認）。
- 別の workflow のモデルや custom node を読者が UI から足せるよう、ComfyUI 内蔵の Manager を有効にする。Pod は外部から待ち受けるため、Manager の `network_mode` を `personal_cloud` にする（Pod の URL を知る人だけが使える前提）。
- image は GitHub Actions でビルドして GHCR に push する。RunPod のテンプレートはオーナーのアカウントで作る。

## Consequences
- workflow を差し替えるときは `properties.models` も保つ必要がある。欠けているとプロファイル生成が警告を出す。
- 記事側の「Run on RunPod」ボタンと GPU・ディスク容量の案内は、Pod が動いてから別途デザインを決める。
- 対象は Qwen-Image-2.1 のみ。他の記事への展開は PoC の結果を見て判断する。

## 未決事項
- custom node の導入経路（Registry API / comfy-cli / git）。Registry API の `/nodes/<id>/install?version=` で zip の URL が取れることは確認済み。
- GPU 案内の値（`min_vram_gb: 12`、`recommended_vram_gb: 24`）は仮。記事の検証環境（RTX 4070 Ti 12GB）をもとにしている。
- ComfyUI 初回起動時のテンプレート選択ダイアログを、起動処理で閉じた状態にするか。
- RunPod のデプロイリンク形式、環境変数を URL で渡せるか、GPU を固定できるか。
- テンプレート作者向けの還元制度の有無。

## Files
- Added: `ops/adr/2026-09-30-runpod-poc.md`, `runpod/`, `scripts/add-workflow-models.mjs`, `scripts/add-workflow-guide.mjs`
- Updated: `src/workflows/basic-workflows/qwen-image-2-1/*.json`（`properties.models`、MarkdownNote の `## guide` 節、LoadImage のファイル名）, `scripts/lib/media-refs.mjs`, `scripts/media-sync.mjs`, `scripts/check-media.mjs`, `.githooks/pre-commit`, `.eleventy.js`（ビルド後にプロファイルを出力）, `package.json`（`check:runpod`, `runpod:refresh`）

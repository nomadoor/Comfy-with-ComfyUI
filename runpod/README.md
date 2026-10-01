# RunPod

記事の workflow を RunPod の Pod ですぐ動かすための仕組み。設計は [ADR](../ops/adr/2026-09-30-runpod-poc.md)。

```
runpod/
├── profiles/<id>.yaml       人間が書く元ファイル（束ねる workflow、GPU の案内、overrides）
├── profiles/<id>.lock.json  モデルのサイズ・sha256・gated（npm run runpod:refresh が書く）
├── core-nodes.json          ComfyUI 本体のノード一覧（同上）
├── tools/                   プロファイルの生成・検査・更新（Node）
└── image/                   汎用 Docker image と、Pod 起動処理（Python）
```

## プロファイル

- ビルドのたびに `/runpod/profiles/<id>.json` が出力され、サイトと一緒に公開される。Pod はこれを読んで準備する。
- モデルは workflow の `properties.models`、custom node は `properties.cnr_id` から集める。custom node は Registry の最新版（審査済みの `latest_version`）を入れ、固定したいときだけ `overrides.custom_nodes[].version` を書く。
- 入力画像のサンプルは記事の画像と同じメディア。原本を `COMFY_MEDIA_ORIGINALS/<section>/<slug>/<stem>.png` に置き、LoadImage には `<stem>.webp` と書く。コミット時に `media:sync` が R2 に上げ、プロファイルの `inputs` に入り、Pod の `ComfyUI/input/` に配られる。未登録のものは警告（`check:media` ではエラー）になる。
- `npm run check:runpod` で検査する（`npm run check` に含まれる）。ネットワークは使わない。
- workflow やモデルを変えたら `npm run runpod:refresh` を実行して、lock と core-nodes.json をコミットする。

新しいプロファイルを足すとき:

1. 記事の workflow に `properties.models` がなければ入れる: `node scripts/add-workflow-models.mjs <記事.md> <workflow フォルダ> --write`
2. `runpod/profiles/<id>.yaml` を書く（`qwen-image-2-1.yaml` を参考に）。
3. `npm run runpod:refresh -- <id>` → `npm run check:runpod`

## Docker image

`ghcr.io/nomadoor/comfy-with-comfyui-runpod`。`.github/workflows/runpod-image.yml` が毎日と `runpod/image/**` の変更時にビルドする。タグは `latest` と `<日付>-<ComfyUI の短い sha>`。

Pod の環境変数:

| 変数 | 既定値 | 内容 |
|---|---|---|
| `PROFILE` | （必須） | プロファイル ID |
| `PROFILE_URL` | `https://comfyui.nomadoor.net/runpod/profiles/${PROFILE}.json` | 取得先の上書き（テスト用）。workflow も同じサイトから取る |
| `COMFY_REF` | プロファイルの `comfyui.default` | `latest` / `verified` / commit sha |
| `HF_TOKEN` | なし | テンプレートでは `{{ RUNPOD_SECRET_HF_TOKEN }}` |
| `CIVITAI_TOKEN` | なし | 必要なときだけ |
| `DL_CONCURRENCY` | `8` | 同時にダウンロードするファイル数（各ファイルは aria2 が 16 分割で取る） |
| `HF_DOWNLOADER` | `aria2` | `xet` にすると Hugging Face だけ hf_xet で取る |
| `IDLE_STOP_MINUTES` | `30` | 操作も生成もない状態がこの分数続くと Pod を Terminate する（`0` で無効）。準備に失敗したまま放置された場合も同じ時間で終了する |
| `ENABLE_MANAGER` | `1` | 内蔵の ComfyUI-Manager を有効にする（`0` で無効） |
| `DATA_DIR` | `/workspace`、なければ `/data` | モデルと起動レポートの置き場所 |
| `COMFY_ARGS` | なし | ComfyUI に足す引数 |

ComfyUI の画面では、テンプレート選択ダイアログを出さず、プロファイルの workflow を記事の順にすべてタブで開く（ブラウザごとに初回だけ）。放置で終了する数分前には画面上部に予告が出る。どちらも `image/extension/`（ComfyUI の拡張として入れる）が行う。

起動の結果は `${DATA_DIR}/runpod-boot/report.json` に残る（プロファイル、site の commit、ComfyUI の sha、custom node のバージョン、モデルごとの結果、所要時間）。

## RunPod テンプレート（モデルファミリごとに 1 つ）

| 項目 | 値 |
|---|---|
| Container Image | `ghcr.io/nomadoor/comfy-with-comfyui-runpod:latest` |
| Container Disk | プロファイルの `storage.recommended_disk_gb`（Qwen-Image-2.1 は 70 GB）。モデル × 1.5 + 40 GB を 10 GB 単位で切り上げ。image、custom node の依存、生成画像、Manager で足すモデルもここに入るので多めにとる |
| Volume Disk | 0（放置すると Pod ごと Terminate するので、残すものがない） |
| HTTP Port | 8188 |
| Environment Variables | `PROFILE=<id>`、`HF_TOKEN={{ RUNPOD_SECRET_HF_TOKEN }}` |

## 手元での確認

GPU と NVIDIA Container Toolkit がある環境で:

```bash
npm run build
docker build -t cwc-runpod:dev runpod/image
docker run --rm --gpus all -p 127.0.0.1:8188:8188 \
  -e PROFILE=qwen-image-2-1 -e PROFILE_URL=file:///runpod/profiles/qwen-image-2-1.json \
  -v "$PWD/_site/runpod:/runpod:ro" -v "$PWD/_site/workflows:/workflows:ro" \
  -v "$HOME/runpod-data:/workspace" cwc-runpod:dev
```

`http://127.0.0.1:8188/` でステータスページ、準備ができると ComfyUI に切り替わる。同じ `runpod-data` で起動し直すとダウンロードは省かれる。GPU を使わずに確かめるときは `--gpus all` を外し、`-e COMFY_ARGS=--cpu` を付ける。

ComfyUI が上がったら、生成せずに揃っているかを確かめる（ノードが登録済みか、モデルが見えるか、入力画像があるか）:

```bash
docker exec <container> python -m bootstrap.verify
```

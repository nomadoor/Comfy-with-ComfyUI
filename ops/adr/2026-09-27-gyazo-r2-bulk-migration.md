# ADR: 公開確認できた既存GyazoメディアのR2移行

- Date: 2026-09-27
- Status: Accepted
- Extends: `2026-09-17-media-layer-r2-gyazo.md`, `2026-09-17-media-authoring-flow.md`

## Context

Gyazoのサービス再開後、過去画像は所有者が画像ページごとに配信を再開する必要がある。サイトで参照している909件を再公開処理し、匿名アクセスでも取得できるか確認したところ、871件は取得可能になった。一括移行時点で残る38件は所有者側から見ても正常な画像として扱えないため、移行対象から外す。

既存ADRではGyazoの一括移行を対象外としていたが、再公開できたメディアを引き続き外部状態に依存させる理由はなくなった。サイトの恒久保存方針に合わせ、取得できる既存メディアをR2へ移す。

## Decision

- 匿名アクセスで取得できる871件だけを移行する。取得できない38件のGyazo参照は変更せず、別途記事内容を見直すまで残す。
- Gyazoから取得した画像・動画を `COMFY_MEDIA_ORIGINALS` に保存し、既存の `media:sync` で変換、メタデータ除去、R2アップロード、`src/_data/media.json` 登録を行う。
- 原本が既存パイプラインの入力外である場合、静止WebPはPNGへ変換する。アニメーションGIFは動きを維持するためH.264 mp4へ変換する。いずれも変換後のファイルをローカル原本として保存する。
- Gyazo oEmbedが動画として返すIDはmp4として移行する。旧参照が `{gyazo=image}` でも、動きを維持してR2の型と一致させるため `{media=loop}` へ変更する。
- 論理名は、最初に参照する日本語記事を所有先として `<section>/<slug>/legacy_gyazo_<32桁ID>.<ext>` とする。日本語記事に参照がない場合は英語、中国語の順で最初の参照記事を使う。独立ページは `shared/<slug>/` に置く。画像は取得した実体に応じて `.png` または `.jpg`、動画は `.mp4` とする。
- 複数言語・複数記事で同じGyazo IDを使う場合も、論理名とR2オブジェクトは1件だけ作り、すべての参照を同じ `/media/<logical name>` に置き換える。
- `legacy_gyazo_` は今回の一括移行に限る命名上の例外である。元サービスとの対応を追跡でき、機械的な一括処理で誤った意味名を付けないため、Gyazo IDを安定識別子として残す。新規メディアには既存の意味のあるファイル名規則を使う。
- `{gyazo=image|loop|player}` は、移行した参照だけ `{media=image|loop|player}` に置き換える。未移行のGyazo参照は互換構文のままでもよい。
- 直接記述された `i.gyazo.com` URL、front matter、共有データ内の参照も同じ論理名へ置き換える。
- ローカル原本とR2オブジェクトは削除しない。移行一覧をローカル作業記録として残し、追跡可能にする。

## Verification

- 移行対象の全論理名に原本と `media.json` 登録があること。
- 移行対象のGyazo IDがサイトソースに残っていないこと。
- 一括移行直後は、除外した38件だけがGyazo参照として残ること。その後の手動見直しでは、解消した参照がR2または記事構成へ正しく反映され、明示的に延期した参照だけが残ること。
- R2の公開URLが匿名アクセスで取得できること。
- `npm run check`、`npm run build`、`npm run check:build`、`npm run test:playwright` が通ること。

## Follow-up

一括移行後、除外した38件を記事ごとに確認した。既存原本またはオーナー提供素材で復旧できた画像・動画は意味のある論理名でR2へ登録し、不要になった画像や章は記事から削除した。変更対象は英語版・中国語版にも同期した。

最終的に残るのは12件のGyazo ID、全言語と共有データを合わせて43参照である。いずれもオーナーが明示的に延期・除外した項目で、共通のworkflowコピー動画、ControlNet hero、InstructPix2Pix、lip-sync、共通の物体検出画像、非推奨のexternal LLM server、LTX関連5件、Wan2.2 5Bである。

移行完了後は、一時的なGyazo配信障害アテンションも全言語から削除した。

## Consequences

- 公開確認できた既存メディアはGyazoの配信状態に依存しなくなる。
- 画像は既存方針どおりフルサイズWebPとしてR2に保存され、表示サイズはCloudflare Image Transformationsで生成される。
- 動画はストリームを再エンコードせず、メタデータ除去とfaststart処理を行い、先頭フレームのWebP posterを生成する。
- 延期した12件は記事内でGyazo参照として残る。今回のR2移行完了とは分けて扱う。

## Scope

- `src/content/ja/`, `src/content/en/`, `src/content/zh/`
- `src/_data/`
- `src/_data/media.json`
- ローカル原本 `COMFY_MEDIA_ORIGINALS`
- Cloudflare R2 `comfy-with-comfyui-media`

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
- 切り忘れ対策として、操作も生成もない状態が 30 分続くと Pod を Terminate する。Stop にしない理由：Volume Disk を使わないので Stop しても中身は消え、再開は新しい Pod と同じ準備をやり直す、再開は同じマシンの GPU の空き次第で失敗しうる、Stop した Pod が一覧に残り続ける。（当初は「停止中もディスク代がかかる」とも書いたが、課金が続くのは Volume Disk だけで、このテンプレートの Pod は停止中 $0。2026-10-02 に Stop の確認画面で確認）再開は記事のボタンから新しい Pod を作る一通りにする（モデルの再ダウンロードは数分）。終了の 5 分前から画面上部に予告（生成画像を保存するよう促す）を出す。準備に失敗したまま放置された場合も同じ時間で終了する。Volume Disk は使わない。Container Disk は余裕を持たせ、モデル合計 × 1.5 + 40 GB を 10 GB 単位で切り上げた値を推奨にする（Qwen-Image-2.1 は 70 GB）。RunPod が Pod に渡す `RUNPOD_POD_ID` と Pod 用 API キー（`RUNPOD_API_KEY`）で REST API を呼ぶ（本番で要確認）。
- 別の workflow のモデルや custom node を読者が UI から足せるよう、ComfyUI 内蔵の Manager を有効にする。Pod は外部から待ち受けるため、Manager の `network_mode` を `personal_cloud` にする（Pod の URL を知る人だけが使える前提）。
- image は GitHub Actions でビルドして GHCR に push する。RunPod のテンプレートはオーナーのアカウントで作る。

## Revision 2026-10-01: 本番の Pod で分かったこと
- テンプレートは記事ごとに 1 つ（`PROFILE` を固定）。読者にプロファイルを選ばせない。Matatabi AI の RunPod アカウントで Public に作り、記事には `console.runpod.io/deploy?template=<ID>&ref=<コード>` を置く。
- 今の ComfyUI は PyTorch cu130 でないと最適化された CUDA 演算を使わない（cu128 では警告が出て comfy_kitchen の CUDA backend が無効）。image を CUDA 13 / PyTorch cu130 にし、テンプレートの Allowed CUDA versions を 13.0 以上にする。
- image の取得が遅かった（PyTorch 一式が 4 GB の 1 層）。依存を解決したうえで 4 グループに分けて入れ、Pod が並列に取れるようにする。
- `HF_TOKEN` はシークレットを持たない読者がつまずくので、gated なモデルを使う記事のテンプレートにだけ入れる。
- ステータスページに記事へのリンクと、待ち時間に読むコラム（`runpod/tips.yaml`、日英中）を出す。コラムはサイトから読むので image の作り直しは要らない。各ステップの補足も翻訳する。画面は一度だけ組み立て、以後は変わった値だけを書き換える。
- モデルごとの所要時間・平均速度・取得方法を `report.json` に残し、aria2 と hf_xet を本番の回線で比べられるようにする。
- 実測（2026-10-01）：サーバーが立つまで約 3 分 15 秒、そこから ComfyUI まで約 1 分（モデル 19 GB 込み）。aria2 と hf_xet の差は誤差。遅いのは image の取得側。RunPod 公式の ComfyUI テンプレートは同じ日に 11 分超。
- image のキャッシュはマシン単位で、そのマシンで誰かが同じ層を取ったことがある場合だけ効く。毎日のビルドで全層を作り直すと digest が変わり、キャッシュが一切効かないので、ビルドキャッシュで変わらない層を固定する。
- PyTorch 2.14（cu130）は一部の演算を Triton で行い、Triton は初回に C の補助を実行時コンパイルする。最小の CUDA base image にはコンパイラがないので、`gcc` と `libc6-dev` を入れる（ComfyUI の README の手順は torch と requirements だけで、コンパイラは普通の Linux 環境にある前提）。Python は README に合わせて 3.13 にする。PyTorch や CUDA を変えたときは、マージ前に GPU で短い計算を通して確かめる（CPU の起動確認では Triton の経路を通らない）。
- 実測（2026-10-01、Pod のシステムログ）：image 4.1 GB の取得に約 1 分 38 秒。うち GHCR からのダウンロード約 49 秒（約 85 MB/s）、層の展開が 1 層ずつ約 45 秒。Docker の取得は層ごとに 1 本の接続で取り、展開も直列なので、xet のような並列化は効かない。
- そこで PyTorch 一式を image から外し、起動処理がモデルと並行して PyTorch の配布元から入れる。版は build 時に解決した `/opt/runtime.lock` に固定するので、Pod ごとに中身は変わらない。起動のたびに配布元に頼る失敗点が増えるが、モデルもすでに毎回 Hugging Face から取っているので許容する。層は zstd で圧縮し、Docker Hub にも出して GHCR と取得時間を比べる。
- 結果（2026-10-01）：image は圧縮後 4.1 GB → 1.14 GB。同じ試作 image で ComfyUI が出るまで GHCR 3:05、Docker Hub 1:41。Docker Hub に切り替えた本番テンプレートで 2:20 / 1:28 / 3:10（L4、モデルのダウンロードが遅い回）、平均約 2 分 20 秒（以前は約 4 分）。残るばらつきは、マシンに image が残っているかと、データセンターと Hugging Face の間の回線。
- テンプレートは Docker Hub（`nomadoor` アカウント）の image を使い、GHCR にも毎日同じものを出して予備にする。Docker Hub の注意点：ログインなしの取得回数の上限（当たったら GHCR に戻す）、アクセストークンの期限（切れるとビルド全体が止まる）、個人アカウントにひもづくこと（テンプレートと紹介は Matatabi AI 名義）、無料プランの条件変更。
- 土台を変える前に、Pod の作成・起動から起動処理開始までの秒数を `report.json` に残して測る。次に今の土台と RunPod 公式 `runpod/pytorch` の土台を `:exp` で比べる。PyTorch を起動時に入れる案は、版を固定すれば中身は変わらないが、起動のたびに配布元に頼る失敗点が増えるので、土台の乗り換えが効かなかったときの候補とする。

## Revision 2026-10-02: 記事のカードと紹介リンク
- 記事には `{% runpod %}` のカードを置く（Qwen-Image-2.1 は「推奨設定値」の前）。タイトル、推奨 GPU、右端の矢印、「?」（`notes/runpod-card` へ）。
- 商用利用できないライセンスのモデルを含むプロファイルは `referral: false` にして、紹介コードを付けない（オーナー判断）。研究用モデルの読者を誘導して紹介報酬を得る形を避けるため。Qwen-Image-2.1（Qwen Research License、研究・評価目的のみ）が該当する。
- テンプレート作者への還元（利用額の 1% を Runpod クレジットで）は、公開ドキュメントにテンプレート単位で外す設定がない。残ることを承知のうえで進める。
- 使い方は `notes/runpod-card`（JA / EN / ZH、ナビの Notes に入れる）。slug は Runpod 全般ではなくこのサイトのカードを指す名前にした（当初案の `run-on-runpod` は汎用すぎるため）。
- 使い終わりは `Stop` → `Terminate` を案内する。このテンプレートは Volume Disk を使わないので停止中の料金は $0 だが、中身は消え、Pod が一覧に残る。

## Revision 2026-10-02: 誰も止めない Pod をなくす
レビューで、Pod が課金され続ける道が残っていた。どの経路でも最後は Terminate にたどり着くようにする。
- ComfyUI は `exec` せず子プロセスとして起動し、起動処理が見張る。起動直後の CUDA 初期化の失敗などで ComfyUI が自分で終了したら、ステータスページを戻して理由を出し、`IDLE_STOP_MINUTES` 後に Terminate する（ComfyUI の中の自動停止は、ComfyUI が落ちると働かない）。RunPod からの停止シグナルは ComfyUI に渡す。起動処理はコンテナの PID 1 なので、準備中や ComfyUI が落ちたあとの停止シグナルも自分で受けてすぐ終わる（何もしないと無視されて強制終了を待つ）。
- 想定外の例外（`BootError` 以外）も同じ失敗の流れに入れる（コード `internal`）。結果の記録に失敗しても Terminate は飛ばさない。
- 準備全体に期限を設ける（`BOOT_TIMEOUT_MINUTES`、既定 60 分）。git や custom node のインストールが固まっても失敗として扱う。期限のあとに準備が終わっても ComfyUI は起動しない。
- Terminate の API 呼び出しは成功するまで繰り返す（60 秒から倍々、最大 15 分間隔）。最初に失敗した時点で、ステータスページに手で Terminate するよう案内を出す。
- 起動後のインストール（ComfyUI と custom node の依存、Manager からの追加）は `/opt/runtime.lock` を制約にする（`UV_CONSTRAINT` / `PIP_CONSTRAINT`）。別の torch を求める custom node は、cu130 の PyTorch を黙って入れ替えずに失敗する。
- 起動時の PyTorch のインストールは uv のキャッシュを残さない。モデルと同じディスクに入るときは、空き容量の確認で PyTorch の分（8 GB）を見込む。
- 外のサイトからの表示を通す例外（#161）は `/` だけにする。
- `IDLE_STOP_MINUTES` などが数値でなくても、既定値で動く（自動停止が丸ごと無効にならない）。RunPod 以外で動かしたときは「終了しました」と表示しない。
- image のビルドは branch ごとに順番待ちにする。試作の `:exp` が main のビルドを止めて、Docker Hub と GHCR の `latest` が食い違うことがないように。

## Revision 2026-10-02: レビューの残り
- 自動停止の「生成中」を、キューに残っているかではなく、ComfyUI が実行の通知（`execution_start`、`progress`、`progress_state` など）を出しているかで判断する。タブを閉じても通知は出るので長いバッチは切らず、固まった node は延長しない。進捗を出さずに 30 分以上かかる 1 つの node は止まったとみなす（実際にはまずない）。
- モデルのダウンロードは、再試行のとき aria2 の続きから再開する（制御ファイルを 5 秒ごとに保存）。sha256 が合わなかったときだけ最初から。
- プロファイルの名前（モデル名、directory、workflow 名、custom node の ID）は、起動時にパスとして安全か確かめる（`..`、絶対パス、記号を拒否、コード `profile_invalid`）。
- `COMFY_REF` で ComfyUI を動かしたときは、Manager の `manager_requirements.txt` も入れ直す。
- `workflows` のパターンは `*` と `**` だけにする（`check:runpod` でエラー）。

## Revision 2026-10-10: 開くタブを絞る
- 初回表示で全 workflow をタブで開くのをやめる。Qwen-Image-2.1 は 12 本（Turbo 版を足すと 24 本）並び、読者が来た目的の workflow が埋もれる。
- 開くのはプロファイルの `open` に書いた workflow。書かなければ記事で最初に出てくる 1 本。選ぶのはプロファイルを書く人で、読者は起動中に何も選ばない（ダウンロードが速い Pod はすぐ ComfyUI に切り替わるため）。
- 全 workflow はこれまでどおりサイドバーの Workflows タブに置き、初回表示ではそのサイドバーを開いておく。`folders`（フォルダ名 → パターン）でまとめられる。
- プロファイルの workflow に `open`（真偽）と任意の `folder` を足す。古い Pod image は無視し、`open` のない古いプロファイルを新しい image が読むと最初の 1 本だけを開く。どちらの組み合わせでも動くので `schema_version` は上げない。

## Consequences
- workflow を差し替えるときは `properties.models` も保つ必要がある。欠けているとプロファイル生成が警告を出す。
- 記事側のカード（`{% runpod %}`）は 2026-10-02 の追記で決めた。ディスク容量はテンプレートに入っているので、カードには出さない。
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

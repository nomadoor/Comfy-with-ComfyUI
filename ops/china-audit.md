# China Optimization / Translation Feasibility Audit

Date: 2026-02-05

## 0. Scope
- Target: Comfy-with-ComfyUI docs site (Eleventy)
- Goals: assess external dependencies, font strategy, China-safe degradation, SEO readiness, translation ops, and light-weight measurement
- Output: actionable recommendations and priority list

---

## 1. External Dependencies (Domain Inventory)

### 1.1 Page-load / runtime dependencies (HTML/JS/CSS)
- `fonts.googleapis.com` / `fonts.gstatic.com`
  - Location: `src/layouts/base.njk` (Google Fonts link, preconnect)
  - Category: fonts
  - 失敗時: ページは止まらないが、CSS取得がレンダーブロック要因
  - 遅延影響: 初期描画に影響（display=swap なのでフォールバックは出る）
  - 中国本土: 高確率で詰まる
  - 優先度: P0

- `challenges.cloudflare.com`
  - Location: `src/assets/js/assistant-rail.js` (Turnstile script; sitekeyがある時のみ)
  - Category: anti-bot (Turnstile)
  - 失敗時: フィードバック送信不可（本文/通常閲覧は可）
  - 遅延影響: 送信時のみ（フォームを開いて送信するまで影響なし）
  - 中国本土: 詰まりやすい
  - 優先度: P1

- `comfyui-feedback-staging.nomadoor.workers.dev`
  - Location: `src/_data/env.js` (プレビュー時のみのデフォルト)
  - Category: external API (feedback)
  - 失敗時: フィードバック送信不可（本文は可）
  - 遅延影響: 送信時のみ
  - 中国本土: 中〜高
  - 優先度: P2

- `i.gyazo.com`
  - Location: `src/includes/toc.njk` (assistant rail内のGyazo動画)
  - Category: embed/media
  - 失敗時: 動画が表示されない（本文は可）
  - 遅延影響: 右レール開放時に体感劣化
  - 中国本土: 高
  - 優先度: P1

- `github.com`
  - Location: `src/layouts/page.njk` (footer link)
  - Category: external link (クリック時のみ)
  - 失敗時: クリック先が開かないだけ
  - 遅延影響: なし
  - 中国本土: 中
  - 優先度: P3

Note:
- `www.w3.org` は SVG Namespace（`http://www.w3.org/2000/svg`）でネットワーク依存ではありません。

### 1.2 Content external assets (Markdown → HTML)
- Gyazo画像/動画: `gyazo.com`, `i.gyazo.com`
  - 多数のページで画像/動画として使用
  - 失敗時: ビジュアル欠落、本文は残る
  - 中国本土: 高
  - 優先度: P0〜P1（ビジュアル重要度による）

### 1.3 External links (content references)
- 例: `github.com`, `huggingface.co`, `download.pytorch.org`, `docs.comfy.org`, `docs.opencv.org`, `www.youtube.com`, `x.com` ほか
- クリック時のみの参照であり、ページ初期表示には影響なし
- 中国本土: ドメインにより差が大きい
- 優先度: P3

補足: 検出された全ドメイン一覧は末尾「Appendix A」に記載。

---

## 2. Font Strategy (China-safe)

### 2.1 現状
- 方式: `link` 直読み (Google Fonts)
- 設定: `display=swap` あり
- Location: `src/layouts/base.njk`
- CSS側フォント: `--font-base` で `"Plus Jakarta Sans", "Zen Kaku Gothic New", ...` を使用

### 2.2 zhだけで外部フォントOFF案（最小差分）
- 実装イメージ:
  - `base.njk` で `currentLang == 'zh'` のとき Google Fonts `<link>` を出さない
  - CSSで `body[lang="zh"] { --font-base: <CN system stack>; }`
- 影響範囲: zhのみ
- 日英は巻き込まない: 可能
- 優先度: P0

### 2.3 zhだけセルフホスト
- 実装イメージ:
  - CN向けフォント（例: Noto Sans SC / Source Han Sans）を `src/assets/fonts/` に追加
  - `@font-face` と `font-display: swap`
  - `body[lang="zh"]` で切替
- 影響範囲: zhのみ
- 日英を巻き込まない: 可能
- コスト: ファイルサイズ/ライセンス/ビルド容量の検討が必要
- 優先度: P1

### 2.4 Google Fonts継続（zh含む）
- 低コストだが、中国本土で詰まりやすい
- 日英/zhを一緒に巻き込むリスクあり
- 優先度: P2

---

## 3. China-safe Degradation (機能劣化の許容)

### 3.1 無効化候補（zh / lite）
- Assistant rail のフォーム機能（Turnstile + feedback API）
- Gyazo 動画（右レール/本文の loop/player）
- 外部埋め込み（YouTube/Xなどが増える場合）

### 3.2 方式案
- `?lite=1` クエリで「外部依存を抑える」モード
  - JS側で外部スクリプト読込を停止
  - Gyazo動画をリンク表記に置換（視聴は外部）
- `lang==zh` のとき自動で lite preset
  - zhページのみ「本文優先」モード

### 3.3 期待される効果
- “本文は必ず読める” を最優先にできる
- 外部依存が詰まっても破綻しない

---

## 4. Multilingual SEO Readiness (翻訳前チェック)

### 現状
- URL設計: `/ja/` / `/en/` はOK
- `hreflang`: 未実装
- `canonical`: 未実装（`og:url` はあるが `link rel="canonical"` がない）
- Sitemap: 単一 `/sitemap.xml` で全ページを列挙（言語別の `xhtml:link` はなし）
- Title/Description: `title` / `summary` ベースでページ単位に生成される

### 提案
- `hreflang` の導入（ja/en/zh + x-default）
- `canonical` を `site.url + page.url` で出力
- Sitemapに `xhtml:link` を追加 or 言語別 sitemap を出す

---

## 5. Translation Ops Rules (翻訳運用のためのルール化)

### 5.1 “翻訳してはいけないもの” の種
- ノード名、UIラベル、モデル名、ファイル名、コード、パラメータ名、JSONキー、URL
- `backtick` で囲われた語は原則そのまま

### 5.2 見出し/アンカーの安定性
- 見出しは自動ID生成のため、翻訳でURLフラグメントが変わる
- 翻訳差分を管理するなら「明示的ID」や「リンクは本文内で完結」などのルール化が必要
- ルール追加は `/ops/style-writing.md` への反映が前提

### 5.3 Front matter の翻訳範囲
- 翻訳対象: `title`, `summary`
- 固定: `slug`, `navId`, `section`, `permalink`

---

## 6. Measurement / Verification (簡易で実測可能な形)

### 6.1 外部依存ブロックの挙動確認
- Playwrightで外部ドメインを `route.abort()` し、本文描画（H1/本文）だけは通るか確認
- `?lite=1` の動作検証も同時に可能

### 6.2 フォント失敗時の崩れ
- フォントURLをブロックして `layout shift` / `overflow` を目視確認
- `font-display: swap` のフォールバックで本文が読めるかを確認

### 6.3 ログ案（軽量）
- `window.addEventListener('error', ...)` でリソースロード失敗をコンソールに出す
- 本番は不要、`?debug=1` の時のみ有効化で運用可能

---

## Appendix A: External Domains Found (src/ 走査結果)
- `127.0.0.1:8188` (docs example; not a dependency)
- `ai.feishu.cn`
- `ai.meta.com`
- `aidemos.meta.com`
- `ali-vilab.github.io`
- `alidocs.dingtalk.com`
- `blog.comfy.org`
- `blog.fal.ai`
- `byteaigc.github.io`
- `challenges.cloudflare.com`
- `civitai.com`
- `clipdrop.co`
- `cloud.comfy.org`
- `comfyui-feedback-staging.nomadoor.workers.dev`
- `comfyui-wiki.com`
- `comfyui.creamlab.net`
- `comfyui.nomadoor.net`
- `cvml-expertguide.net`
- `docs.bfl.ai`
- `docs.comfy.org`
- `docs.ltx.video`
- `docs.opencv.org`
- `download.pytorch.org`
- `fantasy-amap.github.io`
- `fonts.googleapis.com`
- `fonts.gstatic.com`
- `gitforwindows.org`
- `github.com`
- `gyazo.com`
- `huggingface.co`
- `humanaigc.github.io`
- `i.gyazo.com`
- `ko-fi.com`
- `labs.eecs.tottori-u.ac.jp`
- `liveportrait.github.io`
- `ltx.io`
- `marshmallow-qa.com`
- `meigen-ai.github.io`
- `nadmag.github.io`
- `nieta-art.feishu.cn`
- `obsproject.com`
- `omni-avatar.github.io`
- `openmodeldb.info`
- `prompt-plus.github.io`
- `replicate.com`
- `scrapbox.io`
- `songkey.github.io`
- `stability.ai`
- `szczesnys.github.io`
- `website.ltx.video`
- `www.comfy.org`
- `www.copainter.ai`
- `www.illustrious-xl.ai`
- `www.reddit.com`
- `www.serif.com`
- `www.sitemaps.org`
- `www.w3.org` (SVG namespace; not network)
- `www.youtube.com`
- `x.com`
- `zero123.cs.columbia.edu`

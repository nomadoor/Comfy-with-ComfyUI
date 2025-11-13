# REQUIREMENTS.md — Site Implementation Spec (Eleventy / ESM / CSS)

## 0. Tech Stack
- Eleventy (11ty), Nunjucks, **ESM Only**（ブラウザは `<script type="module">`）
- Vanilla CSS（ネスト構文可）。トークンは `/ops/style-design.md` に定義
- 配信：Cloudflare Pages（HTML 短命キャッシュ、`/assets` は long-term immutable）

## 1. Routing / Content
- URL: `/<lang>/<slug>/`（slug は**言語非依存**の英語 kebab）
- 物理構造（例）：
- src/
content/ja/.md → /ja/<slug>/
content/en/.md → /en/<slug>/
workflows/<slug>/*.json # 言語共通。存在は任意（CIで必須化しない）
assets/** # 画像やアイコン（Gyazo が基本だがローカルも可）
_data/
nav.ja.yml
nav.en.yml
site.json

- Frontmatter（最小）：`slug`, `title`, `tags[]`（≤5）, `draft`（bool）
- `draft: true` は本番出力から除外
- 日付は git の初回/最終コミットから注入（frontmatter で保持しない）

## 2. Navigation / Tags（ページ＝タグ方式）
- 唯一ソース：`src/_data/nav.ja.yml`, `nav.en.yml`
- 「📂生成AIの仕組みと出来ること」配下の `pages.slug` を **許可タグ集合**としてビルド時抽出
- H1 直下に**タグチップ**を表示  
- 文言は現在UI言語のラベル  
- 未翻訳は空白＋ページ冒頭に「未翻訳」バナー

## 3. Related Workflows
- 「📂生成AIの仕組みと出来ること」/ 「📂基本のworkflow」ページ下部に **同タグの Workflow カードを全件**表示
- 並び順：更新日 desc（git 最終コミット）
- ページネーション：初期 12/頁（設定化）
- カード項目：**タイトル＋サムネイル1枚**のみ（軽量維持）
- Flex-direction: columnで、上に画像、下にタイトル

## 4. Workflow JSON 配布
- 表示：`<filename>.json  [Copy]  [Download]`
- **Copy**：無加工のテキスト（改行・空白の改変禁止）
- **Download**：`Content-Disposition: attachment`
- トースト：hover「Copy」→ 成功「Copied」Downloadも同様

## 5. Images / Lightbox
- 画像・動画は Gyazo 埋め込みを既定。ローカル置きも可
- max-height指定
- https://gyazo.com/---/max_size/1000のようにロードサイズを適度に指定し、読み込み速度を上げる
- CLS 抑制：分かる範囲で width/height を先取り
- サイト全体のトーンを揃えるため、本文内の画像・動画にも共通の減光フィルタ（例：`filter: brightness(0.85)`）を適用
- ライトボックス要件：
- クリックで開く、**←/→** 移動、**Esc/背景クリック**で閉じる
- **+/−** ボタンとホイールでズーム

## 6. Search（言語別）
- `search/index-ja.json` / `search/index-en.json` をビルド時生成
- 対象：`title`, `tags`, `H2/H3`
- 簡易実装：前方一致＋部分一致
- UI言語に応じて **片側のみ**読み込む（JA→JAのみ、EN→ENのみ）

## 7. ESM / JS 配線
- フロントJSは **ESM のみ**（CommonJS 禁止）
- `<script type="module" src="/assets/js/lightbox.js"></script>` のように明示読み込み
- モジュールは `export` / `import` を使用、グローバル汚染禁止
- 依存追加は最小限。やむを得ず外部を使うときは **import maps** を検討

## 8. Icons（SVG）
- 置き場：`src/assets/icons/*.svg`（公開は `/assets/icons/`）
- 規約：`viewBox` 必須／`width,height` 未指定／色は `currentColor`
- 命名：kebab-case（例：`copy.svg`, `download.svg`, `help.svg`）

## 9. CSS（設計方針）
- 素の CSS（ネスト構文を標準採用）
- 規模を抑え、**レイアウト中心の最小設計**（BEM/SMACSS の厳密運用は行わない）
- 値は `/ops/style-design.md` のトークン参照（色・余白・角丸・境界・タイポ）
- アニメーションは控えめ（100–200ms 目安）。影は原則不使用

## 10. Accessibility / Performance
- 画像 `alt` 必須（Gyazo埋め込みでも代替文を許可）
- ライトボックスのキーボード操作（フォーカス・Esc）を保証
- 画像は lazy＋近接先読み（2〜3枚）
- `/assets/*` は `Cache-Control: public, max-age=31536000, immutable`
- HTML は短命キャッシュ（Cloudflare Pages の設定で管理）

## 11. CI / Quality Gates
- 同セクションでの slug 重複禁止（言語横断）
- `nav.*.yml` の slug 実在チェック
- tags[] が許可集合に含まれる・上限5超は警告
- 画像 width/height 未指定率の警告（指標として集計）
- 任意：外部リンク死活（負荷を見て実行）

## 12. Deliverables
- `.eleventy.js` の最小配線（ESM読み込み・`src/assets` パススルー）
- `layouts/`, `includes/`（外殻3カラム、H1直下タグ、TOC、Workflowカード）
- `assets/js/`（`lightbox.js`, `copy-json.js`, `search.js` の ESM 実装）
- `_data/`（`nav.ja.yml`, `nav.en.yml`, `site.json`）
- `README.md`（執筆手順・ビルド手順）

## 13. Change Control（ADR）
- **IA の初期定義／内部処理の変更**（URL設計、タグ抽出ロジック、許可集合の決め方）  
- コンポーネントの新設・破壊的変更、デザイントークン再定義、CIゲート変更、検索方式変更  
→ いずれも **PR 前に ADR を起案**し承認後に実装（Weekly rollup ADR 可）

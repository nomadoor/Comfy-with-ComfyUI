# AGENTS.md — Comfy with ComfyUI (Docs) / Agent Principles

**Motto**  
> Small, clear, safe steps — one source of truth in /ops (update /ops after every verbal change).

**Live directives trump docs**  
口頭で指示された仕様が最優先。指示を受けたら `/ops` を即座に更新し、それから実装すること。

---

## 1. Purpose
- 本リポジトリは **ComfyUI の入門〜実践ドキュメント**を静的サイトとして提供する。
- AIエージェントは **人間と同じ一次資料**（/ops）を参照し、勝手な仕様追加を行わない。

## 2. Scope / Non-Scope
**含む**
- Eleventy(11ty) による静的生成（JA/EN、URL は `/<lang>/<section>/<slug>/`）
- 「ページ＝タグ」方式（タグID=“📂生成AIの仕組みと出来ること”側の slug）
- Workflow 記事は自由形式。関連 Workflow は **同タグ全件カード表示**（ページネーション）
- 言語別検索（JA→JAのみ／EN→ENのみ）
- JS は **ESM 限定**、アイコンは `currentColor` 運用の SVG

**含まない**
- サーバーサイドDB、重いJSフレームワーク、常時トラッキング
- モック外の大改造（デザイントークン外の変更）

## 3. Ground Rules
- 規範は **/ops に集約**。実装前に /ops を更新（コード先行禁止）
- 変更は最小・可逆。曖昧さは **/ops を更新**して解消
- ID は言語非依存。表示とリンクで言語切替
- 依存は最小、軽量JS優先。未翻訳・未準備の Workflow JSON は許容

## 4. Information Architecture（要約）
- 左：サイドバー（上部にセクションタブ、タブを切り替えると該当セクションのナビが1カラムで表示される）
- 中：本文（H1直下に**タグチップ**）
- 右：TOC（H2/H3）
- 「できること」/ 「workflow」セクションページ下部：**同タグの カード全件**

## 5. Tagging（ページ＝タグ）
- タグIDは **言語非依存 slug**（“📂生成AIの仕組みと出来ること”配下の slug）
- 表示ラベル・リンクは **現在UI言語**で解決（リンクは `/<lang>/ai-capabilities/<slug>/` 等）
- 1記事のタグ上限：**5**

## 6. URL & Identity
- 公式URL：`/<lang>/<section>/<slug>/`  
  - `lang` … `ja` / `en`  
  - `section` … `begin-with` / `ai-capabilities` / `basic-workflows` / `faq`（暫定）  
  - `slug` … 言語非依存の英語 kebab
- **同一 section 内で slug の重複を禁止**（言語別に同じ slug は可）

- **提供モック**（レイアウト・配色・余白・角丸・境界）を最優先。ただしピクセル単位の一致は不要、雰囲気と構造を合わせる。
- src/assets/mockのモックアップ画像を参考にする
- 値は **/ops/style-design.md** のトークンで定義、実装はトークン参照のみ
- 影は原則なし、階層は border + surface 差

## 8. ESM / Assets（方針）
- フロントJSは **ESM 限定**（CommonJS 不可、`type="module"`）
- アイコン：`src/assets/icons/*.svg`（`viewBox`必須・`currentColor`）

## 9. CI / Quality Gates（要旨）
- **section×slug の一意性**（言語横断で同一 section 内の重複禁止）
- `nav.*.yml` の slug 実在
- tags[] が許可集合に含まれる・上限5超は警告
- 画像 width/height 未指定率の警告

## 10. ADR Cadence（いつADRを書くか）
**PR 前に ADR を起案し承認後に実装**
- **IA の初期定義／内部処理の変更**（URL設計、タグ抽出、許可集合の決め方）
- コンポーネントの新設・破壊的変更（ライトボックス、配布バー、検索UI）
- デザイントークン再定義（色体系・余白スケール・タイポ）
- CI/品質ゲートの追加・閾値変更
- 検索方式変更（インデックス仕様・対象範囲）
- 週次の小変更は **Weekly rollup ADR** を許容

## 11. MCP Agents（最小ルール）
- 読み取り優先：`/ops`, `/src/_data`, `/src/layouts`
- 書き込み：**`/src/**` のみ**（`/ops` 変更は PR で人間承認）
- 1 PR = 1 意図（骨組み／スタイル／検索など混在禁止）
- 完了条件：CI 緑＋モック準拠スクショ

## 12. Collaboration
- 規範と実装の不一致は実装停止 → /ops 更新を先提案
- 確信度 < 80% は Issue 起票→/ops に疑問を追記し合意

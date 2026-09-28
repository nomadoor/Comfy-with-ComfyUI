# ADR: 11tyを維持してSEO基盤を修正する (2026-09-28)

## Status
Accepted

## Context
- 検索順位の弱さについて、Astroへの移行を含めて検討した。
- 本番で確認した問題は、いずれもフレームワークではなく実装に起因する。
  - `sitemap.xml` の `<loc>` が相対URLになっている（`SITE_ORIGIN` 未設定、参照していた `site.origin` が存在しない）。
  - すべての `<lastmod>` がビルド日になっており、frontmatterの `updated` を反映していない。
  - 構造化データがWebSite/WebPageのみで、Article、著者、公開日、更新日がない。
  - heroがないページの `og:image` が相対パスのfaviconになっている。`twitter:card` が常に `summary`。
  - Workflow JSONがHTMLへ埋め込まれ、最大で約1MBのページがあり、routerのprefetchがそれを取得・解析している。
  - 検索結果向けのタイトルと説明文を記事ごとに調整する手段がない。
- 出力はどちらも静的HTMLであり、Astroへの移行によるSEO上の差はない。独自routerはAstroのClientRouterと同じpjax方式で、11tyとして妥当な範囲にある。

## Decision
- 11tyを維持する。Astroへは移行しない。
- 以下の順で修正する。
  1. sitemapを絶対URLにし、`lastmod` に `updated`（なければ `created`）を使う。`og:image` を絶対URLにし、heroがあるページは `summary_large_image` にする。
  2. Workflow JSONのHTML埋め込みをやめ、Copy時に取得する。
  3. 記事ページにArticle構造化データ（著者、公開日、更新日）を追加する。
  4. 検索結果向けのタイトルとdescriptionを記事ごとに設定可能にする（frontmatterの項目名は実装前にオーナー承認を得る）。
  5. routerの戻る操作でのスクロール復元と、hash履歴での再取得を修正する。
- routerは維持する。ブラウザ標準のcross-document View TransitionsとSpeculation Rulesへの置き換えは将来の選択肢とし、本ADRの範囲外とする。

## Consequences
- sitemapの正しさは `scripts/check-build-output.mjs` で検証する。hreflangの参照先が実在することも同じチェックで検証する。
- hreflangとsitemapの代替URLは、`navId` ではなく実際のページURLの言語セグメントを差し替えて作る。JA `sd15-basics` の `navId: sd15-basic` のように `navId` と `slug` が異なるページでも、存在しないURLを指さない。`navId` 自体は変更しない。翻訳が存在しない言語の代替URLは出力しないため、JAのみの記事も追加できる。
- 準備中のplaceholderページはnoindexとし、sitemapから除外してhreflangも出力しない。404ページもhreflangを出力しない。
- 未使用だった `SITE_ORIGIN` 環境変数（`src/_data/siteOrigin.js`）を廃止し、originは `site.url` に一本化する。
- Workflow JSONは記事HTMLに埋め込まない。Copyボタンは `data-json-src` のルート絶対URLからクリック時に取得する。Safariでユーザー操作の扱いが切れないよう、クリック内で取得中のPromiseを持つ `ClipboardItem` を書き込み、使えない場合は `writeText`、最後にtextareaでコピーする。取得に失敗した場合は成功表示を出さない。埋め込みの再発は `check-build-output.mjs` で検出する。
- Article構造化データは、セクションに属し `created` を持つ記事ページに出力する（About、News、Contact、検索用ページ、noindexページは除く）。著者はPersonとして `site.json` の `author`（名前、プロフィールURLとしてX、公開済みのSNS）から出力し（Aboutページは使わず、noindexとする）、公開日と更新日は `created` / `updated` を使う。
- BreadcrumbListは、中間階層となるセクションの一覧ページが存在しないため保留する。セクション一覧ページとトップページの有無はIAの判断として別途扱う。
- 検索結果向けの上書き項目はfrontmatterの `seoTitle` / `seoDescription` とする（オーナー承認済み）。どちらも任意で、未設定なら `title` / `summary` を使う。画面上の見出しと要約は変えない。文面はオーナーが書くか承認する。
- オーナー指示により、JA/EN/ZHの全ての索引対象ページに `seoTitle` / `seoDescription` を設定し、空だった `summary` も埋めた。今後も全ページで必須とし、表示幅の上限とあわせて `check-frontmatter.mjs` で検証する。readable nodeの考え方は、造語ではなく「読みやすく整理したworkflow」という利点として、workflow中心の記事の説明文に書く。
- 本文が「準備中」だけの記事（music-generation、tts、video-generation、voice-clone）は、内容ができるまでnoindexにする。
- routerの修正内容：履歴エントリごとのIDとスクロール位置を `src/assets/js/history-entries.js` で管理し、Back / Forward、リロード、別サイトからの戻りで読んでいた位置に戻す（`history.scrollRestoration` は `manual`、位置はメモリとsessionStorageに保存）。同じページ内のhash履歴はfetchせずスクロールだけで戻す。取得中のページ遷移は、新しいクリックやBackで中止して履歴を壊さない。遷移アニメーション中に来た操作は捨てずに最後の1件を続けて実行する。meta descriptionは次ページに合わせて作成・削除する。router差し替え後も残るdocument listener（workflow picker、contactのカテゴリ選択）は、要素がページから外れたら自分で解除する。位置の復元は、画像などの読み込みで高さが変わる間は位置を保ち（その間はscroll anchoringを止める）、ユーザーが操作するか別の遷移が始まったら止める。これらは `tests/router.spec.ts` で検証する。
- 見直しで追加した修正：外部サイトのヒーロー画像はSNSプレビューに使わない。言語が変わるリンクはrouterで差し替えず通常の読み込みにする（ヘッダーとサイドバーは言語ごとに描画されるため）。準備中ページのtitleとdescriptionの生成不具合、既存の内部リンク切れ、`/media/` への素のリンクの未解決を修正した。ドラフトはビルドから除外する。
- サイト名の日本語表記は、オーナー判断によりスペースなしの「Comfyに使うComfyUI」にそろえる。
- 各段階は同じ作業ブランチ上で、段階ごとにcommit承認を得る。

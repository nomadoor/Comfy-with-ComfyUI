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
- Article構造化データは、セクションに属し `created` を持つ記事ページに出力する（About、News、Contact、検索用ページ、noindexページは除く）。著者はPersonとして `site.json` の `author`（名前とAboutで公開済みのSNS）から出力し、公開日と更新日は `created` / `updated` を使う。
- BreadcrumbListは、中間階層となるセクションの一覧ページが存在しないため保留する。セクション一覧ページとトップページの有無はIAの判断として別途扱う。
- 各段階は同じ作業ブランチ上で、段階ごとにcommit承認を得る。

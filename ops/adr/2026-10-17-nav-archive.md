# ADR: 古いモデルの記事をセクション末尾のアーカイブにまとめる (2026-10-17)

## Status
Accepted

## Context
- 基本のworkflow は、後継モデルが出たあとも古いモデルの記事がナビに並び続け、長くなっている（例：FLUX.2 [klein] / FLUX 3 Image Klein があるのに Flux.1 の家族5本が並ぶ）。
- 記事は消さない（URL は固定の ID で、外からのリンクもある）。目的は、普段のナビに出さないことだけ。
- オーナーは折りたたみを好まない。目当ての記事の前に操作を1回挟むことになるため。ナビ全体を折りたたみ式にする案は取らない。

## Decision

### 置き場所
- アーカイブにする記事は、そのセクションのナビの一番下に置く見出し「アーカイブ」（`id: archive`、`noLink`、`archive: true`）の子にする。他の見出しと同じく、noindex のプレースホルダページが生成される。
- 親子関係はそのまま持っていく（Flux.1 の下に Flux.1 Tools などが並ぶ形のまま）。
- アーカイブかどうかはナビの位置だけで決める。記事の frontmatter には印を足さない。印を2か所に持つと食い違うため。
- JA / EN / ZH のナビを同じ構造にする（見出し名：アーカイブ / Archive / 归档）。

### 折りたたみ
- 折りたたむのはアーカイブの見出しだけ。他の見出しは今のまま常に開いておく。
- 既定は閉じた状態。今開いているページがアーカイブの中にあるときだけ、最初から開いた状態で出す（サーバー側で `<details open>` を付ける）。
- 開閉状態は保存しない。

### 記事側
- 記事には何も足さない（帯や注記は出さない）。
- URL・slug・navId・workflow JSON・画像は変えない。リダイレクトも入れない。

### 他の場所での扱い
- 前後ページのリンク：通常の記事の並びからアーカイブを外す。アーカイブにした記事には前後リンクを出さない。
- 関連ページのカード：他の記事のカードにアーカイブ記事を出さない。アーカイブ記事自身のカードは今のまま出す。
- サイト内検索、sitemap、llms.txt：今のまま載せる。名前で探しに来る人がいるため。
- ホームのおすすめ：チェックは足さない。アーカイブ記事をおすすめに載せることは想定しない。

### 最初に移した記事（基本のworkflow）
- Flux.1、Flux.1 Tools、ACE++、Flux.1 Kontext、Chroma1-HD
- AuraFlow
- Lumina-Image 2.0
- Qwen-Image、Qwen-Image-Edit、Qwen-Image-Layered
- 対象外：Wan 2.1 の家族（残す）。SD1.5 系（別セクションへ移す可能性があり、保留）。APIノード（2026-10-07 の ADR でナビから外し済み）。

## Files
- Updated: `src/_data/nav.{ja,en,zh}.yml`, `src/includes/nav-list.njk`, `eleventy/filters.mjs`, `src/styles/04-sidebar.css`, `src/assets/js/link-behavior.js`（ルーターでの移動はサイドバーを差し替えないので、移動先がアーカイブ内なら JS で開く）, `tests/layout.spec.ts`, `ops/ia.md`, `ops/requirements.md`

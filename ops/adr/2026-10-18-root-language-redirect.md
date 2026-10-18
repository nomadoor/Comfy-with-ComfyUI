# ADR: `/` をブラウザの言語に合わせて振り分ける (2026-10-18)

## Status
Accepted

## Context
- `/` は `src/_redirects` の `/ /ja/ 301` で、誰が来ても日本語のホームへ送っていた。ブラウザの言語は見ていなかった。
- ロゴ、言語切り替え、記事の URL はどれも言語を保つ。日本語に固定されるのは、ドメインだけで来た場合（手入力、ドメインだけのブックマークやプロフィールのリンク）に限られる。
- 英語や中国語の読者が、ドメインから入ると日本語のホームに着き、言語ボタンが光るだけで切り替わらなかった。

## Decision
- `/` は Pages Function `functions/index.ts` が答える。`Accept-Language` を重み順に見て、最初に当たった `ja` / `en` / `zh` のホームへ送る。どれも無い（クローラーなど）ときは今までどおり `/ja/`。
- 302 にし、`Vary: Accept-Language` と `Cache-Control: private, no-store` を付ける。行き先が要求ごとに変わるので、恒久的な 301 やキャッシュは使わない。クエリ文字列は引き継ぐ。
- `src/_redirects` から `/ /ja/ 301` を外す。`src/index.njk`（meta refresh と JS で `/ja/` へ）は、開発サーバーなど Function が動かない場所のための予備として残す。
- 振り分けるのは `/` だけ。言語つきの URL を開いた読者を別の言語へ動かすことはしない（言語ボタンを光らせて知らせる今の動きは変えない）。

## Files
- Added: `functions/index.ts`, `functions/_lib/home-lang.mjs`, `functions/_lib/home-lang.test.mjs`
- Updated: `src/_redirects`, `src/index.njk`, `package.json`（`test:unit` に追加）, `ops/requirements.md`, `ops/ia.md`

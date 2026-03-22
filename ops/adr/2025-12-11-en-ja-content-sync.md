# ADR: EN/JA Content Sync – Basic Workflows (2025-12-11)

- Status: Accepted  
- Date: 2025-12-11

## Context
- JA をベースに英語記事を随時追加・更新しているが、Flux 系・Qwen 系など新規ページの英訳が遅れがちだった。
- nav.en.yml と実体ページの齟齬がたびたび発生していた（子ページ欠如、ラベル不一致など）。
- ユーザーから「英語記事を作成・更新し、ナビとリンクの不備をなくす」要求があり、直近で複数ページを追加・更新した。

## Decision
1) JA ベースの新規/更新ページを EN に反映し、ナビも同期した。今回対象:
   - 新規 EN: `chroma1-hd`, `qwen-image-edit`
   - EN 更新: `ace-plus-plus`, `auraflow`, `qwen-image`
   - nav.en.yml を JA 構造に合わせつつ英語ラベルで維持
2) BOM 残存をゼロにし、CI/ビルドでのエンコード事故を防止。
3) ワークフロー JSON は翻訳対象外として明示的に除外。

## Consequences
- EN/JA のパリティが改善され、ナビからの 404 リンクが解消。
- 英訳待ちページがある場合は同様のフロー（JA→EN、nav 更新、BOM チェック）を踏襲すること。
- さらなる追加が出た際は、先に `/ops` へ意図を記録し、nav を同時に更新する。

# ADR: TRELLIS.2 のページに Pixal3D も載せる (2026-11-13)

## Status
Accepted

## Context
- TRELLIS.2（Microsoft）と Pixal3D（清華大学・Tencent ARC など）は別々のモデル。
- Pixal3D の現行版は TRELLIS.2 をベースにした改良版で、VAE と画像エンコーダを共有する。

## Decision
- `basic-workflows/trellis-2` の 1 ページにする。タイトルは「TRELLIS.2」。
- 先に TRELLIS.2 を説明し、Pixal3D はその改良版として同じページで扱う。workflow はそれぞれ別に載せる。
- Pixal3D のマルチビュー版（正面・左・背面・右の 4 枚の画像から作る）も同じページに載せる。
- ナビは「3D生成」グループの先頭（Idol の上）に置く。
- EN / ZH もオーナーの依頼で同時に翻訳し、ナビとお知らせを 3 言語にそろえる。

## Files
- Updated: `src/_data/nav.{ja,en,zh}.yml`, `src/content/{ja,en,zh}/news.md`, `ops/ia.md`
- Added: `src/content/{ja,en,zh}/basic-workflows/trellis-2.md`, `src/workflows/basic-workflows/trellis-2/{trellis_2_image2model,pixal3d_image2model,pixal3d_multiview2model}.json`

# ADR: 基本のworkflow に「3D生成」グループを足す (2026-11-12)

## Status
Accepted

## Context
- 基本のworkflow には 3D 生成モデルのページが無かった。3D の話は ai-capabilities の `3d-model-generation`（総論）だけだった。
- オーナー判断で、Idol から順に 3D 生成モデルのページを書く。続けて Pixal3D / TRELLIS.2 も予定している。

## Decision
- JA / EN / ZH ナビの `basic-workflows` に、見出しのみのグループ `3d-workflows`（3D生成）を足す。
- 置き場所は `video-workflows` の下、`upscale-fix` の上。生成モデルのグループを画像 → 動画 → 3D と続けて並べる（`2026-10-17-upscale-below-video.md` と同じ考え方）。
- 最初のページは `basic-workflows/idol`。
- グループ名は既存の ai-capabilities の 3D グループに合わせ、EN は `3D Generation`、ZH は `3D 生成` とする。
- EN / ZH のページはオーナーの依頼で 2026-11-13 に同時に足した。

## Files
- Updated: `src/_data/nav.{ja,en,zh}.yml`, `ops/ia.md`
- Added: `src/content/{ja,en,zh}/basic-workflows/idol.md`, `src/workflows/basic-workflows/idol/idol_image2gaussian_splat.json`

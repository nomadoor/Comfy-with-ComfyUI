---
layout: page.njk
lang: ja
slug: media-fixtures
title: "Media fixtures"
summary: "メディア表示の検証用ページ（Playwright）"
robots: noindex
searchExclude: true
permalink: "/internal/media-fixtures/"
hero:
  image: "/media/fixtures/r2_video.mp4"
---

Playwright の `tests/media.spec.ts` が使う検証用ページです。`COMFY_MEDIA_FIXTURES=1` のテストビルドでだけ生成されます。`/media/fixtures/...` は `tests/fixtures/media/media.json` に登録された fixture で、本番の R2 には存在しません（Playwright が通信をローカル fixture に差し替えます）。

<div data-fixture="r2-image">

![R2 image](/media/fixtures/r2_image.png){media=image}

</div>

<div data-fixture="r2-plain">

![](/media/fixtures/r2_image.png)

</div>

<div data-fixture="gyazo-image">

![Gyazo image](https://gyazo.com/a0b09641bae0c8b02187e6c6b7bb9c5a){media=image}

</div>

<div data-fixture="gyazo-image-compat">

![Gyazo image (compat)](https://gyazo.com/a0b09641bae0c8b02187e6c6b7bb9c5a){gyazo=image}

</div>

<div data-fixture="r2-loop">

![R2 loop](/media/fixtures/r2_video.mp4){media=loop}

</div>

<div data-fixture="r2-player">

![R2 player](/media/fixtures/r2_video.mp4){media=player}

</div>

<div data-fixture="sync-row">

![a](/media/fixtures/r2_video.mp4){media=loop} ![b](/media/fixtures/r2_video_b.mp4){media=loop}

</div>

<div data-fixture="unsynced-row">

![a](/media/fixtures/r2_video.mp4){media=loop} ![long](/media/fixtures/r2_video_long.mp4){media=loop}

</div>

<div data-fixture="lazy-spacer" style="height:300vh"></div>

<div data-fixture="far-loop">

![far loop](/media/fixtures/r2_video_far.mp4){media=loop}

</div>

<div data-fixture="far-player">

![far player](/media/fixtures/r2_video_far_player.mp4){media=player}

</div>

<div data-fixture="gyazo-loop">

![Gyazo loop](https://gyazo.com/8cc0775e0b3f0bf5605f9b3aedf0665c){media=loop}

</div>

<div data-fixture="gyazo-player">

![Gyazo player](https://gyazo.com/4e0ce0ea62fc7138ffe7ea1892ec21b8){media=player}

</div>

<div data-fixture="row-r2-image">

{% mediaRow img="/media/fixtures/r2_image.png {media=image}", alt="R2 row image", width=33 %}
R2 image in mediaRow.
{% endmediaRow %}

</div>

<div data-fixture="row-gyazo-loop">

{% mediaRow img="https://gyazo.com/b1c0185c6afc1de67f01acd041169f7c {media=loop}", alt="Gyazo row loop", width=33 %}
Gyazo loop in mediaRow.
{% endmediaRow %}

</div>

{% set cardMedia = "/media/fixtures/r2_image.png" | resolveMedia({ size: 480 }) %}
<div data-fixture="card-resolution" data-src="{{ cardMedia.src }}" data-full-src="{{ cardMedia.fullSrc }}" data-og="{{ cardMedia.og }}" hidden></div>

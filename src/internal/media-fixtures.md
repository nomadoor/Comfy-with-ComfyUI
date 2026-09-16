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
  gradient: ""
---

Playwright の `tests/media.spec.ts` が使う検証用ページです。R2 / Gyazo × image / loop / player の表示と lightbox を確認します。R2 の URL は `src/_data/media.json` に登録済みの fixture（`tests/fixtures/media/`）です。

<div data-fixture="r2-image">

![R2 image](https://img.comfyui.nomadoor.net/u/8934448705a26ed8.png){media=image}

</div>

<div data-fixture="r2-plain">

![](https://img.comfyui.nomadoor.net/u/8934448705a26ed8.png)

</div>

<div data-fixture="gyazo-image">

![Gyazo image](https://gyazo.com/a0b09641bae0c8b02187e6c6b7bb9c5a){media=image}

</div>

<div data-fixture="gyazo-image-compat">

![Gyazo image (compat)](https://gyazo.com/a0b09641bae0c8b02187e6c6b7bb9c5a){gyazo=image}

</div>

<div data-fixture="r2-loop">

![R2 loop](https://img.comfyui.nomadoor.net/u/23d3bb96df2ebf63.mp4){media=loop}

</div>

<div data-fixture="r2-player">

![R2 player](https://img.comfyui.nomadoor.net/u/23d3bb96df2ebf63.mp4){media=player}

</div>

<div data-fixture="gyazo-loop">

![Gyazo loop](https://gyazo.com/8cc0775e0b3f0bf5605f9b3aedf0665c){media=loop}

</div>

<div data-fixture="gyazo-player">

![Gyazo player](https://gyazo.com/4e0ce0ea62fc7138ffe7ea1892ec21b8){media=player}

</div>

<div data-fixture="row-r2-image">

{% mediaRow img="https://img.comfyui.nomadoor.net/u/8934448705a26ed8.png {media=image}", alt="R2 row image", width=33 %}
R2 image in mediaRow.
{% endmediaRow %}

</div>

<div data-fixture="row-gyazo-loop">

{% mediaRow img="https://gyazo.com/b1c0185c6afc1de67f01acd041169f7c {media=loop}", alt="Gyazo row loop", width=33 %}
Gyazo loop in mediaRow.
{% endmediaRow %}

</div>

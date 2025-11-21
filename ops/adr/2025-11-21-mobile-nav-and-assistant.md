# ADR: Mobile Navigation & Assistant Placement (2025-11-21)

## Context
- Desktopレイアウトは現行の3カラム（サイドバー/本文/TOC+assistant-rail）で完成度が高い。ハンバーガー等のUI変更はデスクトップには不要。
- モバイル幅（目安 ≤ 900px）ではコンテンツ幅を確保したい。TOCは不要だが、assistant-railは引き続き使いたい。
- メニューアイコンとして `src/assets/icons/Menu Hamburger SVG File.svg` が用意されている。
- `site-header__actions`（ベル/ユーザ）のモバイル配置が未定義で、現状邪魔になっている。

## Decision
- デスクトップは変更しない（ハンバーガー非表示、既存グリッド維持）。
- モバイルではハンバーガーメニューを導入し、サイドバー（セクションナビ）を全画面オーバーレイで開閉する。
- TOCはモバイルでは非表示にする。
- assistant-railはハンバーガーメニュー内ナビの直下に配置し、モバイルでも利用可能にする。
- モバイルのヘッダーでは、`site-header__actions` を検索バーの横に移動する。

## Implementation Plan
- アイコン: `icon.njk` に `"menu"` を追加して既存SVGを使う。
- ヘッダー: モバイル幅のみハンバーガーを表示し、`aria-expanded` + `body.nav-open` で開閉を管理。アクションを検索横に配置。
- サイドバー: `nav-open` 時に固定表示されるオーバーレイとして表示。デスクトップは変化なし。
- assistant-rail: 共通パーシャルをサイドバー内に読み込み、モバイルでのみ表示。デスクトップの右カラムは従来どおり。
- TOC: `max-width: 900px` で非表示。
- テスト: 既存 Playwright を維持しつつ、viewport 1600px で PC レイアウトを確認する（現行レイアウトテストを温存）。

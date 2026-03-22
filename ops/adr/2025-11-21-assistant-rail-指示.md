# ADR

## 画面右下のassistant-railの設計について

## デザイン
- すでにある他のコンポーネント。色を使い買ってな装飾(border)は行わないように。基本的に値も変数を使ってください。
- closeボタンに使うsvgはアセットにあるもの。
- 一般的なものより大きく、周りを円で囲ってください。

## 挙動
- assistant-rail__panel には現在3つの項目があります。
- これをクリックしたときに以下の挙動に遷移します。

### 共通
- クリックするとassistant-rail__panelは消え、同じ横幅、位置は同じ    transition: opacity var(--assistant-rail-transition-duration) var(--assistant-rail-transition-timing);　の場所にウィンドウが出現します。
- 上部にはassistant-rail__panelとおなじタイトル(e.g. jsonコピーボタンとは？) その右に大きなcloseボタン。　規定のsvgを使用してください。その下に書く選択肢ごとの機能があります。
- assistant-rail__panel をクリックしたあとのウィンドウはホバーアウト、他の領域クリックでは消えず、バツボタンでしか消えません。
- バツボタンでウィンドウを消した後ろには、再び3つの assistant-rail__panel がおり、そのまま継続して別のassistant-rail__panelをクリックすることが出来ます。
- ホバーアウトすれば、現在のtranditionのまま、数秒後にフェードアウトします。

## 書く選択肢について
- jsonボタンとは？
   - 上部に説明、下部にgyazo ループ動画を配置
- このページに間違いがあります！　/ これについても解説してください！
   - cloudfrae workerとgithubを連携し、ここに書かれたものがissueとして匿名で投稿されます。
   - 入力欄と送信内容を"確認ボタン→送信する　" というシンプルな構成で良いでしょう。
   - このページに間違いがあります。のほうでは、現在いるURL(slug)を取得して送信します。

## 今後の実装タスク
- Cloudflare Worker（`ops/cf-worker-feedback.js`）をデプロイし、`GITHUB_TOKEN / OWNER / REPO` を Workers の環境変数に設定する。
- CSRF 用 Cookie(`assistant_feedback_csrf`) を Cloudflare Pages/Functions で発行し、Worker 側で `X-CSRF-Token` ヘッダーと照合する。
- `ASSISTANT_FEEDBACK_ENDPOINT` などの環境変数をビルド時に注入し、`env.js` からテンプレートへ渡す。
- Worker 側で rate-limit・エラーハンドリングを実装し、GitHub API 失敗時の再試行/ログを整備する。
- Playwright などの E2E では実エンドポイントにアクセスしないよう、モック URL を環境変数で切り替えられるようにする。

# IA SUMMARY

| Section Key | JA Label | EN Label | Purpose / URL Root |
| --- | --- | --- | --- |
| `begin-with` | 📂はじめてのComfyUI | 📂Begin With ComfyUI | Onboarding sequence (`/<lang>/begin-with/<slug>/`) that teaches setup, UI basics, and PC literacy. |
| `data-utilities` | 📂データ / 画像ユーティリティ | 📂Data & Image Utilities | Repeatable utilities for data prep and image manipulation. URL root `/<lang>/data-utilities/<slug>/`. |
| `ai-capabilities` | 📂AIの仕組みと出来ること | 📂AI Capabilities | Conceptual capability coverage and advanced techniques. |
| `basic-workflows` | 📂基本のworkflow | 📂Basic Workflows | Practical recipes; each page pulls related workflow cards. |
| `notes` | 📝Notes | 📝Notes | Flat note collection for FAQ, troubleshooting, projects, and short incident playbooks. URL root `/<lang>/notes/<slug>/`. |
| `about` | ℹ️About | ℹ️About | Standalone page (`/<lang>/about/`). Hidden from sidebar and main nav. |
| `news` | 📰更新情報 | 📰News | Standalone page (`/<lang>/news/`). Not in main nav. |

> Emoji-prefixed labels appear in UI copy. Slugs stay ASCII kebab-case.

* 📂はじめてのComfyUI
  * このサイトの使い方
  * とりあえず動かしてみる
    * ComfyUIとは？
    * 推奨スペック
    * セットアップ
    * Comfy Cloud
    * 起動して生成
  * 必要なPC知識
    * パス
    * ターミナル
    * Python
    * git
  * ComfyUIの操作
    * 実行・停止
    * workflowの保存・読み込み
    * キャンバスの操作
    * ノード
    * メディア
    * Subgraph
  * カスタマイズ
    * 設定
    * コマンドライン引数
    * ComfyUI Manager
    * アップデート
    * モデルのダウンロードと配置
    * カスタムノード

* 📂データ / 画像ユーティリティ
  * データ操作
    * データ型
    * 単純な計算
    * テキスト操作
    * 条件分岐
    * Webカメラ入力
  * 基本的な画像処理
    * リサイズ・クロップ・パディング
    * 色調補正・フィルタ効果
    * マスクとアルファチャンネル
    * マスク操作
    * AIを使ったマスク生成
      * BiRefNet
      * SAM 3 / 3.1
    * レイヤ合成・ブレンド
  * 連続処理
    * キュー
    * リスト
    * バッチ・動画
  * API
    * APIとは？
    * APIでworkflowを実行してみる
    * ComfyUIのworkflowをAIエージェントに使わせる
  * コラム
    * リーダブルノードのすすめ
    * 無線でノードをつなぐ
    * ComfyUIを多重起動する

* 📂AIの仕組みと出来ること
  * 画像生成AIの仕組み
    * 拡散モデル
    * Conditioning
    * サンプリング
    * CFG
    * Latent Diffusion ModelとVAE
    * モデルアーキテクチャの違い
  * 画像生成の応用技術
    * アップスケール・画像修復
    * ControlNet系
    * 領域指定生成
    * Subject転送
    * FaceSwap
    * ID転送
    * 着せ替え
    * スタイル転送
    * 線画着色
    * 指示ベースの画像編集
    * 雑コラのリファイン
  * 画像変換
    * オブジェクト除去
    * リライト / Delight
    * 深度推定・ノーマルマップ生成
  * 動画・音声生成
    * アップスケール・動画修復
    * フレーム補間
    * リップシンク
    * talking head
    * 指示ベースの音声編集
    * video2audio
  * 3D生成
    * 3Dモデル生成
    * マルチビュー生成
  * コンピュータービジョン / VLM
  	* 物体検出
  	* マッティング
  	* セグメンテーション
  * LLM / MLLMの活用
    * プロンプト生成・編集
    * キャプション生成

* 📂基本のworkflow
  * 画像生成の基本 (SD1.5) — 親ページあり
    * text2image
    * Textual Inversion
    * LoRA
    * image2image
    * KSamplerAdvanced
    * Hires.fix
    * inpainting
    * outpainting
    * Differential Diffusion
    * ControlNet（親ページあり）
      * ControlNetの種類
      * 制御画像の作り方
    * IP-Adapter
  * 他の基盤モデル — 親ページあり
    * SDXL（親ページあり）
      * Illustrious
    * Flux（親ページあり）
      * Flux LoRA
      * Flux.1 Tools
      * ACE++
      * Flux.1 Kontext
      * Chroma
    * AuraFlow
    * Lumina-Image 2.0
    * Anima
    * Qwen-Image（親ページあり）
      * Qwen-Image-Edit
    * Z-Image（親ページあり）
      * Z-Image-Turbo
    * PixelDiT / PiD
    * Ideogram 4.0
  * アップスケール・修正 — 親ページあり
    * ESRGAN
    * GFPGAN
    * SUPIR
    * Ultimate SD Upscale
    * Detailer
  * マスク生成 — 親ページあり
    * BiRefNet
    * YOLO
    * Grounding DINO
    * SAM
  * 動画生成・処理 — 親ページあり
    * Wan 2.1（親ページあり）
      * Wan 2.1 VACE
      * Wan-Animate
      * SCAIL-2
    * Wan 2.2
    * LTX-Video
    * LivePortrait
    * HunyuanVideo-Foley
  * LLM / MLLM — 親ページあり
    * JoyCaption
    * Florence2
  * その他 — 親ページあり
    * ReActor
  * システム・最適化 — 親ページあり
    * モデルのマージ
    * 高速化・軽量化
  * 外部API — 親ページあり
    * nano-banana
    * gemini-flash
* 📝Notes
  * Noteを探す / Find Notes / 查找 Notes
  * 個別Noteは階層化せず、左カラムではフラットなタイトルリストとして表示する
  * Notes の絞り込み用分類は `noteTags` front matter を使う。通常ページの `tags` とは別物で、関連Workflowやサイトワイドタグリンクには使わない。ただし表示上は当面、通常タグと同じチップ表現を再利用する。個別Noteの `noteTags` チップは `/<lang>/notes/find/?q=<tag>` へ遷移し、Note finder の検索欄をそのタグで初期化する
  * `noteTags` は処理上も表示上もフラットなタグとして扱う。ただし著者向けの付与ルールでは tier1 / tier2 を分ける。tier1 は `faq`、`troubleshoot`、`project` のようなカテゴリ寄りの主分類。tier2 は `custom-nodes`、`concept`、`install`、`vram`、`error`、モデル名・ツール名・補助トピックのような副分類。各Noteは原則としてtier1を1件以上持ち、tier2は必要な分だけ追加する
  * Note finder 上部のタグボタンは全 `noteTags` の一覧ではなく、`src/_data/noteFinder.json` で明示したtier1タグを固定表示する。tier1語彙は少なく保ち、必要になった時だけ増やす
  * 左カラムの Notes パネルは固定の「Noteを探す」リンク、Updated / Views セグメント、フラットリストで構成する。「Noteを探す」リンクは特別導線としてアイコンを添えつつ、通常の `nav-list__link` 表現を再利用し、文字色は第一階層ナビと同じ明るさにする
  * `Views` は `src/_data/pageViews.json` を唯一の手動/生成データ源として使う。キーは正規URL（例: `/ja/notes/torch-cuda-oom/`）、値はページ単位の集計閲覧数。Cloudflare Web Analytics から `scripts/update-page-views.mjs` で生成し、Notes はその中の Notes URL だけを読む。閲覧数データが1件も無い間もセグメント内に表示するが、disabled として扱い、クリックしても `Updated` と同じ並びになる状態は作らない
  * 旧 `/<lang>/faq/<slug>/` はコンテンツを残さず、Cloudflare Pages `_redirects` で `/<lang>/notes/<slug>/` へ 301 リダイレクトする

## Hidden Draft Backlog

These topic names are a planned backlog, not current sidebar navigation entries. The parent groups may remain in the active IA, but the exact items listed below are owner notes for future writing until they are ready to become navigable pages.

- AI Capabilities / Video & Audio Generation
  - Video Generation
  - TTS
  - Voice Clone
  - Music Generation
- Basic Workflows / Video Workflows
  - FramePack
  - FramePack One Frame Inference
- Basic Workflows / LLM / MLLM
  - Qwen 3 VL

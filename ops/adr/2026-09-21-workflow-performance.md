# ADR: Workflow Performance Reference

- Status: Accepted
- Date: 2026-09-21

## Context

- Workflowごとの処理負荷と、実際に動作確認したGPU・RAM・実行時間を、本文を大きく増やさず参考情報として示したい。
- 厳密なbenchmarkではなく、CUDA、PyTorch、driver、起動引数などは管理対象にしない。
- 既存UIには単独のWorkflow JSON行と、複数JSONを切り替える `workflowPicker` がある。

## Decision

1. Performance情報があるWorkflowだけ、Copy・Downloadと同じaction列に3段階の半円meterを表示する。
2. Levelは記事作者が1〜3で指定し、自動計算しない。Levelの基準は現時点では定義しない。
3. meterのhover、keyboard focus、tapで小型popupを表示する。Copy・Downloadと同様に機能を識別できるよう、popup上端にはlocalizedされたPerformance labelを控えめに表示する。popupは既存の単色tokenを使い、警告色は使わない。
4. 1件の動作確認結果は `gpu`、`ram`、`time` と任意の `tags` を持つ。複数結果を登録できる。
5. 記事では既存のWorkflowリンクを変えず、front matterへ必要なWorkflowだけ追加する。

```yaml
workflowPerformance:
  example.json:
    level: 2
    runs:
      - { gpu: "RTX 4070 Ti 12GB", ram: "DDR5 64GB", time: "51s", tags: [Sage] }
      - { gpu: "RTX 4090 24GB", ram: "DDR5 32GB", time: "22s" }
```

6. keyは通常ファイル名を使い、同一ページ内でbasenameが衝突する場合だけWorkflowのpathを使えるようにする。
7. `workflowPicker` は選択中のWorkflowに合わせてLevelとpopup内容を切り替える。選択中のWorkflowにPerformance情報がなければmeter全体を隠す。
8. Performance未設定の既存Workflowは現在のHTMLと表示を維持する。
9. 実行時間は計測値を秒単位で切り上げる。10分未満は整数の秒数（例: `120.14s` → `121s`）、10分以上は空白なしの `XmSSs` とし、秒を2桁に揃える（例: `601.2s` → `10m02s`）。
10. 生成サイズは速度への影響が大きいため、分かる場合は任意の `tags` に `1MP`、`2MP`、`4MP` のような短い概算表記で記録する。正確な縦横pixel数ではpopupが横長になるため、専用fieldは追加しない。

## Consequences

- 記事作者が追加する概念は `level`、`gpu`、`ram`、`time`、任意の `tags` に限られる。
- Performance情報は参考値であり、GPU間のranking、平均、filter、自動Level算出には使わない。
- popupとpicker追従には小さなESM initializerとPlaywright coverageが必要になる。

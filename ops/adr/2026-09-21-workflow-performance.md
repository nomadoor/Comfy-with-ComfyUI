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
5. Performance情報は対象のWorkflow JSONと同じ場所に書く。単独Workflowは通常のMarkdownリンクを `workflow` shortcodeへ置き換え、front matterには記録しない。

```njk
{% workflow "/workflows/.../example.json",
  level=2,
  gpu="RTX 4070 Ti 12GB",
  ram="DDR5 64GB",
  time="51s",
  tags=["Sage"]
%}
```

6. 複数環境では同じshortcodeへ `runs` 配列を渡す。`workflowPicker` では対象pathを `file` と同じPerformance fieldを持つobjectに置き換え、選択中のWorkflowに合わせてLevelとpopup内容を切り替える。選択中のWorkflowにPerformance情報がなければmeter全体を隠す。
7. Performance未設定の既存Workflowは通常のMarkdownリンクまたはpath文字列のままとし、現在のHTMLと表示を維持する。
8. 実行時間は計測値を秒単位で切り上げる。10分未満は整数の秒数（例: `120.14s` → `121s`）、10分以上は空白なしの `XmSSs` とし、秒を2桁に揃える（例: `601.2s` → `10m02s`）。
9. 生成サイズは速度への影響が大きいため、分かる場合は任意の `tags` に `1MP`、`2MP`、`4MP` のような短い概算表記で記録する。正確な縦横pixel数ではpopupが横長になるため、専用fieldは追加しない。

## Consequences

- 記事作者が追加する概念は `level`、`gpu`、`ram`、`time`、任意の `tags` に限られる。
- Workflow pathとPerformance情報が同じ記述にまとまり、記事内で追加・削除しても対応関係がずれない。
- Performance情報は参考値であり、GPU間のranking、平均、filter、自動Level算出には使わない。
- popupとpicker追従には小さなESM initializerとPlaywright coverageが必要になる。

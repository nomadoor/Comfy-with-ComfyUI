# Engineering workflow

## Language

- Project prose language: Japanese
- AI専用の指示は英語で書く。schema、identifier、template heading、tool keyword、canonical termも英語を維持する。
- 人が確認するリポジトリ文書、ADR、commit、PRの説明文は日本語で書く。

## Local workflow

1. リポジトリを変更する前に、default branchから専用のwork branchを作る。
2. 新機能や挙動変更では、関連する `/ops`、ADR、既存実装、prior artを確認し、実現する挙動をローカルの仕様として明文化する。
3. 仕様公開やGitHub Issuesは既定の工程に含めない。複数セッションにまたがる作業は `AGENT_STATE.md` と必要な `/ops` 文書で引き継ぐ。
4. domain文書の承認は、承認されたglossaryまたはADRの変更だけを許可する。
5. `GO` は実装、テスト、内部レビュー、安全な修正を許可するが、commitは許可しない。
6. 新しい挙動とbug fixは、公開されたtest seamでのTDDを基本とする。文書、コメント、挙動を変えない機械的変更、生成物、外部設定は例外にできる。
7. commit前に、承認された要件、関連するdomain文書、完全な未commit差分、検証結果を使って、別のread-only AI reviewを行う。
8. findingはP0/P1/P2/P3で扱い、P0/P1はcommitを止める。修正後は再reviewする。
9. commitには、差分と検証結果を提示したうえで明示承認を得る。
10. pushとPR作成にはcommitとは別の明示承認を得る。PRは既定でDraftとし、CI成功後にオーナー承認を得てReadyへ変更する。
11. mergeは初期の作業許可に含めない。

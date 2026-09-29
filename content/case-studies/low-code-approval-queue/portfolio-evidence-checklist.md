# Portfolio evidence checklist：把 prototype 變成可追問的作品

**狀態：`僅限內部草稿`**

**原則：** 只展示你真正做過、可重跑、沒有敏感資料的 evidence。不要虛構企業採用、節省成本、真實客戶成效或 production readiness。

## README 開首應先回答的四件事

- [ ] 誰遇到甚麼小而明確的決定困難？
- [ ] 為甚麼 baseline（手動搜尋／規則）不足，而不是只說「我想用 AI」？
- [ ] 系統能做甚麼、絕對不能做甚麼？
- [ ] 哪一位人手 reviewer 對最後決定負責？

## 可檢查的 evidence pack

| Evidence | 最小內容 | 面試時能證明甚麼 |
| --- | --- | --- |
| Problem brief | 使用者、決定、錯誤代價、non-goal | 你由問題開始，不是由模型名開始。 |
| Data card | corpus 是合成／公開批准、版本、禁止欄位 | 你懂資料邊界和 provenance。 |
| Action contract | input、output、允許來源、禁止動作、人手 owner | 你能說清權限，不只靠 prompt。 |
| Baseline note | 手動或規則式做法，及它的限制 | 你知道 AI 是否真的必要。 |
| Acceptance-test results | 全套 case、expected／actual、error tags | 你有 evaluation，而不是只做 happy path demo。 |
| Error taxonomy | 失敗類別、出現條件、修復前後差異 | 你會從失敗學習。 |
| Architecture sketch | input check、retrieval、citation check、review gate | 你能解釋每一個元件的理由。 |
| Redacted trace schema | case ID、版本、status、FAQ IDs、error tag | 你理解 observability 但不洩漏原文。 |
| Risk register | 高風險 failure、control、owner、stop condition | 你知道甚麼時候不能讓系統繼續。 |
| Human-review runbook | reviewer 檢查次序與可作決定 | 你把 human-in-the-loop 做成流程。 |
| Demo script | 一個正常 case、一個 handoff、一次 blocked | 你願意展示 failure boundary。 |
| Limitations section | synthetic-only、未連外、未證明真實成效 | 你不誇大作品的能力。 |

## 面試中的三條可驗證敘事

不要背工具清單。用 artefact 講選擇：

1. **「我先收窄 action。」** 我把需求限定為引用支持的草稿；所有外部行動仍由人決定。
2. **「我把不確定變成測試。」** 我預先寫了無答案、衝突、過期、region 不符、prompt injection 和禁止動作的 expected behaviour。
3. **「我把失敗留下來。」** 我保存 case ID、版本、error tag 和 reviewer decision；一個漂亮輸出不能掩蓋越權或錯引。

## 上傳／展示前的最後檢查

- [ ] repository、README、screenshot、video 和 PDF 沒有真實姓名、公司、客戶、帳戶、對話、內部文件或可拼湊身份的組合資料；
- [ ] 沒有 API key、token、URL secret、private prompt 或可使用的 connector 設定；
- [ ] 所有數字都標示為合成測試結果，或乾脆不展示；
- [ ] 懂得講一個真正 fail 的例子及其限制；
- [ ] 不把本地 sandbox 說成已部署、已被採用、已省錢或已安全合規；
- [ ] 對外分享前，仍先取得負責人批准。

## 延伸閱讀

- [由模糊需求到可驗收功能](/zh-HK/articles/from-vague-request-to-accepted-feature)
- [非工程師也可驗收的 AI 自動化流程](/zh-HK/articles/build-a-low-code-ai-automation)
- [PolicyPilot：把 RAG demo 變成作品證據](/zh-HK/articles/enterprise-ai-portfolio-policy-pilot)

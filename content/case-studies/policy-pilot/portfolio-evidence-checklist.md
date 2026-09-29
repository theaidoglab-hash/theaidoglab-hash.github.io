# Portfolio evidence checklist — PolicyPilot

**狀態：僅限內部草稿｜只展示你真正完成並可說明的部分。**

## 作品頁最小證據

- [ ] 用一句話寫出使用者工作與 business boundary，而不是只寫「我做了一個 RAG chatbot」。
- [ ] 展示合成資料的來源規則、版本和禁止資料類型。
- [ ] 展示 keyword baseline、候選設計與為何比較它們。
- [ ] 展示 evaluation set 的類型、release gate 和一個真實失敗例子。
- [ ] 展示拒答／交接流程，並解釋為何沒有連接寫入工具。
- [ ] 展示最小 architecture：資料準備、retrieval、response routing、trace、人工決定。
- [ ] 展示如何停用、撤回版本和重跑 evaluation。

## 不可誇大的聲明

| 可以誠實說 | 不應聲稱 |
| --- | --- |
| 「我在合成 holdout set 上量度了 citation 與 routing。」 | 「這會提升真實客服 KPI。」 |
| 「我設計了不執行任何外部行動的 boundary。」 | 「這是 enterprise-ready autonomous agent。」 |
| 「我發現某些情境需要人手交接。」 | 「模型可以可靠取代客服判斷。」 |
| 「這是可重跑的本地學習 prototype。」 | 「已有真實客戶或公司採用。」 |

## 面試可追問問題

1. 為何先做 keyword baseline？甚麼結果才值得加入 semantic retrieval？
2. 怎樣分開 retrieval 錯誤、grounding 錯誤與 routing 錯誤？
3. 哪一種錯誤令你停止 release，即使整體平均分不錯？
4. 為何拒絕連接退款／改單工具？日後若真的要接，還缺甚麼控制？
5. 若政策版本更新，你如何避免舊答案悄悄繼續出現？

## 兩分鐘 demo 結構

1. 說明虛構問題與不做甚麼（20 秒）。
2. 展示一個有引用的正常情境（30 秒）。
3. 展示一個無答案、衝突或 injection 情境如何交接（30 秒）。
4. 展示 evaluation report 的一項失敗與你的修正決定（25 秒）。
5. 總結這如何證明工程判斷，而非把它稱作生產系統（15 秒）。

## 交付前自問

讀者能否分辨「我實際建了甚麼」、「我只是假設甚麼」和「系統明確不能做甚麼」？若不能，先修正敘述、證據或範圍，再展示作品。


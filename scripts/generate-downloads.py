from pathlib import Path
import sys
import json
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
INTERVIEW_QUESTION_COUNT = len(json.loads((ROOT / "content" / "interview-question-metadata.json").read_text(encoding="utf-8"))["questions"])
FONT = r"C:\Windows\Fonts\NotoSansTC-VF.ttf"
pdfmetrics.registerFont(TTFont("Noto", FONT))
pdfmetrics.registerFont(TTFont("NotoSC", r"C:\Windows\Fonts\msyh.ttc", subfontIndex=0))

DATA = {
 "role-route": {
  "zh-HK": ("AI Engineering 職位比較工作表", "用三份真實 JD 搵出重複出現嘅交付同證據缺口。", ["目標職位同基本資格", "最常出現嘅責任動詞", "主要交付物", "我已有嘅可檢查證據", "最小可驗證嘅 project", "唔符合／停止條件"]),
  "zh-TW": ("AI Engineering 職缺比較工作表", "用三份真實 JD 找出重複的交付項目與證據缺口。", ["目標職務與基本資格", "最常出現的職責動詞", "主要交付項目", "我已有的可檢查證據", "最小可驗證 project", "不符合／停止條件"]),
  "zh-Hans": ("AI Engineering 职位比较 Worksheet", "用三份真实 JD 找出重复的交付与证据缺口。", ["目标职位与基本资格", "最常出现的职责动词", "主要交付物", "已有的可检查证据", "最小可验证项目", "不符合／停止条件"]),
  "en": ("AI Engineering Role Comparison", "Use three real job descriptions to find recurring deliverables and evidence gaps.", ["Target role and eligibility", "Recurring responsibility verbs", "Primary deliverable", "Evidence I can show", "Smallest verifiable project", "Mismatch / stop condition"]),
 },
 "rag-evidence": {
  "zh-HK": ("RAG 作品證據檢查表", "將一個跑得起嘅 demo，補成經得起追問嘅工程證據。", ["要解決嘅業務問題同使用者", "資料來源、更新方法同 data card", "固定評估題組同 baseline", "無答案、權限同 prompt injection 情況", "失敗處理、trace 同成本", "README、重跑同部署方法"]),
  "zh-TW": ("RAG 作品集證據檢查表", "把可執行的 demo 補成可追問的工程證據。", ["Business problem 與使用者", "資料來源、更新與 data card", "固定 evaluation set 與 baseline", "無答案、權限與 injection cases", "Failure handling、trace 與成本", "README、重跑與部署方法"]),
  "zh-Hans": ("RAG Portfolio Evidence Checklist", "把可运行 demo 补成可追问的工程证据。", ["业务问题与用户", "数据来源、更新与 data card", "固定 evaluation set 与 baseline", "无答案、权限与 injection cases", "失败处理、trace 与成本", "README、重跑与部署方法"]),
  "en": ("RAG Portfolio Evidence Checklist", "Turn a working demo into engineering evidence that survives follow-up.", ["Business problem and user", "Data source, updates and data card", "Fixed evaluation set and baseline", "No-answer, permission and injection cases", "Failure handling, traces and cost", "README, reproduction and deployment"]),
 },
 "professional-workflow": {
  "zh-HK": ("專業 AI 工作流程範本", "寫 code 前，先定清問題、範圍、驗收、失敗處理同審批。", ["問題同受影響嘅使用者", "輸入、輸出同禁止動作", "驗收準則", "工作項目同完成條件", "測試矩陣同失敗情況", "人手審批、rollback 同 ADR"]),
  "zh-TW": ("Professional AI Workflow 範本", "Coding 前先確定 problem、scope、acceptance、failure 與 approval。", ["Problem 與受影響使用者", "輸入、輸出與禁止動作", "Acceptance criteria", "Tickets 與完成條件", "Test matrix 與 failure cases", "Human approval、rollback 與 ADR"]),
  "zh-Hans": ("Professional AI Workflow Template", "编码前先固定 problem、scope、acceptance、failure 与 approval。", ["问题与受影响用户", "输入、输出与禁止动作", "Acceptance criteria", "Tickets 与完成条件", "Test matrix 与 failure cases", "Human approval、rollback 与 ADR"]),
  "en": ("Professional AI Workflow Template", "Fix the problem, scope, acceptance, failure and approval before coding.", ["Problem and affected user", "Inputs, outputs and prohibited actions", "Acceptance criteria", "Tickets and completion conditions", "Test matrix and failure cases", "Human approval, rollback and ADR"]),
 },
 "prompt-evidence": {
  "zh-HK": ("Prompt 實驗紀錄", "每次只改一項主要變數，成功同失敗都留低。", ["問題同 prompt 版本", "模型、設定同 input 類型", "預期行為", "固定 test cases", "工具讀取／寫入權限", "結果、失敗同人手決定"]),
  "zh-TW": ("Prompt 實驗紀錄", "每次只改一個主要變數，保留成功與失敗。", ["Problem 與 prompt version", "Model、config 與 input class", "Expected behaviour", "固定 test cases", "Tool read／write 權限", "Result、failure 與 human decision"]),
  "zh-Hans": ("Prompt Experiment Log", "每次只修改一个主要变量，同时保留成功与失败。", ["问题与 prompt version", "Model、config 与 input class", "Expected behaviour", "固定 test cases", "Tool read／write 权限", "Result、failure 与 human decision"]),
  "en": ("Prompt Experiment Log", "Change one major variable at a time and preserve both success and failure.", ["Problem and prompt version", "Model, config and input class", "Expected behaviour", "Fixed test cases", "Tool read/write permissions", "Result, failure and human decision"]),
 },
 "opportunity-scorecard": {
  "zh-HK": ("AI 機會評分表", "每項 0–2 分；最多比較三個機會，然後揀一個。", ["同目標角色嘅相關性", "可帶走嘅具體輸出", "合作、mentor 或 feedback", "時間同金錢成本", "資格、私隱同公開權利", "停止條件"]),
  "zh-TW": ("AI 機會評分表", "每項 0–2 分；最多比較三個機會，再只選一個。", ["與目標職務的相關性", "可保留的具體產出", "合作、mentor 或 feedback", "時間與金錢成本", "資格、隱私與公開權利", "停止條件"]),
  "zh-Hans": ("AI Opportunity Scorecard", "每项 0–2 分；最多比较三个机会，然后只选一个。", ["与目标职位的相关性", "可以保留的具体产出", "合作、mentor 或 feedback", "时间与金钱成本", "资格、隐私与公开权利", "停止条件"]),
  "en": ("AI Opportunity Scorecard", "Score each item 0–2. Compare no more than three opportunities, then choose one.", ["Target-role relevance", "Tangible output you retain", "Collaboration, mentor or feedback", "Time and financial cost", "Eligibility, privacy and publication rights", "Stop condition"]),
 },
 "interview-map": {
  "zh-HK": ("AI Engineer 面試閱讀路線", "按目標角色揀一條問題，補返機制、取捨、失敗邊界同證據。", ["目標角色同第一條要練嘅問題", "你嘅 90 秒初稿", "答案背後嘅機制同關鍵詞", "用一個具體情境確認自己明白咗", "作品或工作例子入面可留低嘅證據", "失敗邊界同下一個練習方向"]),
  "zh-TW": ("AI Engineer 面試閱讀路線", "先從目標職務選一題，再補機制、取捨、失敗邊界與證據。", ["目標職務與第一題要練的問題", "你的 90 秒初稿", "答案背後的機制與關鍵詞", "用一個具體情境確認理解", "作品或工作例子可留下的證據", "失敗邊界與下一個練習方向"]),
  "zh-Hans": ("AI Engineer 面试阅读路线", "先从目标职位选一道题，再补机制、取舍、失败边界和证据。", ["目标职位与第一道要练的问题", "你的 90 秒初稿", "答案背后的机制与关键词", "用一个具体情境确认理解", "作品或工作例子可留下的证据", "失败边界与下一个练习方向"]),
  "en": ("AI Engineer Interview Reading Route", "Pick one question from the target role, then work through the mechanism, trade-off, failure boundary and evidence.", ["Target role and first question to practise", "Your 90-second first draft", "Mechanism and terms behind the answer", "One concrete situation that checks understanding", "Evidence from a project or work example", "Failure boundary and next practice direction"]),
 },
 "interview-practice-cards": {
  "zh-HK": (f"AI Engineer：{INTERVIEW_QUESTION_COUNT} 條可獨立練習嘅問題", "每次只練一條問題，講清機制、取捨同可以展示嘅證據。", ["呢條問題嘅使用者或系統情境", "你嘅第一個 90 秒答案", "機制、術語同因果關係", "較簡單嘅 baseline 同失敗邊界", "可展示嘅 project artefact", "下一條相連問題"]),
  "zh-TW": (f"AI Engineer {INTERVIEW_QUESTION_COUNT} 條獨立練習問題", "每次只練一題，從機制、取捨走到可展示的證據。", ["這題的使用者或系統情境", "你的第一個 90 秒答案", "機制、術語與因果關係", "更簡單 baseline 與失敗邊界", "可展示的 project artefact", "下一題相鄰問題"]),
  "zh-Hans": (f"AI Engineer {INTERVIEW_QUESTION_COUNT} 条独立练习问题", "每次只练一道题，从机制、取舍走到可展示的证据。", ["这道题的用户或系统情境", "你的第一个 90 秒答案", "机制、术语与因果关系", "更简单 baseline 与失败边界", "可展示的 project artefact", "下一道相邻问题"]),
  "en": (f"AI Engineer Interview Lab: {INTERVIEW_QUESTION_COUNT} Standalone Practice Questions", "Practise one question at a time, moving from the mechanism and trade-off to evidence you can show.", ["User or system situation for this question", "Your first 90-second answer", "Mechanism, terms and causal link", "Simpler baseline and failure boundary", "Project artefact you can show", "Next adjacent question"]),
 },
 "ai-batch-worker-reliability": {
  "zh-HK": ("AI Batch Worker Reliability Worksheet", "用合成資料檢查 serial queue、retry、terminal idempotency 和 budget stop。", ["虛構 record、source version 和 idempotency key", "Serial queue 上限、cost cap 和不做的 action", "Success、429、timeout、invalid、capacity、duplicate 的 expected route", "Run ID、job trace、attempt ID 和 checkpoint", "Dead-letter review owner、repair policy 和新 identity", "不會聲稱的 production 或 business 結果"]),
  "zh-TW": ("AI Batch Worker Reliability Worksheet", "用合成資料檢查 serial queue、retry、terminal idempotency 與 budget stop。", ["虛構 record、source version 與 idempotency key", "Serial queue 上限、cost cap 與不做的 action", "Success、429、timeout、invalid、capacity、duplicate 的 expected route", "Run ID、job trace、attempt ID 與 checkpoint", "Dead-letter review owner、repair policy 與新 identity", "不會聲稱的 production 或 business 結果"]),
  "zh-Hans": ("AI Batch Worker Reliability Worksheet", "用合成数据检查 serial queue、retry、terminal idempotency 和 budget stop。", ["虚构 record、source version 和 idempotency key", "Serial queue 上限、cost cap 和不做的 action", "Success、429、timeout、invalid、capacity、duplicate 的 expected route", "Run ID、job trace、attempt ID 和 checkpoint", "Dead-letter review owner、repair policy 和新 identity", "不会声称的 production 或 business 结果"]),
  "en": ("AI Batch Worker Reliability Worksheet", "Use synthetic data to inspect a serial queue, retry, terminal idempotency and a budget stop.", ["Fictional record, source version and idempotency key", "Serial queue limit, cost cap and actions that stay out of scope", "Expected route for success, 429, timeout, invalid, capacity and duplicate", "Run ID, job trace, attempt ID and checkpoint", "Dead-letter review owner, repair policy and new identity", "Production or business outcomes not claimed"]),
 },
 "policy-pilot": {
  "zh-HK": ("PolicyPilot Portfolio Plan", "把虛構政策 assistant 做成可量度、可交接的 portfolio 證據。", ["Business problem、user 與 non-goal", "合成資料、data boundary 與 baseline", "Architecture、citation 與 human handoff", "Quality、safety、operations 與 business proxy", "Trace、CI、rollback 與 decision log", "README、demo 與面試可追問證據"]),
  "zh-TW": ("PolicyPilot Portfolio Plan", "把虛構政策 assistant 做成可衡量、可交接的 portfolio 證據。", ["Business problem、user 與 non-goal", "合成資料、data boundary 與 baseline", "Architecture、citation 與 human handoff", "Quality、safety、operations 與 business proxy", "Trace、CI、rollback 與 decision log", "README、demo 與面試可追問證據"]),
  "zh-Hans": ("PolicyPilot Portfolio Plan", "把虚构政策 assistant 做成可衡量、可交接的 portfolio 证据。", ["Business problem、user 与 non-goal", "合成数据、data boundary 与 baseline", "Architecture、citation 与 human handoff", "Quality、safety、operations 与 business proxy", "Trace、CI、rollback 与 decision log", "README、demo 与面试可追问证据"]),
  "en": ("PolicyPilot Portfolio Plan", "Turn a fictional policy assistant into measurable, hand-off-ready portfolio evidence.", ["Business problem, user and non-goal", "Synthetic data, data boundary and baseline", "Architecture, citations and human handoff", "Quality, safety, operations and business proxy", "Trace, CI, rollback and decision log", "README, demo and interview-ready evidence"]),
 },
 "renewal-triage-mlops": {
  "zh-HK": ("Renewal Triage ML 決策證據冊", "由合成 snapshot 建立一條可重跑、可交代的 human review queue。", ["決定、review capacity 與禁止動作", "prediction-time 資料、label timing 與洩漏檢查", "簡單 baseline、candidate 與可重跑設定", "model metric、queue metric 與合成 workflow proxy", "temporal holdout、release gate 與 human owner", "monitoring、rollback 與不可聲稱的業務結果"]),
  "zh-TW": ("Renewal Triage ML 決策證據冊", "從合成 snapshot 建立一條可重跑、可交代的人工 review queue。", ["決定、review capacity 與禁止動作", "prediction-time 資料、label timing 與洩漏檢查", "簡單 baseline、candidate 與可重跑設定", "model metric、queue metric 與合成 workflow proxy", "temporal holdout、release gate 與 human owner", "monitoring、rollback 與不可聲稱的業務結果"]),
  "zh-Hans": ("Renewal Triage ML 决策证据册", "从合成 snapshot 建立一条可重跑、可交代的人工 review queue。", ["决定、review capacity 与禁止动作", "prediction-time 数据、label timing 与泄漏检查", "简单 baseline、candidate 与可重跑设置", "model metric、queue metric 与合成 workflow proxy", "temporal holdout、release gate 与 human owner", "monitoring、rollback 与不可声称的业务结果"]),
  "en": ("Renewal Triage ML Decision Evidence Book", "Build a rerunnable, accountable human-review queue from synthetic snapshots.", ["Decision, review capacity and prohibited actions", "Prediction-time data, label timing and leakage checks", "Simple baseline, candidate and rerunnable configuration", "Model metric, queue metric and synthetic workflow proxy", "Temporal holdout, release gate and human owner", "Monitoring, rollback and business outcomes you cannot claim"]),
 },
 "course-to-portfolio-evidence": {
  "zh-HK": ("Tutorial 到 Portfolio 證據冊", "將一個已選學習練習，變成可追溯、可重跑、可誠實解釋的工程證據。", ["Source receipt：URL、版本、條款與重用邊界", "使用者決定、資料邊界與 non-goal", "複製內容、自己改動與簡單 baseline", "固定 evaluation cases、failure 與停止條件", "重跑指引、版本、seed 與個人貢獻", "五分鐘答辯與不可聲稱的成效"]),
  "zh-TW": ("Tutorial 到 Portfolio 證據冊", "將一個已選學習練習，變成可追溯、可重跑、可誠實解釋的工程證據。", ["Source receipt：URL、版本、條款與重用邊界", "使用者決定、資料邊界與 non-goal", "複製內容、自己改動與簡單 baseline", "固定 evaluation cases、failure 與停止條件", "重跑指引、版本、seed 與個人貢獻", "五分鐘答辯與不可聲稱的成效"]),
  "zh-Hans": ("Tutorial 到 Portfolio 证据册", "将一个已选学习练习，变成可追溯、可重跑、可诚实解释的工程证据。", ["Source receipt：URL、版本、条款与重用边界", "用户决定、数据边界与 non-goal", "复制内容、自己改动与简单 baseline", "固定 evaluation cases、failure 与停止条件", "重跑指引、版本、seed 与个人贡献", "五分钟答辩与不可声称的成效"]),
  "en": ("Tutorial to Portfolio Evidence Book", "Turn one chosen learning exercise into traceable, rerunnable engineering evidence you can explain honestly.", ["Source receipt: URL, version, terms and reuse boundary", "User decision, data boundary and non-goal", "Copied input, deliberate change and simple baseline", "Fixed evaluation cases, failure and stop condition", "Rerun instructions, version, seed and individual contribution", "Five-minute defence and outcomes you cannot claim"]),
 },
 "low-code-automation": {
  "zh-HK": ("低程式 AI 自動化驗收表", "在讓任何工具行動前，先固定範圍、examples、權限和人手關卡。", ["使用者、input、output 與成功條件", "禁止動作與資料邊界", "Baseline 與 expected examples", "Test cases、failure types 與 trace", "Human approval gate 與停止條件", "下一次改動與可重跑證據"]),
  "zh-TW": ("低程式 AI 自動化驗收表", "在讓任何工具行動前，先確定範圍、examples、權限和人工關卡。", ["使用者、input、output 與成功條件", "禁止動作與資料邊界", "Baseline 與 expected examples", "Test cases、failure types 與 trace", "Human approval gate 與停止條件", "下一次改動與可重跑證據"]),
  "zh-Hans": ("低代码 AI 自动化验收表", "在让任何工具行动前，先确定范围、examples、权限和人工关卡。", ["用户、input、output 与成功条件", "禁止动作与数据边界", "Baseline 与 expected examples", "Test cases、failure types 与 trace", "Human approval gate 与停止条件", "下一次改动与可重跑证据"]),
  "en": ("Low-code AI Automation Acceptance Sheet", "Fix scope, examples, permissions and human gates before any tool is allowed to act.", ["User, input, output and success condition", "Prohibited actions and data boundary", "Baseline and expected examples", "Test cases, failure types and trace", "Human approval gate and stop condition", "Next change and rerunnable evidence"]),
 },
 "coding-agent-review-loop": {
  "zh-HK": ("Coding Agent 驗收與 Review Worksheet", "先看計劃、測試、diff 和風險，才接受任何 AI demo。", ["可逆的 user outcome 與 non-goal", "Agent plan、檔案範圍與不會觸及的資料", "Prewritten acceptance cases 與禁止動作", "Diff、test command 與 expected / actual results", "Permission、sandbox、external action 與 human approval", "PASS、REVISE 或 STOP 的 reviewer decision"]),
  "zh-TW": ("Coding Agent 驗收與 Review Worksheet", "先看計畫、測試、diff 與風險，才接受任何 AI demo。", ["可逆的 user outcome 與 non-goal", "Agent plan、檔案範圍與不會觸及的資料", "Prewritten acceptance cases 與禁止動作", "Diff、test command 與 expected / actual results", "Permission、sandbox、external action 與 human approval", "PASS、REVISE 或 STOP 的 reviewer decision"]),
  "zh-Hans": ("Coding Agent 验收与 Review Worksheet", "先看计划、测试、diff 与风险，才接受任何 AI demo。", ["可逆的 user outcome 与 non-goal", "Agent plan、文件范围与不会触及的数据", "Prewritten acceptance cases 与禁止动作", "Diff、test command 与 expected / actual results", "Permission、sandbox、external action 与 human approval", "PASS、REVISE 或 STOP 的 reviewer decision"]),
  "en": ("Coding Agent Review Worksheet", "Inspect the plan, tests, diff and risks before accepting any AI demo.", ["Reversible user outcome and non-goal", "Agent plan, file scope and data it will not touch", "Prewritten acceptance cases and prohibited actions", "Diff, test command and expected versus actual results", "Permissions, sandbox, external action and human approval", "PASS, REVISE or STOP reviewer decision"]),
 },
 "portfolio-evidence-rubric": {
  "zh-HK": ("Portfolio 證據評分表", "用六個維度分辨一個流暢 demo 與一個可被追問的端到端案例。", ["問題、使用者與錯誤代價", "技術 baseline 與資料邊界", "Technical demonstration evidence", "Business、delivery 與 risk evidence", "Fixed evaluation、failure record 與 human owner", "GitHub README、non-claims 與下一個最小改動"]),
  "zh-TW": ("Portfolio 證據評分表", "用六個維度分辨一個流暢 demo 與一個可被追問的端到端案例。", ["問題、使用者與錯誤代價", "技術 baseline 與資料邊界", "Technical demonstration evidence", "Business、delivery 與 risk evidence", "Fixed evaluation、failure record 與 human owner", "GitHub README、non-claims 與下一個最小改動"]),
  "zh-Hans": ("Portfolio 证据评分表", "用六个维度分辨一个流畅 demo 与一个可被追问的端到端案例。", ["问题、用户与错误代价", "技术 baseline 与数据边界", "Technical demonstration evidence", "Business、delivery 与 risk evidence", "Fixed evaluation、failure record 与 human owner", "GitHub README、non-claims 与下一个最小改动"]),
  "en": ("Portfolio Evidence Rubric", "Use six dimensions to distinguish a fluent demo from an end-to-end case that can survive follow-up.", ["Problem, user and cost of error", "Technical baseline and data boundary", "Technical demonstration evidence", "Business, delivery and risk evidence", "Fixed evaluation, failure record and human owner", "GitHub README, nonclaims and next smallest change"]),
 },
 "learning-to-evidence-sprint": {
  "zh-HK": ("八星期學習到證據 Sprint", "將任何 AI 課程或 tutorial 變成一條有 business case、evaluation 和 GitHub 證據的學習路線。", ["目標角色與單一 evidence gap", "虛構 business case、使用者與 non-goal", "Baseline、合成／公開資料與資料邊界", "Technical work 與 non-technical delivery work", "Evaluation、failure record、version 與 rerun", "README、eight-week review 與 stop condition"]),
  "zh-TW": ("八週學習到證據 Sprint", "將任何 AI 課程或 tutorial 變成一條有 business case、evaluation 和 GitHub 證據的學習路線。", ["目標職務與單一 evidence gap", "虛構 business case、使用者與 non-goal", "Baseline、合成／公開資料與資料邊界", "Technical work 與 non-technical delivery work", "Evaluation、failure record、version 與 rerun", "README、eight-week review 與 stop condition"]),
  "zh-Hans": ("八周学习到证据 Sprint", "将任何 AI 课程或 tutorial 变成一条有 business case、evaluation 和 GitHub 证据的学习路线。", ["目标职位与单一 evidence gap", "虚构 business case、用户与 non-goal", "Baseline、合成／公开数据与数据边界", "Technical work 与 non-technical delivery work", "Evaluation、failure record、version 与 rerun", "README、eight-week review 与 stop condition"]),
  "en": ("Eight-Week Learning-to-Evidence Sprint", "Turn any AI course or tutorial into a learning path with a business case, evaluation and GitHub evidence.", ["Target role and one evidence gap", "Fictional business case, user and non-goal", "Baseline, synthetic or public data and data boundary", "Technical work and non-technical delivery work", "Evaluation, failure record, version and rerun", "README, eight-week review and stop condition"]),
 },
 "learning-evidence": {
  "zh-HK": ("AI 學習證據計劃", "在報課前決定能力缺口、可帶走 artefact、feedback 和停止條件。", ["目標角色與單一能力缺口", "完成後可公開的 artefact", "課程或來源如何提供 feedback", "八週 evidence plan", "時間、金錢與更新成本", "停止條件與下一個較小單位"]),
  "zh-TW": ("AI 學習證據計畫", "在報課前決定能力缺口、可帶走 artefact、feedback 和停止條件。", ["目標職務與單一能力缺口", "完成後可公開的 artefact", "課程或來源如何提供 feedback", "八週 evidence plan", "時間、金錢與更新成本", "停止條件與下一個較小單位"]),
  "zh-Hans": ("AI 学习证据计划", "在报课前决定能力缺口、可带走 artefact、feedback 和停止条件。", ["目标职位与单一能力缺口", "完成后可公开的 artefact", "课程或来源如何提供 feedback", "八周 evidence plan", "时间、金钱与更新成本", "停止条件与下一个较小单位"]),
  "en": ("AI Learning Evidence Plan", "Choose a capability gap, retained artefact, feedback path and stop condition before enrolling.", ["Target role and one capability gap", "Public artefact retained after completion", "How the source provides feedback", "Eight-week evidence plan", "Time, money and update cost", "Stop condition and next smaller unit"]),
 },
 "non-coder-ai-workflow": {
  "zh-HK": ("不寫 Code 用 AI：驗收工作流程表", "把一項低風險整理工作做成可核對、可停止、有人負責的 draft-only 流程。", ["使用者、決定和不做甚麼", "合成／公開輸入資料與 schema", "固定輸出、source ID 和 route", "Baseline 與 acceptance cases", "禁止 action、資料邊界與人手關卡", "結果、failure、reviewer decision 和下一步"]),
  "zh-TW": ("不寫 Code 用 AI：驗收工作流程表", "把一項低風險整理工作做成可核對、可停止、有人負責的 draft-only 流程。", ["使用者、決定與不做什麼", "合成／公開輸入資料與 schema", "固定輸出、source ID 與 route", "Baseline 與 acceptance cases", "禁止 action、資料邊界與人工關卡", "結果、failure、reviewer decision 與下一步"]),
  "zh-Hans": ("不写 Code 用 AI：验收工作流程表", "把一项低风险整理工作做成可核对、可停止、有人负责的 draft-only 流程。", ["用户、决定与不做什么", "合成／公开输入数据与 schema", "固定输出、source ID 与 route", "Baseline 与 acceptance cases", "禁止 action、数据边界与人工关卡", "结果、failure、reviewer decision 与下一步"]),
  "en": ("AI without Code: Workflow Acceptance Sheet", "Turn one low-risk organisation task into a checkable, stoppable, draft-only workflow with a named human owner.", ["User, decision and non-goal", "Synthetic or public inputs and schema", "Fixed output, source IDs and route", "Baseline and acceptance cases", "Prohibited actions, data boundary and human gate", "Results, failures, reviewer decision and next step"]),
 },
 "ai-agent-permission-review": {
  "zh-HK": ("AI Agent Permission Review Worksheet", "未按 Allow 前，先記下 target、scope、effect、reversibility 和 human owner。", ["虛構使用者、草稿決定和 non-goal", "Disposable workspace、public／synthetic source manifest 和不可進入的資料", "讀檔、改檔、network、account 和 external-action capability map", "每個 request 的 target、scope、expected effect 和 reversibility", "Permission receipt：ALLOW ONCE、DENY／BLOCKED、reviewer 和 observed result", "Fixed cases、STOP condition、portfolio evidence 和不可聲稱的結果"]),
  "zh-TW": ("AI Agent Permission Review Worksheet", "未按 Allow 前，先記下 target、scope、effect、reversibility 與 human owner。", ["虛構使用者、草稿決策與 non-goal", "Disposable workspace、public／synthetic source manifest 與不可進入的資料", "讀檔、改檔、network、account 與 external-action capability map", "每個 request 的 target、scope、expected effect 與 reversibility", "Permission receipt：ALLOW ONCE、DENY／BLOCKED、reviewer 與 observed result", "Fixed cases、STOP condition、portfolio evidence 與不可聲稱的結果"]),
  "zh-Hans": ("AI Agent Permission Review Worksheet", "未按 Allow 前，先记下 target、scope、effect、reversibility 和 human owner。", ["虚构用户、草稿决策和 non-goal", "Disposable workspace、public／synthetic source manifest 和不可进入的资料", "读文件、改文件、network、account 和 external-action capability map", "每个 request 的 target、scope、expected effect 和 reversibility", "Permission receipt：ALLOW ONCE、DENY／BLOCKED、reviewer 和 observed result", "Fixed cases、STOP condition、portfolio evidence 和不可声称的结果"]),
  "en": ("AI-Agent Permission Review Worksheet", "Before you click Allow, record the target, scope, effect, reversibility and human owner.", ["Fictional user, draft decision and non-goal", "Disposable workspace, public/synthetic source manifest and material excluded", "Capability map: file read, file edit, network, account and external action", "Target, scope, expected effect and reversibility for each request", "Permission receipt: ALLOW ONCE, DENY/BLOCKED, reviewer and observed result", "Fixed cases, STOP condition, portfolio evidence and outcomes you cannot claim"]),
 },
 "coder-ai-pair-workflow": {
  "zh-HK": ("AI Coding Partner Review Worksheet", "讓 AI 提 plan、diff 和 test；人手保留 scope、驗收、reviewer decision 和 rollback。", ["Feature、使用者、non-goal 和完成條件", "Agent plan、檔案範圍和禁止改動", "合成 fixture、secret／data boundary 和權限", "Fixed tests、預期結果和負面 cases", "Diff review、run record 和 reviewer decision", "Rollback target、未解風險和停止條件"]),
  "zh-TW": ("AI Coding Partner Review Worksheet", "讓 AI 提出 plan、diff 與 test；人工保留 scope、驗收、reviewer decision 與 rollback。", ["Feature、使用者、non-goal 與完成條件", "Agent plan、檔案範圍與禁止改動", "合成 fixture、secret／data boundary 與權限", "Fixed tests、預期結果與負面 cases", "Diff review、run record 與 reviewer decision", "Rollback target、未解風險與停止條件"]),
  "zh-Hans": ("AI Coding Partner Review Worksheet", "让 AI 提出 plan、diff 和 test；人工保留 scope、验收、reviewer decision 和 rollback。", ["Feature、用户、non-goal 与完成条件", "Agent plan、文件范围与禁止改动", "合成 fixture、secret／data boundary 与权限", "Fixed tests、预期结果与负面 cases", "Diff review、run record 与 reviewer decision", "Rollback target、未解风险与停止条件"]),
  "en": ("AI Coding Partner Review Worksheet", "Let AI propose the plan, diff and tests; keep scope, acceptance, reviewer decision and rollback with a person.", ["Feature, user, non-goal and acceptance condition", "Agent plan, file scope and prohibited changes", "Synthetic fixture, secret/data boundary and permissions", "Fixed tests, expected result and negative cases", "Diff review, run record and reviewer decision", "Rollback target, unresolved risk and stop condition"]),
 },
 "approval-queue-reference": {
  "zh-HK": ("Approval Queue Portfolio Evidence Sheet", "把合成 FAQ 草稿流程做成可驗收、可交人審批而且不可作外部動作的作品證據。", ["虛構使用者、決定、non-goal 和 action contract", "批准且 current 的合成 FAQ source boundary", "透明 baseline、draft／handoff／blocked routes", "固定 acceptance cases：unsupported、injection、failure、action", "非執行 gpt-5-mini fixture、trace 和 reviewer gate", "測試證據、non-claims、rollback 和下一個授權問題"]),
  "zh-TW": ("Approval Queue Portfolio Evidence Sheet", "把合成 FAQ 草稿流程做成可驗收、可交人工審核而且不可作外部動作的作品證據。", ["虛構使用者、決定、non-goal 與 action contract", "核准且 current 的合成 FAQ source boundary", "透明 baseline、draft／handoff／blocked routes", "固定 acceptance cases：unsupported、injection、failure、action", "非執行 gpt-5-mini fixture、trace 與 reviewer gate", "測試證據、non-claims、rollback 與下一個授權問題"]),
  "zh-Hans": ("Approval Queue Portfolio Evidence Sheet", "把合成 FAQ 草稿流程做成可验收、可交人工审批而且不可作外部动作的作品证据。", ["虚构用户、决定、non-goal 与 action contract", "已批准且 current 的合成 FAQ source boundary", "透明 baseline、draft／handoff／blocked routes", "固定 acceptance cases：unsupported、injection、failure、action", "非执行 gpt-5-mini fixture、trace 与 reviewer gate", "测试证据、non-claims、rollback 与下一个授权问题"]),
  "en": ("Approval Queue Portfolio Evidence Sheet", "Turn a synthetic FAQ drafting workflow into portfolio evidence that is testable, human-approved and incapable of taking an external action.", ["Fictional user, decision, non-goal and action contract", "Approved, current synthetic FAQ source boundary", "Transparent baseline and draft/handoff/blocked routes", "Fixed cases: unsupported, injection, failure and action", "Non-executing gpt-5-mini fixture, trace and reviewer gate", "Test evidence, nonclaims, rollback and next authorization question"]),
 },
 "model-score-workflow-decision": {
  "zh-HK": ("模型分數與工作流程決定證據表", "把較高 F1 變成可檢查的決定、容量、shadow mode 和 release 證據，而不是 business value 宣稱。", ["虛構決定、positive class、human owner 和 non-goal", "Point-in-time data boundary、base rate 和 label timing", "Baseline、candidate、固定 holdout 和 comparison rule", "Confusion matrix、false-positive／<br/>false-negative cost", "Threshold、calibration、reviewer<br/>capacity 和 handoff", "Shadow evidence、release／rollback<br/>gate 和 non-claims"]),
  "zh-TW": ("模型分數與工作流程決策證據表", "把較高 F1 變成可檢查的決策、容量、shadow mode 與 release 證據，而不是 business value 宣稱。", ["虛構決策、positive class、human owner 與 non-goal", "Point-in-time data boundary、base rate 與 label timing", "Baseline、candidate、固定 holdout 與 comparison rule", "Confusion matrix、false-positive／<br/>false-negative cost", "Threshold、calibration、reviewer<br/>capacity 與 handoff", "Shadow evidence、release／rollback<br/>gate 與 non-claims"]),
  "zh-Hans": ("模型分数与工作流决策证据表", "把更高 F1 变成可检查的决策、容量、shadow mode 和 release 证据，而不是 business value 宣称。", ["虚构决策、positive class、human owner 和 non-goal", "Point-in-time data boundary、base rate 和 label timing", "Baseline、candidate、固定 holdout 和 comparison rule", "Confusion matrix、false-positive／<br/>false-negative cost", "Threshold、calibration、reviewer<br/>capacity 和 handoff", "Shadow evidence、release／rollback<br/>gate 和 non-claims"]),
  "en": ("Model Score Workflow Decision Evidence Sheet", "Turn a higher F1 into inspectable decision, capacity, shadow-mode and release evidence—not a business-value claim.", ["Fictional decision, positive class, human owner and non-goal", "Point-in-time data boundary, base rate and label timing", "Baseline, candidate, fixed holdout and comparison rule", "Confusion matrix and false-positive/false-negative cost", "Threshold, calibration, reviewer capacity and handoff", "Shadow evidence, release/rollback gate and nonclaims"]),
 },
 "agent-workflow-evaluation": {
  "zh-HK": ("Agent Workflow Evaluation Evidence Sheet", "評估 final answer 以外的 tool path、terminal state、trace、handoff、retry 和 release boundary。", ["虛構 user、decision、non-goal 和 named human owner", "Synthetic scenarios、expected tool path、terminal state 和 forbidden result", "最小 trace：version、tool sequence、safety decision、latency 和 cost proxy", "Outcome、path、safety、handoff、reliability 和 efficiency 的分開 rubric", "Retry、idempotency、timeout、budget 和 HANDOFF policy", "Regression gate、draft-only baseline、failure record 和 non-claims"]),
  "zh-TW": ("Agent Workflow Evaluation Evidence Sheet", "評估 final answer 以外的 tool path、terminal state、trace、handoff、retry 與 release boundary。", ["虛構 user、decision、non-goal 與 named human owner", "Synthetic scenarios、expected tool path、terminal state 與 forbidden result", "最小 trace：version、tool sequence、safety decision、latency 與 cost proxy", "Outcome、path、safety、handoff、reliability 與 efficiency 的分開 rubric", "Retry、idempotency、timeout、budget 與 HANDOFF policy", "Regression gate、draft-only baseline、failure record 與 non-claims"]),
  "zh-Hans": ("Agent Workflow Evaluation Evidence Sheet", "评估 final answer 以外的 tool path、terminal state、trace、handoff、retry 和 release boundary。", ["虚构 user、decision、non-goal 和 named human owner", "Synthetic scenarios、expected tool path、terminal state 和 forbidden result", "最小 trace：version、tool sequence、safety decision、latency 和 cost proxy", "Outcome、path、safety、handoff、reliability 和 efficiency 的分开 rubric", "Retry、idempotency、timeout、budget 和 HANDOFF policy", "Regression gate、draft-only baseline、failure record 和 non-claims"]),
  "en": ("Agent Workflow Evaluation Evidence Sheet", "Evaluate the tool path, terminal state, trace, handoff, retry and release boundary—not only the final answer.", ["Fictional user, decision, non-goal and named human owner", "Synthetic scenarios, expected tool path, terminal state and forbidden result", "Minimum trace: version, tool sequence, safety decision, latency and cost proxy", "Separate outcome, path, safety, handoff, reliability and efficiency rubric", "Retry, idempotency, timeout, budget and HANDOFF policy", "Regression gate, draft-only baseline, failure record and nonclaims"]),
 },
 "github-portfolio-proof-pack": {
  "zh-HK": ("GitHub Portfolio Proof Pack", "讓一個合成 AI project 的 decision、data boundary、baseline、evaluation、CI check 和 non-claims 可以被另一個人逐項檢查。", ["虛構使用者、有限決定、錯誤代價與 non-goal", "Source receipt、synthetic／public data boundary 與不可公開內容", "透明 baseline、一次候選改動與不可作的 action", "Fixed cases：normal、missing、stale、injection、<br/>prohibited action、regression", "英文 code／tests 與本地化 README 的責任分界", "Test command、CI check、human gate、rollback 與 non-claims"]),
  "zh-TW": ("GitHub Portfolio Proof Pack", "讓一個合成 AI project 的決策、data boundary、baseline、evaluation、CI check 和 non-claims 可以被另一個人逐項檢查。", ["虛構使用者、有限決策、錯誤代價與 non-goal", "Source receipt、synthetic／public data boundary 與不可公開內容", "透明 baseline、一項候選改動與不可做的 action", "Fixed cases：normal、missing、stale、injection、<br/>prohibited action、regression", "英文 code／tests 與本地化 README 的責任分界", "Test command、CI check、human gate、rollback 與 non-claims"]),
  "zh-Hans": ("GitHub Portfolio Proof Pack", "让一个合成 AI project 的决策、data boundary、baseline、evaluation、CI check 和 non-claims 可以被另一个人逐项检查。", ["虚构用户、有限决策、错误代价与 non-goal", "Source receipt、synthetic／public data boundary 与不可公开内容", "透明 baseline、一项候选改动与不可做的 action", "Fixed cases：normal、missing、stale、injection、<br/>prohibited action、regression", "英文 code／tests 与本地化 README 的责任分界", "Test command、CI check、human gate、rollback 与 non-claims"]),
  "en": ("GitHub Portfolio Proof Pack", "Make a synthetic AI project's decision, data boundary, baseline, evaluation, CI check and nonclaims inspectable one item at a time.", ["Fictional user, limited decision, cost of error and non-goal", "Source receipt, synthetic/public data boundary and material never to publish", "Transparent baseline, one candidate change and prohibited actions", "Fixed cases: normal, missing, stale, injection, prohibited action and regression", "Responsibility boundary between English code/tests and localised README", "Test command, CI check, human gate, rollback and nonclaims"]),
 },
 "role-aware-ai-learning-source-map": {
  "zh-HK": ("AI 學習來源與職位證據地圖", "由目標職位、evidence gap 和第一星期 artefact 揀來源，而不是由證書或名氣開始。", ["目標職位、現有能力和一個 evidence gap", "揀定路線：不寫 Code／ML basics／LLM builder／AI application + evaluation", "官方 source、access date、prerequisite 和 reuse boundary", "第一星期 technical artefact：schema、baseline、metric、fixture 或 fixed cases", "Non-technical evidence：data boundary、human owner、permission、error cost 和 stop condition", "不作出的 claim、下一個可檢查步驟和 portfolio 連結"]),
  "zh-TW": ("AI 學習來源與職務證據地圖", "從目標職務、evidence gap 與第一週 artefact 選來源，而不是從證書或名氣開始。", ["目標職務、現有能力與一個 evidence gap", "選定路線：不寫 Code／ML basics／LLM builder／AI application + evaluation", "官方 source、access date、prerequisite 與 reuse boundary", "第一週 technical artefact：schema、baseline、metric、fixture 或 fixed cases", "Non-technical evidence：data boundary、human owner、permission、error cost 與 stop condition", "不做出的 claim、下一個可檢查步驟與 portfolio 連結"]),
  "zh-Hans": ("AI 学习来源与职位证据地图", "从目标职位、evidence gap 与第一周 artefact 选来源，而不是从证书或名气开始。", ["目标职位、现有能力和一个 evidence gap", "选定路线：不写 Code／ML basics／LLM builder／AI application + evaluation", "官方 source、access date、prerequisite 和 reuse boundary", "第一周 technical artefact：schema、baseline、metric、fixture 或 fixed cases", "Non-technical evidence：data boundary、human owner、permission、error cost 和 stop condition", "不做出的 claim、下一个可检查步骤和 portfolio 链接"]),
  "en": ("AI Learning Source and Role Evidence Map", "Choose a source from the target role, evidence gap and first-week artefact—not a credential or platform name.", ["Target role, current capability and one evidence gap", "Selected route: no-code / ML basics / LLM builder / AI application + evaluation", "Official source, access date, prerequisite and reuse boundary", "First-week technical artefact: schema, baseline, metric, fixture or fixed cases", "Non-technical evidence: data boundary, human owner, permission, error cost and stop condition", "Nonclaim, next inspectable step and portfolio link"]),
 },
 "from-offline-evaluation-to-an-authorised-pilot": {
  "zh-HK": ("AI Pilot Evidence & Measurement Worksheet", "由本地 evaluation 走到可討論的 pilot design：先分清 metric、owner、comparison 和 stop rule。", ["Fictional decision、human owner 和永遠不做的 action", "Offline model metric、workflow metric 和 delayed outcome 的三層分界", "Data owner、allowed／excluded data boundary、retention expiry 和 deletion owner", "Baseline、candidate、assignment unit、frozen comparison strategy 和 protocol date", "Safety guardrail、reviewer evidence、failure response 和 rollback target", "Outcome observation window、claim status、unknowns 和下一個 approval question"]),
  "zh-TW": ("AI Pilot Evidence & Measurement Worksheet", "從本地 evaluation 走到可討論的 pilot design：先分清 metric、owner、comparison 與 stop rule。", ["Fictional decision、human owner 與永遠不做的 action", "Offline model metric、workflow metric 與 delayed outcome 的三層分界", "Data owner、allowed／excluded data boundary、retention expiry 與 deletion owner", "Baseline、candidate、assignment unit、frozen comparison strategy 與 protocol date", "Safety guardrail、reviewer evidence、failure response 與 rollback target", "Outcome observation window、claim status、unknowns 與下一個 approval question"]),
  "zh-Hans": ("AI Pilot Evidence & Measurement Worksheet", "从本地 evaluation 走到可讨论的 pilot design：先分清 metric、owner、comparison 和 stop rule。", ["Fictional decision、human owner 和永远不做的 action", "Offline model metric、workflow metric 和 delayed outcome 的三层分界", "Data owner、allowed／excluded data boundary、retention expiry 和 deletion owner", "Baseline、candidate、assignment unit、frozen comparison strategy 和 protocol date", "Safety guardrail、reviewer evidence、failure response 和 rollback target", "Outcome observation window、claim status、unknowns 和下一个 approval question"]),
  "en": ("AI Pilot Evidence & Measurement Worksheet", "Move from local evaluation to a discussable pilot design: separate the metric, owner, comparison and stop rule first.", ["Fictional decision, human owner and actions that remain prohibited", "The boundary between offline model metric, workflow metric and delayed outcome", "Data owner, allowed/excluded data boundary, retention expiry and deletion owner", "Baseline, candidate, assignment unit, frozen comparison strategy and protocol date", "Safety guardrail, reviewer evidence, failure response and rollback target", "Outcome observation window, claim status, unknowns and the next approval question"]),
 },
 "flagship-portfolio-architecture": {
  "zh-HK": ("主力 AI 作品集六格工作紙", "每一格只寫三件事: 留下甚麼, 別人怎樣核對, 同埋呢份本地練習不能聲稱甚麼。", ["小決定: 使用者, 時間點, 錯誤代價, owner 和 non-goal", "資料界線: source receipt, 可用/排除欄位和 fixture version", "簡單起點: baseline, 一次刻意改動和比較原因", "固定情境: normal, missing, stale/conflict, out-of-scope 和 regression", "停止與回退: KEEP/REVISE/STOP, reviewer 和 earlier method", "交代給下一個人: README, run command, 五分鐘 walkthrough 和 non-claims"]),
  "zh-TW": ("主力 AI 作品集六格工作表", "每一格只寫三件事: 留下什麼, 別人怎麼檢查, 以及這份本機練習不能聲稱什麼。", ["小決策: 使用者, 時間點, 錯誤代價, owner 與 non-goal", "資料邊界: source receipt, 可用/排除欄位與 fixture version", "簡單起點: baseline, 一次刻意改動與比較原因", "固定情境: normal, missing, stale/conflict, out-of-scope 與 regression", "停止與回退: KEEP/REVISE/STOP, reviewer 與 earlier method", "交代給下一個人: README, run command, 五分鐘 walkthrough 與 non-claims"]),
  "zh-Hans": ("主力 AI 作品集六格工作表", "每一格只写三件事: 留下什么, 别人怎样检查, 以及这份本地练习不能声称什么。", ["小决定: 使用者, 时间点, 错误代价, owner 与 non-goal", "数据边界: source receipt, 可用/排除字段与 fixture version", "简单起点: baseline, 一次刻意改动与比较原因", "固定情境: normal, missing, stale/conflict, out-of-scope 与 regression", "停止与回退: KEEP/REVISE/STOP, reviewer 与 earlier method", "交代给下一个人: README, run command, 五分钟 walkthrough 与 non-claims"]),
  "en": ("Flagship AI Portfolio: Six-Row Worksheet", "For each row, record only three things: what you leave behind, how someone checks it, and what the local exercise does not establish.", ["Small decision: user, timing, cost of error, owner, and non-goal", "Data boundary: source receipt, allowed/excluded fields, and fixture version", "Simple starting point: baseline, one deliberate change, and reason for comparison", "Fixed situations: normal, missing, stale/conflict, out-of-scope, and regression", "Stop and return: KEEP/REVISE/STOP, reviewer, and earlier method", "Hand-off map: README, run command, five-minute walkthrough, and nonclaims"]),
 },
}

# New review-stage articles should not silently miss their companion worksheet.
# Existing entries above retain their tailored prompts; new entries receive a
# bounded, localisation-aware evidence worksheet until a dedicated one is added.
article_index = json.loads((ROOT / "content" / "articles.json").read_text(encoding="utf-8"))
ARTICLE_UPDATED_AT = {article["id"]: article["updatedAt"] for article in article_index}
for article in article_index:
    if article["id"] in DATA:
        continue
    DATA[article["id"]] = {}
    for locale, copy in article["translations"].items():
        prompts = {
            "zh-HK": ["讀者要作的決定與使用者", "Input、資料邊界與禁止動作", "簡單 baseline 與可接受輸出", "固定 cases、failure 與 handoff", "系統部分，可以核對乜：version、test、trace 或 result", "用喺工作上，仲要講清乜：owner、成本、風險和下一步"],
            "zh-TW": ["讀者要做的決策與使用者", "Input、資料邊界與禁止動作", "簡單 baseline 與可接受輸出", "固定 cases、failure 與 handoff", "系統部分，可以核對什麼：version、test、trace 或 result", "用在工作上，還要講清什麼：owner、成本、風險與下一步"],
            "zh-Hans": ["读者要做的决定与使用者", "Input、数据边界与禁止动作", "简单 baseline 与可接受输出", "固定 cases、failure 与 handoff", "系统部分，可以核对什么：version、test、trace 或 result", "用在工作上，还要讲清什么：owner、成本、风险与下一步"],
            "en": ["Reader decision and user", "Input, data boundary and prohibited action", "Simple baseline and acceptable output", "Fixed cases, failure and handoff", "What someone can check in the system: version, test, trace, or result", "What still needs explaining before work use: owner, cost, risk, and next step"],
        }[locale]
        DATA[article["id"]][locale] = (copy["title"] + " Worksheet", copy["description"], prompts)

INK = colors.HexColor("#17212B")
TEAL = colors.HexColor("#277B72")
PAPER = colors.HexColor("#F8F5EE")
AMBER = colors.HexColor("#F5B942")

def make_pdf(target: Path, title: str, subtitle: str, prompts: list[str], locale: str, updated_at: str):
    target.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(target), pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=16*mm, bottomMargin=14*mm)
    font_name = "NotoSC" if locale == "zh-Hans" else "Noto"
    is_cjk = locale != "en"
    title_style = ParagraphStyle("title", fontName=font_name, fontSize=20 if is_cjk else 22, leading=26 if is_cjk else 28, textColor=INK, spaceAfter=5*mm)
    small = ParagraphStyle("small", fontName=font_name, fontSize=9, leading=14, textColor=TEAL)
    # CJK prompts need a little more usable width and a more compact leading. Without
    # this, ReportLab expands every fixed-height row and can push the worksheet title
    # above the printable page area.
    body = ParagraphStyle("body", fontName=font_name, fontSize=8.5 if is_cjk else 10, leading=12 if is_cjk else 15, textColor=INK)
    footer = ParagraphStyle("footer", fontName=font_name, fontSize=8, leading=12, textColor=colors.HexColor("#657078"), alignment=TA_CENTER)
    story = [Spacer(1, 14), Paragraph(title, title_style), Paragraph(subtitle, body), Spacer(1, 5*mm)]
    rows = []
    for idx, prompt in enumerate(prompts, 1):
        rows.append([Paragraph(f"{idx:02d}", small), Paragraph(prompt, body), ""])
    # The flagship worksheet uses longer English prompts so it needs a wider
    # prompt column; otherwise ReportLab may paint text across the notes area.
    is_flagship_worksheet = title == "Flagship AI Portfolio: Six-Row Worksheet"
    prompt_width = 70*mm if is_cjk or is_flagship_worksheet else 58*mm
    notes_width = 83*mm if is_cjk or is_flagship_worksheet else 95*mm
    row_height = 23*mm if is_cjk else 27*mm
    table = Table(rows, colWidths=[13*mm, prompt_width, notes_width], rowHeights=[row_height]*len(rows))
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), PAPER), ("GRID", (0,0), (-1,-1), .9, colors.HexColor("#BEB7AA")),
        ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 8), ("TOPPADDING", (0,0), (-1,-1), 8),
        ("LINEBEFORE", (2,0), (2,-1), 2, AMBER)
    ]))
    footer_text = {"zh-HK":"只使用公開或合成資料。不要加入僱主、客戶或個人機密資料。","zh-TW":"只使用公開或合成資料。不要加入雇主、客戶或個人機密資料。","zh-Hans":"只使用公开或合成数据。不要加入雇主、客户或个人机密资料。","en":"Use public or synthetic material only. Do not include employer, client or personal confidential data."}[locale]
    story += [table, Spacer(1, 5*mm), Paragraph(f"{footer_text} · v1.1 · {updated_at}", footer)]
    def draw_brand(canvas, document):
        canvas.saveState()
        canvas.setFont("Helvetica", 9)
        canvas.setFillColor(TEAL)
        canvas.drawString(18*mm, A4[1] - 16*mm, "AI.DOG · PORTFOLIO EVIDENCE WORKSHEET")
        canvas.restoreState()
    doc.build(story, onFirstPage=draw_brand)

def make_markdown(target: Path, title: str, subtitle: str, prompts: list[str], updated_at: str):
    target.parent.mkdir(parents=True, exist_ok=True)
    warning = {"zh-HK":"不要加入僱主、客戶或個人機密資料。","zh-TW":"不要加入雇主、客戶或個人機密資料。","zh-Hans":"不要加入雇主、客户或个人机密资料。","en":"Do not include employer, client or personal confidential data."}[target.stem]
    lines = [f"# {title}", "", subtitle, "", f"Version: v1.1 · Updated: {updated_at}", "", warning, ""]
    for idx, prompt in enumerate(prompts, 1):
        lines += [f"## {idx:02d} · {prompt}", "", "- Notes:", "- Evidence:", "- Boundary / unresolved risk:", ""]
    target.write_text("\n".join(lines), encoding="utf-8")

requested = set(sys.argv[1:])
unknown = requested.difference(DATA)
if unknown:
    raise SystemExit(f"Unknown article IDs: {', '.join(sorted(unknown))}")
selected_data = {article_id: locales for article_id, locales in DATA.items() if not requested or article_id in requested}

for article_id, locales in selected_data.items():
    for locale, (title, subtitle, prompts) in locales.items():
        folder = ROOT / "public" / "downloads" / article_id / "v1"
        updated_at = ARTICLE_UPDATED_AT.get(article_id, "2026-09-24")
        make_markdown(folder / f"{locale}.md", title, subtitle, prompts, updated_at)
        make_pdf(folder / f"{locale}.pdf", title, subtitle, prompts, locale, updated_at)

count = len(selected_data) * 4
print(f"Generated {count} PDFs and {count} Markdown worksheets.")

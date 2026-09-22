from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
FONT = r"C:\Windows\Fonts\NotoSansTC-VF.ttf"
pdfmetrics.registerFont(TTFont("Noto", FONT))
pdfmetrics.registerFont(TTFont("NotoSC", r"C:\Windows\Fonts\msyh.ttc", subfontIndex=0))

DATA = {
 "role-route": {
  "zh-Hant": ("澳洲 AI 職位比較 Worksheet", "用三份真實 JD 找出重複的交付與證據缺口。", ["目標職位與基本資格", "最常出現的責任動詞", "主要交付物", "我已有的可檢查證據", "最小可驗證 project", "不符合／停止條件"]),
  "zh-Hans": ("澳洲 AI 职位比较 Worksheet", "用三份真实 JD 找出重复的交付与证据缺口。", ["目标职位与基本资格", "最常出现的职责动词", "主要交付物", "已有的可检查证据", "最小可验证项目", "不符合／停止条件"]),
  "en": ("Australian AI Role Comparison", "Use three real job descriptions to find recurring deliverables and evidence gaps.", ["Target role and eligibility", "Recurring responsibility verbs", "Primary deliverable", "Evidence I can show", "Smallest verifiable project", "Mismatch / stop condition"]),
 },
 "rag-evidence": {
  "zh-Hant": ("RAG Portfolio Evidence Checklist", "由可運行 demo 補成可追問的工程證據。", ["Business problem 與使用者", "資料來源、更新與 data card", "固定 evaluation set 與 baseline", "無答案、權限與 injection cases", "Failure handling、trace 與成本", "README、重跑與部署方法"]),
  "zh-Hans": ("RAG Portfolio Evidence Checklist", "把可运行 demo 补成可追问的工程证据。", ["业务问题与用户", "数据来源、更新与 data card", "固定 evaluation set 与 baseline", "无答案、权限与 injection cases", "失败处理、trace 与成本", "README、重跑与部署方法"]),
  "en": ("RAG Portfolio Evidence Checklist", "Turn a working demo into engineering evidence that survives follow-up.", ["Business problem and user", "Data source, updates and data card", "Fixed evaluation set and baseline", "No-answer, permission and injection cases", "Failure handling, traces and cost", "README, reproduction and deployment"]),
 },
 "professional-workflow": {
  "zh-Hant": ("Professional AI Workflow Template", "Coding 前先固定 problem、scope、acceptance、failure 與 approval。", ["Problem 與受影響使用者", "輸入、輸出與禁止動作", "Acceptance criteria", "Tickets 與完成條件", "Test matrix 與 failure cases", "Human approval、rollback 與 ADR"]),
  "zh-Hans": ("Professional AI Workflow Template", "编码前先固定 problem、scope、acceptance、failure 与 approval。", ["问题与受影响用户", "输入、输出与禁止动作", "Acceptance criteria", "Tickets 与完成条件", "Test matrix 与 failure cases", "Human approval、rollback 与 ADR"]),
  "en": ("Professional AI Workflow Template", "Fix the problem, scope, acceptance, failure and approval before coding.", ["Problem and affected user", "Inputs, outputs and prohibited actions", "Acceptance criteria", "Tickets and completion conditions", "Test matrix and failure cases", "Human approval, rollback and ADR"]),
 },
 "prompt-evidence": {
  "zh-Hant": ("Prompt Experiment Log", "每次只改一項主要變量，保留成功與失敗。", ["Problem 與 prompt version", "Model、config 與 input class", "Expected behaviour", "固定 test cases", "Tool read／write 權限", "Result、failure 與 human decision"]),
  "zh-Hans": ("Prompt Experiment Log", "每次只修改一个主要变量，同时保留成功与失败。", ["问题与 prompt version", "Model、config 与 input class", "Expected behaviour", "固定 test cases", "Tool read／write 权限", "Result、failure 与 human decision"]),
  "en": ("Prompt Experiment Log", "Change one major variable at a time and preserve both success and failure.", ["Problem and prompt version", "Model, config and input class", "Expected behaviour", "Fixed test cases", "Tool read/write permissions", "Result, failure and human decision"]),
 },
 "opportunity-scorecard": {
  "zh-Hant": ("AI Opportunity Scorecard", "每項 0–2 分；比較最多三個機會，再只選一個。", ["與目標角色的相關性", "可帶走的具體輸出", "合作、mentor 或 feedback", "時間與金錢成本", "資格、私隱與公開權利", "停止條件"]),
  "zh-Hans": ("AI Opportunity Scorecard", "每项 0–2 分；最多比较三个机会，然后只选一个。", ["与目标职位的相关性", "可以保留的具体产出", "合作、mentor 或 feedback", "时间与金钱成本", "资格、隐私与公开权利", "停止条件"]),
  "en": ("AI Opportunity Scorecard", "Score each item 0–2. Compare no more than three opportunities, then choose one.", ["Target-role relevance", "Tangible output you retain", "Collaboration, mentor or feedback", "Time and financial cost", "Eligibility, privacy and publication rights", "Stop condition"]),
 },
}

INK = colors.HexColor("#17212B")
TEAL = colors.HexColor("#277B72")
PAPER = colors.HexColor("#F8F5EE")
AMBER = colors.HexColor("#F5B942")

def make_pdf(target: Path, title: str, subtitle: str, prompts: list[str], locale: str):
    target.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(target), pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=16*mm, bottomMargin=14*mm)
    font_name = "NotoSC" if locale == "zh-Hans" else "Noto"
    title_style = ParagraphStyle("title", fontName=font_name, fontSize=22, leading=28, textColor=INK, spaceAfter=5*mm)
    small = ParagraphStyle("small", fontName=font_name, fontSize=9, leading=14, textColor=TEAL)
    body = ParagraphStyle("body", fontName=font_name, fontSize=10, leading=15, textColor=INK)
    footer = ParagraphStyle("footer", fontName=font_name, fontSize=8, leading=12, textColor=colors.HexColor("#657078"), alignment=TA_CENTER)
    story = [Paragraph("AI.DOG · CAREER EVIDENCE WORKSHEET", small), Paragraph(title, title_style), Paragraph(subtitle, body), Spacer(1, 5*mm)]
    rows = []
    for idx, prompt in enumerate(prompts, 1):
        rows.append([Paragraph(f"{idx:02d}", small), Paragraph(prompt, body), ""])
    table = Table(rows, colWidths=[13*mm, 58*mm, 95*mm], rowHeights=[27*mm]*len(rows))
    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), PAPER), ("GRID", (0,0), (-1,-1), .9, colors.HexColor("#BEB7AA")),
        ("VALIGN", (0,0), (-1,-1), "TOP"), ("LEFTPADDING", (0,0), (-1,-1), 8), ("TOPPADDING", (0,0), (-1,-1), 8),
        ("LINEBEFORE", (2,0), (2,-1), 2, AMBER)
    ]))
    story += [table, Spacer(1, 5*mm), Paragraph("Use public or synthetic material only. Do not include employer, client or personal confidential data. · v1.0 · 2026-09-22", footer)]
    doc.build(story)

def make_markdown(target: Path, title: str, subtitle: str, prompts: list[str]):
    target.parent.mkdir(parents=True, exist_ok=True)
    lines = [f"# {title}", "", subtitle, "", "Version: v1.0 · Updated: 2026-09-22", "", "Do not include employer, client or personal confidential data.", ""]
    for idx, prompt in enumerate(prompts, 1):
        lines += [f"## {idx:02d} · {prompt}", "", "- Notes:", "- Evidence:", "- Boundary / unresolved risk:", ""]
    target.write_text("\n".join(lines), encoding="utf-8")

for article_id, locales in DATA.items():
    for locale, (title, subtitle, prompts) in locales.items():
        folder = ROOT / "public" / "downloads" / article_id / "v1"
        make_markdown(folder / f"{locale}.md", title, subtitle, prompts)
        make_pdf(folder / f"{locale}.pdf", title, subtitle, prompts, locale)

print("Generated 15 PDFs and 15 Markdown worksheets.")

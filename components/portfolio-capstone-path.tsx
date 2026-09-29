'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/types';

type FieldId = 'roleEvidence' | 'problemChange' | 'implementationChange' | 'newCase' | 'failureCase' | 'runEvidence' | 'contribution' | 'reviewEvidence';
type SafetyId = 'ownership' | 'synthetic' | 'secrets' | 'readme';
type CopyState = 'idle' | 'success' | 'error';
type RestoreState = 'idle' | 'success' | 'empty' | 'error';
type StorageWriteState = 'idle' | 'pending' | 'success' | 'error';

type CapstoneState = Record<FieldId, string> & {
  safety: Record<SafetyId, boolean>;
  remember: boolean;
};

type CapstoneCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  starterContext: (title: string) => string;
  boundary: string;
  navigationLabel: string;
  links: { role: string; build: string; proof: string };
  progressLabel: string;
  progress: readonly { title: string; text: string }[];
  sectionTitle: string;
  sectionIntro: string;
  fields: Record<FieldId, { label: string; help: string; placeholder: string }>;
  safetyLegend: string;
  safetyHelp: string;
  safety: Record<SafetyId, string>;
  rememberLabel: string;
  rememberHelp: string;
  saved: string;
  notSaved: string;
  storageUpdating: string;
  storageWriteError: string;
  restoreAction: string;
  restoreSuccess: string;
  restoreEmpty: string;
  restoreError: string;
  copyAction: string;
  copySuccess: string;
  copyError: string;
  receiptTitle: string;
  statusTitle: string;
  statuses: readonly string[];
  selfReported: string;
};

const STORAGE_KEY = 'aidog:portfolio-capstone:v1';
const FIELD_IDS: FieldId[] = ['roleEvidence', 'problemChange', 'implementationChange', 'newCase', 'failureCase', 'runEvidence', 'contribution', 'reviewEvidence'];
const SAFETY_IDS: SafetyId[] = ['ownership', 'synthetic', 'secrets', 'readme'];

const emptyState = (): CapstoneState => ({
  roleEvidence: '',
  problemChange: '',
  implementationChange: '',
  newCase: '',
  failureCase: '',
  runEvidence: '',
  contribution: '',
  reviewEvidence: '',
  safety: { ownership: false, synthetic: false, secrets: false, readme: false },
  remember: false
});

const copy: Record<Locale, CapstoneCopy> = {
  'zh-Hant': {
    eyebrow: '由 starter 變成自己的作品',
    title: '同一個 capstone，由職位證據走到安全交付',
    intro: '不要把下載、重跑或填完範本當成自己的作品。保留同一個項目，逐步改寫問題、加入自己的案例、執行同一套檢查，再說清楚你實際改了什麼。',
    starterContext: title => `你由「${title}」來到這裡。把 starter 的改動說明、基準、案例和覆核紀錄當作起點；只有你改寫問題、加入自己的案例並重跑檢查，先會成為自己的 capstone。`,
    boundary: '只寫去識別化、虛構或你有權使用的內容。以下狀態全部由你自行記錄；網站不會驗證執行結果、第三方覆核或發佈狀態。',
    navigationLabel: 'Capstone 所需參考',
    links: { role: '先從目標職位找證據缺口', build: '選一個 starter', proof: '查看安全整理與發佈清單' },
    progressLabel: 'Capstone 關卡',
    progress: [
      { title: '01 · 定義', text: '目標職位證據、改寫後的問題、你要做的實質修改。' },
      { title: '02 · 實作', text: '至少一個自己寫的正常案例、一個失敗案例，以及可重做的執行證據。' },
      { title: '03 · 說明', text: '把你的貢獻與 starter 原有內容分開。' },
      { title: '04 · 覆核', text: '記下實際覆核人、日期或仍未完成；不要自行把它當成獨立覆核。' },
      { title: '05 · 交付決定', text: '確認擁有權、資料、秘密掃描與 README 邊界，再由你決定私人保留或公開。' }
    ],
    sectionTitle: '填寫你的 contribution receipt',
    sectionIntro: '每格都要能指向一份實際 artefact、diff、case、command 或 review note；不要只寫「已完成」。',
    fields: {
      roleEvidence: { label: '目標職位重複要求什麼證據？', help: '概括三份職位描述中的共同動詞，不要寫公司名或複製整段招聘文字。', placeholder: '例如：設計可評估的 RAG workflow，並說明失敗與監察方法。' },
      problemChange: { label: '你如何改寫 starter 的問題或使用情境？', help: '說明新的虛構使用者、決定與非目標。', placeholder: '例如：由一般 FAQ 改為虛構內部政策草稿，輸出只供人覆核。' },
      implementationChange: { label: '你親自完成哪一項實質修改？', help: '寫清楚檔案、流程、規則或評估方法的改動，而不是只改名稱或顏色。', placeholder: '例如：加入來源衝突分流，並令不一致來源必須交給人處理。' },
      newCase: { label: '你新增的正常案例與預期結果', help: '這個案例不應來自 starter 原有答案。', placeholder: '例如：case-07 有兩個一致來源；預期產生有引用的草稿。' },
      failureCase: { label: '你新增的失敗／反例與安全結果', help: '至少包含一個會阻止繼續或交回給人的案例。', placeholder: '例如：case-08 來源互相衝突；預期停止並要求人工決定。' },
      runEvidence: { label: '如何重做，以及實際結果在哪裡？', help: '記下 command／步驟、fixture 版本、輸出檔與通過／失敗數；不要貼秘密或私人路徑。', placeholder: '例如：npm test；fixture v0.2；7/8 通過，case-08 按預期 STOP。' },
      contribution: { label: '你的貢獻與 starter 原有內容有何分別？', help: '列出保留、修改、新增與沒有完成的部分。', placeholder: '例如：保留原有 schema；新增兩個案例與 conflict route；未加入 live model。' },
      reviewEvidence: { label: '誰實際覆核了什麼？', help: '未有第三方覆核就直接寫「未覆核」；不要虛構 reviewer。', placeholder: '例如：未有第三方覆核；已按 rubric 自評，下一步請同儕重跑 case-07/08。' }
    },
    safetyLegend: '公開或交付前的擁有權檢查',
    safetyHelp: '勾選代表你自行確認，不代表網站已驗證。任何一項未確認，都應保持私人草稿。',
    safety: {
      ownership: '我擁有或獲准使用全部程式、文字、資料與圖像。',
      synthetic: '作品不含僱主、客戶、個人、登入或其他非公開資料。',
      secrets: '我檢查了目前檔案與版本歷史，沒有 credential 或秘密。',
      readme: 'README 已分開說明 fixture 證據、未驗證結果、限制與我的貢獻。'
    },
    rememberLabel: '選擇在這個瀏覽器記住這份草稿',
    rememberHelp: '預設不儲存。勾選後只寫入這個瀏覽器的 local storage；不會上傳。取消勾選會移除已儲存草稿。',
    saved: '草稿已在這個瀏覽器內更新。',
    notSaved: '草稿只存在目前頁面；重新整理會清空。',
    storageUpdating: '正在確認這個瀏覽器的儲存狀態。',
    storageWriteError: '瀏覽器未能更新 local storage。這份草稿仍留在目前頁面；舊有已儲存版本可能仍然存在。',
    restoreAction: '還原這個瀏覽器內的草稿',
    restoreSuccess: '已還原已儲存的草稿。',
    restoreEmpty: '這個瀏覽器沒有已儲存草稿。',
    restoreError: '已儲存草稿格式無法讀取；未有載入內容。',
    copyAction: '複製 contribution receipt',
    copySuccess: '已複製 Markdown receipt。',
    copyError: '瀏覽器不允許複製；請手動複製欄位。',
    receiptTitle: 'Portfolio capstone contribution receipt',
    statusTitle: '目前狀態',
    statuses: ['尚未定義', '已定義，未執行', '已執行，待說明貢獻', '已整理貢獻，待覆核', '已記錄覆核，待擁有權決定', '可交由擁有者決定是否公開'],
    selfReported: '自填本機狀態，未經網站或第三方驗證。'
  },
  'zh-Hans': {
    eyebrow: '从 starter 变成自己的作品',
    title: '同一个 capstone，从职位证据走到安全交付',
    intro: '不要把下载、重跑或填完模板当成自己的作品。保留同一个项目，逐步改写问题、加入自己的案例、运行同一套检查，再说明你实际改了什么。',
    starterContext: title => `你从“${title}”来到这里。把 starter 的改动说明、基准、案例和复核记录当作起点；只有你改写问题、加入自己的案例并重新运行检查，才会成为自己的 capstone。`,
    boundary: '只写去识别化、虚构或你有权使用的内容。以下状态全部由你自行记录；网站不会验证运行结果、第三方复核或发布状态。',
    navigationLabel: 'Capstone 所需参考',
    links: { role: '先从目标职位找证据缺口', build: '选择一个 starter', proof: '查看安全整理与发布清单' },
    progressLabel: 'Capstone 关卡',
    progress: [
      { title: '01 · 定义', text: '目标职位证据、改写后的问题、你要做的实质修改。' },
      { title: '02 · 实作', text: '至少一个自己写的正常案例、一个失败案例，以及可重做的运行证据。' },
      { title: '03 · 说明', text: '把你的贡献与 starter 原有内容分开。' },
      { title: '04 · 复核', text: '记下实际复核人、日期或仍未完成；不要自行把它当成独立复核。' },
      { title: '05 · 交付决策', text: '确认所有权、数据、秘密扫描与 README 边界，再由你决定私人保留或公开。' }
    ],
    sectionTitle: '填写你的 contribution receipt',
    sectionIntro: '每格都要能指向一份实际 artefact、diff、case、command 或 review note；不要只写“已完成”。',
    fields: {
      roleEvidence: { label: '目标职位重复要求什么证据？', help: '概括三份职位描述中的共同动词，不要写公司名或复制整段招聘文字。', placeholder: '例如：设计可评估的 RAG workflow，并说明失败与监控方法。' },
      problemChange: { label: '你如何改写 starter 的问题或使用情境？', help: '说明新的虚构用户、决策与非目标。', placeholder: '例如：从一般 FAQ 改为虚构内部政策草稿，输出只供人复核。' },
      implementationChange: { label: '你亲自完成哪一项实质修改？', help: '写清楚文件、流程、规则或评估方法的改动，而不是只改名称或颜色。', placeholder: '例如：加入来源冲突分流，让不一致来源必须交给人处理。' },
      newCase: { label: '你新增的正常案例与预期结果', help: '这个案例不应来自 starter 原有答案。', placeholder: '例如：case-07 有两个一致来源；预期生成有引用的草稿。' },
      failureCase: { label: '你新增的失败／反例与安全结果', help: '至少包含一个会阻止继续或交回给人的案例。', placeholder: '例如：case-08 来源互相冲突；预期停止并要求人工决策。' },
      runEvidence: { label: '如何重做，以及实际结果在哪里？', help: '记下 command／步骤、fixture 版本、输出文件与通过／失败数；不要贴秘密或私人路径。', placeholder: '例如：npm test；fixture v0.2；7/8 通过，case-08 按预期 STOP。' },
      contribution: { label: '你的贡献与 starter 原有内容有何区别？', help: '列出保留、修改、新增与没有完成的部分。', placeholder: '例如：保留原有 schema；新增两个案例与 conflict route；未加入 live model。' },
      reviewEvidence: { label: '谁实际复核了什么？', help: '没有第三方复核就直接写“未复核”；不要虚构 reviewer。', placeholder: '例如：未有第三方复核；已按 rubric 自评，下一步请同伴重跑 case-07/08。' }
    },
    safetyLegend: '公开或交付前的所有权检查',
    safetyHelp: '勾选代表你自行确认，不代表网站已验证。任何一项未确认，都应保持私人草稿。',
    safety: { ownership: '我拥有或获准使用全部代码、文字、数据与图像。', synthetic: '作品不含雇主、客户、个人、登录或其他非公开数据。', secrets: '我检查了当前文件与版本历史，没有 credential 或秘密。', readme: 'README 已分开说明 fixture 证据、未验证结果、限制与我的贡献。' },
    rememberLabel: '选择在这个浏览器记住这份草稿',
    rememberHelp: '默认不存储。勾选后只写入这个浏览器的 local storage；不会上传。取消勾选会移除已存储草稿。',
    saved: '草稿已在这个浏览器内更新。',
    notSaved: '草稿只存在当前页面；刷新会清空。',
    storageUpdating: '正在确认这个浏览器的存储状态。',
    storageWriteError: '浏览器未能更新 local storage。这份草稿仍留在当前页面；旧有已存储版本可能仍然存在。',
    restoreAction: '还原这个浏览器内的草稿',
    restoreSuccess: '已还原已存储的草稿。',
    restoreEmpty: '这个浏览器没有已存储草稿。',
    restoreError: '已存储草稿格式无法读取；没有载入内容。',
    copyAction: '复制 contribution receipt',
    copySuccess: '已复制 Markdown receipt。',
    copyError: '浏览器不允许复制；请手动复制字段。',
    receiptTitle: 'Portfolio capstone contribution receipt',
    statusTitle: '当前状态',
    statuses: ['尚未定义', '已定义，未运行', '已运行，待说明贡献', '已整理贡献，待复核', '已记录复核，待所有权决策', '可交由所有者决定是否公开'],
    selfReported: '自填本地状态，未经网站或第三方验证。'
  },
  en: {
    eyebrow: 'TURN A STARTER INTO YOUR WORK',
    title: 'Keep one capstone from role evidence to a safe handoff',
    intro: 'Downloading, replaying, or completing a template does not make a project yours. Keep one project, change the problem, author cases, run the same checks, and distinguish your contribution from the starter.',
    starterContext: title => `You arrived from ${title}. Use its change brief, baseline, cases, and review record as a starting point; it becomes your capstone only after you change the problem, add your own cases, and rerun the checks.`,
    boundary: 'Use only de-identified, fictional, or authorised material. Every status below is self-recorded; the site does not verify execution, third-party review, or publication.',
    navigationLabel: 'Capstone references',
    links: { role: 'Find the evidence gap from a target role', build: 'Choose one starter', proof: 'Open the safe packaging and publication checklist' },
    progressLabel: 'Capstone gates',
    progress: [
      { title: '01 · Define', text: 'Target-role evidence, your changed problem, and one material change you will make.' },
      { title: '02 · Execute', text: 'At least one case you authored, one failure case, and reproducible run evidence.' },
      { title: '03 · Explain', text: 'Separate your contribution from the original starter.' },
      { title: '04 · Review', text: 'Record the real reviewer, date, or that review is still missing. Do not self-label independent review.' },
      { title: '05 · Handoff decision', text: 'Check ownership, data, secret history, and README boundaries before deciding whether to keep it private or publish.' }
    ],
    sectionTitle: 'Write your contribution receipt',
    sectionIntro: 'Each field should point to a real artefact, diff, case, command, or review note. Do not write only “done.”',
    fields: {
      roleEvidence: { label: 'What evidence does the target role repeatedly ask for?', help: 'Summarise common verbs from three job descriptions. Do not name companies or copy whole job posts.', placeholder: 'For example: design an evaluable RAG workflow and explain failures and monitoring.' },
      problemChange: { label: 'How did you change the starter problem or context?', help: 'Name the new fictional user, decision, and non-goal.', placeholder: 'For example: change a generic FAQ into a fictional policy draft that always requires human review.' },
      implementationChange: { label: 'What material change did you implement yourself?', help: 'Name the file, workflow, rule, or evaluation change—not only renamed text or colours.', placeholder: 'For example: add a source-conflict route that sends inconsistent evidence to a human.' },
      newCase: { label: 'Your new normal case and expected result', help: 'This case should not be copied from the starter answer key.', placeholder: 'For example: case-07 has two consistent sources; expect a cited draft.' },
      failureCase: { label: 'Your new failure or counterexample and safe result', help: 'Include at least one case that must stop or hand off.', placeholder: 'For example: case-08 has conflicting sources; expect STOP and a human decision.' },
      runEvidence: { label: 'How can someone rerun it, and where is the actual result?', help: 'Record the command or steps, fixture version, output file, and pass/fail count. Never paste secrets or private paths.', placeholder: 'For example: npm test; fixture v0.2; 7/8 passed and case-08 stopped as expected.' },
      contribution: { label: 'How does your contribution differ from the starter?', help: 'List what you retained, changed, added, and did not finish.', placeholder: 'For example: kept the schema; added two cases and conflict routing; did not add a live model.' },
      reviewEvidence: { label: 'Who actually reviewed what?', help: 'Write “not independently reviewed” when that is true. Never invent a reviewer.', placeholder: 'For example: not independently reviewed; self-checked against the rubric; next ask a peer to rerun cases 07 and 08.' }
    },
    safetyLegend: 'Ownership checks before handoff or publication',
    safetyHelp: 'A check is your own confirmation, not site verification. Keep the project private while any item remains unconfirmed.',
    safety: { ownership: 'I own or am authorised to use all code, writing, data, and images.', synthetic: 'The project contains no employer, client, personal, credential, or other non-public data.', secrets: 'I checked current files and version history for credentials or secrets.', readme: 'The README separates fixture evidence, unverified outcomes, limits, and my contribution.' },
    rememberLabel: 'Remember this draft in this browser',
    rememberHelp: 'Nothing is stored by default. When checked, the draft is written only to this browser’s local storage and is not uploaded. Unchecking removes the saved draft.',
    saved: 'The draft is updated in this browser.',
    notSaved: 'The draft exists only on this page and will clear on refresh.',
    storageUpdating: 'Confirming this browser’s storage state.',
    storageWriteError: 'The browser could not update local storage. This draft remains on the current page, and an older saved version may still exist.',
    restoreAction: 'Restore a draft from this browser',
    restoreSuccess: 'The saved draft has been restored.',
    restoreEmpty: 'There is no saved draft in this browser.',
    restoreError: 'The saved draft could not be read. No content was loaded.',
    copyAction: 'Copy contribution receipt',
    copySuccess: 'Markdown receipt copied.',
    copyError: 'The browser did not allow copying. Copy the fields manually.',
    receiptTitle: 'Portfolio capstone contribution receipt',
    statusTitle: 'Current status',
    statuses: ['Not defined', 'Defined, not run', 'Run recorded, contribution not explained', 'Contribution recorded, review missing', 'Review recorded, ownership decision pending', 'Ready for the owner to decide whether to publish'],
    selfReported: 'Self-recorded local status; not verified by this site or a third party.'
  }
};

function validStoredState(value: unknown): value is CapstoneState {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<CapstoneState>;
  return FIELD_IDS.every(id => typeof record[id] === 'string')
    && Boolean(record.safety)
    && SAFETY_IDS.every(id => typeof record.safety?.[id] === 'boolean')
    && record.remember === true;
}

export function PortfolioCapstonePath({
  locale,
  runnableHref,
  starterTitle,
  roleArticleHref,
  proofArticleHref,
}: {
  locale: Locale;
  runnableHref?: string;
  starterTitle?: string;
  roleArticleHref?: string;
  proofArticleHref?: string;
}) {
  const text = copy[locale];
  const [state, setState] = useState<CapstoneState>(emptyState);
  const [persistenceReady, setPersistenceReady] = useState(false);
  const [storageWriteState, setStorageWriteState] = useState<StorageWriteState>('idle');
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [restoreState, setRestoreState] = useState<RestoreState>('idle');

  useEffect(() => {
    if (!persistenceReady) return;
    let nextWriteState: StorageWriteState;
    try {
      if (state.remember) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      else window.localStorage.removeItem(STORAGE_KEY);
      nextWriteState = 'success';
    } catch {
      nextWriteState = 'error';
    }
    let active = true;
    queueMicrotask(() => {
      if (active) setStorageWriteState(nextWriteState);
    });
    return () => { active = false; };
  }, [persistenceReady, state]);

  const completedGates = useMemo(() => {
    const defined = Boolean(state.roleEvidence.trim() && state.problemChange.trim() && state.implementationChange.trim());
    const executed = defined && Boolean(state.newCase.trim() && state.failureCase.trim() && state.runEvidence.trim());
    const explained = executed && Boolean(state.contribution.trim());
    const reviewed = explained && Boolean(state.reviewEvidence.trim());
    const safe = reviewed && SAFETY_IDS.every(id => state.safety[id]);
    return [defined, executed, explained, reviewed, safe];
  }, [state]);

  const statusIndex = completedGates.filter(Boolean).length;
  const markdown = [
    `# ${text.receiptTitle}`,
    '',
    `- ${text.statusTitle}: ${text.statuses[statusIndex]}`,
    `- ${text.selfReported}`,
    '',
    ...FIELD_IDS.flatMap(id => [`## ${text.fields[id].label}`, state[id].trim() || 'NOT_RECORDED', '']),
    `## ${text.safetyLegend}`,
    ...SAFETY_IDS.map(id => `- [${state.safety[id] ? 'x' : ' '}] ${text.safety[id]}`),
    '',
    text.boundary
  ].join('\n');

  function updateField(id: FieldId, value: string) {
    setCopyState('idle');
    if (state.remember) setStorageWriteState('pending');
    setState(current => ({ ...current, [id]: value }));
  }

  function restoreDraft() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const saved: unknown = raw ? JSON.parse(raw) : undefined;
      if (!validStoredState(saved)) {
        setRestoreState(raw ? 'error' : 'empty');
        return;
      }
      setState(saved);
      setPersistenceReady(true);
      setStorageWriteState('pending');
      setRestoreState('success');
    } catch {
      setRestoreState('error');
    }
  }

  async function copyReceipt() {
    if (!navigator.clipboard?.writeText) {
      setCopyState('error');
      return;
    }
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyState('success');
    } catch {
      setCopyState('error');
    }
  }

  return <section id="portfolio-capstone" className="portfolio-capstone" aria-labelledby="portfolio-capstone-title">
    <header className="portfolio-capstone__header">
      <p className="eyebrow">{text.eyebrow}</p>
      <h2 id="portfolio-capstone-title">{text.title}</h2>
      <p>{text.intro}</p>
      {starterTitle ? <p className="portfolio-capstone__starter" role="note">{text.starterContext(starterTitle)}</p> : null}
      <p className="portfolio-capstone__boundary" role="note">{text.boundary}</p>
      <nav className="portfolio-capstone__links" aria-label={text.navigationLabel}>
        {roleArticleHref ? <Link href={roleArticleHref}>{text.links.role} <span aria-hidden="true">→</span></Link> : null}
        {runnableHref ? <Link href={runnableHref}>{text.links.build} <span aria-hidden="true">→</span></Link> : null}
        {proofArticleHref ? <Link href={proofArticleHref}>{text.links.proof} <span aria-hidden="true">→</span></Link> : null}
      </nav>
    </header>

    <ol className="portfolio-capstone__gates" aria-label={text.progressLabel}>
      {text.progress.map((gate, index) => <li key={gate.title} data-complete={completedGates[index] || undefined}>
        <span aria-hidden="true">{completedGates[index] ? '✓' : String(index + 1).padStart(2, '0')}</span>
        <div><h3>{gate.title}</h3><p>{gate.text}</p></div>
      </li>)}
    </ol>

    <div className="portfolio-capstone__workspace">
      <header>
        <h3>{text.sectionTitle}</h3>
        <p>{text.sectionIntro}</p>
      </header>
      <div className="portfolio-capstone__fields">
        {FIELD_IDS.map(id => <label key={id} htmlFor={`portfolio-capstone-${id}`}>
          <span>{text.fields[id].label}</span>
          <small>{text.fields[id].help}</small>
          <textarea id={`portfolio-capstone-${id}`} rows={4} maxLength={600} value={state[id]} onChange={event => updateField(id, event.target.value)} placeholder={text.fields[id].placeholder} autoComplete="off" />
        </label>)}
      </div>

      <fieldset className="portfolio-capstone__safety">
        <legend>{text.safetyLegend}</legend>
        <p>{text.safetyHelp}</p>
        {SAFETY_IDS.map(id => <label key={id}>
          <input type="checkbox" checked={state.safety[id]} onChange={event => {
            if (state.remember) setStorageWriteState('pending');
            setState(current => ({ ...current, safety: { ...current.safety, [id]: event.target.checked } }));
          }} />
          <span>{text.safety[id]}</span>
        </label>)}
      </fieldset>

      <div className="portfolio-capstone__save">
        <button className="button secondary" type="button" onClick={restoreDraft}>{text.restoreAction}</button>
        <p role="status">{restoreState === 'success' ? text.restoreSuccess : restoreState === 'empty' ? text.restoreEmpty : restoreState === 'error' ? text.restoreError : ''}</p>
        <label>
          <input type="checkbox" checked={state.remember} onChange={event => {
            setPersistenceReady(true);
            setStorageWriteState('pending');
            setState(current => ({ ...current, remember: event.target.checked }));
          }} />
          <span>{text.rememberLabel}</span>
        </label>
        <p>{text.rememberHelp}</p>
        <p role="status">{storageWriteState === 'error'
          ? text.storageWriteError
          : storageWriteState === 'pending'
            ? text.storageUpdating
            : state.remember && storageWriteState === 'success'
              ? text.saved
              : text.notSaved}</p>
      </div>

      <footer className="portfolio-capstone__result">
        <div>
          <p>{text.statusTitle}</p>
          <strong>{statusIndex}/5 · {text.statuses[statusIndex]}</strong>
          <small>{text.selfReported}</small>
        </div>
        <button className="button primary" type="button" onClick={copyReceipt}>{text.copyAction}</button>
        <p role="status" aria-live="polite">{copyState === 'success' ? text.copySuccess : copyState === 'error' ? text.copyError : ''}</p>
      </footer>
    </div>
  </section>;
}

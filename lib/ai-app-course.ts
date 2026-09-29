import { canonicalLocaleRecord, type Locale } from './types';

export type AiAppCourseSource = { label: string; href: string };

export type AiAppCourseLesson = {
  id: string;
  kind: string;
  title: string;
  scenario: string;
  objective: string;
  image: { src: string; alt: string; caption: string };
  steps: string[];
  boundary: string;
  completion: string;
  sources?: AiAppCourseSource[];
};

type AiAppCourseCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  startNote: string;
  promptTitle: string;
  promptIntro: string;
  prompt: string;
  mapTitle: string;
  objectiveLabel: string;
  stepsLabel: string;
  boundaryLabel: string;
  completionLabel: string;
  sourcesLabel: string;
  sourceNote: string;
  lessons: AiAppCourseLesson[];
  closing: {
    eyebrow: string;
    title: string;
    text: string;
    image: { src: string; alt: string; caption: string };
    items: string[];
    boundary: string;
  };
};

const sharedPromptHant = '你只可根據以下合成資料，草擬一份可核對的工作計劃。\n不要發訊息、發佈、付款、刪除、改檔案、登入網站或連接任何外部工具。\n請分開列出：已知、假設、需要我確認的資料、下一步草稿。';
const sharedPromptHans = '你只可根据以下合成资料，草拟一份可核对的工作计划。\n不要发消息、发布、付款、删除、改文件、登录网站或连接任何外部工具。\n请分开列出：已知、假设、需要我确认的资料、下一步草稿。';
const sharedPromptEn = 'Using only the synthetic material below, draft a checkable work plan.\nDo not send messages, publish, pay, delete, modify files, sign in to websites, or connect any external tools.\nSeparate: known facts, assumptions, information I need to confirm, and a next-step draft.';

/**
 * Product steps belong at the end of the shared workflow, so a changing app,
 * plan, or regional rollout does not invalidate the account-free core lesson.
 */
export const aiAppCourseCopy: Record<Locale, AiAppCourseCopy> = canonicalLocaleRecord({
  'zh-Hant': {
    eyebrow: '共同核心 → 工具實作 → 可檢查紀錄',
    title: 'Grok Bot／Codex 完整入門：七課，不靠「叫它幫我做」',
    intro: '工具的介面不同，但一個負責任的 AI 工作流程相同：先把工作合約、資料界線和人手決定寫出來，再要求草稿；最後核對、修訂或停止。這套練習扣連到日後描述工作方法的能力，不保證工作、效率或任何職涯結果。',
    startNote: '先完成 01–05。只有在最後兩課，才按你的實際資格選擇一個 app。這不是要求你註冊、付款或繞過任何地區／帳戶限制。',
    promptTitle: '全課共用的受限提示',
    promptIntro: '只在你已完成手動基線、而且準備好使用合成個案時，才把這段提示帶入選用的 app。它只要求計劃草稿。',
    prompt: sharedPromptHant,
    mapTitle: '課程地圖與完成界線',
    objectiveLabel: '這課要學會',
    stepsLabel: '完成步驟',
    boundaryLabel: '不可跨越',
    completionLabel: '完成標準',
    sourcesLabel: '官方參考',
    sourceNote: 'Grok Bot／Codex 的帳戶資格、功能、地區、組織設定和介面都可能改變。課內安裝步驟只連到官方文件；如 app 顯示不可用，請停在共同核心，不要嘗試繞過。最後核對：2026-09-27（Australia/Perth）。',
    lessons: [
      {
        id: '01', kind: '共同核心', title: '先寫工作合約，不要先叫 AI 開工',
        scenario: '假設你要整理一批合成的採購查詢，讓負責人決定下一步；你不是要 AI 代替負責人作出決定。',
        objective: '把一個模糊要求縮成可核對的五格：成果、讀者、容許資料、只准交付的草稿、何時停下並交回人。',
        image: {
          src: '/illustrations/ai-app-course/lesson-01-task-contract-v1.png',
          alt: '工作簡介和受保護的容許資料卡流向一個只產生草稿的代理圖示，最後由人選擇採用或修訂。',
          caption: '由左至右讀：工作要求和容許資料先被寫清楚，工具只產生有限草稿，最後的採用或修訂仍由人決定。',
        },
        steps: [
          '用本頁的合成個案，寫下「我要交出甚麼、給誰看、不能做甚麼」。',
          '列出最多三種可用資料；把履歷、私人訊息、公司檔案和未公開資料明確列為不可用。',
          '寫一條停止規則，例如「資料不足時只列問題，不作決定」。',
        ],
        boundary: '不要把「幫我處理這件事」當成足夠指令；沒有成果、資料和停止點，就不要開始。',
        completion: '你有一張五格工作卡，而且任何人都能判斷它要求的是草稿，不是外部行動。',
      },
      {
        id: '02', kind: '共同核心', title: '資料和情境有邊界：只給真正需要的部分',
        scenario: '你想讓工具看一個案例，但不需要讓它看到整份履歷、整個雲端硬碟或工作對話。',
        objective: '分辨「為了這個草稿而需要的合成資料」和「方便但不應提供的資料」。',
        image: {
          src: '/illustrations/ai-app-course/lesson-02-data-boundary-v1.png',
          alt: '三張青綠色合成資料卡穿過一面資料界線流向代理圖示，個人檔案、上鎖資料夾和機密文件被橙色牆阻擋。',
          caption: '左邊只有合成資料可通過；右邊即使看似有用的個人或受保護資料，也要在界線外停下。',
        },
        steps: [
          '為練習建立一小份合成文字或表格，不要複製真實個案。',
          '在工作卡旁寫下「可用」和「不可用」兩欄，並逐項檢查輸入內容。',
          '只保留會改變草稿品質的資料；多餘資料不是更完整，而是更難覆核。',
        ],
        boundary: '不輸入，不上載，也不要求 app 搜集真實個人、僱主、客戶、帳戶、密碼或內部資料。',
        completion: '你能展示一份最小合成資料包，並說出至少三類被排除的資料。',
      },
      {
        id: '03', kind: '共同核心', title: '先要求計劃，再用固定案例找錯',
        scenario: '同一個要求遇上資料完整、資料缺漏和互相矛盾時，不應得到同一個自信答案。',
        objective: '要求工具分開已知、假設和待確認事項，並用固定案例檢查它有沒有在不確定時停下。',
        image: {
          src: '/illustrations/ai-app-course/lesson-03-plan-first-v1.png',
          alt: '目標卡經過三張代表假設與問題的卡形成計劃，由人核對，右側的外發行動被暫停符號阻止。',
          caption: '好流程不是從目標直接跳到行動：先攤開假設和問題，形成計劃，讓人核對後才決定是否繼續。',
        },
        steps: [
          '人手完成三個固定案例：資料足夠、缺一個關鍵欄位、兩個來源互相矛盾。',
          '使用全課共用提示，要求輸出已知、假設、要確認的資料和下一步草稿。',
          '比較三份輸出：缺資料時是否提出問題？矛盾時是否標示衝突？有沒有擅自採取行動？',
        ],
        boundary: '「答案看起來合理」不是通過標準；未被資料支持的斷言要標為未知或交回人處理。',
        completion: '你有三個固定案例和一項具體發現：哪個假設、遺漏或越界要求令你不採用草稿。',
      },
      {
        id: '04', kind: '共同核心', title: '權限不是信任：每個動作都要有不同的閘門',
        scenario: '閱讀一份合成文件、改檔、發訊息和付款的後果不同，不能用一次「信任」處理。',
        objective: '把動作分成可讀、需覆核、必須逐次批准和絕不可授權四類。',
        image: {
          src: '/illustrations/ai-app-course/lesson-04-approval-boundary-v1.png',
          alt: '閱讀文件、修改文件、發出訊息和購物四張動作卡流向中間的手掌批准閘門，只有閱讀路徑直接通過，其他路徑暫停讓人決定。',
          caption: '綠色路徑代表低風險閱讀；改檔、發訊息和付款都停在同一個人手閘門前，等待逐次判斷。',
        },
        steps: [
          '替「讀取、改寫、發送、付款、刪除、登入、連接工具」逐一標記預設處理方法。',
          '把發送、公開、付款、刪除、權限改動和正式環境操作一律放到「問我一次」或「不准」。',
          '在 app 出現批准請求時，先核對目標、範圍、值和不能回復的後果，再決定。',
        ],
        boundary: '不要把「全部允許」或完整存取權當成省時設定；批准也不會自動撤銷已完成的動作。',
        completion: '你能解釋一個操作為何需要逐次批准，並能選擇停止而不是勉強完成。',
      },
      {
        id: '05', kind: '共同核心', title: '覆核、拒絕或交回人：草稿不是結果',
        scenario: '工具已交出一份看似整齊的草稿，但你仍要檢查它有沒有支持、假設、遺漏或越界。',
        objective: '用明確的覆核準則決定通過、修訂或交回人，而不是只憑感覺。',
        image: {
          src: '/illustrations/ai-app-course/lesson-04-review-loop-v1.png',
          alt: '草稿文件流向勾選清單，之後分成綠色通過、橙色修訂和深色交接資料夾三條結果路徑。',
          caption: '覆核後不只有「好／不好」：資料足夠才通過；可修正的回去修訂；人必須判斷的就交接。',
        },
        steps: [
          '逐項問：它是否只用了容許資料？每個主張是否能對應到輸入？它是否清楚標出未知？',
          '把每項結果記為「通過、修訂、未知／交回人」，並寫下一句原因。',
          '若修訂，給一個窄而可檢查的改動；若無法核對，停止而不是加長提示。',
        ],
        boundary: '不要把整理好的語氣、格式或多看一次當成可靠性證明。',
        completion: '你有一份三欄覆核紀錄，並能指出一件必須交回人處理的事。',
      },
      {
        id: '06', kind: 'Grok Bot 選做分支', title: 'Grok Bot：先看雲端電腦界線，再做一次受限草稿',
        scenario: 'Grok Bot 是可持續運作的雲端電腦代理，並非普通對話。這個分支只在你的帳戶顯示可用時才開始。',
        objective: '在不交出真實資料或憑證的情況下，了解共享雲端工作區、批准請求和人手接管。',
        image: {
          src: '/illustrations/ai-app-course/lesson-05-grok-bot-boundary-v1.png',
          alt: '多個代理、資料夾、瀏覽器和金鑰位於同一朵雲內，雲外有人手批准盾牌，密碼與雙重驗證被鎖定並交由人處理。',
          caption: '圖中雲端資源不是每個 Bot 獨立隔離；批准邊界以外的密碼、二步驗證與敏感動作必須由人接管。',
        },
        steps: [
          '如帳戶顯示可用，先依官方 Get started 確認資格並從官方來源安裝桌面 app；若沒有可用選項，到此為止。',
          '首個任務只給一份合成文字，要求列出計劃、來源、未能核對之處和待批准動作；不要求改動來源。',
          '每次批准前檢查目標、範圍和數值；密碼、通行金鑰、一次性碼、雙重驗證和 CAPTCHA 均由你親自完成。',
        ],
        boundary: '不要聲稱香港或任何地區必然可用。不要把真實履歷、僱主檔案、客戶資料、私人網址、密碼或驗證碼放進共享雲端工作區。',
        completion: '只使用合成資料完成一份計劃草稿，並留下「已完成、待批准、未能核對」三欄紀錄；沒有外部行動。',
        sources: [
          { label: 'Grok Bot Get started', href: 'https://docs.x.ai/grok-bot/get-started' },
          { label: 'Grok Bot approvals, security and privacy', href: 'https://docs.x.ai/grok-bot/approvals-security-and-privacy' },
          { label: 'Grok Bot files and results', href: 'https://docs.x.ai/grok-bot/files-and-results' },
        ],
      },
      {
        id: '07', kind: 'Codex 選做分支', title: 'Codex：用合成資料夾、逐次批准和覆核紀錄完成一次練習',
        scenario: 'Codex 可協助處理有結構的工作，但你仍要選擇可讀取的資料夾、權限設定和採用結果。',
        objective: '完成安裝／啟動、以合成資料夾進行受限工作、查看結果，並把方法寫成可說明的工作證據。',
        image: {
          src: '/illustrations/ai-app-course/lesson-06-codex-sandbox-v1.png',
          alt: '桌面代理流向一個只包含幾個合成檔案的受保護資料夾，人手批准閘門封鎖外部網路、訊息和付款路徑。',
          caption: 'Codex 練習只接觸專為本課建立的合成資料夾；閘門阻擋網路、訊息和付款等範圍外操作。',
        },
        steps: [
          '依官方 Quickstart 安裝並登入 ChatGPT 桌面 app，選擇 Codex；工具、方案、地區或組織設定不可用時，回到共同核心。',
          '建立一個只放合成材料的空資料夾。以 Ask for approval／逐次批准開始，不要把 Full access 當作預設。',
          '貼上全課共用提示；只要求本機草稿或計劃。完成後查看輸出和假設，保留工作卡、批准決定和三欄覆核紀錄。',
        ],
        boundary: '本課不需要 API key、Git、Node.js、Python 或真實專案。不要連接工作資料夾、雲端服務、網站或外部工具；不要以「完成任務」為理由擴大權限。',
        completion: '你有一個本機合成資料夾內的受限草稿，以及可在求職作品或面試中如實描述的工作方法紀錄；這不保證任何職位或結果。',
        sources: [
          { label: 'OpenAI Codex Quickstart', href: 'https://learn.chatgpt.com/docs/quickstart' },
          { label: 'OpenAI agent approvals and security', href: 'https://learn.chatgpt.com/docs/agent-approvals-security' },
          { label: 'OpenAI Windows desktop app', href: 'https://learn.chatgpt.com/docs/windows/windows-app' },
        ],
      },
    ],
    closing: {
      eyebrow: '完成後留下甚麼',
      title: '把方法留下來，不把 app 安裝當成能力證明',
      text: '完成課程後，你可以保留一個可覆核的本機記錄。它展示你如何界定工作、控制資料、測試不確定性和把決定交回人；不是學員成果、商業成效或求職保證。',
      image: {
        src: '/illustrations/ai-app-course/lesson-07-career-evidence-v1.png',
        alt: '工作簡介、受保護資料、檢查表和覆核紀錄流向一個證據資料夾，最後由人查看整理成的工作故事。',
        caption: '任務合約、資料界線、固定案例和覆核紀錄合在一起，才成為可檢查的工作方法說明。',
      },
      items: [
        '一張五格工作卡：成果、讀者、容許資料、草稿、停止點。',
        '一份固定案例結果和三欄覆核紀錄：通過、修訂、未知／交回人。',
        '如完成選做分支，一項逐次批准的決定和一份沒有外部行動的受限草稿。',
      ],
      boundary: '這些只證明你完成了本機練習；不證明工具準確、安全、可投入工作，也不代表已獲任何僱主、客戶或平台批准。',
    },
  },
  'zh-Hans': {
    eyebrow: '共同核心 → 工具实作 → 可核对记录',
    title: 'Grok Bot／Codex 完整入门：七课，不靠“叫它帮我做”',
    intro: '工具的界面不同，但一个负责的 AI 工作流程相同：先把工作合同、资料边界和人工决定写出来，再要求草稿；最后核对、修订或停止。这套练习关联到日后描述工作方法的能力，不保证工作、效率或任何职涯结果。',
    startNote: '先完成 01–05。只有在最后两课，才按实际资格选择一个 app。这不是要求你注册、付款或绕过任何地区／帐户限制。',
    promptTitle: '全课共用的受限提示',
    promptIntro: '只在已经完成手动基线、并准备好使用合成案例时，才把这段提示带入选用的 app。它只要求计划草稿。',
    prompt: sharedPromptHans,
    mapTitle: '课程地图与完成边界',
    objectiveLabel: '这课要学会',
    stepsLabel: '完成步骤',
    boundaryLabel: '不可跨越',
    completionLabel: '完成标准',
    sourcesLabel: '官方参考',
    sourceNote: 'Grok Bot／Codex 的帐户资格、功能、地区、组织设置和界面都可能改变。课内安装步骤只连到官方文件；如 app 显示不可用，请停在共同核心，不要尝试绕过。最后核对：2026-09-27（Australia/Perth）。',
    lessons: [
      {
        id: '01', kind: '共同核心', title: '先写工作合同，不要先叫 AI 开工',
        scenario: '假设你要整理一批合成采购查询，让负责人决定下一步；你不是要 AI 代替负责人作决定。',
        objective: '把一个模糊要求缩成可核对的五格：成果、读者、允许资料、只准交付的草稿、何时停止并交回人。',
        image: { src: '/illustrations/ai-app-course/lesson-01-task-contract-v1.png', alt: '工作简介和受保护的允许资料卡流向一个只产生草稿的代理图示，最后由人选择采用或修订。', caption: '由左到右读：工作要求和允许资料先被写清楚，工具只产生有限草稿，最后的采用或修订仍由人决定。' },
        steps: ['用本页的合成案例，写下“我要交出什么、给谁看、不能做什么”。', '列出最多三种可用资料；把简历、私人消息、公司文件和未公开资料明确列为不可用。', '写一条停止规则，例如“资料不足时只列问题，不作决定”。'],
        boundary: '不要把“帮我处理这件事”当成足够指令；没有成果、资料和停止点，就不要开始。',
        completion: '你有一张五格工作卡，而且任何人都能判断它要求的是草稿，不是外部行动。',
      },
      {
        id: '02', kind: '共同核心', title: '资料和情境有边界：只给真正需要的部分',
        scenario: '你想让工具看一个案例，但不需要让它看到整份简历、整个云端硬盘或工作对话。',
        objective: '分辨“为了这个草稿而需要的合成资料”和“方便但不应提供的资料”。',
        image: { src: '/illustrations/ai-app-course/lesson-02-data-boundary-v1.png', alt: '三张青绿色合成资料卡穿过一面资料边界流向代理图示，个人档案、上锁资料夹和机密文件被橙色墙阻挡。', caption: '左边只有合成资料可通过；右边即使看似有用的个人或受保护资料，也要在边界外停止。' },
        steps: ['为练习建立一小份合成文字或表格，不要复制真实案例。', '在工作卡旁写下“可用”和“不可用”两栏，并逐项检查输入内容。', '只保留会改变草稿品质的资料；多余资料不是更完整，而是更难复核。'],
        boundary: '不输入，不上传，也不要求 app 收集真实个人、雇主、客户、帐户、密码或内部资料。',
        completion: '你能展示一份最小合成资料包，并说出至少三类被排除的资料。',
      },
      {
        id: '03', kind: '共同核心', title: '先要求计划，再用固定案例找错',
        scenario: '同一个要求遇上资料完整、资料缺漏和互相矛盾时，不应得到同一个自信答案。',
        objective: '要求工具分开已知、假设和待确认事项，并用固定案例检查它有没有在不确定时停止。',
        image: { src: '/illustrations/ai-app-course/lesson-03-plan-first-v1.png', alt: '目标卡经过三张代表假设与问题的卡形成计划，由人核对，右侧的外发行动被暂停符号阻止。', caption: '好流程不是从目标直接跳到行动：先摊开假设和问题，形成计划，让人核对后才决定是否继续。' },
        steps: ['手动完成三个固定案例：资料足够、缺一个关键字段、两个来源互相矛盾。', '使用全课共用提示，要求输出已知、假设、要确认的资料和下一步草稿。', '比较三份输出：缺资料时是否提出问题？矛盾时是否标示冲突？有没有擅自采取行动？'],
        boundary: '“答案看起来合理”不是通过标准；未被资料支持的断言要标为未知或交回人处理。',
        completion: '你有三个固定案例和一项具体发现：哪个假设、遗漏或越界要求令你不采用草稿。',
      },
      {
        id: '04', kind: '共同核心', title: '权限不是信任：每个动作都要有不同的闸门',
        scenario: '阅读一份合成文件、改文件、发消息和付款的后果不同，不能用一次“信任”处理。',
        objective: '把动作分成可读、需复核、必须逐次批准和绝不可授权四类。',
        image: { src: '/illustrations/ai-app-course/lesson-04-approval-boundary-v1.png', alt: '阅读文件、修改文件、发出消息和购物四张动作卡流向中间的手掌批准闸门，只有阅读路径直接通过，其他路径暂停让人决定。', caption: '绿色路径代表低风险阅读；改文件、发消息和付款都停在同一个人工闸门前，等待逐次判断。' },
        steps: ['替“读取、改写、发送、付款、删除、登录、连接工具”逐一标记默认处理方法。', '把发送、公开、付款、删除、权限改动和正式环境操作一律放到“问我一次”或“不准”。', '在 app 出现批准请求时，先核对目标、范围、值和不能恢复的后果，再决定。'],
        boundary: '不要把“全部允许”或完整访问权当成省时设置；批准也不会自动撤销已完成的动作。',
        completion: '你能解释一个操作为何需要逐次批准，并能选择停止而不是勉强完成。',
      },
      {
        id: '05', kind: '共同核心', title: '复核、拒绝或交回人：草稿不是结果',
        scenario: '工具已交出一份看似整齐的草稿，但你仍要检查它有没有支持、假设、遗漏或越界。',
        objective: '用明确的复核准则决定通过、修订或交回人，而不是只凭感觉。',
        image: { src: '/illustrations/ai-app-course/lesson-04-review-loop-v1.png', alt: '草稿文件流向勾选清单，之后分成绿色通过、橙色修订和深色交接资料夹三条结果路径。', caption: '复核后不只有“好／不好”：资料足够才通过；可修正的回去修订；人必须判断的就交接。' },
        steps: ['逐项问：它是否只用了允许资料？每个主张是否能对应到输入？它是否清楚标出未知？', '把每项结果记为“通过、修订、未知／交回人”，并写下一句原因。', '若修订，给一个窄而可核对的改动；若无法核对，停止而不是加长提示。'],
        boundary: '不要把整齐的语气、格式或多看一次当成可靠性证明。',
        completion: '你有一份三栏复核记录，并能指出一件必须交回人处理的事。',
      },
      {
        id: '06', kind: 'Grok Bot 选做分支', title: 'Grok Bot：先看云端电脑边界，再做一次受限草稿',
        scenario: 'Grok Bot 是可持续运行的云端电脑代理，并非普通对话。这个分支只在你的帐户显示可用时才开始。',
        objective: '在不交出真实资料或凭证的情况下，了解共享云端工作区、批准请求和人工接管。',
        image: { src: '/illustrations/ai-app-course/lesson-05-grok-bot-boundary-v1.png', alt: '多个代理、资料夹、浏览器和金钥位于同一朵云内，云外有人工批准盾牌，密码与双重验证被锁定并交由人处理。', caption: '图中云端资源不是每个 Bot 独立隔离；批准边界以外的密码、两步验证与敏感动作必须由人接管。' },
        steps: ['如帐户显示可用，先依官方 Get started 确认资格并从官方来源安装桌面 app；若没有可用选项，到此为止。', '首个任务只给一份合成文字，要求列出计划、来源、未能核对之处和待批准动作；不要求改动来源。', '每次批准前检查目标、范围和数值；密码、通行金钥、一次性码、双重验证和 CAPTCHA 均由你亲自完成。'],
        boundary: '不要声明香港或任何地区必然可用。不要把真实简历、雇主文件、客户资料、私人网址、密码或验证码放进共享云端工作区。',
        completion: '只使用合成资料完成一份计划草稿，并留下“已完成、待批准、未能核对”三栏记录；没有外部行动。',
        sources: [{ label: 'Grok Bot Get started', href: 'https://docs.x.ai/grok-bot/get-started' }, { label: 'Grok Bot approvals, security and privacy', href: 'https://docs.x.ai/grok-bot/approvals-security-and-privacy' }, { label: 'Grok Bot files and results', href: 'https://docs.x.ai/grok-bot/files-and-results' }],
      },
      {
        id: '07', kind: 'Codex 选做分支', title: 'Codex：用合成资料夹、逐次批准和复核记录完成一次练习',
        scenario: 'Codex 可协助处理有结构的工作，但你仍要选择可读取的资料夹、权限设置和采用结果。',
        objective: '完成安装／启动、以合成资料夹进行受限工作、查看结果，并把方法写成可说明的工作证据。',
        image: { src: '/illustrations/ai-app-course/lesson-06-codex-sandbox-v1.png', alt: '桌面代理流向一个只包含几个合成文件的受保护资料夹，人工批准闸门封锁外部网络、消息和付款路径。', caption: 'Codex 练习只接触专为本课建立的合成资料夹；闸门阻挡网络、消息和付款等范围外操作。' },
        steps: ['依官方 Quickstart 安装并登录 ChatGPT 桌面 app，选择 Codex；工具、方案、地区或组织设置不可用时，回到共同核心。', '建立一个只放合成材料的空资料夹。以 Ask for approval／逐次批准开始，不要把 Full access 当作默认。', '贴上全课共用提示；只要求本地草稿或计划。完成后查看输出和假设，保留工作卡、批准决定和三栏复核记录。'],
        boundary: '本课不需要 API key、Git、Node.js、Python 或真实项目。不要连接工作资料夹、云端服务、网站或外部工具；不要以“完成任务”为理由扩大权限。',
        completion: '你有一个本地合成资料夹内的受限草稿，以及可在求职作品或面试中如实描述的工作方法记录；这不保证任何职位或结果。',
        sources: [{ label: 'OpenAI Codex Quickstart', href: 'https://learn.chatgpt.com/docs/quickstart' }, { label: 'OpenAI agent approvals and security', href: 'https://learn.chatgpt.com/docs/agent-approvals-security' }, { label: 'OpenAI Windows desktop app', href: 'https://learn.chatgpt.com/docs/windows/windows-app' }],
      },
    ],
    closing: {
      eyebrow: '完成后留下什么', title: '把方法留下来，不把 app 安装当成能力证明',
      text: '完成课程后，你可以保留一个可复核的本地记录。它展示你如何界定工作、控制资料、测试不确定性和把决定交回人；不是学员成果、商业成效或求职保证。',
      image: { src: '/illustrations/ai-app-course/lesson-07-career-evidence-v1.png', alt: '工作简介、受保护资料、检查表和复核记录流向一个证据资料夹，最后由人查看整理成的工作故事。', caption: '任务合同、资料边界、固定案例和复核记录合在一起，才成为可核对的工作方法说明。' },
      items: ['一张五格工作卡：成果、读者、允许资料、草稿、停止点。', '一份固定案例结果和三栏复核记录：通过、修订、未知／交回人。', '如完成选做分支，一项逐次批准的决定和一份没有外部行动的受限草稿。'],
      boundary: '这些只证明你完成了本地练习；不证明工具准确、安全、可投入工作，也不代表已获任何雇主、客户或平台批准。',
    },
  },
  en: {
    eyebrow: 'SHARED CORE → APP PRACTICE → CHECKABLE RECORD',
    title: 'A complete Grok Bot / Codex beginner course: seven lessons beyond “do it for me”',
    intro: 'The interfaces differ, but responsible AI work follows one pattern: write the task contract, data boundary, and human decision first; then request a draft; then check, revise, or stop. These exercises help you describe a working method later. They do not guarantee a job, efficiency, or any career outcome.',
    startNote: 'Complete 01–05 first. Only in the last two lessons choose one app if you are eligible. You are never asked to sign up, pay, or bypass a regional or account restriction.',
    promptTitle: 'The constrained prompt used throughout',
    promptIntro: 'Only take this into an optional app after you have done the manual baseline and prepared synthetic material. It requests a planning draft only.',
    prompt: sharedPromptEn,
    mapTitle: 'Course map and completion boundary',
    objectiveLabel: 'Learn to', stepsLabel: 'Do this', boundaryLabel: 'Do not cross', completionLabel: 'Completion check', sourcesLabel: 'Official references',
    sourceNote: 'Grok Bot / Codex eligibility, features, regions, organisation settings, and interfaces can change. Installation steps link only to official documentation. If an app is unavailable, stop at the shared core—do not bypass it. Last checked: 2026-09-27 (Australia/Perth).',
    lessons: [
      {
        id: '01', kind: 'Shared core', title: 'Write a task contract before asking AI to work',
        scenario: 'Imagine sorting synthetic purchasing enquiries so an accountable person can decide what happens next. The AI is not the decision owner.',
        objective: 'Turn a vague request into five checkable fields: outcome, reader, permitted material, draft-only deliverable, and a stop-and-handoff point.',
        image: { src: '/illustrations/ai-app-course/lesson-01-task-contract-v1.png', alt: 'A work brief and protected permitted-context cards flow to an agent icon that produces only a draft, then a person chooses approve or revise.', caption: 'Read left to right: state the work and permitted context first, let the tool draft only, and leave adoption or revision to a person.' },
        steps: ['Use the synthetic case on this page to state what you will produce, who will read it, and what must not happen.', 'List at most three permitted sources; explicitly exclude résumés, private messages, company files, and unpublished material.', 'Write a stop rule, such as “if a key field is missing, list questions rather than decide.”'],
        boundary: '“Handle this for me” is not enough. Do not start without an outcome, data boundary, and stop point.',
        completion: 'You have a five-field task card that makes it clear the request is for a draft, not an external action.',
      },
      {
        id: '02', kind: 'Shared core', title: 'Set a data and context boundary: give only what is needed',
        scenario: 'A tool may need one synthetic case, not your full résumé, cloud drive, or work conversation.',
        objective: 'Distinguish synthetic material needed for this draft from material that is convenient but inappropriate to provide.',
        image: { src: '/illustrations/ai-app-course/lesson-02-data-boundary-v1.png', alt: 'Three teal synthetic-data cards pass a data boundary toward an agent, while a profile, locked folder, and confidential document are blocked by an amber wall.', caption: 'Only the synthetic material on the left passes. Useful-looking personal or protected material stays outside the boundary.' },
        steps: ['Make a small synthetic text or table for practice; do not copy a real case.', 'Add permitted and excluded columns next to your task card, then inspect every item before use.', 'Keep only material that changes the quality of the draft. Extra context is not automatically better context.'],
        boundary: 'Do not enter, upload, or ask the app to collect real personal, employer, client, account, password, or internal material.',
        completion: 'You can show a minimal synthetic data pack and name at least three types of excluded material.',
      },
      {
        id: '03', kind: 'Shared core', title: 'Ask for a plan first, then find faults with fixed cases',
        scenario: 'The same request should not yield the same confident answer when data is complete, missing a key field, or contradictory.',
        objective: 'Ask the tool to separate facts, assumptions, and questions, then check whether it stops when uncertainty matters.',
        image: { src: '/illustrations/ai-app-course/lesson-03-plan-first-v1.png', alt: 'A goal card branches into three assumption and question cards, converges into a plan, reaches human review, and an outbound action is stopped by a pause symbol.', caption: 'A good workflow does not jump from goal to action: surface assumptions and questions, make a plan, and let a person review before continuing.' },
        steps: ['Manually complete three fixed cases: sufficient data, one missing key field, and two conflicting sources.', 'Use the constrained prompt to request known facts, assumptions, information to confirm, and a next-step draft.', 'Compare the three outputs: does it ask when data is missing, flag conflict, and avoid taking action?'],
        boundary: 'A plausible-sounding answer is not a pass. Unsupported claims must be marked unknown or handed back to a person.',
        completion: 'You have three fixed cases and one precise reason—an assumption, omission, or boundary breach—for rejecting a draft.',
      },
      {
        id: '04', kind: 'Shared core', title: 'Permission is not trust: each action needs its own gate',
        scenario: 'Reading a synthetic document, editing a file, sending a message, and making a purchase have different consequences.',
        objective: 'Classify actions as readable, review-required, approval-required, or never authorised for this exercise.',
        image: { src: '/illustrations/ai-app-course/lesson-04-approval-boundary-v1.png', alt: 'Four action cards for reading, editing, messaging, and purchasing travel toward a central approval gate. Only reading passes directly; the rest pause for a human decision.', caption: 'The teal path represents low-risk reading. Editing, messaging, and purchases all stop at the same human gate for a one-at-a-time decision.' },
        steps: ['Mark the default treatment for read, edit, send, pay, delete, log in, and connect a tool.', 'Put sending, publishing, payment, deletion, permission changes, and production work at “ask once” or “never”.', 'When an app requests approval, inspect target, scope, value, and irreversible consequence before deciding.'],
        boundary: 'Do not make “allow everything” or full access a convenience default. Approval does not undo an already completed action.',
        completion: 'You can explain why one operation needs an individual approval and can choose to stop instead of forcing completion.',
      },
      {
        id: '05', kind: 'Shared core', title: 'Review, reject, or hand off: a draft is not a result',
        scenario: 'The tool returns a polished draft, but you still have to check support, assumptions, omissions, and boundaries.',
        objective: 'Use explicit criteria to pass, revise, or hand work back to a person instead of relying on a feeling.',
        image: { src: '/illustrations/ai-app-course/lesson-04-review-loop-v1.png', alt: 'A draft document flows to a checklist then branches into green pass, amber revise, and dark handoff folder outcomes.', caption: 'Review has more than a yes/no result: pass only with sufficient support, revise what is repairable, and hand off what requires human judgment.' },
        steps: ['Ask whether it used only permitted material, whether each claim traces to input, and whether unknowns are visible.', 'Record each result as pass, revise, or unknown / handoff, with one reason.', 'For a revision, ask for one narrow checkable change. If you cannot verify it, stop rather than expand the prompt.'],
        boundary: 'A neat tone, format, or a second reading is not evidence of reliability.',
        completion: 'You have a three-column review record and can name one item that must go back to a person.',
      },
      {
        id: '06', kind: 'Optional Grok Bot branch', title: 'Grok Bot: see the cloud-computer boundary before one constrained draft',
        scenario: 'Grok Bot is a persistent cloud-computer agent, not ordinary chat. Begin this branch only when your account shows it is available.',
        objective: 'Understand shared cloud workspace, approval requests, and human takeover without exposing real material or credentials.',
        image: { src: '/illustrations/ai-app-course/lesson-05-grok-bot-boundary-v1.png', alt: 'Several agents, a folder, browser, and key sit inside one cloud. A human approval shield is outside, and a locked password and second-factor handoff goes to a person.', caption: 'Cloud resources shown here are not isolated per Bot. Passwords, second factors, and sensitive actions beyond the approval boundary stay with a person.' },
        steps: ['If your account shows access, use the official Get started guide to confirm eligibility and install the desktop app from an official source. If no option is available, stop here.', 'For the first task, provide one synthetic text and ask for a plan, sources, unverified items, and pending approvals. Do not ask it to change the source.', 'Before every approval, inspect target, scope, and value. Complete passwords, passkeys, one-time codes, 2FA, and CAPTCHAs yourself.'],
        boundary: 'Do not claim that Hong Kong or any location is guaranteed access. Do not place a real résumé, employer file, client material, private URL, password, or verification code in a shared cloud workspace.',
        completion: 'With synthetic material only, you have a planning draft and a three-column record of completed, pending approval, and unverified items—without external action.',
        sources: [{ label: 'Grok Bot Get started', href: 'https://docs.x.ai/grok-bot/get-started' }, { label: 'Grok Bot approvals, security and privacy', href: 'https://docs.x.ai/grok-bot/approvals-security-and-privacy' }, { label: 'Grok Bot files and results', href: 'https://docs.x.ai/grok-bot/files-and-results' }],
      },
      {
        id: '07', kind: 'Optional Codex branch', title: 'Codex: use a synthetic folder, individual approvals, and a review record',
        scenario: 'Codex can support structured work, but you still choose what folder it may access, which permissions apply, and whether to use the result.',
        objective: 'Complete installation/startup, constrained work in a synthetic folder, result inspection, and a truthful record of your working method.',
        image: { src: '/illustrations/ai-app-course/lesson-06-codex-sandbox-v1.png', alt: 'A desktop agent points only to a protected folder containing several synthetic files, while a human gate blocks external web, message, and payment paths.', caption: 'The Codex exercise touches only a folder made for this course. The gate blocks out-of-scope actions such as web access, messaging, and payment.' },
        steps: ['Follow the official Quickstart to install and sign in to the ChatGPT desktop app, then select Codex. If plan, region, tool, or organisation settings do not allow it, return to the shared core.', 'Create an empty folder containing only synthetic material. Start in Ask for approval / approval-on-request, not Full access.', 'Paste the constrained prompt and request only a local draft or plan. Inspect output and assumptions, then retain the task card, approval decision, and three-column review record.'],
        boundary: 'This lesson needs no API key, Git, Node.js, Python, or real project. Do not connect a work folder, cloud service, website, or external tool; a task goal does not justify broader permission.',
        completion: 'You have a constrained draft in a local synthetic folder and an honest record you could describe in a portfolio or interview. This does not guarantee a role or outcome.',
        sources: [{ label: 'OpenAI Codex Quickstart', href: 'https://learn.chatgpt.com/docs/quickstart' }, { label: 'OpenAI agent approvals and security', href: 'https://learn.chatgpt.com/docs/agent-approvals-security' }, { label: 'OpenAI Windows desktop app', href: 'https://learn.chatgpt.com/docs/windows/windows-app' }],
      },
    ],
    closing: {
      eyebrow: 'WHAT TO KEEP AFTERWARD', title: 'Keep the method; do not mistake an installed app for proof of ability',
      text: 'After the course, keep a reviewable local record. It shows how you defined work, controlled data, tested uncertainty, and returned decisions to a person. It is not a learner result, business-impact statement, or job guarantee.',
      image: { src: '/illustrations/ai-app-course/lesson-07-career-evidence-v1.png', alt: 'A work brief, protected data, checklist, and review record flow into an evidence folder, then a person reviews the assembled work story.', caption: 'A task contract, data boundary, fixed cases, and review record together make a checkable account of a working method.' },
      items: ['One five-field task card: outcome, reader, permitted material, draft, and stop point.', 'One fixed-case result plus a three-column review record: pass, revise, unknown / handoff.', 'If you completed an optional branch, one individual approval decision and constrained draft with no external action.'],
      boundary: 'These materials show only that you completed a local exercise. They do not prove a tool is accurate, safe, or ready for work, nor that an employer, client, or platform has approved anything.',
    },
  },
});

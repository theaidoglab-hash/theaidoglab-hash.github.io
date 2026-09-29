import { canonicalLocaleRecord, type Locale } from '@/lib/types';

export const BUILD_LAB_CASE_IDS = [
  'no-code',
  'coding-starter',
  'approval',
  'retrieval',
  'reliability',
  'predictive-ml',
  'public-data-eval',
  'public-statistics'
] as const;

export type BuildLabCaseId = typeof BUILD_LAB_CASE_IDS[number];

type BuildLabCase = {
  label: string;
  title: string;
  fit: string;
  firstArtifact: string;
  technical: string;
  delivery: string;
  boundary: string;
  action: string;
  href: string;
};

export type BuildLabCaseSelectorCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  goalLabel: string;
  goalHelp: string;
  selectionPlaceholder: string;
  emptySelection: {
    title: string;
    text: string;
    noCodeAction: string;
    codingAction: string;
  };
  resultEyebrow: string;
  selectionStatus: string;
  firstArtifactHeading: string;
  technicalHeading: string;
  deliveryHeading: string;
  boundaryHeading: string;
  ownIdeaTitle: string;
  ownIdeaText: string;
  ownIdeaAction: string;
  localBoundary: string;
  cases: Record<BuildLabCaseId, BuildLabCase>;
};

export type BuildLabCaseSelectorMetaCopy = {
  timeLabel: string;
  prerequisiteLabel: string;
  cases: Record<BuildLabCaseId, { time: string; prerequisite: string }>;
};

export type CodingStarterNextStepCopy = {
  title: string;
  text: string;
  action: string;
};

export const buildLabCaseSelectorCopy: Record<Locale, BuildLabCaseSelectorCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '先揀一個',
    title: '想畀人先睇明白你做到乜？揀一個 Lab',
    intro: '未有自己題目都可以開始。揀一個你想畀覆核者睇到嘅判斷，做一份最細、只限本地、可以核對嘅成果。',
    goalLabel: '你想作品集先講清哪一種能力？',
    goalHelp: '呢個選擇器只幫你揀本地練習嘅起點；唔會評估你、儲存資料，或者推薦職位、課程和工具。',
    selectionPlaceholder: '請先揀一個起點',
    emptySelection: {
      title: '先揀今次想練嘅方式',
      text: '暫時唔寫 Code，就揀 15 分鐘、毋須帳戶嘅手動檢查；可以睇小型 TypeScript 函式同測試結果，先揀 45–60 分鐘嘅寫 Code 練習。兩者都只限本機、虛構材料。',
      noCodeAction: '揀不寫 Code · 15 分鐘',
      codingAction: '揀寫 Code · 45–60 分鐘',
    },
    resultEyebrow: '建議先做呢個',
    selectionStatus: '已揀 {case}。下面會列出第一份成果、實作要做嘅嘢、交畀人睇時要講清乜，同開始時要守嘅界線。',
    firstArtifactHeading: '先做出呢一份成果',
    technicalHeading: '實作會練到乜',
    deliveryHeading: '交付時要講清楚嘅事',
    boundaryHeading: '一開始唔好碰乜',
    ownIdeaTitle: '已經有個項目想法？',
    ownIdeaText: '先將個想法收窄成一個虛構決定、最後拍板的人、現時做法、資料界線和停止條件，再決定值唔值得放入 Lab。',
    ownIdeaAction: '先檢查我嘅項目想法',
    localBoundary: '所有建議案例只用本地、合成或公開而另行核對嘅材料。完成一個本機測試範例，唔等於已部署、獲批准、有商業成效，或可以放進真實帳戶。',
    cases: {
      'no-code': {
        label: '我想要一個唔使帳戶或連接器嘅安全練習',
        title: 'No-code Starter Lab',
        fit: '適合剛起步，又唔想將一段好睇輸出當成系統的人。呢個練習會帶你將模糊工作拆成有限決定、固定檢查情境和人手交接。',
        firstArtifact: '用提供嘅合成 CSV 手動完成 AC-01：保留 HLS-001，route 標為 DRAFT_REVIEW_NOTE，同確認冇有外部動作。15 分鐘做到就可以停；AC-02 至 AC-06 只係可選延伸。',
        technical: '可帶走嘅資料格式、把看似指示嘅欄位當資料處理，同固定輸出路徑；核心 15 分鐘練習唔需要模型、API 金鑰、帳戶或連接器。六個檢查情境係之後可選延伸。',
        delivery: '把「整理補貨資料」收窄成人手覆核者可接受或拒絕的本地草稿，記低資料權限、禁止動作、最後拍板的人同 PASS／REVISE／STOP。',
        boundary: '唔好用真實試算表、供應商、帳戶、瀏覽器登入狀態或自動化；唔可以用草稿下單、通知或改庫存。',
        action: '開始 No-code Starter Lab',
        href: '/no-code-starter-lab'
      },
      'coding-starter': {
        label: '我想先練一個可覆核的小型程式改動',
        title: 'Coder Starter Lab',
        fit: '適合已經想寫程式，但唔想由大型程式庫、框架或一個好睇展示開始的人。用一個可丟棄嘅純函式，展示你怎樣守住範圍、情境、覆核同退回舊版。',
        firstArtifact: '下載英文工作摘要、程式骨架同六個固定情境；未睇 AI 助手輸出前先寫好每種預期路徑，再由覆核者記錄 PASS、REVISE 或 STOP。',
        technical: '一個唔讀寫檔案、唔連網、唔要金鑰嘅 TypeScript 純函式；BLOCKED 優先嘅判斷次序、最小改動範圍、固定情境，同 AI 助手交出嘅計劃／改動內容／測試覆核。',
        delivery: '把「請 AI 助手改程式碼」收窄成一份人手可接受、拒絕或丟棄嘅本地改動建議，保留不做的事、資料界線、最後拍板的人和退回舊版紀錄。',
        boundary: '唔好貼去公司程式庫、真實資料、帳戶或工具；唔可以跑指令、裝套件、提交版本、發送或部署，更唔可以將本地覆核當成正式環境證明。',
        action: '開始 Coder Starter Lab',
        href: '/coding-starter-lab'
      },
      approval: {
        label: '我想清楚分開草稿同真正發送',
        title: 'Approval Queue',
        fit: '適合想練唔使寫程式嘅自動化流程。呢個練習將「幫手寫回覆」和「替人送出回覆」分開，令覆核者睇得見邊個可以批准，而唔只係一個聊天畫面。',
        firstArtifact: '寫一份可做／不可做清單：哪些虛構請求可變成附來源草稿、哪些要交人手、哪些必須停下；再加一條「不准發送」測試情境。',
        technical: '用虛構 FAQ 資料找資料、用固定回覆模擬器、預先寫好的檢查情境；遇到惡意指示或要求自行發送時要攔住，並只留不含個人資料的處理紀錄。',
        delivery: '最後決定留俾覆核者。README 要寫清資料可否用、出錯怎樣記錄、作品不可聲稱甚麼，讓人可以問到範圍和風險。',
        boundary: '唔好連結電郵信箱、CRM、工單或訊息服務；亦唔好把草稿當成已批准答案或已發送訊息。',
        action: '打開 Approval Queue',
        href: '/articles/approval-queue-low-code-portfolio'
      },
      retrieval: {
        label: '我想練一個會附來源、遇例外會交人嘅 LLM 流程',
        title: 'PolicyPilot',
        fit: '適合想做內部文件問答，又肯由少量虛構文件開始的人。重點是可用文件、簡單對照方法、固定情境和交人手的例外，不是生成一段好睇答案。',
        firstArtifact: '寫一份虛構政策摘要：列出可用文件、問題、用關鍵字搜尋的簡單對照、不能回答的情況，以及一個一定要交人手的例外。',
        technical: '有版本的虛構政策文件、關鍵字搜尋對照、回答要附哪段資料、固定的正確和不安全情境、移除內容的處理紀錄、推出前檢查和退回舊版。',
        delivery: '寫清支援人員找錯資料的後果、誰可以批准、甚麼資料不可入流程；本地答案不等於正確率或商業成效。',
        boundary: '唔好把公司文件、客戶資料、內部提示詞或真實政策放進案例；助手亦唔可以自行決定或發送答案。',
        action: '打開 PolicyPilot',
        href: '/articles/enterprise-ai-portfolio-policy-pilot'
      },
      reliability: {
        label: '我想練批次工作有冇好好失敗',
        title: 'AI Batch Worker',
        fit: '適合已寫程式，想展示一次成功以外的處理。個工作先要懂得重試、由中斷位置繼續、超出界線時停，再談模型或速度。',
        firstArtifact: '定義一條只供人手覆核的補充資料紀錄，放入重複項目、429、逾時和無效輸入四種固定情境；寫清中斷後由哪裡繼續，和失敗項目交誰看。',
        technical: '限制每次處理幾多項、同一項唔會重複處理、失敗後何時再試、上次做到邊度、失敗項目交人覆核、每次執行紀錄、花費上限和回歸測試。',
        delivery: '將補充資料和真正改文件分開，記低預算、覆核者、失敗後去向，以及呢個本地練習唔可以證明嘅可靠性或商業結果。',
        boundary: '唔好連真實文件、工作隊列或 API；本地重試測試唔可以寫成正式環境速度、節省成本或服務承諾的證明。',
        action: '打開 AI Batch Worker',
        href: '/articles/build-a-resumable-ai-batch-worker'
      },
      'predictive-ml': {
        label: '我想練用模型幫人手隊列排先後',
        title: 'Renewal Triage',
        fit: '適合想練機器學習，但唔想將一個分數扮成自動業務決定的人。呢個練習只會為固定人手名額嘅覆核隊列排先後。',
        firstArtifact: '寫一份「當時可用資料」規則、固定每天可覆核數量、透明規則做對照，和一條偷用將來資料的拒絕情境。',
        technical: '檢查有冇偷睇將來資料、用規則做對照、比較候選模型；模型分數、隊列處理和實際流程訊號要分開看，並保留推出前檢查、持續留意和退回舊版。',
        delivery: '把排先後同聯絡客戶、挽留或定價分開，寫清最後拍板的人和每日可處理數量；不可聲稱真正成效。',
        boundary: '唔好用真實客戶、付款、續約或 CRM 資料；分數唔可以觸發聯絡、價格或資格決定。',
        action: '打開 Renewal Triage',
        href: '/articles/renewal-triage-mlops'
      },
      'public-data-eval': {
        label: '我想練把公開資料整理成畀人覆核的資料包',
        title: 'KEV Review Packet',
        fit: '適合想練公開資料收取和有界限 LLM 檢查的人。呢個練習只做畀安全覆核者睇嘅資料包；公開資料唔係某公司受影響嘅證據。',
        firstArtifact: '寫一張來源資料紀錄：可用欄位、資料格式、授權條款、仍未知的事和不能採取的動作；再寫一條「來源不合格」情境。',
        technical: '檢查欄位和格式；結果只可為「拒絕來源」或「可交人覆核」；固定 JSON 格式、固定情境、可選但只限本地的 Promptfoo 設定、逐條情境比較，以及一項未過就不可推出的規則。',
        delivery: '清楚分開公開紀錄、內部資產證據和真正的漏洞處理決定，並記低誰拍板、怎樣回退、案例不能聲稱甚麼。',
        boundary: '唔好掃描、修補、開工單、查內部資產或聲稱任何公司受影響；本地情境通過唔等於安全批准。',
        action: '打開 KEV Review Packet',
        href: '/articles/build-a-public-data-kev-review-packet'
      },
      'public-statistics': {
        label: '我想核對來源，再寫公開統計背景摘要',
        title: 'Workforce Signal Brief',
        fit: '適合想把公開統計資料整理成有界限的研究流程，而不把圖表包裝成就業或薪酬預測的人。',
        firstArtifact: '寫一張來源資料紀錄，列出資料發布頁或 API 網址、系列編號、統計期、地區、單位、調整方法和修訂狀態，再用合成資料練一條拒絕情境。',
        technical: '檢查描述資料、時間順序、時效、私隱欄位和可否採取行動；先完成不用模型的資料包，才放一個可選的 gpt-5-mini 範例和 Promptfoo 情境表。',
        delivery: '呢個練習只協助負責人判斷資料是否足夠寫背景摘要；測試有冇通過、來源是否適合、同勞動市場可以講乜要分開。',
        boundary: '唔好假裝已下載、查詢或重現公開統計數字；唔可以作招聘、薪酬、簽證、投資、政策或發佈決定。',
        action: '查看 Workforce Signal Brief',
        href: '/articles/build-a-source-bound-context-brief'
      }
    }
  },
  'zh-TW': {
    eyebrow: '先選一個',
    title: '想讓作品集先講清哪種能力？選一個 Lab 開始',
    intro: '還沒有自己的題目也能開始。選一個想讓覆核者看見的判斷，先完成一份最小、可在本機核對的成果。',
    goalLabel: '你最想先讓作品集說明哪種能力？',
    goalHelp: '這個選擇器只幫你選擇本地練習的起點，不會評估你、儲存資料，或推薦職務、課程與工具。',
    selectionPlaceholder: '請先選擇一個起點',
    emptySelection: {
      title: '先選這次想練的方式',
      text: '暫時不寫 Code，就選 15 分鐘、不需帳號的手動檢查；能閱讀小型 TypeScript 函式與測試結果，再選 45–60 分鐘的寫 Code 練習。兩者都只使用本機、虛構材料。',
      noCodeAction: '選不寫 Code · 15 分鐘',
      codingAction: '選寫 Code · 45–60 分鐘',
    },
    resultEyebrow: '建議先做這個',
    selectionStatus: '已選擇 {case}。下方列出第一份成果、實作重點、交付時要交代的事，以及開始時要守的界線。',
    firstArtifactHeading: '先做出這一份成果',
    technicalHeading: '實作會練到什麼',
    deliveryHeading: '交付時要講清楚的事',
    boundaryHeading: '一開始不要碰什麼',
    ownIdeaTitle: '已經有項目想法？',
    ownIdeaText: '先把它縮小成一個虛構決策、負責拍板的人、目前做法、資料邊界與何時應停止，再決定是否值得放進 Lab。',
    ownIdeaAction: '先檢查自己的項目想法',
    localBoundary: '所有建議案例只使用本地、合成或公開且需另行核對的材料。完成一個本機測試範例，並不等於已部署、獲核准、有商業成效，或可放入真實帳戶。',
    cases: {
      'no-code': {
        label: '我想先做一個不需帳號或連接器的安全練習',
        title: 'No-code Starter Lab',
        fit: '適合剛起步，又不想把一段漂亮輸出當成系統的人。先證明你能把模糊工作拆成有限決策、固定檢查情境與人工交接。',
        firstArtifact: '用提供的合成 CSV 手動完成 AC-01：保留 HLS-001，route 標為 DRAFT_REVIEW_NOTE，並確認沒有外部動作。15 分鐘完成即可停止；AC-02 至 AC-06 只是可選延伸。',
        technical: '可攜式欄位格式、把看似指令但不可信的儲存格當資料處理，以及固定輸出路徑；核心 15 分鐘練習不需要模型、API 金鑰、帳號或連接器。六個檢查情境是之後可選的延伸。',
        delivery: '把「整理補貨資料」收窄成人工覆核者可接受或拒絕的本地草稿，保留資料權限、禁止動作、最後拍板的人與 PASS／REVISE／STOP。',
        boundary: '不要使用真實試算表、供應商、帳號、瀏覽器登入狀態或自動化；不可用草稿下單、通知或修改庫存。',
        action: '開始 No-code Starter Lab',
        href: '/no-code-starter-lab'
      },
      'coding-starter': {
        label: '我想先練一個可供覆核的小型程式改動',
        title: 'Coder Starter Lab',
        fit: '適合已經想寫程式，但不想從大型程式庫、框架或漂亮展示開始的人。先用一個可丟棄的純函式，展示你如何守住範圍、情境、覆核與回退。',
        firstArtifact: '下載英文工作摘要、程式骨架與六個固定情境；未看 AI 助手輸出前，先寫好每條預期路徑，再由覆核者記錄 PASS、REVISE 或 STOP。',
        technical: '一個不讀寫檔案、不連網、不需金鑰的 TypeScript 純函式；BLOCKED 優先的判斷順序、最小改動範圍、固定情境，以及覆核 AI 助手交出的計畫、改動內容與測試。',
        delivery: '把「請 AI 助手改程式碼」收窄成一份人工可接受、拒絕或丟棄的本機改動建議，保留不做的事、資料界線、最後拍板的人與退回舊版紀錄。',
        boundary: '不要貼到公司程式庫、真實資料、帳號或工具；不可執行指令、安裝套件、提交版本、傳送或部署，更不可把本機覆核當成正式環境證明。',
        action: '開始 Coder Starter Lab',
        href: '/coding-starter-lab'
      },
      approval: {
        label: '我想清楚分開草稿與真正發送',
        title: 'Approval Queue',
        fit: '適合走低程式或流程設計方向的人。它把「協助寫回覆」與「替人發送」分開，讓你能展示權限判斷，而不只是聊天介面。',
        firstArtifact: '寫一張行動規格：哪些合成請求可變成附來源草稿、哪些一定交由人工處理、哪些必須攔住；再加一個禁止行動的情境。',
        technical: '用合成 FAQ 資料檢索、固定回覆模擬器與預先寫好的檢查情境；攔截提示注入與被禁止的行動，並保留不含個人資料的追蹤紀錄。',
        delivery: '把決定權留給覆核者；README、權限、失敗紀錄與不可聲稱的範圍，讓人能追問界線與風險。',
        boundary: '不要連接收件匣、CRM、工單系統或訊息服務，也不要把草稿當成已核准答案或已發送訊息。',
        action: '開啟 Approval Queue',
        href: '/articles/approval-queue-low-code-portfolio'
      },
      retrieval: {
        label: '我想練一個會附來源、遇例外會交人的 LLM 流程',
        title: 'PolicyPilot',
        fit: '適合想做內部文件問答，也願意從少量虛構文件開始的人。重點是可用文件、簡單對照方法、固定情境和交給人的例外，不是生成一段好看答案。',
        firstArtifact: '寫一份虛構政策摘要，列出允許文件、問題、關鍵字搜尋的簡單對照、不能回答的情況，以及一個必須交由人工處理的例外。',
        technical: '版本化的合成政策文件、關鍵字搜尋對照、附來源草稿與人工交接路徑；固定的正確與不安全情境、經遮蔽的追蹤紀錄、推出前檢查與回退方案。',
        delivery: '把支援人員找錯資料的代價、人工核准與資料界線寫清楚；不要把本地答案當成正確性或商業成效。',
        boundary: '不要把公司文件、客戶資料、內部提示詞或任何真實政策放進案例；也不要讓助手自行做決策或發送答案。',
        action: '開啟 PolicyPilot',
        href: '/articles/enterprise-ai-portfolio-policy-pilot'
      },
      reliability: {
        label: '我想練批次工作如何安全地失敗',
        title: 'AI Batch Worker',
        fit: '適合已寫程式，想處理成功一次以外情境的人。這個練習先要求工作能重試、在中斷後續做與安全停止，再談模型或速度。',
        firstArtifact: '定義一條供人工覆核的補充資料紀錄，放入重複項目、429、逾時與無效輸入四種固定情境；寫清從哪個檢查點繼續，以及失敗項目交給誰。',
        technical: '受限佇列、冪等性、重試、檢查點、失敗項目的人工覆核、每次執行的追蹤紀錄、成本停止條件與回歸測試。',
        delivery: '把補充資料與真正修改文件分開，保留預算、覆核負責人、失敗後的去向，以及不可聲稱的可靠性或商業結果。',
        boundary: '不要連接真實文件、佇列或 API；不可把本地重試測試寫成正式環境的處理速度、成本節省或服務承諾證明。',
        action: '開啟 AI Batch Worker',
        href: '/articles/build-a-resumable-ai-batch-worker'
      },
      'predictive-ml': {
        label: '我想練用模型替人手覆核隊列排先後',
        title: 'Renewal Triage',
        fit: '適合想練機器學習項目，卻不想把一個分數包裝成自動業務決策的人。它只會替固定容量的人工覆核隊列排序。',
        firstArtifact: '寫一份時間點資料規格、固定覆核容量、透明規則對照，以及一條會拒絕使用未來資料的情境。',
        technical: '資料滲漏檢查、規則對照與候選模型；把模型、隊列與代表工作流程的訊號分開看的指標；以及推出前檢查、持續監察與回退方案。',
        delivery: '把排列優先順序與聯絡客戶、挽留或定價分開；保留人工負責人、可處理容量與不可聲稱的成效。',
        boundary: '不要使用真實客戶、付款、續約或 CRM 資料；不可讓分數觸發聯絡、價格或資格決策。',
        action: '開啟 Renewal Triage',
        href: '/articles/renewal-triage-mlops'
      },
      'public-data-eval': {
        label: '我想把公開資料整理成可交人工覆核的資料包',
        title: 'KEV Review Packet',
        fit: '適合想練公開資料整理和有界限的 LLM 檢查的人。它只做給安全覆核者看的資料包；公開資料不等於某公司受影響的證據。',
        firstArtifact: '寫一張來源記錄：可用來源、資料格式、授權條款、仍未知的事和不能採取的動作；再寫一條「來源不合格」情境。',
        technical: '檢查必需欄位；結果只可為「拒絕來源」或「可交人覆核」；固定 JSON 格式、固定情境、逐條與預期結果比較，任何必需情境未過就不可推出。可選的 Promptfoo 設定只限本地。',
        delivery: '清楚分開公開紀錄、內部資產證據和真正的漏洞處理決定，並記下誰拍板、怎麼回退、案例不能聲稱什麼。',
        boundary: '不要掃描、修補、建立工單、查詢內部資產或宣稱任何公司受影響；不可把本地情境通過當成安全核准。',
        action: '開啟 KEV Review Packet',
        href: '/articles/build-a-public-data-kev-review-packet'
      },
      'public-statistics': {
        label: '我要練按公開統計格式寫背景摘要',
        title: 'Workforce Signal Brief',
        fit: '適合想把公開統計資料整理成有範圍的研究練習，而不把圖表包裝成就業或薪資預測的人。',
        firstArtifact: '寫一張來源記錄，列出發布頁或 API 網址、系列編號、統計期、地區、單位、調整方法和修訂狀態，再用按同一表格格式安排的虛構數字練一條拒絕情境。',
        technical: '檢查描述資料、時間順序、時效、隱私欄位和可否採取行動；先完成不用模型的資料包，才放一個可選的 gpt-5-mini 範例和 Promptfoo 情境表。',
        delivery: '它只協助負責人判斷資料是否足夠寫背景摘要；測試有沒有通過、來源是否適合、同勞動市場可以講什麼要分開。',
        boundary: '不要假裝已下載、查詢或重現公開統計觀測值；不可做招聘、薪資、簽證、投資、政策或發布決策。',
        action: '查看 Workforce Signal Brief',
        href: '/articles/build-a-source-bound-context-brief'
      }
    }
  },
  'zh-Hans': {
    eyebrow: '先选一个',
    title: '想让作品集先讲清哪种能力？选一个 Lab 开始',
    intro: '还没有自己的题目也能开始。选一个想让复核者看见的判断，先完成一份最小、可在本地核对的成果。',
    goalLabel: '你最想先让作品集说明哪种能力？',
    goalHelp: '这个选择器只帮你选择本地练习的起点，不会评估你、储存资料，或推荐职位、课程与工具。',
    selectionPlaceholder: '请先选择一个起点',
    emptySelection: {
      title: '先选这次想练的方式',
      text: '暂时不写 Code，就选 15 分钟、无需账户的手动检查；能阅读小型 TypeScript 函数与测试结果，再选 45–60 分钟的写 Code 练习。两者都只使用本地、虚构材料。',
      noCodeAction: '选不写 Code · 15 分钟',
      codingAction: '选写 Code · 45–60 分钟',
    },
    resultEyebrow: '建议先做这个',
    selectionStatus: '已选择 {case}。下方列出第一份成果、实现重点、交付时要交代的事，以及开始时要守的边界。',
    firstArtifactHeading: '先做出这一份成果',
    technicalHeading: '实现会练到什么',
    deliveryHeading: '交付时要讲清楚的事',
    boundaryHeading: '一开始不要碰什么',
    ownIdeaTitle: '已经有项目想法？',
    ownIdeaText: '先把它缩小成一个虚构决策、负责拍板的人、目前做法、资料边界与何时应停止，再决定是否值得放进 Lab。',
    ownIdeaAction: '先检查自己的项目想法',
    localBoundary: '所有建议案例只使用本地、合成或公开且需另行核对的材料。完成一个本机测试范例，并不等于已部署、获批准、有商业成效，或可放入真实账户。',
    cases: {
      'no-code': {
        label: '我想先做一个不需要账户或连接器的安全练习',
        title: 'No-code Starter Lab',
        fit: '适合刚开始，又不想把一段漂亮输出当成系统的人。先证明你能把模糊工作拆成有限决策、固定检查情境与人工交接。',
        firstArtifact: '用提供的合成 CSV 手动完成 AC-01：保留 HLS-001，route 标为 DRAFT_REVIEW_NOTE，并确认没有外部动作。15 分钟完成即可停止；AC-02 到 AC-06 只是可选延伸。',
        technical: '可携式字段格式、把看似指令但不可信的单元格当资料处理，以及固定输出路径；核心 15 分钟练习不需要模型、API 密钥、账户或连接器。六个检查情境是之后可选的延伸。',
        delivery: '把“整理补货资料”收窄成人工复核者可接受或拒绝的本地草稿，保留资料权限、禁止动作、最后拍板的人与 PASS／REVISE／STOP。',
        boundary: '不要使用真实电子表格、供应商、账户、浏览器登录状态或自动化；不可用草稿下单、通知或修改库存。',
        action: '开始 No-code Starter Lab',
        href: '/no-code-starter-lab'
      },
      'coding-starter': {
        label: '我想先练一个可供复核的小型程序改动',
        title: 'Coder Starter Lab',
        fit: '适合已经想写程序，但不想从大型代码库、框架或漂亮展示开始的人。先用一个可丢弃的纯函数，展示你怎样守住范围、情境、复核与回退。',
        firstArtifact: '下载英文工作摘要、程序骨架和六个固定情境；未看 AI 助手输出前，先写好每条预期路径，再由复核者记录 PASS、REVISE 或 STOP。',
        technical: '一个不读写文件、不联网、不需要密钥的 TypeScript 纯函数；BLOCKED 优先的判断顺序、最小改动范围、固定情境，以及复核 AI 助手交出的计划、改动内容和测试。',
        delivery: '把“请 AI 助手改代码”收窄成一份人工可接受、拒绝或丢弃的本地改动建议，保留不做的事、资料边界、最后拍板的人和回退记录。',
        boundary: '不要贴到公司代码库、真实资料、账户或工具；不可运行指令、安装软件包、提交版本、发送或部署，更不可把本地复核当成正式环境证明。',
        action: '开始 Coder Starter Lab',
        href: '/coding-starter-lab'
      },
      approval: {
        label: '我想清楚分开草稿与真正发送',
        title: 'Approval Queue',
        fit: '适合走低代码或流程设计方向的人。它把“协助写回复”与“替人发送”分开，让你能展示权限判断，而不只是聊天界面。',
        firstArtifact: '写一张行动规范：哪些合成请求可变成带来源的草稿、哪些一定交由人工处理、哪些必须拦住；再加一个禁止行动的情境。',
        technical: '用合成 FAQ 资料检索、固定回复模拟器和预先写好的检查情境；拦截提示注入与被禁止的行动，并保留不含个人资料的追踪记录。',
        delivery: '把决定权留给复核者；README、权限、失败记录与不可声明的范围，让人能追问边界与风险。',
        boundary: '不要连接收件箱、CRM、工单系统或消息服务，也不要把草稿当成已批准答案或已发送消息。',
        action: '打开 Approval Queue',
        href: '/articles/approval-queue-low-code-portfolio'
      },
      retrieval: {
        label: '我想练一个会附来源、遇例外会交人的 LLM 流程',
        title: 'PolicyPilot',
        fit: '适合想做内部文件问答，也愿意从少量虚构文件开始的人。重点是可用文件、简单对照方法、固定情境和交给人的例外，不是生成一段好看答案。',
        firstArtifact: '写一份虚构政策摘要，列出允许文件、问题、关键词检索的简单对照、不能回答的情况，以及一个必须交由人工处理的例外。',
        technical: '版本化的合成政策文件、关键词检索对照、带来源草稿与人工交接路径；固定的正确与不安全情境、经遮蔽的追踪记录、发布前检查与回退方案。',
        delivery: '把支持人员找错资料的代价、人工批准与资料边界写清楚；不要把本地答案当成正确性或商业成效。',
        boundary: '不要把公司文件、客户资料、内部提示词或任何真实政策放进案例；也不要让助手自行做决策或发送答案。',
        action: '打开 PolicyPilot',
        href: '/articles/enterprise-ai-portfolio-policy-pilot'
      },
      reliability: {
        label: '我想练批次工作如何安全地失败',
        title: 'AI Batch Worker',
        fit: '适合已写程序，想处理成功一次以外情境的人。这个练习先要求工作能重试、在中断后续做与安全停止，再谈模型或速度。',
        firstArtifact: '定义一条供人工复核的补充资料记录，放入重复项目、429、超时与无效输入四种固定情境；写清从哪个检查点继续，以及失败项目交给谁。',
        technical: '受限队列、幂等性、重试、检查点、失败项目的人工复核、每次执行的追踪记录、成本停止条件与回归测试。',
        delivery: '把补充资料与真正修改文件分开，保留预算、复核负责人、失败后的去向，以及不可声明的可靠性或商业结果。',
        boundary: '不要连接真实文件、队列或 API；不可把本地重试测试写成正式环境的处理速度、成本节省或服务承诺证明。',
        action: '打开 AI Batch Worker',
        href: '/articles/build-a-resumable-ai-batch-worker'
      },
      'predictive-ml': {
        label: '我想练用模型替人工复核队列排先后',
        title: 'Renewal Triage',
        fit: '适合想练机器学习项目，却不想把一个分数包装成自动业务决策的人。它只会替固定容量的人工复核队列排序。',
        firstArtifact: '写一份时间点资料规范、固定复核容量、透明规则对照，以及一条会拒绝使用未来资料的情境。',
        technical: '资料泄漏检查、规则对照与候选模型；把模型、队列与代表工作流程的信号分开看的指标；以及发布前检查、持续监测与回退方案。',
        delivery: '把排列优先级与联络客户、挽留或定价分开；保留人工负责人、可处理容量与不可声明的成效。',
        boundary: '不要使用真实客户、付款、续约或 CRM 资料；不可让分数触发联络、价格或资格决策。',
        action: '打开 Renewal Triage',
        href: '/articles/renewal-triage-mlops'
      },
      'public-data-eval': {
        label: '我想把公开资料整理成可交人工复核的资料包',
        title: 'KEV Review Packet',
        fit: '适合想练公开资料整理和有边界的 LLM 检查的人。它只做给安全复核者看的资料包；公开资料不等于某公司受影响的证据。',
        firstArtifact: '写一张来源记录：可用来源、资料格式、授权条款、仍未知的事和不能采取的动作；再写一条“来源不合格”情境。',
        technical: '检查必需栏位；结果只可为“拒绝来源”或“可交人复核”；固定 JSON 格式、固定情境、逐条与预期结果比较，任何必需情境未过就不可推出。可选的 Promptfoo 设置只限本地。',
        delivery: '清楚分开公开记录、内部资产证据和真正的漏洞处理决定，并记下谁拍板、怎样回退、案例不能声明什么。',
        boundary: '不要扫描、修补、建立工单、查询内部资产或声明任何公司受影响；不可把本地情境通过当成安全批准。',
        action: '打开 KEV Review Packet',
        href: '/articles/build-a-public-data-kev-review-packet'
      },
      'public-statistics': {
        label: '我要练按公开统计格式写背景摘要',
        title: 'Workforce Signal Brief',
        fit: '适合想把公开统计资料整理成有范围的研究练习，而不把图表包装成就业或薪资预测的人。',
        firstArtifact: '写一张来源记录，列出发布页或 API 地址、系列编号、统计期、地区、单位、调整方法和修订状态，再用按同一表格格式安排的虚构数字练一条拒绝情境。',
        technical: '检查描述资料、时间顺序、时效、隐私栏位和可否采取行动；先完成不用模型的资料包，才放一个可选的 gpt-5-mini 范例和 Promptfoo 情境表。',
        delivery: '它只协助负责人判断资料是否足够写背景摘要；测试有没有通过、来源是否适合、同劳动力市场可以讲什么要分开。',
        boundary: '不要假装已下载、查询或重现公开统计观测值；不可做招聘、薪资、签证、投资、政策或发布决定。',
        action: '查看 Workforce Signal Brief',
        href: '/articles/build-a-source-bound-context-brief'
      }
    }
  },
  en: {
    eyebrow: 'PICK ONE FIRST',
    title: 'Choose one capability to show, then open a Lab',
    intro: 'You can begin without a project idea. Choose one judgment you want a reviewer to see, then finish the smallest first piece of work that can be checked locally.',
    goalLabel: 'What should your portfolio prove first?',
    goalHelp: 'This selector only chooses a starting point for local practice. It does not assess you, retain data, or recommend roles, courses, or tools.',
    selectionPlaceholder: 'Choose a starting point',
    emptySelection: {
      title: 'Choose the kind of practice for this visit',
      text: 'If you do not code yet, choose the 15-minute manual check with no account. If you can read a small TypeScript function and test output, choose the 45–60-minute coding exercise. Both use local, fictional material only.',
      noCodeAction: 'Choose no-code · 15 minutes',
      codingAction: 'Choose coding · 45–60 minutes',
    },
    resultEyebrow: 'SUGGESTED FIRST CASE',
    selectionStatus: 'Selected {case}. Below are the first piece of work, what the system does, what still needs explaining before work use, and the starting boundary.',
    firstArtifactHeading: 'Make this first piece of work',
    technicalHeading: 'What the build does',
    deliveryHeading: 'What still needs explaining before work use',
    boundaryHeading: 'Do not do this first',
    ownIdeaTitle: 'Already have a project idea?',
    ownIdeaText: 'Reduce it to one fictional decision, who signs off, the current approach, the data boundary, and when it should stop. Then decide whether it belongs in a Lab.',
    ownIdeaAction: 'Check my project idea first',
    localBoundary: 'Every suggested case uses local, synthetic, or separately checked public material. Completing a local test example does not mean a system is deployed, approved, effective for a business, or safe to connect to a real account.',
    cases: {
      'no-code': {
        label: 'I need a safe first exercise with no account or connector',
        title: 'No-code Starter Lab',
        fit: 'Use this when you are starting out and do not want a polished output to pretend there is a system behind it. First show that you can turn ambiguous work into a bounded decision, acceptance cases, and a human handoff.',
        firstArtifact: 'Complete AC-01 manually with the supplied synthetic CSV: retain HLS-001, set the route to DRAFT_REVIEW_NOTE, then confirm that there is no external action. You may stop after 15 minutes; AC-02 through AC-06 are optional extensions.',
        technical: 'A portable schema, an untrusted instruction-like cell, and a fixed output route. The 15-minute core needs no model, API key, account, or connector; the six acceptance cases are an optional later extension.',
        delivery: 'It narrows “organise supply information” into a local draft that a reviewer can accept or reject, with data permission, prohibited actions, owner, and PASS／REVISE／STOP retained.',
        boundary: 'Do not use a real spreadsheet, supplier, account, browser session, or automation. The draft must not place an order, notify anyone, or change stock.',
        action: 'Start the No-code Starter Lab',
        href: '/no-code-starter-lab'
      },
      'coding-starter': {
        label: 'I want to review one small code change first',
        title: 'Coder Starter Lab',
        fit: 'Use this when you are ready to write code but do not want to begin with a large repository, framework, or polished demo. A disposable pure function lets you show how you protect scope, cases, review, and rollback.',
        firstArtifact: 'Download the English brief, source skeleton, and six fixed cases. Write the expected route before reading agent output, then let a reviewer record PASS, REVISE, or STOP.',
        technical: 'One TypeScript pure function with no I/O, network, or key; a BLOCKED-first decision order, minimal diff scope, fixed cases, and an agent plan/diff/tests review.',
        delivery: 'It narrows “ask an agent to change code” into a local proposal a human can accept, reject, or discard, with non-goals, data boundary, owner, and rollback record retained.',
        boundary: 'Do not paste this into a company repository, real data, account, or tool. Do not run commands, install packages, commit, send, or deploy, and do not treat a local review as production proof.',
        action: 'Start the Coder Starter Lab',
        href: '/coding-starter-lab'
      },
      approval: {
        label: 'I need to show the difference between drafting and taking action',
        title: 'Approval Queue',
        fit: 'Use this for a low-code or workflow direction. It separates “help write a reply” from “send a reply”, so the work shows an authority judgment rather than only a chat interface.',
        firstArtifact: 'Write an action contract: which synthetic requests may become cited drafts, which must hand off, and which must block. Add one forbidden-action case.',
        technical: 'Synthetic FAQ retrieval, a deterministic mock, fixed acceptance cases, prompt-injection and forbidden-action blocks, and a privacy-safe trace.',
        delivery: 'Authority stays with a reviewer. README, permission, failure record, and non-claims make the scope and risk reviewable.',
        boundary: 'Do not connect an inbox, CRM, ticketing system, or messaging service. Do not treat a draft as an approved answer or a sent message.',
        action: 'Open Approval Queue',
        href: '/articles/approval-queue-low-code-portfolio'
      },
      retrieval: {
        label: 'I want to practise an LLM flow with sources and human handoff',
        title: 'PolicyPilot',
        fit: 'Use this to practise internal-document Q&A with a small set of invented documents. The point is allowed material, a simple comparison method, fixed cases, and exceptions that go to a person—not a fluent answer.',
        firstArtifact: 'Write a fictional policy brief listing allowed documents, the question, a keyword baseline, conditions it cannot answer, and one exception that must hand off.',
        technical: 'A versioned synthetic policy corpus, keyword baseline, retrieval citation, quality and safety cases, redacted trace, release gate, and rollback.',
        delivery: 'It makes the cost of error, human approval, and data boundary for a support lookup visible; it does not treat a local answer as correctness or business impact.',
        boundary: 'Do not add company documents, customer data, internal prompts, or any real policy. The assistant must not decide or send an answer by itself.',
        action: 'Open PolicyPilot',
        href: '/articles/enterprise-ai-portfolio-policy-pilot'
      },
      reliability: {
        label: 'I want to practise how batch work fails, not just succeeds',
        title: 'AI Batch Worker',
        fit: 'Use this if you already write code and want to show what happens beyond one successful run. The exercise requires work to retry, recover, and stop before it considers a model or speed.',
        firstArtifact: 'Define one human-review enrichment record and four fixed cases—duplicate, 429, timeout, and invalid input—then state the checkpoint and dead-letter route.',
        technical: 'A bounded queue, idempotency, retry, checkpoint, dead-letter review, run/job/attempt traces, a cost stop, and regression tests.',
        delivery: 'It separates enrichment from a real document change, while retaining budget, review owner, failure route, and reliability or business outcomes it cannot claim.',
        boundary: 'Do not connect real documents, queues, or APIs. A local retry test is not evidence of production throughput, cost saving, or an SLA.',
        action: 'Open AI Batch Worker',
        href: '/articles/build-a-resumable-ai-batch-worker'
      },
      'predictive-ml': {
        label: 'I want to practise ranking a human-review queue with a model',
        title: 'Renewal Triage',
        fit: 'Use this to practise an ML project without presenting a score as an automated business decision. It only ranks a fixed-capacity human-review queue.',
        firstArtifact: 'Write a point-in-time data contract, fixed review capacity, transparent rule baseline, and one leakage case that must be rejected.',
        technical: 'A leakage test; rule baseline and candidate model; separate model, queue, and workflow-proxy measures; release gate, monitoring, and rollback.',
        delivery: 'It separates queue priority from contacting customers, retention, or pricing, while retaining the human owner, capacity, and outcomes it cannot claim.',
        boundary: 'Do not use real customer, payment, retention, or CRM data. A score must not trigger contact, price, or eligibility decisions.',
        action: 'Open Renewal Triage',
        href: '/articles/renewal-triage-mlops'
      },
      'public-data-eval': {
        label: 'I want to turn public data into a packet for human review',
        title: 'KEV Review Packet',
        fit: 'Use this to practise collecting public data and checking it with an LLM inside a clear limit. It makes a packet for a security reviewer only; a public feed is not evidence of an organisation’s exposure.',
        firstArtifact: 'Write down the allowed sources, required fields, licence or terms, unknowns, and actions this exercise must not take. Add one “source rejected” case.',
        technical: 'Check required fields; produce only “source rejected” or “ready for human review”; keep a fixed JSON shape, compare every fixed case with its expected result, and do not release if any required case fails. The optional Promptfoo setup stays local.',
        delivery: 'Keep the public record, internal asset evidence, and a real vulnerability-handling decision separate. Record who decides, how to roll back, and what the case cannot claim.',
        boundary: 'Do not scan, patch, create tickets, inspect internal assets, or claim an organisation is affected. A local case pass is not security approval.',
        action: 'Open KEV Review Packet',
        href: '/articles/build-a-public-data-kev-review-packet'
      },
      'public-statistics': {
        label: 'I want to practise writing a context brief from public statistics',
        title: 'Workforce Signal Brief',
        fit: 'Use this to arrange public statistics into a bounded research exercise rather than turn a chart into a hiring or pay prediction.',
        firstArtifact: 'Write a source record with the release/API URL, series ID, reference period, geography, unit, adjustment, and revision state. Then arrange invented monthly values in the same layout as the public series and practise a rejection case.',
        technical: 'Check metadata, time order, freshness, private fields, and whether any action is allowed. Complete a no-model packet before adding an optional gpt-5-mini example and Promptfoo case table.',
        delivery: 'It only helps a human owner decide whether there is enough material for a context brief. Keep test results, whether the source is suitable, and labour-market claims separate.',
        boundary: 'Do not pretend to have downloaded, queried, or reproduced a public statistical observation. Do not make hiring, pay, visa, investment, policy, or publication decisions.',
        action: 'Inspect Workforce Signal Brief',
        href: '/articles/build-a-source-bound-context-brief'
      }
    }
  }
});

export const buildLabCaseSelectorMetaCopy: Record<Locale, BuildLabCaseSelectorMetaCopy> = canonicalLocaleRecord({
  'zh-HK': {
    timeLabel: '預留的第一段時間',
    prerequisiteLabel: '開始前需要',
    cases: {
      'no-code': { time: '15 分鐘', prerequisite: '不用寫程式或帳戶；只需要能開啟 CSV 和文字範本。' },
      'coding-starter': { time: '45–60 分鐘', prerequisite: '能閱讀一個小型 TypeScript 函式和測試結果。' },
      approval: { time: '45–60 分鐘', prerequisite: '不用寫程式；先懂得分開草稿、人工覆核和真正行動。' },
      retrieval: { time: '60–90 分鐘', prerequisite: '懂基本 LLM 提示詞，並願意用少量虛構文件做檢查。' },
      reliability: { time: '60–90 分鐘', prerequisite: '能在本機執行及修改程式和測試。' },
      'predictive-ml': { time: '60–90 分鐘', prerequisite: '懂基本 Python、表格資料和訓練／測試分隔。' },
      'public-data-eval': { time: '45–60 分鐘', prerequisite: '能閱讀 JSON 欄位，並逐項核對公開來源。' },
      'public-statistics': { time: '45–60 分鐘', prerequisite: '能閱讀簡單資料表、單位和統計期。' },
    },
  },
  'zh-TW': {
    timeLabel: '首段練習所需時間',
    prerequisiteLabel: '開始前所需條件',
    cases: {
      'no-code': { time: '15 分鐘', prerequisite: '無須編程或帳戶；只需能開啟 CSV 和文字範本。' },
      'coding-starter': { time: '45–60 分鐘', prerequisite: '能閱讀小型 TypeScript 函式及測試結果。' },
      approval: { time: '45–60 分鐘', prerequisite: '無須編程；先理解草稿、人工覆核與真正行動的分別。' },
      retrieval: { time: '60–90 分鐘', prerequisite: '了解基本 LLM 提示詞，並願意用少量虛構文件進行檢查。' },
      reliability: { time: '60–90 分鐘', prerequisite: '能在本機執行及修改程式和測試。' },
      'predictive-ml': { time: '60–90 分鐘', prerequisite: '了解基本 Python、表格資料及訓練／測試分隔。' },
      'public-data-eval': { time: '45–60 分鐘', prerequisite: '能閱讀 JSON 欄位，並逐項核對公開來源。' },
      'public-statistics': { time: '45–60 分鐘', prerequisite: '能閱讀簡單資料表、單位及統計期。' },
    },
  },
  'zh-Hans': {
    timeLabel: '预留的第一段时间',
    prerequisiteLabel: '开始前需要',
    cases: {
      'no-code': { time: '15 分钟', prerequisite: '不用写代码或账户；只需要能打开 CSV 和文字模板。' },
      'coding-starter': { time: '45–60 分钟', prerequisite: '能阅读一个小型 TypeScript 函数和测试结果。' },
      approval: { time: '45–60 分钟', prerequisite: '不用写代码；先懂得分开草稿、人工复核和真正行动。' },
      retrieval: { time: '60–90 分钟', prerequisite: '懂基本 LLM 提示词，并愿意用少量虚构文件做检查。' },
      reliability: { time: '60–90 分钟', prerequisite: '能在本地运行和修改代码与测试。' },
      'predictive-ml': { time: '60–90 分钟', prerequisite: '懂基本 Python、表格数据和训练／测试分割。' },
      'public-data-eval': { time: '45–60 分钟', prerequisite: '能阅读 JSON 字段，并逐项核对公开来源。' },
      'public-statistics': { time: '45–60 分钟', prerequisite: '能阅读简单数据表、单位和统计期。' },
    },
  },
  en: {
    timeLabel: 'First-session time',
    prerequisiteLabel: 'What you need before starting',
    cases: {
      'no-code': { time: '15 minutes', prerequisite: 'No coding or account. You only need to open a CSV and a text template.' },
      'coding-starter': { time: '45–60 minutes', prerequisite: 'You can read a small TypeScript function and its test output.' },
      approval: { time: '45–60 minutes', prerequisite: 'No coding. Understand the difference between a draft, human review, and a real action.' },
      retrieval: { time: '60–90 minutes', prerequisite: 'Basic familiarity with LLM prompts and willingness to check a few fictional documents.' },
      reliability: { time: '60–90 minutes', prerequisite: 'You can run and modify code and tests locally.' },
      'predictive-ml': { time: '60–90 minutes', prerequisite: 'Basic Python, tabular data, and train/test split knowledge.' },
      'public-data-eval': { time: '45–60 minutes', prerequisite: 'You can read JSON fields and check a public source line by line.' },
      'public-statistics': { time: '45–60 minutes', prerequisite: 'You can read a simple data table, its unit, and reference period.' },
    },
  },
});

export const codingStarterNextStepCopy: Record<Locale, CodingStarterNextStepCopy> = canonicalLocaleRecord({
  'zh-HK': {
    title: '呢個一星期作品路線點樣繼續？',
    text: 'Coder Starter Lab 只係第一段，約 45–60 分鐘。六個固定案例和覆核紀錄係練習，不會自動變成作品。完成後，帶住改動說明、人手基準、程式差異、測試和不採用原因去規劃器；它先提供一個虛構工程方向，你再改成自己的問題，加一個正常和一個失敗案例。',
    action: '把練習紀錄整理成作品證據',
  },
  'zh-TW': {
    title: '這條一星期作品路線如何繼續？',
    text: 'Coder Starter Lab 只是第一部分，約需 45–60 分鐘。六個固定案例和覆核紀錄僅作練習，不會自動成為作品。完成後，帶同改動說明、人工基準、程式差異、測試及不採用原因到規劃器；規劃器會先提供一個虛構工程方向，你再把它改成自己的問題，加入一個正常案例和一個失敗案例。',
    action: '把練習紀錄整理成作品證據',
  },
  'zh-Hans': {
    title: '这一周作品路线怎样继续？',
    text: 'Coder Starter Lab 只是第一段，约 45–60 分钟。六个固定案例和复核记录是练习，不会自动变成作品。完成后，带着改动说明、人工基准、代码差异、测试和不采用原因到规划器；它会先提供一个虚构工程方向，你再改成自己的问题，加入一个正常和一个失败案例。',
    action: '把练习记录整理成作品证据',
  },
  en: {
    title: 'How does this one-week portfolio route continue?',
    text: 'Coder Starter Lab is only the first 45–60-minute block. Its six fixed cases and review record are practice, not automatically a portfolio project. When you finish, take your change brief, manual baseline, code diff, tests, and discard reason to the planner. It starts with a fictional engineering direction; change that into your own problem and add one normal and one failure case.',
    action: 'Turn the practice record into portfolio evidence',
  },
});

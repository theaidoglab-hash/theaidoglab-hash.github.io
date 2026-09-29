import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

export const PORTFOLIO_EVIDENCE_HANDOFF_PACK_README_HREFS: Record<Locale, string> = {
  'zh-Hant': '/templates/portfolio-evidence-handoff-pack/v1/README.zh-TW.md',
  'zh-Hans': '/templates/portfolio-evidence-handoff-pack/v1/README.zh-Hans.md',
  en: '/templates/portfolio-evidence-handoff-pack/v1/README.md'
};

export type PortfolioEvidenceHandoffPackCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  open: string;
  includesHeading: string;
  includes: string[];
  sourceLanguage: string;
  boundary: string;
};

export const portfolioEvidenceHandoffPackCopy: Record<Locale, PortfolioEvidenceHandoffPackCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '下一步：交畀另一個人覆核',
    title: '先做好交接包，再諗公開 repository',
    intro: '跑完一個本機 starter 之後，用呢組細小記錄講清楚你改過乜、實際跑過乜、仲未跑過乜，以及公開前仍然要由邊個決定。',
    open: '開啟交接包',
    includesHeading: '交接包包括',
    includes: [
      '項目 brief、資料權利記錄，同不可公開內容',
      '由 NOT_RUN 開始嘅本機 run receipt',
      'claims／non-claims、覆核決定同 rollback 記錄',
      '由你自己選擇嘅 licence 決定，同公開 repository 候選清單'
    ],
    sourceLanguage: '檔名同原始記錄用英文，方便日後畀 reviewer 睇；只有 README 提供語言版本。',
    boundary: '呢份 pack 唔會建立 repository、執行 Git command、上載檔案、加 CI secret，或者證明可以公開。填齊後只代表結構上可以交畀 owner 覆核。'
  },
  'zh-TW': {
    eyebrow: '下一步：交給另一個人審查',
    title: '先完成交接包，再考慮公開 repository',
    intro: '跑完一個本機 starter 後，用這組小型紀錄說明你改了什麼、實際跑過什麼、還沒有跑什麼，以及公開前仍須由誰決定。',
    open: '開啟交接包',
    includesHeading: '交接包包含',
    includes: [
      '專案 brief、資料權利紀錄，以及不可公開內容',
      '從 NOT_RUN 開始的本機 run receipt',
      'claims／non-claims、審查決定與 rollback 紀錄',
      '由你選擇的 licence 決定，以及公開 repository 候選清單'
    ],
    sourceLanguage: '檔名與原始紀錄維持英文，方便之後由 reviewer 閱讀；只有 README 提供語言版本。',
    boundary: '這份 pack 不會建立 repository、執行 Git command、上傳檔案、加入 CI secret，或證明可以公開。填完只代表結構上可以交給 owner 審查。'
  },
  'zh-Hans': {
    eyebrow: '下一步：交给另一个人审查',
    title: '先完成交接包，再考虑公开 repository',
    intro: '跑完一个本机 starter 后，用这组小型记录说明你改了什么、实际跑过什么、还没有跑什么，以及公开前仍须由谁决定。',
    open: '打开交接包',
    includesHeading: '交接包包含',
    includes: [
      '项目 brief、数据权利记录，以及不可公开内容',
      '从 NOT_RUN 开始的本机 run receipt',
      'claims／non-claims、审查决定与 rollback 记录',
      '由你选择的 licence 决定，以及公开 repository 候选清单'
    ],
    sourceLanguage: '文件名与原始记录保持英文，方便之后由 reviewer 阅读；只有 README 提供语言版本。',
    boundary: '这份 pack 不会创建 repository、执行 Git command、上传文件、加入 CI secret，或证明可以公开。填完只代表结构上可以交给 owner 审查。'
  },
  en: {
    eyebrow: 'Next: hand the work to a reviewer',
    title: 'Build a handoff pack before considering a public repository',
    intro: 'After running a local starter, use this small record set to show what you changed, what actually ran, what has not run, and who still needs to decide before anything is shared.',
    open: 'Open the handoff pack',
    includesHeading: 'The handoff pack includes',
    includes: [
      'A project brief, data-rights record, and material that must not be shared',
      'A local run receipt that begins as NOT_RUN',
      'Claims/non-claims, a reviewer decision, and a rollback record',
      'Your own licence decision and a public-repository candidate checklist'
    ],
    sourceLanguage: 'Filenames and source records stay in English for a future reviewer; only the README has language editions.',
    boundary: 'This pack does not create a repository, run Git commands, upload files, add CI secrets, or prove that work may be shared. Completing it only makes the work structurally ready for owner review.'
  }
});

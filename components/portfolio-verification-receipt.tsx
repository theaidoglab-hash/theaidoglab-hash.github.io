import { getPortfolioExampleReceipt } from '@/lib/portfolio-example-receipts';
import { PORTFOLIO_EVIDENCE_HANDOFF_PACK_README_HREFS } from '@/lib/portfolio-evidence-handoff-pack';
import { canonicalLocaleRecord, staticAssetHref, type Locale } from '@/lib/types';

const labels = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '本地檢查記錄',
    title: '呢個本地範例可以核對乜',
    compactTitle: '本地檢查狀態',
    status: '呢個完整範例只喺本地，用固定測試資料作學習；未有經核實、公開可看的 repo 或來源連結。',
    statusWithStarter: '完整範例仍只喺本地，用固定測試資料作學習。下面另有一份畀你下載、自己持有嘅起步練習包；佢唔係公開 repo，亦唔代表可用喺真實工作。',
    decision: '用來支援嘅人手決定',
    commands: '完整範例的本地檢查指令',
    commandsHelp: '以下只係完整範例喺本地點樣檢查；唔代表你而家可以下載，亦唔代表已經跑過。',
    readerStarter: '你可以自己跑嘅起步練習包',
    runCommands: '練習包入面可以跑嘅指令',
    handoff: '跑完後，點樣留下可覆核嘅證據',
    handoffHelp: '先記低實際 run、資料邊界、未能聲稱嘅事，同埋仍需由人決定嘅公開前檢查。',
    dataAndModel: '資料和模型的界線',
    doesNotProve: '呢個仍然證明唔到'
  },
  'zh-TW': {
    eyebrow: '本機檢查記錄',
    title: '這個 local package 可以核對什麼',
    compactTitle: '本機檢查狀態',
    status: '這是本機 fixture-only package；尚未有經核實、可公開查看的 repository 或 source link。',
    statusWithStarter: '完整範例仍是本機固定測試資料練習。下方另有一份可下載、由讀者自行持有的起步練習包；它不是 public repository，也不代表可以用於真實工作。',
    decision: '用來支援的人工決策',
    commands: '完整範例的本機檢查指令',
    commandsHelp: '這裡只列出完整範例在本機怎麼檢查，不表示讀者已可下載或已執行。',
    readerStarter: '你可以自行執行的起步練習包',
    runCommands: '練習包內可執行的指令',
    handoff: '跑完後，如何留下可審查的證據',
    handoffHelp: '先記下實際執行、資料邊界、不能宣稱的事，以及公開前仍須由人決定的檢查。',
    dataAndModel: '資料與 model 邊界',
    doesNotProve: '這個未能證明'
  },
  'zh-Hans': {
    eyebrow: '本地检查记录',
    title: '这个 local package 可以核对什么',
    compactTitle: '本地检查状态',
    status: '这是本地 fixture-only package；尚未有经核实、可公开查看的 repository 或 source link。',
    statusWithStarter: '完整示例仍是本地固定测试资料练习。下方另有一份可下载、由读者自行持有的起步练习包；它不是 public repository，也不代表可以用于真实工作。',
    decision: '用来支持的人工决策',
    commands: '完整示例的本地检查指令',
    commandsHelp: '这里只列出完整示例在本地怎样检查，不表示读者已可下载或已运行。',
    readerStarter: '你可以自行运行的起步练习包',
    runCommands: '练习包内可运行的指令',
    handoff: '运行后，如何留下可审查的证据',
    handoffHelp: '先记录实际运行、数据边界、不能声明的事，以及公开前仍须由人决定的检查。',
    dataAndModel: '数据与 model 边界',
    doesNotProve: '这个未能证明'
  },
  en: {
    eyebrow: 'LOCAL REVIEW RECORD',
    title: 'What this local package is designed to check',
    compactTitle: 'Local review status',
    status: 'This is a local fixture-only package. There is no verified public repository or source link to inspect yet.',
    statusWithStarter: 'The full example remains a local exercise using fixed test data. A separate starter you can download and keep is available below; it is not a public repository or evidence that the workflow is usable in real work.',
    decision: 'Human decision supported',
    commands: 'Local check commands for the full example',
    commandsHelp: 'These only describe how the full example is checked locally. They are not a claim that you can download it or that the commands have been run.',
    readerStarter: 'Downloadable starter you can run',
    runCommands: 'Commands inside the starter',
    handoff: 'After a run: leave evidence a reviewer can follow',
    handoffHelp: 'Record what actually ran, the data boundary, non-claims, and the checks a person must still decide before anything is shared.',
    dataAndModel: 'Data and model boundary',
    doesNotProve: 'It does not establish'
  }
});

type PortfolioVerificationReceiptProps = {
  articleSlug: string;
  locale: Locale;
  compact?: boolean;
};

export function PortfolioVerificationReceipt({ articleSlug, locale, compact = false }: PortfolioVerificationReceiptProps) {
  const receipt = getPortfolioExampleReceipt(articleSlug);
  if (!receipt) return null;

  const copy = receipt.copy[locale];
  const starter = receipt.readerStarter?.copy[locale];
  const t = labels[locale];
  const headingId = `portfolio-verification-${articleSlug}`;

  return <section className="portfolio-verification-receipt" data-compact={compact || undefined} aria-labelledby={headingId}>
    <header className="portfolio-verification-receipt__header">
      <p className="eyebrow">{t.eyebrow}</p>
      <h3 id={headingId} className="text-balance">{compact ? t.compactTitle : t.title}</h3>
      <p className="portfolio-verification-receipt__status text-pretty">{receipt.readerStarter ? t.statusWithStarter : t.status}</p>
    </header>
    <dl className="portfolio-verification-receipt__details">
      {!compact && <div><dt>{t.decision}</dt><dd className="text-pretty">{copy.decision}</dd></div>}
      <div>
        <dt>{t.commands}</dt>
        <dd>
          <span className="portfolio-verification-receipt__commands">{receipt.localCommands.map(command => <code key={command}>{command}</code>)}</span>
          <span className="text-pretty">{t.commandsHelp}</span>
        </dd>
      </div>
      {receipt.readerStarter && starter && <div className="portfolio-verification-receipt__starter">
        <dt>{t.readerStarter}</dt>
        <dd>
          <strong>{starter.title}</strong>
          <span className="text-pretty">{starter.text}</span>
          <span className="portfolio-verification-receipt__starter-command-label">{t.runCommands}</span>
          <span className="portfolio-verification-receipt__commands">{receipt.readerStarter.commands.map(command => <code key={command}>{command}</code>)}</span>
          <span className="portfolio-verification-receipt__starter-actions">
            <a className="button primary" href={receipt.readerStarter.downloadHref} download>{starter.download} <span aria-hidden>↓</span></a>
            <a className="text-link" href={staticAssetHref(receipt.readerStarter.readmeHref[locale])}>{starter.readme} <span aria-hidden>→</span></a>
          </span>
          <span className="portfolio-verification-receipt__starter-boundary" role="note">{starter.boundary}</span>
          <span className="portfolio-verification-receipt__handoff">
            <a className="text-link" href={PORTFOLIO_EVIDENCE_HANDOFF_PACK_README_HREFS[locale]}>{t.handoff} <span aria-hidden>→</span></a>
            <span className="text-pretty">{t.handoffHelp}</span>
          </span>
        </dd>
      </div>}
      {!compact && <div><dt>{t.dataAndModel}</dt><dd className="text-pretty">{copy.dataAndModel}</dd></div>}
      <div><dt>{t.doesNotProve}</dt><dd className="text-pretty">{copy.doesNotProve}</dd></div>
    </dl>
  </section>;
}

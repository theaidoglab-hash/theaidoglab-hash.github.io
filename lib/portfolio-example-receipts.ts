import rawReceipts from '@/content/portfolio-example-receipts.json';
import { normalizeLocaleContent, type Locale } from '@/lib/types';

type PortfolioExampleReceiptCopy = {
  decision: string;
  dataAndModel: string;
  doesNotProve: string;
};

type PortfolioReaderStarterCopy = {
  title: string;
  text: string;
  download: string;
  readme: string;
  boundary: string;
};

type PortfolioReaderStarter = {
  downloadHref: string;
  readmeHref: Record<Locale, string>;
  commands: string[];
  copy: Record<Locale, PortfolioReaderStarterCopy>;
};

export type PortfolioExampleReceipt = {
  exampleId: string;
  articleSlug: string;
  localCommands: string[];
  readerStarter?: PortfolioReaderStarter;
  copy: Record<Locale, PortfolioExampleReceiptCopy>;
};

const portfolioExampleReceipts = (normalizeLocaleContent(rawReceipts) as unknown as { receipts: PortfolioExampleReceipt[] }).receipts;
const receiptsByArticleSlug = new Map(portfolioExampleReceipts.map(receipt => [receipt.articleSlug, receipt]));

export function getPortfolioExampleReceipt(articleSlug: string) {
  return receiptsByArticleSlug.get(articleSlug);
}

export function getPortfolioExampleReceipts() {
  return portfolioExampleReceipts;
}

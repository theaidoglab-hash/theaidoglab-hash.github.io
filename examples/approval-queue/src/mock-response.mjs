export function createDeterministicMockResponse({ faq, simulateFailure = false }) {
  if (simulateFailure) {
    throw new Error("synthetic mock failure");
  }

  return Object.freeze({
    provider: "deterministic_local_mock",
    network: "disabled",
    apiCallMade: false,
    draftText: `Draft for human review: ${faq.answer} Source: ${faq.faqId} ${faq.version}.`,
    citation: Object.freeze({
      faqId: faq.faqId,
      version: faq.version,
      title: faq.title,
      excerpt: faq.answer,
      sourceNote: faq.sourceNote,
    }),
  });
}

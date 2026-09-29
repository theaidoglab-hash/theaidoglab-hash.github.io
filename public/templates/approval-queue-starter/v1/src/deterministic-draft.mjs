export function createDeterministicDraft({ faq, simulateFailure = false }) {
  if (simulateFailure) {
    throw new Error("synthetic_deterministic_template_unavailable");
  }

  return Object.freeze({
    provider: "deterministic_local_template",
    network: "disabled",
    modelCallMade: false,
    text: `Draft for human review: ${faq.answer} Source: ${faq.faqId} ${faq.version}.`,
    citation: Object.freeze({
      faqId: faq.faqId,
      version: faq.version,
      title: faq.title,
      excerpt: faq.answer,
      sourceNote: faq.sourceNote,
    }),
  });
}

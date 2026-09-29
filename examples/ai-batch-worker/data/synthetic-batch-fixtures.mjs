/**
 * Every record in this file is fictional. The response plan drives a local
 * simulator; it is never sent to a model, API, or network service.
 */
function frozenJob(job) {
  return Object.freeze({ ...job, responsePlan: Object.freeze([...job.responsePlan]) });
}

export const SYNTHETIC_BATCH_FIXTURES = Object.freeze({
  success: frozenJob({
    eventId: "EVT-100",
    jobId: "JOB-100",
    documentId: "SYN-DOC-100",
    documentVersion: "v1",
    documentText: "Synthetic maintenance summary for a fictional equipment manual.",
    idempotencyKey: "document:SYN-DOC-100:v1",
    estimatedCostCents: 2,
    responsePlan: ["success"],
  }),
  rateLimited: frozenJob({
    eventId: "EVT-200",
    jobId: "JOB-200",
    documentId: "SYN-DOC-200",
    documentVersion: "v1",
    documentText: "Synthetic procurement note for a fictional inventory group.",
    idempotencyKey: "document:SYN-DOC-200:v1",
    estimatedCostCents: 2,
    responsePlan: ["rate_limited", "success"],
  }),
  timeout: frozenJob({
    eventId: "EVT-300",
    jobId: "JOB-300",
    documentId: "SYN-DOC-300",
    documentVersion: "v1",
    documentText: "Synthetic delivery checklist for a fictional service team.",
    idempotencyKey: "document:SYN-DOC-300:v1",
    estimatedCostCents: 2,
    responsePlan: ["timeout", "success"],
  }),
  duplicate: frozenJob({
    eventId: "EVT-100-DUPLICATE",
    jobId: "JOB-100-DUPLICATE",
    documentId: "SYN-DOC-100",
    documentVersion: "v1",
    documentText: "Synthetic maintenance summary for a fictional equipment manual.",
    idempotencyKey: "document:SYN-DOC-100:v1",
    estimatedCostCents: 2,
    responsePlan: ["success"],
  }),
  invalidInput: Object.freeze({
    eventId: "EVT-400",
    jobId: "JOB-400",
    documentId: "SYN-DOC-400",
    documentVersion: "v1",
    documentText: "   ",
    idempotencyKey: "document:SYN-DOC-400:v1",
    estimatedCostCents: 2,
    responsePlan: Object.freeze(["success"]),
  }),
});

export const INITIAL_DEMONSTRATION_BATCH = Object.freeze([
  SYNTHETIC_BATCH_FIXTURES.success,
  SYNTHETIC_BATCH_FIXTURES.rateLimited,
  SYNTHETIC_BATCH_FIXTURES.timeout,
]);

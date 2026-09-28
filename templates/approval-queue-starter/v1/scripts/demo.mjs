import {
  blockedActionRequest,
  citedDraftRequest,
  instructionOverrideRequest,
  unsupportedQuestionRequest,
} from "../data/request-fixtures.mjs";
import { syntheticFaqSnapshot } from "../data/synthetic-faq.mjs";
import { STARTER_VERSION } from "../src/contracts.mjs";
import { routeApprovalQueue } from "../src/route-approval-queue.mjs";

const scenarios = Object.freeze([
  Object.freeze({ label: "current approved support", request: citedDraftRequest }),
  Object.freeze({ label: "missing support", request: unsupportedQuestionRequest }),
  Object.freeze({ label: "instruction override", request: instructionOverrideRequest }),
  Object.freeze({ label: "requested external action", request: blockedActionRequest }),
]);

const report = Object.freeze({
  reportVersion: STARTER_VERSION,
  scope: "synthetic_local_exercise_only",
  scenarios: scenarios.map(({ label, request }) => Object.freeze({
    label,
    result: routeApprovalQueue({ snapshot: syntheticFaqSnapshot, request }),
  })),
  nonClaims: Object.freeze([
    "No network, model, account, or external action ran.",
    "No business, quality, safety, or review-time outcome is measured here.",
  ]),
});

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

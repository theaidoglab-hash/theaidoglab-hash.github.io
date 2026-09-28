import { citedReturnDraftRequest } from "../data/request-fixtures.mjs";
import { SYNTHETIC_POLICY_CORPUS } from "../data/synthetic-policy-corpus.mjs";
import { routePolicyQuestion } from "../src/route-policy-question.mjs";

const report = routePolicyQuestion({
  corpus: SYNTHETIC_POLICY_CORPUS,
  request: citedReturnDraftRequest,
});

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

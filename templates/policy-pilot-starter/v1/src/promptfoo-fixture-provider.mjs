import { FIXED_EVALUATION_CASES } from "./evaluation-cases.mjs";
import { routePolicyQuestion } from "./route-policy-question.mjs";
import { SYNTHETIC_POLICY_CORPUS } from "../data/synthetic-policy-corpus.mjs";

const casesById = new Map(FIXED_EVALUATION_CASES.map((scenario) => [scenario.scenarioId, scenario]));

/**
 * Optional Promptfoo-compatible provider for this local fixture only. It does
 * not import an SDK, read a credential, call a network, or invoke a model.
 */
export default class PolicyPilotFixtureProvider {
  id = () => "policy-pilot-starter-fixture-only";

  callApi = async (_prompt, context = {}) => {
    const scenarioId = context.vars?.case_id;
    const scenario = casesById.get(scenarioId);
    if (!scenario) {
      return {
        error: "Unknown fixture case ID.",
        output: JSON.stringify({ route: "HUMAN_REVIEW_REQUIRED", reasonCode: "UNKNOWN_FIXTURE_CASE" }),
      };
    }

    return {
      output: JSON.stringify(routePolicyQuestion({ corpus: SYNTHETIC_POLICY_CORPUS, request: scenario.request })),
      metadata: Object.freeze({
        providerMode: "fixture_only_no_network_no_credential",
        scenarioId,
      }),
    };
  };
}

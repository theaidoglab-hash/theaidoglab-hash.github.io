import { FIXED_EVALUATION_CASES } from "./evaluation-cases.mjs";
import { runPolicyPilot } from "./policy-pilot.mjs";

const casesById = new Map(
  FIXED_EVALUATION_CASES.map((scenario) => [scenario.scenarioId, scenario]),
);

/**
 * Promptfoo-compatible provider for the deterministic local fixture only.
 * It imports no SDK, reads no credential, calls no network, and never invokes
 * a model. Package scripts and CI do not execute this provider.
 */
export default class PolicyPilotFixtureProvider {
  id = () => "policy-pilot-fixture-only";

  callApi = async (_prompt, context = {}) => {
    const scenarioId = context.vars?.case_id;
    const scenario = casesById.get(scenarioId);

    if (!scenario) {
      return {
        error: "Unknown fixture case ID.",
        output: JSON.stringify({
          route: "handoff",
          reasonCode: "UNKNOWN_FIXTURE_CASE",
          action: { kind: "none" },
        }),
      };
    }

    return {
      output: JSON.stringify(runPolicyPilot(scenario.query)),
      metadata: {
        providerMode: "fixture_only_no_network_no_credential",
        scenarioId,
      },
    };
  };
}

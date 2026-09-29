import { PROMPTFOO_CASE_INPUTS } from "./evaluation-cases.mjs";
import { buildWorkforceSignalBrief } from "./workforce-signal-brief.mjs";

/** A deterministic Promptfoo-compatible provider with no credential or network path. */
export default class WorkforceSignalFixtureProvider {
  id = () => "workforce-signal-brief-fixture-only";

  callApi = async (_prompt, context = {}) => {
    const caseId = context.vars?.case_id;
    const input = PROMPTFOO_CASE_INPUTS[caseId];
    if (!input) {
      return { error: "Unknown fixture case ID.", output: JSON.stringify({ status: "SOURCE_REJECTED", reasonCode: "UNKNOWN_FIXTURE_CASE" }) };
    }
    return {
      output: JSON.stringify(buildWorkforceSignalBrief(structuredClone(input))),
      metadata: { providerMode: "fixture_only_no_network_no_credential", caseId },
    };
  };
}

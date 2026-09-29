import { PROMPTFOO_CASE_INPUTS } from "./evaluation-cases.mjs";
import { buildKevReviewPacket } from "./review-packet.mjs";

/**
 * Promptfoo-compatible local provider. It calls only the deterministic fixture
 * builder and never invokes a model, reads credentials, or uses the network.
 */
export default class KevFixtureProvider {
  id = () => "kev-review-packet-fixture-only";

  callApi = async (_prompt, context = {}) => {
    const caseId = context.vars?.case_id;
    const input = PROMPTFOO_CASE_INPUTS[caseId];

    if (!input) {
      return {
        error: "Unknown fixture case ID.",
        output: JSON.stringify({ status: "SOURCE_REJECTED", reasonCode: "UNKNOWN_FIXTURE_CASE" }),
      };
    }

    return {
      output: JSON.stringify(buildKevReviewPacket(structuredClone(input))),
      metadata: {
        providerMode: "fixture_only_no_network_no_credential",
        caseId,
      },
    };
  };
}

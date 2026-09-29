import { FIXED_CASES } from "../data/fixed-cases.mjs";
import { buildKevReviewPacket } from "./build-review-packet.mjs";

const casesById = new Map(FIXED_CASES.map((testCase) => [testCase.id, testCase]));

/**
 * Optional Promptfoo-compatible provider for local fixture evaluation only.
 * It does not import an SDK, read a credential, call a network, or invoke a model.
 */
export default class KevReviewPacketFixtureProvider {
  id = () => "kev-review-packet-starter-fixture-only";

  callApi = async (_prompt, context = {}) => {
    const caseId = context.vars?.case_id;
    const testCase = casesById.get(caseId);
    if (!testCase) {
      return {
        error: "Unknown fixture case ID.",
        output: JSON.stringify({ route: "SOURCE_REJECTED", reasonCode: "UNKNOWN_FIXTURE_CASE" }),
      };
    }

    return {
      output: JSON.stringify(buildKevReviewPacket(structuredClone(testCase.input))),
      metadata: Object.freeze({
        providerMode: "fixture_only_no_network_no_credential",
        caseId,
      }),
    };
  };
}

import { SYNTHETIC_KEV_RECORD, SYNTHETIC_SOURCE_RECEIPT } from "../data/synthetic-kev-record.mjs";
import { validateKevRecord, validateSourceReceipt } from "../src/validate.mjs";

const record = validateKevRecord(SYNTHETIC_KEV_RECORD);
const receipt = validateSourceReceipt(SYNTHETIC_SOURCE_RECEIPT);

if (!record.ok || !receipt.ok) {
  console.error(JSON.stringify({ record, receipt }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "FIXTURE_VALID",
    recordId: SYNTHETIC_KEV_RECORD.cveId,
    receiptId: SYNTHETIC_SOURCE_RECEIPT.receiptId,
    provenance: SYNTHETIC_SOURCE_RECEIPT.provenance,
  }, null, 2));
}

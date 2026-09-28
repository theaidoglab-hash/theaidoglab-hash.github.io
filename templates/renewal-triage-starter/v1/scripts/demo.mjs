import { draftQueueRequest } from "../data/request-fixtures.mjs";
import { syntheticRenewalSnapshot } from "../data/synthetic-renewal-snapshot.mjs";
import { routeRenewalTriage } from "../src/route-renewal-triage.mjs";

const report = routeRenewalTriage({
  snapshot: syntheticRenewalSnapshot,
  request: draftQueueRequest,
  capacity: 2,
});

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

import { DEMO_INPUT } from "../data/fixed-cases.mjs";
import { buildKevReviewPacket } from "../src/build-review-packet.mjs";

console.log(JSON.stringify(buildKevReviewPacket(DEMO_INPUT), null, 2));

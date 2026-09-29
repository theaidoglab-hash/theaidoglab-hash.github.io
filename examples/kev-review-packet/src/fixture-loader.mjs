import fs from "node:fs";
import { fileURLToPath } from "node:url";

const recordPath = fileURLToPath(new URL("../data/kev-record.fixture.json", import.meta.url));
const manifestPath = fileURLToPath(new URL("../data/source-manifest.fixture.json", import.meta.url));

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

export function loadFixtureBundle() {
  return Object.freeze({
    kevRecord: structuredClone(loadJson(recordPath)),
    sourceManifest: structuredClone(loadJson(manifestPath)),
  });
}

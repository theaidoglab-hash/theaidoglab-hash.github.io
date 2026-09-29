import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(directory, "..", "data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDirectory, name), "utf8"));
}

export function loadFixtureBundle() {
  return Object.freeze({
    sourceManifest: readJson("source-manifest.fixture.json"),
    series: readJson("series.fixture.json"),
    requestedAction: "none",
  });
}

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const starterRoot = path.join(root, "public", "templates", "approval-queue-starter", "v1");

function fail(message) {
  throw new Error(`Approval Queue starter: ${message}`);
}

function readZipEntryNames(archivePath) {
  const archive = fs.readFileSync(archivePath);
  const endOfCentralDirectory = 0x06054b50;
  const centralDirectoryHeader = 0x02014b50;
  const searchStart = Math.max(0, archive.length - 65_557);
  let endOffset = -1;

  for (let offset = archive.length - 22; offset >= searchStart; offset -= 1) {
    if (archive.readUInt32LE(offset) === endOfCentralDirectory) {
      endOffset = offset;
      break;
    }
  }

  if (endOffset === -1) fail("archive has no end-of-central-directory record");
  const entryCount = archive.readUInt16LE(endOffset + 10);
  let offset = archive.readUInt32LE(endOffset + 16);
  const names = [];

  for (let index = 0; index < entryCount; index += 1) {
    if (archive.readUInt32LE(offset) !== centralDirectoryHeader) {
      fail(`archive central-directory entry ${index + 1} is invalid`);
    }
    const fileNameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    names.push(archive.subarray(offset + 46, offset + 46 + fileNameLength).toString("utf8"));
    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return names;
}

for (const relativePath of [
  "README.md",
  "package.json",
  "data/synthetic-faq.mjs",
  "data/request-fixtures.mjs",
  "src/contracts.mjs",
  "src/fixture-validation.mjs",
  "src/safety.mjs",
  "src/retrieval.mjs",
  "src/deterministic-draft.mjs",
  "src/route-approval-queue.mjs",
  "tests/approval-queue.test.mjs",
  "scripts/demo.mjs",
  "docs/decision-brief.md",
  "docs/evaluation-and-adaptation.md",
  "approval-queue-starter-v1.zip",
]) {
  if (!fs.existsSync(path.join(starterRoot, relativePath))) fail(`missing ${relativePath}`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(starterRoot, "package.json"), "utf8"));
if (manifest.type !== "module" || manifest.engines?.node !== ">=20") {
  fail("package must remain dependency-free Node 20+ ESM");
}
if (manifest.scripts?.test !== "node --test tests/approval-queue.test.mjs" || manifest.scripts?.demo !== "node scripts/demo.mjs") {
  fail("package must keep its repeatable test and demo commands");
}
if (manifest.dependencies || manifest.devDependencies) fail("starter must not add package dependencies");

const readme = fs.readFileSync(path.join(starterRoot, "README.md"), "utf8").replace(/\s+/g, " ");
for (const phrase of [
  "reader-owned local exercise",
  "not a customer support system or a production approval queue",
  "no third-party dependencies, install step, environment variables, credentials, network calls, model calls, or external actions",
  "deterministic local template",
  "does not prove answer quality, safety performance, review-time savings, business impact, data permissions, privacy approval, security approval, production readiness, or suitability for live data",
]) {
  if (!readme.toLowerCase().includes(phrase.toLowerCase())) fail(`README missing scope boundary: ${phrase}`);
}

for (const relativePath of [
  "data/synthetic-faq.mjs",
  "data/request-fixtures.mjs",
  "src/contracts.mjs",
  "src/fixture-validation.mjs",
  "src/safety.mjs",
  "src/retrieval.mjs",
  "src/deterministic-draft.mjs",
  "src/route-approval-queue.mjs",
  "scripts/demo.mjs",
]) {
  const source = fs.readFileSync(path.join(starterRoot, relativePath), "utf8");
  if (/\bfetch\s*\(|https?:\/\/|process\.env|OPENAI|api[_-]?key/i.test(source)) {
    fail(`${relativePath} must stay local with no credential or network path`);
  }
}

const decisionBrief = fs.readFileSync(path.join(starterRoot, "docs", "decision-brief.md"), "utf8")
  .replace(/\*\*/g, "")
  .replace(/\s+/g, " ");
for (const phrase of [
  "does not authorise a pilot, release, data connection, or customer communication",
  "not measure a business result",
  "manual baseline",
  "LOCAL_FIXTURE_REFERENCE_OK",
]) {
  if (!decisionBrief.includes(phrase)) fail(`decision brief missing: ${phrase}`);
}

const archivePath = path.join(starterRoot, "approval-queue-starter-v1.zip");
if (fs.statSync(archivePath).size < 4_000) fail("download archive is unexpectedly small");
const archiveEntries = readZipEntryNames(archivePath);
for (const relativePath of [
  "README.md",
  "package.json",
  "data/synthetic-faq.mjs",
  "data/request-fixtures.mjs",
  "src/route-approval-queue.mjs",
  "tests/approval-queue.test.mjs",
  "scripts/demo.mjs",
  "docs/decision-brief.md",
]) {
  if (!archiveEntries.includes(relativePath)) fail(`download archive is missing ${relativePath}`);
}
if (archiveEntries.includes("approval-queue-starter-v1.zip")) fail("download archive must not contain itself");

execFileSync(process.execPath, ["--test", "tests/approval-queue.test.mjs"], { cwd: starterRoot, stdio: "pipe" });
const demo = JSON.parse(execFileSync(process.execPath, ["scripts/demo.mjs"], { cwd: starterRoot, encoding: "utf8" }));
if (demo.reportVersion !== "approval-queue-starter-v1" || demo.scope !== "synthetic_local_exercise_only") {
  fail("demo must identify its fixture-only boundary");
}
if (!Array.isArray(demo.scenarios) || demo.scenarios.length !== 4) fail("demo must retain four fixed scenarios");
const routes = demo.scenarios.map(({ result }) => result.route);
if (routes.join("\u0000") !== [
  "DRAFT_FOR_HUMAN_APPROVAL",
  "HANDOFF_NO_CURRENT_APPROVED_SUPPORT",
  "HANDOFF_SAFETY_REVIEW",
  "BLOCKED_EXTERNAL_ACTION_REQUEST",
].join("\u0000")) {
  fail("demo scenarios no longer cover the intended draft and stop routes");
}
for (const { result } of demo.scenarios) {
  if (result.action?.kind !== "none" || result.action?.status !== "not_executed") {
    fail("every demo route must retain the no-action boundary");
  }
  if (result.actionBoundary?.externalActionsPerformed !== false || result.actionBoundary?.requiresHumanReview !== true) {
    fail("every demo route must retain human review and no external action");
  }
  if (result.sourceReceipt?.containsRealCustomerData !== false || result.futureMeasurement?.status !== "not_measured_in_this_fixture") {
    fail("every demo route must retain synthetic-data and measurement boundaries");
  }
}
const happyPath = demo.scenarios[0].result;
if (happyPath.draft?.provider !== "deterministic_local_template" || happyPath.draft?.modelCallMade !== false) {
  fail("happy path must remain a deterministic local draft, not a model call");
}
if (happyPath.citations?.[0]?.faqId !== "SYN-FAQ-001" || happyPath.trace?.rawQuestionStored !== false) {
  fail("happy path must keep its citation and trace-minimisation evidence");
}

console.log("Validated the downloadable, fixture-only Approval Queue starter, its archive contents, runnable checks, and explicit local-only boundary.");

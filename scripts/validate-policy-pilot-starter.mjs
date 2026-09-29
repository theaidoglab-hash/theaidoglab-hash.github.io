import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const starterRoot = path.join(root, "public", "templates", "policy-pilot-starter", "v1");

function fail(message) {
  throw new Error(`PolicyPilot starter: ${message}`);
}

const requiredFiles = [
  "README.md",
  "package.json",
  "expected-output.json",
  "data/synthetic-policy-corpus.mjs",
  "data/request-fixtures.mjs",
  "src/contracts.mjs",
  "src/fixture-validation.mjs",
  "src/retrieve.mjs",
  "src/route-policy-question.mjs",
  "src/evaluation-cases.mjs",
  "src/evaluate.mjs",
  "src/promptfoo-fixture-provider.mjs",
  "src/responses-api-fixture.mjs",
  "scripts/demo.mjs",
  "tests/policy-pilot.test.mjs",
  "evals/promptfoo.fixture.yaml",
  "docs/decision-brief.md",
  "docs/metric-map.md",
  "docs/failure-cases.md",
  "docs/reviewer-decision.md",
  "docs/rollback-record.md",
  "docs/adaptation-worksheet.md",
  "docs/future-model-seam.md",
  "policy-pilot-starter-v1.zip",
];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(starterRoot, relativePath))) fail(`missing ${relativePath}`);
}

const archive = fs.statSync(path.join(starterRoot, "policy-pilot-starter-v1.zip"));
if (archive.size < 3_000) fail("download archive is unexpectedly small");

const manifest = JSON.parse(fs.readFileSync(path.join(starterRoot, "package.json"), "utf8"));
if (manifest.type !== "module" || manifest.engines?.node !== ">=20") {
  fail("package must remain dependency-free Node 20+ ESM");
}
if (manifest.scripts?.test !== "node --test tests/policy-pilot.test.mjs" || manifest.scripts?.demo !== "node scripts/demo.mjs") {
  fail("package must keep repeatable test and demo commands");
}
if (manifest.dependencies || manifest.devDependencies) fail("starter must not add package dependencies");

const readme = fs.readFileSync(path.join(starterRoot, "README.md"), "utf8");
for (const phrase of [
  "invented policy records only",
  "not a production policy service",
  "no third-party dependencies",
  "no model calls",
  "does not prove model quality, business impact, security, privacy approval, production readiness, or suitability for live data",
]) {
  if (!readme.toLowerCase().includes(phrase.toLowerCase())) fail(`README missing scope boundary: ${phrase}`);
}

for (const readmeFile of ["README.md", "README.zh-HK.md", "README.zh-TW.md", "README.zh-Hans.md"]) {
  const localizedReadme = fs.readFileSync(path.join(starterRoot, readmeFile), "utf8");
  for (const phrase of [
    "npx --yes promptfoo@0.123.1 eval",
    "evals/promptfoo.fixture.yaml",
    "results/promptfoo.fixture.json",
    "Node.js 22.22",
  ]) {
    if (!localizedReadme.includes(phrase)) fail(`${readmeFile} is missing optional Promptfoo handoff: ${phrase}`);
  }
}

const gitignore = fs.readFileSync(path.join(starterRoot, ".gitignore"), "utf8");
if (!gitignore.split(/\r?\n/).includes("results/")) {
  fail(".gitignore must exclude optional Promptfoo results/");
}

for (const relativePath of [
  "data/synthetic-policy-corpus.mjs",
  "data/request-fixtures.mjs",
  "src/contracts.mjs",
  "src/fixture-validation.mjs",
  "src/retrieve.mjs",
  "src/route-policy-question.mjs",
  "src/evaluation-cases.mjs",
  "src/evaluate.mjs",
  "src/promptfoo-fixture-provider.mjs",
  "src/responses-api-fixture.mjs",
  "scripts/demo.mjs",
]) {
  const source = fs.readFileSync(path.join(starterRoot, relativePath), "utf8");
  if (/\bfetch\s*\(|https?:\/\/|process\.env|OPENAI_API_KEY|api[_-]?key/i.test(source)) {
    fail(`${relativePath} must stay local with no credential or network path`);
  }
}

const promptfooFixture = fs.readFileSync(path.join(starterRoot, "evals", "promptfoo.fixture.yaml"), "utf8");
for (const phrase of [
  "file://../src/promptfoo-fixture-provider.mjs",
  "current-approved-return",
  "instruction-override-request",
]) {
  if (!promptfooFixture.includes(phrase)) fail(`Promptfoo fixture is missing ${phrase}`);
}
if (/openai:|apiKey\s*:|authorization\s*:|OPENAI_API_KEY/i.test(promptfooFixture)) {
  fail("Promptfoo fixture must remain local and credential-free");
}

const modelSeam = fs.readFileSync(path.join(starterRoot, "src", "responses-api-fixture.mjs"), "utf8");
for (const phrase of [
  "gpt-5-mini",
  "design_note_only_not_executed",
  "store: false",
  "no key",
  "no model output",
]) {
  if (!modelSeam.includes(phrase)) fail(`static model seam missing ${phrase}`);
}

const futureModelSeam = fs.readFileSync(path.join(starterRoot, "docs", "future-model-seam.md"), "utf8");
for (const phrase of [
  "design note only",
  "no key, provider setup, SDK, request, response, model output",
  "separately authorised experiment",
]) {
  if (!futureModelSeam.toLowerCase().includes(phrase.toLowerCase())) fail(`future model seam missing boundary: ${phrase}`);
}

execFileSync(process.execPath, ["--test", "tests/policy-pilot.test.mjs"], { cwd: starterRoot, stdio: "pipe" });
const demo = execFileSync(process.execPath, ["scripts/demo.mjs"], { cwd: starterRoot, encoding: "utf8" });
const report = JSON.parse(demo);
if (report.route !== "CITED_DRAFT_READY" || report.reasonCode !== "CURRENT_APPROVED_POLICY_FOUND") {
  fail("demo must retain the recorded cited-draft route");
}
if (report.citations?.[0]?.policyId !== "SYN-POL-RET-100" || report.citations?.[0]?.version !== "v2") {
  fail("demo must retain the current approved synthetic citation");
}
if (report.actionBoundary?.externalActionsPerformed !== false || report.actionBoundary?.requiresHumanReview !== true) {
  fail("demo must retain the human-review and no-external-action boundary");
}
if (JSON.stringify(report.trace).includes("Can an unused demo keyboard")) {
  fail("demo trace must not retain the raw synthetic question");
}

console.log("Validated the downloadable, fixture-only PolicyPilot starter and its local test, demo, Promptfoo fixture, and static model boundary.");

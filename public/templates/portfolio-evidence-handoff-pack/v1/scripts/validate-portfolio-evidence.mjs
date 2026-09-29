#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDirectory = path.dirname(scriptPath);
const defaultRoot = path.resolve(scriptDirectory, "..");
const argument = process.argv[2];

if (argument === "--help" || argument === "-h") {
  console.log("Usage: node scripts/validate-portfolio-evidence.mjs [pack-directory]");
  console.log("Checks the handoff pack using local files only.");
  process.exit(0);
}

if (process.argv.length > 3) {
  console.error("Usage: node scripts/validate-portfolio-evidence.mjs [pack-directory]");
  process.exit(1);
}

const packRoot = argument ? path.resolve(process.cwd(), argument) : defaultRoot;
const requiredFiles = [
  "README.md",
  "README.zh-HK.md",
  "README.zh-TW.md",
  "README.zh-Hans.md",
  "docs/project-brief.md",
  "docs/source-data-receipt.md",
  "docs/run-receipt.md",
  "docs/claims-and-nonclaims.md",
  "docs/reviewer-decision.md",
  "docs/rollback-record.md",
  "docs/LICENSE_DECISION.md",
  "docs/github-candidate-checklist.md",
  "ci/local-evidence-check.yml.example",
  "scripts/validate-portfolio-evidence.mjs",
];
const validatorRelativePath = "scripts/validate-portfolio-evidence.mjs";
const textExtensions = new Set([
  ".md",
  ".txt",
  ".json",
  ".yaml",
  ".yml",
  ".mjs",
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".html",
  ".css",
]);
const findings = [];
const notices = [];

function relativePath(filePath) {
  return path.relative(packRoot, filePath).split(path.sep).join("/");
}

function addFinding(category, filePath, message, content, index) {
  const line = Number.isInteger(index)
    ? content.slice(0, index).split(/\r?\n/).length
    : null;
  findings.push({
    category,
    path: relativePath(filePath),
    line,
    message,
  });
}

function readRequiredFile(relativeFile) {
  const absoluteFile = path.join(packRoot, relativeFile);
  try {
    const stat = fs.lstatSync(absoluteFile);
    if (stat.isSymbolicLink()) {
      addFinding("required-file", absoluteFile, "must not be a symbolic link");
      return null;
    }
    if (!stat.isFile()) {
      addFinding("required-file", absoluteFile, "must be a regular file");
      return null;
    }
    return fs.readFileSync(absoluteFile, "utf8");
  } catch {
    addFinding("required-file", absoluteFile, "is missing");
    return null;
  }
}

function collectTextFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") {
      continue;
    }
    const entryPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      addFinding("file-boundary", entryPath, "symbolic links are not accepted in this handoff pack");
      continue;
    }
    if (entry.isDirectory()) {
      files.push(...collectTextFiles(entryPath));
      continue;
    }
    const extension = path.extname(entry.name).toLowerCase();
    if (entry.isFile() && (textExtensions.has(extension) || entry.name === ".env")) {
      files.push(entryPath);
    }
  }
  return files;
}

function findAll(content, pattern) {
  const matches = [];
  pattern.lastIndex = 0;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    matches.push(match.index);
    if (match[0].length === 0) {
      pattern.lastIndex += 1;
    }
  }
  return matches;
}

function checkPattern(filePath, content, category, message, pattern) {
  for (const index of findAll(content, pattern)) {
    addFinding(category, filePath, message, content, index);
  }
}

function escapeRegex(value) {
  return value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function readStatus(fileContent, label, allowedValues, relativeFile) {
  const pattern = new RegExp("^" + escapeRegex(label) + "\\s*:\\s*([A-Z_]+)\\s*$", "m");
  const match = fileContent.match(pattern);
  if (!match) {
    findings.push({
      category: "status",
      path: relativeFile,
      line: null,
      message: "missing " + label + " field",
    });
    return null;
  }
  const value = match[1];
  if (!allowedValues.includes(value)) {
    findings.push({
      category: "status",
      path: relativeFile,
      line: fileContent.slice(0, match.index).split(/\r?\n/).length,
      message: label + " has an unsupported value: " + value,
    });
    return null;
  }
  return value;
}

if (!fs.existsSync(packRoot) || !fs.statSync(packRoot).isDirectory()) {
  console.error("FAIL: pack directory does not exist or is not a directory: " + packRoot);
  process.exit(1);
}

const requiredContents = new Map();
for (const relativeFile of requiredFiles) {
  const content = readRequiredFile(relativeFile);
  if (content !== null) {
    requiredContents.set(relativeFile, content);
  }
}

const runStatus = requiredContents.has("docs/run-receipt.md")
  ? readStatus(
      requiredContents.get("docs/run-receipt.md"),
      "Run status",
      ["NOT_RUN", "COMPLETED_LOCAL", "BLOCKED"],
      "docs/run-receipt.md",
    )
  : null;
const reviewerStatus = requiredContents.has("docs/reviewer-decision.md")
  ? readStatus(
      requiredContents.get("docs/reviewer-decision.md"),
      "Review status",
      ["NOT_SUBMITTED", "APPROVED_FOR_NEXT_STEP", "CHANGES_REQUESTED", "DECLINED"],
      "docs/reviewer-decision.md",
    )
  : null;
const licenseStatus = requiredContents.has("docs/LICENSE_DECISION.md")
  ? readStatus(
      requiredContents.get("docs/LICENSE_DECISION.md"),
      "License decision",
      ["UNDECIDED", "PRIVATE_ONLY", "OWNER_APPROVED"],
      "docs/LICENSE_DECISION.md",
    )
  : null;
const repositoryStatus = requiredContents.has("docs/github-candidate-checklist.md")
  ? readStatus(
      requiredContents.get("docs/github-candidate-checklist.md"),
      "Repository candidate status",
      ["NOT_REVIEWED", "REVIEW_REQUESTED", "HOLD"],
      "docs/github-candidate-checklist.md",
    )
  : null;

const candidateWorkflow = requiredContents.get("ci/local-evidence-check.yml.example");
if (candidateWorkflow) {
  for (const required of ["workflow_dispatch:", "contents: read", "node handoff/scripts/validate-portfolio-evidence.mjs"]) {
    if (!candidateWorkflow.includes(required)) {
      findings.push({
        category: "candidate-workflow",
        path: "ci/local-evidence-check.yml.example",
        line: null,
        message: "missing inactive workflow boundary: " + required,
      });
    }
  }
  for (const forbidden of ["push:", "pull_request:", "secrets.", "upload-artifact", "wrangler"]) {
    if (candidateWorkflow.includes(forbidden)) {
      findings.push({
        category: "candidate-workflow",
        path: "ci/local-evidence-check.yml.example",
        line: null,
        message: "must remain an inactive, read-only candidate without " + forbidden,
      });
    }
  }
  if (/^\s*-\s*run:.*\bdeploy\b/im.test(candidateWorkflow)) {
    findings.push({
      category: "candidate-workflow",
      path: "ci/local-evidence-check.yml.example",
      line: null,
      message: "must not contain a deployment command",
    });
  }
}

if (runStatus === "NOT_RUN") {
  notices.push("Run receipt remains NOT_RUN; no execution claim is established.");
}
if (reviewerStatus === "NOT_SUBMITTED") {
  notices.push("Reviewer decision remains NOT_SUBMITTED; no approval claim is established.");
}
if (licenseStatus === "UNDECIDED") {
  notices.push("License decision remains UNDECIDED; no sharing right is established.");
}
if (repositoryStatus === "NOT_REVIEWED") {
  notices.push("Repository candidate remains NOT_REVIEWED; no public repository is implied.");
}

for (const filePath of collectTextFiles(packRoot)) {
  const relativeFile = relativePath(filePath);
  if (relativeFile === validatorRelativePath) {
    continue;
  }
  const content = fs.readFileSync(filePath, "utf8");

  checkPattern(
    filePath,
    content,
    "placeholder",
    "contains an unresolved double-brace template marker",
    /\{\{[^{}\r\n]+\}\}/g,
  );
  checkPattern(
    filePath,
    content,
    "placeholder",
    "contains an unresolved bracketed template marker",
    /\[\[(?:TODO|TBD|REPLACE|INSERT|FILL)\s*:[^\]\r\n]+\]\]/gi,
  );
  checkPattern(
    filePath,
    content,
    "placeholder",
    "contains an unresolved angle-bracket template marker",
    /<(?:TODO|TBD|REPLACE|INSERT|FILL)[^>\r\n]*>/gi,
  );
  checkPattern(
    filePath,
    content,
    "placeholder",
    "contains an unresolved all-caps template marker",
    /\b(?:REPLACE_ME|INSERT_[A-Z0-9_]+|FILL_[A-Z0-9_]+)\b/g,
  );
  checkPattern(
    filePath,
    content,
    "placeholder",
    "contains an unresolved TODO or TBD marker",
    /\b(?:TODO|TBD)\b/gi,
  );

  checkPattern(
    filePath,
    content,
    "secret",
    "contains a private-key header",
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
  );
  checkPattern(
    filePath,
    content,
    "secret",
    "contains an OpenAI-style secret",
    /\b(?:sk|sk-proj)-[A-Za-z0-9_-]{16,}\b/g,
  );
  checkPattern(
    filePath,
    content,
    "secret",
    "contains a Git-host token",
    /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/gi,
  );
  checkPattern(
    filePath,
    content,
    "secret",
    "contains an AWS-style access identifier",
    /\bAKIA[0-9A-Z]{16}\b/g,
  );
  checkPattern(
    filePath,
    content,
    "secret",
    "contains a Slack- or Google-style token",
    /\b(?:xox[baprs]-[A-Za-z0-9-]{16,}|AIza[0-9A-Za-z_-]{24,})\b/g,
  );
  checkPattern(
    filePath,
    content,
    "secret",
    "contains a credential assignment with a non-empty value",
    /\b(?:api|access|secret|private)[_-]?(?:key|token|password)\s*[:=]\s*(?!(?:NOT_RECORDED|NONE|REDACTED|EXAMPLE|SAMPLE|PLACEHOLDER|UNSET|UNDEFINED|NULL)\b)[A-Za-z0-9_./+=-]{8,}/gi,
  );
  checkPattern(
    filePath,
    content,
    "repository-url",
    "contains a GitHub URL or SSH remote; record a local candidate state instead",
    /(?:https?:\/\/|ssh:\/\/git@|git@)?(?:www\.)?github\.com(?:[/:][^\s)\]}>]*)?/gi,
  );
}

console.log("Portfolio evidence handoff validation");
console.log("Root: " + packRoot);
console.log("Required artifacts: " + requiredContents.size + "/" + requiredFiles.length);

if (findings.length > 0) {
  console.error("FAIL: " + findings.length + " issue(s) found.");
  for (const finding of findings) {
    const location = finding.line ? finding.path + ":" + finding.line : finding.path;
    console.error("- [" + finding.category + "] " + location + " — " + finding.message);
  }
  console.error("No readiness claim is made until the issues are resolved.");
  process.exitCode = 1;
} else {
  console.log("PASS: STRUCTURALLY_READY_FOR_OWNER_REVIEW only.");
  console.log("No valid run, evaluation quality, source permission, repository safety, approval, publication, deployment, business impact, or production readiness is established by this check.");
}

for (const notice of notices) {
  console.log("Notice: " + notice);
}

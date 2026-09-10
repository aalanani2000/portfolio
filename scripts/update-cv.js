#!/usr/bin/env node
/**
 * update-cv.js — one-command CV updater for the portfolio.
 *
 * Usage:
 *   node scripts/update-cv.js <path-to-new-cv.pdf> [--dry-run]
 *
 * What it does:
 *   1. Validates the new file is a real PDF (< 5 MB)
 *   2. Copies it over public/cv/Abdulrahman-Alanani-CV.pdf
 *   3. Commits (dated message) and pushes → Vercel auto-redeploys
 *
 * The previous CV version stays in git history forever:
 *   git log --oneline -- public/cv/          # see all versions
 *   git checkout <commit> -- public/cv/…     # roll back
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO = path.resolve(__dirname, "..");
const DEST = path.join(REPO, "public", "cv", "Abdulrahman-Alanani-CV.pdf");
const MAX_MB = 5;

const src = process.argv[2];
const dryRun = process.argv.includes("--dry-run");

if (!src) {
  console.error('Usage: node scripts/update-cv.js <path-to-new-cv.pdf> [--dry-run]');
  process.exit(1);
}
if (!fs.existsSync(src)) {
  console.error("ERROR: file not found:", src);
  process.exit(1);
}

const buf = fs.readFileSync(src);
if (buf.subarray(0, 4).toString() !== "%PDF") {
  console.error("ERROR: not a valid PDF (missing %PDF header).");
  process.exit(1);
}
const mb = +(buf.length / (1024 * 1024)).toFixed(2);
if (mb > MAX_MB) {
  console.error(`ERROR: file is ${mb} MB — keep it under ${MAX_MB} MB (compress via ilovepdf/acrobat).`);
  process.exit(1);
}

const oldSize = fs.existsSync(DEST) ? +(fs.statSync(DEST).size / (1024 * 1024)).toFixed(2) : 0;
const identical =
  fs.existsSync(DEST) && buf.equals(fs.readFileSync(DEST));
if (identical) {
  console.log("CV is identical to the deployed version — nothing to do.");
  process.exit(0);
}

console.log(`New CV: ${mb} MB  (current: ${oldSize} MB)`);

if (dryRun) {
  console.log("DRY RUN — no changes made. Run again without --dry-run to apply.");
  process.exit(0);
}

fs.copyFileSync(src, DEST);
console.log("Copied →", DEST);

const msg = `cv: update CV PDF (${new Date().toISOString().slice(0, 10)})`;
execSync(`git add "${DEST}"`, { cwd: REPO });
execSync(`git commit -m "${msg}"`, { cwd: REPO, stdio: "inherit" });
execSync("git push", { cwd: REPO, stdio: "inherit" });

console.log("\n✅ CV updated and pushed.");
console.log("   Live at https://anani.online within ~60 seconds (Vercel auto-deploy).");
console.log("   Previous version remains in git history for rollback.");
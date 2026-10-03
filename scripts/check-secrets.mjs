import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const paths = execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACM", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
const leaks = paths.filter(path => /(?:[sr]k_(?:live|test)_[A-Za-z0-9]{12,}|whsec_[A-Za-z0-9]{12,})/.test(readFileSync(path, "utf8")));
if (leaks.length) {
  console.error("Commit blocked: possible Stripe credential in", leaks.join(", "));
  process.exitCode = 1;
}

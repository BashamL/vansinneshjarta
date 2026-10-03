// StPageFlip 2.0.7 does not stop its frame loop on destroy. Keep React
// Strict Mode, navigation, and reduced-motion rebuilds free of orphan loops.
// Remove this patch when an upstream release includes lifecycle cleanup.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const file = require.resolve("page-flip");
let source = readFileSync(file, "utf8");
const patches = [
  [
    "start(){this.update();const t=e=>{this.render(e),requestAnimationFrame(t)};requestAnimationFrame(t)}",
    "start(){this.update();const t=e=>{if(this.frameLoopStopped)return;this.render(e),this.frameRequest=requestAnimationFrame(t)};this.frameRequest=requestAnimationFrame(t)}",
  ],
  [
    "destroy(){this.ui.destroy(),this.block.remove()}",
    "destroy(){this.render.frameLoopStopped=!0,cancelAnimationFrame(this.render.frameRequest),this.ui.destroy(),this.block.remove()}",
  ],
  [
    "destroy(){this.app.getSettings().useMouseEvents&&this.removeHandlers(),",
    "destroy(){this.removeHandlers(),",
  ],
];

for (const [before, after] of patches) {
  if (source.includes(after)) continue;
  if (!source.includes(before)) {
    throw new Error("Page-flip lifecycle patch needs review for this version.");
  }
  source = source.replace(before, after);
}

writeFileSync(file, source);

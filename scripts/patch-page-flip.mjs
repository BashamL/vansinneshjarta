// StPageFlip 2.0.7 does not stop its frame loop on destroy. Keep React
// Strict Mode, navigation, and reduced-motion rebuilds free of orphan loops.
// Also refine the stock linear turn and double-band shadow for this reader.
// Review these exact replacements before upgrading the pinned dependency.
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
  // Smooth acceleration and a soft landing; pointer-driven folds remain direct.
  [
    "const e=Math.round((t-this.animation.startedAt)/this.animation.durationFrame);",
    "const p=Math.max(0,Math.min(1,(t-this.animation.startedAt)/this.animation.duration)),e=Math.round(p*p*(3-2*p)*this.animation.frames.length);",
  ],
  // Begin with a small lifted corner rather than jumping into a large fold.
  ["const i=e.height/10,s=", "const i=e.height/40,s="],
  // Portrait mode copies the outgoing poem onto its own reverse side. Mark
  // that temporary back face so it can be blank paper instead of ghost text.
  [
    "this.copiedElement=this.element.cloneNode(!0),this.element.parentElement",
    "this.copiedElement=this.element.cloneNode(!0),this.copiedElement.classList.add(\"book-reverse\"),this.element.parentElement",
  ],
  // One narrow, warm crease, rather than the library's broad double gray band.
  [
    "rgba(0, 0, 0, ${this.shadow.opacity}) 5%,\\n                rgba(0, 0, 0, 0.05) 15%,\\n                rgba(0, 0, 0, ${this.shadow.opacity}) 35%,\\n                rgba(0, 0, 0, 0) 100%",
    "rgba(70, 49, 25, ${this.shadow.opacity}) 0%,\\n                rgba(70, 49, 25, ${this.shadow.opacity * 0.35}) 12%,\\n                rgba(70, 49, 25, 0) 55%",
  ],
];

for (const [before, after] of patches) {
  if (source.includes(after)) continue;
  if (!source.includes(before)) {
    throw new Error("Page-flip patch needs review for this version.");
  }
  source = source.replace(before, after);
}

writeFileSync(file, source);

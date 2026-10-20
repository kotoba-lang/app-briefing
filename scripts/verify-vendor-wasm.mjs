// scripts/verify-vendor-wasm.mjs — vendored 資材だけで guest が admission
// できることを確認する（bundle 検証、app-itonami と同じ流儀）。
// 使い方: node scripts/verify-vendor-wasm.mjs
import { readFileSync, readdirSync } from "node:fs";
import { loadGuest, expectExports }
  from "../appview/etzhayyim-wasm-briefing-w3olw1pf/web/vendor/kotodama-load.mjs";

const EXPECTED = {
  "host_util.wasm": ["nsid-valid?"],
  "host_types.wasm": ["seq-ok?", "text-ok?", "commit-shape-ok?"],
  "host_cadence.wasm": ["determine-mood-code", "mood-cadence", "apply-stress-scaling"],
  "host_model.wasm": ["normalize-hint", "choose-model-id"],
  "host_lexicon.wasm": ["field-type-ok?", "required-present?"],
  "host_heartbeat.wasm": ["create-cadence-state"],
};

const wasmDir = new URL(
  "../appview/etzhayyim-wasm-briefing-w3olw1pf/web/wasm/", import.meta.url);
const found = readdirSync(wasmDir).filter((f) => f.endsWith(".wasm"));
let failed = 0;
for (const [name, exports] of Object.entries(EXPECTED)) {
  if (!found.includes(name)) {
    failed += 1;
    console.log(`FAIL ${name}: not vendored`);
    continue;
  }
  try {
    const guest = await loadGuest(new Uint8Array(readFileSync(new URL(name, wasmDir))));
    expectExports(guest, exports);
    console.log(`OK   ${name}: admitted (${exports.join(", ")})`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL ${name}: ${error?.message ?? error}`);
  }
}
console.log(failed === 0 ? "ALL ADMITTED (vendored)" : `${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);

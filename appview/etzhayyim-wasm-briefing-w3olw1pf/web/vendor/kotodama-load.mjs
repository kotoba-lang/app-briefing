// kotodama-load.mjs — appview 用の薄い guest ローダ（JUN-133、app-itonami と
// 同じ流儀）。browser-host.mjs 経由で guest wasm を admission する。
import { instantiateKotoba } from "./browser-host.mjs";

export async function loadGuest(bytes, options = { allowCapabilities: [] }) {
  const result = await instantiateKotoba(bytes, options);
  return Object.freeze({
    instance: result.instance,
    exports: result.instance.exports,
    typedValues: result.typedValues,
    typedAbi: result.typedAbi,
    sha256: result.sha256 ?? null,
  });
}

export function expectExports(guest, names) {
  const got = Object.keys(guest.exports);
  const missing = names.filter((n) => !got.includes(n));
  if (missing.length > 0)
    throw new Error(`guest exports missing: ${missing.join(", ")} (got: ${got.join(", ")})`);
  return guest;
}

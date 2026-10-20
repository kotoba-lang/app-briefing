# web/vendor — JUN-133: kototama browser host runtime と guest wasm（app-briefing）

- `browser-host.mjs` — copied unmodified from kotoba-lang/amu
  `runtime/browser-host.mjs`（Apache-2.0、app-itonami と同じ流儀）。
  kototama-browser-host-v1（:wasm32-browser-kotoba-v1）の typed host runtime。
- `kotodama-load.mjs` — この appview 用の薄いローダ。

## web/wasm — guest wasm（判定核）

kotoba-lang/kotodama-host の guest モジュール 6 本（host_util / host_types /
host_cadence / host_model / host_lexicon / host_heartbeat）の wasm32-browser
ビルド。`.wasm.provenance.edn` は成果物と同じ単位（JUN-128 流儀）。

更新手順（app-itonami の web/vendor/README.md と同じ）:

```sh
git -C ../../../../../kotoba-lang/kotodama-host fetch https://github.com/kotoba-lang/kotodama-host.git main
git -C ../../../../../kotoba-lang/kotodama-host worktree add /tmp/kdh FETCH_HEAD
(cd /tmp/kdh && sh scripts/build-guest-wasm.sh)
cp /tmp/kdh/dist/*.wasm /tmp/kdh/dist/*.provenance.edn web/wasm/
```

読み込み検証: `node scripts/verify-vendor-wasm.mjs`（repo ルートで実行）。

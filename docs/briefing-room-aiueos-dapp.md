# app-briefing（会議ルーム）— itonami（dapp）上の分散型設計

状態: 第 1 スライス実装（2026-10-20）。正本はこの文書。
追跡: Linear JUN-128（親 JUN-116）。

## 位置づけ

app-briefing は **WebRTC マルチアクター会議**（transcriber / translator /
recorder / summarizer）。**PII Tier 3（録音）** —— 議事録・録音・アクション・
決定は **E2E 暗号封筒の inner-type**。

## このスライス: ルーム・アジェンダ判定コア

| 層 | 実体 | 状態 |
|---|---|---|
| 判定コア guest | `aiueos/briefing_room.cljk` — room-status-ok（active/closed）/ topology-ok（mesh/sfu）/ decision-method-ok（vote/consensus）/ action-status-ok（open/done/cancelled）/ room-create（**maxParticipants は非負整数かつ 1 以上**）/ agenda-admission（ordinal・allocatedSeconds は非負整数 + ルームの存在） | **実装済み・実測** |
| 記述子 | `aiueos/briefing-room.edn` | **実装済み** |
| parity | `kotoba/test/briefing/room_parity_test.cljk` — 正本（registry.ts / types.ts）の閉じた集合・maxParticipants 規則・E2E inner-type と一致 | **実装済み・実測** |

実測: `amu test aiueos/briefing_room.cljk` → **15/15**（jvm-kir / js / wasm）。
parity → 2 tests / 15 assertions / 0 failures。

## 正本の正確な規則（guest はこれに追従）

- **RoomTopology** = mesh / sfu。**RoomStatus** = active / closed。
  **DecisionMethod** = vote / consensus。**ActionItemStatus** =
  open / done / cancelled。
- createRoom: roomId + name 必須、**maxParticipants は isUint かつ 1 以上**
  （`maxParticipants < 1` は invalidMaxParticipants —— 0 人の会議室は無い）。
- addAgendaItem: ordinal / allocatedSeconds は isUint、ルームの存在が必須。
- **E2E inner-type 4 つ**: transcript / recordingAsset / actionItem /
  decision（watashi / wire と同じ「暗号封筒の中だけ」原則）。

## 未実装境界

- 会議の進行判定（decision の成立規則 vote/consensus の集計）。
- action item の状態遷移（open → done / cancelled）。
- WebRTC ネットワーク面（mesh/sfu の切替）は host。
- mon（DNA）化、aiueos session 載せ（fleet 共通）。

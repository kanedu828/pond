# Pond Rebuild Design

**Date:** 2026-07-26

**Status:** Approved product and technical design

**Target stack:** React, TypeScript, Go, PostgreSQL

## Summary

Pond will be rebuilt as a desktop-first, responsive browser fishing companion.
Its primary experience is ambient: the player leaves a calm pond open while
working, studying, or playing something else, then returns for a brief skillful
encounter when a fish appears. A separate fishing-trip mode supports intentional
10–20 minute play sessions without displacing the ambient loop.

The rebuild is a clean break. Existing tables, APIs, sessions, accounts, and
behavior do not need to be migrated or preserved. The existing fish catalog and
visual assets may be reused selectively, but the new design owns its data model
and behavior.

## Product goals

1. Create a calm browser companion that is pleasant when nothing is happening.
2. Turn each fish appearance into a readable 10–20 second skill challenge.
3. Make exploration of new waters the primary long-term motivation.
4. Support both passive ambient use and deliberate short fishing sessions.
5. Make catches memorable through species, size, rarity, location, and records.
6. Work coherently from a 320×568 phone viewport through large desktop displays.
7. Remain technically small enough for one codebase and one deployable backend.

## Non-goals

The first playable rebuild will not include:

- Compatibility with the old database, API, sessions, accounts, or catch data.
- Live multiplayer, shared realtime spaces, chat, or WebSockets.
- Native desktop or mobile applications.
- Phaser or another game engine.
- Friends, community goals, or public leaderboards.
- Trading, crafting, a large currency economy, or deep equipment builds.
- Energy systems, daily streak penalties, battle passes, or monetization.
- A large multi-location content launch.

## Audience and use context

The primary player uses Pond on desktop in a normal tab or narrow side window
while focused on another activity. Mobile is a supported secondary surface for
checking the field guide and taking a short trip, not the design center of the
first release.

Pond should be understandable without a long tutorial. A new guest receives a
guided first encounter, sees the collection update, and can then leave the pond
open or begin a trip.

## Product pillars

### Calm until it matters

The resting pond is the product, not a loading screen between rewards. Movement,
sound, alerts, and interface chrome remain restrained until an encounter begins.

### Luck creates the opportunity; skill earns the catch

Scheduling and rarity create anticipation. The tension minigame determines the
outcome. Equipment improves margins but never guarantees a catch.

### Every catch tells a story

The field guide records discovery, size, count, location, and personal bests.
Individual catch records remain available instead of storing only aggregate
counts.

### New waters drive progression

Angler rank and location mastery reveal new environments. Gear and bait support
exploration rather than becoming an independent optimization game.

### No punishment loops

An unclaimed or failed fish escapes. The player does not lose existing progress,
and basic bait is always available. Pond does not use energy meters or streak
penalties to force return behavior.

### Social without pressure

Future social systems are asynchronous: friends' field guides, fish-specific
records, profiles, and community discoveries. Synchronous participation is not
required.

## World and content direction

The tone is whimsical naturalism. Early species and environments are grounded
in recognizable freshwater fishing. Later locations introduce folklore,
unusual variants, and rare magical discoveries while preserving the natural,
quiet atmosphere.

The first location is **Willow Pond**, containing 12 species: six common, three
rare, two epic, and one legendary. The species are distributed across four
behavior profiles: steady, darting, stubborn, and erratic. The next location is
visible but locked so the exploration promise is present in the vertical slice.

## Core experience

### Ambient loop

1. The player leaves Willow Pond open.
2. While the player has an active event-stream connection, the server advances
   a persisted encounter timer sampled from the universal 10–60 minute base
   interval. Bait and explicitly labeled equipment modifiers may reduce its
   upper bound, but never below 30 minutes or outside the 10-minute lower bound.
3. The client receives an `encounter.available` event and presents visual,
   title, sound, and optional system-notification alerts.
4. The fish remains available for its rarity window.
5. The player starts the tension minigame or the fish escapes.
6. A catch updates the field guide and progression; an escape schedules the
   next encounter without removing prior progress.

Initial ambient availability windows are:

| Rarity | Availability |
| --- | ---: |
| Common | 120 seconds |
| Rare | 90 seconds |
| Epic | 60 seconds |
| Legendary | 30 seconds |

The guided first encounter becomes available within 30 seconds of guest entry,
uses a common fish, and remains available for five minutes. Once its minigame
starts, normal catch and escape rules apply.

Ambient waiting pauses when the player's last event-stream connection closes and
resumes from its persisted remaining duration when the first connection returns.
Pond therefore creates no invisible encounters or escapes while the application
is closed. Once an encounter becomes available or starts, its deadlines are
absolute and do not pause. Multiple open tabs observe the same schedule and
encounter rather than creating independent fish.

### Fishing-trip loop

1. The player chooses an unlocked location and bait.
2. Starting the trip consumes one specialized bait or selects unlimited basic
   bait.
3. The default trip lasts 15 minutes. Content configuration may offer trips from
   10 to 20 minutes later.
4. Encounters arrive 60–150 seconds apart, excluding time spent in a minigame.
5. The player reviews catches, records, and location progress when the trip ends.

Trips provide dependable progress and targeted species odds. For ambient
encounters, every non-common rarity weight is multiplied by 1.10 before all
weights are normalized. This keeps leaving Pond open modestly more favorable
without making trips poor for discovery.

Starting a trip pauses the ambient schedule so both modes cannot produce fish at
once. Trip duration and between-encounter waits count only while at least one
event-stream connection is active. Closing Pond therefore pauses a trip rather
than consuming its bait or remaining play time. An encounter that is already
available or started retains its absolute deadline. Ending or completing the
trip resumes the persisted ambient wait.

### Bait rules

Basic bait is unlimited and applies neutral selection weights. Specialized bait
is consumable and may:

- Increase weights for a named habitat, rarity, or species group.
- Reduce the upper bound of the next ambient interval, with a floor of 30
  minutes.
- Modify trip encounter spacing within the 60–150 second range.

Ambient specialized bait is consumed when an encounter is created. Trip bait is
consumed when the trip starts and applies to the whole trip. Bait changes
probability and timing but never guarantees a species or rarity.

The guided flow grants three uses of each specialized bait included in the
vertical slice. Additional specialized bait is awarded by first discoveries and
Willow Pond mastery goals. There is no bait shop or currency in this release.

## Tension minigame

### Input

One action works across devices:

- Hold the primary mouse button, spacebar, or touch surface to reel.
- Release to ease the line.

No rapid clicking, directional sequence, or device-specific gesture is required.

### Rules

The minigame exposes line tension and catch progress. Tension uses a normalized
0–100 scale.

- Holding increases base tension and advances catch progress while tension is in
  the safe zone.
- Releasing decreases base tension.
- The fish behavior adds readable pull impulses.
- Reaching 100 tension snaps the line immediately.
- Remaining below 5 tension for 1.5 continuous seconds throws the hook.
- Reaching 100 catch progress before the configured 10–20 second deadline lands
  the fish.
- Reaching the deadline without completing catch progress is an escape.

Species select one of four behavior profiles: steady, darting, stubborn, or
erratic. Content parameters tune pull strength, impulse timing, safe-zone width,
progress rate, and deadline. Rarity narrows or shifts these values within
validated ranges, and specimen size may scale pull strength within the species'
validated range. Equipment may widen the safe zone, soften pull impulses, extend
slack tolerance, or apply the bounded ambient-timing modifier, but cannot remove
either failure condition.

The client renders the simulation from server-issued encounter parameters and a
seed. The server remains authoritative over whether the encounter is active,
whether it has already resolved, its reward, and whether the submitted duration
is plausible. Pond deliberately avoids invasive client telemetry or heavyweight
anti-cheat.

## Collection and progression

### Field guide

Each species entry contains:

- Name, rarity, habitat, description, and illustration.
- First-caught date and location.
- Total caught and largest specimen.
- Personal-best markers.
- An undiscovered silhouette and contextual discovery hint.

Fish are recorded and released. A catch creates an individual immutable record;
summary counts and maximum size are derived or maintained transactionally for
efficient reads.

### Angler progression

Catches award angler experience. First discoveries, unusually large specimens,
and difficult minigames award bonuses. Angler rank gates new waters, while each
location has mastery requirements such as discovering most resident species and
landing its signature fish.

A new location requires both its angler-rank threshold and its preceding
location-mastery threshold. Players therefore cannot unlock the full map by
repeatedly catching one common fish.

### Equipment

Rods, reels, and lines provide one or two legible modifiers each. The first
vertical slice includes only enough equipment to prove that rewards can change
the minigame without creating a combinatorial build system. Equipment is earned
through angler rank and location mastery rather than a large shop economy.

## Responsive experience and visual assets

The approved home direction is the **immersive pond**. The fishing animation is
the dominant visual surface, while navigation and progression remain in compact
surrounding chrome.

The interface uses three responsive arrangements:

- At 960 CSS pixels and above, show full navigation in a top bar and encounter
  status plus the trip action in a matching bottom bar.
- From 600 through 959 pixels, condense secondary navigation and retain the same
  top/bottom hierarchy.
- Below 600 pixels, use a compact header and reachable bottom navigation.

The existing 997×894 idle GIF contains visible artwork only within the union
rectangle `(0, 311)–(762, 869)`. Centering its full transparent canvas makes the
drawing appear low and left. Each animation asset will therefore define visible
bounds in an asset manifest. Presentation centers and scales those visible bounds
with safe padding while preserving every illustrated pixel and the asset's
proportions. No responsive layout may use `object-fit: cover` for these fishing
animations.

The same controls and state hierarchy appear at every breakpoint. Mouse,
keyboard, and touch targets change size and placement, not meaning.

## Accessibility

- Mouse, spacebar, and touch provide equivalent minigame input.
- Every sound alert has a visible equivalent.
- System notifications are optional; Pond requests permission only from a clear
  player-initiated settings action.
- Reduced-motion mode replaces nonessential movement and transitions while
  retaining encounter-state changes.
- Status never relies on color alone.
- Interactive targets and text maintain usable sizing at 320 CSS pixels wide.
- The field guide and trip setup follow normal document semantics and keyboard
  navigation.

## Technical architecture

### System shape

Pond consists of three runtime components:

1. A React and TypeScript single-page application.
2. A single Go service organized as a modular monolith.
3. PostgreSQL.

The web client and API should be served from the same site in production. This
simplifies session security, event-stream authentication, and deployment.

### React client boundaries

- **App shell:** routing, responsive navigation, connection status, settings.
- **Pond scene:** animation presentation, ambient state, encounter alert.
- **Encounter:** pure minigame model, input adapters, rendering, result display.
- **Trips:** location and bait selection, trip state, summary.
- **Field guide:** discovery and personal-record views.
- **Identity:** guest creation, session bootstrap, later account upgrade.
- **API layer:** generated client, server-event subscription, cache invalidation.

The encounter model does not depend on React or animation assets. React adapts
the pure state model to DOM input and rendering, allowing deterministic tests.
Phaser is not included. If future encounters require complex sprite systems,
physics, or scene management, it may be added behind the encounter rendering
boundary without changing the application shell.

### Go service boundaries

- **Identity:** guests, registered accounts, sessions.
- **Catalog:** validated embedded locations, species, bait, equipment, and tuning.
- **Fishing:** scheduling, encounter creation, start and resolution rules.
- **Trips:** trip lifecycle and encounter cadence.
- **Collection:** catches, field-guide summaries, personal records.
- **Progression:** experience, ranks, mastery, unlocks, and rewards.
- **Events:** authenticated server-sent event delivery and reconnect handling.
- **Storage:** PostgreSQL repositories and transaction boundaries.

Modules communicate through explicit domain interfaces. HTTP handlers translate
transport data and call application services; they do not contain gameplay or
database logic.

### Authored content

Species, locations, rarity weights, bait, equipment, behavior profiles, and
tuning ranges live in version-controlled data files embedded in the Go binary.
Startup validation rejects missing identifiers, invalid ranges, unreachable
species, or references to nonexistent content. Persistent rows store the content
identifier and content-version value used for the encounter or catch.

### Persistent entities

The new schema contains:

- `players`: guest or registered identity and current progression.
- `sessions`: hashed session tokens, expiry, and player ownership.
- `ambient_schedules`: remaining wait, active due time, location, bait, and
  connection eligibility for each player.
- `encounters`: schedule, location, species, size, behavior seed, deadlines,
  state, outcome, and content version.
- `trips`: player, location, bait, remaining active duration, encounter wait,
  start, end, and state.
- `catches`: immutable successful-catch records linked to encounters.
- `location_progress`: discovery and mastery state per player and location.
- `owned_equipment`: equipment ownership and acquisition source.
- `loadouts`: selected rod, reel, line, bait, and current location.

Foreign keys, unique encounter outcomes, and transactions enforce invariants.
The server does not rely on in-memory maps as the authoritative state.

## HTTP and event contracts

Commands and queries use JSON over HTTP. The initial contract includes:

- `POST /api/guests` — create a guest and session.
- `GET /api/bootstrap` — retrieve identity, loadout, progression, trip, and
  current encounter state.
- `GET /api/events` — open the authenticated server-sent event stream.
- `POST /api/encounters/{id}/start` — atomically move an available encounter to
  started and return its public minigame configuration.
- `POST /api/encounters/{id}/resolve` — submit catch or escape with an
  idempotency key.
- `POST /api/trips` — begin a trip with a location and bait.
- `POST /api/trips/{id}/end` — end a trip early.
- `GET /api/field-guide` — retrieve collection summaries and discovery hints.
- `GET /api/progression` — retrieve rank, mastery, and unlock state.

The server publishes these initial SSE event types:

- `encounter.available`
- `encounter.expired`
- `trip.updated`
- `player.updated`

The vertical slice does not maintain a durable event-replay log. Whenever an SSE
connection opens or reopens, the client calls `/api/bootstrap` before applying
new events. The bootstrap snapshot is authoritative and makes missed event
replay unnecessary.

A checked-in `openapi.yaml` file is the HTTP contract source of truth. It
generates the TypeScript client and is verified against the Go handlers by
contract tests. The old manually shared TypeScript package is removed.

## Encounter data flow

1. The browser creates or resumes an HTTP-only session and calls
   `/api/bootstrap`.
2. It opens `/api/events` with the session cookie and resumes the player's
   persisted ambient timer if this is their first active connection.
3. When the timer matures, the scheduler persists an encounter before publishing
   `encounter.available`.
4. The client alerts the player and displays the encounter until its server
   deadline.
5. Starting the minigame atomically changes the encounter from `available` to
   `started` and fixes the minigame deadline.
6. The client runs the seeded minigame locally and submits one terminal result.
7. The server validates ownership, current state, timestamps, plausible duration,
   and idempotency.
8. One transaction records the outcome, catch, experience, records, mastery, and
   next schedule.
9. The response and subsequent player event update the client.

The browser never polls for fish. The Go service pushes encounter events through
SSE; HTTP is used for state retrieval and player actions.

## Reliability and error handling

- All encounter deadlines use server timestamps. The bootstrap response includes
  server time so the client can display a corrected countdown.
- Encounter resolution is idempotent. Repeating a successful request returns the
  previously committed outcome rather than creating another catch.
- If SSE disconnects, the pond shows a quiet connection indicator, reconnects
  with bounded backoff, calls `/api/bootstrap`, and resynchronizes state. The
  final disconnect pauses only a still-waiting ambient schedule; available and
  started encounters retain their absolute deadlines.
- An active trip and its between-encounter wait also pause on the final stream
  disconnect. Starting a trip pauses the ambient schedule until the trip ends.
- Refreshing during an available encounter restores it without extending or
  rerolling it.
- Refreshing during a started minigame restores the server state but does not
  restart the local attempt; an unresolved attempt becomes an escape at its
  deadline.
- A result submitted after a network interruption receives a 15-second transport
  grace period only when the encounter was started before its deadline and the
  reported minigame completion occurred within that deadline.
- Database transactions prevent simultaneous tabs or duplicate requests from
  resolving one encounter twice.
- Backend restart recovery reads persisted scheduled, available, and started
  encounters rather than relying on process memory.
- Invalid authored content prevents startup instead of silently degrading a
  fish table or location.
- User-facing errors describe the recoverable action and never expose internal
  stack or database details.

## Security and fairness

- Sessions use 256-bit random tokens stored only as hashes server-side and
  delivered in `Secure`, `HttpOnly`, `SameSite=Lax` cookies.
- Mutating requests validate origin and content type.
- Guest creation, encounter start, and resolution endpoints are rate-limited.
- The server owns schedules, fish selection, size, deadlines, rewards, and
  terminal state.
- Result validation rejects nonexistent, expired, foreign, already-resolved, or
  impossibly fast attempts.
- Public leaderboards remain deferred and are treated as friendly competition;
  the first release does not justify invasive anti-cheat or device fingerprinting.

## Verification strategy

### Go tests

- Domain unit tests use an injected fake clock and deterministic random source.
- Table-driven tests cover schedule bounds, bait modifiers, rarity selection,
  encounter transitions, experience, mastery, and unlocks.
- PostgreSQL integration tests cover migrations, transactions, concurrent starts,
  duplicate resolution, multiple active streams, paused ambient schedules,
  session expiry, and restart recovery.
- Handler and OpenAPI tests verify status codes, payloads, event schemas, and
  generated-client compatibility.

### React tests

- Pure encounter-model tests cover tension, slack, pull impulses, progress,
  success, each escape condition, and deterministic seeds.
- Component tests cover mouse, spacebar, and touch equivalence; notifications;
  reduced motion; reconnect state; and error presentation.
- Field-guide and trip tests cover empty, loading, locked, active, completed, and
  failed states.

### Browser tests

End-to-end tests cover guest entry, the guided catch, ambient catch and escape,
trip completion, refresh and SSE reconnection, duplicate submission, and
collection/progression updates.

Responsive checks run at minimum at:

- 320×568 phone
- 768×1024 tablet
- 1280×720 desktop
- 1440×900 desktop
- 3440×1440 ultrawide

Visual assertions verify that every fishing animation's declared visible bounds
remain inside its stage without distortion or cropping.

## First playable scope

The vertical slice is complete when it includes:

- Willow Pond and 12 validated species with the approved rarity distribution.
- Guest creation and the guided first encounter.
- Persistent ambient encounter scheduling with 10–60 minute base cadence.
- Basic bait and at least two specialized bait choices.
- A default 15-minute fishing trip.
- The tension minigame with four fish behavior profiles.
- Individual catches, field-guide summaries, experience, personal records, and
  Willow Pond mastery.
- A locked preview of the next water.
- Responsive presentation using the approved optical-centering rules.
- Visual, sound, reduced-motion, and connection settings.
- The reliability, security, and automated verification described above.

## Acceptance criteria

1. A new visitor can create a guest implicitly and reach the pond without an
   account form.
2. The guided encounter appears within 30 seconds and teaches the tension
   mechanic through interaction rather than a long guide.
3. Catch and escape outcomes survive refresh and cannot be rerolled or duplicated.
4. Ambient encounters follow the configured schedule even across backend restart.
5. A 15-minute trip offers at least five encounters when the player resolves
   each encounter promptly, remains connected, and does not end the trip early;
   its chosen bait applies to every encounter.
6. Every catch updates the field guide, experience, records, and location mastery
   in one committed outcome.
7. The pond remains usable with mouse, keyboard, touch, muted audio, and reduced
   motion.
8. The complete visible fishing artwork remains centered, proportional, and
   uncropped at every required viewport.
9. A temporary SSE interruption recovers without reloading or losing valid
   encounter state.
10. Closing the final event stream pauses ambient waiting, while reopening Pond
    resumes the remaining wait without generating an offline fish or escape.
11. All Go, React, database, contract, and browser verification suites pass.

## Future direction

After the vertical slice proves the core loop, the next product work should add
new waters and richer location mastery before expanding social or economic
systems. Asynchronous friends, profiles, fish-specific leaderboards, personal
pond displays, and community discovery goals remain compatible with this design.
Live multiplayer or a game engine would require a separate product and technical
design rather than being inferred from this foundation.

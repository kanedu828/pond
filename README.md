# Pond

Pond is a cozy browser fishing companion that rewards patience with brief
moments of skill, discovery, and delight. It can sit quietly beside work,
study, or another game, then become a focused fishing experience whenever the
player wants a longer session.

The project is being redesigned from the ground up. The existing implementation
is reference material, not a compatibility constraint.

## The player promise

Leave Pond open and it will remain calm until something worth noticing happens.
A fish eventually appears, an unobtrusive alert invites the player back, and a
short tension-control challenge determines whether the fish is caught or
escapes.

Every catch grows a field guide, establishes personal records, and moves the
player toward unfamiliar waters. When the player wants more involvement, they
can use bait to begin a short fishing trip with several faster encounters.

## Product pillars

- **Calm until it matters.** Pond should be pleasant to leave open and should
  never demand constant interaction.
- **Catching requires attention.** Finding a fish is luck; landing it is skill.
- **Every catch tells a story.** Species, size, rarity, location, and records
  make individual catches memorable.
- **New waters drive progression.** Advancement reveals distinct environments,
  fish communities, and increasingly unusual discoveries.
- **No punishment loops.** Fish can escape, but Pond has no energy meters,
  daily-streak anxiety, or loss of earned progress.
- **Social without pressure.** Records, friends, and community discoveries can
  connect players without requiring them to be online together.

## The three rhythms of Pond

### Ambient companion

The player leaves Pond open while doing something else. A server-scheduled fish
appears every 10–60 minutes. If the player notices it before it leaves, they get
one chance to land it.

### Fishing trip

The player chooses an unlocked water and bait, then begins a short active
session with several faster encounters. Trips provide dependable progress while
ambient encounters retain a small discovery advantage.

### Long-term exploration

Catches fill a field guide, improve personal records, earn angler experience,
and complete location mastery goals. Progress unlocks new ponds, rivers, lakes,
coasts, and a small number of magical endgame waters.

## Catching a fish

The core minigame uses one input across mouse, keyboard, and touch:

- Hold to reel and increase line tension.
- Release to ease the line.
- Keep tension in the safe zone long enough to tire the fish.
- Too much tension snaps the line; prolonged slack lets the fish escape.

Fish share a readable set of behavior profiles, while species, size, rarity,
equipment, and location tune the difficulty. Better gear helps without making a
catch automatic.

## World and tone

Pond uses whimsical naturalism. Early waters and species feel recognizable and
grounded. Regional folklore, unusual variants, and rare magical discoveries
emerge gradually without overwhelming the quiet natural setting.

## First playable rebuild

The first release is a polished vertical slice featuring:

- Willow Pond and 12 fish.
- Guest entry and a guided first encounter.
- Ambient encounters and 15-minute fishing trips.
- The tension-control minigame.
- Basic and specialized bait.
- A field guide, angler experience, and personal records.
- A preview of the next locked water.
- Responsive mouse, keyboard, and touch interaction.
- Reused fishing animations that remain fully visible at every screen size.

Live multiplayer, native applications, deep equipment economies, monetization,
and migration of old accounts or data are deliberately outside this release.

## Technical direction

- **Client:** React and TypeScript
- **Game presentation:** DOM, CSS, and the existing GIF assets; no game engine
  unless future mechanics demonstrate a need
- **Server:** Go modular monolith
- **Persistence:** PostgreSQL
- **Realtime delivery:** server-sent events for notifications, with HTTP for
  commands and queries
- **API contract:** a checked-in OpenAPI contract that generates TypeScript
  types and client bindings and is verified against the Go service

The server owns encounter schedules, fish generation, outcomes, rewards, and
progression. Refreshing or reconnecting cannot reroll a fish or award a catch
twice.

## Product guardrails

Pond is not intended to become a conventional always-active fishing game, a
live multiplayer world, or an obligation-driven mobile idle game. New features
should strengthen at least one of its defining qualities: calm companionship,
brief skillful encounters, meaningful collection, or exploration.

## Design specification

The approved product and technical design is documented in
[`docs/superpowers/specs/2026-07-26-pond-rebuild-design.md`](docs/superpowers/specs/2026-07-26-pond-rebuild-design.md).

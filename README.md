# WELLS — walkerwells.com

WELLS is not an About Me page. It is an explorable personal world: part English estate, part capability archive, part travel map, part game, part cabinet of curiosities.

## Current build

The visual system was rebuilt from the ground up as a **cinematic 2.5D point-and-click experience**.

Instead of primitive browser geometry, scenes now use high-resolution real-world photography / architectural visualization as full-screen environment art, with:

- cinematic scene transitions
- cursor-driven parallax
- hotspots embedded into the environment
- weather / seasonal grading
- storm mode
- ambient procedural sound
- persistent collectibles
- persistent Bad Ideas Board statuses
- persistent Suit Up state
- interactive Capability Archive
- Map Room destinations
- garage night-drive interactions
- hidden Armory / Chart Room moments
- NYC December side quest
- Campfire clearing

### Living Estate

The estate now has a persistent world layer rather than behaving like a fixed collection of scenes:

- visitor-local time and daypart lighting
- date-seeded, season-aware estate weather
- arrival briefing with undisclosed location, date, season and conditions
- return-visit memory and remembered object states
- animated fire, window light, smoke, leaves, dust, snow, rain, fog and headlights
- physical scene reactions for the manor armor, study lamp, study drawer, fireplaces and garage
- a recurring raven that moves through the estate across visits
- subtle unscripted room events, including window and power flickers
- cinematic transition treatments between major spaces
- reduced-motion support for the added animation layer

The original scene art remains the visual foundation. The living layer is deliberately isolated in `living.js` and `living.css` so individual pieces can become more physical over time without rebuilding the entire site.

## Main spaces

- Estate
- Manor
- Study
- Dressing Room
- Garage
- Capability Archive
- Map Room
- Campfire
- New York / December

## Design law

Do not turn this into a résumé.

Do not explain Walker when the visitor can infer him from the world.

**The world is the biography.**

## State

Visitor state is intentionally stored locally for now:

- collection
- Bad Ideas statuses
- selected outfit
- season
- storm mode
- reduced-motion preference

A shared backend can be introduced later when there is a real reason for global state.

## Deployment

GitHub Pages deploys automatically from `main`.

Custom domain:

`walkerwells.com`


### Estate Systems v2

The second interactive systems layer deepens the estate without replacing the scene artwork:

- room-by-room physical dimmers with persistent full / low / off lighting states
- a visitor-local analog manor clock with real moving hands and hourly chime behavior
- a physical map table that retains the original map-room locations and projects them geographically
- custom saved map pins with descriptions, geocoding, manual placement fallback, drag repositioning, editing and removal
- an observatory reached through the estate telescope, with current lunar phase metadata and a date-seeded lunar anomaly mini-game
- a persistent visitor notebook grouped by date, logging rooms, discoveries, interactions, map changes, lunar results, outfit changes and Bad Ideas status changes
- manual visitor notes saved into the same dated notebook
- tangible controls throughout the new systems: draggable pins, a focus wheel, light dimmers, physical notebook, telescope and manor clock

Persistent Estate Systems data is stored locally in the browser under `wells.systems.v2`. The original map-room artwork and its existing hotspots remain intact.

### Navigation and accessibility

- Room URLs use fragments (for example `/#study`) and work with browser Back and Forward.
- `enhancements.js` owns cancellable room transitions. `estate:before-scene` cancels old room work; `estate:scene` synchronizes lighting, atmosphere, the journal, and navigation after a room renders.
- `estate-ui.js` manages dialog focus, Escape, hidden content, the phone room picker, and Estate Controls. Existing game overlays participate in the same lifecycle.
- Show Interactions toggles discovery labels; holding D provides a temporary reveal outside forms and games.
- Motion follows the operating system until a visitor explicitly changes it in Settings.
- `storage.js` keeps the estate usable if browser storage is unavailable. Visitor notes and progress remain local to the browser; blocked storage falls back to the current visit.

### Objects with a life of their own

- The manor sentinel offers three directional sword parries, reactive blade poses, sparks, sound, replay, and an optional unhurried mode. Completing the duel awards the forge mark and opens the armory.
- The old compass can be dragged, adjusted with a keyboard slider, or turned in 15-degree steps. Three bearings chart a route and award the compass.
- The campfire accepts dragged or tapped logs, grows warmer, releases embers, and remembers its warmth in the clearing.
- `encounter-rules.js` isolates deterministic progression; `encounters.js` owns interaction lifecycles and cancels animation and observers when closed. Progress uses `wells.encounters.v1` and participates in Reset Progress.

### Garage games

- Ferrari and Aston Martin road runs now have perspective scenery, bends, distinct handling, cruise/gas/brake controls, traffic, close-pass multipliers, three-contact tolerance, and a three-kilometre finish. Checkpoints add time.
- The dirt-bike trail separates throttle and airborne lean, with landing assistance when lean is released, jump signs, clean-landing and flip scores, and a finish line. Failed gaps end the run instead of allowing an endless fall.
- Both use the shared `garage-games.js` controller, `garage-games.css`, and deterministic `garage-physics.js`. They provide start instructions, pause/resume, immediate replay, held touch controls, keyboard controls, and automatic pause when the page loses focus. Audio and inputs are released on pause or exit.
- Best scores are stored per vehicle/trail under `wells.garage.v2`; the old scores are retained separately because the scoring systems differ. The previous `moto.js` is no longer loaded.

### Verification

Run `node --test tests/*.test.cjs` for storage and encounter regression checks and `node --check` on changed JavaScript files. Preview with `python3 -m http.server 4173 --bind 127.0.0.1`.

Browser smoke checks: enter the estate; rapidly switch rooms; use Back and Forward; reload a room link; open and close panels with Escape; cycle Tab in a panel; type D in the journal; use phone Rooms and Estate Controls; launch and exit both garage games.

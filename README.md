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

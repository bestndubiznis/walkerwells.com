# WELLS — walkerwells.com

WELLS is not an About Me page. It is an explorable personal world: part English estate, part capability archive, part map, part game, part cabinet of curiosities.

## Current world

### Estate
- Rainy manor grounds with clickable destinations
- Garage, Capability Archive, Map Room, Campfire clearing
- Persistent collectibles and lore fragments
- Hidden manual season control concealed in the moon
- Winter, spring, summer and autumn palettes
- Optional Storm Mode with lightning and heavier rain
- Procedural ambient sound

### Manor
- Study / Bad Ideas Board
- Dressing Room / Suit Up interaction
- North Wing / winter world
- South Wing / island world
- Old lift to New York
- Playable piano
- Hidden armor room
- Fireplace interaction and environmental lore

### Bad Ideas Board
Each idea can be clicked through:
- IDEA
- APPROVED
- ACTIVE
- DONE

Statuses persist in localStorage.

### Dressing Room
Persistent outfit selection:
- Dinner Jacket
- Race Suit
- Ski Kit
- Wetsuit
- Western
- Spider Suit

### Capability Archive
The original roadmap philosophy is expressed as physical relic drawers instead of presentation slides:
- Boss Fights
- Adventures
- Skill Unlocks
- Completed Santa Cruz 70.3 relic
- Ski backflip relic
- Locked future drawers

### Map Room
Pins for:
- New York
- California
- Alaska
- Hawaii
- St. Moritz
- BVI
- Thailand
- Mongolia

New York opens into a hidden Upper East Side Christmas penthouse with a Bond-style mission terminal. The ship's wheel opens a hidden pirate chart room.

### Garage
Hierarchy of machines:
- Ferrari / track
- Aston / night
- Range Rover / estate
- Dirt bike / desert
- Road bike
- Kart / race school

Cars open interactive night-drive scenes. The dirt bike opens a playable desert run.

### Hidden worlds
- Armory / knights / swords / blacksmithing
- Pirate chart room
- NYC Christmas penthouse
- Weather controls hidden in the moon
- Lore fragments scattered through the property

### Campfire
A deliberately non-competitive space with stars and small philosophical fragments.

## State

V3 intentionally uses localStorage for visitor-specific state:
- collection
- lore discovered
- bad-idea statuses
- current outfit
- selected season
- storm setting

Supabase will be added when the site needs shared/global state rather than merely because a database is available.

## Deploy

GitHub Pages deploys automatically from `main` via `.github/workflows/pages.yml`.

Custom domain:

`walkerwells.com`

The repository includes `CNAME`.

## Design law

Do not turn this into a résumé.

Do not explain Walker when the visitor can infer him from the world.

**The world is the biography.**

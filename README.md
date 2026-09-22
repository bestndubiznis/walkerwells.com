# WELLS — walkerwells.com

An explorable personal-world website: part English estate, part adventure map, part cabinet of curiosities, part tiny game collection.

## Current V1

The homepage is not an About Me page. It is a place.

Visitors enter a rainy estate and explore:

- **Manor** — fire, piano, Library, Vault, and the deliberately unhelpful “Who is Walker?” terminal
- **Library** — Field Notes, weather, routes, rituals, and oddities
- **Vault** — Boss Fight / Adventure / Skill Unlock
- **Garage** — track car, grand tourer, Range Rover, dirt bike, bike
- **Mountain** — interactive ski backflip
- **Water** — dive deeper toward a wreck and a hidden shark tooth
- **Grounds** — sporting clays, archery, golf, and stable
- **Hangar** — checklist switches and engine start
- **Observatory** — constellation puzzle
- **Collection** — 12 persistent artifacts saved in localStorage

## Run locally

No build step is required.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

This is intentionally static, so it can be deployed directly to:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

There is no framework and no backend requirement for V1.

## Domain

Connect both:

- `walkerwells.com`
- `www.walkerwells.com`

to the chosen hosting provider after deployment.

## Design principle

**Do not turn this into an About Me website.**

The world is the biography.

The aesthetic target is somewhere between an English country estate, James Bond, Ralph Lauren, expedition travel, winter in the Alps, California, old money materials, machines, maps, firelight, rain, and things that are fun for no defensible reason.

## Next build ideas

- more detailed art and richer transitions
- audio soundscape
- day/night and seasonal changes
- hidden passage behind the fireplace
- NYC-at-Christmas elevator
- dirt-bike microgame
- proper constellation lines
- global visitor discoveries
- admin panel for adding rooms and artifacts
- friend/family private unlocks
- Supabase-backed global state where it actually adds value

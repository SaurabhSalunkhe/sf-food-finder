# BiteMap SF

A mobile-friendly discovery app for free food, closing-time restaurant drops, and limited-time food deals across San Francisco.

## What works now

- Search by restaurant, dish, or neighborhood
- Filter free food, deals, and tonight-only drops
- Browse matching pins in a map-style neighborhood view
- Save interesting listings during the session
- Submit a community tip into the current session
- Read listings from an optional external JSON feed
- Automated production build on every push and pull request

The included listings are clearly labeled demo data. They are fictional and must not be treated as current restaurant offers.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Connect a live feed

Copy `.env.example` to `.env.local` and set `FOOD_DEALS_FEED_URL` to an HTTPS endpoint. The endpoint can return an array or `{ "deals": [...] }` with these fields:

```json
{
  "restaurant": "Restaurant name",
  "title": "Offer description",
  "neighborhood": "Mission",
  "distance": "0.4 mi",
  "expires": "Today at 7 PM",
  "kind": "Free",
  "source": "Restaurant newsletter",
  "x": 42,
  "y": 58
}
```

The API normalizes incoming values, limits the feed to 100 records, times out after five seconds, and falls back to demo data if the feed is unavailable.

## Responsible ingestion roadmap

Use official APIs, opt-in restaurant feeds, newsletters with permission, public event feeds, and community submissions. Respect site terms and rate limits; do not scrape login-gated or prohibited sources. A production version should add durable storage, moderation, expiration cleanup, source links, address geocoding, and venue verification.

## Stack

Next.js-compatible Vinext, React, TypeScript, Tailwind CSS, and Cloudflare Sites.

import { DEMO_DEALS, normalizeFeedItems } from '../../../lib/deals';

export async function GET() {
  const feedUrl = process.env.FOOD_DEALS_FEED_URL;
  if (!feedUrl) return Response.json({ deals: DEMO_DEALS, mode: 'demo' });

  try {
    const response = await fetch(feedUrl, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Feed returned ${response.status}`);
    const payload = await response.json() as { deals?: unknown } | unknown[];
    const normalized = normalizeFeedItems(Array.isArray(payload) ? payload : payload.deals);
    return Response.json({ deals: normalized.length ? normalized : DEMO_DEALS, mode: normalized.length ? 'live' : 'demo' });
  } catch {
    return Response.json({ deals: DEMO_DEALS, mode: 'demo', warning: 'Live feed unavailable' });
  }
}

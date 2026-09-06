export type Deal = {
  id: number;
  restaurant: string;
  title: string;
  neighborhood: string;
  distance: string;
  expires: string;
  kind: 'Free' | 'Deal';
  color: 'lime' | 'peach' | 'blue';
  source: string;
  x: number;
  y: number;
};

export const DEMO_DEALS: Deal[] = [
  { id: 1, restaurant: 'Mission Picnic', title: 'Free focaccia with any soup', neighborhood: 'Mission', distance: '0.4 mi', expires: 'Today · 6:30 PM', kind: 'Free', color: 'lime', source: 'Demo listing', x: 42, y: 58 },
  { id: 2, restaurant: 'Sunset Dumpling House', title: 'Closing-time dumplings · 50% off', neighborhood: 'Inner Sunset', distance: '2.1 mi', expires: 'Tonight · 8:45 PM', kind: 'Deal', color: 'peach', source: 'Demo listing', x: 23, y: 38 },
  { id: 3, restaurant: 'Bay Bakes', title: 'Surprise pastry bag for $5', neighborhood: 'SoMa', distance: '1.2 mi', expires: 'Today · 5–7 PM', kind: 'Deal', color: 'blue', source: 'Demo listing', x: 66, y: 46 },
  { id: 4, restaurant: 'North Beach Pantry', title: 'Free community fridge restock', neighborhood: 'North Beach', distance: '1.8 mi', expires: 'Just posted', kind: 'Free', color: 'lime', source: 'Demo listing', x: 62, y: 21 },
];

const cleanText = (value: unknown, fallback: string) => typeof value === 'string' && value.trim() ? value.trim().slice(0, 160) : fallback;

export function normalizeFeedItems(value: unknown): Deal[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).map((item, index) => {
    const candidate = item && typeof item === 'object' ? item as Record<string, unknown> : {};
    const rawKind = cleanText(candidate.kind, 'Deal');
    return {
      id: 1000 + index,
      restaurant: cleanText(candidate.restaurant, 'SF food spot'),
      title: cleanText(candidate.title, 'New food deal'),
      neighborhood: cleanText(candidate.neighborhood, 'San Francisco'),
      distance: cleanText(candidate.distance, 'Nearby'),
      expires: cleanText(candidate.expires, 'Check availability'),
      kind: rawKind.toLowerCase() === 'free' ? 'Free' : 'Deal',
      color: index % 3 === 0 ? 'lime' : index % 3 === 1 ? 'peach' : 'blue',
      source: cleanText(candidate.source, 'Partner feed'),
      x: typeof candidate.x === 'number' ? Math.min(80, Math.max(15, candidate.x)) : 25 + (index * 13) % 50,
      y: typeof candidate.y === 'number' ? Math.min(80, Math.max(15, candidate.y)) : 20 + (index * 17) % 55,
    };
  });
}

'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Deal, DEMO_DEALS } from '../lib/deals';

const filters = ['All', 'Free', 'Deals', 'Tonight'];

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>(DEMO_DEALS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [saved, setSaved] = useState<number[]>([]);
  const [selected, setSelected] = useState<number>(DEMO_DEALS[0].id);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetch('/api/deals').then((response) => response.json()).then((payload: { deals?: Deal[] }) => {
      if (payload.deals?.length) setDeals(payload.deals);
    }).catch(() => undefined);
  }, []);

  function toggleSaved(id: number) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function submitDeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const added: Deal = {
      id: Date.now(),
      restaurant: String(form.get('restaurant') || 'Community tip'),
      title: String(form.get('title') || 'New food drop'),
      neighborhood: String(form.get('neighborhood') || 'San Francisco'),
      kind: form.get('kind') === 'Free' ? 'Free' : 'Deal',
      distance: 'New', expires: 'Check availability', color: 'lime', source: 'Community submission', x: 47, y: 50,
    };
    setDeals((current) => [added, ...current]);
    setSelected(added.id);
    setFormOpen(false);
    event.currentTarget.reset();
  }

  const visibleDeals = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return deals.filter((deal) => {
      const matchesQuery = !needle || `${deal.restaurant} ${deal.title} ${deal.neighborhood}`.toLowerCase().includes(needle);
      const matchesFilter = filter === 'All' || (filter === 'Free' && deal.kind === 'Free') || (filter === 'Deals' && deal.kind === 'Deal') || (filter === 'Tonight' && deal.expires.toLowerCase().includes('tonight'));
      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="BiteMap SF home"><span className="brand-mark">B</span><span>BiteMap <em>SF</em></span></a>
        <nav aria-label="Main navigation"><a href="#deals">Explore</a><a href="#how">How it works</a></nav>
        <button className="outline-button" type="button" onClick={() => setFormOpen(true)}>+ Share a deal</button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span /> Live across San Francisco</div>
        <h1>Good food.<br /><strong>Better timing.</strong></h1>
        <p>Find free bites, last-minute restaurant drops, and neighborhood food deals before they disappear.</p>
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a neighborhood, dish, or restaurant" aria-label="Search food deals" /><kbd>⌘ K</kbd></label>
        <p className="trust-note">Community-powered · Updated throughout the day</p>
      </section>

      <section className="deal-section" id="deals">
        <div className="section-heading">
          <div><p className="kicker">Happening now</p><h2>Nearby drops</h2></div>
          <div className="filters" aria-label="Filter deals">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''} type="button">{item}</button>)}</div>
        </div>

        <div className="explorer">
          <div className="deal-list">
            <div className="results-row"><span>{visibleDeals.length} finds</span><button type="button">Soonest first ↓</button></div>
            {visibleDeals.length ? visibleDeals.map((deal) => (
              <article className={`deal-card ${selected === deal.id ? 'selected' : ''}`} key={deal.id} onClick={() => setSelected(deal.id)}>
                <div className={`food-tile ${deal.color}`} aria-hidden="true"><span>{deal.kind === 'Free' ? '✦' : '½'}</span></div>
                <div className="deal-copy">
                  <div className="card-topline"><span className={`pill ${deal.kind.toLowerCase()}`}>{deal.kind}</span><span>{deal.distance}</span></div>
                  <h3>{deal.title}</h3><p>{deal.restaurant} · {deal.neighborhood}</p><div className="expiry"><span /> {deal.expires}<b>{deal.source}</b></div>
                </div>
                <button className={`save-button ${saved.includes(deal.id) ? 'saved' : ''}`} onClick={(event) => { event.stopPropagation(); toggleSaved(deal.id); }} aria-label={`Save ${deal.title}`} type="button">{saved.includes(deal.id) ? '♥' : '♡'}</button>
              </article>
            )) : <div className="empty-state"><span>⌕</span><h3>No bites found</h3><p>Try another neighborhood or reset your filters.</p></div>}
          </div>

          <aside className="map" aria-label="Map preview of San Francisco deals">
            <div className="map-label">SAN FRANCISCO</div><div className="road road-one" /><div className="road road-two" /><div className="road road-three" /><div className="water-label">BAY</div>
            {visibleDeals.map((deal, index) => <button onClick={() => setSelected(deal.id)} className={`map-pin ${deal.kind.toLowerCase()} ${selected === deal.id ? 'selected' : ''}`} style={{ left: `${deal.x}%`, top: `${deal.y}%` }} key={deal.id} aria-label={`${deal.title} on map`} type="button"><span>{index + 1}</span></button>)}
            <div className="map-key"><span><i className="free-dot" /> Free</span><span><i className="deal-dot" /> Deal</span></div>
          </aside>
        </div>
      </section>

      <section className="how-strip" id="how"><p>Built for good food, not food waste.</p><span>Listings are community-submitted demo data. Always confirm with the venue before heading out.</span></section>

      {formOpen && <div className="modal-backdrop" onMouseDown={() => setFormOpen(false)}>
        <section className="deal-modal" role="dialog" aria-modal="true" aria-labelledby="share-title" onMouseDown={(event) => event.stopPropagation()}>
          <button className="modal-close" type="button" aria-label="Close" onClick={() => setFormOpen(false)}>×</button>
          <p className="kicker">Community tip</p><h2 id="share-title">Share a food find</h2><p>Know about a free bite or restaurant drop? Add it to this session.</p>
          <form onSubmit={submitDeal}>
            <label>Offer<input name="title" required placeholder="e.g. Free pastries after 6 PM" /></label>
            <label>Restaurant or source<input name="restaurant" required placeholder="Business name" /></label>
            <label>Neighborhood<input name="neighborhood" required placeholder="Mission, SoMa…" /></label>
            <label>Type<select name="kind"><option>Free</option><option>Deal</option></select></label>
            <button className="submit-button" type="submit">Add this find</button>
          </form>
        </section>
      </div>}
    </main>
  );
}

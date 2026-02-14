import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { marketApi } from './services/api'
import type { Market } from './types/market'

const categories = ['All', 'Crypto', 'AI', 'Politics', 'Sports']

function App() {
  const [markets, setMarkets] = useState<Market[]>([])
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    marketApi.listMarkets({ category, query }).then(setMarkets)
  }, [category, query])

  const totalVolume = useMemo(
    () => markets.reduce((sum, m) => sum + m.volumeUsd, 0),
    [markets],
  )

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">AI Predict</div>
        <nav>
          <a>Markets</a>
          <a>Portfolio</a>
          <a>Leaderboard</a>
        </nav>
        <button className="connect">Connect Wallet</button>
      </header>

      <section className="hero">
        <h1>Prediction Markets, Real-Time Sentiment</h1>
        <p>Polymarket-inspired UI with backend-ready architecture.</p>
        <div className="stats">
          <div>
            <span>Total Markets</span>
            <strong>{markets.length}</strong>
          </div>
          <div>
            <span>Total Volume</span>
            <strong>${totalVolume.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      <section className="filters">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search markets..."
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </section>

      <main className="grid">
        {markets.map((m) => (
          <article key={m.id} className="card">
            <div className="chip">{m.category}</div>
            <h3>{m.title}</h3>
            <p>Ends: {m.endDate}</p>
            <p>
              Vol ${m.volumeUsd.toLocaleString()} · Liq ${m.liquidityUsd.toLocaleString()}
            </p>
            <div className="outcomes">
              {m.outcomes.map((o) => (
                <button key={o.id}>
                  {o.name} <strong>{o.probability}%</strong>
                </button>
              ))}
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}

export default App

import { useEffect, useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './App.css'
import { marketApi } from './services/api'
import type { Market } from './types/market'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { AdminLayout } from './layouts/AdminLayout'
import { EventsPage } from './pages/admin/Events'
import { OddsPage } from './pages/admin/Odds'
import { SettlementPage } from './pages/admin/Settlement'
import { TokenFiatPage } from './pages/admin/TokenFiat'
import { AdminLoginPage } from './pages/admin/Login'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'

const categoryKeys = ['all', 'crypto', 'ai', 'politics', 'sports'] as const

function MarketsPage() {
  const { t } = useTranslation()
  const [markets, setMarkets] = useState<Market[]>([])
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [backendStatus, setBackendStatus] = useState<'ok' | 'unreachable' | null>(null)
  const [hotspots, setHotspots] = useState<{ english: { title: string; url: string }[]; chinese: { title: string; url: string }[] } | null>(null)
  const [hotspotError, setHotspotError] = useState<string | null>(null)
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL
    if (apiUrl) {
      fetch(`${apiUrl}/health`)
        .then((res) => {
          setBackendStatus(res.ok ? 'ok' : 'unreachable')
        })
        .catch(() => {
          setBackendStatus('unreachable')
        })

      fetch(`${apiUrl}/hotspots/daily`)
        .then((res) => {
          if (!res.ok) throw new Error('failed')
          return res.json()
        })
        .then((data) => {
          setHotspots({ english: data.english || [], chinese: data.chinese || [] })
          setHotspotError(null)
        })
        .catch(() => {
          setHotspotError('unavailable')
        })
    }
  }, [])

  useEffect(() => {
    marketApi.listMarkets({ category, query }).then(setMarkets)
  }, [category, query])

  const totalVolume = useMemo(
    () => markets.reduce((sum, m) => sum + m.volumeUsd, 0),
    [markets],
  )

  const trendPoints = [42, 48, 45, 56, 63, 58, 66, 72]

  return (
    <div className="app">
      <header className="topbar">
        {backendStatus && (
          <div className={`backend-status ${backendStatus === 'unreachable' ? 'unreachable' : ''}`}>
            Backend: {backendStatus === 'ok' ? 'OK' : 'unreachable'}
          </div>
        )}
        <div className="brand">AI Predict</div>
        <nav>
          <a>{t('nav.markets')}</a>
          <a>{t('nav.portfolio')}</a>
          <a>{t('nav.leaderboard')}</a>
        </nav>
        <div className="topbar-right">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <div className="user-indicator">
              <span className="user-email">{user?.email}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="connect">{t('nav.connectWallet')}</button>
          )}
        </div>
      </header>

      <section className="hero">
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <div className="stats">
          <div>
            <span>{t('stats.totalMarkets')}</span>
            <strong>{markets.length}</strong>
          </div>
          <div>
            <span>{t('stats.totalVolume')}</span>
            <strong>${totalVolume.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      <section className="overview-panels">
        <div className="trend-panel">
          <div className="panel-header">
            <h2>Market Trend</h2>
            <span>24h</span>
          </div>
          <div className="trend-chart">
            {trendPoints.map((p, idx) => (
              <div key={idx} className="trend-bar-wrap">
                <div className="trend-bar" style={{ height: `${p}%` }} />
              </div>
            ))}
          </div>
        </div>

        <div className="news-panel">
          <div className="panel-header">
            <h2>News</h2>
            <span>Latest</span>
          </div>
          <ul>
            {(hotspots?.english || []).slice(0, 3).map((item, idx) => (
              <li key={`news-${idx}`}>
                <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
              </li>
            ))}
            {!hotspots && <li>Loading news...</li>}
          </ul>
        </div>
      </section>

      <section className="hotspots">
        <div className="hotspots-header">
          <h2>{t('hotspots.title')}</h2>
          <span>{t('hotspots.dailyUpdate')}</span>
        </div>
        {hotspotError && <p className="hotspots-error">{t('hotspots.unavailable')}</p>}
        {!hotspotError && !hotspots && <p className="hotspots-loading">{t('hotspots.loading')}</p>}
        {hotspots && (
          <div className="hotspots-grid">
            <div className="hotspot-col">
              <h3>{t('hotspots.english')}</h3>
              <ol>
                {hotspots.english.slice(0, 3).map((item, idx) => (
                  <li key={`en-${idx}`}>
                    <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="hotspot-col">
              <h3>{t('hotspots.chinese')}</h3>
              <ol>
                {hotspots.chinese.slice(0, 3).map((item, idx) => (
                  <li key={`zh-${idx}`}>
                    <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </section>

      <section className="filters">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('filters.search')}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categoryKeys.map((c) => (
            <option key={c} value={c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}>
              {t(`categories.${c}`)}
            </option>
          ))}
        </select>
      </section>

      <main className="grid">
        {markets.map((m) => (
          <article key={m.id} className="card">
            <div className="chip">{m.category}</div>
            <h3>{m.title}</h3>
            <p>{t('market.ends')}: {m.endDate}</p>
            <p>
              {t('market.volume')} ${m.volumeUsd.toLocaleString()} · {t('market.liquidity')} ${m.liquidityUsd.toLocaleString()}
            </p>
            <div className="outcomes">
              {m.outcomes.map((o, idx) => {
                const isUp = /yes|up|long|buy/i.test(o.name) || idx === 0
                return (
                  <button key={o.id} className={isUp ? 'btn-up' : 'btn-down'}>
                    {o.name} <strong>{o.probability}%</strong>
                  </button>
                )
              })}
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MarketsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="events" element={<EventsPage />} />
          <Route path="odds" element={<OddsPage />} />
          <Route path="settlement" element={<SettlementPage />} />
          <Route path="tokens" element={<TokenFiatPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

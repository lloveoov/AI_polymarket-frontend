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
  const [backendStatus, setBackendStatus] = useState<'ok' | 'unreachable' | null>(null);
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiUrl) {
      fetch(`${apiUrl}/health`)
        .then((res) => {
          setBackendStatus(res.ok ? 'ok' : 'unreachable');
        })
        .catch(() => {
          setBackendStatus('unreachable');
        });
    }
  }, []);

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

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import { marketApi } from './services/api';
import type { Market } from './types/market';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const categoryKeys = ['all', 'crypto', 'ai', 'politics', 'sports'] as const;

function App() {
  const { t } = useTranslation();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    marketApi.listMarkets({ category, query }).then(setMarkets);
  }, [category, query]);

  const totalVolume = useMemo(
    () => markets.reduce((sum, m) => sum + m.volumeUsd, 0),
    [markets],
  );

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">AI Predict</div>
        <nav>
          <a>{t('nav.markets')}</a>
          <a>{t('nav.portfolio')}</a>
          <a>{t('nav.leaderboard')}</a>
        </nav>
        <div className="topbar-right">
          <LanguageSwitcher />
          <button className="connect">{t('nav.connectWallet')}</button>
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
  );
}

export default App;

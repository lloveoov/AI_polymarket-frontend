import { useState } from 'react'

export type SettlementStage = 'llm-vote' | 'objection' | 'confirm'

export interface MarketToSettle {
  id: string
  title: string
  category: string
  endDate: string
  llmVote: {
    outcome: string
    confidence: number
    reasoning: string
  }
  objections: Objection[]
  status: 'pending' | 'ready' | 'settled'
}

export interface Objection {
  id: string
  user: string
  reason: string
  timestamp: string
}

const mockMarkets: MarketToSettle[] = [
  {
    id: '1',
    title: 'Will Bitcoin reach $100k by end of 2025?',
    category: 'Crypto',
    endDate: '2025-12-31',
    llmVote: {
      outcome: 'Yes',
      confidence: 78,
      reasoning: 'Based on current ETF inflows, institutional adoption trends, and historical cycle analysis.',
    },
    objections: [
      { id: 'o1', user: '0x1234...abcd', reason: 'Market conditions have changed significantly', timestamp: '2025-02-10T14:30:00Z' },
    ],
    status: 'ready',
  },
  {
    id: '2',
    title: 'Will AI pass Turing test by June 2025?',
    category: 'AI',
    endDate: '2025-06-30',
    llmVote: {
      outcome: 'No',
      confidence: 65,
      reasoning: 'Current benchmarks suggest insufficient progress for full Turing test passage.',
    },
    objections: [],
    status: 'pending',
  },
  {
    id: '3',
    title: 'Super Bowl 2026 Winner',
    category: 'Sports',
    endDate: '2026-02-08',
    llmVote: {
      outcome: 'Chiefs',
      confidence: 82,
      reasoning: 'Based on team performance metrics, roster strength, and historical patterns.',
    },
    objections: [],
    status: 'pending',
  },
]

export function SettlementPage() {
  const [markets, setMarkets] = useState<MarketToSettle[]>(mockMarkets)
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null)
  const [stage, setStage] = useState<SettlementStage>('llm-vote')
  const [countdown, setCountdown] = useState(3600)

  const selectedMarket = markets.find((m) => m.id === selectedMarketId)

  const pendingMarkets = markets.filter((m) => m.status === 'pending')
  const readyMarkets = markets.filter((m) => m.status === 'ready')

  const advanceStage = () => {
    if (stage === 'llm-vote') {
      setStage('objection')
      setCountdown(3600)
    } else if (stage === 'objection') {
      setStage('confirm')
    }
  }

  const resetToLLMVote = () => {
    setStage('llm-vote')
    setSelectedMarketId(null)
  }

  const confirmSettlement = () => {
    if (selectedMarketId) {
      setMarkets(markets.map((m) => (m.id === selectedMarketId ? { ...m, status: 'settled' as const } : m)))
      resetToLLMVote()
    }
  }

  const canProceed = selectedMarket && selectedMarket.status === 'ready'
  const canConfirm = selectedMarket && selectedMarket.status === 'ready' && stage === 'confirm'

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Settlement & Risk</h1>
          <p>Manage market settlements, LLM voting, and objection processing.</p>
        </div>
      </div>

      <div className="settlement-stages">
        <div className={`stage-indicator ${stage === 'llm-vote' ? 'active' : 'completed'}`}>
          <span className="stage-number">1</span>
          <span className="stage-label">LLM Vote</span>
        </div>
        <div className="stage-line" />
        <div className={`stage-indicator ${stage === 'objection' ? 'active' : stage === 'confirm' ? 'completed' : ''}`}>
          <span className="stage-number">2</span>
          <span className="stage-label">Objection Window</span>
        </div>
        <div className="stage-line" />
        <div className={`stage-indicator ${stage === 'confirm' ? 'active' : ''}`}>
          <span className="stage-number">3</span>
          <span className="stage-label">Admin Confirm</span>
        </div>
      </div>

      {stage === 'llm-vote' && (
        <div className="settlement-content">
          <div className="markets-section">
            <h2>Markets Needing Settlement</h2>
            <div className="markets-grid">
              {pendingMarkets.length === 0 && readyMarkets.length === 0 ? (
                <div className="empty-state">No markets pending settlement.</div>
              ) : (
                [...readyMarkets, ...pendingMarkets].map((market) => (
                  <div
                    key={market.id}
                    className={`market-card ${selectedMarketId === market.id ? 'selected' : ''} ${market.status === 'ready' ? 'ready' : ''}`}
                    onClick={() => setSelectedMarketId(market.id)}
                  >
                    <div className="market-card-header">
                      <span className="chip">{market.category}</span>
                      <span className={`status-badge status-${market.status === 'ready' ? 'ready' : 'pending'}`}>
                        {market.status === 'ready' ? 'Ready' : 'Pending'}
                      </span>
                    </div>
                    <h3>{market.title}</h3>
                    <p className="market-date">End: {market.endDate}</p>
                    <div className="llm-vote-preview">
                      <span className="vote-label">LLM Vote:</span>
                      <span className="vote-outcome">{market.llmVote.outcome}</span>
                      <span className="vote-confidence">{market.llmVote.confidence}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedMarket && (
            <div className="vote-details-panel">
              <h2>LLM Vote Details</h2>
              <div className="vote-details">
                <div className="detail-row">
                  <span className="detail-label">Market</span>
                  <span className="detail-value">{selectedMarket.title}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Outcome</span>
                  <span className="detail-value outcome-highlight">{selectedMarket.llmVote.outcome}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Confidence</span>
                  <span className="detail-value">
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: `${selectedMarket.llmVote.confidence}%` }} />
                    </div>
                    <span>{selectedMarket.llmVote.confidence}%</span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Reasoning</span>
                  <span className="detail-value reasoning">{selectedMarket.llmVote.reasoning}</span>
                </div>
              </div>
              <div className="panel-actions">
                <button className="btn-primary" disabled={!canProceed} onClick={advanceStage}>
                  Proceed to Objection Window
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {stage === 'objection' && selectedMarket && (
        <div className="settlement-content">
          <div className="objection-section">
            <div className="objection-header">
              <h2>Objection Window</h2>
              <div className="countdown-placeholder">
                <span className="countdown-label">Time Remaining</span>
                <span className="countdown-timer">{formatCountdown(countdown)}</span>
              </div>
            </div>

            <div className="objection-market-info">
              <span className="chip">{selectedMarket.category}</span>
              <span className="market-title">{selectedMarket.title}</span>
              <span className="llm-result">LLM: {selectedMarket.llmVote.outcome} ({selectedMarket.llmVote.confidence}%)</span>
            </div>

            <div className="objections-list">
              <h3>Objections ({selectedMarket.objections.length})</h3>
              {selectedMarket.objections.length === 0 ? (
                <div className="no-objections">No objections raised.</div>
              ) : (
                <div className="objection-cards">
                  {selectedMarket.objections.map((obj) => (
                    <div key={obj.id} className="objection-card">
                      <div className="objection-header-row">
                        <span className="objection-user">{obj.user}</span>
                        <span className="objection-time">{new Date(obj.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="objection-reason">{obj.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="panel-actions">
              <button className="btn-secondary" onClick={resetToLLMVote}>
                Back
              </button>
              <button className="btn-primary" onClick={advanceStage}>
                Proceed to Confirmation
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'confirm' && selectedMarket && (
        <div className="settlement-content">
          <div className="confirm-section">
            <h2>Confirm Settlement</h2>

            <div className="confirm-summary">
              <div className="summary-card">
                <h3>Market</h3>
                <p>{selectedMarket.title}</p>
                <span className="chip">{selectedMarket.category}</span>
              </div>

              <div className="summary-card">
                <h3>Settlement Decision</h3>
                <div className="settlement-outcome">
                  <span className="outcome-label">Outcome:</span>
                  <span className="outcome-value">{selectedMarket.llmVote.outcome}</span>
                </div>
                <div className="confidence-display">
                  Confidence: {selectedMarket.llmVote.confidence}%
                </div>
              </div>

              <div className="summary-card">
                <h3>Objections</h3>
                <p>{selectedMarket.objections.length} objection(s) received</p>
                {selectedMarket.objections.length > 0 && (
                  <p className="objection-note">Objections reviewed and considered.</p>
                )}
              </div>
            </div>

            <div className="confirm-warning">
              <span className="warning-icon">⚠️</span>
              <span>This action will permanently settle the market with the selected outcome. This cannot be undone.</span>
            </div>

            <div className="panel-actions">
              <button className="btn-secondary" onClick={() => setStage('objection')}>
                Back
              </button>
              <button className="btn-confirm" disabled={!canConfirm} onClick={confirmSettlement}>
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

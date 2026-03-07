import type { ApiAdapter, ApiRequest, ApiResponse } from './types'
import type { Market, MarketFilters } from '../../types/market'

const mockMarkets: Market[] = [
  { id: 'm1', title: 'Will BTC close above $120k by June 30, 2026?', category: 'Crypto', endDate: '2026-06-30', volumeUsd: 1250000, liquidityUsd: 480000, outcomes: [{ id: 'yes', name: 'Yes', probability: 62 }, { id: 'no', name: 'No', probability: 38 }] },
  { id: 'm2', title: 'Will OpenAI release GPT-6 in 2026?', category: 'AI', endDate: '2026-12-31', volumeUsd: 830000, liquidityUsd: 320000, outcomes: [{ id: 'yes', name: 'Yes', probability: 41 }, { id: 'no', name: 'No', probability: 59 }] },
  { id: 'm3', title: 'Will Trump win the 2028 U.S. election?', category: 'Politics', endDate: '2028-11-07', volumeUsd: 2100000, liquidityUsd: 870000, outcomes: [{ id: 'yes', name: 'Yes', probability: 47 }, { id: 'no', name: 'No', probability: 53 }] },
  { id: 'm4', title: 'Will the UK cut interest rates before Q4 2026?', category: 'Politics', endDate: '2026-09-30', volumeUsd: 740000, liquidityUsd: 280000, outcomes: [{ id: 'yes', name: 'Yes', probability: 58 }, { id: 'no', name: 'No', probability: 42 }] },
  { id: 'm5', title: 'Will Manchester City win the 2026/27 EPL?', category: 'Sports', endDate: '2027-05-25', volumeUsd: 990000, liquidityUsd: 410000, outcomes: [{ id: 'yes', name: 'Yes', probability: 36 }, { id: 'no', name: 'No', probability: 64 }] },
  { id: 'm6', title: 'Will Real Madrid win UCL 2026?', category: 'Sports', endDate: '2026-06-06', volumeUsd: 1210000, liquidityUsd: 560000, outcomes: [{ id: 'yes', name: 'Yes', probability: 44 }, { id: 'no', name: 'No', probability: 56 }] },
  { id: 'm7', title: 'Will NVIDIA market cap exceed $5T in 2026?', category: 'Crypto', endDate: '2026-12-31', volumeUsd: 680000, liquidityUsd: 220000, outcomes: [{ id: 'yes', name: 'Yes', probability: 49 }, { id: 'no', name: 'No', probability: 51 }] },
  { id: 'm8', title: 'Will an open-source model beat GPT-5 benchmark by 2026?', category: 'AI', endDate: '2026-10-31', volumeUsd: 560000, liquidityUsd: 190000, outcomes: [{ id: 'yes', name: 'Yes', probability: 54 }, { id: 'no', name: 'No', probability: 46 }] },
  { id: 'm9', title: 'Will ETH ETF AUM exceed $200B by 2027?', category: 'Crypto', endDate: '2027-12-31', volumeUsd: 870000, liquidityUsd: 350000, outcomes: [{ id: 'yes', name: 'Yes', probability: 43 }, { id: 'no', name: 'No', probability: 57 }] },
  { id: 'm10', title: 'Will SpaceX Mars mission launch before 2028?', category: 'AI', endDate: '2027-12-31', volumeUsd: 450000, liquidityUsd: 160000, outcomes: [{ id: 'yes', name: 'Yes', probability: 28 }, { id: 'no', name: 'No', probability: 72 }] },
  { id: 'm11', title: 'Will BTC dominance stay above 55% in Q3 2026?', category: 'Crypto', endDate: '2026-09-30', volumeUsd: 530000, liquidityUsd: 180000, outcomes: [{ id: 'yes', name: 'Yes', probability: 52 }, { id: 'no', name: 'No', probability: 48 }] },
  { id: 'm12', title: 'Will France win Euro 2028?', category: 'Sports', endDate: '2028-07-15', volumeUsd: 620000, liquidityUsd: 240000, outcomes: [{ id: 'yes', name: 'Yes', probability: 22 }, { id: 'no', name: 'No', probability: 78 }] },
]

export class MockAdapter implements ApiAdapter {
  async request<R>(_req: ApiRequest): Promise<ApiResponse<R>> {
    return { data: null as R, error: 'MockAdapter: use specific method' }
  }

  async listMarkets(filters?: MarketFilters): Promise<Market[]> {
    let rows = [...mockMarkets]

    if (filters?.category && filters.category !== 'All') {
      rows = rows.filter((m) => m.category === filters.category)
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase()
      rows = rows.filter((m) => m.title.toLowerCase().includes(q))
    }

    if (filters?.expiresInDays && filters.expiresInDays > 0) {
      const now = new Date()
      const max = new Date(now)
      max.setDate(max.getDate() + filters.expiresInDays)
      rows = rows.filter((m) => {
        const d = new Date(`${m.endDate}T23:59:59Z`)
        return d >= now && d <= max
      })
    }

    if (filters?.sortBy === 'endDate') {
      rows.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
    } else if (filters?.sortBy === 'probability') {
      rows.sort((a, b) => (b.outcomes[0]?.probability || 0) - (a.outcomes[0]?.probability || 0))
    } else {
      rows.sort((a, b) => b.volumeUsd - a.volumeUsd)
    }

    return Promise.resolve(rows)
  }
}

import type { ApiAdapter, ApiRequest, ApiResponse } from './types'
import type { Market, MarketFilters } from '../../types/market'

const mockMarkets: Market[] = [
  {
    id: 'm1',
    title: 'Will BTC close above $120k by June 30, 2026?',
    category: 'Crypto',
    endDate: '2026-06-30',
    volumeUsd: 1250000,
    liquidityUsd: 480000,
    outcomes: [
      { id: 'yes', name: 'Yes', probability: 62 },
      { id: 'no', name: 'No', probability: 38 },
    ],
  },
  {
    id: 'm2',
    title: 'Will OpenAI release GPT-6 in 2026?',
    category: 'AI',
    endDate: '2026-12-31',
    volumeUsd: 830000,
    liquidityUsd: 320000,
    outcomes: [
      { id: 'yes', name: 'Yes', probability: 41 },
      { id: 'no', name: 'No', probability: 59 },
    ],
  },
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
    return Promise.resolve(rows)
  }
}

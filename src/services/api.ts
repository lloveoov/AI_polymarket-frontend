import type { Market, MarketFilters } from '../types/market'
import { MockAdapter } from './adapters/MockAdapter'

export interface MarketApi {
  listMarkets(filters?: MarketFilters): Promise<Market[]>
}

const mockAdapter = new MockAdapter()

export const marketApi: MarketApi = {
  async listMarkets(filters?: MarketFilters): Promise<Market[]> {
    return mockAdapter.listMarkets(filters)
  },
}

export { API_BASE_URL } from './adapters'

export type Outcome = {
  id: string
  name: string
  probability: number
}

export type Market = {
  id: string
  title: string
  category: string
  endDate: string
  volumeUsd: number
  liquidityUsd: number
  outcomes: Outcome[]
}

export type MarketFilters = {
  category?: string
  query?: string
}

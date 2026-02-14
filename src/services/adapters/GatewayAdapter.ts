import type { ApiAdapter, ApiRequest, ApiResponse } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class GatewayAdapter implements ApiAdapter {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async request<R>(req: ApiRequest): Promise<ApiResponse<R>> {
    try {
      let url = `${this.baseUrl}${req.endpoint}`

      if (req.params) {
        const searchParams = new URLSearchParams(req.params)
        url += `?${searchParams.toString()}`
      }

      const response = await fetch(url, {
        method: req.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: req.body ? JSON.stringify(req.body) : undefined,
      })

      if (!response.ok) {
        return {
          data: null as R,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return { data }
    } catch (err) {
      return {
        data: null as R,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  }
}

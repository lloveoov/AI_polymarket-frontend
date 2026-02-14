import type { ApiMode, ApiAdapter } from './types'
import { MockAdapter } from './MockAdapter'
import { GatewayAdapter } from './GatewayAdapter'

const API_MODE = (import.meta.env.VITE_API_MODE ?? 'mock') as ApiMode
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export function createApiAdapter(): ApiAdapter {
  if (API_MODE === 'gateway') {
    return new GatewayAdapter(API_BASE_URL)
  }
  return new MockAdapter()
}

export function getApiMode(): ApiMode {
  return API_MODE
}

export { API_BASE_URL }

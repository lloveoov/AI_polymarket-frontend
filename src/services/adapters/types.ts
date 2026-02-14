export interface ApiRequest {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  params?: Record<string, string>
}

export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface ApiAdapter {
  request<R>(req: ApiRequest): Promise<ApiResponse<R>>
}

export type ApiMode = 'mock' | 'gateway'

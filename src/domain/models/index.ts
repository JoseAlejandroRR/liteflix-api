export interface Pagination {
  page?: number
  pageSize?: number
}

export const PaginationDefault: Pagination = {
  page: 1,
  pageSize: 20,
}

export interface PaginationResult<T> {
  page: number
  pageSize: number
  total: number
  results: T[]
}
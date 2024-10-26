
export interface SearchRepository<T> {
  where?: Partial<T>
  order?: { [P in keyof T]?: 'ASC' | 'DESC' }
}

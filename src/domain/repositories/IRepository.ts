import { SearchRepository } from "./ISearchRepository"

export interface IRepository<T> {

  findOne(where: SearchRepository<T>): Promise<T | null>

  find(options?: SearchRepository<T>): Promise<T[]>

  findByKey(key: string | number): Promise<T | null>

  create(entity: T): Promise<T>

  update(entity: T): Promise<T>

  delete(where: Record<string, any>): Promise<boolean>

}

import { IRepository } from '@/domain/repositories/IRepository'
import { SearchRepository } from '@/domain/repositories/ISearchRepository'
import { BaseEntity } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

class MockRepository<T extends BaseEntity>
  implements IRepository<T> {

  private items: T[] = []

  async findOne(where: SearchRepository<T>): Promise<T | null> {
    return this.items.find(item => this.match(item, where)) || null
  }

  async find(options?: SearchRepository<T>): Promise<T[]> {
    if (!options || !options.where) return this.items;
    return this.items.filter(item => this.match(item, options))
  }

  async findByKey(key: string | number): Promise<T | null> {
    return this.items.find(item => (item as any).id === key) || null
  }

  async create(entity: T): Promise<T> {

    const now = new Date()

    Object.assign(entity, {
        id: uuidv4(), 
        createdAt: now, 
        updatedAt: now,
    })

    this.items.push(entity)

    return entity
  }

  async update(entity: T): Promise<T> {
    const index = this.items.findIndex(item => (item as any).id === (entity as any).id)
    if (index !== -1) {
      const now = new Date()
      const updatedEntity = { 
        ...entity, 
        updatedAt: now 
      } as T

      this.items[index] = updatedEntity

      return updatedEntity
    }
    return entity
  }

  async delete(where: Record<string, any>): Promise<boolean> {
    const index = this.items.findIndex(item => this.match(item, {  }))
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }

  private match(item: T, search: SearchRepository<T>): boolean {
    return Object.keys(search.where || {}).every(key => {
      return (item as any)[key] === (search.where as any)[key]
    })
  }
}


export default MockRepository


import {  Repository, BaseEntity, FindOptionsWhere, FindManyOptions, FindOneOptions } from 'typeorm'
import { inject } from 'tsyringe'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import MysqlDatabase from '../database/MysqlDatabase'
import { IRepository } from '@/domain/repositories/IRepository'
import { SearchRepository } from '@/domain/repositories/ISearchRepository'
abstract class MySqlBaseRepository<T extends BaseEntity> implements IRepository<T> {

  private _entityRepository: Repository<T>

  constructor(
    @inject(ServiceProviderIds.Database) protected database: MysqlDatabase,
  ) {
    const entityClass = this.getEntityClass();
    if (!entityClass) {
      throw new Error('No entity class found for this repository');
    }

    this._entityRepository = this.database.getConnection().manager.getRepository(entityClass)
  }

  protected abstract getEntityClass(): new () => T

  protected get entityRepository(): Repository<T> {
    if (this.database.isTransactionActive()) {
      const entityClass = this.getEntityClass()

      return this.database.getQueryRunner().manager.getRepository(entityClass)
    }

    return this._entityRepository;
  }

  async find(options?: SearchRepository<T> | undefined): Promise<T[]> {
    return await this.entityRepository.find(options as unknown as FindManyOptions)
  }

  async findOne(options: SearchRepository<T>): Promise<T | null> {
    return await this.entityRepository.findOne(options as FindOneOptions)
  }

  async findByKey(key: string | number): Promise<T | null> {
    const filter = { where: { id: key } as unknown as FindOptionsWhere<Partial<T>> }

    return await this.entityRepository.findOne(filter)
  }

  async create(entity: T): Promise<T> {
    const model = await this.entityRepository.save(entity)
    return model
  }

  async update(entity: T): Promise<T> {
    return await this.entityRepository.save(entity);
  }

  async delete(entity: T): Promise<boolean> {
    let result

    if (entity.hasId()) {
      result = await this.entityRepository.remove(entity)
    }

    return result ? true :false
  }

}

export default MySqlBaseRepository

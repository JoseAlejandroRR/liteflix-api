import MySqlBaseRepository from './MySqlBaseRepository'
import MysqlDatabase from '../database/MysqlDatabase'
import { inject, injectable } from 'tsyringe'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import { IRepository } from '@/domain/repositories/IRepository'
import { UserMovie } from '@/domain/models/UserMovie'

@injectable()
class UserMovieRepository extends MySqlBaseRepository<UserMovie> implements IRepository<UserMovie> {

  constructor(
    @inject(ServiceProviderIds.Database) protected database: MysqlDatabase,
  ) {
    super(database)
  }

  protected getEntityClass(): new () => UserMovie {
    return UserMovie
  }
  
}

export default UserMovieRepository

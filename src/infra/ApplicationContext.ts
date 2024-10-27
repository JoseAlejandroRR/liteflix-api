import IDatabase from '@/domain/database/IDatabase'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import { container } from 'tsyringe'
import MysqlDatabase from './database/MysqlDatabase'
import MysqlUserRepository from './repositories/MysqlUserRepository'
import MovieRepository from './repositories/MovieRepository'

class ApplicationContext {
  static initialize(): void {
    console.log('::STARTING SERVICE CONTAINER::')

    container.registerSingleton<IDatabase>(ServiceProviderIds.Database, MysqlDatabase)

     //REPOSITORIES
     container.register(ServiceProviderIds.UserRepository, { useClass: MysqlUserRepository })
     container.register(ServiceProviderIds.MovieRepository, { useClass: MovieRepository })
  }
}

export default ApplicationContext
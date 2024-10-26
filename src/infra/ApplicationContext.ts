import IDatabase from '@/domain/database/IDatabase'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import { container } from 'tsyringe'
import MysqlDatabase from './database/MysqlDatabase'
import MysqlUserRepository from './repositories/MysqlUserRepository'

class ApplicationContext {
  static initialize(): void {
    console.log('::STARTING SERVICE CONTAINER::')

    container.registerSingleton<IDatabase>(ServiceProviderIds.Database, MysqlDatabase)

     //REPOSITORIES
     container.register(ServiceProviderIds.UserRepository, { useClass: MysqlUserRepository });
  }
}

export default ApplicationContext
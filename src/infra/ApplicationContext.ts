import IDatabase from '@/domain/database/IDatabase'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import { container } from 'tsyringe'
import MysqlDatabase from './database/MysqlDatabase'
import MysqlUserRepository from './repositories/MysqlUserRepository'
import MovieRepository from './repositories/MovieRepository'
import { S3StorageService } from './S3StorageService'
import { IEventBus } from '@/domain/events/IEventBus'
import { SimpleEventBus } from './SimpleEventBus'
import { MovieHandler } from '@/application/events/MovieHandler'
import UserMovieRepository from './repositories/UserMovieRepository'

class ApplicationContext {

  static  events = [
    MovieHandler,
  ]

  static initialize(): void {
    console.log('::STARTING SERVICE CONTAINER::')

    container.registerSingleton<IDatabase>(ServiceProviderIds.Database, MysqlDatabase)

     //REPOSITORIES
     container.register(ServiceProviderIds.UserRepository, { useClass: MysqlUserRepository })
     container.register(ServiceProviderIds.MovieRepository, { useClass: MovieRepository })
     container.register(ServiceProviderIds.UserMovieRepository, { useClass: UserMovieRepository })

     //PROVIDERS
     container.register(ServiceProviderIds.StorageService, { useClass: S3StorageService })

     container.registerSingleton<IEventBus>(ServiceProviderIds.EventBus, SimpleEventBus)

     this.registerEvents()
  }

  private static registerEvents(): void {
    ApplicationContext.events.forEach((handler) => {
      container.resolve(handler)
    })
  }
}

export default ApplicationContext
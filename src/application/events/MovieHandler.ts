import { inject, injectable } from 'tsyringe'
import { EventHandler } from '@/domain/events/EventHandler'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import { IEventBus } from '@/domain/events/IEventBus'
import { IMovieRepository } from '@/domain/repositories/IMovieRepository'
import { IEvent } from '@/domain/events/IEvent'
import { EventType } from '@/domain/events/EventType'
import { Movie } from '@/domain/models/Movie'
import { IStorageService } from '@/domain/storage/IStorageService'
import ImageProcessor from '@/infra/ImageProcesor'
import MovieStatus from '@/domain/enums/MovieStatus'
import { User } from '@/domain/models/User'
import UserRole from '@/domain/enums/UserRole'
import { UserMovie } from '@/domain/models/UserMovie'
import { IRepository } from '@/domain/repositories/IRepository'

@injectable()
export class MovieHandler extends EventHandler  {

  constructor(
    @inject(ServiceProviderIds.EventBus) protected eventBus: IEventBus,
    @inject(ServiceProviderIds.MovieRepository) protected movieRepository: IMovieRepository,
    @inject(ServiceProviderIds.UserMovieRepository) protected userMovieRepository: IRepository<UserMovie>,
    @inject(ServiceProviderIds.StorageService) private storage: IStorageService,
    @inject(ImageProcessor) private imageProcessor: ImageProcessor
  ) {
    super(eventBus)
  }

  protected on(eventBus: IEventBus): void {
    this.eventBus.on(
      EventType.Movie.Created,
      async (event: IEvent) => {
        const { payload } = event
        const movie: Movie = payload.movie
        console.info('[EventType.Movie.Created]: Id: ', movie.id)
        console.log(movie)

        //const imagePath = await this.storage.getObject(movie.imageURL!)
        //const thumbName = `thumb_${getFileNameFromPath(imagePath)}`
        //const thumbPath = `${TEMP_FOLDER}/thumb_${thumbName}`

        /*await this.imageProcessor.generateFromImage({
          originPath: imagePath,
          outputPath: thumbPath,
          options: {
            width: 300,
            height: 225,
            fit: 'cover'
          }
        })
        //const fileKey = `movies/${thumbName}`
        //await this.storage.putObject(fileKey, thumbPath)
        */
        /*
        if (!movie.imageURL) return;

        const thumbnailKey = await this.imageProcessor.generateFromS3Key(
          movie.imageURL
        )


        if (!thumbnailKey) {
          console.info('[EventType.Movie.Created]: Thumbnail generation failed')
          console.info(`[EventType.Movie.Created]: movieId: ${movie.id}`)
          console.info(`[EventType.Movie.Created]: imageURL: ${movie.imageURL}`)
        }

        movie.update({
          thumbnailURL: thumbnailKey
        })

        await this.movieRepository.update(movie)

        //await deleteFile(imagePath)
        //await deleteFile(thumbPath)

        console.info('[EventType.Movie.Created]: Thumbnail Generated')*/
 
    })

    this.eventBus.on(
      EventType.Movie.Updated,
      async (event: IEvent) => {
        const { payload } = event
        const movie: Movie = payload.movie
        const user: User = payload.user
        //const { previousState } = payload

        if (movie.status === MovieStatus.ACTIVE && user.role !== UserRole.ADMIN) {

          const checker = await this.userMovieRepository.find({
            where: {
              userId: user.id,
              movieId: movie.id
            }
          })

          if (checker.length < 1) {
            const myMovie = user.addMovieToList(movie)

            await this.userMovieRepository.create(myMovie)

            console.info(`EventType.Movie.Updated]: Movie '${movie.id}' added to userId: ${user.id}`)
      
          }
        }

        console.info('[EventType.Movie.Updated]: Id: ', movie.id)
      }
    )

    this.eventBus.on(
      EventType.Movie.Deleted,
      async (event: IEvent) => {
        console.log("EventType.Movie.Created triggered")
        const { payload } = event
        const movie: Movie = payload.movie

        if (movie.imageURL) {
          await this.storage.deleteObject(movie.imageURL)
        }
    
        if (movie.thumbnailURL) {
          await this.storage.deleteObject(movie.thumbnailURL)
        }

        console.info('[EventType.Movie.Deleted]: Id: ', movie.id)
      }
    )
  }

}


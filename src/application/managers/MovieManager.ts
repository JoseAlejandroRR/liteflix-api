import { inject, injectable } from 'tsyringe'
import BaseManager from './BaseManager'
import MovieService from '../services/MovieService'
import { Movie } from '@/domain/models/Movie'
import { User } from '@/domain/models/User'
import { PaginationResult } from '@/domain/models'
import { CreateMovieDto } from '@/domain/dto/CreateMovieDto'
import { deleteFile, getUUID, writeFile } from '@/infra/utils'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import { IStorageService } from '@/domain/storage/IStorageService'
import { AuthSession } from '@/domain/security'
import { UpdateMovieDto } from '@/domain/dto/UpdateMovieDto'
import MovieStatus from '@/domain/enums/MovieStatus'
import IDatabase from '@/domain/database/IDatabase'

@injectable()
class MovieManager extends BaseManager {

  constructor(
    @inject(MovieService) private movieService: MovieService,
    @inject(ServiceProviderIds.StorageService) private storage: IStorageService,
    @inject(ServiceProviderIds.Database) private database: IDatabase,
  ) {
    super()
  }

  async getMovieById(id: string): Promise<Movie> {
    const movie = await this.movieService.getMovieById(id)

    return movie
  }

  async deleteMovieById(id: string, auth: AuthSession): Promise<boolean> {
    const movie = await this.movieService.getMovieById(id)

    const result = await this.movieService.deleteMovie(movie, auth)

    if (!result) return false

    return result
  }

  async getActiveMovies(take?: number): Promise<Movie[]> {
    const movies = await this.movieService.getAllMovies({ take })

    return movies
  }

  async getMyMoviesByUser(
    user: User,
    take?: number
  ): Promise<PaginationResult<Movie>> {
    const movies = await this.movieService.getMovieListByUser(user)

    return movies
  }

  async createMovie(input: CreateMovieDto, auth: AuthSession): Promise<Movie | null> {
    let movie
    let filePath

    const { image } = input
    const fileKey = `movies/${ getUUID() }-${image!.name}`

    try {
      await this.database.startTransaction()

      filePath = await writeFile(image?.name!, image!)
      await this.storage.putObject(fileKey, filePath!)

      const draftMovies = await this.movieService.getDaftMovies(auth.user!)

      if (draftMovies.length > 0) {

        movie = await this.movieService.updateMovie(
          draftMovies[0].id,
          {
            ...input,
            imageURL: fileKey,
            thumbnailURL: fileKey,
            status: MovieStatus.DRAFT
          },
          auth
        )

      } else {

        movie = await this.movieService.createMovie(
          {
            ...input,
            imageURL: fileKey,
            thumbnailURL: fileKey,
          },
          auth
        )

      }

      await this.database.commit()

      return movie

    } catch (err) {
      console.log("[createMovie] Error: ", err)
      await this.storage.deleteObject(fileKey)
      await this.database.rollback()
      if (this.isDevelopment) {
        throw err
      }
    } finally {
      if (filePath) {
        await deleteFile(filePath)
      }
    }

    return null
  }

  async updateMovie(id: string, input: UpdateMovieDto, auth: AuthSession): Promise<Movie> {

    const movie = await this.movieService.updateMovie(id, input, auth)

    return movie
  }
}

export default MovieManager

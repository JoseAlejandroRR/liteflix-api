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

@injectable()
class MovieManager extends BaseManager {

  constructor(
    @inject(MovieService) private movieService: MovieService,
    @inject(ServiceProviderIds.StorageService) private storage: IStorageService
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

    if (movie.imageURL) {
      await this.storage.deleteObject(movie.imageURL)
    }

    if (movie.thumbnailURL) {
      await this.storage.deleteObject(movie.thumbnailURL)
    }

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

  async createMovie(input: CreateMovieDto, auth: AuthSession): Promise<Movie> {

    const { image } = input

    const fileKey = `movies/${ getUUID() }-${image!.name}`
    const filePath = await writeFile(image?.name!, image!)

    await this.storage.putObject(fileKey, filePath!)

    const movie = this.movieService.createMovie(
      {
        ...input,
        imageURL: fileKey,
        thumbnailURL: fileKey,
      },
      auth
    )

    await deleteFile(filePath!)

    return movie
  }

  async updateMovie(id: string, input: UpdateMovieDto, auth: AuthSession): Promise<Movie> {

    const movie = await this.movieService.updateMovie(id, input, auth)

    return movie
  }
}

export default MovieManager

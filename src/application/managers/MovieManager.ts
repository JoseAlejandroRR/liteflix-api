import { inject, injectable } from 'tsyringe'
import BaseManager from './BaseManager'
import MovieService from '../services/MovieService'
import { Movie } from '@/domain/models/Movie'
import { User } from '@/domain/models/User'
import { PaginationResult } from '@/domain/models'

@injectable()
class MovieManager extends BaseManager {

  constructor(
    @inject(MovieService) private movieService: MovieService
  ) {
    super()
  }

  async getMovieById(id: string): Promise<Movie> {
    const movie = await this.movieService.getMovieById(id)

    return movie
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
}

export default MovieManager

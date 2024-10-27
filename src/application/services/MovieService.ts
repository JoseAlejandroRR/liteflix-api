import { inject, injectable } from 'tsyringe'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import EntityNotFoundException from '@/domain/exceptions/EntityNotFoundException'
import { IMovieRepository } from '@/domain/repositories/IMovieRepository'
import { Movie } from '@/domain/models/Movie'
import MovieStatus from '@/domain/enums/MovieStatus'
import { User } from '@/domain/models/User'
import { PaginationResult } from '@/domain/models'

export type MovieSearchParams = {
  status?: MovieStatus,
  order?: { [P in keyof Movie]?: 'ASC' | 'DESC' }
  take?: number,
  skip?: number,
}

@injectable()
class MovieService {

  constructor(
    @inject(ServiceProviderIds.MovieRepository) private movieRepository: IMovieRepository,
  ) {}

  async getMovieById(id: string): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: {
        id
      },
    })

    if (!movie) {
      throw new EntityNotFoundException(Movie, String(id))
    }

    return movie
  }

  async getAllMovies(filters?: MovieSearchParams): Promise<Movie[]> {
    const where = {
      ...(filters?.status ? { status: filters.status } : {}),
    }
    
    const movies = await this.movieRepository.find({
      where,
      order: {
        updatedAt: 'DESC'
      },
      take: filters?.take ?? 10,
      skip: filters?.skip ?? 0,
    })

    return movies
  }

  async getMovieListByUser(user: User): Promise<PaginationResult<Movie>> {
    const movies = await this.movieRepository.getMoviesByUserId({
      userId: user.id,
    })

    return movies
  }
}

export default MovieService

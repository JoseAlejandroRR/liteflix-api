import { inject, injectable } from 'tsyringe'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import EntityNotFoundException from '@/domain/exceptions/EntityNotFoundException'
import { IMovieRepository } from '@/domain/repositories/IMovieRepository'
import { Movie } from '@/domain/models/Movie'
import MovieStatus from '@/domain/enums/MovieStatus'
import { User } from '@/domain/models/User'
import { PaginationResult } from '@/domain/models'
import { CreateMovieDto } from '@/domain/dto/CreateMovieDto'
import { AuthSession } from '@/domain/security'
import UserRole from '@/domain/enums/UserRole'
import UnauthorizedUserException from '@/domain/exceptions/UnauthorizedUserException'
import { UpdateMovieDto } from '@/domain/dto/UpdateMovieDto'
import { IEventBus } from '@/domain/events/IEventBus'
import { EventType } from '@/domain/events/EventType'

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
    @inject(ServiceProviderIds.EventBus) private evenBus: IEventBus,
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

  async createMovie(data: CreateMovieDto, auth: AuthSession): Promise<Movie> {
    let movie = Movie.factory({
      ...data,
      userId: auth.user!.id!,
    })

    movie = await this.movieRepository.create(movie)

    this.evenBus.emit({
      name: EventType.Movie.Created,
      payload: {
        movie
      },
      timestamp: new Date()
    })

    return movie
  }

  async updateMovie(id: string, data: UpdateMovieDto, auth: AuthSession): Promise<Movie> {
    let movie = await this.getMovieById(id)

    const previousState = Object.assign({}, movie)

    movie.update(data)

    const movieUpdated = await this.movieRepository.update(movie)

    this.evenBus.emit({
      name: EventType.Movie.Updated,
      payload: {
        movie: movieUpdated,
        previousState,
        user: auth.user!
      },
      timestamp: new Date()
    })

    return movieUpdated
  }

  async deleteMovie(movie: Movie, auth: AuthSession): Promise<boolean> {
    const { user } = auth
    if (user?.role !== UserRole.ADMIN) {
      throw new UnauthorizedUserException()
    }

    const result = await this.movieRepository.delete(movie)

    this.evenBus.emit({
      name: EventType.Movie.Deleted,
      payload: {
        movie
      },
      timestamp: new Date()
    })

    return result
  }

  async getDaftMovies(user: User): Promise<Movie[]> {
    const movies = await this.movieRepository.find({
      where: {
        userId: user.id,
        status: MovieStatus.DRAFT
      }
    })

    return movies
  }
}

export default MovieService

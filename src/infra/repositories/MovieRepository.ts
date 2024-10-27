import MySqlBaseRepository from './MySqlBaseRepository'
import { Movie } from '@/domain/models/Movie'
import { IMovieRepository } from '@/domain/repositories/IMovieRepository'
import MysqlDatabase from '../database/MysqlDatabase'
import { inject, injectable } from 'tsyringe'
import { ServiceProviderIds } from '@/domain/ServiceProvideIds'
import { Pagination, PaginationResult } from '@/domain/models'
import MovieStatus from '@/domain/enums/MovieStatus'

@injectable()
class MovieRepository extends MySqlBaseRepository<Movie> implements IMovieRepository {

  constructor(
    @inject(ServiceProviderIds.Database) protected database: MysqlDatabase,
  ) {
    super(database)
  }

  protected getEntityClass(): new () => Movie {
    return Movie
  }

  async getMoviesByUserId(params: {
    userId: string,
    status: MovieStatus,
    pagination: Pagination,
    filters?: Record<string, any>
  }): Promise<PaginationResult<Movie>> {
    const { userId, pagination: pageInput } = params
    const pagination = { page: 1, pageSize: 20, ...pageInput  }

    const [results, total] = await this.entityRepository
      .createQueryBuilder('movie')
      .innerJoin('movie.users', 'userMovies')
      .where('userMovies.userId = :userId', { userId })
      .andWhere('movie.status IN (:...statuses)', { statuses: [MovieStatus.ACTIVE, MovieStatus.SOON] })
      .take(pagination.pageSize)
      .skip(((pagination.page -1) * pagination.pageSize))
      .orderBy('movie.updatedAt', 'DESC')
      .getManyAndCount()

    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      results,
      total
    }
  }
  
}

export default MovieRepository

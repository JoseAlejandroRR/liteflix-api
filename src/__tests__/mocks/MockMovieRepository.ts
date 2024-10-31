import { Movie } from '@/domain/models/Movie'
import MockRepository from './MockRepository'
import { IMovieRepository } from '@/domain/repositories/IMovieRepository'
import { Pagination, PaginationResult } from '@/domain/models'
import MovieStatus from '@/domain/enums/MovieStatus';
import MovieFactory from './factories/MovieFactory';

class MockMovieRepository extends MockRepository<Movie>
  implements IMovieRepository {

  

  async getMoviesByUserId(params: { userId: string; pagination?: Pagination; filters?: Record<string, any> }): Promise<PaginationResult<Movie>> {
    const movie = MovieFactory.generate()

    return {
      results: [movie],
      total: 1,
      page: 1,
      pageSize: 10
    }
  }
}

export default MockMovieRepository

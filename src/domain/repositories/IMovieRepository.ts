import { IRepository } from './IRepository'
import { Pagination, PaginationResult } from '../models'
import { Movie } from '../models/Movie'

export interface IMovieRepository extends IRepository<Movie> {

  getMoviesByUserId(params: {
    userId: string,
    pagination?: Pagination,
    filters?: Record<string, any>
  }): Promise<PaginationResult<Movie>>
}

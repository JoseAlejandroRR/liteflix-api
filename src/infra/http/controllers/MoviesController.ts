import { BaseController } from './BaseController'
import { inject, injectable } from 'tsyringe'
import { Context } from 'hono'
import ViewModel from '@/domain/views/ViewModel'
import MovieManager from '@/application/managers/MovieManager'
import MovieViewModel from '@/domain/views/auth/MovieViewModel'
import { AuthSession } from '@/domain/security'

@injectable()
class MoviesController extends BaseController {

  constructor(
    @inject(MovieManager) private movieManager: MovieManager
  ) {
    super()
  }

  async getAllMovies(ctx: Context) {

    const movies = await this.movieManager.getActiveMovies()

    return ctx.json(ViewModel.createMany(MovieViewModel, movies))
  }

  async getMyMovieList(ctx: Context) {
    const auth: AuthSession = this.getAuthSession(ctx)

    console.log(auth)

    const movies = await this.movieManager.getMyMoviesByUser(auth.user!)

    return ctx.json(ViewModel.createPage(MovieViewModel, movies))
  }

  async getMovieById(ctx: Context) {
    const { movieId } = ctx.req.param()

    const employee = await this.movieManager.getMovieById(movieId)

    return ctx.json(ViewModel.createOne(MovieViewModel, employee))
  }

}

export default MoviesController

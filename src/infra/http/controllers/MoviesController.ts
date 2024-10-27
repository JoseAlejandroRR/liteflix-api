import { BaseController } from './BaseController'
import { inject, injectable } from 'tsyringe'
import { Context } from 'hono'
import ViewModel from '@/domain/views/ViewModel'
import MovieManager from '@/application/managers/MovieManager'
import MovieViewModel from '@/domain/views/auth/MovieViewModel'
import { AuthSession } from '@/domain/security'
import { CreateMovieDto } from '@/domain/dto/CreateMovieDto'
import MovieStatus from '@/domain/enums/MovieStatus'

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

    const movies = await this.movieManager.getMyMoviesByUser(auth.user!)

    return ctx.json(ViewModel.createPage(MovieViewModel, movies))
  }

  async getMovieById(ctx: Context) {
    const { movieId } = ctx.req.param()

    const movie = await this.movieManager.getMovieById(movieId)

    return ctx.json(ViewModel.createOne(MovieViewModel, movie))
  }

  async createMovie(ctx: Context) {
    const data = await ctx.req.formData()

    const input:CreateMovieDto = {
      ...(data.get('title') ? { description: data.get('title')?.toString()! } : {}),
      status: data.get('status') as MovieStatus,
      ...(data.get('description') ? { description: data.get('description')?.toString()! } : {}),
      ...(data.get('releasedAt') ? { releasedAt: new Date( data.get('releasedAt')?.toString()!) } : {}),
      image: data.get('image') as File
    }

    const movie = await this.movieManager.createMovie(input, this.getAuthSession(ctx))

    return ctx.json(ViewModel.createOne(MovieViewModel, movie), 201)
  }

  async deleteById(ctx: Context) {
    const { movieId } = ctx.req.param()

    const result = await this.movieManager.deleteMovieById(
      movieId,
      this.getAuthSession(ctx)
    )

    return ctx.json({ success: result })
  }

}

export default MoviesController

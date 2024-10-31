import { inject, injectable } from 'tsyringe'
import { GatewayRouter } from '../GatewayRouter'
import MoviesController from '../controllers/MoviesController'
import GetAllMoviesRequest from '../requests/GetAllMoviesRequest'
import PostCreateMovieRequest from '../requests/PostCreateMovieRequest'
import PutUpdateMovieRequest from '../requests/PutUpdateMovieRequest'
import { CacheControl } from '../middlewares/CacheControl'
import GetMovieRequest from '../requests/GetMovieRequest'
import DeleteMovieRequest from '../requests/DeleteMovieRequest'


@injectable()
class MoviesRouter extends GatewayRouter {

  constructor(
    @inject(MoviesController) protected controller: MoviesController
  ) {
    super()
    this.setup()
  }
  
  setup(): void {

    this.routes.get(
      '/my-movies',
      ...GetAllMoviesRequest,
      CacheControl(),
      this.controller.getMyMovieList.bind(this.controller)
    )

    this.routes.delete(
      '/:movieId',
      ...DeleteMovieRequest,
      this.controller.deleteById.bind(this.controller)
    )

    this.routes.put(
      '/:movieId',
      ...PutUpdateMovieRequest,
      this.controller.updateMovie.bind(this.controller)
    )

    this.routes.get(
      '/:movieId',
      ...GetMovieRequest,
      this.controller.getMovieById.bind(this.controller)
    )

    this.routes.post(
      '/',
      ...PostCreateMovieRequest,
      this.controller.createMovie.bind(this.controller)
    )

    this.routes.get(
      '/',
      ...GetAllMoviesRequest,
      CacheControl(),
      this.controller.getAllMovies.bind(this.controller)
    )
  }
  
}

export default MoviesRouter

import { inject, injectable } from 'tsyringe'
import { GatewayRouter } from '../GatewayRouter'
import MoviesController from '../controllers/MoviesController'
import GetAllMoviesRequest from '../requests/GetAllMoviesRequest'
import PostCreateMovieRequest from '../requests/PostCreateMovieRequest'


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
      this.controller.getMyMovieList.bind(this.controller)
    )

    this.routes.delete(
      '/:movieId',
      this.controller.deleteById.bind(this.controller)
    )

    this.routes.put(
      '/:movieId',
      this.controller.updateMovie.bind(this.controller)
    )

    this.routes.get(
      '/:movieId',
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
      this.controller.getAllMovies.bind(this.controller)
    )
  }
  
}

export default MoviesRouter

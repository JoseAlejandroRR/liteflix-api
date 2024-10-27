import { Hono } from 'hono'
import { inject, injectable } from 'tsyringe'
import AuthRouter from './routers/AuthRouter'
import { ZodError } from 'zod'
import EntityNotFoundException from '@/domain/exceptions/EntityNotFoundException'
import UnauthorizedUserException from '@/domain/exceptions/UnauthorizedUserException'
import { HTTPException } from 'hono/http-exception'
import MoviesRouter from './routers/MoviesRouter'

@injectable()
class HTTPGateway {
  constructor(
    @inject(AuthRouter) private authRouter: AuthRouter,
    @inject(MoviesRouter) private movieRouter: MoviesRouter,
  ) {}

  async bindRoutes(server: Hono) {
    const gateway = new Hono()

    server.onError((err, c) => {
      console.log('[Backend Error]:')
      console.log(err)

      if (err instanceof EntityNotFoundException) {
        return c.json({ message: err.message, code: err.code }, 404)
      }

      if (err instanceof UnauthorizedUserException) {
        return c.json({ message: err.message, code: err.code }, 401)
      }

      if (err instanceof ZodError ) {
        console.log('[ZodError]')
        return c.json(err.issues, 400)
      }

      if (err instanceof HTTPException) {
        return c.json({ message: err.message, code: err.name }, err.status)
      }

      // General Exceptions
      return c.json({ message: 'Internal Server Error', code: 'INTERNAL_ERROR' }, 500)
    })

    gateway.route('/auth', this.authRouter.routes)
    gateway.route('/movies', this.movieRouter.routes)

    server.route('/api', gateway)
  }
}

export default HTTPGateway

import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { OptionalInteger } from '.'

const GetAllMoviesRequest: MiddlewareHandler[] = [
  zValidator('query', z.object({
    take: OptionalInteger(1, 50),
  }))
]

export default GetAllMoviesRequest

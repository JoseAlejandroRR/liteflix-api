import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { OptionalDate, OptionalEnumValue, OptionalInteger, OptionalString } from '.'
import MovieStatus from '@/domain/enums/MovieStatus'

const PutUpdateMovieRequest: MiddlewareHandler[] = [
  zValidator('json', z.object({
    title: OptionalString(),
    description: OptionalString(),
    releasedAt: OptionalDate(),
    rating: OptionalInteger(),
    status: OptionalEnumValue(MovieStatus),
  }))
]

export default PutUpdateMovieRequest

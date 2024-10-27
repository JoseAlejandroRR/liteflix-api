import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { OptionalDate, OptionalInteger, OptionalString, RequireFile } from '.'
import { ImagesExtensionFilter } from '@/infra/utils'

const PostCreateMovieRequest: MiddlewareHandler[] = [
  zValidator('form', z.object({
    title: OptionalString(),
    description: OptionalString(),
    releasedAt: OptionalDate(),
    rating: OptionalInteger(),
    image: RequireFile(ImagesExtensionFilter)
  }))
]

export default PostCreateMovieRequest

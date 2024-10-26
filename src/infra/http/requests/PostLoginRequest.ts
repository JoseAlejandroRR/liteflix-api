import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { RequireEmail, RequireString } from '.'


const PostLoginRequest: MiddlewareHandler[] = [
  zValidator('json', z.object({
    email: RequireEmail(),
    password: RequireString()
  }))
]

export default PostLoginRequest
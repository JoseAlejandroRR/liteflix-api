import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { RequireInteger } from '.'

/**
 * @swagger
 * /movies/:id:
 *   delete:
 *     summary: Delete an existing movie
 *     security:
 *       - bearerAuth: []
 *     tags:
 *      - movies
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         type: string
 *         example: Bearer xxxxx.yyyyy.zzzzz
 *         required: true
 *       - in: path
 *         name: id
 *         type: string
 *         example:  34c5ff47-36f0-4bee-b0d5-f37a8e50bcaa
 *         required: true
 *     responses:
 *       200:
 *         description: Movie delete successfully
 *       204:
 *         description: Not found
 */

const DeleteMovieRequest: MiddlewareHandler[] = [
  zValidator('param', z.object({
    movieId: RequireInteger(),
  }))
]

export default DeleteMovieRequest

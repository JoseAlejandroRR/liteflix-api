import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { RequireUUID } from '.'

/**
 * @swagger
 * /movies/:id:
 *   get:
 *     summary: Get an existing Movie
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
 *         description: Movie Entity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MovieViewModel"
 *       204:
 *         description: Not found
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

const GetMovieRequest: MiddlewareHandler[] = [
  zValidator('param', z.object({
    movieId: RequireUUID(),
  }))
]

export default GetMovieRequest

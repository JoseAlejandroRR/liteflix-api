import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { OptionalInteger } from '.'

/**
 * @swagger
 * /movies/my-movies:
 *   get:
 *     summary: Get Movies List by User
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
 *     responses:
 *       200:
 *         description: Get Movies List by User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/MovieViewModel"
 *                 pageSize:
 *                   type: integer
 *                   example: 20
 *                 total:
 *                   type: integer
 *                   example: 120
 *                 page:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

const GetMyMoviesRequest: MiddlewareHandler[] = [
  zValidator('query', z.object({
    take: OptionalInteger(1, 50),
  }))
]

export default GetMyMoviesRequest

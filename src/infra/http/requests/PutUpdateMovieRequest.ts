import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { OptionalDate, OptionalEnumValue, OptionalInteger, OptionalString } from '.'
import MovieStatus from '@/domain/enums/MovieStatus'

/**
 * Request Schema for Create Movie.
 *
 * @swagger
 * components:
 *   schemas:
 *     PutCreateMovieRequest:
 *       description: Request Schema for Create Movie.
 *       properties:
 *         title:
 *           type: string
 *           example: Cuestión de Honor
 *         description:
 *           type: string
 *         releasedAt:
 *           type: Date
 *           example: 2020-02-04
 *         rating:
 *           type: number
 *           example: 8.5
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SOON, DRAFT]
 *         thumbnailURL:
 *           type: string
 *           example: https://s3.amazon.com/thumbail_image.jpg
 */

/**
 * @swagger
 * /movies/:id:
 *   put:
 *     summary: Create new movie
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PutCreateMovieRequest'
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MovieViewModel"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

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

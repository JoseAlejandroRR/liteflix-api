import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { OptionalDate, OptionalInteger, OptionalString, RequireFile } from '.'
import { ImagesExtensionFilter } from '@/infra/utils'

/**
 * Request Schema for Create Movie.
 *
 * @swagger
 * components:
 *   schemas:
 *     PostCreateMovieRequest:
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
 *         image:
 *           type: string
 *           format: binary
 *           required: true
 */

/**
 * @swagger
 * /movies:
 *   post:
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
 *       - in: formData
 *         name: image
 *         type: file
 *         description: Image to be the movie poster
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/PostCreateMovieRequest'
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

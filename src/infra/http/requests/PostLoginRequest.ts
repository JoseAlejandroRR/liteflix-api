import { MiddlewareHandler } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { RequireEmail, RequireString } from '.'

/**
 * Request Schema for User Credentials.
 *
 * @swagger
 * components:
 *   schemas:
 *     UserCredentialsInput:
 *       description: Request Schema User Credentials.
 *       properties:
 *         email:
 *           type: string
 *           example: demo@demo.com
 *           required: true
 *         password:
 *           type: string
 *           example: 123123
 *           required: true
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Retrieve User Credentials
 *     security:
 *       - bearerAuth: []
 *     tags:
 *      - login
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
 *             $ref: '#/components/schemas/UserCredentialsInput'
 *     responses:
 *       200:
 *         description: User Credentials successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginSuccessViewModel"
 *       400:
 *         description: Invalid Credentials
 */

const PostLoginRequest: MiddlewareHandler[] = [
  zValidator('json', z.object({
    email: RequireEmail(),
    password: RequireString()
  }))
]

export default PostLoginRequest
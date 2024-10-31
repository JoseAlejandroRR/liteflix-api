import { User } from '@/domain/models/User'
import ViewModel from '../ViewModel'

/**
 * A view model for a User Model.
 *
 * @swagger
 * components:
 *   schemas:
 *     UserViewModel:
 *       description: User Authentication Token
 *       properties:
 *         id:
 *           type: string
 *           example: a8d56d51-1917-40ca-aa56-38a7acb2321b
 *         firstname:
 *           type: string
 *           example: John
 *         lastname:
 *           type: string
 *           example: Smith
 *         fullName:
 *           type: string
 *           example: John Smith
 *         email:
 *           type: string
 *           example: john.smit@domain.com
 *         pictureURL:
 *           type: string
 *         role:
 *           type: strubg
 *           enum: [USER, ADMIN, CUSTOMER]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w{1}$'
 */

class UserViewModel extends ViewModel<User> {
  constructor(user: User) {
    const view: Record<string, any> = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      fullName: `${user.firstname} ${user.lastname}`,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    super(view)
  }
}

export default UserViewModel

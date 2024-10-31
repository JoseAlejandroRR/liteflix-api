import ViewModel from '../ViewModel'
import { AuthenticationResult } from '@/domain/security'
import UserViewModel from './UserViewModel'


/**
 * A view model for LoginSuccessViewModel.
 *
 * @swagger
 * components:
 *   schemas:
 *     LoginSuccessViewModel:
 *       description: User Authentication Token
 *       properties:
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4ZDU2ZDUxLTE5MTctNDBjYS1hYTU2LTM4YTdhY2IyMzIxYiIsImZpcnN0bmFtZSI6Ikpvc2UiLCJsYXN0bmFtZSI6IlJlYWx6YSIsImZ1bGxOYW1lIjoiSm9zZSBSZWFsemEiLCJlbWFpbCI6Impvc2VhbGVqYW5kcm9yMjhAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiY3JlYXRlZEF0IjoiMjAyNC0xMC0xMVQwODoxOToyMS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyNC0xMC0xMVQwODoxOToyMS4wMDBaIiwiZXhwIjoxNzI4ODUyNjU1LCJpYXQiOjE3Mjg2Nzk4NTV9.jtnP2iux8MWxLBI3iixnBqtsp2XFbiXaZDJCNlyW
 *         user:
 *           $ref: "#/components/schemas/UserViewModel"
 */

class LoginSuccessViewModel extends ViewModel<AuthenticationResult> {

  constructor(data: AuthenticationResult) {
    const { token, user } = data
    const view: Record<string, any> = {
      token,
      user: ViewModel.createOne(UserViewModel, user!)
    }

    super(view)
  }
}

export default LoginSuccessViewModel

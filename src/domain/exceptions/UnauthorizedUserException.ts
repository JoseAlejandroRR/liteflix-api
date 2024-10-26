import Exception from './Exception'
export class UnauthorizedUserException extends Exception {
  constructor(message: string = 'The user is not authorized to perform this action') {
    super('UNAUTHORIZED_USER', message, 401)
  }
}

export default UnauthorizedUserException

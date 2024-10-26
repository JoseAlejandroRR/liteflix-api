import Exception from './Exception'
export class AuthenticationException extends Exception {
  constructor(message?: string, code: number = 401) {
    super(
      'AUTENTICATION_EXCEPTION',
      message ?? '',
      code
    )
  }
}

export default AuthenticationException

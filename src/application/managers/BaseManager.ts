const { NODE_ENV } = process.env

const isDevelopment = NODE_ENV === 'development'

class BaseManager {
  protected get isDevelopment(): boolean {
    return isDevelopment
  }
}

export default BaseManager

export class MockDatabase {

  private transactionActive = false

  async startConnection() {
    return true
  }

  isTransactionActive() {
    return this.transactionActive
  }

  async startTransaction() {
    this.transactionActive = true
  }

  async commit() {
    this.transactionActive = false
    return true
  }

  async rollback() {
    this.transactionActive = false
  }

  async release() {
    this.transactionActive = false
  }
}

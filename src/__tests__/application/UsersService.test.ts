import { User } from "@/domain/models/User"

describe('src/domain/UserService Tests', () => {

  it('[User.checkPassword] Checking password encrypted matchs', async () => {
    const masterPassword = '50BigCarriots'
    const user = new User()
    user.password = masterPassword
    await user.hashPassword()

    const matchs =  await user.checkPassword(masterPassword)

    user.password = undefined
    
    const matchsFail =  await user.checkPassword('admin123')

    expect(user.password).not.toBe(masterPassword)
    expect(matchs).toBe(true)
    expect(matchsFail).toBe(false)
  })
})
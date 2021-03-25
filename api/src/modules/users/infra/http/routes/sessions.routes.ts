import { Request, Response, Router } from 'express'
import CreateSessionService from '@modules/users/services/CreateSessionService'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'

const sessionsRouter = Router()
const usersRepository = new UsersRepository()

sessionsRouter.post('/', async (request: Request, response: Response) => {
  const { email, password } = request.body

  const authenticatedUser = new CreateSessionService(usersRepository)

  const { user, token } = await authenticatedUser.execute({
    email,
    password
  })

  return response.json({ user, token })
})

export default sessionsRouter

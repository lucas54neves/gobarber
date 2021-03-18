import { Request, Response, Router } from 'express'
import CreateSessionService from '../services/CreateSessionService'

const sessionsRouter = Router()

sessionsRouter.post('/', async (request: Request, response: Response) => {
  const { email, password } = request.body

  const authenticatedUser = new CreateSessionService()

  const { user, token } = await authenticatedUser.execute({
    email,
    password
  })

  return response.json({ user, token })
})

export default sessionsRouter

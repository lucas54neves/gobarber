import { Router } from 'express'
import CreateSessionService from '../services/CreateSessionService'

const sessionsRouter = Router()

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body

    const authenticatedUser = new CreateSessionService()

    const { user, token } = await authenticatedUser.execute({
      email,
      password
    })

    return response.json({ user, token })
  } catch (error) {
    return response.status(error.statusCode).json({ error: error.message })
  }
})

export default sessionsRouter

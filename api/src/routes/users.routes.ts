import { Router } from 'express'
import CreateUserService from '../services/CreateUserService'

type UserDTO = {
  name: string
  email: string
  password?: string
}

const usersRouter = Router()

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body

    const createUser = new CreateUserService()

    const user: UserDTO = await createUser.execute({
      name,
      email,
      password
    })

    delete user.password

    return response.json(user)
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
})

export default usersRouter

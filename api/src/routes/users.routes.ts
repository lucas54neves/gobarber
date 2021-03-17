import { Router } from 'express'
import CreateUserService from '../services/CreateUserService'
import multer from 'multer'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import uploadConfig from '../config/upload'

type UserDTO = {
  name: string
  email: string
  password?: string
}

const usersRouter = Router()

const upload = multer(uploadConfig)

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

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    console.log(request.file)

    return response.json({ ok: true })
  }
)

export default usersRouter

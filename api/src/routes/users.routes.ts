import { Request, Response, Router } from 'express'
import CreateUserService from '../services/CreateUserService'
import multer from 'multer'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import uploadConfig from '../config/upload'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'

type UserWithPasswordOptional = {
  password?: string
}

const usersRouter = Router()

const upload = multer(uploadConfig)

usersRouter.post('/', async (request: Request, response: Response) => {
  const { name, email, password } = request.body

  const createUser = new CreateUserService()

  const user: UserWithPasswordOptional = await createUser.execute({
    name,
    email,
    password
  })

  delete user.password

  return response.json(user)
})

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request: Request, response: Response) => {
    const updateUserAvatar = new UpdateUserAvatarService()

    const user: UserWithPasswordOptional = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename
    })

    delete user.password

    return response.json(user)
  }
)

export default usersRouter

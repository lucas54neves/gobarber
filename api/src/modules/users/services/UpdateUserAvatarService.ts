import path from 'path'
import fs from 'fs'

import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'
import IUserRepository from '../repositories/IUsersRepository'

type Request = {
  userId: string
  avatarFilename: string
}

class UpdateUserAvatarService {
  constructor(private usersRepository: IUserRepository) {}

  public async execute({ userId, avatarFilename }: Request) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new AppError('Only authenticated user can change avatar.', 401)
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)

      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }

    user.avatar = avatarFilename

    await this.usersRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService

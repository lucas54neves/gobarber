import { compare } from 'bcryptjs'
import { getRepository } from 'typeorm'
import { sign } from 'jsonwebtoken'

import authConfig from '../../../config/auth'
import User from '../infra/typeorm/entities/Users'
import AppError from '../../../shared/errors/AppError'

type Request = {
  email: string
  password: string
}

type UserDTO = {
  email: string
  password?: string
}

type Response = {
  user: UserDTO
  token: string
}

class CreateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User)

    const user = await usersRepository.findOne({
      where: { email }
    })

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    })

    const userWithPassword: UserDTO = user

    delete userWithPassword.password

    return {
      user: userWithPassword,
      token
    }
  }
}

export default CreateSessionService

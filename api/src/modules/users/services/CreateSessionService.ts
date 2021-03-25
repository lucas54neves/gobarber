import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import authConfig from '@config/auth'
import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import IUserRepository from '@modules/users/repositories/IUsersRepository'

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
  constructor(private usersRepository: IUserRepository) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email)

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

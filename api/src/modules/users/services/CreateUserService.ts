import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import AppError from '@shared/errors/AppError'
import IUserRepository from '@modules/users/repositories/IUsersRepository'
import User from '@modules/users/infra/typeorm/entities/User'

type Request = {
  name: string
  email: string
  password: string
}

class CreateUserService {
  constructor(private usersRepository: IUserRepository) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('Email address already used.', 400)
    }

    const passwordHashed = await hash(password, 8)

    const user = this.usersRepository.create({
      name,
      email,
      password: passwordHashed
    })

    return user
  }
}

export default CreateUserService

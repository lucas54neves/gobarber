import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import User from '../entities/Users'
import AppError from '../../../shared/errors/AppError'

type Request = {
  name: string
  email: string
  password: string
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User)

    const checkUserExists = await usersRepository.findOne({
      where: { email }
    })

    if (checkUserExists) {
      throw new AppError('Email address already used.', 400)
    }

    const passwordHashed = await hash(password, 8)

    const user = usersRepository.create({
      name,
      email,
      password: passwordHashed
    })

    await usersRepository.save(user)

    return user
  }
}

export default CreateUserService

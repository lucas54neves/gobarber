import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/hash/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userName = 'John Doe';
    const userEmail = 'johndoe@example.com';
    const userPassword = '123456';

    const user = await createUser.execute({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    expect(user).toHaveProperty('name');
    expect(user.name).toBe(userName);
    expect(user).toHaveProperty('email');
    expect(user.email).toBe(userEmail);
    expect(user).toHaveProperty('password');
    // expect(user.password).toBe(userPassword);
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userName = 'John Doe';
    const userEmail = 'johndoe@example.com';
    const userPassword = '123456';

    await createUser.execute({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    expect(
      createUser.execute({
        name: userName,
        email: userEmail,
        password: userPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

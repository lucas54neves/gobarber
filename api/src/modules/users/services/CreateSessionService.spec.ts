import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateSessionService from '@modules/users/services/CreateSessionService';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/hash/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userName = 'John Doe';
    const userEmail = 'johndoe@exemple.com';
    const userPassword = '123456';

    const user = await createUser.execute({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    const response = await authenticateUser.execute({
      email: userEmail,
      password: userPassword,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userEmail = 'johndoe@exemple.com';
    const userPassword = '123456';

    expect(
      authenticateUser.execute({
        email: userEmail,
        password: userPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUser = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const userName = 'John Doe';
    const userEmail = 'johndoe@exemple.com';
    const userPassword = '123456';
    const wrongPassword = '1234567';

    await createUser.execute({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    expect(
      authenticateUser.execute({
        email: userEmail,
        password: wrongPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/storage/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const userName = 'John Doe';
    const userEmail = 'johndoe@example.com';
    const userPassword = '123456';
    const avatarFilename = 'avatar.jpg';

    const user = await fakeUsersRepository.create({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename,
    });

    expect(user.avatar).toBe(avatarFilename);
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const userId = 'non-existing-user';
    const avatarFilename = 'avatar.jpg';

    expect(
      updateUserAvatar.execute({
        user_id: userId,
        avatarFilename,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const userName = 'John Doe';
    const userEmail = 'johndoe@example.com';
    const userPassword = '123456';
    const firstAvatarFilename = 'avatar1.jpg';
    const secondAvatarFilename = 'avatar2.jpg';

    const user = await fakeUsersRepository.create({
      name: userName,
      email: userEmail,
      password: userPassword,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: firstAvatarFilename,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: secondAvatarFilename,
    });

    expect(deleteFile).toHaveBeenCalledWith(firstAvatarFilename);
    expect(user.avatar).toBe(secondAvatarFilename);
  });
});

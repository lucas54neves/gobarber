import { container } from 'tsyringe';
import IHashProvider from '@modules/users/providers/hash/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/hash/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

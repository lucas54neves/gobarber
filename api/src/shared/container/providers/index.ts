import { container } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/storage/models/IStorageProvider';
import DiskStorageProvider from '@shared/container/providers/storage/implementations/DiskStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

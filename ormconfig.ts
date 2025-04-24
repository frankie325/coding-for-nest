import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './src/user/user.entity';
import { Profile } from './src/user/profile.entity';
import { Roles } from './src/roles/roles.entity';
import { Logs } from './src/logs/logs.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const connectionParams = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3307,
  username: 'root',
  password: '123456',
  database: 'nest',
  synchronize: true,
  logging: false,
  entities: [User, Profile, Roles, Logs],
} as TypeOrmModuleOptions;

export const AppDataSource = new DataSource({
  ...connectionParams,
  migrations: [],
  subscribers: [],
} as DataSourceOptions);

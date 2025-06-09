import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ConfigEnum } from './config/enum';

function getEnv(env: string): Record<string, any> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}

// 根据环境变量加载配置
function buildConnectOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV}`);
  const config = { ...defaultConfig, ...envConfig };

  const entitiesDir =
    process.env.NODE_ENV === 'test'
      ? [__dirname + '**/*.entity.ts']
      : [__dirname + '/**/*.entity{.js,.ts}'];

  return {
    type: config[ConfigEnum.DATABASE_TYPE] as string,
    host: config[ConfigEnum.DATABASE_HOST] as string,
    port: config[ConfigEnum.DATABASE_PORT] as number,
    username: config[ConfigEnum.DATABASE_USER] as string,
    password: config[ConfigEnum.DATABASE_PASSWORD] as string,
    database: config[ConfigEnum.DATABASE_NAME] as string,
    // synchronize: true, // 是否自动同步数据库结构
    logging: true,
    entities: entitiesDir,
  } as TypeOrmModuleOptions;
}

export const connectionParams = buildConnectOptions();

export const AppDataSource = new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'], //typeorm 必须从给定的"migration"目录加载迁移。
  // cli: { migrationsDir: 'migrations' }, // typeorm CLI命令生成的迁移目录
  // migrationsTableName: 'migrations', // 迁移表名
  // migrationsRun: true, // 是否在应用启动时自动运行迁移
  // migrationsTransactionMode: 'each', // 每个迁移都在单独的事务中运行
  subscribers: [],
} as DataSourceOptions);

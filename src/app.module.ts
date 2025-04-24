import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import { connectionParams } from '../ormconfig';
// 区分不同环境的配置文件
// const envPath = path.join(
//   __dirname,
//   '../',
//   `.env.${process.env.NODE_ENV || 'development'}`,
// );
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
console.log(envPath);

// ConfigModule上述代码将从默认位置（项目根目录）载入并解析一个.env文件，
// 从.env文件和process.env合并环境变量键值对，并将结果存储到一个可以通过ConfigService访问的私有结构
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      // 默认情况下，程序在应用程序的根目录中查找.env文件。
      // 要为.env文件指定另一个路径，请配置forRoot()的配置对象 envFilePath 属性(可选)，如下所示：

      // 如果在多个文件中发现同一个变量，则第一个变量优先。
      envFilePath: [envPath, '.env'],
      // isGlobal: true, // 是否全局可用
      load: config, // 载入配置文件
      // 校验规则：验证环境变量是否符合预期
      // 例如：NODE_ENV只能是development或production，DATABASE_PORT只能是数字3305、3306或3307
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DATABASE_PORT: Joi.number().valid(3305, 3306, 3307).default(3306),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule], // 导入ConfigModule
    //   inject: [ConfigService], // 注入ConfigService
    //   // 通过ConfigService获取配置
    //   useFactory: (configService: ConfigService) =>
    //     ({
    //       type: 'mysql',
    //       host: configService.get<string>('database.host'),
    //       port: configService.get<string>('database.port'),
    //       username: configService.get<string>('database.user'),
    //       password: configService.get<string>('database.password'),
    //       database: configService.get<string>('database.name'),
    //       // 要开始使用 user 实体，我们需要在模块的forRoot()方法的选项中（除非你使用一个静态的全局路径）将它插入entities数组中来让 TypeORM知道它的存在。
    //       entities: [User, Profile, Logs, Roles],
    //       synchronize: true,
    //       logging: process.env.NODE_ENV === 'development', //在开发环境中打印所有日志
    //       // logging: ['error'],
    //     }) as TypeOrmModuleOptions,
    // }),
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

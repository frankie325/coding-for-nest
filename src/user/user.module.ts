import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Logs } from 'src/logs/logs.entity';
import { LoggerModule } from 'nestjs-pino';

const isDev = process.env.NODE_ENV === 'development';
@Module({
  // 如果没有配置ConfigModule为全局模块，则在其他模块中使用ConfigService时需要导入ConfigModule
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Logs]), // 在当前范围中注册User、Logs存储库
    LoggerModule.forRoot({
      pinoHttp: {
        // transport: {
        //   targets: [
        //     {
        //       level: 'info', // 只记录info级别以上的日志
        //       target: 'pino-pretty',
        //       options: {
        //         colorize: true,
        //         translateTime: 'SYS:standard',
        //         // ignore: 'pid,hostname',
        //       },
        //     },
        //     {
        //       level: 'info', // 只记录info级别以上的日志
        //       target: 'pino-roll',
        //       options: {
        //         file: './logs/log.txt',
        //         frequency: 'daily', // 日志文件滚动频率
        //         mkdir: true,
        //         size: '10M', // 每个日志文件的大小限制
        //         compress: false, // 是否压缩日志文件
        //         // 过期时间，超过这个时间的日志文件将被删除
        //         // maxFiles: '30d', // 30天前的日志文件将被删除
        //       },
        //     },
        //   ],
        // },
        transport: isDev
          ? {
              // 一般在开发环境下才使用pino-pretty
              target: 'pino-pretty', //使用pino-pretty格式化日志
              options: {
                colorize: true, //启用颜色
                translateTime: 'SYS:standard', //将时间戳转换为标准格式
                // ignore: 'pid,hostname', //忽略pid和hostname字段
              },
            }
          : {
              // 生产环境下使用默认的JSON格式
              level: 'info',
              target: 'pino-roll',
              options: {
                file: 'log.txt', // 日志文件路径
                frequency: '1d', // 日志文件滚动频率
                mkdir: true, // 如果目录不存在则创建
              },
            },
      },
    }), // 注册pino日志模块
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

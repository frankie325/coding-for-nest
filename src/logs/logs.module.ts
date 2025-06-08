import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LogEnum } from '../../config/enum';
import { LogsController } from './logs.controller';
@Module({
  imports: [
    // 异步方式加载配置，拿到ConfigService
    WinstonModule.forRootAsync({
      // options
      imports: [ConfigModule], // 导入 ConfigModule
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          transports: [
            // 在控制台输出
            new winston.transports.Console({
              level: configService.get(LogEnum.LOG_LEVEL), //输出的日志等级
              // 格式化
              format: winston.format.combine(
                winston.format.timestamp(), //添加时
                // MyApp表示开头的标识
                utilities.format.nestLike('MyApp', {
                  colors: true,
                  prettyPrint: true,
                  processId: true,
                  appName: true,
                }),
              ),
            }),
            // 输出本地文件
            new winston.transports.File({
              level: configService.get(LogEnum.LOG_LEVEL),
              dirname: 'logs',
              filename: 'info.log',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
              ),
            }),
            // 按时间自动生成日志文件，文件名按时间生成
            new winston.transports.DailyRotateFile({
              level: configService.get(LogEnum.LOG_LEVEL),
              dirname: 'logs',
              filename: 'application-%DATE%.log',
              datePattern: 'YYYY-MM-DD-HH',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '14d',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
              ),
            }),
          ],
          // 异常信息输出
          exceptionHandlers: [
            new winston.transports.File({
              level: configService.get(LogEnum.LOG_LEVEL),
              dirname: 'logs',
              filename: 'exceptions.log',
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
              ),
            }),
          ],
        } as WinstonModuleOptions;
      },
    }),
  ],
  controllers: [LogsController],
})
export class LogsModule {}

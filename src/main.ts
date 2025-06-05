import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    // logger: [process.env.LOG_LEVEL as LogLevel],
    // logger: false, //关闭nestjs的日志
    // logger: ['error', 'warn', 'log'], // 只显示错误、警告和日志
    // logger: ['error', 'warn', 'log', 'debug', 'verbose'], // 显示所有日志
  });
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); //全局注册nest-winston
  // const adapterHost = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionFilter(logger, adapterHost)); //全局注册异常过滤器
  // app.useGlobalFilters(new HttpExceptionFilter(logger)); //全局注册异常过滤器

  // 全局管道，用于整个应用程序中的每个路由处理器
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // 只允许白名单中的属性
    }),
  );
  // 统一设置请求前缀
  // app.setGlobalPrefix('api');
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.warn(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

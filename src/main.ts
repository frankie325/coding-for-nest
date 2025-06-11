import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup';
import { Logger } from '@nestjs/common';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: [process.env.LOG_LEVEL as LogLevel],
    // logger: false, //关闭nestjs的日志
    // logger: ['error', 'warn', 'log'], // 只显示错误、警告和日志
    // logger: ['error', 'warn', 'log', 'debug', 'verbose'], // 显示所有日志
  });

  setupApp(app);
  const logger = new Logger();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.warn(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();

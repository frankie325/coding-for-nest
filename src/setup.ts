import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { INestApplication, LogLevel, ValidationPipe } from '@nestjs/common';

export const setupApp = (app: INestApplication) => {
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); //全局注册nest-winston
  // const adapterHost = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionFilter(logger, adapterHost)); //全局注册异常过滤器
  // app.useGlobalFilters(new HttpExceptionFilter(logger)); //全局注册异常过滤器

  // 统一设置请求前缀
  // app.setGlobalPrefix('api');

  // 全局管道，用于整个应用程序中的每个路由处理器
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 开启后，会自动过滤掉 DTO 中未加入验证的属性
      // forbidNonWhitelisted: true, // 开启后，若 DTO 中有加入验证的的属性，则会抛出异常
      // transform: true, // 开启后，会自动将请求体转换为 DTO 实例
      // transformOptions: {
      //   enableImplicitConversion: true, // 开启后，会自动将请求体中的基本类型转换为 DTO 中的基本类型
      // },
      // 只允许指定的 DTO 中的属性
      // forbidUnknownValues: true, // 开启后，若请求体中有未知的属性，则会抛出异常
    }),
  );
};

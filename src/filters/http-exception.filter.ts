import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 异常过滤器：对异常层拥有完全控制权

// @Catch告诉NESTJS要捕获的异常类型
// 这里我们捕获所有的HttpException异常
// 也可以使用@Catch()捕获所有异常
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 输出请求错误日志
    this.logger.error(exception.message, exception.stack);
    console.log('🚀 ~ HttpExceptionFilter ~ exception:', exception);

    // 自定义返回的JSON格式
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      method: request.method,
    });
  }
}

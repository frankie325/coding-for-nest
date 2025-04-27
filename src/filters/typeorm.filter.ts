import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TypeORMError } from 'typeorm';
import { Request, Response } from 'express';

// typeorm异常过滤器
@Catch(TypeORMError)
export class TypeormFilter<TypeORMError> implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 自定义返回的JSON格式
    response.status(500).json({
      statusCode: -1,
      timestamp: new Date().toISOString(),
      path: request.url,
      exception: exception,
      method: request.method,
    });
  }
}

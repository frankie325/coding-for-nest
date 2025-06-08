import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('这是在拦截器执行之前');
    return next.handle().pipe(
      map((data: any) => {
        console.log('这是在拦截器执行之后');
        return plainToInstance(this.dto, data, {
          // 设置为true之后，所有经过该拦截器的接口都需要设置Expose或者Exclude装饰器
          // Expose表示暴露哪些字段，用户可以访问
          // Exclude表示排除哪些字段，用户无法访问
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

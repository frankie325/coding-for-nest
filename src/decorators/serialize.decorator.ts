import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { SerializeInterceptor } from '../interceptors/serialize/serialize.interceptor';

// 封装成装饰器
export function Serialize(dto: ClassConstructor<any>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

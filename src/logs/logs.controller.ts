import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Serialize } from 'src/decorators/serialize.decorator';
import { SerializeInterceptor } from 'src/interceptors/serialize/serialize.interceptor';

class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  // ValidationPipe开启whitelist后，未在DTO中加入验证的属性会被自动过滤掉
  // id: string;
  id: string;

  @IsString()
  date: string;
}

// 输出数据的dto
class PublicLogsDto {
  // 只暴露msg字段给用户
  @Expose()
  msg: string;
}

@Controller('logs')
export class LogsController {
  @Serialize(PublicLogsDto) //封装成装饰器
  //   @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  // 使用拦截器：序列化排除id字段
  //   SerializeInterceptor是后置拦截器，返回给用户时调用
  @Post()
  postTest(@Body() logsDto: LogsDto) {
    // 这里可以处理日志数据
    console.log('Received logs:', logsDto); //id已被过滤掉
    return logsDto; //只有msg暴露给了用户
  }
}

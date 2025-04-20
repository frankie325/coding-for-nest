import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api') // 设置路由前缀
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('app')
  getApp(): any {
    return { code: 0, data: 'Hello Nestjs', msg: '请求成功' };
  }
}

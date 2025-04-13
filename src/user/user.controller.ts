import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUsers(): any {
    // 访问环境变量
    console.log(
      'database user:',
      this.configService.get<string>('DATABASE_USER'),
    );
    // 访问自定义配置文件，第二个参数定义一个默认值，当键不存在时将返回该值
    console.log(
      'database port:',
      this.configService.get<string>('database.port', '3306'),
    );

    return this.userService.getUsers();
    //
    // return { code: 0, data: 'Hello User', msg: '请求成功' };
  }

  @Post()
  addUser(): any {
    return this.userService.addUser();
  }
}

import {
  Controller,
  Get,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  getUsers(): any {
    // 抛出内置的基础异常类
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    this.logger.log('请求getUsers成功');
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

    return this.userService.findAll();
  }

  @Post()
  async addUser(): Promise<User> {
    const user: User = {
      username: 'kfg',
      password: '123456',
    } as User;
    // const newUser = await this.userService.create(user);
    return this.userService.create(user);
  }

  @Get('profile')
  getProfile(): any {
    return this.userService.findProfile(1);
  }
  @Get('logs')
  getLogs(): any {
    return this.userService.findLogs(1);
  }

  @Get('logsByGroup')
  getLogsByGroup(): any {
    return this.userService.findLogsByGroup(1);
  }
}

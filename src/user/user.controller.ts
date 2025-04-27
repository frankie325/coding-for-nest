import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  // HttpException,
  // HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Logger } from 'nestjs-pino';
import { getUserDto } from './dto/get-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('user')
@UseFilters(new TypeormFilter()) //在user模块局部使用异常过滤器
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private logger: Logger,
  ) {
    this.logger.log('UserController init');
  }

  // @Get()
  // getUsers(): any {
  //   // 抛出内置的基础异常类
  //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

  //   this.logger.log('请求getUsers成功');
  //   // 访问环境变量
  //   console.log(
  //     'database user:',
  //     this.configService.get<string>('DATABASE_USER'),
  //   );
  //   // 访问自定义配置文件，第二个参数定义一个默认值，当键不存在时将返回该值
  //   console.log(
  //     'database port:',
  //     this.configService.get<string>('database.port', '3306'),
  //   );

  //   return this.userService.findAll();
  // }

  @Get()
  getUsers(@Query() query: getUserDto): any {
    return this.userService.findAll(query);
  }

  @Post()
  addUser(@Body() dto: User, @Req() req): any {
    console.log('🚀 ~ UserController ~ addUser ~ dto:', dto);
    // console.log('🚀 ~ UserController ~ addUser ~ req:', req);
    // const user: User = {
    //   username: 'kfg',
    //   password: '123456',
    // } as User;
    // const newUser = await this.userService.create(user);
    return this.userService.create(dto);
  }

  @Get('profile')
  getProfile(@Query() id: number): any {
    console.log('🚀 ~ UserController ~ getProfile ~ id:', id);
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

  @Patch('/:id')
  updateUser(@Body() dto: any, @Param('id') id: number) {
    console.log('🚀 ~ UserController ~ updateUser ~ dto:', dto);
    console.log('🚀 ~ UserController ~ updateUser ~ id:', id);
  }

  // /:id放在最下面，否则会将/user/xxx 当做/:id的参数
  @Get('/:id')
  getUser(@Query() id: number): any {
    console.log('🚀 ~ UserController ~ getUser ~ id:', id);
    return 'hello user';
  }
}

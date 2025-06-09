import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request as NestRequest,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { SigninUserDto } from './dto/signin-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
// import { SerializeInterceptor } from 'src/interceptors/serialize/serialize.interceptor';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) // 使用拦截器：序列化排除password字段
export class AuthController {
  constructor(private authService: AuthService) {}

  // AuthGuard('local')将会使用Passport的本地策略进行验证
  // 如果验证成功，用户信息将会被注入到请求对象中
  // 如果验证失败，将会抛出401 Unauthorized异常
  // @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signin(@Body() dto: SigninUserDto, @NestRequest() req: Request) {
    // console.log('🚀 ~ AuthController ~ signin ~ req.user:', req.user);
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/signup')
  // @UseInterceptors(SerializeInterceptor)
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    return this.authService.signup(username, password);
  }
}

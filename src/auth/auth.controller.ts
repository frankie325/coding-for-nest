import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { SigninUserDto } from './dto/signin-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // AuthGuard('local')将会使用Passport的本地策略进行验证
  // 如果验证成功，用户信息将会被注入到请求对象中
  // 如果验证失败，将会抛出401 Unauthorized异常
  // @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signin(@Body() dto: SigninUserDto, @Request() req) {
    console.log('🚀 ~ AuthController ~ signin ~ req.user:', req.user);
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @UseGuards(AuthGuard('jwt')) //user模块全局使用jwt守卫
  @Post('/signup')
  signup(@Body() dto: User) {
    const { username, password } = dto;
    return this.authService.signup(username, password);
  }
}

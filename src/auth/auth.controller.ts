import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(@Body() dto: User) {
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: User) {
    const { username, password } = dto;
    return this.authService.signup(username, password);
  }
}

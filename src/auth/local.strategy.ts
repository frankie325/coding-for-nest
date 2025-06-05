import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/*
passport本地策略：用于初始登录，需要在请求体中传递用户名和密码，验证成功后通常返回 JWT token

Local Strategy:
1.客户端发送用户名密码
2.验证用户名密码
3.生成 JWT token
4.返回 token 给客户端
*/

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    console.log('🚀 ~ LocalStrategy ~ validate ~ user:', user);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

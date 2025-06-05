import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /*
   signAsync 生成jwtWebToken
  
  使用@UseGuards(AuthGuard('jwt'))守卫 => 调用jwtStrategy => 验证前段请求头携带的jwt
  */
  async signin(username: string, password: string) {
    const user = await this.userService.find(username);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      // access_token: 'Bearer ' + (await this.jwtService.signAsync(payload)), 前端要记得加上 Bearer 前缀
    };
  }
  signup(username: string, password: string) {
    return 'signup';
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userService.find(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

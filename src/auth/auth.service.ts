import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import * as argon2 from 'argon2';
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

    // 如果用户不存在，抛出403 Forbidden异常
    // 这里可以根据实际需求修改异常信息
    // 比如可以抛出一个自定义的异常类，或者使用内置的HttpException类
    if (!user) {
      throw new ForbiddenException('用户不存在，请注册');
    }

    // 使用argon2验证密码
    const isPasswordValid = await argon2.verify(user.password, password);

    // 如果密码不正确，抛出403 Forbidden异常
    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或密码错误');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      // access_token: 'Bearer ' + (await this.jwtService.signAsync(payload)), 前端要记得加上 Bearer 前缀
    };
  }

  // 用户注册
  async signup(username: string, password: string) {
    // 检查用户名是否已存在
    const existingUser = await this.userService.find(username);
    if (existingUser) {
      throw new ForbiddenException('用户名已存在，请更换用户名');
    }
    // 对密码进行哈希处理
    password = await argon2.hash(password);
    const user = await this.userService.create({
      username,
      password,
    });
    return user;
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

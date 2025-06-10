import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../../config/enum';

/*
JWT Strategy:
1.客户端发送带 token 的请求
2.验证 token 有效性
3.解析 token 获取用户信息
4.允许访问受保护的资源

Local Strategy 用于登录时用户，密码的初始认证
而 JWT Strategy 用于后续的会话管理
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(protected configService: ConfigService) {
    const jwtSecret = configService.get<string>(ConfigEnum.JWT_SECRET);
    // console.log('🚀 ~ JwtStrategy ~ jwtSecret:', jwtSecret);

    super({
      // 从请求中提取 JWT 的方法
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret as string, // 使用秘钥进行签名验证
    });
  }
  // Passport 首先验证 JWT 的签名并解码 JSON 。然后调用我们的 validate() 方法
  validate(payload: { sub: string; username: string }) {
    // console.log('🚀 ~ JwtStrategy ~ payload:', payload);

    // Passport 将基于 validate() 方法的返回值构建一个user 对象，并将其作为属性附加到请求对象上
    return { id: payload.sub, username: payload.username };
  }
}

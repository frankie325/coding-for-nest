import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../../config/enum';
import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { CaslAbilityService } from './casl-ability.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    // 异步加载，从configService获取SECRET
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ConfigEnum.JWT_SECRET),
        signOptions: { expiresIn: '1d' }, // 设置JWT的过期时间为1天
      }),
      inject: [ConfigService],
    }),
  ], //引入UserModule，可以在AuthService中使用UserService
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CaslAbilityService],
  exports: [AuthService, CaslAbilityService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  // 如果没有配置ConfigModule为全局模块，则在其他模块中使用ConfigService时需要导入ConfigModule
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

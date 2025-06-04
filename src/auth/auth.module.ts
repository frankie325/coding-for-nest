import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule], //引入UserModule，可以在AuthService中使用UserService
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

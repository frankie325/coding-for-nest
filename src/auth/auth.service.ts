import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async signin(username: string, password: string) {
    return this.userService.find(username);
  }
  signup(username: string, password: string) {
    return 'signup';
  }
}

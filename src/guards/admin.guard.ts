import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

// 授权是守卫的一个很好的用例，因为只有当调用者(通常是经过身份验证的特定用户)具有足够的权限时，特定的路由才可用
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    // 2. 获取用户信息
    // 这里假设用户信息已经在请求对象中，通常是在身份验证守卫中设置的
    // console.log('🚀 ~ AdminGuard ~ canActivate ~ req.user:', req.user);
    // 3. 检查用户是否存在以及是否是管理员
    const user = await this.userService.findOne(req.user.id);
    const roles = user?.roles || [];
    const hasPermission = !!roles.find((role) => role.id === 1);
    return hasPermission;
  }
}

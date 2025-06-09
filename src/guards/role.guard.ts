import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserService } from '../user/user.service';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // this.reflector.getAllAndMerge //合并Controller和Handler（路由方法）上的权限元数据
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true; //如果没有设置权限，则默认允许访问

    const req = context.switchToHttp().getRequest<Request>();
    // jwt => user => roles
    const user = await this.userService.findOne(req.user.id);
    if (!user) {
      return false; //如果用户不存在，则拒绝访问
    }

    // 判断用户是否拥有路由所需的角色
    const roleIds = user.roles.map((role) => role.id);
    const flag = requiredRoles.some((role) => roleIds.includes(role));
    // console.log('flag', flag);
    return flag;
  }
}

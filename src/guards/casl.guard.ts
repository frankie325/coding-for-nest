import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityService } from '../auth/casl-ability.service';
import {
  CHECK_POLICIES_KEY,
  PolicyHandlerCallback,
} from '../decorators/casl.decorator';
import { Request } from 'express';

/*
CaslGuard守卫流程：

1.首先在Controller或者handler路由使用装饰器设置元数据，也就是handler回调方法
@CheckPolicies((ability) => ability.can(Action.Read, Logs))
@Can(Action.Update, Logs)
@Can(Action.Update, Logs)

2.调用forRoot，会根据用户信息查询所拥有的acl权限，通过casl库进行设置

3.调用handler回调，传入ability判断是否拥有权限

通过以上步骤即可达到精细的权限控制
*/
@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityService: CaslAbilityService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlers = this.reflector.getAllAndMerge<PolicyHandlerCallback[]>(
      CHECK_POLICIES_KEY.HANDLER,
      [context.getHandler(), context.getClass()],
    );
    const canHandlers = this.reflector.getAllAndMerge<PolicyHandlerCallback[]>(
      CHECK_POLICIES_KEY.CAN,
      [context.getHandler(), context.getClass()],
    );
    const cannotHandlers = this.reflector.getAllAndMerge<
      PolicyHandlerCallback[]
    >(CHECK_POLICIES_KEY.CANNOT, [context.getHandler(), context.getClass()]);

    // 判断：如果用户未设置上述的任何一个，那么就直接返回true
    if (!handlers || !canHandlers || !cannotHandlers) {
      return true;
    }
    const req = context.switchToHttp().getRequest<Request>();
    if (req.user) {
      // 调用forRoot，会根据用户信息查询所拥有的acl权限，通过casl库进行设置
      const ability = await this.caslAbilityService.forRoot(req.user.username);
      let flag = true;
      // 调用回调，判断权限
      if (handlers) {
        flag = flag && handlers.every((handler) => handler(ability));
      }

      if (flag && canHandlers) {
        flag = flag && canHandlers.every((handler) => handler(ability));
      }

      if (flag && cannotHandlers) {
        flag = flag && cannotHandlers.every((handler) => handler(ability));
      }
      return flag;
    }
    return false;
  }
}

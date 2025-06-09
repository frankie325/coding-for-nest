import { AnyMongoAbility, InferSubjects } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';
import { Action } from '../enums/action.enum';

export enum CHECK_POLICIES_KEY {
  HANDLER = 'CHECK_POLICIES_HANDLER',
  CAN = 'CHECK_POLICIES_CAN',
  CANNOT = 'CHECK_POLICIES_CANNOT',
}

export type PolicyHandlerCallback = (ability: AnyMongoAbility) => boolean;

// 下面的方法是为了在Controller或者路由方法上设置元数据，设置handler方法，最终会调用handler方法判断该路由有没有权限
export const CheckPolicies = (...handlers: PolicyHandlerCallback[]) =>
  SetMetadata(CHECK_POLICIES_KEY.HANDLER, handlers);

export const Can = (
  action: Action,
  subject: InferSubjects<any>,
  conditions?: any,
) =>
  SetMetadata(CHECK_POLICIES_KEY.CAN, (ability: AnyMongoAbility) =>
    ability.can(action, subject, conditions),
  );

export const Cannot = (
  action: Action,
  subject: InferSubjects<any>,
  conditions?: any,
) =>
  SetMetadata(CHECK_POLICIES_KEY.CANNOT, (ability: AnyMongoAbility) =>
    ability.cannot(action, subject, conditions),
  );

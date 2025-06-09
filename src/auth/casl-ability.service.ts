import { Injectable } from '@nestjs/common';
import { createMongoAbility, AbilityBuilder } from '@casl/ability';
import { UserService } from '../user/user.service';
import { getEntities } from '../utils/common';

/*
acl存储的其它思路：

acl也可以创建一个单独的表进行存储
*/
@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}
  // 名字自定义，针对于整个系统的权限
  async forRoot(username: string) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    // manage和all是casl内部的两个保留字段：表示允许访问所有资源
    // can('manage', 'all');
    const user = await this.userService.find(username);
    // user -> 1:n roles -> 1:n menus：实际需要去重
    user?.roles.forEach((role) => {
      role.menus.forEach((menu) => {
        const actions = menu.acl.split(',');
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          // casl库设置acl策略
          // acl策略create,update,delete,manage,read -> 实体
          can(action, getEntities(menu.path));
        }
      });
    });
    const ability = build({
      detectSubjectType: (object) => object.constructor.name,
    });

    return ability;
  }
}

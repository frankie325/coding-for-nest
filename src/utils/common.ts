import { Role } from '../roles/roles.entity';
import { Logs } from '../logs/logs.entity';
import { User } from '../user/user.entity';
import { Menu } from '../menus/menu.entity';

// 根据path映射为casl的subject
export const getEntities = (path: string) => {
  const map = {
    '/users': User,
    '/logs': Logs,
    '/roles': Role,
    '/menus': Menu,
    // '/auth': 'Auth',
  };

  for (let i = 0; i < Object.keys(map).length; i++) {
    const key = Object.keys(map)[i];
    if (path.startsWith(key)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return map[key];
    }
  }
};

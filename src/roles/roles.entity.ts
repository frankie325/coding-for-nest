import { Menu } from '../menus/menu.entity';
import { User } from '../user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'roles', // 数据库表名
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles, {
    cascade: true, // 如果设置为 true，则将插入相关对象并在数据库中更新
  })
  users: User[];

  @ManyToMany(() => Menu, (menu) => menu.roles, {
    cascade: true, // 如果设置为 true，则将插入相关对象并在数据库中更新
  })
  menus: Menu[]; // 这里的 Roles 可以替换为 Menu 实体，如果有菜单实体的话
}

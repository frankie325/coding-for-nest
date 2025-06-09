import { Role } from '../roles/roles.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'menus', //数据库表
})
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  order: number;

  //acl策略：CREATE, READ, UPDATE, DELETE
  @Column()
  acl: string;

  //一个role对应多个menu
  @ManyToMany(() => Role, (role) => role.menus)
  @JoinTable({
    name: 'roles_menus', // 连接表的名称
  })
  roles: Role[];
}

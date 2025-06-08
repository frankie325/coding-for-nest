import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  AfterRemove,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true }) //该字段保持唯一
  username: string;
  @Column()
  @Exclude() // 在序列化时排除该字段
  password: string;
  // 创建一对一的关系
  @OneToOne(() => Profile, {
    cascade: true, // 级联操作
  })
  @JoinColumn()
  profile: Profile;
  //  一对多的关系
  // 在第二个参数中指定反向关系
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  //  多对多关系
  @ManyToMany(() => Roles, (roles) => roles.users)
  // 必须使用@JoinTable()注解来创建连接表
  @JoinTable({
    name: 'user_roles', // 连接表的名称
  })
  roles: Roles[];

  // 监听器
  @AfterRemove()
  afterRemove() {
    console.log('删除用户成功');
  }
}

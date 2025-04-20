import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  path: string;
  @Column()
  method: string;
  @Column()
  data: string;
  @Column()
  result: number;
  // 一个用户对应多个日志
  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({
    name: 'user_id', // 外键字段名
    referencedColumnName: 'id', // 关联的主键字段名
  })
  user: User;
}

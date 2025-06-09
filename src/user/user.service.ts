import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { getUserDto } from './dto/get-user.dto';
import { conditionUtils } from '../utils/db.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll(query: getUserDto) {
    const { limit, page, username, gender } = query;
    const take = limit || 10;
    // SELECT * FROM user u LEFT JOIN profile p ON u.profileId = p.id;
    // SELECT * FROM user u LEFT JOIN user_roles ur ON u.id = ur.userId
    // SELECT u.id, u.username, r.name FROM user u LEFT JOIN user_roles ur ON u.id = ur.userId
    // LEFT JOIN roles r ON ur.rolesId = r.id
    // return this.userRepository.find({
    //   // 查询关联关系表
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     // 根据用户名查询
    //     username,
    //     // 根据性别查询
    //     profile: {
    //       gender,
    //     },
    //   },
    //   // 分页参数
    //   take,
    //   skip: (page - 1) * take,
    // });

    const queryBuilder = this.userRepository
      // 参数是表的别名
      .createQueryBuilder('user')
      // 第一个参数是您要加载的关联关系，第二个参数是您为该关联关系的表分配的别名
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');
    // 如果参数username不存在 where 1=1 表示条件肯定成立
    // .where(username ? 'user.username = :username' : '1=1', { username })

    // 下面两种写法是一个意思
    // .where('user.username = :username', { username });
    // .where('user.username = :user.username', { 'user.username': username });
    // .andWhere('profile.gender = :gender', { gender })
    return conditionUtils<User>(queryBuilder, {
      'user.username': username,
      'profile.gender': gender,
    })
      .take(take)
      .skip((page - 1) * take)
      .getMany();
    // return queryBuilder.getMany();
  }
  find(username: string) {
    // 根据用户名查询用户
    return this.userRepository.findOne({
      where: { username },
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true, // 查询用户的个人资料
        roles: true, // 查询用户的角色
      },
    });
  }

  async create(user: Partial<User>) {
    // 创建 User 的新实例
    const temp = this.userRepository.create(user);
    // 保存给定的实体或实体数组
    return this.userRepository.save(temp);
  }

  async update(id: number, user: Partial<User>) {
    console.log('🚀 ~ UserService ~ update ~ user:', user);
    // 更新用户信息，下面的更新方法只适合单模型的更新，不适合有关系的模型更新
    // return this.userRepository.update(id, user);

    // 合并更新数据
    const userTemp = await this.findProfile(id);
    const newUser = this.userRepository.merge(userTemp as User, user);
    // 级联更新，需要在实体类中添加cascade: true
    // 联合模型更新，需要使用save方法或者queryBuilder
    return this.userRepository.save(newUser);
  }

  async remove(id: number) {
    // 删除用户
    // return this.userRepository.delete(id);
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }
    return this.userRepository.remove(user);
  }

  findProfile(id: number) {
    // 查询用户的同时查询个人资料
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }

  findLogs(id: number): any {
    // 查询用户
    return this.logsRepository.find({
      where: {
        user: { id },
      },
      relations: {
        user: true,
      },
    });
  }

  findLogsByGroup(id: number): any {
    // 使用原生SQL查询
    // return this.logsRepository.query(
    //   `SELECT result, COUNT(result) as count from logs where user_id=${id} GROUP by result`,
    // );
    // 使用QueryBuilder查询
    return this.logsRepository
      .createQueryBuilder('logs')
      .select('result')
      .addSelect('COUNT(result) as count')
      .where('user_id = :id', { id }) //防止SQL注入
      .groupBy('result')
      .getRawMany();
  }
}

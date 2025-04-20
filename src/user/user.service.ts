import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Logs } from 'src/logs/logs.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll() {
    // 查询所有用户
    return this.userRepository.find();
  }
  find(username: string) {
    // 根据用户名查询用户
    return this.userRepository.findOne({
      where: { username },
    });
  }

  create(user: User) {
    // 创建 User 的新实例
    const temp = this.userRepository.create(user);
    // 保存给定的实体或实体数组
    return this.userRepository.save(temp);
  }

  update(id: number, user: Partial<User>) {
    // 更新用户信息
    return this.userRepository.update(id, user);
  }

  remove(id: number) {
    // 删除用户
    return this.userRepository.delete(id);
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
